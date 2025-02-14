import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  const onLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    navigate("/login");
  };

  return (
    <nav className="bg-black/90 fixed w-full z-20 top-0 start-0 border-b border-yellow-400/30">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          to="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
            Quick
            <span className="text-yellow-400 mx-2">Board</span>
          </span>
        </Link>
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          {token ? (
            <div className="flex items-center gap-4">
              <div className="flex gap-4 items-center">
                <Link 
                  to="/dashboard" 
                  className="cursor-pointer text-white hover:text-yellow-400 transition-all duration-300"
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  className="text-gray-900 bg-yellow-400 hover:bg-yellow-300 font-semibold rounded-xl px-6 py-3 text-base transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-yellow-400/50 backdrop-blur-sm"
                  onClick={onLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              className="text-gray-900 bg-yellow-400 hover:bg-yellow-300 font-semibold rounded-xl px-6 py-3 text-base transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-yellow-400/50 backdrop-blur-sm"
              onClick={() => navigate("/signup")}
            >
              Get started
            </button>
          )}

          <button
            data-collapse-toggle="navbar-sticky"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-yellow-400 rounded-lg md:hidden hover:bg-yellow-400/10 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            aria-controls="navbar-sticky"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
        <div
          className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
          id="navbar-sticky"
        >
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-yellow-400/30 rounded-lg bg-black/90 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
            <li>
              <Link
                to="/"
                className="block py-2 px-3 text-yellow-400 rounded md:bg-transparent md:p-0 transition-all duration-300 hover:scale-105"
                aria-current="page"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="block py-2 px-3 text-white rounded hover:text-yellow-400 md:p-0 transition-all duration-300 hover:scale-105"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="#services"
                className="block py-2 px-3 text-white rounded hover:text-yellow-400 md:p-0 transition-all duration-300 hover:scale-105"
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="block py-2 px-3 text-white rounded hover:text-yellow-400 md:p-0 transition-all duration-300 hover:scale-105"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
