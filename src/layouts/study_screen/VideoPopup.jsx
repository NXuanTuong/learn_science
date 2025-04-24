import React, { useEffect, useRef, useState } from "react";

const VideoPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const isViewed = localStorage.getItem("video_popup_viewed");
    if (!isViewed) {
      setShowPopup(true);
    }
  }, []);

  const handleClose = () => {
    setShowPopup(false);
    localStorage.setItem("video_popup_viewed", "true");
    // Optional: stop video
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <>
      {showPopup && (
        <div className="fixed inset-0 backdrop-blur-sm z-[1100] transition-opacity duration-300 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg w-5/4 max-w-4xl relative">
            {/* Nút đóng popup */}
            <button
              onClick={handleClose}
              className="absolute cursor-pointer top-2 right-2 z-[1200] text-red-600 text-xl font-bold"
            >
              ✖
            </button>

            {/* Video */}
            <video
              ref={videoRef}
              controls
              autoPlay
              width="100%"
              className="rounded-xl shadow-lg"
            >
              <source src="/videos/THỦ LÚP QUANG HỢP.mp4" type="video/mp4" />
              Trình duyệt của bạn không hỗ trợ video.
            </video>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoPopup;
