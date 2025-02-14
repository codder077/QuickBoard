import React from "react";

const Tagline = () => {
  return (
    <div className="text-center bg-black/90 p-8">
      <p className="text-5xl font-extrabold text-white mb-4 mt-4 transform hover:scale-105 transition-all duration-500">
        Predict. Plan.
        <span className="text-yellow-400 mx-2 animate-glow">Prevail</span>
      </p>
      <p className="text-lg sm:text-xl text-gray-100 font-medium leading-relaxed animate-slideInRight">
        "Your Gateway to Secure and Predictable Travel"
      </p>
    </div>
  );
};

export default Tagline;
