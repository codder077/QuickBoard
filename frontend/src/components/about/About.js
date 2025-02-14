import React from "react";

function About({ iconSrc, title, description }) {
  return (
    <div className="relative">
      <dt>
        <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
          <img src={iconSrc} alt="icon" />
        </div>
        <p className="font-heading ml-16 text-lg leading-6 font-bold text-blue-500">
          {title}
        </p>
      </dt>
      <dd className="mt-2 ml-16 text-base text-gray-500">{description}</dd>
    </div>
  );
}

function Abouts() {
  return (
    <section className="">
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="font-heading mb-4   px-4 py-2 rounded-lg md:w-64 md:mx-auto text-xs font-semibold tracking-widest text-black uppercase title-font">
              Why choose us?
            </h2>
            <p className="font-heading mt-2 text-3xl leading-8 font-semibold tracking-tight text-blue-500 sm:text-4xl">
              About Us
            </p>
            <p className="mt-4 max-w-2xl text-lg text-gray-500 lg:mx-auto">
              "We're dedicated to revolutionizing travel with seamless
              solutions. Through innovation and a focus on customer
              satisfaction, we strive to optimize every aspect of the journey.
              Join us in shaping the future of travel convenience and
              satisfaction."
            </p>
          </div>

          <div className="mt-10">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <About
                iconSrc="https://www.svgrepo.com/show/503163/api-settings.svg"
                title="Innovative Solutions"
                description=" QuickBoard offers revolutionary ticket booking solutions powered by predictive analytics and cutting-edge technology."
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
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Abouts;
