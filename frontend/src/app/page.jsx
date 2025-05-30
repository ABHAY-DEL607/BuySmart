"use client"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import * as THREE from "three"
import { Clock, PieChart, Search, ShoppingCart, Tag, Zap, Star, TrendingUp, Shield, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { toast } from "react-hot-toast"
import { motion } from "framer-motion"

const HomePage = () => {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [newsletterEmail, setNewsletterEmail] = useState("")
  const mountRef = useRef(null)
  const [isMounted, setIsMounted] = useState(false)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted || !mountRef.current) return
    let renderer, scene, camera, particles
    const colors = [0x7dd3fc, 0x4c1d95, 0x4158d0, 0xc850c0]
    try {
      if (!window.WebGLRenderingContext) {
        console.error("WebGL not supported")
        toast.error("3D background not supported")
        return
      }

      scene = new THREE.Scene()
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000)
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setClearColor(0x000000, 0)
      mountRef.current.appendChild(renderer.domElement)

      const geometry = new THREE.BufferGeometry()
      const vertices = []
      const particleColors = []
      const particleCount = 3000
      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * 2000 - 1000
        const y = Math.random() * 2000 - 1000
        const z = Math.random() * 2000 - 1000
        vertices.push(x, y, z)
        const color = colors[Math.floor(Math.random() * colors.length)]
        particleColors.push((color >> 16) / 255, ((color >> 8) & 255) / 255, (color & 255) / 255)
      }
      geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3))
      geometry.setAttribute("color", new THREE.Float32BufferAttribute(particleColors, 3))
      const material = new THREE.PointsMaterial({
        size: 5,
        transparent: true,
        opacity: 0.8,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
      })
      particles = new THREE.Points(geometry, material)
      scene.add(particles)
      camera.position.z = 1000

      const animate = () => {
        if (!renderer) return
        requestAnimationFrame(animate)
        particles.rotation.x += 0.0005
        particles.rotation.y += 0.0005
        const positions = particles.geometry.attributes.position.array
        for (let i = 0; i < positions.length; i += 3) {
          const dx = positions[i] - mouse.x * 2
          const dy = positions[i + 1] - mouse.y * 2
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 200) {
            positions[i] += dx * 0.001
            positions[i + 1] += dy * 0.001
          }
        }
        particles.geometry.attributes.position.needsUpdate = true
        renderer.render(scene, camera)
      }
      animate()

      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      }
      window.addEventListener("resize", handleResize)

      const handleMouseMove = (event) => {
        setMouse({
          x: (event.clientX / window.innerWidth) * 2 - 1,
          y: -(event.clientY / window.innerHeight) * 2 + 1,
        })
      }
      window.addEventListener("mousemove", handleMouseMove)

      return () => {
        window.removeEventListener("resize", handleResize)
        window.removeEventListener("mousemove", handleMouseMove)
        if (mountRef.current && renderer.domElement) {
          mountRef.current.removeChild(renderer.domElement)
        }
        renderer.dispose()
      }
    } catch (error) {
      console.error("Three.js error:", error)
      toast.error("Failed to load 3D background")
    }
  }, [isMounted, mouse])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/compare?q=${encodeURIComponent(searchQuery)}`)
    } else {
      toast.error("Please enter a product to search")
    }
  }

  const handleNewsletterSignup = (e) => {
    e.preventDefault()
    if (newsletterEmail.trim()) {
      toast.success("Subscribed to newsletter!")
      setNewsletterEmail("")
    } else {
      toast.error("Please enter a valid email")
    }
  }

  const platforms = [
    { name: "Amazon", src: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
    { name: "Flipkart", src: "/flipkart.svg" },
    { name: "JioMart", src: "https://upload.wikimedia.org/wikipedia/en/thumb/5/54/JioMart_logo.svg/474px-JioMart_logo.svg.png?20201101192007" },
    { name: "Ebay", src: "/ebay.svg" },
    { name: "PaytmMall", src: "/paytmall.png" },
  ]

  const howItWorks = [
    {
      step: "Search",
      description: "Enter the product name you want to compare prices for across multiple platforms.",
      icon: <Search className="h-8 w-8" />,
      number: "01",
    },
    {
      step: "Compare",
      description: "View real-time prices from multiple e-commerce sites with detailed comparisons.",
      icon: <ShoppingCart className="h-8 w-8" />,
      number: "02",
    },
    {
      step: "Save",
      description: "Choose the best deal and save money on your purchase with confidence.",
      icon: <Zap className="h-8 w-8" />,
      number: "03",
    },
  ]

  const features = [
    {
      icon: <Tag className="h-6 w-6" />,
      title: "Real-time Price Comparison",
      description:
        "Instantly compare prices across multiple platforms with a single search and get the most accurate results.",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: <PieChart className="h-6 w-6" />,
      title: "Price History Tracking",
      description:
        "See how prices have changed over time and know if you're getting a genuine deal with historical data.",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Price Drop Alerts",
      description: "Get notified when prices drop for products you're watching across any platform via email or SMS.",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure & Private",
      description: "Your search data is encrypted and we never store your personal shopping preferences.",
      color: "bg-orange-100 text-orange-600",
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Smart Recommendations",
      description: "Get AI-powered suggestions for similar products and better deals based on your searches.",
      color: "bg-pink-100 text-pink-600",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Community Reviews",
      description: "Access aggregated reviews and ratings from multiple platforms to make informed decisions.",
      color: "bg-indigo-100 text-indigo-600",
    },
  ]

  const stats = [
    { number: "10,000+", label: "Active Users" },
    { number: "50M+", label: "Products Compared" },
    { number: "₹2.5Cr+", label: "Money Saved" },
    { number: "99.9%", label: "Uptime" },
  ]

  if (!isMounted) return null

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Three.js Background */}
      <div ref={mountRef} className="fixed inset-0 z-0" />

      {/* Gradient Overlay */}
      <div className="fixed inset-0 z-[1] bg-gradient-to-br from-white/95 via-white/90 to-white/95" />

      {/* Content */}
      <div className="relative z-10 flex flex-col flex-1">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="py-20 sm:py-32 lg:py-40"
        >
          <div className="container mx-auto px-4 text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <Badge
                variant="secondary"
                className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-200"
              >
                <Star className="w-4 h-4 mr-2 fill-current" />
                Trusted by 10,000+ shoppers
              </Badge>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-slate-900 mb-8 leading-tight"
            >
              Find the Best{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 animate-pulse">
                Deals
              </span>
              <br />
              <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-slate-700">Every Time</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl sm:text-2xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed"
            >
              Compare prices across top Indian e-commerce sites instantly and save money on every purchase.
              <span className="text-indigo-600 font-semibold"> Smart shopping made simple.</span>
            </motion.p>



            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-indigo-600 mb-1">{stat.number}</div>
                  <div className="text-sm text-slate-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Platforms Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="py-20 bg-gradient-to-r from-slate-50 to-gray-50"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">Supported E-commerce Platforms</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Compare prices from all major Indian shopping platforms in real-time
              </p>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-16">
              {platforms.map((platform, index) => (
                <motion.div
                  key={platform.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  className="flex items-center justify-center h-16 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <Image
                    src={platform.src || "/placeholder.svg"}
                    alt={`${platform.name} logo`}
                    width={140}
                    height={50}
                    className="object-contain h-full filter grayscale hover:grayscale-0 transition-all duration-300"
                    loading="lazy"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* How It Works Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="py-20 sm:py-32 bg-white"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-6">How BuySmart Works</h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Finding the best deals has never been easier. Our smart algorithm does the heavy lifting for you.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {howItWorks.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="relative"
                >
                  <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50">
                    <CardContent className="pt-8 pb-8 px-8">
                      <div className="flex flex-col items-center text-center">
                        {/* Step Number */}
                        <div className="absolute -top-4 left-8 w-8 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold flex items-center justify-center">
                          {step.number}
                        </div>

                        {/* Icon */}
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 mb-6 shadow-lg">
                          {step.icon}
                        </div>

                        {/* Content */}
                        <h3 className="text-2xl font-bold mb-4 text-slate-800">{step.step}</h3>
                        <p className="text-slate-600 leading-relaxed">{step.description}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Connector Line */}
                  {index < howItWorks.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-6 w-12 h-0.5 bg-gradient-to-r from-indigo-300 to-purple-300 transform -translate-y-1/2" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="py-20 sm:py-32 bg-gradient-to-br from-slate-50 via-white to-slate-50"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-6">
                Powerful Features for Smart Shopping
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                BuySmart goes beyond simple price comparison. Discover all the intelligent features that help you shop
                smarter and save more.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 h-full bg-white/80 backdrop-blur-sm">
                    <CardContent className="pt-8 pb-8 px-8 h-full flex flex-col">
                      <div
                        className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-6 shadow-md`}
                      >
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-bold mb-4 text-slate-800">{feature.title}</h3>
                      <p className="text-slate-600 leading-relaxed flex-grow">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pt-20 pb-10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
              <div>
                <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  BuySmart
                </h3>
                <p className="text-slate-300 mb-6 leading-relaxed">
                  The intelligent platform that helps you find the best deals while shopping online. Save time, save
                  money, shop smarter.
                </p>
                <div className="flex space-x-4">
                  {stats.slice(0, 2).map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-lg font-bold text-indigo-400">{stat.number}</div>
                      <div className="text-xs text-slate-400">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-6 text-white">Quick Links</h4>
                <ul className="space-y-3">
                  {["Home", "About", "Contact", "Comparison History", "Price Alerts"].map((item) => (
                    <li key={item}>
                      <a
                        href={`/${item.toLowerCase().replace(" ", "-")}`}
                        className="text-slate-300 hover:text-indigo-400 transition-colors duration-300 flex items-center group"
                      >
                        <span className="w-1 h-1 bg-indigo-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-6 text-white">Legal</h4>
                <ul className="space-y-3">
                  {["Privacy Policy", "Terms of Service", "Cookie Policy", "Data Protection"].map((item) => (
                    <li key={item}>
                      <a
                        href={`/${item.toLowerCase().replace(" ", "-")}`}
                        className="text-slate-300 hover:text-indigo-400 transition-colors duration-300 flex items-center group"
                      >
                        <span className="w-1 h-1 bg-indigo-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-6 text-white">Stay Updated</h4>
                <p className="text-slate-300 mb-6">
                  Subscribe for updates on new features, exclusive deals, and money-saving tips.
                </p>
                <form onSubmit={handleNewsletterSignup} className="space-y-4">
                  <Input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Your email address"
                    className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-indigo-500 focus:ring-indigo-500/20 rounded-lg"
                    required
                  />
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Subscribe Now
                  </Button>
                </form>
              </div>
            </div>

            <Separator className="bg-slate-700 my-8" />

            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-slate-400 text-sm mb-4 md:mb-0">
                © {new Date().getFullYear()} BuySmart. All rights reserved. Made with ❤️ in India.
              </p>
              <div className="flex items-center space-x-6">
                <span className="text-slate-400 text-sm">Powered by AI</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-slate-400 text-sm">All systems operational</span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default HomePage
