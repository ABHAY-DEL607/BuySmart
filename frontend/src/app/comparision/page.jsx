"use client"

import { useState, useEffect, useRef } from "react"
import * as THREE from "three"
import { Star, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

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
    productImage:
      "https://rukminim2.flixcart.com/image/832/832/l0igvww0/mobile/2/g/r/-original-imagca5kqvhuscnv.jpeg?q=70&crop=false",
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
    productImage:
      "https://www.jiomart.com/images/product/original/491997700/apple-iphone-13-128-gb-starlight-digital-o491997700-p590798551-0-202208221207.jpeg?im=Resize=(420,420)",
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
    productImage:
      "https://s.yimg.com/lo/api/res/1.2/03T0BIMeDUa_5FPMRjWXUw--/YXBwaWQ9ZWNfaG9yaXpvbnRhbDtoPTQwMDtzcz0xO3c9NDAw/https://m.media-amazon.com/images/I/31jgoap1cQL._SL500_.jpg",
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
]

const create3DBackground = (canvas) => {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true })
  renderer.setSize(window.innerWidth, window.innerHeight)

  // Add animated cubes
  const cubes = []
  for (let i = 0; i < 20; i++) {
    const geometry = new THREE.BoxGeometry()
    const material = new THREE.MeshBasicMaterial({
      color: 0x0066ff,
      opacity: 0.1,
      transparent: true,
    })
    const cube = new THREE.Mesh(geometry, material)
    cube.position.set(Math.random() * 20 - 10, Math.random() * 20 - 10, Math.random() * 20 - 10)
    scene.add(cube)
    cubes.push(cube)
  }

  camera.position.z = 5

  const animate = () => {
    requestAnimationFrame(animate)
    cubes.forEach((cube) => {
      cube.rotation.x += 0.01
      cube.rotation.y += 0.01
    })
    renderer.render(scene, camera)
  }

  animate()

  // Handle window resize
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  })
}

const ProductComparison = () => {
  const [sortedProducts, setSortedProducts] = useState(products)
  const [priceHistory, setPriceHistory] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const canvasRef = useRef(null)

  // Initialize 3D background and fetch price history
  useEffect(() => {
    if (canvasRef.current) {
      try {
        create3DBackground(canvasRef.current)
      } catch (error) {
        console.error("3D background initialization failed:", error)
      }
    }

    // Mock price history data since we don't have a real API
    const mockPriceHistory = [
      {
        productName: "Smartphone XYZ",
        currentSite: "Amazon",
        currentPrice: 34999,
        comparisons: [
          { site: "Flipkart", price: 33999 },
          { site: "JioMart", price: 35499 },
        ],
        createdAt: "2025-05-01T10:30:00Z",
      },
      {
        productName: "Laptop ABC",
        currentSite: "Flipkart",
        currentPrice: 65999,
        comparisons: [
          { site: "Amazon", price: 67999 },
          { site: "eBay", price: 66499 },
        ],
        createdAt: "2025-04-28T14:15:00Z",
      },
      {
        productName: "Headphones Pro",
        currentSite: "eBay",
        currentPrice: 12999,
        comparisons: [
          { site: "Amazon", price: 13499 },
          { site: "Paytm Mall", price: 13999 },
        ],
        createdAt: "2025-04-15T09:45:00Z",
      },
    ]

    // Simulate API fetch
    setTimeout(() => {
      setPriceHistory(mockPriceHistory)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Find the best deal
  const findBestDeal = (products) => {
    return products.reduce((best, current) => {
      const currentTotal = current.price + current.deliveryPrice + current.platformFee
      const bestTotal = best.price + best.deliveryPrice + best.platformFee
      return currentTotal < bestTotal ? current : best
    }, products[0])
  }

  const bestDeal = findBestDeal(products)

  const handleFilter = (value) => {
    const sorted = [...products]

    if (value === "price-asc") {
      sorted.sort((a, b) => a.price - b.price)
    } else if (value === "price-desc") {
      sorted.sort((a, b) => b.price - a.price)
    } else if (value === "delivery-time") {
      sorted.sort((a, b) => a.deliveryTime - b.deliveryTime)
    } else if (value === "delivery-price") {
      sorted.sort((a, b) => a.deliveryPrice - b.deliveryPrice)
    }

    setSortedProducts(sorted)
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-blue-50 to-white">
      {/* 3D Background Canvas */}
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10 opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
        <h1 className="text-4xl font-extrabold text-center mb-10 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse">
          BuySmart Product Comparison
        </h1>

        {/* Best Deal Highlight */}
        <Card className="mb-8 bg-gradient-to-r from-blue-100 to-purple-100 border-blue-300 shadow-lg">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">🏆 Best Deal</h2>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <img
                src={bestDeal.productImage || "/placeholder.svg"}
                alt={bestDeal.site}
                className="w-32 h-32 object-cover rounded-lg shadow-md"
              />
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{bestDeal.site}</h3>
                <p className="text-green-600 text-lg font-bold">₹{bestDeal.price.toLocaleString()}</p>
                <p className="text-amber-600">{bestDeal.discount}</p>
                <p className="text-gray-700">
                  Total Cost: ₹{(bestDeal.price + bestDeal.deliveryPrice + bestDeal.platformFee).toLocaleString()}
                </p>
                <a href={bestDeal.link} target="_blank" rel="noopener noreferrer">
                  <Button className="mt-3 bg-blue-600 hover:bg-blue-700 transition-all hover:scale-105">
                    Get This Deal
                  </Button>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Price History Section */}
        <Card className="mb-8 bg-white border-blue-200 shadow-md">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">📊 Your Price History</h2>
            {isLoading ? (
              <div className="text-center text-gray-500">Loading price history...</div>
            ) : error ? (
              <div className="text-center text-red-500">{error}</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {priceHistory.length > 0 ? (
                  priceHistory.map((item, index) => (
                    <div key={index} className="bg-blue-50 p-4 rounded-lg shadow-sm border border-blue-100">
                      <h3 className="font-semibold text-gray-800 mb-2">{item.productName}</h3>
                      <p className="text-blue-700">Current Site: {item.currentSite}</p>
                      <p className="text-green-600">Price: ₹{item.currentPrice.toLocaleString()}</p>
                      <div className="mt-2">
                        <p className="text-amber-700 text-sm font-semibold">Comparisons:</p>
                        <ul className="space-y-1 mt-1">
                          {item.comparisons?.map((comp, idx) => (
                            <li key={idx} className="text-gray-700 text-sm">
                              {comp.site}: ₹{comp.price.toLocaleString()}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <p className="text-gray-500 text-xs mt-2">
                        Saved on: {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 col-span-3">
                    No price history available. Start comparing products to build your history!
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Filter Dropdown */}
        <div className="flex justify-center mb-8">
          <Select onValueChange={handleFilter}>
            <SelectTrigger className="w-[200px] bg-blue-100 hover:bg-blue-200 border-blue-300">
              <SelectValue placeholder="Apply Filters" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price-asc">Sort by Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Sort by Price: High to Low</SelectItem>
              <SelectItem value="delivery-time">Sort by Delivery Time (Fastest)</SelectItem>
              <SelectItem value="delivery-price">Sort by Delivery Price (Lowest)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {sortedProducts.map((product) => (
            <Card
              key={product.id}
              className="bg-white p-4 text-center transition-transform transform hover:scale-105 hover:shadow-xl border border-gray-200"
            >
              <CardContent className="p-0">
                <a href={product.link} target="_blank" rel="noopener noreferrer">
                  <img src={product.logo || "/placeholder.svg"} alt={product.site} className="h-8 mx-auto mb-4" />
                </a>
                <img
                  src={product.productImage || "/placeholder.svg"}
                  alt={product.site + " Product"}
                  className="w-24 h-24 object-cover mx-auto mb-4 rounded shadow-sm"
                />
                <p className="font-semibold text-sm text-gray-800">Smartphone XYZ</p>
                <p className="text-xs text-gray-500">Model: XYZ-123</p>
                <p className="text-sm mt-1 text-gray-800">₹{product.price.toLocaleString()}</p>
                <p className="text-green-600 text-xs mb-1">{product.discount}</p>
                <div className="flex justify-center text-amber-500 text-sm">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3 h-3" fill={i < product.rating ? "currentColor" : "none"} />
                  ))}
                </div>
                <p
                  className={`text-xs mb-1 font-semibold ${product.availability === "Out of Stock" ? "text-red-600" : "text-green-600"}`}
                >
                  {product.availability}
                </p>
                <p className="text-xs text-gray-600 mb-1">
                  Delivery: {product.deliveryTime} days, ₹{product.deliveryPrice}
                </p>
                <p className="text-xs text-gray-600 mb-2">Platform Fee: ₹{product.platformFee}</p>

                {/* Specs */}
                <div className="text-xs text-gray-600 text-left mb-2">
                  <p>
                    <strong>Processor:</strong> {product.specs.processor}
                  </p>
                  <p>
                    <strong>RAM:</strong> {product.specs.ram}
                  </p>
                  <p>
                    <strong>Storage:</strong> {product.specs.storage}
                  </p>
                  <p>
                    <strong>Display:</strong> {product.specs.display}
                  </p>
                  <p>
                    <strong>Camera:</strong> {product.specs.camera}
                  </p>
                  <p>
                    <strong>Battery:</strong> {product.specs.battery}
                  </p>
                  <p>
                    <strong>OS:</strong> {product.specs.os}
                  </p>
                </div>

                <a href={product.link} target="_blank" rel="noopener noreferrer">
                  <Button variant="default" className="w-full bg-blue-600 hover:bg-blue-700 text-sm">
                    Buy Now
                  </Button>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Testimonials */}
        <section className="mt-12 bg-blue-50 p-6 rounded-md mx-auto max-w-6xl shadow-md border border-blue-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4">What Our Users Say</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            {[
              { text: "BuySmart saved me a lot of money while buying my new phone!", user: "Rahul S." },
              { text: "Easy to use and very helpful when comparing different sites.", user: "Priya K." },
              { text: "Highly recommend it to anyone shopping online!", user: "Ankit R." },
            ].map((review, i) => (
              <div key={i} className="bg-blue-500 p-4 rounded-md hover:bg-blue-600 transition text-white shadow-sm">
                <p>"{review.text}"</p>
                <span className="block mt-2 text-yellow-200 font-semibold">- {review.user}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} BuySmart. All rights reserved.
        </footer>
      </div>

      {/* Help Button */}
      <Button
        onClick={() => alert("Need help? Contact support@buysmart.com")}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg"
        size="icon"
      >
        <HelpCircle className="h-5 w-5" />
        <span className="sr-only">Help</span>
      </Button>
    </div>
  )
}

export default ProductComparison








