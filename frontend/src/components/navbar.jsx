"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast"; // Use react-hot-toast instead of sonner
import {
  Menu,
  X,
  Home,
  Info,
  Mail,
  History,
  LogOut,
  Search,
  Zap,
  User,
  ShoppingCart,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
    };

    // Check on initial load
    checkAuth();

    // Set up event listener for storage changes (in case user logs in/out in another tab)
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/about", label: "About", icon: Info },
    { href: "/contact", label: "Contact", icon: Mail },
    { href: "/user/history", label: "History", icon: History },
  ];

  const isActive = (href) => pathname === href;

  const handleLogout = () => {
    try {
      // Clear authentication data
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Clear cookies
      document.cookie =
        "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      document.cookie =
        "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";

      // Update authentication state
      setIsAuthenticated(false);

      // Show success message with react-hot-toast
      toast.success("Successfully logged out", {
        duration: 3000,
        position: "bottom-center",
        style: {
          background: "#10B981",
          color: "#fff",
          padding: "12px 16px",
          borderRadius: "8px",
        },
        iconTheme: {
          primary: "#fff",
          secondary: "#10B981",
        },
      });

      // Redirect to home page and refresh
      router.push("/login");
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Something went wrong during logout", {
        duration: 3000,
        position: "bottom-center",
        style: {
          background: "#EF4444",
          color: "#fff",
          padding: "12px 16px",
          borderRadius: "8px",
        },
      });
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-200/50"
            : "bg-white/95 backdrop-blur-sm shadow-sm"
        }`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                  <ShoppingCart className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  BuySmart
                </span>
                <Badge
                  variant="secondary"
                  className="hidden sm:inline-flex text-xs bg-indigo-50 text-indigo-700 border-indigo-200"
                >
                  Beta
                </Badge>
              </motion.div>
            </Link>

            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 group ${
                        isActive(item.href)
                          ? "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700"
                          : "text-slate-700 hover:text-indigo-600 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{item.label}</span>
                      {isActive(item.href) && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg -z-10"
                          transition={{
                            type: "spring",
                            bounce: 0.2,
                            duration: 0.6,
                          }}
                        />
                      )}
                    </motion.div>
                  </Link>
                );
              })}
            </div>
            <div className="hidden lg:flex items-center space-x-3">
              {isAuthenticated ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="border-gray-300 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-300"
                  >
                    <Link href="/user/profile">
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleLogout}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Log Out
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="border-gray-300 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-300"
                  >
                    <Link href="/login">
                      <User className="w-4 h-4 mr-2" />
                      Login
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    asChild
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Link href="/register">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>

            <div className="lg:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-2 hover:bg-gray-100 transition-colors duration-300"
                  >
                    <Menu className="w-6 h-6 text-slate-700" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 p-0">
                  <div className="flex flex-col h-full bg-gradient-to-br from-white to-gray-50">
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                            <ShoppingCart className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            BuySmart
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="p-2 hover:bg-gray-100"
                        >
                          <X className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex-1 p-6">
                      <div className="space-y-2">
                        {navItems.map((item, index) => {
                          const Icon = item.icon;
                          return (
                            <motion.div
                              key={item.href}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                              <Link
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center space-x-3 p-4 rounded-xl transition-all duration-300 ${
                                  isActive(item.href)
                                    ? "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 shadow-sm"
                                    : "text-slate-700 hover:bg-gray-100"
                                }`}
                              >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                                {isActive(item.href) && (
                                  <div className="ml-auto w-2 h-2 bg-indigo-600 rounded-full" />
                                )}
                              </Link>
                            </motion.div>
                          );
                        })}
                      </div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 }}
                        className="mt-8 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl"
                      >
                        <div className="flex items-center space-x-3 text-indigo-700">
                          <Search className="w-5 h-5" />
                          <span className="font-medium">Quick Search</span>
                        </div>
                        <p className="text-sm text-indigo-600 mt-1">
                          Find the best deals instantly
                        </p>
                      </motion.div>
                    </div>

                    <div className="p-6 border-t border-gray-200 space-y-3">
                      {isAuthenticated ? (
                        <>
                          <Button
                            variant="outline"
                            className="w-full justify-start border-gray-300 hover:border-indigo-300 hover:bg-indigo-50"
                            onClick={() => setIsMobileMenuOpen(false)}
                            asChild
                          >
                            <Link href="/user/profile">
                              <User className="w-4 h-4 mr-3" />
                              Profile Settings
                            </Link>
                          </Button>
                          <Button
                            className="w-full justify-start bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              handleLogout();
                            }}
                          >
                            <LogOut className="w-4 h-4 mr-3" />
                            Log Out
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            className="w-full justify-start border-gray-300 hover:border-indigo-300 hover:bg-indigo-50"
                            onClick={() => setIsMobileMenuOpen(false)}
                            asChild
                          >
                            <Link href="/login">
                              <User className="w-4 h-4 mr-3" />
                              Login
                            </Link>
                          </Button>
                          <Button
                            className="w-full justify-start bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
                            onClick={() => setIsMobileMenuOpen(false)}
                            asChild
                          >
                            <Link href="/register">
                              Sign Up
                            </Link>
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* This part depends on dynamic scroll info, which needs to be handled in state */}
        {/* Consider removing or replacing with actual logic inside useEffect/state */}
        {/* <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600"
          style={{
            width: `${scrollProgress}%`
          }}
        /> */}
      </motion.nav>
      <div className="h-20" />
    </>
  );
}
