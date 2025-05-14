document.addEventListener("DOMContentLoaded", function () {
    // Get DOM elements
    const loginTab = document.getElementById("loginTab");
    const registerTab = document.getElementById("registerTab");
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const authSection = document.getElementById("authSection");
    const priceSection = document.getElementById("priceSection");

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
    const logoutButton = document.getElementById("logoutButton");
    const pricesElement = document.getElementById("prices");
    const statusElement = document.getElementById("status");
    const saveButton = document.getElementById("saveButton");

    const API_URL = "http://localhost:5000";

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
    const token = localStorage.getItem("token");
    if (token) {
        authSection.classList.add("hidden");
        priceSection.classList.remove("hidden");
        logoutButton.classList.remove("hidden");
        loadPriceComparison();
    }

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
    });

    // Logout User
    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        authSection.classList.remove("hidden");
        priceSection.classList.add("hidden");
        logoutButton.classList.add("hidden");
        clearMessages();
        loginTab.click();
    });

    // Load price comparison data
    async function loadPriceComparison() {
        chrome.runtime.sendMessage({ action: "getProductData" }, (response) => {
            if (!response || !response.data) {
                statusElement.innerText = "No product data available.";
                return;
            }

            const { productName, productPrice, site } = response.data;
            pricesElement.innerHTML = `
                <h3>${productName}</h3>
                <p><strong>${site} Price:</strong> ${productPrice}</p>
                <p><strong>Comparing Prices...</strong></p>
            `;

            chrome.runtime.sendMessage({ action: "comparePrices", data: { productName, site } }, (comparisonResponse) => {
                if (!comparisonResponse || !comparisonResponse.prices) {
                    pricesElement.innerHTML += "<p>Error fetching prices.</p>";
                    return;
                }

                let comparisons = comparisonResponse.prices.map(({ site, price }) => `<p><strong>${site}:</strong> ${price}</p>`).join("");
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
