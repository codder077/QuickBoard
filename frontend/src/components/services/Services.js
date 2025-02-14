import React from "react";
import { Link } from "react-router-dom";

const Services = () => {
  return (
    <div className="bg-black/90">
      <div className="container mx-auto px-4 py-10" id="services">
        {/* Book Ticket */}
        <div className="mt-10">
          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-extrabold text-white capitalize lg:text-4xl">
              Our
              <span className="mx-3 text-yellow-400">Services</span>
            </h2>
          </div>
          <div className="flex justify-around mt-12">
            <div className="flex flex-col w-96 gap-4">
              <h1 className="font-bold text-yellow-400 text-4xl">
                Book Your Ticket
              </h1>
              <p className="text-gray-300 text-lg">
                Enable users to effortlessly book their tickets for trains or
                flights through a user-friendly interface. This service ensures
                seamless and hassle-free booking experiences, allowing users to
                quickly secure their travel arrangements with ease and
                convenience.
              </p>
              <p className="text-yellow-400/70 text-lg italic border-t-2 border-yellow-400/30 pt-4">
                "We endeavor to allocate you the optimal seat for your journey,
                ensuring your comfort and satisfaction."
              </p>
              <div className="flex gap-4">
                <Link to="/trainbooking" className="group px-6 py-3 text-base font-semibold bg-yellow-400 text-gray-900 rounded-xl hover:bg-yellow-300 transform hover:scale-110 hover:shadow-lg hover:shadow-yellow-400/50 transition-all duration-300 ease-in-out flex items-center justify-center backdrop-blur-sm">
                  For Train
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-3 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              
              </div>
            </div>
            <div className="flex items-center">
              <img src="./img/book4.png" className="w-[30rem] rounded-xl border-2 border-yellow-400/30" alt="" />
            </div>
          </div>
        </div>

        {/* Cancel Ticket */}
        <div className="mt-20">
          <div className="flex justify-around">
            <div className="flex items-center">
              <img src="./img/cancel.jpg" className="w-96 rounded-xl border-2 border-yellow-400/30" alt="" />
            </div>
            <div className="flex flex-col w-96 gap-4">
              <h1 className="font-bold text-yellow-400 text-4xl">
                Cancel Your Ticket
              </h1>
              <p className="text-gray-300 text-lg">
                Catering to user convenience, this service allows individuals to
                transfer their tickets to those positioned at the forefront of the
                waiting list. This strategic feature not only alleviates database
                congestion but also provides prompt solutions for both the seller
                and the recipient, fostering an efficient and satisfactory user
                experience.
              </p>
              <p className="text-yellow-400/70 text-lg italic border-t-2 border-yellow-400/30 pt-4">
                "Our aim is to revolutionize the ticket booking experience by
                providing seamless, efficient, and fair solutions for travelers in
                need."
              </p>
              <div className="flex gap-4">
                <Link to="/traincancel" className="group px-6 py-3 text-base font-semibold bg-yellow-400 text-gray-900 rounded-xl hover:bg-yellow-300 transform hover:scale-110 hover:shadow-lg hover:shadow-yellow-400/50 transition-all duration-300 ease-in-out flex items-center justify-center backdrop-blur-sm">
                  For Train
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-3 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
             
              </div>
            </div>
          </div>
        </div>

        {/* Rent */}
        <div className="mt-20">
          <div className="flex justify-around">
            <div className="flex flex-col w-96 gap-4">
              <h1 className="font-bold text-white text-3xl">Upcoming Service </h1>
              <h1 className="font-bold text-yellow-400 text-4xl">
                Vehicle Rental Exchange
              </h1>
              <p className="text-gray-300 text-lg">
                Facilitate a platform for travelers to temporarily rent out their
                vehicles to incoming visitors at airports. By submitting valid
                identification, such as a passport, owners can securely lend their
                vehicles, offering a convenient transportation solution for
                incoming travelers exploring nearby areas.
              </p>
              <p className="text-yellow-400/70 text-lg italic border-t-2 border-yellow-400/30 pt-4">
                "Our aim is to streamline travel by enabling secure vehicle
                rentals between travelers, optimizing resource usage, and
                elevating the overall travel experience."
              </p>
            </div>
            <div>
              <img src="./img/rent.jpg" className="w-[40rem] rounded-xl border-2 border-yellow-400/30" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
