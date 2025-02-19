import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { signin } from "../../config/auth";
import Cookies from "universal-cookie";
import { useEffect } from "react";

const SignInScreen = () => {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: "",
    password: "",
  });

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
          // httpOnly: true,
        });
        return toast.success("Đăng nhập thành công");
      }
    } catch (error) {
      return toast.error(
        error.response?.data?.errorMessage || "An error occurred"
      );
    }

    setValues({ username: "", password: "" }); // Only clear values on success
  };

  useEffect(() => {
    localStorage.clear();
    if (cookies.get("signin_user")) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <>
      <div className="relative flex h-screen bg-cover bg-center bg-no-repeat flex-col justify-center lg:px-8 bg-[url('/public/images/background_signin.png')]">
        <div className="flex flex-row justify-evenly items-center align-center">
          <img
            src="/public/images/DS cho Tường-03.png"
            className="w-40 h-40 absolute bottom-0 right-10"
            alt=""
          />

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
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
                    <p className="font-semibold text-indigo-600 hover:text-indigo-500 ml-2">
                      Đăng ký
                    </p>
                  </Link>{" "}
                </div>
                <Link to={"/"}>
                  <p className="font-semibold text-indigo-600 hover:text-indigo-500 ml-3">
                    Về trang chủ
                  </p>
                </Link>{" "}
              </div>
            </div>
          </div>

          <img
            className="w-[550px] h-[550px] "
            src="/public/images/tuong2.png"
            alt=""
          />
        </div>
      </div>
    </>
  );
};

export default SignInScreen;
