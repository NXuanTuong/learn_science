import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Cookies from "universal-cookie";

const MenuTopBar = () => {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const [listMenu] = useState([
    {
      title: "Khám phá khoa học",
      icon: <i className="fa-solid fa-microscope"></i>,
      path: "",
    },
    {
      title: "Luyện tập thực hành",
      icon: <i className="fa-solid fa-book"></i>,
      path: "luyen_tap_thuc_hanh",
    },
    {
      title: "Thành tích",
      icon: <i className="fa-solid fa-trophy"></i>,
      path: "thanh_tich",
    },
    // {
    //   title: "Về đích",
    //   icon: <i className="fa-solid fa-flag-checkered"></i>,
    //   path: "ve_dich",
    // },
  ]);

  const [currentPage, setCurrentPage] = useState(0);

  const handleChangePage = (index) => {
    setCurrentPage(index);
    setIsOpen(false);
  };

  const handleLogout = () => {
    cookies.remove("signin_user");
    localStorage.clear();
    navigate("/");
    toast.success("Đăng xuất thành công");
  };

  useEffect(() => {
    if (window.location.pathname == "/trang_hoc_chinh/luyen_tap_thuc_hanh") {
      setCurrentPage(1);
    }

    if (window.location.pathname == "/trang_hoc_chinh/thanh_tich") {
      setCurrentPage(2);
    }

    if (!cookies.get("signin_user")) {
      navigate("/");
    }
  }, []);

  return (
    <>
      <div className=" flex flex-row justify-between items-center rounded-3xl border-2 border-transparent px-10 bg-[#fafbfc] py-4 w-11/12 max-w-[80rem] min-h-[10rem] shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-3xl backdrop-blur-md bg-opacity-80 border-[3px] border-transparent bg-clip-padding bg-gradient-to-r from-[#004a37] to-[#34d399] p-[2px]">
        {/* Logo */}
        <div className="flex flex-row items-center gap-4">
          <div className="rounded-full w-4 h-4 bg-[#458665]"></div>
          <div className="rounded-full w-4 h-4 bg-[#ff6379]"></div>
          <img
            className="object-cover h-[7rem]"
            src="/images/logo.png"
            alt="Logo"
          />
        </div>

        {/* Menu */}
        <div className="flex flex-wrap justify-center flex-row items-center gap-3">
          {listMenu.map((item, index) => (
            <Link key={index} to={item.path}>
              <span
                onClick={() => handleChangePage(index)}
                className={`p-3 px-5 h-12 cursor-pointer rounded-xl flex flex-row justify-center items-center gap-2 border transition-all duration-300 font-semibold
                ${
                  currentPage === index
                    ? "bg-[#004a37] text-white shadow-lg scale-105"
                    : "bg-[#d8e1f4] text-[#004a37] hover:bg-[#b5c6e0] hover:shadow-md hover:scale-105"
                }`}
              >
                {item.icon}
                <p className="text-sm uppercase">{item.title}</p>
              </span>
            </Link>
          ))}

          {/* Dropdown */}
          <nav className="relative h-12 w-[15rem] bg-[#d8e1f4] rounded-2xl shadow-md transition-all duration-300">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full h-12 p-4 bg-[#d8e1f4] rounded-2xl text-sm uppercase cursor-pointer flex justify-between items-center font-semibold hover:bg-[#b5c6e0] transition-all duration-300"
            >
              <p>
                Xin chào,{" "}
                <span className="text-base text-[#004a37] font-bold">
                  {localStorage.getItem("userName")}
                </span>
              </p>
              <i
                className={`fa-solid ${
                  isOpen ? "fa-chevron-up" : "fa-chevron-down"
                }`}
              ></i>
            </button>

            <ul
              className={`absolute left-0 w-full mt-3 bg-[#fafbfc] border-2 border-[#004a37] rounded-xl shadow-lg transition-all duration-300 overflow-hidden ${
                isOpen
                  ? "opacity-100 max-h-40 translate-y-0"
                  : "opacity-0 max-h-0 -translate-y-2"
              }`}
            >
              <li
                onClick={handleLogout}
                className="p-4 flex flex-row justify-center items-center gap-3 bg-[#d8e1f4] hover:bg-[#b5c6e0] rounded-xl transition-all duration-300 cursor-pointer"
              >
                <i className="fa-solid fa-sign-out-alt"></i>
                <p className="font-semibold text-sm uppercase">Đăng xuất</p>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default MenuTopBar;
