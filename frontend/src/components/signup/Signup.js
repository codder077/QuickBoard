import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "../../utils/config";

const SignUp = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
        navigate('/');
    }
  }, [navigate]);

  const [user, setUser] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });

  const onSignup = async () => {
    try {
      if (isNaN(user.phone)) {
        toast.error("Phone number must be numeric");
        return;
      }

      const response = await axios.post(
        `${API_BASE_URL}/users/register`,
        {
          ...user,
          phone: Number(user.phone)
        }
      );

      if (response.data.success) {
        toast.success("Registration successful!");
        navigate("/login");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Signup failed";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center pt-16 mt-8">
      <div className="absolute inset-0 z-0">
        <img
          src="./img/gif2.gif"
          alt="Travel Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>
      </div>

      <div className="relative z-10 w-full max-w-md p-8 rounded-2xl backdrop-blur-sm border-2 border-yellow-400/30 mx-4">
        <h1 className="text-4xl font-extrabold text-white mb-8 text-center">
          Create Your <span className="text-yellow-400">Account</span>
        </h1>

        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-base font-medium text-white">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              className="mt-1 block w-full rounded-xl border border-yellow-400/30 bg-transparent px-5 py-3 text-base text-white outline-none focus:border-yellow-400 focus:shadow-md"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-base font-medium text-white">
              Phone Number
            </label>
            <input
              type="number"
              id="phone"
              className="mt-1 block w-full rounded-xl border border-yellow-400/30 bg-transparent px-5 py-3 text-base text-white outline-none focus:border-yellow-400 focus:shadow-md"
              value={user.phone}
              onChange={(e) => setUser({ ...user, phone: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-base font-medium text-white">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full rounded-xl border border-yellow-400/30 bg-transparent px-5 py-3 text-base text-white outline-none focus:border-yellow-400 focus:shadow-md"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-base font-medium text-white">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full rounded-xl border border-yellow-400/30 bg-transparent px-5 py-3 text-base text-white outline-none focus:border-yellow-400 focus:shadow-md"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
          </div>

          <p className="text-gray-300 text-sm">
            By creating an account, you agree to QuickBoard's{" "}
            <Link to="/terms" className="text-yellow-400 hover:text-yellow-300">
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-yellow-400 hover:text-yellow-300">
              Privacy Policy
            </Link>
            .
          </p>

          <div className="text-center">
            <p className="text-gray-300">
              Already a User?{" "}
              <Link to="/login" className="text-yellow-400 hover:text-yellow-300">
                Sign In
              </Link>
            </p>
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 text-base font-semibold bg-yellow-400 text-gray-900 rounded-xl hover:bg-yellow-300 transform hover:scale-105 hover:shadow-lg hover:shadow-yellow-400/50 transition-all duration-300 ease-in-out"
            onClick={onSignup}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
