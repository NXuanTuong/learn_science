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
      path: "/trang_hoc_chinh",
    },
    {
      title: "Luyện tập thực hành",
      icon: <i className="fa-solid fa-book"></i>,
      path: "luyen_tap_thuc_hanh",
    },
  ]);

  const [currentPage, setCurrentPage] = useState(0);

  const handleChangePage = (index) => {
    setCurrentPage(index);
    setIsOpen(false);
  };

  const handleLogout = () => {
    const listCookies = cookies.getAll();
    localStorage.clear();
    Object.keys(listCookies).forEach((cookie) => {
      cookies.remove(cookie);
    });
    navigate("/");
    toast.success("Đăng xuất thành công");
  };

  useEffect(() => {
    if (window.location.pathname == "/trang_hoc_chinh/luyen_tap_thuc_hanh") {
      setCurrentPage(1);
    }

    if (!cookies.get("signin_user")) {
      navigate("/");
    }
  }, []);

  return (
    <>
      <div className="flex flex-row justify-between relative rounded-2xl border-2 border-[#004a37] items-center px-[2.5rem] bg-[#fafbfc] py-[0.5rem] w-11/12 max-w-11/12 min-h-[10rem]">
        <div className=" flex flex-row justify-between items-center gap-3">
          <div className="rounded-full w-4 h-4 bg-[#458665]"></div>
          <div className="rounded-full w-4 h-4 bg-[#ff6379]"></div>
          {/* <p className="text-4xl text-[#004a37] font-['Exo_2'] font-medium">
            Sci-Learing
          </p> */}
          <img
            className="object-cover h-[8rem]"
            src="/images/logo.png"
            alt=""
          />
        </div>

        {/* <img className="w-[8rem] h-[8rem]" src="/images/logo.png" alt="" /> */}

        <div className="flex flex-wrap justify-center flex-row items-center gap-[1rem]">
          {listMenu.map((item, index) => {
            return (
              <Link key={index} to={item.path}>
                <span
                  onClick={() => handleChangePage(index)}
                  className={
                    currentPage == index
                      ? "p-[1rem] w-[15rem] h-[3rem] cursor-pointer rounded-xl bg-[#fafbfc] flex flex-row justify-center items-center gap-[0.75rem] border border-[#004a37] rounded-xl shadow-[2px_4px_0_0_#004a37]"
                      : "p-[1rem] w-[15rem] h-[3rem] cursor-pointer rounded-xl bg-[#d8e1f4] flex flex-row justify-center items-center gap-[0.75rem]"
                  }
                >
                  {item.icon}
                  <p className="text-[0.95rem] font-bold uppercase">
                    {item.title}
                  </p>
                </span>
              </Link>
            );
          })}

          <nav className="w-[15rem] h-[3rem] relative bg-[#d8e1f4] rounded-2xl">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full h-[3rem] p-[1rem] bg-[#d8e1f4] rounded-2xl text-xs uppercase cursor-pointer flex justify-between items-center "
            >
              <p className="font-bold">
                Xin chào,{" "}
                <span className="text-base text-[#004a37]">
                  {localStorage.getItem("userName")}
                </span>
              </p>
              {isOpen ? (
                <i className="fa-solid fa-arrow-up"></i>
              ) : (
                <i className="fa-solid fa-arrow-down"></i>
              )}
            </button>

            {/* Dropdown sử dụng absolute để không thay đổi chiều cao của div cha */}
            <ul
              className={`absolute flex cursor-pointer flex-col items-center p-[0.5rem] gap-[0.75rem] bg-[#fafbfc] border-[1.5px] border-[#004a37] rounded-xl shadow-[2px_4px_0_0_#004a37] w-[13rem] left-0 w-full mt-[1rem] text-center transition-all duration-300 ${
                isOpen ? "opacity-100 max-h-40" : "opacity-0 max-h-0"
              }`}
            >
              {["Đăng xuất"].map((item, index) => (
                <li
                  onClick={handleLogout}
                  key={index}
                  className="p-[1rem] w-[13.5rem] h-[3rem] rounded-xl bg-[#d8e1f4] flex flex-row justify-center items-center gap-[0.75rem]"
                >
                  <i className="fa-solid fa-right-from-bracket"></i>
                  <p className="font-bold text-base uppercase">{item}</p>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default MenuTopBar;
