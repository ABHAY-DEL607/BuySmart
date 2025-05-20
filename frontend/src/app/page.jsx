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
import { motion } from 'framer-motion';

const HomePage = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const mountRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !mountRef.current) return;
    let renderer, scene, camera, particles;
    const colors = [0x7DD3FC, 0x4C1D95, 0x4158D0, 0xC850C0];
    try {
      if (!window.WebGLRenderingContext) {
        console.error('WebGL not supported');
        toast.error('3D background not supported');
        return;
      }

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x000000, 0);
      mountRef.current.appendChild(renderer.domElement);

      const geometry = new THREE.BufferGeometry();
      const vertices = [];
      const particleColors = [];
      const particleCount = 3000;
      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * 2000 - 1000;
        const y = Math.random() * 2000 - 1000;
        const z = Math.random() * 2000 - 1000;
        vertices.push(x, y, z);
        const color = colors[Math.floor(Math.random() * colors.length)];
        particleColors.push(
          (color >> 16) / 255,
          ((color >> 8) & 255) / 255,
          (color & 255) / 255
        );
      }
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(particleColors, 3));
      const material = new THREE.PointsMaterial({
        size: 5,
        transparent: true,
        opacity: 0.8,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
      });
      particles = new THREE.Points(geometry, material);
      scene.add(particles);
      camera.position.z = 1000;

      const animate = () => {
        if (!renderer) return;
        requestAnimationFrame(animate);
        particles.rotation.x += 0.0005;
        particles.rotation.y += 0.0005;
        const positions = particles.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
          const dx = positions[i] - mouse.x * 2;
          const dy = positions[i + 1] - mouse.y * 2;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200) {
            positions[i] += dx * 0.001;
            positions[i + 1] += dy * 0.001;
          }
        }
        particles.geometry.attributes.position.needsUpdate = true;
        renderer.render(scene, camera);
      };
      animate();

      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', handleResize);

      const handleMouseMove = (event) => {
        setMouse({
          x: (event.clientX / window.innerWidth) * 2 - 1,
          y: -(event.clientY / window.innerHeight) * 2 + 1,
        });
      };
      window.addEventListener('mousemove', handleMouseMove);

      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
        if (mountRef.current && renderer.domElement) {
          mountRef.current.removeChild(renderer.domElement);
        }
        renderer.dispose();
      };
    } catch (error) {
      console.error('Three.js error:', error);
      toast.error('Failed to load 3D background');
    }
  }, [isMounted, mouse]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/compare?q=${encodeURIComponent(searchQuery)}`);
    } else {
      toast.error('Please enter a product to search');
    }
  };

  const handleNewsletterSignup = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      toast.success('Subscribed to newsletter!');
      setNewsletterEmail('');
    } else {
      toast.error('Please enter a valid email');
    }
  };

  const platforms = [
    { name: 'Amazon', src: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
    { name: 'Flipkart', src: 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Flipkart_Logo.svg' },
    { name: 'JioMart', src: 'https://www.jiomart.com/assets/jiomart-default/logo.png' },
    { name: 'Ebay', src: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Generic_Logo.svg' },
    { name: 'PaytmMall', src: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Generic_Logo.svg' },
  ];

  const howItWorks = [
    { step: 'Search', description: 'Enter the product name you want to compare prices for.', icon: <Search className="h-8 w-8" /> },
    { step: 'Compare', description: 'View prices from multiple e-commerce sites side by side.', icon: <ShoppingCart className="h-8 w-8" /> },
    { step: 'Save', description: 'Choose the best deal and save money on your purchase.', icon: <Zap className="h-8 w-8" /> },
  ];

  if (!isMounted) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <div ref={mountRef} className="canvas-bg" />
      <div className="relative z-10 flex flex-col flex-1">
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="py-20 sm:py-28"
        >
          <div className="container mx-auto px-4 text-center">
            <motion.h1
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-slate-900 mb-6 leading-tight"
            >
              Find the Best{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 animate-pulse">
                Deals
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-xl text-slate-600 mb-10 max-w-3xl mx-auto"
            >
              Compare prices across top Indian e-commerce sites and save money on your purchases.
            </motion.p>
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-10">
              <div className="flex gap-4">
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products..."
                  className="flex-1 text-lg py-7 border-gray-300 rounded-lg focus:ring-4 focus:ring-indigo-500/50 search-glow"
                />
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-7 button-glow"
                >
                  Compare Now
                </Button>
              </div>
            </form>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex items-center justify-center"
            >
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200" />
                ))}
              </div>
              <p className="ml-4 text-sm text-slate-600">
                <span className="font-medium text-indigo-600">10,000+</span> active users
              </p>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="py-16 bg-white"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-800">Supported E-commerce Sites</h2>
              <p className="text-slate-600 mt-3">Compare prices from all major Indian shopping platforms</p>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-10">
              {platforms.map((platform) => (
                <motion.div
                  key={platform.name}
                  whileHover={{ scale: 1.1 }}
                  className="flex items-center justify-center h-14"
                >
                  <Image
                    src={platform.src}
                    alt={`${platform.name} logo`}
                    width={140}
                    height={50}
                    className="object-contain h-full"
                    loading="lazy"
                    onError={(e) => (e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/4/44/Generic_Logo.svg')}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

      {/* Platforms Section */}
      <section className="relative z-10 bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800">Supported E-commerce Sites</h2>
            <p className="text-slate-600 mt-2">Compare prices from all major Indian shopping platforms</p>
          </div>
          {/* <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {platforms.map((platform) => (
              <div
                key={platform.name}
                className="flex items-center justify-center h-12 transition-transform hover:scale-105"
              >
                <Image
                  src={platform.src || "/placeholder.svg"}
                  alt={`${platform.name} logo`}
                  width={120}
                  height={40}
                  className="object-contain h-full"
                  loading="lazy"
                  onError={(e) =>
                    (e.target.src = "https://upload.wikimedia.org/wikipedia/commons/4/44/Generic_Logo.svg")
                  }
                />
              </div>
            ))}
          </div> */}
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

      {/* Features Section */}
      <section className="relative z-10 bg-white py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Powerful Features</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              BuySmart does more than just compare prices. Discover all the ways it helps you shop smarter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
                  <Tag className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-800">Real-time Price Comparison</h3>
                <p className="text-slate-600">
                  Instantly compare prices across multiple platforms with a single search.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
                  <PieChart className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-800">Price History Tracking</h3>
                <p className="text-slate-600">
                  See how prices have changed over time and know if you're getting a genuine deal.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-800">Price Drop Alerts</h3>
                <p className="text-slate-600">
                  Get notified when prices drop for products you're watching across any platform.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

     
        <footer className="bg-slate-900 text-white pt-20 pb-10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
              <div>
                <h3 className="text-xl font-bold mb-4">BuySmart</h3>
                <p className="text-slate-400 mb-4">The website that helps you find the best deals while shopping online.</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  {['Home', 'About', 'Contact', 'Comparison History'].map((item) => (
                    <li key={item}>
                      <a href={`/${item.toLowerCase().replace(' ', '-')}`} className="text-slate-400 hover:text-white">
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
                      <a href={`/${item.toLowerCase().replace(' ', '-')}`} className="text-slate-400 hover:text-white">
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
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 search-glow"
                    required
                  />
                  <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 button-glow">
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
      </div>
    </div>
  );
};

export default HomePage;