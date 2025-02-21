import React from "react";

const ScientificDiscovery = () => {
  return (
    <>
      <div className="w-3/5 flex justify-center items-center ml-[2rem]">
        <div className="max-w-6/2 w-3/4 aspect-[16/9] rounded-xl overflow-hidden">
          <iframe
            className="w-full h-full rounded-xl"
            src="https://www.youtube.com/embed/b4oZwg6w_wA?autoplay=0&mute=0&controls=1&origin=https%3A%2F%2Fkurio.vn&playsinline=1&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&enablejsapi=1&widgetid=5"
            frameBorder="0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="no-referrer"
          ></iframe>
        </div>
      </div>
    </>
  );
};

export default ScientificDiscovery;
