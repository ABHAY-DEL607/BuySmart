'use client';
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { EXTENSION_ID, API_URL } from '@/services/config';
import SuppressedPath from '@/components/SuppressedPath';

const Login = () => {
    const router = useRouter();
    const [apiStatus, setApiStatus] = useState({ checked: false, online: false });
    const [isLoading, setIsLoading] = useState(false);
    const [loginType, setLoginType] = useState('username'); // 'username' or 'email'

    // Check if the API is online
    useEffect(() => {
        const checkApiStatus = async () => {
            try {
                // Use the health endpoint to check if the API is accessible
                const response = await axios.get(`${API_URL}/health`, { timeout: 3000 });
                console.log('API status check response:', response.data);
                setApiStatus({ checked: true, online: true });
            } catch (error) {
                console.error('API status check failed:', error);
                toast.warning('API server might be offline. Some features may not work properly.');
                setApiStatus({ checked: true, online: false });
            }
        };

        checkApiStatus();
    }, []);

    // Define validation schema with Yup based on login type
    const validationSchema = Yup.object({
        ...(loginType === 'username' ? {
            username: Yup.string().required('Username is required')
        } : {
            email: Yup.string().email('Invalid email format').required('Email is required')
        }),
        password: Yup.string()
            .min(8, 'Password must be at least 8 characters')
            .required('Password is required')
    });

    // Initialize Formik
    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: ''
        },
        validationSchema,
        onSubmit: async (values, { resetForm, setSubmitting }) => {
            try {
                setIsLoading(true);
                // Prepare the right payload based on login type
                const payload = {
                    password: values.password
                };
                
                if (loginType === 'username') {
                    payload.username = values.username;
                } else {
                    payload.email = values.email;
                }
                
                // Use configured API_URL instead of env variable
                const result = await axios.post(`${API_URL}/auth/login`, payload);
                // Store token in localStorage
                localStorage.setItem('token', result.data.token);
                // Store user info if available
                if (result.data.user) {
                    localStorage.setItem('user', JSON.stringify(result.data.user));
                }
                toast.success('Login successful!');

                // Check if user came from extension
                const returnToExtension = localStorage.getItem('return_to_extension');
                console.log('Return to extension flag:', returnToExtension);
                
                if (returnToExtension) {
                    console.log('Detected login from extension - will attempt to communicate back');
                    localStorage.removeItem('return_to_extension'); // Clean up
                    
                    // IMPORTANT: Don't redirect to home when coming from extension
                    setIsLoading(false);
                    
                    // Direct localStorage access - most reliable approach for extension <-> website communication
                    try {
                        // Try to directly set localStorage in the opener (extension) window
                        if (window.opener && !window.opener.closed) {
                            console.log('Detected opener window, attempting direct localStorage access');
                            
                            try {
                                // Store token in both windows
                                localStorage.setItem('token', result.data.token);
                                window.opener.localStorage.setItem('token', result.data.token);
                                
                                toast.success('Login successful! This window will close in 3 seconds.');
                                setTimeout(() => window.close(), 3000);
                                return;
                            } catch (storageErr) {
                                console.error('Could not access opener localStorage:', storageErr);
                            }
                        }
                        
                        // Fall back to other methods if direct access fails
                        console.log('Chrome context check:', {
                            chromeExists: typeof chrome !== 'undefined',
                            runtimeExists: typeof chrome !== 'undefined' && !!chrome.runtime,
                            sendMessageExists: typeof chrome !== 'undefined' && !!chrome.runtime && !!chrome.runtime.sendMessage,
                            extensionId: EXTENSION_ID
                        });
                        
                        // Try chrome.runtime.sendMessage
                        if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage && EXTENSION_ID) {
                            console.log('Sending token to extension via chrome.runtime.sendMessage');
                            try {
                                chrome.runtime.sendMessage(EXTENSION_ID, {
                                    type: 'LOGIN_SUCCESS',
                                    token: result.data.token
                                }, response => {
                                    console.log('Message response:', response);
                                    // Show a message to close the tab manually if auto-close fails
                                    toast.success('Login successful! You can now close this tab and return to the extension.');
                                    // Close this tab after showing the success message
                                    setTimeout(() => {
                                        try {
                                            window.close();
                                            console.log('Window close attempted');
                                        } catch (closeErr) {
                                            console.error('Failed to close window:', closeErr);
                                        }
                                    }, 3000);
                                });
                            } catch (e) {
                                console.error('Error sending message to extension:', e);
                                // Try window.opener as fallback
                                if (window.opener) {
                                    window.opener.postMessage({
                                        type: 'LOGIN_SUCCESS',
                                        token: result.data.token
                                    }, '*');
                                    toast.success('Login successful! You can now close this tab.');
                                } else {
                                    // If all communication methods fail, show a manual instruction
                                    toast.success('Login successful! Please close this tab and return to the extension.');
                                }
                            }
                        } 
                        // Try postMessage
                        else if (window.opener) {
                            console.log('Sending token to extension via window.postMessage');
                            window.opener.postMessage({
                                type: 'LOGIN_SUCCESS',
                                token: result.data.token
                            }, '*');
                            // Show a message to close the tab manually if auto-close fails
                            toast.success('Login successful! You can now close this tab and return to the extension.');
                            // Close this tab after showing the success message
                            setTimeout(() => {
                                try {
                                    window.close();
                                    console.log('Window close attempted');
                                } catch (closeErr) {
                                    console.error('Failed to close window:', closeErr);
                                }
                            }, 3000);
                        } 
                        // Display token for manual use
                        else {
                            console.log('No method to communicate with extension found');
                            console.log('Token for manual use:', result.data.token);
                            toast.success(`Login successful! Please copy this token: ${result.data.token.substring(0, 15)}...`);
                        }
                    } catch (msgError) {
                        console.error('Failed to communicate with extension:', msgError);
                        toast.success('Login successful! Please close this tab and return to the extension.');
                    }
                } else {
                    // Regular website flow - navigate to home page
                    router.push('/home');
                }
                // Reset form
                resetForm();
            } catch (err) {
                console.error(err);
                if (err.code === 'ERR_NETWORK') {
                    toast.error('Unable to connect to server. Please make sure the backend is running.');
                } else if (err.response?.data?.message) {
                    toast.error(err.response.data.message);
                } else {
                    toast.error('Login failed!');
                }
            } finally {
                setIsLoading(false);
                setSubmitting(false);
            }
        }
    });

    // Toggle between username and email login
    const toggleLoginType = () => {
        setLoginType(loginType === 'username' ? 'email' : 'username');
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
                    <p className="text-center text-yellow-700 mt-2">
                        <small>For testing: use <strong>testuser</strong> / <strong>password123</strong> with fallback mode</small>
                    </p>
                </div>
            ) : null}
            
            <div className="bg-white py-6 sm:py-8 lg:py-12">
                <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
                    <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-8 lg:text-3xl">
                        Login
                    </h2>
                    <form 
                        className="mx-auto max-w-lg rounded-lg border"
                        onSubmit={formik.handleSubmit}
                    >
                        <div className="flex flex-col gap-4 p-4 md:p-8">
                            <div className="flex justify-end">
                                <button 
                                    type="button" 
                                    onClick={toggleLoginType}
                                    className="text-sm text-blue-600 hover:text-blue-700 focus:outline-none"
                                >
                                    Login with {loginType === 'username' ? 'email' : 'username'} instead
                                </button>
                            </div>
                            
                            {loginType === 'username' ? (
                                <div>
                                    <label
                                        htmlFor="username"
                                        className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
                                    >
                                        Username
                                    </label>
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.username || ''}
                                        className={`w-full rounded border ${
                                            formik.touched.username && formik.errors.username
                                                ? 'border-red-500' 
                                                : 'border-gray-300'
                                        } bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring`}
                                    />
                                    {formik.touched.username && formik.errors.username ? (
                                        <div className="mt-1 text-sm text-red-500">{formik.errors.username}</div>
                                    ) : null}
                                </div>
                            ) : (
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
                                    >
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.email || ''}
                                        className={`w-full rounded border ${
                                            formik.touched.email && formik.errors.email
                                                ? 'border-red-500' 
                                                : 'border-gray-300'
                                        } bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring`}
                                    />
                                    {formik.touched.email && formik.errors.email ? (
                                        <div className="mt-1 text-sm text-red-500">{formik.errors.email}</div>
                                    ) : null}
                                </div>
                            )}
                            
                            <div>
                                <label
                                    htmlFor="password"
                                    className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
                                >
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.password || ''}
                                    className={`w-full rounded border ${
                                        formik.touched.password && formik.errors.password 
                                            ? 'border-red-500' 
                                            : 'border-gray-300'
                                    } bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring`}
                                />
                                {formik.touched.password && formik.errors.password ? (
                                    <div className="mt-1 text-sm text-red-500">{formik.errors.password}</div>
                                ) : null}
                            </div>
                            <button 
                                type="submit"
                                className="block rounded-lg bg-gray-800 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-gray-300 transition duration-100 hover:bg-gray-700 focus-visible:ring active:bg-gray-600 md:text-base flex justify-center items-center"
                                disabled={formik.isSubmitting || isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24" fill="none" suppressHydrationWarning>
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Logging in...
                                    </>
                                ) : 'Log in'}
                            </button>
                            
                            <div className="relative flex items-center justify-center">
                                <span className="absolute inset-x-0 h-px bg-gray-300" />
                                <span className="relative bg-white px-4 text-sm text-gray-400">
                                    Log in with social
                                </span>
                            </div>
                            
                            <button type="button" className="flex items-center justify-center gap-2 rounded-lg bg-blue-500 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-blue-300 transition duration-100 hover:bg-blue-600 focus-visible:ring active:bg-blue-700 md:text-base">
                                <svg
                                    className="h-5 w-5 shrink-0"
                                    width={24}
                                    height={24}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    suppressHydrationWarning
                                >
                                    <SuppressedPath
                                        d="M12 0C5.37273 0 0 5.37273 0 12C0 18.0164 4.43182 22.9838 10.2065 23.8516V15.1805H7.23764V12.0262H10.2065V9.92727C10.2065 6.45218 11.8996 4.92655 14.7878 4.92655C16.1711 4.92655 16.9025 5.02909 17.2489 5.076V7.82945H15.2787C14.0525 7.82945 13.6244 8.99182 13.6244 10.302V12.0262H17.2178L16.7302 15.1805H13.6244V23.8773C19.4815 23.0825 24 18.0747 24 12C24 5.37273 18.6273 0 12 0Z"
                                        fill="white"
                                    />
                                </svg>
                                Continue with Facebook
                            </button>
                            <button type="button" className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-8 py-3 text-center text-sm font-semibold text-gray-800 outline-none ring-gray-300 transition duration-100 hover:bg-gray-100 focus-visible:ring active:bg-gray-200 md:text-base">
                                <svg
                                    className="h-5 w-5 shrink-0"
                                    width={24}
                                    height={24}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    suppressHydrationWarning
                                >
                                    <SuppressedPath
                                        d="M23.7449 12.27C23.7449 11.48 23.6749 10.73 23.5549 10H12.2549V14.51H18.7249C18.4349 15.99 17.5849 17.24 16.3249 18.09V21.09H20.1849C22.4449 19 23.7449 15.92 23.7449 12.27Z"
                                        fill="#4285F4"
                                    />
                                    <SuppressedPath
                                        d="M12.2549 24C15.4949 24 18.2049 22.92 20.1849 21.09L16.3249 18.09C15.2449 18.81 13.8749 19.25 12.2549 19.25C9.12492 19.25 6.47492 17.14 5.52492 14.29H1.54492V17.38C3.51492 21.3 7.56492 24 12.2549 24Z"
                                        fill="#34A853"
                                    />
                                    <SuppressedPath
                                        d="M5.52488 14.29C5.27488 13.57 5.14488 12.8 5.14488 12C5.14488 11.2 5.28488 10.43 5.52488 9.71V6.62H1.54488C0.724882 8.24 0.254883 10.06 0.254883 12C0.254883 13.94 0.724882 15.76 1.54488 17.38L5.52488 14.29Z"
                                        fill="#FBBC05"
                                    />
                                    <SuppressedPath
                                        d="M12.2549 4.75C14.0249 4.75 15.6049 5.36 16.8549 6.55L20.2749 3.13C18.2049 1.19 15.4949 0 12.2549 0C7.56492 0 3.51492 2.7 1.54492 6.62L5.52492 9.71C6.47492 6.86 9.12492 4.75 12.2549 4.75Z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                Continue with Google
                            </button>
                        </div>
                        <div className="flex items-center justify-center bg-gray-100 p-4">
                            <p className="text-center text-sm text-gray-500">
                                Don't have an account?{" "}
                                <a
                                    href="/signup"
                                    className="text-indigo-500 transition duration-100 hover:text-indigo-600 active:text-indigo-700"
                                >
                                    Register
                                </a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;