'use client';

import React, { useEffect, useRef } from 'react';

interface ARViewerProps {
  onTargetFound: () => void;
  onTargetLost: () => void;
  onModelClick: () => void;
}

export default function ARViewer({ onTargetFound, onTargetLost, onModelClick }: ARViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const callbacksRef = useRef({ onTargetFound, onTargetLost, onModelClick });

  // Update refs so A-Frame handlers always call the latest props
  useEffect(() => {
    callbacksRef.current = { onTargetFound, onTargetLost, onModelClick };
  }, [onTargetFound, onTargetLost, onModelClick]);

  useEffect(() => {
    // Dynamically load A-Frame and MindAR only on client-side
    const loadAR = async () => {
      // Load A-Frame
      if (!(window as any).AFRAME) {
        await new Promise<void>((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://aframe.io/releases/1.4.2/aframe.min.js';
          script.onload = () => resolve();
          document.head.appendChild(script);
        });
      }

      // Load MindAR A-Frame extension
      if (!(window as any).MINDAR) {
        await new Promise<void>((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js';
          script.onload = () => resolve();
          document.head.appendChild(script);
        });
      }

      const AFRAME = (window as any).AFRAME;

      // Register custom components only once
      if (AFRAME && !AFRAME.components['target-events']) {
        AFRAME.registerComponent('target-events', {
          init: function () {
            this.el.addEventListener('targetFound', () => {
              callbacksRef.current.onTargetFound();
              // Trigger animation manually
              const model = document.querySelector('#robotModel');
              if (model) {
                 model.setAttribute('animation', 'property: position; to: 0 0 0; dur: 1500; easing: easeOutElastic; loop: false');
              }
            });
            this.el.addEventListener('targetLost', () => {
              callbacksRef.current.onTargetLost();
              const model = document.querySelector('#robotModel');
              if (model) {
                 model.setAttribute('position', '0 -2 0');
                 model.removeAttribute('animation');
              }
            });
          }
        });
      }

      if (AFRAME && !AFRAME.components['click-listener']) {
        AFRAME.registerComponent('click-listener', {
          init: function () {
            this.el.addEventListener('click', () => {
              callbacksRef.current.onModelClick();
            });
          }
        });
      }

      // Mount the A-Frame Scene
      if (containerRef.current) {
        // Use dangerouslySetInnerHTML pattern or direct innerHTML injection
        // Using innerHTML prevents React from attempting to manage A-Frame's DOM
        containerRef.current.innerHTML = `
          <a-scene mindar-image="imageTargetSrc: /targets.mind; autoStart: true; uiScanning: no; uiLoading: no;" color-space="sRGB" renderer="colorManagement: true, physicallyCorrectLights" vr-mode-ui="enabled: false" device-orientation-permission-ui="enabled: false">
            <a-assets>
              <a-asset-item id="robot" src="/robot.glb"></a-asset-item>
            </a-assets>

            <a-camera position="0 0 0" look-controls="enabled: false" cursor="fuse: false; rayOrigin: mouse;" raycaster="objects: .clickable"></a-camera>

            <!-- Tech-noir lighting -->
            <a-entity light="type: ambient; color: #112233"></a-entity>
            <a-entity light="type: directional; color: #00ffff; intensity: 1" position="-1 1 1"></a-entity>
            <a-entity light="type: point; color: #00ffff; intensity: 2; distance: 10" position="0 2 0"></a-entity>

            <a-entity mindar-image-target="targetIndex: 0" target-events>
              <!-- 
                Using a transparent box as a clickable proxy might be necessary if 
                the robot.glb mesh is too complex for fast raycasting.
                But here we'll try attaching it directly to the model first. 
              -->
              <a-gltf-model 
                id="robotModel"
                class="clickable"
                src="#robot" 
                position="0 -2 0" 
                scale="0.5 0.5 0.5" 
                click-listener
              >
              </a-gltf-model>
            </a-entity>
          </a-scene>
        `;
      }
    };

    loadAR();

    return () => {
      // Cleanup if needed
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []); // Run once on mount

  return <div ref={containerRef} className="absolute inset-0 z-0 h-full w-full" />;
}
