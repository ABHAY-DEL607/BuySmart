import React, { useState } from 'react';

const Compare = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [productLink, setProductLink] = useState('');
    const [comparisons, setComparisons] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchComparisons = async () => {
        setLoading(true);
        setError(null);
        try {
            const sites = ['amazon', 'flipkart', 'ebay', 'jiomart', 'paytmmall'];
            const results = await Promise.all(
                sites.map(site =>
                    fetch(`http://localhost:5001/api/scrape/${site}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ query: searchQuery, productUrl: productLink })
                    }).then(res => res.json())
                )
            );
            setComparisons(results);
        } catch (err) {
            setError('Failed to fetch comparisons');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Compare Products</h1>
            <input
                type="text"
                placeholder="Enter product name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <input
                type="text"
                placeholder="Or paste product link"
                value={productLink}
                onChange={(e) => setProductLink(e.target.value)}
            />
            <button onClick={fetchComparisons}>Compare</button>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {comparisons.length > 0 && (
                <div>
                    <h2>Results</h2>
                    {comparisons.map((result, index) => (
                        <div key={index}>
                            <h3>{result[0]?.source}</h3>
                            <p>Name: {result[0]?.name}</p>
                            <p>Price: {result[0]?.price}</p>
                            <p>Delivery: {result[0]?.delivery}</p>
                            <p>Rating: {result[0]?.rating}/5</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Compare; 