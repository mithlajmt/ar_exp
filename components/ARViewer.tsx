'use client';

import React, { useEffect, useRef } from 'react';

interface ARViewerProps {
  onARReady: () => void;
  onARError: (message: string) => void;
  onTargetFound: () => void;
  onTargetLost: () => void;
  onModelClick: () => void;
}

declare global {
  interface Window {
    AFRAME?: {
      components: Record<string, unknown>;
      registerComponent: (name: string, definition: Record<string, unknown>) => void;
    };
    MINDAR?: unknown;
  }
}

type AFrameComponentContext = {
  el: HTMLElement & {
    getObject3D?: (name: string) => {
      traverse: (
        callback: (node: { isMesh?: boolean; castShadow?: boolean; receiveShadow?: boolean }) => void,
      ) => void;
    } | null;
  };
};

function loadScriptOnce(src: string) {
  return new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);

    if (existingScript) {
      if (existingScript.dataset.loaded === 'true') {
        resolve();
        return;
      }

      existingScript.addEventListener('load', () => resolve(), { once: true });
      existingScript.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => {
      script.dataset.loaded = 'true';
      resolve();
    };
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}

export default function ARViewer({
  onARReady,
  onARError,
  onTargetFound,
  onTargetLost,
  onModelClick,
}: ARViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const callbacksRef = useRef({
    onARReady,
    onARError,
    onTargetFound,
    onTargetLost,
    onModelClick,
  });

  useEffect(() => {
    callbacksRef.current = {
      onARReady,
      onARError,
      onTargetFound,
      onTargetLost,
      onModelClick,
    };
  }, [onARReady, onARError, onTargetFound, onTargetLost, onModelClick]);

  useEffect(() => {
    let disposed = false;

    const registerComponents = () => {
      const AFRAME = window.AFRAME;

      if (!AFRAME) {
        throw new Error('A-Frame failed to initialize.');
      }

      if (!AFRAME.components['target-events']) {
        AFRAME.registerComponent('target-events', {
          init: function init(this: AFrameComponentContext) {
            const robot = document.querySelector<HTMLElement>('#robotModel');
            const shell = document.querySelector<HTMLElement>('#robotShell');

            this.el.addEventListener('targetFound', () => {
              callbacksRef.current.onTargetFound();

              if (robot) {
                robot.setAttribute('visible', 'true');
                robot.removeAttribute('animation__settle');
                robot.removeAttribute('animation__tilt');
                robot.setAttribute(
                  'animation__settle',
                  'property: scale; from: 0.001 0.001 0.001; to: 0.42 0.42 0.42; dur: 420; easing: easeOutCubic',
                );
                robot.setAttribute(
                  'animation__tilt',
                  'property: rotation; from: -8 0 0; to: 0 0 0; dur: 420; easing: easeOutCubic',
                );
              }

              if (shell) {
                shell.removeAttribute('animation__fade');
                shell.setAttribute(
                  'animation__fade',
                  'property: material.opacity; from: 0; to: 0.24; dur: 320; easing: easeOutQuad',
                );
              }
            });

            this.el.addEventListener('targetLost', () => {
              callbacksRef.current.onTargetLost();

              if (robot) {
                robot.setAttribute('visible', 'false');
                robot.removeAttribute('animation__settle');
                robot.removeAttribute('animation__tilt');
              }

              if (shell) {
                shell.removeAttribute('animation__fade');
                shell.setAttribute(
                  'animation__fade',
                  'property: material.opacity; from: 0.24; to: 0; dur: 180; easing: easeOutQuad',
                );
              }
            });
          },
        });
      }

      if (!AFRAME.components['click-listener']) {
        AFRAME.registerComponent('click-listener', {
          init: function init(this: AFrameComponentContext) {
            this.el.addEventListener('click', () => {
              callbacksRef.current.onModelClick();
            });
          },
        });
      }

      if (!AFRAME.components['robot-finish']) {
        AFRAME.registerComponent('robot-finish', {
          init: function init(this: AFrameComponentContext) {
            this.el.addEventListener('model-loaded', () => {
              const mesh = this.el.getObject3D?.('mesh');

              if (!mesh) {
                return;
              }

              mesh.traverse((node: { isMesh?: boolean; castShadow?: boolean; receiveShadow?: boolean }) => {
                if (!node.isMesh) {
                  return;
                }

                node.castShadow = true;
                node.receiveShadow = true;
              });
            });
          },
        });
      }
    };

    const mountScene = async () => {
      try {
        await loadScriptOnce('https://aframe.io/releases/1.4.2/aframe.min.js');
        await loadScriptOnce('https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js');

        if (disposed) {
          return;
        }

        registerComponents();

        if (!containerRef.current) {
          return;
        }

        containerRef.current.innerHTML = `
          <a-scene
            embedded
            loading-screen="enabled: false"
            mindar-image="imageTargetSrc: /targets.mind; autoStart: true; uiScanning: no; uiLoading: no; uiError: no; filterMinCF: 0.0001; filterBeta: 1000; warmupTolerance: 8; missTolerance: 10;"
            color-space="sRGB"
            renderer="colorManagement: true; physicallyCorrectLights: true; antialias: true; alpha: true"
            vr-mode-ui="enabled: false"
            device-orientation-permission-ui="enabled: false"
          >
            <a-assets timeout="15000">
              <a-asset-item id="robot" src="/robot.glb"></a-asset-item>
            </a-assets>

            <a-camera
              position="0 0 0"
              look-controls="enabled: false"
              cursor="fuse: false; rayOrigin: mouse;"
              raycaster="objects: .clickable"
            ></a-camera>

            <a-entity light="type: ambient; intensity: 0.8; color: #7dd3fc"></a-entity>
            <a-entity light="type: hemisphere; intensity: 0.75; color: #d9f7ff; groundColor: #08121c"></a-entity>
            <a-entity light="type: directional; intensity: 1.35; color: #f8fdff" position="0.3 1.8 1.1"></a-entity>
            <a-entity light="type: directional; intensity: 0.85; color: #38bdf8" position="-1.2 1.2 0.6"></a-entity>

            <a-entity mindar-image-target="targetIndex: 0" target-events>
              <a-ring
                id="robotShell"
                position="0 0 0.01"
                rotation="-90 0 0"
                radius-inner="0.48"
                radius-outer="0.62"
                color="#67e8f9"
                material="shader: flat; transparent: true; opacity: 0"
              ></a-ring>

              <a-gltf-model
                id="robotModel"
                class="clickable"
                src="#robot"
                position="0 -0.06 0.1"
                rotation="0 0 0"
                scale="0.42 0.42 0.42"
                visible="false"
                click-listener
                robot-finish
              ></a-gltf-model>
            </a-entity>
          </a-scene>
        `;

        const scene = containerRef.current.querySelector('a-scene');

        if (!scene) {
          throw new Error('Unable to create AR scene.');
        }

        scene.addEventListener(
          'arReady',
          () => {
            callbacksRef.current.onARReady();
          },
          { once: true },
        );

        scene.addEventListener(
          'arError',
          () => {
            callbacksRef.current.onARError('Camera access failed or AR session could not start.');
          },
          { once: true },
        );
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unable to start AR.';
        callbacksRef.current.onARError(message);
      }
    };

    mountScene();

    return () => {
      disposed = true;

      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 h-full w-full bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.08),_transparent_45%)]"
    />
  );
}
