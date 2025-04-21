import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Cookies from "universal-cookie";
import { useEffect } from "react";
import { signin } from "../../../config/auth";

const SignInScreen = () => {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [showPassword, setShowPassword] = useState(false);

  const handleChangeForm = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleChangeShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await signin({
        userName: values.username,
        password: values.password,
      });

      if (response) {
        const expires = 7 * 24 * 3600;
        if (cookies.get("signin_user")) {
          cookies.remove("signin_user");
        }
        cookies.set("signin_user", response.data.result.access_token, {
          maxAge: expires,
          path: "/",
        });
        toast.success("Đăng nhập thành công");
        localStorage.setItem("userName", values.username);
        setLoading(true); // Bắt đầu loading
      }
    } catch (error) {
      toast.error(error.response?.data?.errorMessage || "An error occurred");
    }

    setValues({ username: "", password: "" });
  };

  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            navigate("/trang_hoc_chinh");
            return 100;
          }
          return prev + 5; // tốc độ tiến trình
        });
      }, 500); // tốc độ chạy hiệu ứng (ms)
    }
    return () => clearInterval(interval);
  }, [loading, navigate]);

  useEffect(() => {
    if (!loading && cookies.get("signin_user")) {
      navigate("/trang_hoc_chinh");
    }
  }, [navigate]);

  return (
    <>
      {loading && (
        <div className="w-full min-h-screen bg-gradient-to-br from-green-100 via-emerald-200 to-teal-100 flex flex-col gap-10 justify-center items-center relative">
          {/* Hình minh họa */}
          <div className="relative flex flex-col items-center justify-end text-center w-full z-[1100] gap-10 bg-cover bg-center">
            <img
              src="/images/rabbit_four.png"
              alt="Loading..."
              className="w-[20rem] h-[20rem] animate-bounce"
            />
          </div>

          {/* Thanh progress */}
          <div className="w-1/3 h-1.5 bg-gray-300 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-green-600 transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">{progress}%</p>
        </div>
      )}

      {!loading && (
        <div className="relative flex min-h-screen bg-cover bg-center bg-no-repeat flex-col justify-center lg:px-8 bg-[url('/public/images/background_signin.png')]">
          <div className="flex flex-row justify-evenly items-center align-center">
            <div className="w-2/5 rounded-2xl bg-[#fff] flex flex-col border-2 border-[#004a37] justify-center items-center py-5 shadow-[0.75rem_-0.6875rem_1rem_rgba(0,74,55,0.5)]">
              <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col items-center">
                {/* <p className="text-6xl text-[#004a37] font-['Exo_2'] font-bold">
                Sci-Learing
              </p> */}
                <h2 className="mt-5 text-center text-4xl/9 font-bold tracking-tight text-gray-900">
                  Đăng Nhập
                </h2>
              </div>

              <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm ">
                <form
                  onSubmit={handleSubmit}
                  className="space-y-6"
                  action="#"
                  method="POST"
                >
                  <div>
                    <label className="block text-sm/6 font-medium text-gray-900">
                      Tên đăng nhập
                    </label>
                    <div className="mt-2">
                      <input
                        onChange={(e) => handleChangeForm(e)}
                        type="text"
                        name="username"
                        value={values.username}
                        id="username"
                        required
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label className="block text-sm/6 font-medium text-gray-900">
                        Mật khẩu
                      </label>
                    </div>
                    <div className="mt-2 relative">
                      <input
                        onChange={(e) => handleChangeForm(e)}
                        type={showPassword ? "text" : "password"}
                        name="password"
                        id="password"
                        required
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 pr-10"
                      />
                      {showPassword ? (
                        <div className="absolute right-3 inset-y-0 flex items-center">
                          <i
                            onClick={handleChangeShowPassword}
                            className="cursor-pointer fa-solid fa-eye"
                          ></i>
                        </div>
                      ) : (
                        <div className="absolute right-3 inset-y-0 flex items-center">
                          <i
                            onClick={handleChangeShowPassword}
                            className="cursor-pointer fa-solid fa-eye-slash"
                          ></i>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="flex w-full cursor-pointer justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Đăng nhập
                    </button>
                  </div>
                </form>

                <div className="flex flex-col justify-center items-center mt-2">
                  <div className="flex flex-row justify-center items-center mt-5">
                    <p className="text-center text-sm/6 text-gray-500">
                      Chưa có tài khoản ?
                    </p>
                    <Link to={"/dang_ky"}>
                      <p className="cursor-pointer font-semibold text-indigo-600 hover:text-indigo-500 ml-2">
                        Đăng ký
                      </p>
                    </Link>{" "}
                  </div>
                  <Link to={"/"}>
                    <p className="cursor-pointer font-semibold text-indigo-600 hover:text-indigo-500 ml-3">
                      Về trang chủ
                    </p>
                  </Link>{" "}
                </div>
              </div>
            </div>

            <img
              className="w-[550px] h-[550px] "
              src="/images/rabbit_two.png"
              alt=""
            />
          </div>
        </div>
      )}
    </>
  );
};

export default SignInScreen;
