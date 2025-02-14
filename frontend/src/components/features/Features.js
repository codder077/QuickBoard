import React from "react";

const ComponentSection = () => {
  return (
    <section className="bg-black/90">
      <div className="container px-6 py-10 mx-auto">
        <h1 className="text-3xl font-extrabold text-white capitalize lg:text-4xl">
          explore our
          <span className="mx-3 text-yellow-400">Features</span>
        </h1>

        <div className="grid grid-cols-1 gap-8 mt-8 xl:mt-12 xl:gap-12 md:grid-cols-2 xl:grid-cols-3">
          <div className="p-8 space-y-3 border-2 border-yellow-400 rounded-xl backdrop-blur-sm hover:scale-105 transition-all duration-300">
            <span className="inline-block text-yellow-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
                />
              </svg>
            </span>

            <h1 className="text-2xl font-semibold text-white capitalize">
              Predictive Ticketing
            </h1>

            <p className="text-gray-300">
              Utilize advanced analytics to predict delays and cancellations,
              allowing users to make informed decisions about their travel
              plans.
            </p>
          </div>

          <div className="p-8 space-y-3 border-2 border-yellow-400 rounded-xl backdrop-blur-sm hover:scale-105 transition-all duration-300">
            <span className="inline-block text-yellow-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
                />
              </svg>
            </span>

            <h1 className="text-2xl font-semibold text-white capitalize">
              Real-Time Ticket Allocation
            </h1>

            <p className="text-gray-300">
              Automatically allocate cancelled tickets to users on the waiting
              list, reducing wait times and ensuring fair distribution of
              tickets.
            </p>
          </div>

          <div className="p-8 space-y-3 border-2 border-yellow-400 rounded-xl backdrop-blur-sm hover:scale-105 transition-all duration-300">
            <span className="inline-block text-yellow-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
            </span>

            <h1 className="text-2xl font-semibold text-white capitalize">
              Max Refund Guarantee
            </h1>

            <p className="text-gray-300">
              Offer users full refunds for cancelled tickets if their tickets
              are successfully sold to someone on the waiting list, reducing
              financial risk for travelers.
            </p>
          </div>

          <div className="p-8 space-y-3 border-2 border-yellow-400 rounded-xl backdrop-blur-sm hover:scale-105 transition-all duration-300">
            <span className="inline-block text-yellow-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
            </span>

            <h1 className="text-2xl font-semibold text-white capitalize">
              Train and Flight Schedule Updates
            </h1>

            <p className="text-gray-300">
              Keep users informed about real-time changes to train and flight
              schedules, allowing them to adjust their plans accordingly and
              avoid unnecessary delays.
            </p>
          </div>
          <div className="p-8 space-y-3 border-2 border-yellow-400 rounded-xl backdrop-blur-sm hover:scale-105 transition-all duration-300">
            <span className="inline-block text-yellow-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
                />
              </svg>
            </span>

            <h1 className="text-2xl font-semibold text-white capitalize">
              Emergency Ticket Booking
            </h1>

            <p className="text-gray-300">
              Provide a feature for users to check for available tickets in
              real-time, allowing them to purchase tickets in emergency and
              facilitates a beneficial transaction.
            </p>
          </div>
          <div className="p-8 space-y-3 border-2 border-yellow-400 rounded-xl backdrop-blur-sm hover:scale-105 transition-all duration-300">
            <span className="inline-block text-yellow-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
                />
              </svg>
            </span>

            <h1 className="text-2xl font-semibold text-white capitalize">
              Fair Pricing Policy
            </h1>

            <p className="text-gray-300">
              Fair pricing policy ensures tickets aren't sold at exorbitant
              rates, especially within one day of travel. This promotes
              affordability, accessibility, and mitigates the financial impact
              of sudden travel emergencies.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComponentSection;
