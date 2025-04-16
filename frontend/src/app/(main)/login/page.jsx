import React from 'react';

const LoginPage = () => {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-fixed flex items-center justify-center"
      style={{
        backgroundImage:
          'url("https://img.freepik.com/premium-photo/abstract-blur-beautiful-luxury-shopping-mall_1339-35305.jpg?uid=R194951663&ga=GA1.1.1115346199.1743943450&semt=ais_hybrid&w=740")',
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/40 z-0" />

      {/* Form Container */}
      <div className="relative z-10 w-full max-w-md p-8 space-y-6 bg-white/70 rounded-lg shadow-xl backdrop-blur-xl">
        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-indigo-800">
          Welcome Back to Buy Smart
        </h2>
        <p className="text-center text-indigo-600">Please log in to continue</p>

        {/* Login Form */}
        <form className="space-y-5">
          {/* Email Field */}
          <div className="relative">
            <input
              type="email"
              id="email"
              required
              placeholder="Email Address"
              className="w-full p-4 pl-12 text-black placeholder-gray-600 border-2 border-gray-300 rounded-full focus:border-indigo-600 focus:ring-2 focus:ring-indigo-300 outline-none transition"
            />
            <i className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 fas fa-envelope" />
          </div>

          {/* Password Field */}
          <div className="relative">
            <input
              type="password"
              id="password"
              required
              placeholder="Password"
              className="w-full p-4 pl-12 text-black placeholder-gray-600 border-2 border-gray-300 rounded-full focus:border-indigo-600 focus:ring-2 focus:ring-indigo-300 outline-none transition"
            />
            <i className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 fas fa-lock" />
          </div>

          {/* Remember & Forgot */}
          <div className="flex justify-between items-center text-sm text-gray-700">
            <label className="flex items-center">
              <input type="checkbox" className="w-4 h-4 text-indigo-600" />
              <span className="ml-2">Remember me</span>
            </label>
            <a href="#" className="text-indigo-500 hover:underline">
              Forgot password?
            </a>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white font-semibold text-lg rounded-full hover:bg-indigo-700 transition duration-200"
          >
            Log In
          </button>
        </form>

        {/* Signup Link */}
        <p className="text-center text-sm text-gray-700">
          Don't have an account?{' '}
          <a href="#" className="text-indigo-500 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;