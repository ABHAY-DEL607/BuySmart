import React from 'react';

const ContactUs = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1470&q=80')",
      }}
    >
      <div className="bg-white bg-opacity-90 backdrop-blur-lg shadow-2xl p-10 rounded-xl w-full max-w-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 tracking-wide">Get in Touch</h2>
        <form className="space-y-5">
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">Name</label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">Message</label>
            <textarea
              rows="5"
              placeholder="Write your message..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 resize-none"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition duration-200 shadow-lg"
          >
            Send Message
          </button>
        </form>
        <p className="mt-6 text-sm text-gray-600 text-center">
          We'll get back to you within 24 hours!
        </p>
      </div>
    </div>
  );
};

export default ContactUs;