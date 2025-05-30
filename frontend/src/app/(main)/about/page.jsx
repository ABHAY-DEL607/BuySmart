"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "react-hot-toast"
import { motion } from "framer-motion"
import {
  Target,
  Users,
  Shield,
  TrendingUp,
  Award,
  Heart,
  Globe,
  Lightbulb,
  Star,
  ArrowRight,
  CheckCircle,
  MapPin,
  Mail,
  Linkedin,
  Twitter,
} from "lucide-react"

const AboutPage = () => {
  const router = useRouter()
  const [newsletterEmail, setNewsletterEmail] = useState("")

  const handleNewsletterSignup = (e) => {
    e.preventDefault()
    if (newsletterEmail.trim()) {
      toast.success("Subscribed to newsletter!")
      setNewsletterEmail("")
    } else {
      toast.error("Please enter a valid email")
    }
  }

  const stats = [
    { number: "10,000+", label: "Happy Users", icon: Users },
    { number: "50M+", label: "Products Compared", icon: TrendingUp },
    { number: "₹2.5Cr+", label: "Money Saved", icon: Award },
    { number: "99.9%", label: "Uptime", icon: Shield },
  ]

  const values = [
    {
      icon: <Target className="h-8 w-8" />,
      title: "Transparency",
      description: "We believe in complete transparency in pricing and never hide any costs or fees from our users.",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "User-Centric",
      description: "Every feature we build is designed with our users' needs and convenience in mind.",
      color: "bg-red-100 text-red-600",
    },
    {
      icon: <Lightbulb className="h-8 w-8" />,
      title: "Innovation",
      description: "We continuously innovate to bring you the latest technology for smarter shopping.",
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Accessibility",
      description: "Making smart shopping accessible to everyone, regardless of their technical expertise.",
      color: "bg-green-100 text-green-600",
    },
  ]

  const timeline = [
    {
      year: "2025",
      title: "BuySmart Founded",
      description: "Started with a vision to make online shopping smarter and more affordable for everyone.",
    },
    {
      year: "2025",
      title: "First Platform Integration",
      description: "Successfully integrated with Amazon and Flipkart for real-time price comparisons.",
    },
    {
      year: "2025",
      title: "10,000 Users Milestone",
      description: "Reached our first major milestone of 10,000 active users within months of launch.",
    },
    {
      year: "2025",
      title: "AI-Powered Features",
      description: "Launched intelligent price prediction and personalized deal recommendations.",
    },
  ]

  const team = [
    {
      name: "Amit Sharma",
      role: "Founder & CEO",
      image: "/placeholder.svg?height=200&width=200",
      bio: "10+ years in e-commerce and fintech. Passionate about democratizing smart shopping.",
      location: "Mumbai, India",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "amit@buysmart.com",
      },
    },
    {
      name: "Sneha Patel",
      role: "Lead Developer",
      image: "/placeholder.svg?height=200&width=200",
      bio: "Full-stack developer with expertise in scalable web applications and data processing.",
      location: "Bangalore, India",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "sneha@buysmart.com",
      },
    },
    {
      name: "Ravi Kumar",
      role: "Product Manager",
      image: "/placeholder.svg?height=200&width=200",
      bio: "Product strategist focused on user experience and market research in the Indian e-commerce space.",
      location: "Delhi, India",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "ravi@buysmart.com",
      },
    },
  ]

  const achievements = [
    "Featured in TechCrunch India",
    "Winner of Best Shopping App 2025",
    "Trusted by 10,000+ users",
    "99.9% uptime guarantee",
    "ISO 27001 certified",
    "GDPR compliant",
  ]

  return (
    <div className="min-h-screen flex flex-col relative font-sans bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/30 py-20 sm:py-32"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <Badge
                variant="secondary"
                className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-200 mb-6"
              >
                <Star className="w-4 h-4 mr-2 fill-current" />
                About Our Mission
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 mb-8 leading-tight tracking-tight"
            >
              Revolutionizing  Smart Shopping{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
               
              </span>
              <br />
              <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-slate-700">in India</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-xl sm:text-2xl text-slate-600 mb-8 leading-relaxed max-w-3xl mx-auto"
            >
              BuySmart is your intelligent shopping companion, leveraging cutting-edge technology to help you find the
              best deals across India's top e-commerce platforms.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-lg text-slate-600 mb-12 leading-relaxed max-w-3xl mx-auto"
            >
              Founded in 2025, we've already helped thousands of shoppers save millions of rupees through real-time
              price comparisons, intelligent alerts, and data-driven insights. Our mission is simple: make every
              purchase a smart purchase.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                onClick={() => router.push("/")}
                size="lg"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Start Comparing Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => router.push("/contact")}
                className="px-8 py-6 text-lg font-semibold border-2 border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-300"
              >
                Get in Touch
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-16 bg-white"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center">
                    <Icon className="w-8 h-8 text-indigo-600" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">{stat.number}</div>
                  <div className="text-slate-600 font-medium">{stat.label}</div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </motion.section>

      {/* Values Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-20 sm:py-32 bg-gradient-to-br from-slate-50 to-gray-50"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-6">Our Core Values</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              These principles guide everything we do and shape the way we build products for our users.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 h-full bg-white/80 backdrop-blur-sm">
                  <CardContent className="pt-8 pb-8 px-8 text-center h-full flex flex-col">
                    <div
                      className={`w-16 h-16 mx-auto mb-6 rounded-2xl ${value.color} flex items-center justify-center`}
                    >
                      {value.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-slate-800">{value.title}</h3>
                    <p className="text-slate-600 leading-relaxed flex-grow">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Timeline Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-20 sm:py-32 bg-white"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-6">Our Journey</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              From a simple idea to helping thousands of shoppers save money every day.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="flex items-center mb-12 last:mb-0"
              >
                <div className="flex-1 text-right pr-8">
                  {index % 2 === 0 && (
                    <div>
                      <div className="text-2xl font-bold text-indigo-600 mb-2">{item.year}</div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2">{item.title}</h3>
                      <p className="text-slate-600">{item.description}</p>
                    </div>
                  )}
                </div>

                <div className="w-4 h-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full relative z-10">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full animate-ping opacity-20"></div>
                </div>

                <div className="flex-1 text-left pl-8">
                  {index % 2 === 1 && (
                    <div>
                      <div className="text-2xl font-bold text-indigo-600 mb-2">{item.year}</div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2">{item.title}</h3>
                      <p className="text-slate-600">{item.description}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-20 sm:py-32 bg-gradient-to-br from-slate-50 to-gray-50"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-6">Meet Our Team</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              The passionate individuals behind BuySmart, dedicated to making your shopping experience smarter and more
              rewarding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 bg-white/90 backdrop-blur-sm overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative">
                      <Image
                        src={member.image || "/placeholder.svg"}
                        alt={member.name}
                        width={400}
                        height={300}
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>

                    <div className="p-8">
                      <h3 className="text-2xl font-bold text-slate-800 mb-2">{member.name}</h3>
                      <p className="text-indigo-600 font-semibold mb-4">{member.role}</p>
                      <p className="text-slate-600 mb-6 leading-relaxed">{member.bio}</p>

                      <div className="flex items-center text-slate-500 mb-6">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="text-sm">{member.location}</span>
                      </div>

                      <div className="flex space-x-4">
                        <a
                          href={member.social.linkedin}
                          className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-200 transition-colors duration-300"
                        >
                          <Linkedin className="w-5 h-5" />
                        </a>
                        <a
                          href={member.social.twitter}
                          className="w-10 h-10 bg-sky-100 text-sky-600 rounded-lg flex items-center justify-center hover:bg-sky-200 transition-colors duration-300"
                        >
                          <Twitter className="w-5 h-5" />
                        </a>
                        <a
                          href={`mailto:${member.social.email}`}
                          className="w-10 h-10 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors duration-300"
                        >
                          <Mail className="w-5 h-5" />
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Achievements Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-20 bg-white"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-6">Recognition & Achievements</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              We're proud of the milestones we've achieved and the recognition we've received from the industry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200"
              >
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                <span className="text-slate-700 font-medium">{achievement}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-20 sm:py-32 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600"
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-bold text-white mb-6"
          >
            Ready to Start Saving?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-white/90 mb-8 max-w-2xl mx-auto"
          >
            Join thousands of smart shoppers who are already saving money with BuySmart.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button
              onClick={() => router.push("/")}
              size="lg"
              className="bg-white text-indigo-600 hover:bg-gray-50 px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Start Comparing Prices
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
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
  )
}

export default AboutPage
