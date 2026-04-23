'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import UIOverlay from '../components/UIOverlay';

// Dynamically import the AR Viewer with SSR disabled
const ARViewer = dynamic(() => import('../components/ARViewer'), { ssr: false });

export default function BlueprintAssembler() {
  const [isStarted, setIsStarted] = useState(false);
  const [isTargetFound, setIsTargetFound] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStart = () => setIsStarted(true);
  const handleTargetFound = () => setIsTargetFound(true);
  const handleTargetLost = () => setIsTargetFound(false);
  
  const handleModelClick = () => {
    // Standard React state change for modal
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black font-sans text-white">
      {/* HUD UI Layer */}
      <UIOverlay
        onStart={handleStart}
        isStarted={isStarted}
        isTargetFound={isTargetFound}
        isModalOpen={isModalOpen}
        closeModal={closeModal}
      />

      {/* AR View Layer */}
      {isStarted && (
        <ARViewer
          onTargetFound={handleTargetFound}
          onTargetLost={handleTargetLost}
          onModelClick={handleModelClick}
        />
      )}
    </main>
  );
}
