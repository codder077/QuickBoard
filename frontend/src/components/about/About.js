import React from "react";
import { Link } from "react-router-dom";

function About({ iconSrc, title, description }) {
  return (
    <div className="relative p-8 space-y-3 border-2 border-yellow-400 rounded-xl backdrop-blur-sm hover:scale-105 transition-all duration-300">
      <dt>
        <div className="flex items-center justify-center h-12 w-12 text-yellow-400">
          <img src={iconSrc} alt="icon" className="w-8 h-8" />
        </div>
        <p className="text-2xl font-semibold text-white capitalize">
          {title}
        </p>
      </dt>
      <dd className="text-gray-300">{description}</dd>
    </div>
  );
}

function Abouts() {
  return (
    <section className="bg-black/90 pt-20">
      <div className="container px-6 py-10 mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white capitalize lg:text-4xl">
            Why
            <span className="mx-3 text-yellow-400">Choose Us?</span>
          </h2>
          <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            "We're dedicated to revolutionizing travel with seamless
            solutions. Through innovation and a focus on customer
            satisfaction, we strive to optimize every aspect of the journey.
            Join us in shaping the future of travel convenience and
            satisfaction."
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 mt-8 xl:mt-12 xl:gap-12 md:grid-cols-2">
          <About
            iconSrc="https://www.svgrepo.com/show/503163/api-settings.svg"
            title="Innovative Solutions"
            description="QuickBoard offers revolutionary ticket booking solutions powered by predictive analytics and cutting-edge technology."
          />
          <About
            iconSrc="https://www.svgrepo.com/show/511771/dashboard-671.svg"
            title="Mission-driven"
            description="Our mission is to provide travelers with seamless and stress-free journeys, from booking tickets to reaching their destination."
          />
          <About
            iconSrc="https://www.svgrepo.com/show/503138/webpack.svg"
            title="Customer Satisfaction"
            description="Committed to excellence, our team works tirelessly to deliver unparalleled service and support to our customers."
          />
          <About
            iconSrc="https://www.svgrepo.com/show/76267/free-commercial-label.svg"
            title="Key Features"
            description="We provide innovative features such as predictive ticketing, real-time ticket allocation, and fair pricing policies to ensure an optimized travel experience."
          />
        </div>

        <div className="text-center mt-8">
          <Link to="/allowance">
            <button className="bg-yellow-400 text-black py-2 px-4 rounded hover:bg-yellow-500 transition">
              Why Government Should Allow Us
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Abouts;
