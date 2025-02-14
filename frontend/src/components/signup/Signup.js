import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedInUser = localStorage.getItem("emailData");
    if (isLoggedInUser) {
      navigate("/");
    }
  }, []);
  const [user, setUser] = useState({
    fullname: "",
    phone: "",
    email: "",
    password: "",
  });

  const onSignup = async () => {
    console.log("hello");
    // e.preventDefault();
    try {
      console.log(user);
      console.log("Frontend");
      const response = await axios.post(
        "http://localhost:8000/api/register",
        user
      );
      console.log(response);
      // router.push("/signin");

      navigate("/login");
    } catch (error) {
      console.log("Signup failed ", error.message);
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className="flex flex-col w-[20rem] mt-[10vh] container gap-[1.5rem] mx-auto mb-[5rem]">
        <div>
          <h1 className="merriweather-font font-bold text-3xl mt-8">
            Create Your Account
          </h1>
        </div>
        <div className="flex flex-col">
          <h2 className="merriweather-font font-bold text-[1rem]">Full Name</h2>
          <input
            type="text"
            className="border-2 border-zinc-300  px-[1rem] py-[0.6rem] "
            value={user.fullname}
            id="fullname"
            onChange={(e) => setUser({ ...user, fullname: e.target.value })}
          />
        </div>

        <div className="flex flex-col">
          <h2 className="merriweather-font font-bold text-[1rem]">Phone Number</h2>
          <input
            type="Number"
            className="border-2 border-zinc-300  px-[1rem] py-[0.6rem] "
            value={user.phone}
            id="phone"
            onChange={(e) => setUser({ ...user, phone: e.target.value })}
          />
        </div>
        <div className="flex flex-col">
          <h2 className="merriweather-font font-bold text-[1rem]">Email Address</h2>
          <input
            type="text"
            className="border-2 border-zinc-300  px-[1rem] py-[0.6rem]  "
            value={user.email}
            id="email"
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
        </div>
        <div className="flex flex-col">
          <h2 className="merriweather-font font-bold text-[1rem]">Password</h2>
          <input
            type="password"
            className="border-2 border-zinc-300   px-[1rem] py-[0.6rem] "
            id="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />
        </div>

        <div>
          <p className="text-gray-500">
            By creating an account, You agree to{" "}
            <span className="text-orange-400">
              {" "}
              QuickBoard&apos;s Terms & Conditions{" "}
            </span>{" "}
            and Privacy Policy.
          </p>
        </div>
        <div>
          <p className="text-gray-500">Already a User! </p>
          <span
            className="text-orange-500 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Sign In
          </span>
        </div>
        <div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
            onClick={onSignup}
          >
            Register
          </button>
        </div>
      </div>
    </>
  );
};

export default SignUp;
