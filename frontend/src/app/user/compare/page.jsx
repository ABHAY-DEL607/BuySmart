'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function CompareProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    
    useEffect(() => {
        const fetchComparisonData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                
                if (!token) {
                    router.push('/login?redirect=compare');
                    return;
                }
                
                // Get product IDs from URL query
                const productIds = searchParams.get('products')?.split(',') || [];
                
                if (!productIds.length) {
                    setError('No products selected for comparison');
                    setLoading(false);
                    return;
                }
                
                // Fetch details for each product
                const productDetails = await Promise.all(
                    productIds.map(async (id) => {
                        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/prices/${id}`, {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });
                        
                        if (!response.ok) {
                            throw new Error(`Failed to fetch product ${id}`);
                        }
                        
                        return response.json();
                    })
                );
                
                setProducts(productDetails.map(p => p.product));
                setLoading(false);
            } catch (err) {
                console.error('Error fetching comparison data:', err);
                setError(err.message);
                setLoading(false);
            }
        };
        
        fetchComparisonData();
    }, [router, searchParams]);
    
    if (loading) {
        return (
            <div className="container mx-auto p-4">
                <div className="animate-pulse text-center py-20">Loading comparison data...</div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="container mx-auto p-4">
                <div className="text-red-500 mb-4">Error: {error}</div>
                <Link href="/user/history" className="text-blue-600 hover:underline">
                    Return to product history
                </Link>
            </div>
        );
    }
    
    // Properties to compare
    const comparisonProperties = [
        { name: 'Price', key: 'currentPrice' },
        { name: 'Site', key: 'currentSite' },
        { name: 'Date Saved', key: 'timestamp', format: (value) => new Date(value).toLocaleDateString() }
    ];
    
    // If products have price history, add a property to show price changes
    const hasPriceHistory = products.some(p => p.priceHistory && p.priceHistory.length > 1);
    if (hasPriceHistory) {
        comparisonProperties.push({ 
            name: 'Price Change', 
            key: 'priceHistory',
            format: (history) => {
                if (!history || history.length < 2) return 'N/A';
                const latest = parseFloat(history[history.length - 1].price.replace(/[^\d.-]/g, ''));
                const oldest = parseFloat(history[0].price.replace(/[^\d.-]/g, ''));
                const diff = latest - oldest;
                const percentage = ((diff / oldest) * 100).toFixed(2);
                
                const color = diff < 0 ? 'text-green-600' : diff > 0 ? 'text-red-600' : 'text-gray-600';
                const direction = diff < 0 ? '↓' : diff > 0 ? '↑' : '';
                
                return (
                    <span className={color}>
                        {direction} {Math.abs(diff).toFixed(2)} ({Math.abs(percentage)}%)
                    </span>
                );
            }
        });
    }
    
    return (
        <div className="container mx-auto p-4">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Product Comparison</h1>
                <Link href="/user/history" className="text-blue-600 hover:underline">
                    Back to History
                </Link>
            </div>
            
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                Feature
                            </th>
                            {products.map((product, index) => (
                                <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Product {index + 1}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {/* Product images */}
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                                Image
                            </td>
                            {products.map((product, index) => (
                                <td key={index} className="px-6 py-4">
                                    <div className="h-36 w-36 mx-auto flex items-center justify-center">
                                        {product.productImage ? (
                                            <img
                                                src={product.productImage}
                                                alt={product.productName}
                                                className="max-h-full max-w-full object-contain"
                                            />
                                        ) : (
                                            <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-400">
                                                No Image
                                            </div>
                                        )}
                                    </div>
                                </td>
                            ))}
                        </tr>
                        
                        {/* Product names */}
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                                Product Name
                            </td>
                            {products.map((product, index) => (
                                <td key={index} className="px-6 py-4 text-sm text-gray-900">
                                    <div className="font-medium">{product.productName}</div>
                                    <a 
                                        href={product.productUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="text-xs text-blue-600 hover:underline mt-1 inline-block"
                                    >
                                        View on site
                                    </a>
                                </td>
                            ))}
                        </tr>
                        
                        {/* Other comparison properties */}
                        {comparisonProperties.map((prop, propIndex) => (
                            <tr key={propIndex}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                                    {prop.name}
                                </td>
                                {products.map((product, productIndex) => (
                                    <td key={productIndex} className="px-6 py-4 text-sm text-gray-900">
                                        {prop.format 
                                            ? prop.format(product[prop.key])
                                            : product[prop.key] || 'N/A'}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* Recommendation section */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">Recommendation</h2>
                {products.length > 0 && (
                    <div>
                        {(() => {
                            // Find product with lowest price
                            let bestDeal = products[0];
                            for (const product of products) {
                                const currentPrice = parseFloat(product.currentPrice.replace(/[^\d.-]/g, ''));
                                const bestPrice = parseFloat(bestDeal.currentPrice.replace(/[^\d.-]/g, ''));
                                
                                if (currentPrice < bestPrice) {
                                    bestDeal = product;
                                }
                            }
                            
                            return (
                                <p>
                                    Best deal: <strong>{bestDeal.productName}</strong> at <span className="text-green-700 font-semibold">{bestDeal.currentPrice}</span> from {bestDeal.currentSite}
                                </p>
                            );
                        })()}
                    </div>
                )}
            </div>
        </div>
    );
}