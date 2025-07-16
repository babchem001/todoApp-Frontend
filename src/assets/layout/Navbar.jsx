import { useState, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { storeContext } from "../context/storeContext";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuth } = useContext(storeContext);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-[#ffffff] px-2 sm:px-4 py-2.5 text-[#2d2d2d] fixed w-full h-15 z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600">
      <div className="container flex flex-wrap justify-between items-center mx-auto">
        <Link to="/" className="flex items-center">
          <img
            src="https://img.icons8.com/?size=100&id=rnwtSv4H3pXk&format=png&color=000000"
            className="mr-3 h-6 sm:h-9"
            alt="Flowbite Logo"
          />
          <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
            TaskNest App
          </span>
        </Link>

        <button
          data-collapse-toggle="navbar-default"
          type="button"
          className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded={isOpen}
          onClick={toggleMenu}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-6 h-6"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>

        <div
          className={`w-full md:block md:w-auto ${isOpen ? "block" : "hidden"}`}
          id="navbar-default"
        >
          <ul className="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium">
            {isAuth ? (
              <>
                <li>
                  <NavLink
                    to="/"
                    activeclassname="active"
                    className="block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 dark:hover:text-white dark:focus:text-white dark:focus:bg-gray-700 dark:hover:bg-gray-600 md:dark:hover:bg-transparent"
                  >
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard"
                    activeclassname="active"
                    className="block py-2 px-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-gray-400 dark:hover:text-white"
                  >
                    Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/account"
                    activeclassname="active"
                    className="block py-2 px-3 mt-2 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 dark:hover:text-white dark:focus:text-white dark:focus:bg-gray-700 dark:hover:bg-gray-600 md:dark:hover:bg-transparent"
                  >
                    My Profile
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/wallet"
                    activeclassname="active"
                    className="block py-2 px-3 mt-2 text-green-700 rounded hover:bg-green-100 md:hover:bg-transparent md:border-0 md:hover:text-green-700 md:p-0 dark:text-green-400 dark:hover:text-green-300 dark:focus:text-white dark:focus:bg-gray-700 dark:hover:bg-gray-600 md:dark:hover:bg-transparent"
                  >
                    My Wallet
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/logout"
                    activeclassname="active"
                    className="block py-2 pr-4 px-3 mt-2 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 dark:hover:text-white dark:focus:text-white dark:focus:bg-gray-700 dark:hover:bg-gray-600 md:dark:hover:bg-transparent"
                  >
                    Logout
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink
                    to="/register"
                    className="block py-2 px-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-gray-400 dark:hover:text-white"
                  >
                    Register
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/login"
                    className="block py-2 px-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-gray-400 dark:hover:text-white"
                  >
                    Login
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
