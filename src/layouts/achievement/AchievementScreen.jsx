import React, { useRef, useState } from "react";
import { useEffect } from "react";
import Cookies from "universal-cookie";
import { getAchievement } from "../../config/achievement";
import { sound5 } from "../../helper/sounds";

const imageTrung = [
  "/images/tach_trung_dong.png",
  "/images/tach_trung_bac.png",
  "/images/tach_trung_vang.png",
];

const AchievementScreen = () => {
  const cookie = new Cookies();
  const token = cookie.get("signin_user");
  const [listAchievement, setListAchievement] = useState([]);
  const highlightKeywords = (text) => {
    const keywords = ["khởi động", "tăng tốc", "về đích"];
    const regex = new RegExp(`(${keywords.join("|")})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      keywords.some((kw) => part.toLowerCase() === kw.toLowerCase()) ? (
        <span key={index} className="font-bold text-green-700">
          {part.toUpperCase()}
        </span>
      ) : (
        <React.Fragment key={index}>{part}</React.Fragment>
      )
    );
  };

  const audioRef5 = useRef(null); // tạo ref cho audio

  useEffect(() => {
    if (!audioRef5.current) {
      audioRef5.current = new Audio(sound5);
    }

    async function getListAchievement() {
      try {
        const { data } = await getAchievement(token);
        setListAchievement(data.result);
      } catch (error) {}
    }

    audioRef5.current?.play();

    getListAchievement();
    return () => {
      if (audioRef5.current) {
        audioRef5.current.pause();
        audioRef5.current.currentTime = 0; // Nếu muốn dừng hoàn toàn và reset lại
      }
    };
  }, []);

  return (
    <div className="w-7xl min-h-screen bg-cover rounded-xl bg-center bg-no-repeat bg-[url('/public/images/background_trung.jpg')]  mx-auto px-6 py-10 bg-green-50">
      <h1 className="text-4xl font-bold text-center text-green-700 mb-10">
        🧪 Thành tích đạt được
      </h1>
      {listAchievement.length === 0 ? (
        <div className="flex justify-center w-full items-center">
          <div className="text-green-700 text-xl font-semibold uppercase animate-pulse">
            🔄 Hiện tại bạn chưa có thành tích nào...
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {listAchievement.map((item, index) => {
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition duration-300 p-5 flex flex-col items-center text-center border border-green-100"
              >
                <img
                  src={imageTrung[index]}
                  alt={item.title}
                  className="w-24 h-24 object-cover rounded-full border-4 border-green-200 mb-4"
                />
                <h3 className="text-xl font-bold text-green-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {highlightKeywords(item.description)}
                </p>

                <div className="text-xs font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                  🏅 Số lượng:{" "}
                  <span className="text-yellow-400 font-bold">
                    {item.count}
                  </span>{" "}
                  quả
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AchievementScreen;
