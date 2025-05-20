'use client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'react-hot-toast';

const AboutPage = () => {
  const router = useRouter();

  // Handle logout
  const handleLogout = () => {
    console.log('User logged out');
    toast.success('Logged out successfully');
    router.push('/login');
  };

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

      {/* About Section */}
      <section className="relative z-10 bg-gradient-to-b from-white to-slate-50 py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
              About{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
                BuySmart
              </span>
            </h1>
            <p className="text-lg text-slate-600 mb-8">
              BuySmart is your go-to platform for finding the best deals across major Indian e-commerce sites. Our mission is to empower shoppers with real-time price comparisons, helping you save time and money.
            </p>
            <p className="text-lg text-slate-600 mb-8">
              Founded in 2025, BuySmart leverages advanced scraping technology to bring you accurate and up-to-date pricing from platforms like Amazon, Flipkart, JioMart, eBay, and Paytm Mall. Whether you're hunting for electronics, fashion, or home essentials, we've got you covered.
            </p>
            <Button
              onClick={() => router.push('/')}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-6"
            >
              Start Comparing Now
            </Button>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="relative z-10 bg-white py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Our Team</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Meet the passionate team behind BuySmart, dedicated to making your shopping experience smarter.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Amit Sharma', role: 'Founder & CEO', image: '/placeholder.svg' },
              { name: 'Sneha Patel', role: 'Lead Developer', image: '/placeholder.svg' },
              { name: 'Ravi Kumar', role: 'Product Manager', image: '/placeholder.svg' },
            ].map((member, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-slate-200 mb-4"></div>
                <h3 className="text-xl font-semibold text-slate-800">{member.name}</h3>
                <p className="text-slate-600">{member.role}</p>
              </div>
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
              <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
                <Input
                  type="email"
                  placeholder="Your email address"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 transition-all duration-300 ease-in-out transform hover:scale-105 focus:scale-105 focus:ring-2 focus:ring-indigo-500"
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
  );
};

export default AboutPage;