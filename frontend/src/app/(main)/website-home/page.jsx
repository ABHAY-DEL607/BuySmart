"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  Search,
  ShoppingCart,
  Tag,
  TrendingUp,
  Clock,
  Zap,
  Shield,
  PieChart,
  Star,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const HomePage = () => {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [newsletterEmail, setNewsletterEmail] = useState("")

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/compare?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  // Handle newsletter signup
  const handleNewsletterSignup = (e) => {
    e.preventDefault()
    console.log("Newsletter signup:", newsletterEmail)
    setNewsletterEmail("")
  }

  const platforms = [
    { name: "Amazon", src: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
    { name: "Flipkart", src: "https://upload.wikimedia.org/wikipedia/commons/f/fe/Flipkart_Logo.svg" },
    { name: "JioMart", src: "https://www.jiomart.com/assets/jiomart-default/logo.png" },
    { name: "Croma", src: "https://upload.wikimedia.org/wikipedia/commons/4/44/Generic_Logo.svg" },
    { name: "Reliance Digital", src: "https://upload.wikimedia.org/wikipedia/commons/4/44/Generic_Logo.svg" },
  ]

  const howItWorks = [
    {
      step: "Search",
      description: "Enter the product name you want to compare prices for.",
      icon: <Search className="h-8 w-8" />,
    },
    {
      step: "Compare",
      description: "View prices from multiple e-commerce sites side by side.",
      icon: <ShoppingCart className="h-8 w-8" />,
    },
    {
      step: "Save",
      description: "Choose the best deal and save money on your purchase.",
      icon: <Zap className="h-8 w-8" />,
    },
  ]

  const testimonials = [
    {
      quote: "BuySmart saved me ₹3,000 on my new headphones!",
      author: "Priya S., Bangalore",
      image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
      rating: 5,
    },
    {
      quote: "I use this website for all my online shopping now.",
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
  ]

  const faqs = [
    {
      question: "Which websites does BuySmart support?",
      answer:
        "BuySmart compares prices from Amazon, Flipkart, JioMart, Croma, Reliance Digital, and many more Indian e-commerce sites.",
    },
    {
      question: "Is BuySmart free to use?",
      answer: "Yes, BuySmart is completely free for all users.",
    },
    {
      question: "How does BuySmart find better prices?",
      answer:
        "Our website searches for the product across multiple supported platforms in real-time to find the best deals.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Yes, we only access the product information needed to find better prices. We don't store any sensitive data.",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col relative font-sans bg-slate-50">
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
            <a href="/features" className="text-slate-700 hover:text-indigo-600 transition-colors">
              Features
            </a>
            <a href="/pricing" className="text-slate-700 hover:text-indigo-600 transition-colors">
              Pricing
            </a>
            <a href="/support" className="text-slate-700 hover:text-indigo-600 transition-colors">
              Support
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section with Search */}
      <section className="relative z-10 bg-gradient-to-b from-white to-slate-50 py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
              Find the Best{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
                Deals
              </span>
            </h1>
            <p className="text-lg text-slate-600 mb-8">
              Compare prices across top Indian e-commerce sites and save money on your purchases.
            </p>
            
            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
              <div className="flex gap-4">
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter product name to compare prices..."
                  className="flex-1 text-lg py-6"
                />
                <Button 
                  type="submit"
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-6"
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

      {/* Testimonials Section */}
      <section className="relative z-10 bg-slate-50 py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">What Our Users Say</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Join thousands of smart shoppers who save money with BuySmart
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}`}
                        />
                      ))}
                    </div>
                    <p className="text-slate-700 italic mb-6 flex-grow">"{testimonial.quote}"</p>
                    <div className="flex items-center mt-auto">
                      <Image
                        src={testimonial.image || "/placeholder.svg"}
                        alt={`Avatar of ${testimonial.author}`}
                        width={40}
                        height={40}
                        className="rounded-full mr-3"
                        loading="lazy"
                        onError={(e) =>
                          (e.target.src = "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg")
                        }
                      />
                      <div>
                        <p className="font-semibold text-sm text-slate-800">{testimonial.author}</p>
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
      <section className="relative z-10 bg-white py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Frequently Asked Questions</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Everything you need to know about BuySmart</p>
          </div>
          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3 text-slate-800">{faq.question}</h3>
                  <p className="text-slate-600">{faq.answer}</p>
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
                {["Home", "Features", "Pricing", "Support"].map((item) => (
                  <li key={item}>
                    <a
                      href={`/${item.toLowerCase()}`}
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
                {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                  <li key={item}>
                    <a
                      href={`/${item.toLowerCase().replace(" ", "-")}`}
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
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
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
    </div>
  )
}

export default HomePage

