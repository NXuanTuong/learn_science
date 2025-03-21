import React, { useEffect, useRef } from "react";

const ScientificDiscovery = () => {
  const playersRef = useRef([]);

  useEffect(() => {
    const loadYouTubeAPI = () => {
      if (window.YT && window.YT.Player) {
        // API đã sẵn sàng → tạo player ngay
        initPlayers();
      } else {
        // Chưa có API → gán callback khi API sẵn sàng
        window.onYouTubeIframeAPIReady = () => {
          initPlayers();
        };
      }
    };

    // Kiểm tra xem script API đã được thêm chưa
    if (!document.getElementById("youtube-iframe-api")) {
      const tag = document.createElement("script");
      tag.id = "youtube-iframe-api";
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    // Gọi hàm kiểm tra và khởi tạo
    loadYouTubeAPI();

    // Cleanup khi unmount component
    return () => {
      // Hủy tất cả players đã tạo
      playersRef.current.forEach((player) => player.destroy());
      playersRef.current = [];
      // KHÔNG xóa window.onYouTubeIframeAPIReady để khi quay lại còn dùng
    };
  }, []);

  // Hàm tạo tất cả players
  const initPlayers = () => {
    createPlayer("player1", "I7QoYytoGjs");
    createPlayer("player2", "_6ldAxcvqqQ");
    createPlayer("player3", "HE5NRHhcq5w");
  };

  // Hàm tạo 1 player
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

  // Hàm xử lý khi player play/pause
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
