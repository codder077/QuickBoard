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
    <footer className="relative w-full mt-10 p-4 bg-gray-200">
      <div className="mx-auto w-full max-w-7xl px-8">
        <div className="grid grid-cols-1 justify-between gap-4 md:grid-cols-2">
          <Typography variant="h5" className="mb-6 text-2xl">
            Quick
            <span className="text-blue-500">Board</span>
          </Typography>
          <div className="grid grid-cols-3 justify-between gap-4">
            {LINKS.map(({ title, items }) => (
              <ul key={title}>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-3 font-medium opacity-40"
                >
                  {title}
                </Typography>
                {items.map((link) => (
                  <li key={link}>
                    <Typography
                      as="a"
                      href="#"
                      color="gray"
                      className="py-1.5 font-normal transition-colors hover:text-blue-gray-900"
                    >
                      {link}
                    </Typography>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
        <hr className="border-black my-4" /> {/* Horizontal line */}
        <div className="mt-4 flex w-full flex-col items-center justify-center md:flex-row md:justify-between">
          <Typography
            variant="small"
            className="mb-4 text-center font-normal text-blue-gray-900 md:mb-0"
          >
            &copy; {currentYear}{" "}
            <a href="https://material-tailwind.com/">Quick Board Pvt Ltd</a>.
            All Rights Reserved.
          </Typography>
          <div className="flex gap-4 text-blue-gray-900 sm:justify-center">
            <Typography
              as="a"
              href="#"
              className="opacity-80 transition-opacity hover:opacity-100"
            >
              <FaFacebook />
            </Typography>
            <Typography
              as="a"
              href="#"
              className="opacity-80 transition-opacity hover:opacity-100"
            >
              <FaInstagram />
            </Typography>
            <Typography
              as="a"
              href="#"
              className="opacity-80 transition-opacity hover:opacity-100"
            >
              <FaTwitter />
            </Typography>
            <Typography
              as="a"
              href="#"
              className="opacity-80 transition-opacity hover:opacity-100"
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
