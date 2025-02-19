import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { register } from "../../config/auth";

const RegistrationScreen = () => {
  const [values, setValues] = useState({
    fullname: "",
    username: "",
    phonenumber: "",
    email: "",
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
      const response = await register({
        fullName: values.fullname,
        userName: values.username,
        phone: values.phonenumber,
        email: values.email,
        password: values.password,
      });

      if (response) {
        return toast.success("Đăng nhập thành công");
      }
    } catch (error) {
      return toast.error(
        error.response?.data?.errorMessage || "An error occurred"
      );
    }

    setValues({
      fullname: "",
      username: "",
      phonenumber: "",
      email: "",
      password: "",
    }); // Only clear values on success
  };

  return (
    <>
      <div className="relative flex h-screen bg-cover bg-center bg-no-repeat bg-[url('/public/images/background_register.png')] ">
        <div className="flex w-full flex-row justify-evenly items-center overflow-auto pt-20">
          <img
            src="/public/images/logo.png"
            className="w-40 h-40 absolute bottom-0 left-10"
            alt=""
          />

          <img
            className="w-[550px] h-[550px] "
            src="/public/images/rabbit_four.png"
            alt=""
          />

          <div className="w-2/5 rounded-2xl bg-[#fff] flex flex-col border-2 border-[#004a37] justify-center items-center py-5 shadow-[0.75rem_-0.6875rem_1rem_rgba(0,74,55,0.5)]">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col items-center">
              <h2 className="mt-5 text-center text-4xl/9 font-bold tracking-tight text-gray-900">
                Đăng Ký
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
                    Họ và Tên
                  </label>
                  <div className="mt-2">
                    <input
                      onChange={(e) => handleChangeForm(e)}
                      value={values.fullname}
                      type="text"
                      name="fullname"
                      id="fullname"
                      required
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Tên đăng nhập
                  </label>
                  <div className="mt-2">
                    <input
                      onChange={(e) => handleChangeForm(e)}
                      value={values.username}
                      type="text"
                      name="username"
                      id="username"
                      required
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-sm/6 font-medium text-gray-900">
                      Số điện thoại
                    </label>
                  </div>
                  <div className="mt-2">
                    <input
                      onChange={(e) => handleChangeForm(e)}
                      type="text"
                      value={values.phonenumber}
                      name="phonenumber"
                      id="phonenumber"
                      required
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Email
                  </label>
                  <div className="mt-2">
                    <input
                      onChange={(e) => handleChangeForm(e)}
                      type="email"
                      value={values.email}
                      name="email"
                      id="email"
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
                    Đăng ký
                  </button>
                </div>
              </form>

              <div className="flex flex-col justify-center items-center mt-2">
                <div className="flex flex-row justify-center items-center mt-5">
                  <p className="text-center text-sm/6 text-gray-500">
                    Đã có tài khoản ?
                  </p>
                  <Link to={"/dang_nhap"}>
                    <p className="font-semibold text-indigo-600 hover:text-indigo-500 ml-2">
                      Đăng nhập
                    </p>
                  </Link>
                </div>
                <Link to={"/"}>
                  <p className="font-semibold text-indigo-600 hover:text-indigo-500 ml-2">
                    Về trang chủ
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegistrationScreen;
