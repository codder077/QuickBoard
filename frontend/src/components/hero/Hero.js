import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative w-full h-screen flex items-center justify-end">
      {/* Background GIF (Full Screen) */}
      <div className="absolute inset-0 z-0">
        <img
          src="./img/gif2.gif"
          alt="Travel Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>
      </div>

      {/* Content (on the right) */}
      <div className="relative z-10 max-w-xl text-right p-6 md:p-12 rounded-l-3xl mr-0 animate-fadeIn">
        <h2 className="text-5xl font-extrabold sm:text-6xl text-white transform hover:scale-105 transition-all duration-500">
          Board
          <span className="text-yellow-400 mx-2 animate-glow">Anytime</span>
        </h2>
        <p className="mt-4 text-lg sm:text-xl text-gray-100 font-medium leading-relaxed animate-slideInRight">
          Welcome to our revolutionary ticket booking platform, where predictive
          analytics ensures your journey's seamless flow.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row sm:justify-end gap-3 animate-fadeInUp">
          <Link
            to="/trainbooking"
            className="group px-6 py-3 text-base font-semibold bg-yellow-400 text-gray-900 rounded-xl hover:bg-yellow-300 transform hover:scale-110 hover:shadow-lg hover:shadow-yellow-400/50 transition-all duration-300 ease-in-out flex items-center justify-center backdrop-blur-sm"
          >
            Book Your Train
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-3 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
        <p className="mt-8 text-xl italic text-yellow-400 font-bold border-t-2 border-yellow-400/30 pt-4 transform -translate-x-2 hover:translate-x-0 transition-all duration-500 cursor-default">
          "Every Journey Begins with Trust and Convenience."
        </p>
      </div>
    </div>
  );
};

export default Hero;
