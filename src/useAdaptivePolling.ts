import { useEffect } from "react";

export default function useAdaptivePolling(
  gameid: string,
  currentTurn: number,
  isMyTurn: boolean,
  onUpdate: () => void,
) {
  useEffect(() => {
    let pollDelay: number | null = 1200;
  
    // Doesn't poll if it's our turn
    if (isMyTurn) {
      console.log("[Polling] Sleeping... It is your turn.");
      pollDelay = null;
    }

    if (pollDelay === null) return;

    console.log(
      `[Polling] Started. Checking every ${pollDelay}ms for Turn > ${currentTurn}`,
    );

    const pollServer = async () => {
      // If the user minimized the tab, don't ping the server
      if (document.visibilityState !== "visible") return;

      try {
        console.log(`[Polling] Ping -> /api/poll/${gameid}/${currentTurn}`);
        const res = await fetch(
          `/api/poll/${gameid}/${currentTurn}`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        // Indicates that a refresh of the data is needed
        if (res.status === 200) {
          onUpdate();
        } else if (res.status === 304) {
          console.log("🟡 [Polling] 304 Not Modified: Still waiting...");
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    };

    //Fire instantly once, then start the loop
    pollServer();
    const intervalId = setInterval(pollServer, pollDelay);

    return () => {
      console.log("[Polling] Stopped interval cleanup.");
      clearInterval(intervalId);
    };
  }, [gameid, currentTurn, isMyTurn]);
}
