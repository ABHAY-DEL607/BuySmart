import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Footer = () => {
  return (
    <footer className="text-white">
      {/* Top Section */}
      <div className="bg-gradient-to-br from-blue-700 via-purple-600 to-pink-600 py-10">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div>
            <h3 className="text-xl font-bold mb-4">Buy Smart</h3>
            <p className="text-sm text-gray-200">Your one-stop comparison tool to find the best deals across top e-commerce platforms.</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-100">
              <li><a href="#" className="hover:text-white">Home</a></li>
              <li><a href="#" className="hover:text-white">Compare</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
              <li><a href="#" className="hover:text-white">Login</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm text-gray-100">
              <li><a href="#" className="hover:text-white">Mobiles</a></li>
              <li><a href="#" className="hover:text-white">Laptops</a></li>
              <li><a href="#" className="hover:text-white">Headphones</a></li>
              <li><a href="#" className="hover:text-white">Watches</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-6 items-center">
              <div className="flex flex-col items-center hover:text-blue-400 transition">
                <i className="fab fa-facebook-f text-2xl"></i>
                <span className="text-sm mt-1">Facebook</span>
              </div>
              <div className="flex flex-col items-center hover:text-sky-400 transition">
                <i className="fab fa-twitter text-2xl"></i>
                <span className="text-sm mt-1">Twitter</span>
              </div>
              <div className="flex flex-col items-center hover:text-pink-400 transition">
                <i className="fab fa-instagram text-2xl"></i>
                <span className="text-sm mt-1">Instagram</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Section */}
      <div className="bg-gray-900 py-4 text-center text-sm text-gray-300">
        &copy; 2025 Buy Smart. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;