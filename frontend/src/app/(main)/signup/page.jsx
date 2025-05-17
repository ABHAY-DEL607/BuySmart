'use client';
import axios from 'axios';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { EXTENSION_ID } from '@/services/config';
import { API_URL } from '@/services/config';
import { toast } from 'react-hot-toast';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import SuppressedPath from '@/components/SuppressedPath';

const SignupSchema = Yup.object().shape({
    username: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().required('Password nhi hai tumhara?')
        .min(8, 'minimum 8 characters')
        .matches(/[a-z]/, 'lowercase letter is required')
        .matches(/[A-Z]/, 'uppercase letter is required')
        .matches(/[0-9]/, 'number is required')
        .matches(/\W/, 'special character is required'),
    confirmPassword: Yup.string().required('confirm password is required')
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
});

const Signup = () => {
    const router = useRouter();
    const [apiStatus, setApiStatus] = useState({ checked: false, online: false });
    const [isLoading, setIsLoading] = useState(false);

    // Check if the API is online
    React.useEffect(() => {
        const checkApiStatus = async () => {
            try {
                // Use the health endpoint to check if the API is accessible
                const response = await axios.get(`${API_URL}/health`, { timeout: 3000 });
                console.log('API status check response:', response.data);
                setApiStatus({ checked: true, online: true });
            } catch (error) {
                console.error('API status check failed:', error);
                toast.error('API server might be offline. Some features may not work properly.');
                setApiStatus({ checked: true, online: false });
            }
        };

        checkApiStatus();
    }, []);

    const signupForm = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
        },
        validationSchema: SignupSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                setIsLoading(true);
                console.log('Attempting to register with:', { 
                    username: values.username, 
                    email: values.email,
                    passwordLength: values.password.length 
                });
                
                // Register the new user
                const res = await axios.post(`${API_URL}/auth/register`, {
                    username: values.username,
                    email: values.email,
                    password: values.password
                });
                
                console.log('Registration response:', { 
                    status: res.status,
                    hasToken: !!res.data.token,
                    hasUser: !!res.data.user
                });
                
                // If we got a token directly from registration, use it
                if (res.data.token) {
                    localStorage.setItem('token', res.data.token);
                    if (res.data.user) {
                        localStorage.setItem('user', JSON.stringify(res.data.user));
                    }
                    
                    toast.success('Account created and logged in successfully!');
                    handlePostLoginActions(res.data.token);
                } else {
                    // Otherwise, try auto-login
                    try {
                        const loginRes = await axios.post(`${API_URL}/auth/login`, {
                            username: values.username, // Try with username first
                            password: values.password
                        });
                        
                        const token = loginRes.data.token;
                        localStorage.setItem('token', token);
                        if (loginRes.data.user) {
                            localStorage.setItem('user', JSON.stringify(loginRes.data.user));
                        }
                        
                        toast.success('Account created and logged in successfully!');
                        handlePostLoginActions(token);
                    } catch (loginError) {
                        // If login with username fails, try with email
                        try {
                            const loginWithEmailRes = await axios.post(`${API_URL}/auth/login`, {
                                email: values.email,
                                password: values.password
                            });
                            
                            const token = loginWithEmailRes.data.token;
                            localStorage.setItem('token', token);
                            if (loginWithEmailRes.data.user) {
                                localStorage.setItem('user', JSON.stringify(loginWithEmailRes.data.user));
                            }
                            
                            toast.success('Account created and logged in successfully!');
                            handlePostLoginActions(token);
                        } catch (emailLoginError) {
                            // If both login attempts fail, redirect to login page
                            console.error('Auto-login failed:', emailLoginError);
                            toast.success('Account created! Please login with your credentials.');
                            router.push('/login');
                        }
                    }
                }
            } catch (error) {
                setIsLoading(false);
                console.error('Registration error details:', { 
                    name: error.name,
                    message: error.message,
                    code: error.code,
                    status: error.response?.status,
                    responseData: error.response?.data,
                });
                
                if (error.code === 'ERR_NETWORK') {
                    toast.error('Unable to connect to server. Please make sure the backend is running.');
                } else if (error.response?.data?.message) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error('Registration failed. Please try again.');
                }
            } finally {
                setSubmitting(false);
            }
        }
    });

    // Handle post-login actions (redirect or extension message)
    const handlePostLoginActions = (token) => {
        // Check if user came from extension
        const returnToExtension = localStorage.getItem('return_to_extension');
        console.log('Return to extension flag:', returnToExtension);
        
        if (returnToExtension) {
            localStorage.removeItem('return_to_extension');
            setIsLoading(false);
            try {
                // Try chrome.runtime.sendMessage first
                if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage && EXTENSION_ID) {
                    chrome.runtime.sendMessage(EXTENSION_ID, {
                        type: 'SIGNUP_SUCCESS',
                        token: token
                    }, response => {
                        setTimeout(() => {
                            try { window.close(); } catch (e) {}
                        }, 2000);
                    });
                } else if (window.opener) {
                    // Fallback: Use window.opener.postMessage
                    window.opener.postMessage({
                        type: 'SIGNUP_SUCCESS',
                        token: token
                    }, '*');
                    setTimeout(() => {
                        try { window.close(); } catch (e) {}
                    }, 2000);
                } else {
                    toast.success('Account created! Please close this tab and return to the extension.');
                }
            } catch (msgError) {
                toast.success('Account created! Please close this tab and return to the extension.');
            }
            return;
        } else {
            // Regular website flow - redirect to home
            setIsLoading(false);
            router.push('/home');
        }
    };

    return (
        <div>
            {!apiStatus.checked ? (
                <div className="max-w-lg mx-auto mt-7 p-4 bg-blue-50 border border-blue-200 rounded-xl shadow-2xs">
                    <p className="text-center text-blue-700">Checking server connection...</p>
                </div>
            ) : !apiStatus.online ? (
                <div className="max-w-lg mx-auto mt-7 p-4 bg-yellow-50 border border-yellow-200 rounded-xl shadow-2xs">
                    <p className="text-center text-yellow-700">
                        Warning: Backend server appears to be offline. 
                        Please make sure it's running for full functionality.
                    </p>
                </div>
            ) : null}
            
            <div className="max-w-lg mx-auto mt-7 bg-white border border-gray-200 rounded-xl shadow-2xs dark:bg-neutral-900 dark:border-neutral-700">
                <div className="p-4 sm:p-7">
                    <div className="text-center">
                        <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">Sign up</h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
                            Already have an account?
                            <a className="text-blue-600 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium dark:text-blue-500" href="/login">
                                Sign in here
                            </a>
                        </p>
                    </div>

                    <div className="mt-5">
                        <button type="button" className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800">
                            <svg className="w-4 h-auto" width="46" height="47" viewBox="0 0 46 47" fill="none" suppressHydrationWarning>
                                <SuppressedPath d="M46 24.0287C46 22.09 45.8533 20.68 45.5013 19.2112H23.4694V27.9356H36.4069C36.1429 30.1094 34.7347 33.37 31.5957 35.5731L31.5663 35.8669L38.5191 41.2719L38.9885 41.3306C43.4477 37.2181 46 31.1669 46 24.0287Z" fill="#4285F4" />
                                <SuppressedPath d="M23.4694 47C29.8061 47 35.1161 44.9144 39.0179 41.3012L31.625 35.5437C29.6301 36.9244 26.9898 37.8937 23.4987 37.8937C17.2793 37.8937 12.0281 33.7812 10.1505 28.1412L9.88649 28.1706L2.61097 33.7812L2.52296 34.0456C6.36608 41.7125 14.287 47 23.4694 47Z" fill="#34A853" />
                                <SuppressedPath d="M10.1212 28.1413C9.62245 26.6725 9.32908 25.1156 9.32908 23.5C9.32908 21.8844 9.62245 20.3275 10.0918 18.8588V18.5356L2.75765 12.8369L2.52296 12.9544C0.909439 16.1269 0 19.7106 0 23.5C0 27.2894 0.909439 30.8731 2.49362 34.0456L10.1212 28.1413Z" fill="#FBBC05" />
                                <SuppressedPath d="M23.4694 9.07688C27.8699 9.07688 30.8622 10.9863 32.5344 12.5725L39.1645 6.11C35.0867 2.32063 29.8061 0 23.4694 0C14.287 0 6.36607 5.2875 2.49362 12.9544L10.0918 18.8588C11.9987 13.1894 17.25 9.07688 23.4694 9.07688Z" fill="#EB4335" />
                            </svg>
                            Sign up with Google
                        </button>

                        <div className="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6 dark:text-neutral-500 dark:before:border-neutral-600 dark:after:border-neutral-600">Or</div>

                        {/* Form */}
                        <form onSubmit={signupForm.handleSubmit}>
                            <div className="grid gap-y-4">
                                {/* Username Field */}
                                <div>
                                    <label htmlFor="username" className="block text-sm mb-2 dark:text-white">Username</label>
                                    <div className="relative">
                                        <input type="text"
                                            id="username"
                                            onChange={signupForm.handleChange}
                                            value={signupForm.values.username}
                                            className="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" aria-describedby="username-error" />
                                        <div className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                                            <svg className="size-5 text-red-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true" suppressHydrationWarning>
                                                <SuppressedPath d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                                            </svg>
                                        </div>
                                    </div>
                                    {
                                        (signupForm.touched.username && signupForm.errors.username) && (
                                            <p className="text-xs text-red-600 mt-2" id="username-error">
                                                {signupForm.errors.username}
                                            </p>
                                        )
                                    }
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label htmlFor="email" className="block text-sm mb-2 dark:text-white">Email address</label>
                                    <div className="relative">
                                        <input type="email"
                                            id="email"
                                            onChange={signupForm.handleChange}
                                            value={signupForm.values.email}
                                            className="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" aria-describedby="email-error" />
                                        <div className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                                            <svg className="size-5 text-red-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true" suppressHydrationWarning>
                                                <SuppressedPath d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                                            </svg>
                                        </div>
                                    </div>
                                    {
                                        (signupForm.touched.email && signupForm.errors.email) && (
                                            <p className="text-xs text-red-600 mt-2" id="email-error">
                                                {signupForm.errors.email}
                                            </p>
                                        )
                                    }
                                </div>

                                {/* Password Field */}
                                <div>
                                    <label htmlFor="password" className="block text-sm mb-2 dark:text-white">Password</label>
                                    <div className="relative">
                                        <input type="password" id="password"
                                            onChange={signupForm.handleChange}
                                            value={signupForm.values.password}
                                            className="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" aria-describedby="password-error" />
                                        
                                        <div className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                                            <svg className="size-5 text-red-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true" suppressHydrationWarning>
                                                <SuppressedPath d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                                            </svg>
                                        </div>
                                    </div>
                                    
                                    {/* Password requirements checklist */}
                                    <div className="mt-2 space-y-1">
                                        <p className="text-xs text-gray-600 font-medium dark:text-neutral-400 mb-1">
                                            Password requirements:
                                        </p>
                                        <div className={`text-xs flex items-center ${signupForm.values.password.length >= 8 ? 'text-green-600' : 'text-gray-500'}`}>
                                            <span className="mr-1">{signupForm.values.password.length >= 8 ? '✓' : '○'}</span> 
                                            At least 8 characters
                                        </div>
                                        <div className={`text-xs flex items-center ${/[a-z]/.test(signupForm.values.password) ? 'text-green-600' : 'text-gray-500'}`}>
                                            <span className="mr-1">{/[a-z]/.test(signupForm.values.password) ? '✓' : '○'}</span> 
                                            At least 1 lowercase letter
                                        </div>
                                        <div className={`text-xs flex items-center ${/[A-Z]/.test(signupForm.values.password) ? 'text-green-600' : 'text-gray-500'}`}>
                                            <span className="mr-1">{/[A-Z]/.test(signupForm.values.password) ? '✓' : '○'}</span> 
                                            At least 1 uppercase letter
                                        </div>
                                        <div className={`text-xs flex items-center ${/[0-9]/.test(signupForm.values.password) ? 'text-green-600' : 'text-gray-500'}`}>
                                            <span className="mr-1">{/[0-9]/.test(signupForm.values.password) ? '✓' : '○'}</span> 
                                            At least 1 number
                                        </div>
                                        <div className={`text-xs flex items-center ${/\W/.test(signupForm.values.password) ? 'text-green-600' : 'text-gray-500'}`}>
                                            <span className="mr-1">{/\W/.test(signupForm.values.password) ? '✓' : '○'}</span> 
                                            At least 1 special character
                                        </div>
                                    </div>
                                    
                                    {
                                        (signupForm.touched.password && signupForm.errors.password) && (
                                            <p className="text-xs text-red-600 mt-2" id="password-error">
                                                {signupForm.errors.password}
                                            </p>
                                        )
                                    }
                                </div>

                                {/* Confirm Password Field */}
                                <div>
                                    <label htmlFor="confirm-password" className="block text-sm mb-2 dark:text-white">Confirm Password</label>
                                    <div className="relative">
                                        <input type="password" id="confirmPassword"
                                            onChange={signupForm.handleChange}
                                            value={signupForm.values.confirmPassword}
                                            className="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" aria-describedby="confirm-password-error" />
                                        <div className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                                            <svg className="size-5 text-red-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true" suppressHydrationWarning>
                                                <SuppressedPath d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                                            </svg>
                                        </div>
                                    </div>
                                    {
                                        (signupForm.touched.confirmPassword && signupForm.errors.confirmPassword) && (
                                            <p className="text-xs text-red-600 mt-2" id="confirm-password-error">
                                                {signupForm.errors.confirmPassword}
                                            </p>
                                        )
                                    }
                                </div>

                                {/* Terms and Conditions Checkbox */}
                                <div className="flex items-center">
                                    <div className="flex">
                                        <input id="remember-me" name="remember-me" type="checkbox" className="shrink-0 mt-0.5 border-gray-200 rounded-sm text-blue-600 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" />
                                    </div>
                                    <div className="ms-3">
                                        <label htmlFor="remember-me" className="text-sm dark:text-white">I accept the <a className="text-blue-600 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium dark:text-blue-500" href="#">Terms and Conditions</a></label>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button 
                                    type="submit" 
                                    className={`w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent 
                                    ${!signupForm.isValid || !signupForm.dirty ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} 
                                    text-white focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none`}
                                    disabled={isLoading || !signupForm.isValid || !signupForm.dirty}
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24" fill="none" suppressHydrationWarning>
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Creating Account...
                                        </>
                                    ) : !signupForm.isValid && signupForm.dirty ? 'Please fix form errors' : 'Sign up'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;