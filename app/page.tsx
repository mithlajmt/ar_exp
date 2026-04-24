'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import UIOverlay from '../components/UIOverlay';

const ARViewer = dynamic(() => import('../components/ARViewer'), { ssr: false });

export default function BlueprintAssembler() {
  const [isStarted, setIsStarted] = useState(false);
  const [isARReady, setIsARReady] = useState(false);
  const [arError, setARError] = useState<string | null>(null);
  const [isTargetFound, setIsTargetFound] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStart = () => {
    setARError(null);
    setIsARReady(false);
    setIsTargetFound(false);
    setIsStarted(true);
  };

  const handleARReady = () => {
    setARError(null);
    setIsARReady(true);
  };

  const handleARError = (message: string) => {
    setARError(message);
    setIsARReady(false);
    setIsTargetFound(false);
  };

  const handleTargetFound = () => setIsTargetFound(true);
  const handleTargetLost = () => {
    setIsTargetFound(false);
    setIsModalOpen(false);
  };

  const handleModelClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#020617] text-white">
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,_rgba(103,232,249,0.15),_transparent_38%),linear-gradient(180deg,_rgba(2,6,23,0.65)_0%,_rgba(2,6,23,0.92)_100%)]" />

      <UIOverlay
        onStart={handleStart}
        isStarted={isStarted}
        isARReady={isARReady}
        isTargetFound={isTargetFound}
        isModalOpen={isModalOpen}
        arError={arError}
        closeModal={closeModal}
      />

      {isStarted && !arError && (
        <ARViewer
          onARReady={handleARReady}
          onARError={handleARError}
          onTargetFound={handleTargetFound}
          onTargetLost={handleTargetLost}
          onModelClick={handleModelClick}
        />
      )}
    </main>
  );
}
