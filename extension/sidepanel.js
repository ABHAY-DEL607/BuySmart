document.addEventListener("DOMContentLoaded", function () {
    const authSection = document.getElementById("authSection");
    const priceSection = document.getElementById("priceSection");
    const authMessage = document.getElementById("authMessage");
    const loginButton = document.getElementById("loginButton");
    const registerButton = document.getElementById("registerButton");
    const logoutButton = document.getElementById("logoutButton");
    const searchInput = document.getElementById("searchInput");
    const productLinkInput = document.getElementById("productLinkInput");
    const searchResults = document.getElementById("searchResults");
    const pricesElement = document.getElementById("prices");
    const resultsDiv = document.getElementById("results");
    const statusElement = document.getElementById("status");
    const saveButton = document.getElementById("saveButton");
    const smartTipElement = document.getElementById("smartTip");
    const compareButton = document.getElementById("compareButton");
    const priceHistoryElement = document.getElementById("priceHistory");

    // Tab handling
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');
            
            // Update tab active states
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show target content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${targetTab}Tab`) {
                    content.classList.add('active');
                }
            });

            // Handle specific tab actions
            if (targetTab === 'history') {
                loadPriceHistory();
            } else if (targetTab === 'current') {
                resetCurrentProductFlag();
                loadCurrentProductData();
            }
        });
    });

    const API_URL = "http://localhost:5000"; // Replace with production URL
    const WEBSITE_URL = "http://localhost:3000"; // Replace with production URL

    // Check login status when sidepanel opens
    checkAuthStatus();

    // Also check auth status when the sidepanel becomes visible
    // This helps when the sidepanel was already open but inactive
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            console.log('Sidepanel visible, checking auth status');
            checkAuthStatus();
        }
    });

    // 3D Background
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x > canvas.width) this.x = 0;
                if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                if (this.y < 0) this.y = canvas.height;
            }
            draw() {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const particles = [];
        for (let i = 0; i < 50; i++) {
            particles.push(new Particle());
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            requestAnimationFrame(animate);
        }
        animate();
    }

    // Smart Tips
    const smartTips = [
        "Smart Tip: Compare prices across multiple sites!",
        "Smart Tip: Check reviews before buying!",
        "Smart Tip: Look for coupon codes!",
        "Smart Tip: Save more with bulk purchases!",
        "Smart Tip: Check for No Cost EMI on Flipkart!",
        "Smart Tip: Look for Authenticity Guarantee on eBay!"
    ];

    let smartTipInterval = null;
    function rotateSmartTip() {
        let index = 0;
        smartTipElement.textContent = smartTips[index];
        if (smartTipInterval) clearInterval(smartTipInterval);
        smartTipInterval = setInterval(() => {
            index = (index + 1) % smartTips.length;
            smartTipElement.textContent = smartTips[index];
        }, 5000);
    }

    // Authentication Check
    function checkAuthStatus() {
        console.log('Checking authentication status...');
        
        // Enhanced auth check that combines multiple sources
        checkMultipleAuthSources()
            .then(token => {
                if (token) {
                    handleLoggedInState(token);
                } else {
                    handleLoggedOutState();
                }
            })
            .catch(error => {
                console.error('Auth check error:', error);
                handleLoggedOutState();
            });
    }
    
    // Check multiple sources for auth tokens
    async function checkMultipleAuthSources() {
        try {
            // 1. First check localStorage directly (fastest)
            const localToken = localStorage.getItem('token');
            if (localToken) {
                console.log('Found token in localStorage');
                // Ensure the token is also in extension storage
                await new Promise(resolve => {
                    chrome.runtime.sendMessage({ 
                        action: "setToken", 
                        token: localToken, 
                        source: 'sidepanel_localStorage' 
                    }, resolve);
                });
                return localToken;
            }

            // 2. If not in localStorage, check extension storage
            const extensionTokenResponse = await new Promise(resolve => {
                chrome.runtime.sendMessage({ action: "getToken" }, resolve);
            });
            
            if (extensionTokenResponse && extensionTokenResponse.token) {
                console.log('Found token in extension storage');
                // Store in localStorage for future use
                try {
                    localStorage.setItem('token', extensionTokenResponse.token);
                } catch (e) {
                    console.error('Failed to store token in localStorage:', e);
                }
                return extensionTokenResponse.token;
            }

            // 3. As last resort, check auth status with service worker
            const isAuthResponse = await new Promise(resolve => {
                chrome.runtime.sendMessage({ action: "isAuthenticated" }, resolve);
            });
            
            if (isAuthResponse && isAuthResponse.isAuthenticated) {
                console.log('Extension reports authenticated but no token found');
                // Try to get token one more time
                const finalTokenAttempt = await new Promise(resolve => {
                    chrome.runtime.sendMessage({ action: "getToken" }, resolve);
                });
                return finalTokenAttempt?.token || null;
            }
            
            return null;
        } catch (error) {
            console.error('Error checking auth sources:', error);
            return null;
        }
    }

    // Helper function for logged in state
    function handleLoggedInState(token) {
        console.log('Handling logged in state');
        authSection.classList.add("hidden");
        priceSection.classList.remove("hidden");
        logoutButton.classList.remove("hidden");
        smartTipElement.classList.add("hidden");
        
        // Make sure all user options are visible
        document.getElementById("searchForm").classList.remove("hidden");
        compareButton.classList.remove("hidden");
        
        // Clear status or show welcome message
        statusElement.innerText = "Welcome to BuySmart!";
        
        // Update tab UI to ensure all tabs are accessible
        document.querySelectorAll('.tab').forEach(tab => {
            tab.style.display = 'block';
        });
    }

    // Helper function for logged out state
    function handleLoggedOutState() {
        console.log('Handling logged out state');
        authSection.classList.remove("hidden");
        priceSection.classList.add("hidden");
        logoutButton.classList.add("hidden");
        smartTipElement.classList.remove("hidden");
        statusElement.innerText = "";
        rotateSmartTip();
        
        // Make current tab and history tab inaccessible while logged out
        document.querySelector('.tab[data-tab="current"]').style.display = 'none';
        document.querySelector('.tab[data-tab="history"]').style.display = 'none';
        
        // Always show search tab when logged out
        document.querySelector('.tab[data-tab="search"]').classList.add('active');
        document.querySelector('#searchTab').classList.add('active');
        document.querySelector('#currentTab').classList.remove('active');
        document.querySelector('#historyTab').classList.remove('active');
    }

    // Authentication Handlers
    loginButton.addEventListener("click", (e) => {
        e.preventDefault();
        chrome.runtime.sendMessage({
            action: 'openAuth',
            type: 'login',
            url: `${WEBSITE_URL}/login`
        });
    });

    registerButton.addEventListener("click", (e) => {
        e.preventDefault();
        chrome.runtime.sendMessage({
            action: 'openAuth',
            type: 'register',
            url: `${WEBSITE_URL}/signup`
        });
    });

    logoutButton.addEventListener("click", () => {
        // Clear tokens from all storages
        localStorage.removeItem("token");
        
        // Also ask service worker to properly clean up
        chrome.runtime.sendMessage({ action: "removeToken" }, () => {
            // Update UI to reflect logged out state
            handleLoggedOutState();
            statusElement.innerText = "Logged out successfully!";
            
            // Clear any displayed results
            searchResults.innerHTML = '';
            pricesElement.innerHTML = '';
            resultsDiv.innerHTML = '';
            priceHistoryElement.innerHTML = '';
            
            // Reset inputs
            searchInput.value = '';
            productLinkInput.value = '';
            
            setTimeout(() => {
                statusElement.innerText = "";
            }, 2000);
        });
    });

    // Listen for Auth Success
    chrome.runtime.onMessage.addListener((message) => {
        console.log('Message received in sidepanel:', message);
        
        if (message.action === 'auth_success' && message.token) {
            console.log('Auth success message received with token');
            // Store token locally
            try {
                localStorage.setItem('token', message.token);
            } catch (e) {
                console.error('Failed to store token in localStorage:', e);
            }
            
            // Update UI to reflect logged in state
            handleLoggedInState(message.token);
            
            // Show success message
            statusElement.innerText = "Logged in successfully!";
            
            // Hide auth section
            authSection.classList.add("hidden");
            
            // Show price section
            priceSection.classList.remove("hidden");
        }
        else if (message.action === 'auth_removed') {
            // Clear local token
            try {
                localStorage.removeItem('token');
            } catch (e) {
                console.error('Failed to remove token from localStorage:', e);
            }
            
            // Update UI
            handleLoggedOutState();
            
            // Show logout message
            statusElement.innerText = "Logged out successfully!";
            setTimeout(() => {
                statusElement.innerText = "";
            }, 2000);
        }
        if (message.action === 'product_updated') {
            resetCurrentProductFlag();
            // Only reload if we're on the current tab
            const currentTab = document.querySelector('.tab[data-tab="current"].active');
            if (currentTab) {
                loadCurrentProductData();
            }
        }
    });

    // Search and Comparison
    document.getElementById('searchForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        const productLink = productLinkInput?.value?.trim() || '';
          
        if (!query && !productLink) {
            statusElement.textContent = 'Please enter a product name or paste a product link';
            setTimeout(() => {
                statusElement.textContent = '';
            }, 3000);
            return;
        }
        
        // Clear previous results first
        searchResults.innerHTML = '';
        resultsDiv.innerHTML = '';
        
        // Show loading state
        searchResults.innerHTML = `
            <div class="loading-container">
                <div class="loading-spinner"></div>
                <p class="loading-text">Searching across all sites...</p>
            </div>
        `;
        statusElement.textContent = 'Searching...';
        
        try {
            const response = await new Promise((resolve) => {
                chrome.runtime.sendMessage({ 
                    action: "searchProducts", 
                    query, 
                    productLink 
                }, resolve);
            });

            // Clear loading state
            searchResults.innerHTML = '';

            if (response.error) {
                searchResults.innerHTML = `
                    <div class="error-message">
                        <p>Error: ${response.error}</p>
                        <p>Please try again or try a different search term.</p>
                    </div>
                `;
                statusElement.textContent = 'Search failed';
                return;
            }

            if (!response.results || response.results.length === 0) {
                searchResults.innerHTML = `
                    <div class="error-message">
                        <p>No products found for "${query}"</p>
                        <p>Try using different keywords or check your spelling.</p>
                    </div>
                `;
                statusElement.textContent = 'No results found';
                return;
            }

            displaySearchResults(response.results);
            statusElement.textContent = 'Search complete';
        } catch (error) {
            console.error('Search error:', error);
            searchResults.innerHTML = `
                <div class="error-message">
                    <p>Error searching products</p>
                    <p>${error.message || 'Please try again later.'}</p>
                </div>
            `;
            statusElement.textContent = 'Search failed';
        }
    });

    compareButton.addEventListener('click', async () => {
        const query = searchInput.value.trim();
        const productLink = productLinkInput.value.trim();
        if (!query && !productLink) {
            alert('Please enter a product name or paste a product link');
            return;
        }
        resultsDiv.innerHTML = '<div class="loading-container"><div class="loading"></div><p>Comparing prices...</p></div>';
        try {
            const response = await new Promise((resolve) => {
                chrome.runtime.sendMessage({
                    action: "comparePrices",
                    data: { 
                        productName: query,
                        productLink: productLink,
                        site: null 
                    }
                }, resolve);
            });

            if (!response || !response.prices || response.prices.length === 0) {
                resultsDiv.innerHTML = '<div class="error-message">No price comparisons found</div>';
                return;
            }

            resultsDiv.innerHTML = `
                <div class="comparison-header"><strong>Price Comparisons</strong></div>
                <div class="comparison-list">
                    ${response.prices.map(({ site, price }) => `
                        <div class="price-comparison">
                            <span class="site-name">${site}</span>
                            <span class="price-value">${price}</span>
                        </div>
                    `).join('')}
                </div>
            `;
        } catch (error) {
            resultsDiv.innerHTML = '<div class="error-message">Failed to fetch comparisons</div>';
            console.error('Comparison error:', error);
        }
    });

    function displaySearchResults(results) {
        searchResults.innerHTML = '';
        if (!results || results.length === 0) {
            searchResults.innerHTML = '<div class="error-message">No results found</div>';
            return;
        }

        // Add a "Save All Products" button at the top of results
        const saveAllContainer = document.createElement('div');
        saveAllContainer.className = 'save-all-container';
        saveAllContainer.innerHTML = '<button id="saveAllButton" class="save-all-btn">Save All Products</button>';
        searchResults.appendChild(saveAllContainer);
        
        // Add functionality to the Save All button
        const saveAllButton = document.getElementById('saveAllButton');
        saveAllButton.addEventListener('click', async () => {
            try {
                // Get token from most reliable source
                const token = await checkMultipleAuthSources();
                
                if (!token) {
                    alert("Please log in to save products");
                    return;
                }
                
                saveAllButton.disabled = true;
                saveAllButton.innerText = "Saving all products...";
                
                // Prepare all products for saving
                const allProducts = results.map(product => ({
                    productName: product.name,
                    currentSite: product.site,
                    currentPrice: product.price,
                    productImage: product.image,
                    productUrl: product.url
                }));
                
                const response = await fetch(`${API_URL}/api/prices/batch`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ products: allProducts })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                saveAllButton.disabled = false;
                saveAllButton.innerText = "All Products Saved ✓";
                setTimeout(() => {
                    saveAllButton.innerText = "Save All Products";
                }, 2000);
                
                // Show success status
                statusElement.textContent = 'All products saved successfully!';
                setTimeout(() => {
                    statusElement.textContent = '';
                }, 3000);
                
            } catch (err) {
                console.error("Error saving all products:", err);
                saveAllButton.disabled = false;
                saveAllButton.innerText = "Error Saving";
                setTimeout(() => {
                    saveAllButton.innerText = "Save All Products";
                }, 2000);
                
                // Show error status
                statusElement.textContent = 'Failed to save products';
                setTimeout(() => {
                    statusElement.textContent = '';
                }, 3000);
            }
        });
        
        const SUPPORTED_SITES = {
            amazon: {
                name: 'Amazon',
                color: '#FF9900',
                icon: '🛍️'
            },
            flipkart: {
                name: 'Flipkart',
                color: '#2874F0',
                icon: '🛒'
            },
            paytmmall: {
                name: 'Paytm Mall',
                color: '#00BAF2',
                icon: '💰'
            },
            jiomart: {
                name: 'JioMart',
                color: '#0078D4',
                icon: '🛒'
            },
            ebay: {
                name: 'eBay',
                color: '#E53238',
                icon: '🏷️'
            }
        };

        const groupedResults = results.reduce((acc, product) => {
            if (!acc[product.site]) {
                acc[product.site] = [];
            }
            acc[product.site].push(product);
            return acc;
        }, {});

        Object.entries(groupedResults).forEach(([site, products]) => {
            const siteInfo = SUPPORTED_SITES[site.toLowerCase().replace(' ', '')] || { name: site, color: '#000', icon: '🛒' };
            const siteSection = document.createElement('div');
            siteSection.className = 'site-section';
            siteSection.style.borderColor = siteInfo.color;

            const siteHeader = document.createElement('div');
            siteHeader.className = 'site-header';
            siteHeader.innerHTML = `
                <span class="site-icon">${siteInfo.icon}</span>
                <span class="site-name">${siteInfo.name}</span>
            `;
            siteSection.appendChild(siteHeader);

            const productsList = document.createElement('div');
            productsList.className = 'products-list';

            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                // Add this to improve spacing and readability
                productCard.innerHTML = `
                    <img src="${product.image}" alt="${product.name}" class="product-image" 
                        onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'80\\' height=\\'80\\' viewBox=\\'0 0 100 100\\'><rect width=\\'100\\' height=\\'100\\' fill=\\'#f3f4f6\\'></rect><text x=\\'50\\' y=\\'50\\' font-family=\\'Arial\\' font-size=\\'12\\' text-anchor=\\'middle\\' dominant-baseline=\\'middle\\' fill=\\'#6b7280\\'>No Image</text></svg>'">
                    <div class="product-info">
                        <h3 class="product-name">${product.name}</h3>
                        <div class="product-details">
                            <div class="product-price">${product.price ? product.price : 'N/A'}</div>
                            <div class="product-rating">${product.rating ? `⭐ ${product.rating}` : 'No ratings'}</div>
                        </div>
                        <a href="${product.url}" target="_blank" class="view-product-btn" style="background-color: ${siteInfo.color}">
                            View on ${siteInfo.name}
                        </a>
                    </div>
                `;
                productsList.appendChild(productCard);
            });

            siteSection.appendChild(productsList);
            searchResults.appendChild(siteSection);
        });
    }

    // Create a flag to track if we already called load for the current page
    let currentProductLoaded = false;

    async function loadCurrentProductData() {
        // Only load data if we haven't already loaded it
        if (currentProductLoaded) return;
        
        try {
            currentProductLoaded = true;  // Set flag before making any requests
            
            const response = await new Promise((resolve) => {
                chrome.runtime.sendMessage({ action: "getProductData" }, resolve);
            });

            if (!response || !response.data) {
                pricesElement.innerHTML = "<p class='info-message'>No product currently being viewed.</p>";
                return;
            }

            const { name, price, site, discount, image, rating, url } = response.data;
            
            // Remove currency symbols from displayed price to avoid duplicates
            const displayPrice = price ? price.replace(/^₹|₹\s*/g, '') : 'N/A';
            
            let priceHTML = `
                <div class="product-header">
                    ${image ? `<img src="${image}" alt="${name}" class="product-image">` : ''}
                    <h3>${name}</h3>
                    <p class="current-price"><strong>${site} Price:</strong> ${price}</p>
                </div>
            `;

            if (discount) {
                priceHTML += `<p class="discount-badge"><strong>Discount:</strong> ${discount}</p>`;
            }
            if (rating) {
                priceHTML += `<p class="product-rating"><strong>Rating:</strong> ⭐ ${rating}</p>`;
            }
            if (site.toLowerCase().includes("flipkart")) {
                priceHTML += `<p class="benefit-tag"><em>Eligible for Flipkart Plus benefits and No Cost EMI!</em></p>`;
            } else if (site.toLowerCase().includes("ebay")) {
                priceHTML += `<p class="benefit-tag"><em>Comes with eBay Authenticity Guarantee!</em></p>`;
            }

            // Set initial content
            pricesElement.innerHTML = priceHTML + `<div class="comparison-header"><strong>Comparing Prices...</strong><div class="loading"></div></div>`;

            const comparisonResponse = await new Promise((resolve) => {
                chrome.runtime.sendMessage({ 
                    action: "comparePrices", 
                    data: { 
                        productName: name,
                        site: site,
                        productLink: url 
                    }
                }, resolve);
            });

            if (!comparisonResponse || !comparisonResponse.prices || comparisonResponse.prices.length === 0) {
                // Replace the loading comparison header with an error
                const comparisonHeader = pricesElement.querySelector('.comparison-header');
                if (comparisonHeader) {
                    comparisonHeader.innerHTML = "<strong>No price comparisons available</strong>";
                } else {
                    pricesElement.innerHTML += "<p class='error-message'>No price comparisons available.</p>";
                }
                return;
            }

            // Replace the loading comparison header with the actual comparison list
            const comparisonHeader = pricesElement.querySelector('.comparison-header');
            if (comparisonHeader) {
                comparisonHeader.innerHTML = "<strong>Price Comparisons</strong>";
            }

            let comparisons = `
                <div class="comparison-list">
                    ${comparisonResponse.prices.map(({ site, price }) => `
                        <div class="price-comparison">
                            <span class="site-name">${site}</span>
                            <span class="price-value">${price}</span>
                        </div>
                    `).join('')}
                </div>
            `;
            pricesElement.appendChild(document.createRange().createContextualFragment(comparisons));
            
            // Make save button visible for logged-in users
            saveButton.classList.remove("hidden");
            saveButton.innerText = "Save Price History";

            saveButton.onclick = async () => {
                try {
                    // Get token from most reliable source
                    const token = await checkMultipleAuthSources();
                    
                    if (!token) {
                        alert("Please log in to save price history");
                        return;
                    }
                    
                    saveButton.disabled = true;
                    saveButton.innerText = "Saving...";
                    
                    const response = await fetch(`${API_URL}/api/prices`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            productName: name,
                            currentSite: site,
                            currentPrice: price,
                            comparisons: comparisonResponse.prices,
                            productImage: image,
                            productUrl: url
                        })
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    saveButton.disabled = false;
                    saveButton.innerText = "Saved ✓";
                    setTimeout(() => {
                        saveButton.innerText = "Save Price History";
                    }, 2000);
                } catch (err) {
                    console.error("Error saving history:", err);
                    saveButton.disabled = false;
                    saveButton.innerText = "Error Saving";
                    setTimeout(() => {
                        saveButton.innerText = "Save Price History";
                    }, 2000);
                }
            };
        } catch (error) {
            console.error("Error in price comparison:", error);
            pricesElement.innerHTML = "<p class='error-message'>Error loading price data.</p>";
        }
    }

    async function loadPriceHistory() {
        try {
            priceHistoryElement.innerHTML = '<div class="loading-container"><div class="loading"></div><p>Loading price history...</p></div>';
            
            // Get token from most reliable source
            const token = await checkMultipleAuthSources();
            
            if (!token) {
                priceHistoryElement.innerHTML = "<p class='error-message'>Please log in to view price history.</p>";
                return;
            }
            
            const response = await fetch(`${API_URL}/api/prices/history`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (!data || data.length === 0) {
                priceHistoryElement.innerHTML = "<p>No price history saved yet.</p>";
                return;
            }

            const historyHTML = data.map(item => `
                <div class="history-item">
                    <div class="history-product">
                        <div class="product-image-container">
                            ${item.productImage ? 
                              `<img src="${item.productImage}" alt="${item.productName}" class="history-product-image">` : 
                              `<div class="no-image">No Image</div>`}
                        </div>
                        <div class="history-product-details">
                            <h3 title="${item.productName}">${item.productName}</h3>
                            <p class="history-timestamp">Saved on: ${new Date(item.timestamp).toLocaleString()}</p>
                            <p class="history-price">Price: <span class="highlight-price">${item.currentPrice}</span></p>
                            ${item.productUrl ? 
                              `<a href="${item.productUrl}" target="_blank" class="view-product-btn">View Product</a>` : ''}
                        </div>
                    </div>
                    <div class="history-prices">
                        <h4>Price Comparisons</h4>
                        <div class="comparison-list">
                            ${item.comparisons.map(comp => `
                                <div class="price-comparison">
                                    <span class="site-name">${comp.site}</span>
                                    <span class="price-value">${comp.price}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `).join('');
            
            priceHistoryElement.innerHTML = historyHTML;
        } catch (error) {
            console.error("Error loading price history:", error);
            priceHistoryElement.innerHTML = "<p class='error-message'>Error loading price history.</p>";
        }
    }

    // Add function to reset the flag when the user navigates to a different tab
    function resetCurrentProductFlag() {
        currentProductLoaded = false;
    }

    // Implement better error display
    function showError(element, message, timeout = 0) {
        element.innerHTML = `<div class="error-message">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>${message}</span>
        </div>`;
        
        if (timeout > 0) {
            setTimeout(() => {
                element.innerHTML = '';
            }, timeout);
        }
    }

    // Example usage of showError
    // showError(searchResults, 'No results found', 0);
});