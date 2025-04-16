'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Home = () => {
  const [showResults, setShowResults] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [showFilters, setShowFilters] = useState(false); // New for dropdown toggle

  const handleCompare = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setNotFound(true);
      setShowResults(false);
    } else {
      setNotFound(false);
      setLoading(true);
      setShowResults(false);
      setTimeout(() => {
        setLoading(false);
        setShowResults(true);
      }, 2000);
    }
  };

  const sites = [
    { name: 'Amazon', src: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
    { name: 'Flipkart', src: 'data:image/jpeg;base64,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' },
    { name: 'Meesho', src: 'https://upload.wikimedia.org/wikipedia/commons/8/80/Meesho_Logo_Full.png' },
    { name: 'Myntra', src: 'data:image/png;base64,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' },
    { name: 'Snapdeal', src: 'data:image/png;base64,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' },
  ];

  const results = [
    { name: 'Amazon', price: '₹79,999', img: sites[0].src },
    { name: 'Flipkart', price: '₹78,499', img: sites[1].src },
    { name: 'Meesho', price: '₹80,999', img: sites[2].src },
    { name: 'Myntra', price: '₹77,899', img: sites[3].src, bestDeal: true },
    { name: 'Snapdeal', price: '₹79,499', img: sites[4].src },
  ];

  return (
    <div
    className="min-h-screen flex flex-col bg-cover bg-fixed text-white"
    style={{
      backgroundImage:
        'url("https://img.freepik.com/free-photo/arrangement-black-friday-shopping-carts-with-copy-space_23-2148667047.jpg")',
    }}
  >
      {/* Header */}
      <header className="bg-black/70 p-4">
        <div className="container mx-auto flex justify-between items-center px-4">
          <h1 className="text-4xl font-extrabold font-bebas text-indigo-400 animate-pulse tracking-wider">BuySmart</h1>
          <nav>
            <ul className="flex space-x-6 text-lg font-montserrat">
              <li><a href="#" className="hover:underline">Home</a></li>
              <li><a href="#" className="hover:underline">About</a></li>
              <li><a href="#" className="hover:underline">Contact</a></li>
              <li><a href="#" className="hover:underline">Login</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow px-4 py-10 bg-black/60 text-center">
        <div className="max-w-6xl mx-auto space-y-10">
          {/* Instruction */}
          <motion.h2
  initial={{ opacity: 0, y: -30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 1.2, type: 'spring', stiffness: 100 }}
  className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-300 font-oswald animate-pulse drop-shadow-[0_0_8px_rgba(250,204,21,0.8)] text-center"
>
  Save time and money by comparing top online stores.
</motion.h2>
          {/* Logos */}
          {/* Logos */}
<div className="flex justify-center gap-8 flex-wrap mx-auto">
  {sites.map((site, index) => (
    <div
      key={index}
      className="w-24 flex flex-col items-center p-3 rounded-md bg-white/10 backdrop-blur-md hover:bg-white/20 transition duration-300 shadow-md"
    >
      <img
        src={site.src}
        alt={site.name}
        className="h-10 transition-transform duration-300 hover:scale-110 drop-shadow-[0_1px_4px_rgba(255,255,255,0.7)]"
      />
      <p className="mt-2 text-sm text-white font-semibold">{site.name}</p>
    </div>
  ))}
</div>

          {/* Search */}
          <form
            onSubmit={handleCompare}
            className="flex flex-col sm:flex-row justify-center items-center sm:space-x-4 space-y-4 sm:space-y-0 mx-auto"
          >
            <input
              type="text"
              placeholder="e.g. iPhone 13"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-2/3 p-3 rounded-md bg-black/30 border border-gray-400 text-white placeholder-white font-inter focus:outline-none"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-montserrat font-semibold"
            >
              Compare
            </button>
          </form>

          {/* Product Not Found */}
          {notFound && (
            <p className="text-red-400 mt-4 font-semibold text-lg">Please enter a product name to compare.</p>
          )}

          {/* Loading Animation */}
          {loading && (
            <div className="flex justify-center items-center mt-10">
              <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
            </div>
          )}

          {/* Results Section */}
          {showResults && (
            <>
             {/* Comparison Results */}
<div className="bg-black/60 backdrop-blur-lg p-8 mt-12 rounded-2xl shadow-xl max-w-6xl mx-auto border border-white/20">
<h3
  className="text-4xl text-center font-oswald font-bold tracking-wide mb-8 text-cyan-400 animate-pulse animate-glow"
  style={{
    textShadow: '0 0 10px rgba(0, 255, 255, 0), 0 0 20px rgba(255, 187, 0, 0.6)',
  }}
>
  Top Deals Overview
</h3>

  {/* Filter Toggle Button */}
  <div className="text-right mb-6">
    <button
      onClick={() => setShowFilters(!showFilters)}
      className="bg-cyan-600/90 hover:bg-cyan-700 text-white px-5 py-2 rounded-md font-montserrat font-semibold transition"
    >
      {showFilters ? 'Hide Filters' : 'Show Filters'}
    </button>
  </div>

  {/* Filters Section */}
  {showFilters && (
    <div className="bg-white/10 backdrop-blur-lg p-5 rounded-lg text-white font-inter border border-white/20 mb-8">
      <h4 className="text-xl font-semibold font-oswald mb-4 text-white/90">
        Filters
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="flex items-center">
          <input type="checkbox" className="mr-2 accent-cyan-500" /> Show Only Available
        </label>
        <label className="flex items-center">
          <input type="checkbox" className="mr-2 accent-cyan-500" /> Price &lt; ₹80,000
        </label>
        <label className="flex items-center">
          <input type="checkbox" className="mr-2 accent-cyan-500" /> Best Deal First
        </label>
        <label className="flex items-center">
          <input type="checkbox" className="mr-2 accent-cyan-500" /> Include Offers
        </label>
      </div>
    </div>
  )}

  {/* Results Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 text-center">
    {results.map((site, index) => (
      <div
        key={index}
        className={`p-5 rounded-xl shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-xl border ${
          site.bestDeal
            ? 'bg-green-600/80 border-yellow-400'
            : 'bg-white/10 border-white/10'
        }`}
      >
        <img
          src={site.img}
          alt={site.name}
          className="h-10 mx-auto mb-3 drop-shadow-[0_1px_4px_rgba(255,255,255,0.6)]"
        />
        <h4 className="text-lg font-semibold text-white font-montserrat">{site.name}</h4>
        <p className="mt-2 text-white font-inter">{site.price}</p>
        {site.bestDeal && (
          <div className="mt-2 text-yellow-300 text-xs font-semibold animate-pulse">
            Best Deal
          </div>
        )}
      </div>
    ))}
  </div>

  {/* View Details Button */}
  <div className="text-center mt-10">
    <button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-3 rounded-lg font-montserrat font-semibold shadow-md transition">
      View Detailed Comparison
    </button>
  </div>
</div>
            </>
          )}
        </div>
      </main>

      {/* Reviews */}
      <section className="bg-white/10 p-6 rounded-md font-inter mx-auto max-w-6xl">
        <h3 className="text-xl font-bold text-white mb-4 font-oswald">What Our Users Say</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-white">
          {[
            { text: "BuySmart saved me a lot of money while buying my new phone!", user: "Rahul S." },
            { text: "Easy to use and very helpful when comparing different sites.", user: "Priya K." },
            { text: "Highly recommend it to anyone shopping online!", user: "Ankit R." },
          ].map((review, i) => (
            <div key={i} className="bg-black/30 p-4 rounded-md hover:bg-black/40 transition">
              <p>"{review.text}"</p>
              <span className="block mt-2 text-yellow-300 font-semibold">- {review.user}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Help Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-full font-bold shadow-lg">
          Need Help?
        </button>
      </div>

      {/* Footer */}
      <footer className="bg-black/80 p-4 text-center text-white mt-auto font-inter">
        <p>© 2025 BuySmart. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
