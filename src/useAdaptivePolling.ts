import { useEffect, useRef, useState, useCallback } from "react";

export default function useAdaptivePolling(
  gameid: string,
  currentTurn: number,
  isMyTurn: boolean,
  victoryStatus: -1 | 0 | 1,
  onUpdate: () => void,
) {
  const [isPaused, setIsPaused] = useState(false);
  const [currentInterval, setCurrentInterval] = useState<number>(500);
  
  const onUpdateRef = useRef(onUpdate);
  
  // Keep onUpdate fresh without triggering effect re-runs
  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  // Automatically unpause and reset interval when the turn changes
  useEffect(() => {
    setIsPaused(false);
    setCurrentInterval(500);
  }, [currentTurn]);

  useEffect(() => {
    // Break early if we shouldn't be polling
    if (isMyTurn || victoryStatus !== 0 || isPaused) {
      return;
    }

    let timerId: ReturnType<typeof setTimeout>;
    let isCancelled = false;

    const startTime = Date.now();
    const PAUSE_THRESHOLD_MS = 180000; // 3 minutes

    const pollServer = async () => {
      // Component unmounted, safe to kill loop
      if (isCancelled) return; 

      const elapsed = Date.now() - startTime;

      // Guard Clause 1: Kill the loop if we hit the 3-minute mark
      if (elapsed >= PAUSE_THRESHOLD_MS) {
        setIsPaused(true);
        return; 
      }

      // Guard Clause 2: Only fetch if the user is looking at the tab
      const isVisible = document.visibilityState === "visible";
      
      if (isVisible) {
        try {
          const res = await fetch(`/api/poll/${gameid}/${currentTurn}`, {
            method: "GET",
            credentials: "include",
          });
          console.log(`Polling attempt for game ${gameid} at turn ${currentTurn}:`, res.status);
          if (isCancelled) return;

          if (res.status === 200) {
            onUpdateRef.current();
            return; // Successfully got new data, kill this loop!
          }
        } catch (error) {
          // If the network drops temporarily, we swallow the error 
          // so the loop stays alive and tries again on the next tick.
          console.error("Polling error:", error);
        }
      }

      // Calculate the next step delay (Linear backoff: +500ms every 15s)
      const stepCount = Math.floor(elapsed / 15000);
      const nextDelay = 500 * (stepCount + 1);

      // Update UI and keep the loop alive
      setCurrentInterval(nextDelay);
      timerId = setTimeout(pollServer, nextDelay);
    };

    // Fire instantly once, then start the recursive loop
    pollServer();

    // Cleanup when component unmounts or dependencies change
    return () => {
      isCancelled = true;
      clearTimeout(timerId);
    };
  }, [gameid, currentTurn, isMyTurn, victoryStatus, isPaused]);

  // Allow the UI to manually restart polling
  const resumePolling = useCallback(() => {
    setIsPaused(false);
    setCurrentInterval(500);
  }, []);

  return { isPaused, currentInterval, resumePolling };
}