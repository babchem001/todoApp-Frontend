// import React from "react";
import { useContext } from "react";
import { storeContext } from "../assets/context/storeContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Logout() {
  const { isAuth, setIsAuth } = useContext(storeContext);
  const navigate = useNavigate();

  function logOutHandler() {
    localStorage.removeItem("todoApp_token");
    setIsAuth(false);
    navigate("/login");
    toast.success("Logout successful");
  }
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#ffeef0] text-[#2d2d2d]">
      <div className="p-6 rounded-lg shadow-lg bg-white dark:bg-gray-800 max-w-md mx- auto">
        <h2 className="text-2xl font-bold text-center mb-4">Logout</h2>
        <p className="text-xl text-center">Are you sure you want to logout?</p>
        <div className="flex items-center justify-center mt-4">
          <button
            type="button"
            className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus: ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 cursor-pointer"
            onClick={logOutHandler}
          >
            Log Out
          </button>
          <button
            type="button"
            onClick={() => {
              navigate("/dashboard");
            }}
            to="/dashboard"
            className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center ml-2 w-25 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default Logout;
