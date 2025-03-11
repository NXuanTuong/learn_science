import React, { useEffect, useRef } from "react";

const ScientificDiscovery = () => {
  const playersRef = useRef([]);

  useEffect(() => {
    // Load YouTube Iframe API script
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // YouTube API Ready callback
    window.onYouTubeIframeAPIReady = () => {
      createPlayer("player1", "I7QoYytoGjs");
      createPlayer("player2", "_6ldAxcvqqQ");
      createPlayer("player3", "HE5NRHhcq5w");
    };

    return () => {
      // Clean up: remove players
      playersRef.current.forEach((player) => player.destroy());
      delete window.onYouTubeIframeAPIReady;
    };
  }, []);

  const createPlayer = (elementId, videoId) => {
    const player = new window.YT.Player(elementId, {
      height: "100%",
      width: "100%",
      videoId: videoId,
      events: {
        onStateChange: onPlayerStateChange,
      },
    });
    playersRef.current.push(player);
  };

  const onPlayerStateChange = (event) => {
    if (event.data === window.YT.PlayerState.PLAYING) {
      playersRef.current.forEach((player) => {
        if (player !== event.target) {
          player.pauseVideo();
        }
      });
    }
  };

  return (
    <>
      <div className="w-4/5 flex gap-5 justify-center items-center flex-wrap">
        {/* Player 1 */}
        <div className="w-1/3 aspect-[16/9] rounded-xl flex">
          <div
            id="player1"
            className="w-full h-full rounded-xl overflow-hidden"
          ></div>
        </div>

        {/* Player 2 */}
        <div className="w-1/3 aspect-[16/9] rounded-xl flex">
          <div
            id="player2"
            className="w-full h-full rounded-xl overflow-hidden"
          ></div>
        </div>

        {/* Player 3 */}
        <div className="w-1/3 aspect-[16/9] rounded-xl flex">
          <div
            id="player3"
            className="w-full h-full rounded-xl overflow-hidden"
          ></div>
        </div>
      </div>
    </>
  );
};

export default ScientificDiscovery;
