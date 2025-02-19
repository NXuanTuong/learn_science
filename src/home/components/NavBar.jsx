import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <>
      <div className="w-3/4 h-15 bg-[#fff] rounded-2xl flex flex-row justify-between items-center px-5 z-10 ">
        <div className=" flex flex-row justify-between items-center gap-3">
          <div className="rounded-full w-4 h-4 bg-[#458665]"></div>
          <div className="rounded-full w-4 h-4 bg-[#ff6379]"></div>
          <p className="text-4xl text-[#004a37] font-['Exo_2'] font-medium">
            Sci-Learing
          </p>
        </div>

        <div className="flex flex-row justify-between items-center gap-3">
          <Link to={"/dang_ky"}>
            <button className="text-base flex justify-between items-center font-medium gap-3 cursor-pointer px-2 py-2 border border-[#004a37] text-[#004a37] rounded-lg transition">
              <i className="fa-solid fa-pen-to-square"></i> Đăng Ký
            </button>
          </Link>

          <Link to={"/dang_nhap"}>
            <button className="text-base flex justify-between font-medium items-center gap-3 cursor-pointer px-2 py-2 bg-[#004a37] text-[#fff] rounded-lg  transition">
              <i className="fa-solid fa-user"></i> Đăng Nhập
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default NavBar;
