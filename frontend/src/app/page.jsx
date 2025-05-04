"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Head from "next/head";
import {
  Search,
  ShoppingCart,
  Tag,
  TrendingUp,
  HelpCircle,
  ChevronRight,
  ExternalLink,
  Clock,
  Zap,
  Shield,
  PieChart,
  Star,
} from "lucide-react";
import ParticleBackground from "@/components/ParticleBackground";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const HomePage = () => {
  const [compareQuery, setCompareQuery] = useState("");
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const modalRef = useRef(null);

  // Handle compare form submission
  const handleCompare = (e) => {
    e.preventDefault();
    console.log("Comparing:", compareQuery);
  };

  // Handle newsletter signup
  const handleNewsletterSignup = (e) => {
    e.preventDefault();
    console.log("Newsletter signup:", newsletterEmail);
    setNewsletterEmail("");
  };

  // Toggle help modal
  const toggleHelp = () => {
    setIsHelpOpen(!isHelpOpen);
  };

  // Keyboard support for modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isHelpOpen) setIsHelpOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isHelpOpen]);

  // Focus modal when opened
  useEffect(() => {
    if (isHelpOpen) modalRef.current?.focus();
  }, [isHelpOpen]);

  console.log("HomePage component rendered");

  const currentProductComparisons = [
    {
      name: "Sony WH-1000XM4 Wireless Noise Cancelling Headphones",
      currentSite: "Amazon",
      currentPrice: "₹24,990",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
      alternatives: [
        { site: "Flipkart", price: "₹22,990", savings: "₹2,000", link: "#" },
        { site: "Croma", price: "₹23,490", savings: "₹1,500", link: "#" },
        { site: "Reliance Digital", price: "₹24,490", savings: "₹500", link: "#" },
      ],
    },
  ];

  const recentComparisons = [
    {
      name: "Apple iPhone 13",
      originalPrice: "₹79,900",
      bestPrice: "₹69,999",
      bestSite: "Flipkart",
      savings: "₹9,901",
      image: "https://images.unsplash.com/photo-1511707171634-5f89772885ad",
      link: "#",
    },
    {
      name: "Samsung Galaxy S21",
      originalPrice: "₹69,999",
      bestPrice: "₹54,999",
      bestSite: "Amazon",
      savings: "₹15,000",
      image: "https://images.pexels.com/photos/1266984/pexels-photo-1266984.jpeg",
      link: "#",
    },
    {
      name: "Bose QuietComfort Earbuds",
      originalPrice: "₹26,900",
      bestPrice: "₹21,999",
      bestSite: "Croma",
      savings: "₹4,901",
      image: "https://images.pexels.com/photos/8534777/pexels-photo-8534777.jpeg",
      link: "#",
    },
  ];

  const platforms = [
    { name: "Amazon", src: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
    { name: "Flipkart", src: "https://upload.wikimedia.org/wikipedia/commons/f/fe/Flipkart_Logo.svg" },
    { name: "JioMart", src: "https://www.jiomart.com/assets/jiomart-default/logo.png" },
    { name: "Croma", src: "https://upload.wikimedia.org/wikipedia/commons/4/44/Generic_Logo.svg" },
    { name: "Reliance Digital", src: "https://upload.wikimedia.org/wikipedia/commons/4/44/Generic_Logo.svg" },
  ];

  const howItWorks = [
    {
      step: "Browse",
      description: "Shop on any supported e-commerce site as you normally would.",
      icon: <Search className="h-8 w-8" />,
    },
    {
      step: "Click Extension",
      description: "Click the BuySmart icon in your browser when viewing a product.",
      icon: <Zap className="h-8 w-8" />,
    },
    {
      step: "Compare & Save",
      description: "Instantly see if there's a better price elsewhere.",
      icon: <ShoppingCart className="h-8 w-8" />,
    },
  ];

  const testimonials = [
    {
      quote: "BuySmart saved me ₹3,000 on my new headphones!",
      author: "Priya S., Bangalore",
      image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
      rating: 5,
    },
    {
      quote: "I use this extension for all my online shopping now.",
      author: "Rahul M., Mumbai",
      image: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg",
      rating: 4,
    },
    {
      quote: "Found a better price on my laptop in seconds.",
      author: "Anita K., Delhi",
      image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
      rating: 5,
    },
  ];

  const faqs = [
    {
      question: "Which websites does BuySmart support?",
      answer:
        "BuySmart compares prices from Amazon, Flipkart, JioMart, Croma, Reliance Digital, and many more Indian e-commerce sites.",
    },
    {
      question: "Is the BuySmart extension free to use?",
      answer: "Yes, BuySmart is completely free for all users.",
    },
    {
      question: "How does BuySmart find better prices?",
      answer:
        "Our extension automatically identifies the product you're viewing and searches for the same item across other supported platforms in real-time.",
    },
    {
      question: "Is my browsing data secure?",
      answer:
        "Yes, we only access the product information needed to find better prices. We don't track your personal browsing history or store any sensitive data.",
    },
  ];

  return (
    <>
      <Head>
        <title>BuySmart - Browser Extension for Price Comparison</title>
        <meta
          name="description"
          content="BuySmart browser extension automatically compares prices across top Indian e-commerce sites while you shop."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="bg-wrapper min-h-full h-auto w-full relative">
        {/* 3D Particle Background */}
        <ParticleBackground />
        {/* Fallback Gradient */}
        <div className="gradient-bg" />

        <div className="main-container font-sans min-h-screen flex flex-col">
          {/* Help Floating Button */}
          <button
            onClick={toggleHelp}
            className="fixed bottom-6 right-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white w-14 h-14 rounded-full flex items-center justify-center text-xl shadow-lg hover:shadow-[0_0_20px_rgba(99,102,241,0.8)] hover:scale-110 transition-all duration-300 z-20"
            aria-label="Open help modal"
            aria-expanded={isHelpOpen}
          >
            <HelpCircle className="h-6 w-6" />
          </button>

          {/* Help Modal */}
          {isHelpOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-20 p-4">
              <div ref={modalRef} tabIndex={-1} className="bg-[rgba(255,255,255,0.95)] p-8 rounded-2xl shadow-2xl max-w-md w-full backdrop-blur-lg">
                <h3 className="text-2xl font-bold mb-6 text-slate-900">How to Use BuySmart</h3>
                <ol className="space-y-6 mb-8">
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                      1
                    </div>
                    <p className="text-slate-700 text-lg">Install the BuySmart extension from the Chrome Web Store</p>
                  </li>
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                      2
                    </div>
                    <p className="text-slate-700 text-lg">Browse your favorite shopping sites as usual</p>
                  </li>
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                      3
                    </div>
                    <p className="text-slate-700 text-lg">When viewing a product, click the BuySmart icon in your browser</p>
                  </li>
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full SCALE bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                      4
                    </div>
                    <p className="text-slate-700 text-lg">See if there's a better price on another site and save money!</p>
                  </li>
                </ol>
                <Button
                  onClick={toggleHelp}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-lg py-6 rounded-xl"
                >
                  Got It
                </Button>
              </div>
            </div>
          )}

          {/* Navbar */}
          <header className="sticky top-0 z-10 w-full bg-[rgba(255,255,255,0.8)] backdrop-blur-lg border-b border-[rgba(255,255,255,0.2)] shadow-sm">
            <div className="container mx-auto px-6 flex items-center justify-between h-20">
              <div className="flex items-center">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
                  BuySmart
                </h1>
              </div>
              <nav className="hidden md:flex items-center space-x-8">
                <a href="/" className="text-slate-700 hover:text-indigo-600 text-lg font-medium transition-colors">
                  Home
                </a>
                <a href="/features" className="text-slate-700 hover:text-indigo-600 text-lg font-medium transition-colors">
                  Features
                </a>
                <a href="/pricing" className="text-slate-700 hover:text-indigo-600 text-lg font-medium transition-colors">
                  Pricing
                </a>
                <a href="/support" className="text-slate-700 hover:text-indigo-600 text-lg font-medium transition-colors">
                  Support
                </a>
                <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-lg py-6 rounded-xl">
                  Install Extension
                </Button>
              </nav>
              <button className="md:hidden text-slate-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </header>

          {/* Hero Section */}
          <section className="relative z-10 bg-gradient-to-b from-[rgba(255,255,255,0.9)] to-transparent py-20 sm:py-32">
            <div className="container mx-auto px-6">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="text-center md:text-left">
                  <Badge className="mb-6 bg-indigo-100 text-indigo-800 hover:bg-indigo-200 text-lg py-2 px-4 rounded-lg transition-colors">
                    Browser Extension
                  </Badge>
                  <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-slate-900 mb-8 leading-tight tracking-tight">
                    Never Overpay{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
                      Again
                    </span>
                  </h1>
                  <p className="text-xl text-slate-600 mb-10 max-w-xl mx-auto md:mx-0">
                    BuySmart instantly compares prices across top Indian e-commerce sites, ensuring you get the best deal with one click.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-6 justify-center md:justify-start">
                    <Button
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-7 text-lg rounded-xl hover:scale-105"
                      size="lg"
                    >
                      Add to Chrome - It's Free
                    </Button>
                    <Button
                      variant="outline"
                      className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 px-8 py-7 text-lg rounded-xl hover:scale-105"
                      size="lg"
                    >
                      <ExternalLink className="mr-2 h-5 w-5" /> Watch Demo
                    </Button>
                  </div>
                  <div className="mt-8 flex items-center justify-center md:justify-start">
                    <div className="flex -space-x-3">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200"></div>
                      ))}
                    </div>
                    <p className="ml-4 text-lg text-slate-600">
                      <span className="font-semibold text-indigo-600">10,000+</span> active users
                    </p>
                  </div>
                </div>
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
                  <div className="relative bg-[rgba(255,255,255,0.95)] rounded-2xl shadow-2xl overflow-hidden border border-[rgba(255,255,255,0.2)] backdrop-blur-lg transform transition-transform group-hover:-translate-y-2">
                    <div className="bg-slate-900 h-10 flex items-center px-4">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="mx-auto bg-slate-800 rounded-full px-4 py-1 text-sm text-slate-300 flex items-center">
                        <span className="mr-2">●</span> amazon.in
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 mr-4">
                            <ShoppingCart className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-slate-900">BuySmart found better prices</h3>
                            <p className="text-sm text-slate-600">Click to view all options</p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800 text-sm py-1 px-3">Save ₹2,000</Badge>
                      </div>

                      <div className="mb-6">
                        <div className="flex items-center mb-4">
                          <Image
                            src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
                            alt="Sony WH-1000XM4 Headphones"
                            width={80}
                            height={80}
                            className="rounded-lg object-cover mr-4"
                          />
                          <div>
                            <h4 className="text-lg font-semibold text-slate-900 line-clamp-1">
                              Sony WH-1000XM4 Wireless Headphones
                            </h4>
                            <p className="text-sm text-slate-600">Current site: Amazon</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4 mb-6">
                        <div className="flex justify-between items-center p-4 bg-[rgba(255,255,255,0.8)] rounded-lg border border-[rgba(255,255,255,0.2)] backdrop-blur-sm hover:bg-[rgba(255,255,255,0.9)] transition-colors">
                          <div className="flex items-center">
                            <div className="w-10 h-10 mr-4 flex-shrink-0">
                              <Image
                                src="https://upload.wikimedia.org/wikipedia/commons/f/fe/Flipkart_Logo.svg"
                                alt="Flipkart"
                                width={40}
                                height={40}
                                className="object-contain"
                              />
                            </div>
                            <div>
                              <p className="text-lg font-semibold text-slate-900">Flipkart</p>
                              <p className="text-sm text-green-600 font-medium">Save ₹2,000</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-indigo-600">₹22,990</p>
                            <Button size="sm" className="mt-2 h-8 text-sm bg-indigo-600 hover:bg-indigo-700 rounded-lg">
                              View Deal
                            </Button>
                          </div>
                        </div>

                        <div className="flex justify-between items-center p-4 bg-[rgba(255,255,255,0.8)] rounded-lg border border-[rgba(255,255,255,0.2)] backdrop-blur-sm hover:bg-[rgba(255,255,255,0.9)] transition-colors">
                          <div className="flex items-center">
                            <div className="w-10 h-10 mr-4 flex-shrink-0">
                              <Image
                                src="https://upload.wikimedia.org/wikipedia/commons/4/44/Generic_Logo.svg"
                                alt="Croma"
                                width={40}
                                height={40}
                                className="object-contain"
                              />
                            </div>
                            <div>
                              <p className="text-lg font-semibold text-slate-900">Croma</p>
                              <p className="text-sm text-green-600 font-medium">Save ₹1,500</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-slate-700">₹23,490</p>
                            <Button size="sm" variant="outline" className="mt-2 h-8 text-sm rounded-lg">
                              View Deal
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="text-center">
                        <Button variant="link" className="text-sm text-indigo-600 hover:text-indigo-800">
                          View price history <PieChart className="h-4 w-4 ml-1 inline" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Platforms Section */}
          <section className="relative z-10 bg-[rgba(255,255,255,0.95)] py-16 backdrop-blur-lg">
            <div className="container mx-auto px-6">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-slate-900">Supported E-commerce Sites</h2>
                <p className="text-lg text-slate-600 mt-4">BuySmart works with all major Indian shopping platforms</p>
              </div>
              <div className="flex flex-wrap justify-center items-center gap-12">
                {platforms.map((platform) => (
                  <div
                    key={platform.name}
                    className="flex items-center justify-center h-16 transition-transform hover:scale-110"
                  >
                    <Image
                      src={platform.src || "/placeholder.svg"}
                      alt={`${platform.name} logo`}
                      width={140}
                      height={50}
                      className="object-contain h-full"
                      loading="lazy"
                      onError={(e) =>
                        (e.target.src = "https://upload.wikimedia.org/wikipedia/commons/4/44/Generic_Logo.svg")
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="relative z-10 bg-transparent py-20 sm:py-32">
            <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-slate-900 mb-6">How BuySmart Works</h2>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                  Finding the best deals has never been easier. Just install our extension and start saving.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {howItWorks.map((step, index) => (
                  <Card
                    key={index}
                    className="border-none bg-[rgba(255,255,255,0.95)] shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-lg rounded-2xl hover:-translate-y-2"
                  >
                    <CardContent className="pt-8">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mb-6">
                          {step.icon}
                        </div>
                        <h3 className="text-2xl font-semibold mb-4 text-slate-900">{step.step}</h3>
                        <p className="text-lg text-slate-600">{step.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-20 max-w-4xl mx-auto">
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
                  <div className="relative bg-[rgba(255,255,255,0.95)] rounded-2xl shadow-2xl overflow-hidden border border-[rgba(255,255,255,0.2)] backdrop-blur-lg transform transition-transform group-hover:-translate-y-2">
                    <div className="bg-slate-900 h-12 flex items-center px-6">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="mx-auto bg-slate-800 rounded-full px-4 py-1 text-sm text-slate-300">
                        Extension Demo
                      </div>
                    </div>
                    <div className="p-8">
                      <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-semibold text-slate-900">How the extension works</h3>
                        <Badge className="bg-indigo-100 text-indigo-800 text-sm py-1 px-3">Live Demo</Badge>
                      </div>
                      <div className="space-y-6">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-4">
                            1
                          </div>
                          <p className="text-lg text-slate-600">Browse your favorite shopping sites</p>
                        </div>
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-4">
                            2
                          </div>
                          <p className="text-lg text-slate-600">BuySmart icon turns green when better prices are found</p>
                        </div>
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-4">
                            3
                          </div>
                          <p className="text-lg text-slate-600">Click the icon to see all available deals</p>
                        </div>
                      </div>
                      <div className="mt-8">
                        <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-lg py-6 rounded-xl">
                          Install Extension Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="relative z-10 bg-[rgba(255,255,255,0.95)] py-20 sm:py-32 backdrop-blur-lg">
            <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-slate-900 mb-6">Powerful Features</h2>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                  BuySmart does more than just compare prices. Discover all the ways it helps you shop smarter.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                <Card className="border-none bg-[rgba(255,255,255,0.95)] shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-lg rounded-2xl hover:-translate-y-2">
                  <CardContent className="pt-8">
                    <div className="w-16 h-16 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 mb-6">
                      <Tag className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-4 text-slate-900">Real-time Price Comparison</h3>
                    <p className="text-lg text-slate-600">
                      Instantly compare prices across multiple platforms while you shop, without leaving the page.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-none bg-[rgba(255,255,255,0.95)] shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-lg rounded-2xl hover:-translate-y-2">
                  <CardContent className="pt-8">
                    <div className="w-16 h-16 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 mb-6">
                      <PieChart className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-4 text-slate-900">Price History Tracking</h3>
                    <p className="text-lg text-slate-600">
                      See how prices have changed over time and know if you're getting a genuine deal.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-none bg-[rgba(255,255,255,0.95)] shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-lg rounded-2xl hover:-translate-y-2">
                  <CardContent className="pt-8">
                    <div className="w-16 h-16 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 mb-6">
                      <Clock className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-4 text-slate-900">Price Drop Alerts</h3>
                    <p className="text-lg text-slate-600">
                      Get notified when prices drop for products you're watching across any platform.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-none bg-[rgba(255,255,255,0.95)] shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-lg rounded-2xl hover:-translate-y-2">
                  <CardContent className="pt-8">
                    <div className="w-16 h-16 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 mb-6">
                      <Shield className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-4 text-slate-900">Privacy Protection</h3>
                    <p className="text-lg text-slate-600">
                      We never collect your personal data or browsing history. Your privacy comes first.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-none bg-[rgba(255,255,255,0.95)] shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-lg rounded-2xl hover:-translate-y-2">
                  <CardContent className="pt-8">
                    <div className="w-16 h-16 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 mb-6">
                      <TrendingUp className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-4 text-slate-900">Coupon Finder</h3>
                    <p className="text-lg text-slate-600">
                      Automatically finds and applies the best coupon codes to maximize your savings.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-none bg-[rgba(255,255,255,0.95)] shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-lg rounded-2xl hover:-translate-y-2">
                  <CardContent className="pt-8">
                    <div className="w-16 h-16 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 mb-6">
                      <Zap className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-4 text-slate-900">Lightning Fast</h3>
                    <p className="text-lg text-slate-600">
                      Get results in milliseconds without slowing down your browsing experience.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Recent Comparisons Section */}
          <section className="relative z-10 bg-transparent py-20 sm:py-32">
            <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-slate-900 mb-6">Recent Savings</h2>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto">See how much our users have saved with BuySmart</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {recentComparisons.map((item, index) => (
                  <Card
                    key={index}
                    className="overflow-hidden group bg-[rgba(255,255,255,0.95)] border-none shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-lg rounded-2xl hover:-translate-y-2"
                  >
                    <div className="relative">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={400}
                        height={250}
                        className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) =>
                          (e.target.src = "https://images.pexels.com/photos/265906/pexels-photo-265906.jpeg")
                        }
                      />
                      <Badge className="absolute top-4 right-4 bg-green-500 hover:bg-green-600 text-sm py-1 px-3">
                        Saved {item.savings}
                      </Badge>
                    </div>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <Badge variant="outline" className="text-slate-600 bg-[rgba(255,255,255,0.8)] text-sm py-1 px-3">
                          {item.bestSite}
                        </Badge>
                        <div className="text-sm text-slate-600">
                          <span className="line-through">{item.originalPrice}</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-2 line-clamp-1">{item.name}</h3>
                      <div className="text-2xl font-bold text-indigo-600 mb-6">{item.bestPrice}</div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-lg py-6 rounded-xl">
                        View Deal
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="relative z-10 bg-[rgba(255,255,255,0.95)] py-20 sm:py-32 backdrop-blur-lg">
            <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-slate-900 mb-6">What Our Users Say</h2>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                  Join thousands of smart shoppers who save money with BuySmart
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {testimonials.map((testimonial, index) => (
                  <Card
                    key={index}
                    className="border-none bg-[rgba(255,255,255,0.95)] shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-lg rounded-2xl hover:-translate-y-2"
                  >
                    <CardContent className="p-8">
                      <div className="flex flex-col h-full">
                        <div className="flex items-center mb-6">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${
                                i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-300"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-lg text-slate-700 italic mb-8 flex-grow">"{testimonial.quote}"</p>
                        <div className="flex items-center mt-auto">
                          <Image
                            src={testimonial.image || "/placeholder.svg"}
                            alt={`Avatar of ${testimonial.author}`}
                            width={48}
                            height={48}
                            className="rounded-full mr-4"
                            loading="lazy"
                            onError={(e) =>
                              (e.target.src = "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg")
                            }
                          />
                          <div>
                            <p className="text-lg font-semibold text-slate-900">{testimonial.author}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="relative z-10 bg-transparent py-20 sm:py-32">
            <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto">Everything you need to know about BuySmart</p>
              </div>
              <div className="max-w-4xl mx-auto space-y-8">
                {faqs.map((faq, index) => (
                  <Card
                    key={index}
                    className="border-none bg-[rgba(255,255,255,0.95)] shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-lg rounded-2xl hover:-translate-y-2"
                  >
                    <CardContent className="p-8">
                      <h3 className="text-xl font-semibold mb-4 text-slate-900">{faq.question}</h3>
                      <p className="text-lg text-slate-600">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="relative z-10 bg-[rgba(255,255,255,0.95)] py-20 sm:py-32 backdrop-blur-lg">
            <div className="container mx-auto px-6">
              <div className="max-w-5xl mx-auto bg-gradient-to-r from-indigo-600 to-purple-700 rounded-3xl p-10 sm:p-16 shadow-2xl text-white">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <h2 className="text-4xl font-bold mb-6">Ready to Start Saving?</h2>
                    <p className="text-indigo-100 mb-8 text-lg">
                      Join thousands of smart shoppers who never overpay again. Install BuySmart today - it's completely
                      free!
                    </p>
                    <Button className="bg-white text-indigo-700 hover:bg-slate-100 px-8 py-7 text-lg rounded-xl hover:scale-105">
                      <svg viewBox="0 0 24 24" className="w-6 h-6 mr-2" fill="currentColor">
                        <path d="M16.24 7.76C15.07 6.59 13.54 6 12 6v6l-4.24 4.24c2.34 2.34 6.14 2.34 8.49 0 2.34-2.34 2.34-6.14-.01-8.48zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
                      </svg>
                      Add to Chrome
                    </Button>
                  </div>
                  <div className="hidden md:block">
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white mr-4">
                            <ShoppingCart className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">Average Savings</h3>
                            <p className="text-indigo-200 text-sm">Per purchase</p>
                          </div>
                        </div>
                        <div className="text-3xl font-bold">₹1,200+</div>
                      </div>
                      <div className="h-3 bg-white/10 rounded-full mb-4">
                        <div className="h-3 bg-white rounded-full" style={{ width: "75%" }}></div>
                      </div>
                      <div className="text-right text-indigo-200 text-sm">Based on 10,000+ comparisons</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-slate-900 text-white pt-20 pb-12">
            <div className="container mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                <div>
                  <h3 className="text-2xl font-bold mb-6">BuySmart</h3>
                  <p className="text-slate-400 mb-6 text-lg">
                    The browser extension that helps you find the best deals while shopping online.
                  </p>
                  <div className="flex space-x-6">
                    {["twitter", "facebook", "instagram"].map((social) => (
                      <a
                        key={social}
                        href={`https://${social}.com`}
                        className="text-slate-400 hover:text-white transition-colors"
                        aria-label={`Follow us on ${social}`}
                      >
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 12c0 3.314-2.686 6-6 6s-6-2.686-6-6 2.686-6 6-6 6 2.686 6 6z" />
                          </svg>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-6">Quick Links</h4>
                  <ul className="space-y-4">
                    {["Home", "Features", "Pricing", "Support"].map((item) => (
                      <li key={item}>
                        <a
                          href={`/${item.toLowerCase()}`}
                          className="text-slate-400 hover:text-white transition-colors flex items-center text-lg"
                        >
                          <ChevronRight className="h-4 w-4 mr-2" />
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-6">Legal</h4>
                  <ul className="space-y-4">
                    {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                      <li key={item}>
                        <a
                          href={`/${item.toLowerCase().replace(" ", "-")}`}
                          className="text-slate-400 hover:text-white transition-colors flex items-center text-lg"
                        >
                          <ChevronRight className="h-4 w-4 mr-2" />
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-6">Newsletter</h4>
                  <p className="text-slate-400 mb-6 text-lg">Subscribe for updates on new features and deals.</p>
                  <form onSubmit={handleNewsletterSignup} className="space-y-4">
                    <Input
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="Your email address"
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 text-lg py-6 rounded-xl"
                      required
                    />
                    <Button type="submit" className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-lg py-6 rounded-xl">
                      Subscribe
                    </Button>
                  </form>
                </div>
              </div>
              <Separator className="bg-slate-800 my-12" />
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-slate-400 text-lg">© {new Date().getFullYear()} BuySmart. All rights reserved.</p>
                <div className="flex items-center space-x-6 mt-6 md:mt-0">
                  <a href="#" className="text-slate-400 hover:text-white transition-colors text-lg">
                    Sitemap
                  </a>
                  <span className="text-slate-700">•</span>
                  <a href="#" className="text-slate-400 hover:text-white transition-colors text-lg">
                    Accessibility
                  </a>
                  <span className="text-slate-700">•</span>
                  <a href="#" className="text-slate-400 hover:text-white transition-colors text-lg">
                    Contact
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

export default HomePage;