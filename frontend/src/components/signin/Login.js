import React, { useEffect, useState } from 'react'
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"
import { API_BASE_URL } from '../../utils/config';

const Login = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const isLoggedInUser=localStorage.getItem('emailData');
        if(isLoggedInUser){
            navigate('/');
        }
    }, [])
    
    const onSignIn = async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}/users/login`, user);
            
            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userData', JSON.stringify(response.data.data));
                
                toast.success("Signed in Successfully");
                navigate('/');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || "Login failed";
            toast.error(errorMessage);
        }
    };

    const [user, setUser] = useState({
        email: "",
        password: ""
    });

    return (
        <div className="relative w-full min-h-screen flex items-center justify-center pt-16 my-8">
            <div className="absolute inset-0 z-0">
                <img
                    src="./img/gif2.gif"
                    alt="Travel Background"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>
            </div>

            <div className="relative z-10 w-full max-w-md p-8 rounded-2xl backdrop-blur-sm border-2 border-yellow-400/30 mx-4">
                <Toaster position="top-center" />

                <h1 className="text-4xl font-extrabold text-white mb-8 text-center">
                    Welcome <span className="text-yellow-400">Back</span>
                </h1>

                <div className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-base font-medium text-white">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="mt-1 block w-full rounded-xl border border-yellow-400/30 bg-transparent px-5 py-3 text-base text-white outline-none focus:border-yellow-400 focus:shadow-md"
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
                            onChange={(e) => setUser({ ...user, password: e.target.value })}
                        />
                    </div>

                    <div className="text-center text-white">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-yellow-400 hover:text-yellow-300 transition-colors">
                            Sign Up
                        </Link>
                    </div>

                    <button
                        onClick={onSignIn}
                        className="group w-full px-6 py-3 text-base font-semibold bg-yellow-400 text-gray-900 rounded-xl hover:bg-yellow-300 transform hover:scale-110 hover:shadow-lg hover:shadow-yellow-400/50 transition-all duration-300 ease-in-out flex items-center justify-center backdrop-blur-sm"
                    >
                        Login
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-3 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login