import React, { useEffect, useState } from 'react'
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom"

const Login = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const isLoggedInUser=localStorage.getItem('emailData');
        if(isLoggedInUser){
            navigate('/');
        }
    
      
    }, [])
    
    const onSignIn = async () => {

        console.log("jk");
        try {
            console.log(user);

            const response = await axios.post("http://localhost:8000/api/login", user);
            
            localStorage.setItem('emailData',user.email);
            toast.success(response.data.message);
            console.log("Signed in Succesfully");
            // router.push("/trading");
            window.location.reload();
            // navigate("/");
        } catch (error) {
            console.log("Signin failed", error.message);
            toast.error(error.message);
        }

    };
    const [user, setUser] = useState({
        email: "",
        password: ""
    });
    return (
        <>
            <div className="flex flex-col w-[20rem] mt-[10vh] container gap-[1.5rem] mx-auto mb-[5rem]">
                <Toaster position="top-center" />

                <div>
                    <h1 className="merriweather-font font-bold text-[2rem]">Login</h1>
                </div>

                <div className="flex flex-col">
                    <h2 className="merriweather-font font-bold text-[1rem]">Email Id</h2>
                    <input
                        type="text"
                        className="border-2 border-zinc-300  px-[1rem] py-[0.6rem]  "
                        name={user.email}
                        id="email"
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                    />
                </div>
                <div className="flex flex-col">
                    <h2 className="merriweather-font font-bold text-[1rem]">Password</h2>
                    <input
                        type="password"
                        className="border-2 border-zinc-300   px-[1rem] py-[0.6rem] "
                        name={user.password}
                        id="password"
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                    />
                </div>

                <div>
                    <p className="text-gray-500">
                        Don&apos;t have any account!{" "}
                    </p>
                    <span className="text-orange-500">Sign Up</span>
                </div>
                <div>
                    <button
                        className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
                        onClick={onSignIn}
                    >
                        Login
                    </button>
                </div>
            </div>
        </>
    );
}

export default Login