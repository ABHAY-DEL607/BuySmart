'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function ProductHistory() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [groupBy, setGroupBy] = useState('date'); 
    const [searchTerm, setSearchTerm] = useState('');
    const [hoveredProduct, setHoveredProduct] = useState(null);
    const router = useRouter();
    
    // Fetch saved products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                
                if (!token) {
                    router.push('/login?redirect=history');
                    return;
                }
                
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/prices`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch saved products');
                }
                
                const data = await response.json();
                setProducts(data.products);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        
        fetchProducts();
    }, [router]);
    
    // Toggle product selection with visual feedback
    const toggleProductSelection = (productId) => {
        if (selectedProducts.includes(productId)) {
            setSelectedProducts(selectedProducts.filter(id => id !== productId));
            toast.success('Product removed from comparison', {
                icon: '🗑️',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                }
            });
        } else {
            if (selectedProducts.length < 5) {
                setSelectedProducts([...selectedProducts, productId]);
                toast.success('Product added to comparison', {
                    icon: '✓',
                    style: {
                        borderRadius: '10px',
                        background: '#10B981',
                        color: '#fff',
                    }
                });
            } else {
                toast.error('Maximum 5 products can be compared', {
                    icon: '⚠️',
                    style: {
                        borderRadius: '10px',
                        background: '#EF4444',
                        color: '#fff',
                    }
                });
            }
        }
    };
    
    // Group and filter products
    const processProducts = () => {
        // First filter by search term if present
        let filteredProducts = products;
        if (searchTerm.trim() !== '') {
            const term = searchTerm.toLowerCase();
            filteredProducts = products.filter(product => 
                product.productName.toLowerCase().includes(term) || 
                product.currentSite.toLowerCase().includes(term)
            );
        }
        
        // Then group the filtered products
        const groups = {};
        
        if (groupBy === 'date') {
            filteredProducts.forEach(product => {
                const date = new Date(product.timestamp).toLocaleDateString();
                if (!groups[date]) groups[date] = [];
                groups[date].push(product);
            });
        } else if (groupBy === 'name') {
            filteredProducts.forEach(product => {
                // Group by first letter of product name
                const firstLetter = product.productName.charAt(0).toUpperCase();
                if (!groups[firstLetter]) groups[firstLetter] = [];
                groups[firstLetter].push(product);
            });
        } else if (groupBy === 'site') {
            filteredProducts.forEach(product => {
                if (!groups[product.currentSite]) groups[product.currentSite] = [];
                groups[product.currentSite].push(product);
            });
        }
        
        return { groups, totalFiltered: filteredProducts.length };
    };
    
    // Compare selected products with animation
    const compareProducts = () => {
        if (selectedProducts.length < 2) {
            toast.error('Select at least 2 products to compare', {
                icon: '⚠️',
                style: { borderRadius: '10px', background: '#EF4444', color: '#fff' }
            });
            return;
        }
        
        const compareIds = selectedProducts.join(',');
        
        // Show loading toast that will be dismissed when navigation occurs
        toast.loading('Preparing comparison...', {
            style: { borderRadius: '10px', background: '#333', color: '#fff' }
        });
        
        // Navigate after a short delay for better UX
        setTimeout(() => {
            router.push(`/user/compare?products=${compareIds}`);
        }, 600);
    };
    
    // Delete a product
    const handleDeleteProduct = async (productId) => {
        try {
            const token = localStorage.getItem('token');
            const confirmed = window.confirm('Are you sure you want to remove this product from your history?');
            
            if (!confirmed) return;
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/prices/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete product');
            }
            
            // Remove from selected products if it was selected
            if (selectedProducts.includes(productId)) {
                setSelectedProducts(selectedProducts.filter(id => id !== productId));
            }
            
            // Remove from products list
            setProducts(products.filter(product => product._id !== productId));
            
            toast.success('Product removed from history', {
                icon: '🗑️',
                style: { borderRadius: '10px', background: '#333', color: '#fff' }
            });
        } catch (err) {
            toast.error('Failed to remove product', {
                style: { borderRadius: '10px', background: '#EF4444', color: '#fff' }
            });
            console.error(err);
        }
    };
    
    const { groups, totalFiltered } = processProducts();
    
    if (loading) {
        return (
            <div className="container mx-auto p-4 min-h-[50vh] flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-blue-600 font-medium animate-pulse">Loading your product history...</p>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="container mx-auto p-4 text-center">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    <p className="font-medium">Error: {error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="mt-2 text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md text-sm transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }
    
    return (
        <div className="container mx-auto p-4">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-2xl font-bold mb-6">Your Saved Products</h1>
                
                <div className="bg-white rounded-xl shadow-md p-4 mb-6">
                    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Group By</label>
                                <select 
                                    value={groupBy} 
                                    onChange={(e) => setGroupBy(e.target.value)}
                                    className="border rounded-md p-2 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-auto"
                                >
                                    <option value="date">Date Saved</option>
                                    <option value="name">Product Name</option>
                                    <option value="site">Website</option>
                                </select>
                            </div>
                            
                            <div className="flex-grow">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Search Products</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search by name or site..."
                                        className="w-full pr-10 pl-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {searchTerm && (
                                        <button
                                            onClick={() => setSearchTerm('')}
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <motion.button 
                            onClick={compareProducts}
                            disabled={selectedProducts.length < 2}
                            whileHover={selectedProducts.length >= 2 ? { scale: 1.03 } : {}}
                            whileTap={selectedProducts.length >= 2 ? { scale: 0.97 } : {}}
                            className={`h-full px-6 py-3 rounded-md font-medium ${selectedProducts.length < 2 
                                ? 'bg-gray-300 cursor-not-allowed text-gray-600' 
                                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg'}`}
                        >
                            Compare Selected ({selectedProducts.length}/5)
                        </motion.button>
                    </div>
                    
                    {totalFiltered > 0 && searchTerm && (
                        <p className="mt-2 text-sm text-gray-600">
                            Found {totalFiltered} products matching "{searchTerm}"
                        </p>
                    )}
                </div>
                
                {products.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-center py-16 bg-gray-50 rounded-xl border border-gray-200"
                    >
                        <div className="text-6xl mb-4">🛍️</div>
                        <p className="text-gray-500 mb-4 text-lg">You haven't saved any products yet</p>
                        <Link 
                            href="/search" 
                            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Start Searching Products
                        </Link>
                    </motion.div>
                ) : Object.keys(groups).length === 0 ? (
                    <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="text-6xl mb-4">🔍</div>
                        <p className="text-gray-500 mb-4 text-lg">No products match your search criteria</p>
                        <button
                            onClick={() => setSearchTerm('')}
                            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Clear Search
                        </button>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {Object.keys(groups).map((groupName, groupIndex) => (
                            <motion.div 
                                key={groupName} 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: groupIndex * 0.1 }}
                                className="bg-white rounded-xl shadow-md overflow-hidden"
                            >
                                <div className="bg-gradient-to-r from-gray-100 to-gray-50 px-6 py-4 border-b">
                                    <h2 className="text-xl font-semibold text-gray-800">{groupName}</h2>
                                    <p className="text-sm text-gray-500">{groups[groupName].length} products</p>
                                </div>
                                
                                <div className="p-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                        {groups[groupName].map((product, productIndex) => (
                                            <motion.div 
                                                key={product._id}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.3, delay: productIndex * 0.05 + 0.2 }}
                                                onMouseEnter={() => setHoveredProduct(product._id)}
                                                onMouseLeave={() => setHoveredProduct(null)}
                                                className={`relative border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 transform ${
                                                    selectedProducts.includes(product._id) 
                                                        ? 'ring-2 ring-blue-500 shadow-md' 
                                                        : 'hover:-translate-y-1'
                                                }`}
                                            >
                                                {/* Quick actions overlay that shows on hover */}
                                                {hoveredProduct === product._id && (
                                                    <div className="absolute top-2 left-2 z-10 flex space-x-1">
                                                        <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteProduct(product._id);
                                                            }}
                                                            className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                                            title="Delete product"
                                                        >
                                                            🗑️
                                                        </button>
                                                    </div>
                                                )}
                                                
                                                <div 
                                                    onClick={() => toggleProductSelection(product._id)}
                                                    className="cursor-pointer"
                                                >
                                                    <div className="relative">
                                                        <div className="h-48 bg-gray-50 flex items-center justify-center overflow-hidden">
                                                            {product.productImage ? (
                                                                <img
                                                                    src={product.productImage} 
                                                                    alt={product.productName}
                                                                    className="object-contain h-full w-full p-2"
                                                                />
                                                            ) : (
                                                                <div className="text-gray-400 flex flex-col items-center">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                    </svg>
                                                                    <span className="text-xs mt-1">No Image</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        
                                                        <div className="absolute top-2 right-2">
                                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                                                selectedProducts.includes(product._id) 
                                                                    ? 'bg-blue-500 border-blue-500 text-white' 
                                                                    : 'border-gray-300 bg-white'
                                                            }`}>
                                                                {selectedProducts.includes(product._id) && '✓'}
                                                            </div>
                                                        </div>
                                                        
                                                        {product.currentSite && (
                                                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                                                                <span className="text-xs font-medium text-white">
                                                                    {product.currentSite}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    
                                                    <div className="p-4">
                                                        <h3 className="font-medium text-gray-800 mb-1 line-clamp-2 h-12" title={product.productName}>
                                                            {product.productName}
                                                        </h3>
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="text-lg font-bold text-green-600">
                                                                {product.currentPrice}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-gray-500 mb-3">
                                                            Saved {new Date(product.timestamp).toLocaleString()}
                                                        </p>
                                                        
                                                        <div className="flex justify-between items-center mt-auto">
                                                            <a 
                                                                href={product.productUrl} 
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                onClick={(e) => e.stopPropagation()}
                                                                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm rounded-md transition-colors"
                                                            >
                                                                View Product
                                                            </a>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    toggleProductSelection(product._id);
                                                                }}
                                                                className={`text-sm px-3 py-1.5 rounded-md ${
                                                                    selectedProducts.includes(product._id)
                                                                        ? 'bg-blue-100 text-blue-700' 
                                                                        : 'bg-blue-500 text-white hover:bg-blue-600'
                                                                }`}
                                                            >
                                                                {selectedProducts.includes(product._id) ? 'Selected' : 'Compare'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
            
            {selectedProducts.length > 0 && (
                <motion.div 
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-gray-800 text-white p-4 shadow-lg z-50"
                >
                    <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
                        <div>
                            <p className="font-medium">{selectedProducts.length} {selectedProducts.length === 1 ? 'product' : 'products'} selected</p>
                            <p className="text-sm text-gray-300">Select {Math.max(0, 2 - selectedProducts.length)} more to compare</p>
                        </div>
                        <div className="flex mt-3 sm:mt-0">
                            <button 
                                onClick={() => setSelectedProducts([])}
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md mr-3 transition-colors"
                            >
                                Clear Selection
                            </button>
                            <motion.button
                                onClick={compareProducts}
                                disabled={selectedProducts.length < 2}
                                whileHover={selectedProducts.length >= 2 ? { scale: 1.05 } : {}}
                                whileTap={selectedProducts.length >= 2 ? { scale: 0.95 } : {}}
                                className={`px-6 py-2 rounded-md font-medium ${
                                    selectedProducts.length < 2
                                        ? 'bg-gray-600 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
                                }`}
                            >
                                Compare Now
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}