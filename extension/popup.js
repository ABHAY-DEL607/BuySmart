document.addEventListener("DOMContentLoaded", function () {
    const authSection = document.getElementById("authSection");
    const priceSection = document.getElementById("priceSection");
    const authMessage = document.getElementById("authMessage");
    const loginButton = document.getElementById("loginButton");
    const registerButton = document.getElementById("registerButton");
    const logoutButton = document.getElementById("logoutButton");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const pricesElement = document.getElementById("prices");
    const statusElement = document.getElementById("status");
    const saveButton = document.getElementById("saveButton");

    const API_URL = "http://localhost:5000";

    // Check if the user is already logged in
    const token = localStorage.getItem("token");
    if (token) {
        authSection.classList.add("hidden");
        priceSection.classList.remove("hidden");
        logoutButton.classList.remove("hidden");
        loadPriceComparison();
    }

    // Login User
    loginButton.addEventListener("click", async () => {
        const username = usernameInput.value;
        const password = passwordInput.value;

        if (!username || !password) {
            authMessage.innerText = "Please enter both username and password";
            return;
        }

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            if (data.token) {
                localStorage.setItem("token", data.token);
                authSection.classList.add("hidden");
                priceSection.classList.remove("hidden");
                logoutButton.classList.remove("hidden");
                authMessage.innerText = "";
                loadPriceComparison();
            }
        } catch (err) {
            authMessage.innerText = err.message || "Login failed. Please try again.";
            console.error("Login error:", err);
        }
    });

    // Register User
    registerButton.addEventListener("click", async () => {
        const username = usernameInput.value;
        const password = passwordInput.value;

        if (!username || !password) {
            authMessage.innerText = "Please enter both username and password";
            return;
        }

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Registration failed");
            }

            authMessage.innerText = "Registration successful! Please login.";
            usernameInput.value = "";
            passwordInput.value = "";
        } catch (err) {
            authMessage.innerText = err.message || "Registration failed. Please try again.";
            console.error("Registration error:", err);
        }
    });

    // Logout User
    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("token");
        authSection.classList.remove("hidden");
        priceSection.classList.add("hidden");
        logoutButton.classList.add("hidden");
        authMessage.innerText = "";
        usernameInput.value = "";
        passwordInput.value = "";
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
});
