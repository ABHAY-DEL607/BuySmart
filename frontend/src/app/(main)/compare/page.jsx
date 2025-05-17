'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { API_URL } from '@/services/config';

const Compare = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    
    const [searchQuery, setSearchQuery] = useState(query);
    const [isLoading, setIsLoading] = useState(false);
    const [comparisons, setComparisons] = useState([]);
    
    // Dummy data for now - this would be fetched from API
    const dummyComparisons = {
        'iphone': [
            { site: 'Amazon', price: '₹79,900', delivery: 'Free', rating: 4.5, url: 'https://amazon.in' },
            { site: 'Flipkart', price: '₹78,499', delivery: '₹40', rating: 4.4, url: 'https://flipkart.com' },
            { site: 'Croma', price: '₹79,999', delivery: 'Free', rating: 4.3, url: 'https://croma.com' },
            { site: 'Reliance Digital', price: '₹80,900', delivery: 'Free', rating: 4.2, url: 'https://reliancedigital.in' },
        ],
        'samsung': [
            { site: 'Amazon', price: '₹59,900', delivery: 'Free', rating: 4.3, url: 'https://amazon.in' },
            { site: 'Flipkart', price: '₹58,499', delivery: '₹40', rating: 4.5, url: 'https://flipkart.com' },
            { site: 'Croma', price: '₹60,999', delivery: 'Free', rating: 4.2, url: 'https://croma.com' },
            { site: 'Reliance Digital', price: '₹59,900', delivery: 'Free', rating: 4.0, url: 'https://reliancedigital.in' },
        ],
        'headphones': [
            { site: 'Amazon', price: '₹24,900', delivery: 'Free', rating: 4.7, url: 'https://amazon.in' },
            { site: 'Flipkart', price: '₹25,499', delivery: '₹40', rating: 4.6, url: 'https://flipkart.com' },
            { site: 'Croma', price: '₹24,999', delivery: 'Free', rating: 4.4, url: 'https://croma.com' },
            { site: 'Headphone Zone', price: '₹24,900', delivery: '₹199', rating: 4.8, url: 'https://headphonezone.in' },
        ]
    };
    
    // Fetch comparison data on load or when query changes
    useEffect(() => {
        if (query) {
            setIsLoading(true);
            // Simulate API call
            setTimeout(() => {
                // Find best match from dummy data
                const matchingKey = Object.keys(dummyComparisons).find(key => 
                    query.toLowerCase().includes(key)
                );
                
                if (matchingKey) {
                    setComparisons(dummyComparisons[matchingKey]);
                    toast.success(`Found prices for "${query}"`);
                } else {
                    setComparisons([]);
                    toast.error(`No results found for "${query}"`);
                }
                setIsLoading(false);
            }, 1500);
            
            // TODO: Replace with actual API call when ready
            // Example:
            // fetch(`${API_URL}/api/compare?q=${encodeURIComponent(query)}`)
            //     .then(res => res.json())
            //     .then(data => {
            //         setComparisons(data);
            //         setIsLoading(false);
            //     })
            //     .catch(err => {
            //         console.error(err);
            //         toast.error('Error fetching comparison data');
            //         setIsLoading(false);
            //     });
        } else if (category) {
            // Handle category-based search
            setIsLoading(true);
            setTimeout(() => {
                // Just show a random comparison for the demo
                const keys = Object.keys(dummyComparisons);
                const randomKey = keys[Math.floor(Math.random() * keys.length)];
                setComparisons(dummyComparisons[randomKey]);
                setIsLoading(false);
            }, 1500);
        }
    }, [query, category]);
    
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/compare?q=${encodeURIComponent(searchQuery)}`);
        } else {
            toast.error('Please enter a product to search');
        }
    };
    
    // Find the best deal
    const getBestDeal = () => {
        if (!comparisons.length) return null;
        
        return comparisons.reduce((best, current) => {
            const bestPrice = parseInt(best.price.replace(/[^\d]/g, ''));
            const currentPrice = parseInt(current.price.replace(/[^\d]/g, ''));
            return currentPrice < bestPrice ? current : best;
        }, comparisons[0]);
    };
    
    const bestDeal = getBestDeal();
    
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    {query ? `Price Comparison: ${query}` : 'Browse Products by Category'}
                </h1>
                
                {/* Search Bar */}
                <div className="mt-4 max-w-2xl">
                    <form onSubmit={handleSearch} className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for products (e.g., iPhone 14, Sony headphones)"
                            className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button 
                            type="submit"
                            className="absolute right-3 top-3 text-gray-400 hover:text-blue-600"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
            
            {/* Loading state */}
            {isLoading && (
                <div className="flex justify-center items-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="ml-4 text-lg">Searching across sites...</p>
                </div>
            )}
            
            {/* Best deal highlight */}
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
            
            {/* Comparison table */}
            {!isLoading && comparisons.length > 0 && (
                <div className="overflow-x-auto">
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
                            {comparisons.map((item, index) => (
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
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
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
            
            {/* No results */}
            {!isLoading && query && comparisons.length === 0 && (
                <div className="text-center py-16">
                    <h2 className="text-2xl font-semibold text-gray-600 mb-2">No results found</h2>
                    <p className="text-gray-500">Try searching for a different product or check your spelling</p>
                </div>
            )}
        </div>
    );
};

export default Compare; 