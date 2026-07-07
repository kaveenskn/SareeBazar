"use client";

import { useState, useEffect, useCallback } from "react";
import { isLoggedIn as checkAuth } from "@/lib/authStore";

/**
 * useAuthGate — lightweight hook that tracks auth state and provides
 * a `requireAuth()` helper.  When a guest invokes a gated action,
 * `requireAuth` returns `false` and opens the AuthGate modal.
 *
 * Usage:
 *   const { isLoggedIn, requireAuth, showGate, dismissGate, gateAction } = useAuthGate();
 *
 *   // Guard an action
 *   function handleLike() {
 *     if (!requireAuth("like posts")) return;
 *     // … do the thing
 *   }
 */

export function useAuthGate() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showGate, setShowGate] = useState(false);
  const [gateAction, setGateAction] = useState<string | undefined>(undefined);

  // Sync with auth on mount + listen for changes
  useEffect(() => {
    const sync = () => setLoggedIn(checkAuth());
    sync();
    window.addEventListener("auth-updated", sync);
    return () => window.removeEventListener("auth-updated", sync);
  }, []);

  /**
   * Call before any gated action.
   * Returns `true` if user is authenticated (proceed with action).
   * Returns `false` and opens the gate modal if not.
   */
  const requireAuth = useCallback(
    (action?: string): boolean => {
      if (checkAuth()) return true;
      setGateAction(action);
      setShowGate(true);
      return false;
    },
    []
  );

  const dismissGate = useCallback(() => {
    setShowGate(false);
    setGateAction(undefined);
  }, []);

  return {
    isLoggedIn: loggedIn,
    requireAuth,
    showGate,
    dismissGate,
    gateAction,
  };
}
