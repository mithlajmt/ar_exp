import React from 'react';

interface UIOverlayProps {
  onStart: () => void;
  isStarted: boolean;
  isARReady: boolean;
  isTargetFound: boolean;
  isModalOpen: boolean;
  arError: string | null;
  closeModal: () => void;
}

const statusCopy = {
  booting: {
    title: 'Calibrating Camera',
    description: 'Preparing the AR session and locking the tracking pipeline.',
  },
  scanning: {
    title: 'Searching For Marker',
    description: 'Hold the target flat in frame and let the tracker settle for a second.',
  },
  locked: {
    title: 'Target Locked',
    description: 'Move slowly around the marker to inspect the robot from different angles.',
  },
} as const;

export default function UIOverlay({
  onStart,
  isStarted,
  isARReady,
  isTargetFound,
  isModalOpen,
  arError,
  closeModal,
}: UIOverlayProps) {
  if (!isStarted) {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-[linear-gradient(180deg,_rgba(2,6,23,0.86),_rgba(2,6,23,0.96))] px-6 backdrop-blur-xl">
        <div className="w-full max-w-2xl rounded-[2rem] border border-cyan-400/20 bg-slate-950/70 p-8 shadow-[0_30px_120px_rgba(14,116,144,0.35)]">
          <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.35em] text-cyan-200">
            Precision WebAR
          </div>
          <h1 className="max-w-xl text-5xl font-semibold tracking-[-0.04em] text-white sm:text-6xl">
            Blueprint Assembler
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
            A polished image-tracked AR viewer that anchors a robot directly on your marker with a steadier lock,
            cleaner onboarding, and a more believable presentation.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-300">
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Single target tracking</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Stabilized placement</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Touch inspection</span>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <button
              onClick={onStart}
              className="rounded-full bg-cyan-300 px-7 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-slate-950 transition-transform duration-200 hover:scale-[1.02] hover:bg-cyan-200"
            >
              Launch AR
            </button>
            <p className="text-sm text-slate-400">Best results: bright light, sharp printed marker, minimal glare.</p>
          </div>
        </div>
      </div>
    );
  }

  if (arError) {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/85 px-6 backdrop-blur-md">
        <div className="w-full max-w-lg rounded-[1.75rem] border border-rose-400/25 bg-slate-950/90 p-7 shadow-[0_30px_100px_rgba(127,29,29,0.35)]">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-rose-300">Session Error</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-white">AR could not start cleanly</h2>
          <p className="mt-4 text-sm leading-7 text-slate-300">{arError}</p>
          <p className="mt-2 text-sm leading-7 text-slate-400">
            Allow camera access, reload the page, and try again in a brighter environment.
          </p>
          <button
            onClick={onStart}
            className="mt-8 rounded-full border border-rose-300/30 bg-rose-300/10 px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-rose-100 transition-colors hover:bg-rose-300/20"
          >
            Retry Session
          </button>
        </div>
      </div>
    );
  }

  const status = !isARReady
    ? statusCopy.booting
    : isTargetFound
      ? statusCopy.locked
      : statusCopy.scanning;

  return (
    <div className="pointer-events-none absolute inset-0 z-40 flex flex-col justify-between p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-[1.4rem] border border-cyan-400/15 bg-slate-950/55 px-5 py-4 backdrop-blur-md">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-cyan-200/80">Blueprint Assembler</p>
          <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-white">{status.title}</h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-300">{status.description}</p>
        </div>

        <div className="rounded-full border border-white/10 bg-black/35 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.3em] text-slate-200 backdrop-blur-md">
          {isTargetFound ? 'Stable Lock' : isARReady ? 'Tracker Live' : 'Initializing'}
        </div>
      </div>

      {!isTargetFound && (
        <div className="self-center">
          <div className="relative flex h-56 w-56 items-center justify-center rounded-[2rem] border border-cyan-300/20 bg-cyan-300/5 backdrop-blur-sm">
            <div className="absolute inset-4 rounded-[1.6rem] border border-dashed border-cyan-300/50" />
            <div className="absolute left-5 top-5 h-6 w-6 border-l-2 border-t-2 border-cyan-200" />
            <div className="absolute right-5 top-5 h-6 w-6 border-r-2 border-t-2 border-cyan-200" />
            <div className="absolute bottom-5 left-5 h-6 w-6 border-b-2 border-l-2 border-cyan-200" />
            <div className="absolute bottom-5 right-5 h-6 w-6 border-b-2 border-r-2 border-cyan-200" />
            <div className="h-28 w-28 rounded-full border border-cyan-200/20 bg-cyan-200/5 shadow-[0_0_60px_rgba(103,232,249,0.2)]" />
            <div className="absolute h-px w-40 animate-pulse bg-gradient-to-r from-transparent via-cyan-200 to-transparent" />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="rounded-[1.4rem] border border-white/10 bg-black/35 px-5 py-4 backdrop-blur-md">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-400">Tracking Notes</p>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-200">
            Keep the marker fully visible, avoid sudden camera movement, and let the lock breathe before tapping the
            model.
          </p>
        </div>

        <div className="rounded-[1.4rem] border border-cyan-400/15 bg-slate-950/45 px-5 py-4 backdrop-blur-md">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-400">Interaction</p>
          <p className="mt-2 text-sm leading-6 text-slate-200">
            {isTargetFound ? 'Tap the robot to inspect its systems panel.' : 'Inspection unlocks once the target is found.'}
          </p>
        </div>
      </div>

      {isModalOpen && (
        <div className="pointer-events-auto absolute inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xl">
          <div className="w-full max-w-md rounded-[1.9rem] border border-cyan-400/20 bg-slate-950/90 p-6 shadow-[0_35px_140px_rgba(8,145,178,0.28)]">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-cyan-200/75">Inspection Panel</p>
                <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white">Robuverse X-1</h3>
              </div>
              <button
                onClick={closeModal}
                className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mt-5 grid gap-4 text-sm text-slate-200">
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">Stability Profile</p>
                <p className="mt-2 leading-6 text-slate-200">OneEuro-filtered image tracking tuned for steadier lock and cleaner reacquisition.</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">Chassis</p>
                <p className="mt-2 leading-6 text-slate-200">Carbon-frame utility shell with balanced front lighting for stronger depth cues.</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
                  <span>Field Integrity</span>
                  <span className="text-cyan-200">92%</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-cyan-950/80">
                  <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-cyan-400 to-sky-200 shadow-[0_0_18px_rgba(103,232,249,0.55)]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
