document.addEventListener("DOMContentLoaded", function () {
    // Get DOM elements
    const loginTab = document.getElementById("loginTab");
    const registerTab = document.getElementById("registerTab");
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const authSection = document.getElementById("authSection");
    const priceSection = document.getElementById("priceSection");
<<<<<<< HEAD

    // Login form elements
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const loginButton = document.getElementById("loginButton");
    const authMessage = document.getElementById("authMessage");

    // Register form elements
    const regUsernameInput = document.getElementById("regUsername");
    const regPasswordInput = document.getElementById("regPassword");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const registerButton = document.getElementById("registerButton");
    const regAuthMessage = document.getElementById("regAuthMessage");

    // Other elements
=======
    const authMessage = document.getElementById("authMessage");
    const loginButton = document.getElementById("loginButton");
    const registerButton = document.getElementById("registerButton");
>>>>>>> 445aef37f197c5cdba226b30b59683ed5b963ffa
    const logoutButton = document.getElementById("logoutButton");
    const searchInput = document.getElementById("searchInput");
    const searchResults = document.getElementById("searchResults");
    const productHistory = document.getElementById("productHistory");
    const siteButtons = document.querySelectorAll(".site-button");
    const smartTipElement = document.getElementById("smartTip");

    const API_URL = "http://localhost:5000"; // Update to your production API URL, e.g., "https://api.buysmart.com"
    const WEBSITE_URL = "http://localhost:3000"; // Update to your production website URL, e.g., "https://buysmart.com"

    // Initialize search history from storage
    let searchHistory = [];
    chrome.storage.local.get(['searchHistory'], function(result) {
        if (result.searchHistory) {
            searchHistory = result.searchHistory;
            updateHistoryDisplay();
        }
    });

    // Function to update history display
    function updateHistoryDisplay() {
        const historyContainer = productHistory.querySelector('div') || document.createElement('div');
        historyContainer.innerHTML = '';
        
        searchHistory.slice(0, 5).forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <h3>${item.productName}</h3>
                <p>Last searched: ${new Date(item.timestamp).toLocaleString()}</p>
                <p>Best price: ${item.bestPrice}</p>
            `;
            historyItem.addEventListener('click', () => {
                searchInput.value = item.productName;
                searchProduct(item.productName);
            });
            historyContainer.appendChild(historyItem);
        });
        
        if (!productHistory.contains(historyContainer)) {
            productHistory.appendChild(historyContainer);
        }
    }

    // Function to save search to history
    function saveToHistory(productName, prices) {
        const bestPrice = Math.min(...prices.map(p => parseFloat(p.price.replace(/[^0-9.]/g, ''))));
        const historyItem = {
            productName,
            timestamp: Date.now(),
            bestPrice: `₹${bestPrice}`,
            prices
        };
        
        searchHistory.unshift(historyItem);
        if (searchHistory.length > 10) {
            searchHistory.pop();
        }
        
        chrome.storage.local.set({ searchHistory });
        updateHistoryDisplay();
    }

    // Function to search product across all sites
    async function searchProduct(query) {
        if (!query.trim()) return;
        
        searchResults.classList.remove('hidden');
        searchResults.innerHTML = '<p>Searching...</p>';
        
        const results = [];
        const sites = ['amazon', 'flipkart', 'ebay', 'paytmmall', 'jiomart'];
        
        for (const site of sites) {
            try {
                const response = await fetch(`${API_URL}/api/search/${site}?query=${encodeURIComponent(query)}`);
                const data = await response.json();
                if (data.success) {
                    results.push({
                        site,
                        ...data.product
                    });
                }
            } catch (error) {
                console.error(`Error searching ${site}:`, error);
            }
        }
        
        displayResults(results);
        saveToHistory(query, results);
    }

    // Function to display search results
    function displayResults(results) {
        if (results.length === 0) {
            searchResults.innerHTML = '<p>No results found</p>';
            return;
        }

        const resultsHTML = results.map(result => `
            <div class="result-item">
                <h3>${result.name}</h3>
                <p><strong>${result.site}:</strong> ${result.price}</p>
                ${result.discount ? `<p><strong>Discount:</strong> ${result.discount}</p>` : ''}
                ${result.rating ? `<p><strong>Rating:</strong> ${result.rating}</p>` : ''}
                <a href="${result.url}" target="_blank" class="site-button">View on ${result.site}</a>
            </div>
        `).join('');

        searchResults.innerHTML = resultsHTML;
    }

    // Event listeners for search
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchProduct(this.value);
        }
    });

    siteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const site = button.dataset.site;
            const query = searchInput.value;
            if (query.trim()) {
                searchProduct(query);
            }
        });
    });

    // Function to open login or signup page in a popup window instead of a new tab
    function openAuthWindow(url) {
        const width = 800;
        const height = 700;
        const left = (screen.width - width) / 2;
        const top = (screen.height - height) / 2;
        
        const authWindow = window.open(
            url, 
            "auth_window",
            `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes`
        );
        
        // Poll localStorage every second to check for token
        const checkToken = setInterval(() => {
            try {
                const token = localStorage.getItem("token");
                
                // If we have a token now, process it
                if (token) {
                    console.log("Token detected in localStorage:", token.substring(0, 10) + "...");
                    clearInterval(checkToken);
                    
                    // Update UI
                    authSection.classList.add("hidden");
                    priceSection.classList.remove("hidden");
                    logoutButton.classList.remove("hidden");
                    smartTipElement.classList.add("hidden");
                    loadPriceComparison();
                    
                    // Close the window
                    if (authWindow && !authWindow.closed) {
                        authWindow.close();
                    }
                }
            } catch (e) {
                console.error("Error checking token:", e);
            }
        }, 1000);
        
        // Clear interval if window is closed
        const checkClosed = setInterval(() => {
            if (authWindow && authWindow.closed) {
                clearInterval(checkToken);
                clearInterval(checkClosed);
            }
        }, 500);
    }

    const smartTips = [
        "Smart Tip: Compare prices across multiple sites!",
        "Smart Tip: Check reviews before buying!",
        "Smart Tip: Look for coupon codes!",
        "Smart Tip: Save more with bulk purchases!",
        "Smart Tip: Check for No Cost EMI on Flipkart!",
        "Smart Tip: Look for Authenticity Guarantee on eBay!"
    ];

    function rotateSmartTip() {
        let index = 0;
        smartTipElement.textContent = smartTips[index];
        setInterval(() => {
            index = (index + 1) % smartTips.length;
            smartTipElement.textContent = smartTips[index];
        }, 5000);
    }

    if (!window.chrome || !chrome.runtime) {
        statusElement.innerText = "Please enable JavaScript in your browser to use this extension.";
        authSection.classList.add("hidden");
        priceSection.classList.remove("hidden");
        smartTipElement.classList.add("hidden");
        return;
    }

<<<<<<< HEAD
    // Tab switching functionality
    loginTab.addEventListener("click", () => {
        loginTab.classList.add("active");
        registerTab.classList.remove("active");
        loginForm.classList.remove("hidden");
        registerForm.classList.add("hidden");
        clearMessages();
    });

    registerTab.addEventListener("click", () => {
        registerTab.classList.add("active");
        loginTab.classList.remove("active");
        registerForm.classList.remove("hidden");
        loginForm.classList.add("hidden");
        clearMessages();
    });

    // Check if the user is already logged in
=======
>>>>>>> 445aef37f197c5cdba226b30b59683ed5b963ffa
    const token = localStorage.getItem("token");
    if (token) {
        authSection.classList.add("hidden");
        priceSection.classList.remove("hidden");
        logoutButton.classList.remove("hidden");
        smartTipElement.classList.add("hidden");
        loadPriceComparison();
    } else {
        rotateSmartTip();
    }

<<<<<<< HEAD
    // Login functionality
    loginButton.addEventListener("click", async () => {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!validateInput(username, password)) {
            showMessage(authMessage, "Please enter both username and password", "error");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("username", username);
            showAuthSuccess();
            loadPriceComparison();
        } catch (err) {
            showMessage(authMessage, err.message || "Login failed. Please try again.", "error");
            console.error("Login error:", err);
        }
    });

    // Register functionality
    registerButton.addEventListener("click", async () => {
        const username = regUsernameInput.value.trim();
        const password = regPasswordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        if (!validateRegistration(username, password, confirmPassword)) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Registration failed");
            }

            showMessage(regAuthMessage, "Registration successful! Please login.", "success");
            clearRegistrationForm();
            
            // Switch to login tab
            setTimeout(() => {
                loginTab.click();
            }, 1500);
        } catch (err) {
            showMessage(regAuthMessage, err.message || "Registration failed. Please try again.", "error");
            console.error("Registration error:", err);
        }
=======
    loginButton.addEventListener("click", () => {
        console.log('Login button clicked, redirecting to:', `${WEBSITE_URL}/login`);
        localStorage.setItem('return_to_extension', 'true');
        openAuthWindow(`${WEBSITE_URL}/login`);
    });

    registerButton.addEventListener("click", () => {
        console.log('Register button clicked, redirecting to:', `${WEBSITE_URL}/signup`);
        localStorage.setItem('return_to_extension', 'true');
<<<<<<< HEAD
        openAuthWindow(`${WEBSITE_URL}/signup`);
=======
        chrome.tabs.create({ url: `${WEBSITE_URL}/signup` });
>>>>>>> 445aef37f197c5cdba226b30b59683ed5b963ffa
>>>>>>> 68afcd953c83c0496b1f23f5060313cbea25f1e3
    });

    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        authSection.classList.remove("hidden");
        priceSection.classList.add("hidden");
        logoutButton.classList.add("hidden");
<<<<<<< HEAD
        clearMessages();
        loginTab.click();
=======
        smartTipElement.classList.remove("hidden");
        authMessage.innerText = "";
        rotateSmartTip();
>>>>>>> 445aef37f197c5cdba226b30b59683ed5b963ffa
    });

    async function loadPriceComparison() {
        chrome.runtime.sendMessage({ action: "getProductData" }, (response) => {
            if (!response || !response.data) {
                statusElement.innerText = "No product data available.";
                return;
            }

            const { productName, productPrice, site, discount, specialOffer } = response.data;
            let priceHTML = `
                <h3>${productName}</h3>
                <p><strong>${site} Price:</strong> ${productPrice}</p>
            `;

            if (discount) {
                priceHTML += `<p><strong>Discount:</strong> ${discount}</p>`;
            }
            if (specialOffer) {
                priceHTML += `<p><strong>Special Offer:</strong> ${specialOffer}</p>`;
            }

            if (site.toLowerCase().includes("flipkart")) {
                priceHTML += `<p><em>Eligible for Flipkart Plus benefits and No Cost EMI!</em></p>`;
            } else if (site.toLowerCase().includes("ebay")) {
                priceHTML += `<p><em>Comes with eBay Authenticity Guarantee!</em></p>`;
            }

            priceHTML += `<p><strong>Comparing Prices...</strong></p>`;
            pricesElement.innerHTML = priceHTML;

            chrome.runtime.sendMessage({ action: "comparePrices", data: { productName, site } }, (comparisonResponse) => {
                if (!comparisonResponse || !comparisonResponse.prices) {
                    pricesElement.innerHTML += "<p>Error fetching prices.</p>";
                    return;
                }

                let comparisons = comparisonResponse.prices.map(({ site, price }) => {
                    return `<p><strong>${site}:</strong> ${price}</p>`;
                }).join("");
                pricesElement.innerHTML += comparisons;
                saveButton.classList.remove("hidden");

                saveButton.addEventListener("click", () => {
                    fetch(`${API_URL}/api/prices`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("token")}`
                        },
                        body: JSON.stringify({
                            productName: productName,
                            currentSite: site,
                            currentPrice: productPrice,
                            comparisons: comparisonResponse.prices
                        })
                    })
                    .then(res => res.json())
                    .then(data => {
                        alert("Price history saved successfully!");
                        console.log("Price history saved:", data);
                    })
                    .catch(err => console.error("Error saving history:", err));
                });
            });
        });
    }

<<<<<<< HEAD
    // Listen for messages from the background script
    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
        console.log('Message received from background script:', message);
        
        if (message.action === "auth_success" && message.token) {
            console.log('Auth success message received from background script');
            localStorage.setItem('token', message.token);
            authSection.classList.add("hidden");
            priceSection.classList.remove("hidden");
            logoutButton.classList.remove("hidden");
            smartTipElement.classList.add("hidden");
            loadPriceComparison();
            
            sendResponse({ success: true });
        }
    });

    // Listen for messages from website login/signup pages via window.postMessage
    window.addEventListener('message', function(event) {
        console.log('Window message received:', event.data);
        
        // Check if it's from our expected origin and has the right format
        if (event.origin === 'http://localhost:3000' && 
            (event.data.type === 'LOGIN_SUCCESS' || event.data.type === 'SIGNUP_SUCCESS')) {
            
            console.log('Valid auth message received via postMessage, token:', 
                        event.data.token ? (event.data.token.substring(0, 10) + '...') : 'none');
                        
            localStorage.setItem('token', event.data.token);
=======
<<<<<<< HEAD
    // Helper functions
    function validateInput(username, password) {
        return username.length > 0 && password.length > 0;
    }

    function validateRegistration(username, password, confirmPassword) {
        if (!validateInput(username, password)) {
            showMessage(regAuthMessage, "Please fill in all fields", "error");
            return false;
        }

        if (password.length < 6) {
            showMessage(regAuthMessage, "Password must be at least 6 characters", "error");
            return false;
        }

        if (password !== confirmPassword) {
            showMessage(regAuthMessage, "Passwords do not match", "error");
            return false;
        }

        return true;
    }

    function showMessage(element, message, type) {
        element.textContent = message;
        element.className = type;
        element.classList.remove("hidden");
    }

    function clearMessages() {
        authMessage.className = "hidden";
        regAuthMessage.className = "hidden";
    }

    function clearRegistrationForm() {
        regUsernameInput.value = "";
        regPasswordInput.value = "";
        confirmPasswordInput.value = "";
    }

    function showAuthSuccess() {
        authSection.classList.add("hidden");
        priceSection.classList.remove("hidden");
        clearMessages();
    }

    // Check authentication status on popup open
    function checkAuthStatus() {
        const token = localStorage.getItem("token");
        if (token) {
            showAuthSuccess();
            return true;
        }
        return false;
    }

    // Initialize authentication check
    checkAuthStatus();
});
=======
    chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse) {
        if (request.type === 'LOGIN_SUCCESS' || request.type === 'SIGNUP_SUCCESS') {
            localStorage.setItem('token', request.token);
>>>>>>> 68afcd953c83c0496b1f23f5060313cbea25f1e3
            authSection.classList.add("hidden");
            priceSection.classList.remove("hidden");
            logoutButton.classList.remove("hidden");
            smartTipElement.classList.add("hidden");
            loadPriceComparison();
        }
    });
});
>>>>>>> 445aef37f197c5cdba226b30b59683ed5b963ffa
