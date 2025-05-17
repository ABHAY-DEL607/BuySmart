'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { API_URL } from '@/services/config';

const Home = () => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [recentProducts, setRecentProducts] = useState([
        { id: 1, name: 'iPhone 14 Pro', category: 'Electronics', price: '₹119,999' },
        { id: 2, name: 'Samsung Galaxy S23', category: 'Electronics', price: '₹79,999' },
        { id: 3, name: 'Sony WH-1000XM5', category: 'Audio', price: '₹34,990' },
        { id: 4, name: 'Amazon Echo Dot', category: 'Smart Home', price: '₹4,499' },
    ]);
    
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        // Check authentication
        const token = localStorage.getItem('token');
        const userJson = localStorage.getItem('user');
        
        if (token && userJson) {
            try {
                setUser(JSON.parse(userJson));
            } catch (e) {
                console.error('Error parsing user data:', e);
            }
        } else {
            // Redirect to login if not authenticated
            router.push('/login');
        }
        
        // TODO: Fetch recent products from API when available
    }, [router]);
    
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Redirect to compare page with the search query
            router.push(`/compare?q=${encodeURIComponent(searchQuery)}`);
        } else {
            toast.error('Please enter a product to search');
        }
    };
    
    if (!user) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }
    
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome, {user.username}!</h1>
                <p className="text-gray-600">Find the best prices across multiple e-commerce sites.</p>
                
                {/* Search Bar */}
                <div className="mt-8 mx-auto max-w-2xl">
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
            
            {/* Recent Products */}
            <div className="mt-10">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Comparisons</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {recentProducts.map(product => (
                        <div 
                            key={product.id}
                            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                            onClick={() => router.push(`/compare?q=${encodeURIComponent(product.name)}`)}
                        >
                            <h3 className="text-lg font-medium text-gray-800">{product.name}</h3>
                            <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                            <p className="text-lg font-semibold text-blue-600">{product.price}</p>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Quick Categories */}
            <div className="mt-10">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Popular Categories</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['Electronics', 'Clothing', 'Home & Kitchen', 'Books'].map(category => (
                        <div 
                            key={category}
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-lg text-center cursor-pointer hover:from-blue-600 hover:to-indigo-700 transition-colors"
                            onClick={() => router.push(`/compare?category=${category}`)}
                        >
                            <h3 className="text-xl font-medium">{category}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home; 