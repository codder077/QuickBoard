import { Typography } from "@material-tailwind/react";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

const LINKS = [
  {
    title: "About ",
    items: ["About Us", "Features", "Services", "Contact Us", "Values"],
  },
  {
    title: "Info",
    items: ["T&C", "Privacy Policy", "FAQ", "User Registration", "Partners"],
  },
  {
    title: "Resource",
    items: ["Blog", "Newsletter", "Events", "Help center"],
  },
];

const currentYear = new Date().getFullYear();

function FooterWithSocialLinks() {
  return (
    <footer className="relative w-full p-4 bg-black/90 border-t-2 border-yellow-400/30">
      <div className="mx-auto w-full max-w-7xl px-8 mt-10">
        <div className="grid grid-cols-1 justify-between gap-4 md:grid-cols-2">
          <Typography variant="h5" className="mb-6 text-2xl text-white">
            Quick
            <span className="text-yellow-400 mx-2">Board</span>
          </Typography>
          <div className="grid grid-cols-3 justify-between gap-4">
            {LINKS.map(({ title, items }) => (
              <ul key={title}>
                <Typography
                  variant="small"
                  className="mb-3 font-medium text-yellow-400"
                >
                  {title}
                </Typography>
                {items.map((link) => (
                  <li key={link}>
                    <Typography
                      as="a"
                      href="#"
                      className="py-1.5 font-normal text-gray-100 transition-all duration-300 hover:text-yellow-400"
                    >
                      {link}
                    </Typography>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
        <hr className="border-yellow-400/30 my-4" />
        <div className="mt-4 flex w-full flex-col items-center justify-center md:flex-row md:justify-between">
          <Typography
            variant="small"
            className="mb-4 text-center font-normal text-gray-100 md:mb-0"
          >
            &copy; {currentYear}{" "}
            <a href="https://material-tailwind.com/" className="text-yellow-400 hover:text-yellow-300 transition-all duration-300">
              Quick Board Pvt Ltd
            </a>
            . All Rights Reserved.
          </Typography>
          <div className="flex gap-4 text-yellow-400 sm:justify-center">
            <Typography
              as="a"
              href="#"
              className="opacity-80 transition-all duration-300 hover:opacity-100 hover:scale-110"
            >
              <FaFacebook />
            </Typography>
            <Typography
              as="a"
              href="#"
              className="opacity-80 transition-all duration-300 hover:opacity-100 hover:scale-110"
            >
              <FaInstagram />
            </Typography>
            <Typography
              as="a"
              href="#"
              className="opacity-80 transition-all duration-300 hover:opacity-100 hover:scale-110"
            >
              <FaTwitter />
            </Typography>
            <Typography
              as="a"
              href="#"
              className="opacity-80 transition-all duration-300 hover:opacity-100 hover:scale-110"
            >
              <FaLinkedin />
            </Typography>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default FooterWithSocialLinks;
