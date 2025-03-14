import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import image from '../assets/icons8-github-logo-48.png';
import Nimage from '../assets/pexels-anush-1229356.jpg'

const Register = () => {
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        
        // Clear error htmlFor this field when user starts typing
        if (errors[e.target.name]) {
            setErrors({
                ...errors,
                [e.target.name]: null
            });
        }
    };
    
    const validateData = () => {
        const newErrors = {};

        // Validate full name
        if (!formData.fullName || !formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }

        // Validate email
        if (!formData.email || !formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        
        // Validate password
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        
        if (!formData.comfirmpassword){
            newErrors.comfirmpassword = 'Password comfirmation is required';
        } else if (formData.comfirmpassword.length < 6){
            newErrors.comfirmpassword = 'Password must be at least 6 characters';
        } else if (formData.comfirmpassword != formData.password){
            newErrors.comfirmpassword = 'passwods are not matched';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (validateData()) {
            console.log('submet succece fully');
            try {
                const res = await fetch('/api/auth/signup', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                });
                console.log('fetch fully');
                const data = await res.json();
                
                if (res.ok) {
                    navigate('/login');
                } else {
                    // Handle server errors
                    setErrors({
                        ...errors,
                        server: data.message || 'Registration failed'
                    });
                }
            } catch (error) {
                console.error(error);
                setErrors({
                    ...errors,
                    server: 'Connection error. Please try again.'
                });
            }
        }
    }
    console.log(formData)

    return (
        <div className="font-[sans-serif]">
            <div className="min-h-screen flex fle-col items-center justify-center py-6 px-4" id="login">
                <div className="grid md:grid-cols-2 items-center gap-10 max-w-6xl max-md:max-w-md w-full">
                    <form className="max-w-md md:ml-auto w-full" onSubmit={handleSubmit}>
                        <h3 className="text-gray-100 text-3xl font-extrabold mb-3">
                            Create an account
                        </h3>
                        
                        {errors.server && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                {errors.server}
                            </div>
                        )}
                        
                        <div className="space-y-4">
                            <div>
                                <input 
                                    name="fullName" 
                                    type="text" 
                                    className ='bg-gray-900 w-full text-sm text-gray-100 px-4 py-3.5 rounded-md focus:bg-transparent'
                                    placeholder="Full Name" 
                                    onChange={handleChange} 
                                />
                                {errors.fullName && (
                                    <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                                )}
                            </div>
                            
                            <div>
                                <input 
                                    name="email" 
                                    type="email" 
                                    autoComplete="email" 
                                    className="bg-gray-900 w-full text-sm text-gray-100 px-4 py-3.5 rounded-md focus:bg-transparent" 
                                    placeholder="Email address" 
                                    onChange={handleChange} 
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                )}
                            </div>
                            
                            <div>
                                <input 
                                    name="password" 
                                    type="password" 
                                    autoComplete="new-password" 
                                    className="bg-gray-900 w-full text-sm text-gray-100 px-4 py-3.5 rounded-md focus:bg-transparent" 
                                    placeholder="Password" 
                                    onChange={handleChange} 
                                />
                                {errors.password && (
                                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                                )}
                            </div>

                            <div>
                                <input 
                                    name="comfirmpassword" 
                                    type="password" 
                                    autoComplete="comfirmpassword" 
                                    className="bg-gray-900 w-full text-sm text-gray-100 px-4 py-3.5 rounded-md focus:bg-transparent" 
                                    placeholder="Comfirme Password" 
                                    onChange={handleChange} 
                                />
                                {errors.comfirmpassword && (
                                    <p className="text-red-500 text-sm mt-1">{errors.comfirmpassword}</p>
                                )}
                            </div>
                        </div>
                        
                        <div className="inline-flex items-center py-4">
                            <label className="flex items-center cursor-pointer relative" htmlFor="ripple-off">
                                <input type="checkbox"
                                className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-slate-800 checked:border-slate-800"
                                name="role" 
                                onChange={(e) => handleChange({ target: { name: 'role', value: e.target.checked ? 'admin' : 'user' } })}
                                id="ripple-off" />
                                <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"
                                    stroke="currentColor" strokeWidth="1">
                                    <path fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"></path>
                                </svg>
                                </span>
                            </label>
                            <label className="cursor-pointer ml-3 text-slate-600 text-sm" htmlFor="check-ripple-off">
                                Admin
                            </label>
                        </div>
                        
        
                        <div className="!mt-1">
                            <button 
                                type="submit" 
                                className="w-full shadow-xl py-2.5 px-4 text-sm font-semibold rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                            >
                                Create an account
                            </button>
                        </div>
                        
                        <div className="!mt-4">
                            <Link to="/login">
                                <button 
                                    type="button" 
                                    className="w-full shadow-xl py-2.5 px-4 text-sm font-semibold rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                                >
                                    Sign In
                                </button>
                            </Link>
                        </div>
        
                        <div className="my-4 flex items-center gap-4">
                            <hr className="w-full border-gray-300" />
                            <p className="text-sm text-gray-400 text-center">or</p>
                            <hr className="w-full border-gray-300" />
                        </div>
        
                        <div className="space-x-6 flex justify-center">
                            
                            <button type="button" className="border-none outline-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32px" viewBox="0 0 512 512">
                                    <path fill="#1877f2" d="M512 256c0 127.78-93.62 233.69-216 252.89V330h59.65L367 256h-71v-48.02c0-20.25 9.92-39.98 41.72-39.98H370v-63s-29.3-5-57.31-5c-58.47 0-96.69 35.44-96.69 99.6V256h-65v74h65v178.89C93.62 489.69 0 383.78 0 256 0 114.62 114.62 0 256 0s256 114.62 256 256z" data-original="#1877f2" />
                                    <path fill="#fff" d="M355.65 330 367 256h-71v-48.021c0-20.245 9.918-39.979 41.719-39.979H370v-63s-29.296-5-57.305-5C254.219 100 216 135.44 216 199.6V256h-65v74h65v178.889c13.034 2.045 26.392 3.111 40 3.111s26.966-1.066 40-3.111V330z" data-original="#ffffff" />
                                </svg>
                            </button>
                            
                            <button type="button" className="border-none outline-none w-10">
                                <img src={image} alt="GitHub" />
                            </button>
                        </div>
                    </form>

                    {/* Image section */}
                    <div className="grid min-h-[140px] w-full place-items-center overflow-x-scroll rounded-lg p-6 lg:overflow-visible">
                        <figure className="relative w-full h-96">
                            <img 
                                className="object-cover object-center w-full h-full rounded-xl"
                                src={Nimage}
                                alt="nature image" 
                            />
                            <figcaption className="absolute bottom-8 left-2/4 flex w-[calc(100%-4rem)] -translate-x-2/4 justify-between rounded-xl border border-white bg-white/75 py-4 px-6 shadow-lg shadow-black/5 saturate-200 backdrop-blur-sm">
                                <div>
                                    <h5 className="text-xl font-medium text-slate-800">
                                        Aymane Elkhadraoui
                                    </h5>
                                    <p className="mt-2 text-slate-600">
                                        20 July 2025
                                    </p>
                                </div>
                            </figcaption>
                        </figure>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;