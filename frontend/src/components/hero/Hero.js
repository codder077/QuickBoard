import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div
      className="relative flex items-center justify-center bg-cover bg-center py-20"
      style={{
        backgroundImage: "url('./img/hero2.jpg')",
      }}
    >
      <div className="container ml-[32%]">
        <div className="max-w-screen-xl  md:flex-row sm:px-6">
          <div className="flex items-center md:w-1/2 md:pb-20 md:pt-10 md:pr-10">
            <div className="text-align">
              <h2 className="text-4xl font-extrabold leading-10 tracking-tight text-gray-800 sm:text-5xl sm:leading-none md:text-6xl mr-5">
                Board
                <span className="font-bold text-blue-500 mx-4">Anytime</span>
              </h2>
              <p className="max-w-md mx-auto mt-3 text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                Welcome to our revolutionary ticket booking platform, where
                predictive analytics ensures your journey's seamless flow.
              </p>
              <div className="mt-5 sm:flex md:mt-8">
                <div className="rounded-md shadow">
                  <Link
                    to="/trainbooking"
                    className="flex items-center justify-center w-full px-8 py-3 text-base font-medium leading-6 text-white transition duration-150 ease-in-out bg-blue-500 border border-transparent rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue md:py-4 md:text-lg md:px-10"
                  >
                    Book Your Train
                  </Link>
                </div>
                <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                  <Link
                    to="/flightbooking"
                    className="flex items-center justify-center w-full px-8 py-3 text-base font-medium leading-6 text-blue-500 transition duration-150 ease-in-out bg-white border border-transparent rounded-md hover:text-blue-600 focus:outline-none focus:shadow-outline-blue md:py-4 md:text-lg md:px-10"
                  >
                    Book Your Flight
                  </Link>
                </div>
              </div>
              <p
                className="max-w-md mx-auto mt-10 pt-6 text-base text-purple-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl"
                style={{ whiteSpace: "nowrap" }}
              >
                "Every Journey Begins with Confidence and Convenience."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
