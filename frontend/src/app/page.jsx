"use client"
import { useState, useEffect, useRef } from "react"
import * as THREE from "three"
import Image from "next/image"
import Head from "next/head"
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
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const HomePage = () => {
  const [compareQuery, setCompareQuery] = useState("")
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [newsletterEmail, setNewsletterEmail] = useState("")
  const canvasRef = useRef(null)
  const modalRef = useRef(null)

  // Handle compare form submission
  const handleCompare = (e) => {
    e.preventDefault()
    console.log("Comparing:", compareQuery)
    // Placeholder for API call
  }

  // Handle newsletter signup
  const handleNewsletterSignup = (e) => {
    e.preventDefault()
    console.log("Newsletter signup:", newsletterEmail)
    setNewsletterEmail("")
    // Placeholder for API call
  }

  // Toggle help modal
  const toggleHelp = () => {
    setIsHelpOpen(!isHelpOpen)
  }

  // Keyboard support for modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isHelpOpen) setIsHelpOpen(false)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isHelpOpen])

  // Focus modal when opened
  useEffect(() => {
    if (isHelpOpen) modalRef.current?.focus()
  }, [isHelpOpen])

  // E-commerce Themed 3D Background
  useEffect(() => {
    if (!canvasRef.current) return

    try {
      const scene = new THREE.Scene()

      // Gradient background
      const gradientTexture = new THREE.CanvasTexture(
        (() => {
          const canvas = document.createElement("canvas")
          canvas.width = 512
          canvas.height = 512
          const context = canvas.getContext("2d")
          const gradient = context.createLinearGradient(0, 0, 0, 512)
          gradient.addColorStop(0, "#0f172a") // Tailwind slate-900
          gradient.addColorStop(1, "#1e293b") // Tailwind slate-800
          context.fillStyle = gradient
          context.fillRect(0, 0, 512, 512)
          return canvas
        })(),
      )
      scene.background = gradientTexture

      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
      const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true })
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

      // Lighting
      const ambientLight = new THREE.AmbientLight(0x6366f1, 0.3) // Indigo-500
      scene.add(ambientLight)
      const directionalLight = new THREE.DirectionalLight(0x818cf8, 0.7) // Indigo-400
      directionalLight.position.set(10, 10, 10)
      scene.add(directionalLight)

      // E-commerce product icons (simplified cubes)
      const productCount = 15
      const products = new THREE.Group()
      const productTypes = [
        { color: 0x6366f1, size: 0.8, label: "📱" }, // Indigo-500
        { color: 0x4f46e5, size: 1.0, label: "💻" }, // Indigo-600
        { color: 0x818cf8, size: 0.7, label: "🛒" }, // Indigo-400
        { color: 0xa5b4fc, size: 0.6, label: "🎧" }, // Indigo-300
      ]

      for (let i = 0; i < productCount; i++) {
        const type = productTypes[i % productTypes.length]
        const geometry = new THREE.BoxGeometry(type.size, type.size, type.size)
        const material = new THREE.MeshStandardMaterial({
          color: type.color,
          metalness: 0.2,
          roughness: 0.8,
        })
        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.set((Math.random() - 0.5) * 40, (Math.random() - 0.5) * 30, (Math.random() - 0.5) * 20)
        mesh.userData = {
          speed: Math.random() * 0.002 + 0.001,
          float: Math.random() * Math.PI * 2,
        }
        products.add(mesh)

        // Deal tag sprite
        const spriteCanvas = document.createElement("canvas")
        spriteCanvas.width = 128
        spriteCanvas.height = 128
        const ctx = spriteCanvas.getContext("2d")
        ctx.fillStyle = "#ec4899" // Tailwind pink-500
        ctx.beginPath()
        ctx.arc(64, 64, 50, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = "#ffffff"
        ctx.font = "24px Arial"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText("-20%", 64, 64)

        const spriteMap = new THREE.CanvasTexture(spriteCanvas)
        const spriteMaterial = new THREE.SpriteMaterial({
          map: spriteMap,
          transparent: true,
          opacity: 0.7,
        })
        const sprite = new THREE.Sprite(spriteMaterial)
        sprite.scale.set(0.5, 0.5, 1)
        sprite.position.set(0.8, 0.8, 0.8)
        mesh.add(sprite)
      }
      scene.add(products)

      camera.position.z = 30

      // Mouse interaction
      let mouseX = 0,
        mouseY = 0
      const onMouseMove = (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1
      }
      window.addEventListener("mousemove", onMouseMove)

      // Animation loop
      const clock = new THREE.Clock()
      const animate = () => {
        requestAnimationFrame(animate)
        const time = clock.getElapsedTime()

        // Animate products
        products.children.forEach((mesh) => {
          const { speed, float } = mesh.userData
          mesh.rotation.x += speed
          mesh.rotation.y += speed
          mesh.position.y += Math.sin(time * 0.5 + float) * 0.02
          const sprite = mesh.children[0]
          if (sprite) {
            sprite.position.x = Math.sin(time * 0.3) * 0.8
            sprite.position.y = Math.cos(time * 0.3) * 0.8
          }
        })

        // Parallax
        products.rotation.x = mouseY * 0.03
        products.rotation.y = mouseX * 0.03

        renderer.render(scene, camera)
      }
      animate()

      // Handle resize
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      }
      window.addEventListener("resize", handleResize)

      return () => {
        window.removeEventListener("resize", handleResize)
        window.removeEventListener("mousemove", onMouseMove)
        renderer.dispose()
        gradientTexture.dispose()
      }
    } catch (error) {
      console.error("Three.js initialization failed:", error)
    }
  }, [])

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
  ]

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
  ]

  const platforms = [
    { name: "Amazon", src: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
    { name: "Flipkart", src: "https://upload.wikimedia.org/wikipedia/commons/f/fe/Flipkart_Logo.svg" },
    { name: "JioMart", src: "https://www.jiomart.com/assets/jiomart-default/logo.png" },
    { name: "Croma", src: "https://upload.wikimedia.org/wikipedia/commons/4/44/Generic_Logo.svg" },
    { name: "Reliance Digital", src: "https://upload.wikimedia.org/wikipedia/commons/4/44/Generic_Logo.svg" },
  ]

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
  ]

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
  ]

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
  ]

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
      <div className="min-h-screen flex flex-col relative font-sans bg-slate-50">
        {/* Three.js Canvas */}
        <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-30" />

        {/* Help Floating Button */}
        <button
          onClick={toggleHelp}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-lg hover:scale-105 hover:shadow-[0_0_15px_rgba(99,102,241,0.6)] transition-transform duration-200 z-50"
          aria-label="Open help modal"
          aria-expanded={isHelpOpen}
        >
          <HelpCircle className="h-6 w-6" />
        </button>

        {/* Help Modal */}
        {isHelpOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div ref={modalRef} tabIndex={-1} className="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full">
              <h3 className="text-xl font-bold mb-4 text-slate-800">How to Use BuySmart</h3>
              <ol className="space-y-4 mb-6">
                <li className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                    1
                  </div>
                  <p className="text-slate-600">Install the BuySmart extension from the Chrome Web Store</p>
                </li>
                <li className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                    2
                  </div>
                  <p className="text-slate-600">Browse your favorite shopping sites as usual</p>
                </li>
                <li className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                    3
                  </div>
                  <p className="text-slate-600">When viewing a product, click the BuySmart icon in your browser</p>
                </li>
                <li className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                    4
                  </div>
                  <p className="text-slate-600">See if there's a better price on another site and save money!</p>
                </li>
              </ol>
              <Button
                onClick={toggleHelp}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
              >
                Got It
              </Button>
            </div>
          </div>
        )}

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
              <Button className="bg-indigo-600 hover:bg-indigo-700">Install Extension</Button>
            </nav>
            <button className="md:hidden text-slate-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
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
        <section className="relative z-10 bg-gradient-to-b from-white to-slate-50 py-16 sm:py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-center md:text-left">
                <Badge className="mb-4 bg-indigo-100 text-indigo-800 hover:bg-indigo-200 transition-colors">
                  Browser Extension
                </Badge>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
                  Never Overpay{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
                    Again
                  </span>
                </h1>
                <p className="text-lg text-slate-600 mb-8 max-w-xl mx-auto md:mx-0">
                  BuySmart automatically compares prices across top Indian e-commerce sites while you shop. One click to
                  find the best deal.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Button
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-6"
                    size="lg"
                  >
                    Add to Chrome - It's Free
                  </Button>
                  <Button
                    variant="outline"
                    className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 px-6 py-6"
                    size="lg"
                  >
                    <ExternalLink className="mr-2 h-5 w-5" /> Watch Demo
                  </Button>
                </div>
                <div className="mt-6 flex items-center justify-center md:justify-start">
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
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg blur-md opacity-30"></div>
                <div className="relative bg-white rounded-lg shadow-xl overflow-hidden border border-slate-200">
                  <div className="bg-slate-800 h-8 flex items-center px-4">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="mx-auto bg-slate-700 rounded-full px-4 py-1 text-xs text-slate-300 flex items-center">
                      <span className="mr-2">●</span> amazon.in
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                          <ShoppingCart className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-slate-900">BuySmart found better prices</h3>
                          <p className="text-xs text-slate-500">Click to view all options</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Save ₹2,000</Badge>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center mb-2">
                        <Image
                          src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
                          alt="Sony WH-1000XM4 Headphones"
                          width={60}
                          height={60}
                          className="rounded object-cover mr-3"
                        />
                        <div>
                          <h4 className="text-sm font-medium text-slate-900 line-clamp-1">
                            Sony WH-1000XM4 Wireless Headphones
                          </h4>
                          <p className="text-xs text-slate-500">Current site: Amazon</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex items-center">
                          <div className="w-8 h-8 mr-3 flex-shrink-0">
                            <Image
                              src="https://upload.wikimedia.org/wikipedia/commons/f/fe/Flipkart_Logo.svg"
                              alt="Flipkart"
                              width={32}
                              height={32}
                              className="object-contain"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900">Flipkart</p>
                            <p className="text-xs text-green-600 font-medium">Save ₹2,000</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-indigo-600">₹22,990</p>
                          <Button size="sm" className="mt-1 h-7 text-xs bg-indigo-600 hover:bg-indigo-700">
                            View Deal
                          </Button>
                        </div>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-slate-200">
                        <div className="flex items-center">
                          <div className="w-8 h-8 mr-3 flex-shrink-0">
                            <Image
                              src="https://upload.wikimedia.org/wikipedia/commons/4/44/Generic_Logo.svg"
                              alt="Croma"
                              width={32}
                              height={32}
                              className="object-contain"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900">Croma</p>
                            <p className="text-xs text-green-600 font-medium">Save ₹1,500</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-slate-700">₹23,490</p>
                          <Button size="sm" variant="outline" className="mt-1 h-7 text-xs">
                            View Deal
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <Button variant="link" className="text-xs text-indigo-600">
                        View price history <PieChart className="h-3 w-3 ml-1 inline" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Platforms Section */}
        <section className="relative z-10 bg-white py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-800">Supported E-commerce Sites</h2>
              <p className="text-slate-600 mt-2">BuySmart works with all major Indian shopping platforms</p>
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
                Finding the best deals has never been easier. Just install our extension and start saving.
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

            <div className="mt-16 max-w-4xl mx-auto">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg blur-md opacity-30"></div>
                <div className="relative bg-white rounded-lg shadow-xl overflow-hidden border border-slate-200">
                  <div className="bg-slate-800 h-10 flex items-center px-4">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="mx-auto bg-slate-700 rounded-full px-4 py-1 text-xs text-slate-300">
                      Extension Demo
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-slate-800">How the extension works</h3>
                      <Badge className="bg-indigo-100 text-indigo-800">Live Demo</Badge>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                          1
                        </div>
                        <p className="text-slate-600">Browse your favorite shopping sites</p>
                      </div>
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                          2
                        </div>
                        <p className="text-slate-600">BuySmart icon turns green when better prices are found</p>
                      </div>
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                          3
                        </div>
                        <p className="text-slate-600">Click the icon to see all available deals</p>
                      </div>
                    </div>
                    <div className="mt-6">
                      <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Install Extension Now</Button>
                    </div>
                  </div>
                </div>
              </div>
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
                    Instantly compare prices across multiple platforms while you shop, without leaving the page.
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

              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
                    <Shield className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-slate-800">Privacy Protection</h3>
                  <p className="text-slate-600">
                    We never collect your personal data or browsing history. Your privacy comes first.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-slate-800">Coupon Finder</h3>
                  <p className="text-slate-600">
                    Automatically finds and applies the best coupon codes to maximize your savings.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
                    <Zap className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-slate-800">Lightning Fast</h3>
                  <p className="text-slate-600">
                    Get results in milliseconds without slowing down your browsing experience.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Recent Comparisons Section */}
        <section className="relative z-10 bg-slate-50 py-16 sm:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Recent Savings</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">See how much our users have saved with BuySmart</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentComparisons.map((item, index) => (
                <Card key={index} className="overflow-hidden group hover:shadow-xl transition-shadow duration-300">
                  <div className="relative">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={400}
                      height={250}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) =>
                        (e.target.src = "https://images.pexels.com/photos/265906/pexels-photo-265906.jpeg")
                      }
                    />
                    <Badge className="absolute top-3 right-3 bg-green-500 hover:bg-green-600">
                      Saved {item.savings}
                    </Badge>
                  </div>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-slate-600 bg-slate-100">
                        {item.bestSite}
                      </Badge>
                      <div className="text-sm text-slate-500">
                        <span className="line-through">{item.originalPrice}</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-1 line-clamp-1">{item.name}</h3>
                    <div className="text-xl font-bold text-indigo-600 mb-4">{item.bestPrice}</div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700">View Deal</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="relative z-10 bg-white py-16 sm:py-24">
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
        <section className="relative z-10 bg-slate-50 py-16 sm:py-24">
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

        {/* CTA Section */}
        <section className="relative z-10 bg-white py-16 sm:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-8 sm:p-12 shadow-lg text-white">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-4">Ready to Start Saving?</h2>
                  <p className="text-indigo-100 mb-6">
                    Join thousands of smart shoppers who never overpay again. Install BuySmart today - it's completely
                    free!
                  </p>
                  <Button className="bg-white text-indigo-700 hover:bg-slate-100 px-6" size="lg">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2" fill="currentColor">
                      <path d="M16.24 7.76C15.07 6.59 13.54 6 12 6v6l-4.24 4.24c2.34 2.34 6.14 2.34 8.49 0 2.34-2.34 2.34-6.14-.01-8.48zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
                    </svg>
                    Add to Chrome
                  </Button>
                </div>
                <div className="hidden md:block">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white mr-3">
                          <ShoppingCart className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium">Average Savings</h3>
                          <p className="text-indigo-200 text-sm">Per purchase</p>
                        </div>
                      </div>
                      <div className="text-3xl font-bold">₹1,200+</div>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full mb-2">
                      <div className="h-2 bg-white rounded-full" style={{ width: "75%" }}></div>
                    </div>
                    <div className="text-right text-indigo-200 text-sm">Based on 10,000+ comparisons</div>
                  </div>
                </div>
              </div>
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
                  The browser extension that helps you find the best deals while shopping online.
                </p>
                <div className="flex space-x-4">
                  {["twitter", "facebook", "instagram"].map((social) => (
                    <a
                      key={social}
                      href={`https://${social}.com}
                      className="text-slate-400 hover:text-white transition-colors"
                      aria-label={Follow us on ${social}`}
                    >
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 12c0 3.314-2.686 6-6 6s-6-2.686-6-6 2.686-6 6-6 6 2.686 6 6z" />
                        </svg>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  {["Home", "Features", "Pricing", "Support"].map((item) => (
                    <li key={item}>
                      <a
                        href={`/${item.toLowerCase()}`}
                        className="text-slate-400 hover:text-white transition-colors flex items-center"
                      >
                        <ChevronRight className="h-3 w-3 mr-2" />
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
                        className="text-slate-400 hover:text-white transition-colors flex items-center"
                      >
                        <ChevronRight className="h-3 w-3 mr-2" />
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
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Sitemap
                </a>
                <span className="text-slate-700">•</span>
                <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Accessibility
                </a>
                <span className="text-slate-700">•</span>
                <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Contact
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

export default HomePage;