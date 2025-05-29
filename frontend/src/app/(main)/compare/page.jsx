'use client';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import * as THREE from 'three';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { API_URL } from '@/services/config';

const SUPPORTED_SITES = [
  { id: 'amazon', name: 'Amazon' },
  { id: 'flipkart', name: 'Flipkart' },
  { id: 'paytmmall', name: 'Paytm Mall' },
  { id: 'jiomart', name: 'JioMart' },
  { id: 'ebay', name: 'eBay' },
];

const Compare = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  
  const [searchQuery, setSearchQuery] = useState(query);
  const [isLoading, setIsLoading] = useState(false);
  const [comparisons, setComparisons] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc'); // Price sorting: asc/desc
  const [selectedSites, setSelectedSites] = useState(SUPPORTED_SITES.map(s => s.id));
  const mountRef = useRef(null);
    

 

  // 3D Background Setup with Three.js
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    for (let i = 0; i < 1000; i++) {
      const x = Math.random() * 2000 - 1000;
      const y = Math.random() * 2000 - 1000;
      const z = Math.random() * 2000 - 1000;
      vertices.push(x, y, z);
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    const material = new THREE.PointsMaterial({ color: 0x4f46e5, size: 2 });
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    camera.position.z = 1000;

    const animate = () => {
      requestAnimationFrame(animate);
      particles.rotation.x += 0.0005;
      particles.rotation.y += 0.0005;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  // Fetch comparison data
  useEffect(() => {
    const fetchComparisons = async () => {
      if (!query) return;
      setIsLoading(true);
      setComparisons([]);
      let allResults = [];
      try {
        await Promise.all(
          SUPPORTED_SITES.map(async (site) => {
            if (!selectedSites.includes(site.id)) return;
            const searchUrl = getSearchUrl(site.id, query);
            const res = await fetch(`${API_URL}/api/scrape/${site.id}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ query, url: searchUrl }),
            });
            const data = await res.json();
            if (data.products && data.products.length > 0) {
              const p = data.products[0];
              allResults.push({
                site: site.name,
                price: p.price ? `₹${p.price.toLocaleString()}` : 'N/A',
                delivery: p.delivery || 'Free',
                rating: p.rating || 'N/A',
                url: p.url || '#',
              });
            }
          })
        );
        if (allResults.length > 0) {
          setComparisons(allResults);
          toast.success(`Found prices for "${query}"`);
        } else {
          toast.error(`No results found for "${query}"`);
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch comparison data. Please try again.');
      }
      setIsLoading(false);
    };

    if (query) {
      fetchComparisons();
    }
  }, [query, selectedSites]);

  // Search URL generator
  const getSearchUrl = (siteId, query) => {
    switch (siteId) {
      case 'amazon':
        return `https://www.amazon.in/s?k=${encodeURIComponent(query)}`;
      case 'flipkart':
        return `https://www.flipkart.com/search?q=${encodeURIComponent(query)}`;
      case 'paytmmall':
        return `https://paytmmall.com/search?q=${encodeURIComponent(query)}`;
      case 'jiomart':
        return `https://www.jiomart.com/search/${encodeURIComponent(query)}`;
      case 'ebay':
        return `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(query)}`;
      default:
        return '';
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/compare?q=${encodeURIComponent(searchQuery)}`);
    } else {
      toast.error('Please enter a product to search');
    }
  };

  // Handle site filter
  const handleSiteFilter = (siteId) => {
    setSelectedSites((prev) =>
      prev.includes(siteId) ? prev.filter((id) => id !== siteId) : [...prev, siteId]
    );
  };

  // Sort comparisons by price
  const handleSort = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  // Filter and sort comparisons
  const filteredComparisons = comparisons
    .filter((item) => {
      const price = item.price !== 'N/A' ? parseInt(item.price.replace(/[^\d]/g, '')) : Infinity;
      return price >= 100; // Filter out unrealistically low prices
    })
    .sort((a, b) => {
      const priceA = a.price !== 'N/A' ? parseInt(a.price.replace(/[^\d]/g, '')) : Infinity;
      const priceB = b.price !== 'N/A' ? parseInt(b.price.replace(/[^\d]/g, '')) : Infinity;
      return sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
    });

  // Get best deal
  const getBestDeal = () => {
    if (!filteredComparisons.length) return null;
    return filteredComparisons.reduce((best, current) => {
      const bestPrice = best.price !== 'N/A' ? parseInt(best.price.replace(/[^\d]/g, '')) : Infinity;
      const currentPrice = current.price !== 'N/A' ? parseInt(current.price.replace(/[^\d]/g, '')) : Infinity;
      return currentPrice < bestPrice ? current : best;
    }, filteredComparisons[0]);
  };

  const bestDeal = getBestDeal();

  // Handle logout
  const handleLogout = () => {
    console.log('User logged out');
    toast.success('Logged out successfully');
    router.push('/login');
  };

  // Loading skeleton
  const renderSkeleton = () => (
    <div className="space-y-4">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="flex items-center space-x-4 p-4 bg-gray-100 rounded-lg animate-pulse">
          <div className="w-24 h-6 bg-gray-300 rounded"></div>
          <div className="w-32 h-6 bg-gray-300 rounded"></div>
          <div className="w-20 h-6 bg-gray-300 rounded"></div>
          <div className="w-16 h-6 bg-gray-300 rounded"></div>
          <div className="w-24 h-8 bg-gray-300 rounded"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col relative font-sans bg-slate-50">
      {/* 3D Background */}
      <div ref={mountRef} className="fixed inset-0 z-0 opacity-20" />

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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {query ? `Price Comparison: ${query}` : 'Search for Products'}
          </h1>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative max-w-2xl mb-6">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products (e.g., iPhone 14, Sony headphones)"
              className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 ease-in-out transform hover:scale-105 focus:scale-105"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </form>

          {/* Site Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            {SUPPORTED_SITES.map((site) => (
              <Button
                key={site.id}
                variant={selectedSites.includes(site.id) ? 'default' : 'outline'}
                onClick={() => handleSiteFilter(site.id)}
                className={`px-4 py-2 ${
                  selectedSites.includes(site.id)
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {site.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="py-16">
            <div className="flex justify-center items-center mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              <p className="ml-4 text-lg text-gray-600">Searching across sites...</p>
            </div>
            {renderSkeleton()}
          </div>
        )}

        {/* Best Deal Highlight */}
        {bestDeal && !isLoading && (
          <div className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
            <h2 className="text-xl font-semibold text-green-800 mb-2">Best Deal Found!</h2>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <p className="text-green-700">
                  <span className="font-semibold">{bestDeal.site}</span> has the best price at
                  <span className="text-xl font-bold ml-2">{bestDeal.price}</span>
                </p>
                <p className="text-sm text-green-600">
                  Delivery: {bestDeal.delivery} • Rating: {bestDeal.rating}/5
                </p>
              </div>
              <a
                href={bestDeal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 md:mt-0 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                View Deal
              </a>
            </div>
          </div>
        )}

        {/* Error State */}
        {!isLoading && query && comparisons.length === 0 && (
          <div className="text-center py-16 bg-red-50 p-6 rounded-lg border border-red-200">
            <h2 className="text-2xl font-semibold text-red-600 mb-2">No Results Found</h2>
            <p className="text-red-500 mb-4">Try searching for a different product or check your spelling.</p>
            <Button
              onClick={() => router.push(`/compare?q=${encodeURIComponent(searchQuery)}`)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Retry Search
            </Button>
          </div>
        )}

        {/* Filtered Results Warning */}
        {!isLoading && comparisons.length > 0 && filteredComparisons.length === 0 && (
          <div className="mb-8 bg-yellow-50 p-6 rounded-lg border border-yellow-200 text-yellow-800">
            No realistic prices found. All results were filtered out as too low to be genuine product prices.
          </div>
        )}

        {/* Comparison Table */}
        {!isLoading && filteredComparisons.length > 0 && (
          <div className="overflow-x-auto">
            <div className="flex justify-end mb-4">
              <Button
                onClick={handleSort}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Sort by Price: {sortOrder === 'asc' ? 'Low to High' : 'High to Low'}
              </Button>
            </div>
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Site
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delivery
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredComparisons.map((item, index) => (
                  <tr key={index} className={item === bestDeal ? 'bg-green-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{item.site}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900 font-semibold">{item.price}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-500">{item.delivery}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-500">{item.rating}/5</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                      >
                        Visit Site
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Compare;