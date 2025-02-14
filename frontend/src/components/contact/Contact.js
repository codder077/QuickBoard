import React from "react";

const Contact = () => {
  return (
    <div className="bg-black/90">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-wrap lg:justify-between">
          <div className="w-full lg:w-1/2 xl:w-6/12">
            <div className="mb-12 max-w-[570px] lg:mb-0">
              <h2 className="text-3xl font-extrabold text-white capitalize lg:text-4xl">
                Get In
                <span className="mx-3 text-yellow-400">Touch</span>
              </h2>
              <p className="mt-4 text-lg text-gray-300 leading-relaxed">
                Reach out to us for any questions, feedback, or assistance.
                Our team is dedicated to providing prompt and personalized
                support to address your needs effectively. Get in touch via
                the contact form or provided contact information. We're here
                to help!
              </p>

              <div className="mt-8 space-y-6">
                <div className="flex items-center">
                  <div className="flex h-[60px] w-[60px] items-center justify-center rounded bg-yellow-400/10">
                    <svg width="24" height="24" viewBox="0 0 24 24" className="text-yellow-400">
                      <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 2.88-2.88 7.19-5 9.88C9.92 16.21 7 11.85 7 9z"/>
                      <circle cx="12" cy="9" r="2.5" fill="currentColor"/>
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-xl font-bold text-white">Our Location</h4>
                    <p className="text-gray-300">Block-4, XYZ, New-Delhi</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="flex h-[60px] w-[60px] items-center justify-center rounded bg-yellow-400/10">
                    <svg width="24" height="24" viewBox="0 0 24 24" className="text-yellow-400">
                      <path fill="currentColor" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-xl font-bold text-white">Email Address</h4>
                    <p className="text-gray-300">contact@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="flex h-[60px] w-[60px] items-center justify-center rounded bg-yellow-400/10">
                    <svg width="24" height="24" viewBox="0 0 24 24" className="text-yellow-400">
                      <path fill="currentColor" d="M20 15.5c-1.25 0-2.45-.2-3.57-.57a1.02 1.02 0 0 0-1.02.24l-2.2 2.2a15.045 15.045 0 0 1-6.59-6.59l2.2-2.21a.96.96 0 0 0 .25-1A11.36 11.36 0 0 1 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1zM19 12h2a9 9 0 0 0-9-9v2c3.87 0 7 3.13 7 7zm-4 0h2c0-2.76-2.24-5-5-5v2c1.66 0 3 1.34 3 3z"/>
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-xl font-bold text-white">Phone Number</h4>
                    <p className="text-gray-300">(+91)1234 567 890</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 xl:w-5/12">
            <div className="relative rounded-xl bg-black/50 p-8 backdrop-blur-sm border-2 border-yellow-400/30">
              <form>
                <div className="mb-6">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full rounded-xl border border-yellow-400/30 bg-transparent px-5 py-3 text-base text-white outline-none focus:border-yellow-400 focus:shadow-md"
                  />
                </div>
                <div className="mb-6">
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full rounded-xl border border-yellow-400/30 bg-transparent px-5 py-3 text-base text-white outline-none focus:border-yellow-400 focus:shadow-md"
                  />
                </div>
                <div className="mb-6">
                  <input
                    type="text"
                    placeholder="Your Phone"
                    className="w-full rounded-xl border border-yellow-400/30 bg-transparent px-5 py-3 text-base text-white outline-none focus:border-yellow-400 focus:shadow-md"
                  />
                </div>
                <div className="mb-6">
                  <textarea
                    rows="6"
                    placeholder="Your Message"
                    className="w-full resize-none rounded-xl border border-yellow-400/30 bg-transparent px-5 py-3 text-base text-white outline-none focus:border-yellow-400 focus:shadow-md"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full rounded-xl bg-yellow-400 px-6 py-3 text-base font-semibold text-gray-900 transition hover:bg-yellow-300 hover:shadow-lg hover:shadow-yellow-400/50 transform hover:scale-105"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
