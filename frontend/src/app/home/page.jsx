'use client';
import { useState } from 'react';

export default function Home() {
  const [product, setProduct] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCompare = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowResults(true);
    }, 1500);
  };

  const logos = [
    { name: 'Amazon', logo: '/amazon.png' },
    { name: 'Flipkart', logo: '/flipkart.png' },
    { name: 'Meesho', logo: '/meesho.png' },
    { name: 'Myntra', logo: '/myntra.png' },
    { name: 'Snapdeal', logo: '/snapdeal.png' },
  ];

  return (
    <div
      className="min-h-screen bg-cover bg-center relative text-white"
      style={{ backgroundImage: "url('/shopping-mall-blur.jpg')" }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>

      <div className="relative z-10 flex flex-col items-center px-4 py-12 space-y-10">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 animate-pulse drop-shadow-lg">
          BuySmart
        </h1>

        <div className="w-full max-w-xl">
          <input
            type="text"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            placeholder="Enter a product name..."
            className="w-full px-6 py-4 text-lg rounded-xl text-black outline-none focus:ring-4 ring-pink-400"
          />
          <button
            onClick={handleCompare}
            className="mt-4 w-full py-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-pink-500 hover:to-purple-600 transition-all text-white text-lg font-semibold rounded-lg shadow-md"
          >
            Compare
          </button>
        </div>

        {/* Logos */}
        <div className="flex justify-center items-center gap-6 flex-wrap mt-8">
          {logos.map((site) => (
            <div key={site.name} className="text-center group">
              <img
                src={site.logo}
                alt={site.name}
                className="w-14 h-14 grayscale group-hover:grayscale-0 transform group-hover:scale-110 transition-all duration-300"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/56';
                }}
              />
              <p className="mt-1 text-sm">{site.name}</p>
            </div>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-10">
            <div className="w-12 h-12 border-4 border-pink-500 border-dashed rounded-full animate-spin"></div>
            <p className="mt-2">Fetching best deals...</p>
          </div>
        )}

        {/* Results */}
        {showResults && !loading && (
          <div className="w-full max-w-4xl mt-10 bg-black bg-opacity-50 p-6 rounded-xl shadow-xl text-left">
            <h2 className="text-2xl font-bold mb-4">Comparison Results</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {logos.map((site) => (
                <div key={site.name} className="flex items-center gap-4 p-4 bg-white bg-opacity-10 rounded-lg">
                  <img
                    src={site.logo}
                    alt={site.name}
                    className="w-12 h-12"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/48';
                    }}
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{site.name}</h3>
                    <p>₹{(20000 + Math.floor(Math.random() * 2000)).toLocaleString()} — <span className="text-sm italic">Best Price</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} BuySmart — All rights reserved.
        </footer>
      </div>
    </div>
  );
}