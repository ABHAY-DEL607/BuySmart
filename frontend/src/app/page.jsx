'use client';
import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import Image from 'next/image';
import Head from 'next/head';

const HomePage = () => {
  const [compareQuery, setCompareQuery] = useState('');
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const canvasRef = useRef(null);
  const modalRef = useRef(null);

  // Handle compare form submission
  const handleCompare = (e) => {
    e.preventDefault();
    console.log('Comparing:', compareQuery);
    // Placeholder for API call
  };

  // Handle newsletter signup
  const handleNewsletterSignup = (e) => {
    e.preventDefault();
    console.log('Newsletter signup:', newsletterEmail);
    setNewsletterEmail('');
    // Placeholder for API call
  };

  // Toggle help modal
  const toggleHelp = () => {
    setIsHelpOpen(!isHelpOpen);
  };

  // Keyboard support for modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isHelpOpen) setIsHelpOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isHelpOpen]);

  // Focus modal when opened
  useEffect(() => {
    if (isHelpOpen) modalRef.current?.focus();
  }, [isHelpOpen]);

  // E-commerce Themed 3D Background
  useEffect(() => {
    if (!canvasRef.current) return;

    try {
      const scene = new THREE.Scene();

      // Gradient background (navy to indigo)
      const gradientTexture = new THREE.CanvasTexture(
        (() => {
          const canvas = document.createElement('canvas');
          canvas.width = 512;
          canvas.height = 512;
          const context = canvas.getContext('2d');
          const gradient = context.createLinearGradient(0, 0, 0, 512);
          gradient.addColorStop(0, '#0a0a1a');
          gradient.addColorStop(1, '#1e1e3f');
          context.fillStyle = gradient;
          context.fillRect(0, 0, 512, 512);
          return canvas;
        })()
      );
      scene.background = gradientTexture;

      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Lighting
      const ambientLight = new THREE.AmbientLight(0x4040ff, 0.3);
      scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0x8888ff, 0.7);
      directionalLight.position.set(10, 10, 10);
      scene.add(directionalLight);

      // E-commerce product icons (simplified cubes)
      const productCount = 15;
      const products = new THREE.Group();
      const productTypes = [
        { color: 0x4682b4, size: 0.8, label: '📱' }, // Smartphone
        { color: 0x2f4f4f, size: 1.0, label: '💻' }, // Laptop
        { color: 0x6a5acd, size: 0.7, label: '🛒' }, // Shopping Cart
        { color: 0x20b2aa, size: 0.6, label: '🎧' }, // Earbuds
      ];

      for (let i = 0; i < productCount; i++) {
        const type = productTypes[i % productTypes.length];
        const geometry = new THREE.BoxGeometry(type.size, type.size, type.size);
        const material = new THREE.MeshStandardMaterial({
          color: type.color,
          metalness: 0.2,
          roughness: 0.8,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(
          (Math.random() - 0.5) * 40,
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 20
        );
        mesh.userData = {
          speed: Math.random() * 0.002 + 0.001,
          float: Math.random() * Math.PI * 2,
        };
        products.add(mesh);

        // Deal tag sprite
        const spriteCanvas = document.createElement('canvas');
        spriteCanvas.width = 128;
        spriteCanvas.height = 128;
        const ctx = spriteCanvas.getContext('2d');
        ctx.fillStyle = '#ff4500';
        ctx.beginPath();
        ctx.arc(64, 64, 50, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('-20%', 64, 64);

        const spriteMap = new THREE.CanvasTexture(spriteCanvas);
        const spriteMaterial = new THREE.SpriteMaterial({
          map: spriteMap,
          transparent: true,
          opacity: 0.7,
        });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(0.5, 0.5, 1);
        sprite.position.set(0.8, 0.8, 0.8);
        mesh.add(sprite);
      }
      scene.add(products);

      camera.position.z = 30;

      // Mouse interaction
      let mouseX = 0, mouseY = 0;
      const onMouseMove = (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      };
      window.addEventListener('mousemove', onMouseMove);

      // Animation loop
      const clock = new THREE.Clock();
      const animate = () => {
        requestAnimationFrame(animate);
        const time = clock.getElapsedTime();

        // Animate products
        products.children.forEach((mesh) => {
          const { speed, float } = mesh.userData;
          mesh.rotation.x += speed;
          mesh.rotation.y += speed;
          mesh.position.y += Math.sin(time * 0.5 + float) * 0.02;
          const sprite = mesh.children[0];
          if (sprite) {
            sprite.position.x = Math.sin(time * 0.3) * 0.8;
            sprite.position.y = Math.cos(time * 0.3) * 0.8;
          }
        });

        // Parallax
        products.rotation.x = mouseY * 0.03;
        products.rotation.y = mouseX * 0.03;

        renderer.render(scene, camera);
      };
      animate();

      // Handle resize
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', onMouseMove);
        renderer.dispose();
        gradientTexture.dispose();
      };
    } catch (error) {
      console.error('Three.js initialization failed:', error);
    }
  }, []);

  const topDeals = [
    {
      name: 'Smartphone X',
      originalPrice: '₹35,000',
      discountedPrice: '₹29,999',
      platform: 'Amazon',
      image: 'https://images.unsplash.com/photo-1511707171634-5f89772885ad',
      link: '/deal/smartphone-x',
    },
    {
      name: 'Laptop Pro',
      originalPrice: '₹85,000',
      discountedPrice: '₹79,999',
      platform: 'Flipkart',
      image: 'https://images.pexels.com/photos/1266984/pexels-photo-1266984.jpeg',
      link: '/deal/laptop-pro',
    },
    {
      name: 'Wireless Earbuds',
      originalPrice: '₹5,000',
      discountedPrice: '₹3,499',
      platform: 'JioMart',
      image: 'https://images.pexels.com/photos/8534777/pexels-photo-8534777.jpeg',
      link: '/deal/wireless-earbuds',
    },
  ];

  const trendingProducts = [
    {
      name: 'Smartwatch',
      originalPrice: '₹15,000',
      discountedPrice: '₹12,999',
      platform: 'Amazon',
      image: 'https://images.pexels.com/photos/2775132/pexels-photo-2775132.jpeg',
      link: '/deal/smartwatch',
    },
    {
      name: 'Gaming Console',
      originalPrice: '₹45,000',
      discountedPrice: '₹39,999',
      platform: 'Flipkart',
      image: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/PS5_and_DualSense.png',
      link: '/deal/gaming-console',
    },
    {
      name: 'Kitchen Appliance',
      originalPrice: '₹8,000',
      discountedPrice: '₹6,499',
      platform: 'JioMart',
      image: 'https://images.pexels.com/photos/4552967/pexels-photo-4552967.jpeg',
      link: '/deal/kitchen-appliance',
    },
    {
      name: 'Headphones',
      originalPrice: '₹10,000',
      discountedPrice: '₹7,999',
      platform: 'eBay',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
      link: '/deal/headphones',
    },
  ];

  const platforms = [
    { name: 'Amazon', src: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
    { name: 'Flipkart', src: 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Flipkart_Logo.svg' },
    { name: 'JioMart', src: 'https://www.jiomart.com/assets/jiomart-default/logo.png' },
    { name: 'eBay India', src: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg' },
    { name: 'Paytm Mall', src: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Paytm_Mall_Logo.svg' },
  ];

  const howItWorks = [
    { step: 'Search', description: 'Enter a product name in the search bar.', icon: '🔍' },
    { step: 'Compare', description: 'View deals from top platforms.', icon: '⚖️' },
    { step: 'Save', description: 'Choose the best offer and shop smart.', icon: '💸' },
  ];

  const testimonials = [
    {
      quote: 'BuySmart helped me find an amazing deal on my new phone!',
      author: 'Priya S., Bangalore',
      image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
    },
    {
      quote: 'So easy to compare prices across platforms. Saved a lot!',
      author: 'Rahul M., Mumbai',
      image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
    },
    {
      quote: 'BuySmart is my go-to for finding the best offers online.',
      author: 'Anita K., Delhi',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    },
  ];

  const faqs = [
    {
      question: 'What platforms does BuySmart support?',
      answer: 'BuySmart compares deals from Amazon, Flipkart, JioMart, eBay India, and Paytm Mall.',
    },
    {
      question: 'Is BuySmart free to use?',
      answer: 'Yes, BuySmart is completely free for all users.',
    },
    {
      question: 'How does BuySmart find deals?',
      answer: 'We aggregate real-time offers from top platforms to show you the best prices.',
    },
  ];

  return (
    <>
      <Head>
        <title>BuySmart - Find the Best Deals Across Top Platforms</title>
        <meta
          name="description"
          content="Discover the best deals on Amazon, Flipkart, JioMart, eBay India, and Paytm Mall with BuySmart."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="min-h-screen flex flex-col relative font-sans bg-gray-900">
        {/* Three.js Canvas */}
        <canvas
          ref={canvasRef}
          className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-20"
        />

        {/* Help Floating Button */}
        <button
          onClick={toggleHelp}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-lg hover:scale-105 hover:shadow-[0_0_15px_rgba(79,70,229,0.6)] transition-transform duration-200 z-50"
          aria-label="Open help modal"
          aria-expanded={isHelpOpen}
        >
          ?
        </button>

        {/* Help Modal */}
        {isHelpOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div
              ref={modalRef}
              tabIndex={-1}
              className="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full"
            >
              <h3 className="text-xl font-bold mb-4 text-gray-800">Welcome to BuySmart</h3>
              <p className="text-gray-600 mb-6 text-sm">
                Search for any product to find the best deals across Amazon, Flipkart, JioMart, eBay India, and Paytm Mall. Save big with BuySmart!
              </p>
              <button
                onClick={toggleHelp}
                className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-2 rounded-lg hover:shadow-[0_0_10px_rgba(79,70,229,0.5)] transition-shadow duration-200"
              >
                Got It
              </button>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <section className="relative z-10 bg-white py-16 sm:py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 leading-tight tracking-tight animate-fade-in">
              Discover the Best Deals with <span className="text-blue-600">BuySmart</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-600 mb-6 max-w-3xl mx-auto">
              Find unbeatable offers across top platforms in seconds.
            </p>
            <form
              onSubmit={handleCompare}
              className="max-w-md sm:max-w-lg mx-auto flex flex-col sm:flex-row gap-3"
            >
              <input
                type="text"
                value={compareQuery}
                onChange={(e) => setCompareQuery(e.target.value)}
                placeholder="Search for phones, laptops, or anything..."
                className="flex-grow p-3 rounded-lg bg-gray-100 text-gray-800 outline-none focus:ring-2 focus:ring-blue-600 transition-shadow duration-200 text-sm"
                required
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3 rounded-lg font-semibold hover:scale-105 hover:shadow-[0_0_15px_rgba(79,70,229,0.5)] transition-transform duration-200 text-sm"
              >
                Find Deals
              </button>
            </form>
            <div className="mt-8">
              <Image
                src="https://images.pexels.com/photos/5632371/pexels-photo-5632371.jpeg"
                alt="Online shopping interface with product deals"
                width={1200}
                height={600}
                className="rounded-xl shadow-lg mx-auto object-cover w-full max-w-4xl"
                loading="eager"
                priority
                onError={(e) => (e.target.src = 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg')}
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="relative z-10 bg-gray-100 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10 text-gray-800">
              How BuySmart Works
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {howItWorks.map((step, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="text-4xl mb-4">{step.icon}</div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">{step.step}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Platforms Section */}
        <section className="relative z-10 bg-white py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10 text-gray-800">
              Shop on Trusted Platforms
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {platforms.map((platform) => (
                <div
                  key={platform.name}
                  className="bg-gray-100 rounded-lg p-4 flex items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-200"
                >
                  <Image
                    src={platform.src}
                    alt={`${platform.name} logo`}
                    width={120}
                    height={60}
                    className="object-contain w-full h-10"
                    loading="lazy"
                    onError={(e) => (e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/4/44/Generic_Logo.svg')}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Top Deals Section */}
        <section className="relative z-10 bg-gray-100 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10 text-gray-800">
              Today’s Top Deals
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {topDeals.map((deal, index) => (
                <a
                  key={index}
                  href={deal.link}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
                >
                  <Image
                    src={deal.image}
                    alt={`${deal.name} on ${deal.platform}`}
                    width={400}
                    height={200}
                    className="w-full h-40 object-cover"
                    loading="lazy"
                    onError={(e) => (e.target.src = 'https://images.pexels.com/photos/265906/pexels-photo-265906.jpeg')}
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800">{deal.name}</h3>
                    <p className="text-sm text-gray-600">
                      <span className="line-through">{deal.originalPrice}</span>{' '}
                      <span className="text-blue-600 font-semibold">{deal.discountedPrice}</span>
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Available on {deal.platform}</p>
                    <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors duration-200">
                      View Deal
                    </button>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Trending Products Section */}
        <section className="relative z-10 bg-white py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10 text-gray-800">
              Trending Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {trendingProducts.map((product, index) => (
                <a
                  key={index}
                  href={product.link}
                  className="bg-gray-100 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
                >
                  <Image
                    src={product.image}
                    alt={`${product.name} on ${product.platform}`}
                    width={400}
                    height={200}
                    className="w-full h-40 object-cover"
                    loading="lazy"
                    onError={(e) => (e.target.src = 'https://images.pexels.com/photos/265906/pexels-photo-265906.jpeg')}
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                    <p className="text-sm text-gray-600">
                      <span className="line-through">{product.originalPrice}</span>{' '}
                      <span className="text-blue-600 font-semibold">{product.discountedPrice}</span>
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Available on {product.platform}</p>
                    <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors duration-200">
                      View Deal
                    </button>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="relative z-10 bg-gray-100 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10 text-gray-800">
              Loved by Our Users
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="flex items-center mb-4">
                    <Image
                      src={testimonial.image}
                      alt={`Avatar of ${testimonial.author}`}
                      width={50}
                      height={50}
                      className="rounded-full mr-3"
                      loading="lazy"
                      onError={(e) => (e.target.src = 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg')}
                    />
                    <div>
                      <p className="font-semibold text-sm text-gray-800">{testimonial.author}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 italic text-sm">"{testimonial.quote}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="relative z-10 bg-white py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10 text-gray-800">
              Frequently Asked Questions
            </h2>
            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-gray-100 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow duration-200"
                >
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">{faq.question}</h3>
                  <p className="text-gray-600 text-sm">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Signup Section */}
        <section className="relative z-10 bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-16 sm:py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Stay Updated with BuySmart
            </h2>
            <p className="text-base sm:text-lg mb-6 max-w-2xl mx-auto">
              Subscribe for the latest deals and shopping tips.
            </p>
            <form
              onSubmit={handleNewsletterSignup}
              className="max-w-md sm:max-w-lg mx-auto flex flex-col sm:flex-row gap-3"
            >
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-grow p-3 rounded-lg bg-white/90 text-gray-800 outline-none focus:ring-2 focus:ring-blue-600 transition-shadow duration-200 text-sm"
                required
              />
              <button
                type="submit"
                className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:scale-105 hover:shadow-[0_0_15px_rgba(255,255,255,0.4)] transition-transform duration-200 text-sm"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative z-10 bg-gray-900 text-white py-16 sm:py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Find the Best Deals Today
            </h2>
            <p className="text-base sm:text-lg mb-6 max-w-2xl mx-auto">
              Shop smarter with BuySmart’s curated offers.
            </p>
            <button
              onClick={() => document.querySelector('input[type="text"]').focus()}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3 rounded-lg font-semibold hover:scale-105 hover:shadow-[0_0_15px_rgba(79,70,229,0.5)] transition-transform duration-200 text-sm"
            >
              Search Deals
            </button>
          </div>
        </section>

        {/* Footer */}
        <section className="relative z-10 bg-gray-800 text-white py-10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <h3 className="text-xl font-bold mb-4">BuySmart</h3>
                <p className="text-gray-400 text-sm">
                  Discover the best deals across top e-commerce platforms.
                </p>
              </div>
              <div>
                <h4 className="text-base font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  {['Home', 'About', 'Contact'].map((item) => (
                    <li key={item}>
                      <a
                        href={`/${item.toLowerCase()}`}
                        className="text-gray-400 hover:text-blue-300 transition-colors duration-200 text-sm"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-base font-semibold mb-4">Categories</h4>
                <ul className="space-y-2">
                  {['Electronics', 'Fashion', 'Home & Kitchen', 'Books'].map((category) => (
                    <li key={category}>
                      <a
                        href={`/category/${category.toLowerCase().replace(' & ', '-')}`}
                        className="text-gray-400 hover:text-blue-300 transition-colors duration-200 text-sm"
                      >
                        {category}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-base font-semibold mb-4">Legal</h4>
                <ul className="space-y-2">
                  {['Privacy Policy', 'Terms of Service'].map((item) => (
                    <li key={item}>
                      <a
                        href={`/${item.toLowerCase().replace(' ', '-')}`}
                        className="text-gray-400 hover:text-blue-300 transition-colors duration-200 text-sm"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="text-center text-gray-400 mt-6 text-sm">
              © 2025 BuySmart. All rights reserved.
            </p>
          </div>
        </section>

        {/* Inline CSS for Animations */}
        <style jsx global>{`
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fade-in {
            animation: fade-in 0.6s ease-out forwards;
          }
        `}</style>
      </div>
    </>
  );
};

export default HomePage;