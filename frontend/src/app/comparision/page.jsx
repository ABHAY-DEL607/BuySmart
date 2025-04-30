"use client";

import React, { useState } from "react";

const products = [
  {
    id: 1,
    site: "Amazon",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    productImage: "https://m.media-amazon.com/images/I/315vs3rLEZL.SL500.jpg",
    price: 34999,
    discount: "10% off",
    rating: 4,
    reviews: 1230,
    deliveryTime: 2, // in days
    deliveryPrice: 100,
    platformFee: 49,
    link: "https://www.amazon.in/dp/example",
    availability: "In Stock",
    feedback: "Quick delivery and reliable service.",
    specs: {
      processor: "Snapdragon 8 Gen 2",
      ram: "8GB",
      storage: "128GB",
      display: '6.7" AMOLED, 120Hz',
      camera: "50MP + 12MP Dual",
      battery: "5000mAh",
      os: "Android 14",
    },
  },
  {
    id: 2,
    site: "Flipkart",
    logo: "https://tse4.mm.bing.net/th?id=OIP.cnrLFSg62df-g-S9GG_1IgHaB8&pid=Api&P=0&h=220",
    productImage: "https://rukminim2.flixcart.com/image/832/832/l0igvww0/mobile/2/g/r/-original-imagca5kqvhuscnv.jpeg?q=70&crop=false",
    price: 33999,
    discount: "12% off",
    rating: 4,
    reviews: 1450,
    deliveryTime: 1,
    deliveryPrice: 80,
    platformFee: 40,
    link: "https://www.flipkart.com/product-link",
    availability: "In Stock",
    feedback: "Packaging was good, delivered fast.",
    specs: {
      processor: "Snapdragon 8 Gen 2",
      ram: "8GB",
      storage: "128GB",
      display: '6.7" AMOLED, 120Hz',
      camera: "50MP + 12MP Dual",
      battery: "5000mAh",
      os: "Android 14",
    },
  },
  {
    id: 3,
    site: "JioMart",
    logo: "https://tse3.mm.bing.net/th?id=OIP.e3Mqt4iIAMl_kRtD9e6jeQAAAA&pid=Api&P=0&h=220",
    productImage: "https://www.jiomart.com/images/product/original/491997700/apple-iphone-13-128-gb-starlight-digital-o491997700-p590798551-0-202208221207.jpeg?im=Resize=(420,420)",
    price: 35499,
    discount: "8% off",
    rating: 3,
    reviews: 670,
    deliveryTime: 3,
    deliveryPrice: 120,
    platformFee: 30,
    link: "https://www.jiomart.com/product-link",
    availability: "Limited Stock",
    feedback: "Took longer than expected.",
    specs: {
      processor: "Snapdragon 8 Gen 2",
      ram: "8GB",
      storage: "128GB",
      display: '6.7" AMOLED, 120Hz',
      camera: "50MP + 12MP Dual",
      battery: "5000mAh",
      os: "Android 14",
    },
  },
  {
    id: 4,
    site: "eBay",
    logo: "https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg",
    productImage: "https://i.ebayimg.com/thumbs/images/g/s~MAAOSwEnplD2rd/s-l1200.webp",
    price: 34199,
    discount: "9% off",
    rating: 3,
    reviews: 920,
    deliveryTime: 2,
    deliveryPrice: 90,
    platformFee: 35,
    link: "https://www.ebay.in/product-link",
    availability: "In Stock",
    feedback: "Affordable shipping and decent service.",
    specs: {
      processor: "Snapdragon 8 Gen 2",
      ram: "8GB",
      storage: "128GB",
      display: '6.7" AMOLED, 120Hz',
      camera: "50MP + 12MP Dual",
      battery: "5000mAh",
      os: "Android 14",
    },
  },
  {
    id: 5,
    site: "Paytm Mall",
    logo: "https://tse4.mm.bing.net/th?id=OIP.bWQ3aG57c_cY72dYLXnmEAHaC9&pid=Api&P=0&h=220",
    productImage: "https://n4.sdlcdn.com/imgs/k/e/x/large/Samsung-Galaxy-M13-64GB-4GB-SDL185216633-1-7ba1b.jpg",
    price: 36000,
    discount: "7% off",
    rating: 3,
    reviews: 510,
    deliveryTime: 4,
    deliveryPrice: 150,
    platformFee: 20,
    link: "https://paytmmall.com/product-link",
    availability: "Out of Stock",
    feedback: "Delivery charges are too high.",
    specs: {
      processor: "Snapdragon 8 Gen 2",
      ram: "8GB",
      storage: "128GB",
      display: '6.7" AMOLED, 120Hz',
      camera: "50MP + 12MP Dual",
      battery: "5000mAh",
      os: "Android 14",
    },
  },
];

const ProductComparison = () => {
  const [sortedProducts, setSortedProducts] = useState(products);

  const handleFilter = (value) => {
    let sorted = [...products];

    if (value === "price-asc") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (value === "price-desc") {
      sorted.sort((a, b) => b.price - a.price);
    } else if (value === "delivery-time") {
      sorted.sort((a, b) => a.deliveryTime - b.deliveryTime);
    } else if (value === "delivery-price") {
      sorted.sort((a, b) => a.deliveryPrice - b.deliveryPrice);
    }

    setSortedProducts(sorted);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-center mb-10 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-pink-500 animate-fadeInUp">
          BuySmart Product Comparison
        </h1>

        {/* Filter Dropdown */}
        <div className="flex justify-center mb-8 ">
          <select
            onChange={(e) => handleFilter(e.target.value)}
            className="px-4 py-2 rounded bg-blue-200 text-sm border shadow hover:border-blue-500 focus:outline-none hover:bg-blue-300"
          >
            <option value="">Apply Filters</option>
            <option value="price-asc">Sort by Price: Low to High</option>
            <option value="price-desc">Sort by Price: High to Low</option>
            <option value="delivery-time">Sort by Delivery Time (Fastest)</option>
            <option value="delivery-time">Sort by Delivery Price (highest)</option>
            <option value="delivery-price">Sort by Delivery Price (Lowest)</option>
          </select>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {sortedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md p-4 text-center transition-transform transform hover:scale-105 hover:shadow-xl animate-fadeInUp"
            >
              <a href={product.link} target="_blank" rel="noopener noreferrer">
                <img src={product.logo} alt={product.site} className="h-8 mx-auto mb-4" />
              </a>
              <img src={product.productImage} alt={product.site + " Product"} className="w-24 h-24 object-cover mx-auto mb-4 rounded" />
              <p className="font-semibold text-sm">Smartphone XYZ</p>
              <p className="text-xs text-gray-500">Model: XYZ-123</p>
              <p className="text-sm mt-1">₹{product.price.toLocaleString()}</p>
              <p className="text-green-500 text-xs mb-1">{product.discount}</p>
              <p className="text-yellow-500 text-sm">
                {"★".repeat(product.rating)}{"☆".repeat(5 - product.rating)}
              </p>
              <p className={`text-xs mb-1 font-semibold ${product.availability === "Out of Stock" ? "text-red-500" : "text-green-500"}`}>
                {product.availability}
              </p>
              <p className="text-xs text-gray-600 mb-1">Delivery: {product.deliveryTime} days, ₹{product.deliveryPrice}</p>
              <p className="text-xs text-gray-600 mb-2">Platform Fee: ₹{product.platformFee}</p>

              {/* Specs */}
              <div className="text-xs text-gray-600 text-left mb-2">
                <p><strong>Processor:</strong> {product.specs.processor}</p>
                <p><strong>RAM:</strong> {product.specs.ram}</p>
                <p><strong>Storage:</strong> {product.specs.storage}</p>
                <p><strong>Display:</strong> {product.specs.display}</p>
                <p><strong>Camera:</strong> {product.specs.camera}</p>
                <p><strong>Battery:</strong> {product.specs.battery}</p>
                <p><strong>OS:</strong> {product.specs.os}</p>
              </div>


              <a href={product.link} target="_blank" rel="noopener noreferrer">
                <button className="bg-blue-600 text-white px-4 py-1 rounded text-sm hover:bg-blue-700">
                  Buy Now
                </button>
              </a>
            </div>
          ))}
        </div>
        <section className="bg-white/10 p-6 rounded-md font-inter mx-auto max-w-6xl">
        <h3 className="text-xl font-bold text-white mb-4 font-oswald">What Our Users Say</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-white">
          {[
            { text: "BuySmart saved me a lot of money while buying my new phone!", user: "Rahul S." },
            { text: "Easy to use and very helpful when comparing different sites.", user: "Priya K." },
            { text: "Highly recommend it to anyone shopping online!", user: "Ankit R." },
          ].map((review, i) => (
            <div key={i} className="bg-blue-500 p-4 rounded-md hover:bg-blue-600 transition">
              <p>"{review.text}"</p>
              <span className="block mt-2 text-yellow-300 font-semibold">- {review.user}</span>
            </div>
          ))}
        </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-600 animate-fadeInUp">
          &copy; {new Date().getFullYear()} BuySmart. All rights reserved.
        </footer>
      </div>

      

      {/* Help Button */}
      <button
        onClick={() => alert("Need help? Contact support@buysmart.com")}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition"
      >
        Help
      </button>
    </div>
  );
};

export default ProductComparison;
                

