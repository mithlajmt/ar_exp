import React from 'react';

interface UIOverlayProps {
  onStart: () => void;
  isStarted: boolean;
  isTargetFound: boolean;
  isModalOpen: boolean;
  closeModal: () => void;
}

export default function UIOverlay({
  onStart,
  isStarted,
  isTargetFound,
  isModalOpen,
  closeModal,
}: UIOverlayProps) {
  if (!isStarted) {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
        <div className="text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-widest text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
            BLUEPRINT ASSEMBLER
          </h1>
          <button
            onClick={onStart}
            className="group relative rounded-md border border-cyan-500 bg-cyan-900/30 px-8 py-3 text-lg font-medium text-cyan-300 transition-all hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_20px_rgba(34,211,238,1)]"
          >
            <span className="relative z-10">Initialize Systems</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-40 flex flex-col items-center justify-between p-6">
      {/* HUD Header */}
      <div className="w-full max-w-md rounded-b-xl border-b border-x border-cyan-500/30 bg-black/40 p-4 text-center backdrop-blur-sm">
        <h2 className="text-xl font-bold tracking-wider text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.6)]">
          AR SCANNER ACTIVE
        </h2>
      </div>

      {/* Scanning Indicator */}
      {!isTargetFound && !isModalOpen && (
        <div className="flex animate-pulse flex-col items-center gap-4 mt-20">
          <div className="h-32 w-32 rounded-lg border-2 border-dashed border-cyan-400 opacity-70 flex items-center justify-center relative">
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400 -mt-2 -ml-2"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400 -mt-2 -mr-2"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400 -mb-2 -ml-2"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400 -mb-2 -mr-2"></div>
          </div>
          <p className="text-lg font-semibold tracking-wide text-cyan-300 drop-shadow-md">
            Point at Blueprint...
          </p>
        </div>
      )}

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="pointer-events-auto absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-xl border border-cyan-500 bg-slate-900/90 p-6 shadow-[0_0_30px_rgba(34,211,238,0.3)] backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between border-b border-cyan-500/50 pb-2">
              <h3 className="text-xl font-bold text-cyan-400 uppercase tracking-wider">Robuverse X-1</h3>
              <button
                onClick={closeModal}
                className="text-cyan-600 hover:text-cyan-300 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4 text-cyan-100">
              <p className="text-sm leading-relaxed">
                <strong className="text-cyan-300">System:</strong> Precision Servo System
              </p>
              <p className="text-sm leading-relaxed">
                <strong className="text-cyan-300">Material:</strong> Carbon-Fiber Chassis
              </p>
              <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-cyan-900">
                <div className="h-full w-3/4 animate-pulse bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
              </div>
              <p className="text-right text-xs text-cyan-500 tracking-widest mt-2">DIAGNOSTICS: OPTIMAL</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer decorative element */}
      <div className="h-1 w-1/3 mt-auto rounded-full bg-cyan-500/50 shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
    </div>
  );
}
