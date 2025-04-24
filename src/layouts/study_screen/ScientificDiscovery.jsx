import React, { useRef, useEffect } from "react";

const VideoPlayer = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    return () => {
      // Tự động dừng video khi rời khỏi component
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };
  }, []);

  return (
    <div className="w-2/3 mx-auto my-10">
      <video
        ref={videoRef}
        controls
        width="100%"
        className="rounded-xl shadow-lg"
      >
        <source src="/videos/THỦ LÚP QUANG HỢP.mp4" type="video/mp4" />
        Trình duyệt của bạn không hỗ trợ video.
      </video>
    </div>
  );
};

export default VideoPlayer;
