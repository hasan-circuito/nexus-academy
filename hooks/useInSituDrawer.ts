// hooks/useInSituDrawer.ts
// NEXUS Academy — Global In-Situ Slide-over Drawer State
'use client';

import { useState, useEffect, useCallback } from 'react';

interface InSituDrawerState {
  isOpen: boolean;
  activeTermId: string | null;
}

let globalState: InSituDrawerState = {
  isOpen: false,
  activeTermId: null,
};

const listeners = new Set<(state: InSituDrawerState) => void>();

function notify() {
  listeners.forEach((listener) => listener(globalState));
}

export function openConcept(termId: string) {
  globalState = {
    isOpen: true,
    activeTermId: termId,
  };
  notify();
}

export function closeConceptDrawer() {
  globalState = {
    ...globalState,
    isOpen: false,
  };
  notify();
}

export function useInSituDrawer() {
  const [state, setState] = useState<InSituDrawerState>(globalState);

  useEffect(() => {
    listeners.add(setState);
    return () => {
      listeners.delete(setState);
    };
  }, []);

  const open = useCallback((termId: string) => {
    openConcept(termId);
  }, []);

  const close = useCallback(() => {
    closeConceptDrawer();
  }, []);

  return {
    isOpen: state.isOpen,
    activeTermId: state.activeTermId,
    openConcept: open,
    closeDrawer: close,
  };
}
