'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import * as THREE from 'three';
import { Search, ShoppingCart, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { toast } from 'react-hot-toast';

const HomePage = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const mountRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  // Ensure component is mounted to avoid hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 3D Background Setup with Three.js
  useEffect(() => {
    if (!isMounted) return; // Prevent running during SSR
    let renderer, scene, camera, particles;
    try {
      // Check WebGL availability
      if (!window.WebGLRenderingContext || !mountRef.current) {
        console.error('WebGL not supported or mount ref not found');
        toast.error('3D background not supported in this browser');
        return;
      }

      // Scene setup
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x000000, 0);
      mountRef.current.appendChild(renderer.domElement);
      console.log('Three.js renderer initialized');

      // Particle system
      const geometry = new THREE.BufferGeometry();
      const vertices = [];
      const particleCount = 2000; // Increased for visibility
      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * 2000 - 1000;
        const y = Math.random() * 2000 - 1000;
        const z = Math.random() * 2000 - 1000;
        vertices.push(x, y, z);
      }
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      const material = new THREE.PointsMaterial({
        color: 0x6b7280, // Gray color to match slate theme
        size: 4,
        transparent: true,
        opacity: 0.8,
      });
      particles = new THREE.Points(geometry, material);
      scene.add(particles);
      camera.position.z = 1000;

      // Animation loop
      const animate = () => {
        if (!renderer) return; // Prevent animation if renderer is disposed
        requestAnimationFrame(animate);
        particles.rotation.x += 0.0007;
        particles.rotation.y += 0.0007;
        renderer.render(scene, camera);
      };
      animate();
      console.log('Three.js animation started');

      // Handle window resize
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', handleResize);

      // Cleanup
      return () => {
        window.removeEventListener('resize', handleResize);
        if (mountRef.current && renderer.domElement) {
          mountRef.current.removeChild(renderer.domElement);
        }
        renderer.dispose();
        console.log('Three.js cleanup completed');
      };
    } catch (error) {
      console.error('Three.js initialization failed:', error);
      toast.error('Failed to load 3D background');
    }
  }, [isMounted]);

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/compare?q=${encodeURIComponent(searchQuery)}`);
    } else {
      toast.error('Please enter a product to search');
    }
  };

  // Handle newsletter signup
  const handleNewsletterSignup = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      console.log('Newsletter signup:', newsletterEmail);
      toast.success('Subscribed to newsletter!');
      setNewsletterEmail('');
    } else {
      toast.error('Please enter a valid email');
    }
  };

  // Handle logout
  const handleLogout = () => {
    console.log('User logged out');
    toast.success('Logged out successfully');
    router.push('/login');
  };

  const platforms = [
    { name: 'Amazon', src: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
    { name: 'Flipkart', src: 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Flipkart_Logo.svg' },
    { name: 'JioMart', src: 'https://www.jiomart.com/assets/jiomart-default/logo.png' },
    { name: 'Ebay', src: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Generic_Logo.svg' },
    { name: 'PaytmMall', src: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Generic_Logo.svg' },
  ];

  const howItWorks = [
    {
      step: 'Search',
      description: 'Enter the product name you want to compare prices for.',
      icon: <Search className="h-8 w-8" />,
    },
    {
      step: 'Compare',
      description: 'View prices from multiple e-commerce sites side by side.',
      icon: <ShoppingCart className="h-8 w-8" />,
    },
    {
      step: 'Save',
      description: 'Choose the best deal and save money on your purchase.',
      icon: <Zap className="h-8 w-8" />,
    },
  ];

  if (!isMounted) {
    return null; // Prevent rendering during SSR to avoid hydration mismatch
  }

  return (
    <div className="min-h-screen flex flex-col relative font-sans bg-slate-50">
      {/* 3D Background */}
      <div
        ref={mountRef}
        className="fixed inset-0 z-0"
        style={{ pointerEvents: 'none' }}
      />

      {/* Navbar */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-sm bg-white/80 border-b border-slate-200">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-indigo-600">BuySmart</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="/" className="text-slate-700 hover:text-indigo-600 transition-colors">
              Home
            </a>
            <a href="/about" className="text-slate-700 hover:text-indigo-600 transition-colors">
              About
            </a>
            <a href="/contact" className="text-slate-700 hover:text-indigo-600 transition-colors">
              Contact
            </a>
            <a href="/history" className="text-slate-700 hover:text-indigo-600 transition-colors">
              Comparison History
            </a>
            <Button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2"
            >
              Log Out
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section with Search */}
      <section className="relative z-10 bg-gradient-to-b from-white to-slate-50 py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
              Find the Best{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
                Deals
              </span>
            </h1>
            <p className="text-lg text-slate-600 mb-8">
              Compare prices across top Indian e-commerce sites and save money on your purchases.
            </p>

            {/* Search Form with Animation */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
              <div className="flex gap-4">
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter product name to compare prices..."
                  className="flex-1 text-lg py-6 border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-500/50 transition-all duration-500 ease-in-out transform hover:scale-105 focus:scale-105 animate-glow"
                />
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-6 transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                  Compare Prices
                </Button>
              </div>
            </form>

            <div className="flex items-center justify-center">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200"></div>
                ))}
              </div>
              <p className="ml-3 text-sm text-slate-600">
                <span className="font-medium text-indigo-600">10,000+</span> active users
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      <section className="relative z-10 bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800">Supported E-commerce Sites</h2>
            <p className="text-slate-600 mt-2">Compare prices from all major Indian shopping platforms</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {platforms.map((platform) => (
              <div
                key={platform.name}
                className="flex items-center justify-center h-12 transition-transform hover:scale-105"
              >
                <Image
                  src={platform.src || '/placeholder.svg'}
                  alt={`${platform.name} logo`}
                  width={120}
                  height={40}
                  className="object-contain h-full"
                  loading="lazy"
                  onError={(e) =>
                    (e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/4/44/Generic_Logo.svg')
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 bg-slate-50 py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">How BuySmart Works</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Finding the best deals has never been easier. Just search and compare.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => (
              <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-slate-800">{step.step}</h3>
                    <p className="text-slate-600">{step.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-xl font-bold mb-4">BuySmart</h3>
              <p className="text-slate-400 mb-4">
                The website that helps you find the best deals while shopping online.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {['Home', 'About', 'Contact', 'Comparison History'].map((item) => (
                  <li key={item}>
                    <a
                      href={`/${item.toLowerCase().replace(' ', '-')}`}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                  <li key={item}>
                    <a
                      href={`/${item.toLowerCase().replace(' ', '-')}`}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
              <p className="text-slate-400 mb-4">Subscribe for updates on new features and deals.</p>
              <form onSubmit={handleNewsletterSignup} className="space-y-2">
                <Input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Your email address"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 transition-all duration-500 ease-in-out transform hover:scale-105 focus:scale-105 focus:ring-4 focus:ring-indigo-500/50 animate-glow"
                  required
                />
                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
          <Separator className="bg-slate-800 my-8" />
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">© {new Date().getFullYear()} BuySmart. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Inline CSS for Animations */}
      <style jsx>{`
        @keyframes glow {
          0% {
            box-shadow: 0 0 5px rgba(79, 70, 229, 0.3);
          }
          50% {
            box-shadow: 0 0 20px rgba(79, 70, 229, 0.6);
          }
          100% {
            box-shadow: 0 0 5px rgba(79, 70, 229, 0.3);
          }
        }
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default HomePage;