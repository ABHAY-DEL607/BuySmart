'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import Image from 'next/image';
import Link from 'next/link';

export default function ProductHistory() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [groupBy, setGroupBy] = useState('date'); // 'date', 'name', 'site'
    const router = useRouter();
    
    // Fetch saved products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                console.log('Fetching saved products with token:', token);
                
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
    
    // Toggle product selection for comparison
    const toggleProductSelection = (productId) => {
        if (selectedProducts.includes(productId)) {
            setSelectedProducts(selectedProducts.filter(id => id !== productId));
        } else {
            // Limit to 3 selections max for comparison
            if (selectedProducts.length < 3) {
                setSelectedProducts([...selectedProducts, productId]);
            } else {
                alert('You can compare up to 3 products at once');
            }
        }
    };
    
    // Group products based on selected grouping option
    const groupedProducts = () => {
        const groups = {};
        
        if (groupBy === 'date') {
            products.forEach(product => {
                const date = new Date(product.timestamp).toLocaleDateString();
                if (!groups[date]) groups[date] = [];
                groups[date].push(product);
            });
        } else if (groupBy === 'name') {
            products.forEach(product => {
                if (!groups[product.productName]) groups[product.productName] = [];
                groups[product.productName].push(product);
            });
        } else if (groupBy === 'site') {
            products.forEach(product => {
                if (!groups[product.currentSite]) groups[product.currentSite] = [];
                groups[product.currentSite].push(product);
            });
        }
        
        return groups;
    };
    
    // Compare selected products
    const compareProducts = () => {
        if (selectedProducts.length < 2) {
            alert('Please select at least 2 products to compare');
            return;
        }
        
        // Create comparison URL with product IDs
        const compareIds = selectedProducts.join(',');
        router.push(`/user/compare?products=${compareIds}`);
    };
    
    if (loading) return <div className="container mx-auto p-4"><div className="animate-pulse">Loading your product history...</div></div>;
    if (error) return <div className="container mx-auto p-4 text-red-500">Error: {error}</div>;
    
    const groups = groupedProducts();
    
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Your Saved Products</h1>
            
            <div className="flex justify-between items-center mb-6">
                <div className="flex space-x-4">
                    <select 
                        value={groupBy} 
                        onChange={(e) => setGroupBy(e.target.value)}
                        className="border rounded p-2"
                    >
                        <option value="date">Group by Date</option>
                        <option value="name">Group by Product Name</option>
                        <option value="site">Group by Site</option>
                    </select>
                </div>
                
                <button 
                    onClick={compareProducts}
                    disabled={selectedProducts.length < 2}
                    className={`px-4 py-2 rounded ${selectedProducts.length < 2 
                        ? 'bg-gray-300 cursor-not-allowed' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >
                    Compare Selected ({selectedProducts.length}/3)
                </button>
            </div>
            
            {products.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-gray-500 mb-4">You haven't saved any products yet</p>
                    <Link href="/search" className="text-blue-600 hover:underline">
                        Search for products
                    </Link>
                </div>
            ) : (
                Object.keys(groups).map(groupName => (
                    <div key={groupName} className="mb-8">
                        <h2 className="text-xl font-semibold mb-3">{groupName}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {groups[groupName].map(product => (
                                <div 
                                    key={product._id} 
                                    className={`border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition 
                                        ${selectedProducts.includes(product._id) ? 'ring-2 ring-blue-500' : ''}`}
                                >
                                    <div className="relative">
                                        <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                                            {product.productImage ? (
                                                <img
                                                    src={product.productImage} 
                                                    alt={product.productName}
                                                    width={200}
                                                    height={200}
                                                    className="object-contain"
                                                />
                                            ) : (
                                                <div className="text-gray-400">No Image</div>
                                            )}
                                        </div>
                                        
                                        <input 
                                            type="checkbox"
                                            checked={selectedProducts.includes(product._id)}
                                            onChange={() => toggleProductSelection(product._id)}
                                            className="absolute top-2 right-2 w-5 h-5"
                                        />
                                    </div>
                                    
                                    <div className="p-4">
                                        <h3 className="font-medium text-lg mb-1 line-clamp-2">{product.productName}</h3>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-green-700 font-semibold">{product.currentPrice}</span>
                                            <span className="text-sm text-gray-500">{product.currentSite}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 mb-3">
                                            Saved on {new Date(product.timestamp).toLocaleString()}
                                        </p>
                                        <div className="flex space-x-2">
                                            <a 
                                                href={product.productUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-sm text-blue-600 hover:underline"
                                            >
                                                View Product
                                            </a>
                                            <button
                                                onClick={() => toggleProductSelection(product._id)}
                                                className={`text-sm ${selectedProducts.includes(product._id) 
                                                    ? 'text-red-600 hover:text-red-800' 
                                                    : 'text-blue-600 hover:text-blue-800'}`}
                                            >
                                                {selectedProducts.includes(product._id) ? 'Deselect' : 'Select'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}