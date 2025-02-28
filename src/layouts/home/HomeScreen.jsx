import  { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import MainScreen from "./components/MainScreen";
import NavBar from "./components/NavBar";

const HomeScreen = () => {
  const cookie = new Cookies();
  const navigate = useNavigate();
  useEffect(() => {
    if (cookie.get("signin_user")) {
      navigate("/trang_hoc_chinh");
    }
  }, [cookie]);
  
  return (
    <>
      <div className="bg-[#b2c4a9]">
        <div className="w-full h-screen bg-[#b2c4a9]">
          <div className="w-full bg-[#b2c4a9] flex justify-center items-center flex-col overflow-auto py-12">
            <NavBar />
            <MainScreen />
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeScreen;
