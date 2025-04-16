import React from 'react'




const Signup = () => {
  return (
    <div className='flex h-screen items-center justify-center bg-gray-100'>
      <div className="max-w-2xl w-full bg-white p-6 rounded-lg shadow-lg">
        {/* Title section */}
        <div className="text-2xl font-medium relative pb-4">
          Registration
          <div className="absolute left-0 bottom-0 h-[3px] w-[30px] rounded-lg bg-gradient-to-r from-blue-400 to-purple-600"></div>
        </div>
        <div className="content">
          {/* Registration form */}
          <form action="#">
            <div className="user-details flex flex-wrap justify-between mb-6">
              {/* Input for Full Name */}
              <div className="input-box mb-4 w-[calc(50%-10px)]">
                <span className="details block font-medium mb-1">Full Name</span>
                <input type="text" placeholder="Enter your name" required className="h-12 w-full px-4 border border-gray-300 rounded-md focus:border-purple-600 transition-all" />
              </div>
              {/* Input for Username */}
              <div className="input-box mb-4 w-[calc(50%-10px)]">
                <span className="details block font-medium mb-1">Username</span>
                <input type="text" placeholder="Enter your username" required className="h-12 w-full px-4 border border-gray-300 rounded-md focus:border-purple-600 transition-all" />
              </div>
              {/* Input for Email */}
              <div className="input-box mb-4 w-[calc(50%-10px)]">
                <span className="details block font-medium mb-1">Email</span>
                <input type="email" placeholder="Enter your email" required className="h-12 w-full px-4 border border-gray-300 rounded-md focus:border-purple-600 transition-all" />
              </div>
              {/* Input for Phone Number */}
              <div className="input-box mb-4 w-[calc(50%-10px)]">
                <span className="details block font-medium mb-1">Phone Number</span>
                <input type="text" placeholder="Enter your number" required className="h-12 w-full px-4 border border-gray-300 rounded-md focus:border-purple-600 transition-all" />
              </div>
              {/* Input for Password */}
              <div className="input-box mb-4 w-[calc(50%-10px)]">
                <span className="details block font-medium mb-1">Password</span>
                <input type="password" placeholder="Enter your password" required className="h-12 w-full px-4 border border-gray-300 rounded-md focus:border-purple-600 transition-all" />
              </div>
              {/* Input for Confirm Password */}
              <div className="input-box mb-4 w-[calc(50%-10px)]">
                <span className="details block font-medium mb-1">Confirm Password</span>
                <input type="password" placeholder="Confirm your password" required className="h-12 w-full px-4 border border-gray-300 rounded-md focus:border-purple-600 transition-all" />
              </div>
            </div>
            <div className="gender-details mb-6">
              {/* Gender selection */}
              <span className="gender-title text-xl font-medium block mb-2">Gender</span>
              <div className="category flex space-x-6">
                {/* Male option */}
                <label htmlFor="dot-1" className="flex items-center cursor-pointer">
                  <input type="radio" name="gender" id="dot-1" className="hidden" />
                  <span className="dot h-4 w-4 rounded-full bg-gray-300 mr-2 transition-all"></span>
                  <span className="gender">Male</span>
                </label>
                {/* Female option */}
                <label htmlFor="dot-2" className="flex items-center cursor-pointer">
                  <input type="radio" name="gender" id="dot-2" className="hidden" />
                  <span className="dot h-4 w-4 rounded-full bg-gray-300 mr-2 transition-all"></span>
                  <span className="gender">Female</span>
                </label>
                {/* Prefer not to say option */}
                <label htmlFor="dot-3" className="flex items-center cursor-pointer">
                  <input type="radio" name="gender" id="dot-3" className="hidden" />
                  <span className="dot h-4 w-4 rounded-full bg-gray-300 mr-2 transition-all"></span>
                  <span className="gender">Prefer not to say</span>
                </label>
              </div>
            </div>
            {/* Submit button */}
            <div className="button">
              <input type="submit" value="Register" className="h-12 w-full rounded-md bg-gradient-to-r from-blue-400 to-purple-600 text-white font-semibold cursor-pointer transition-all hover:bg-gradient-to-l" />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Signup
