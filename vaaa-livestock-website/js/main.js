// API Configuration
<<<<<<< HEAD
// Replace 'your-backend-url.onrender.com' with your actual Render backend URL after deployment
=======
>>>>>>> d27b420271b84794a39ff1b2b08acb183bcd0cce
// Replace with your actual Render backend URL if different
const RENDER_BACKEND_URL = 'https://vaaa-backend.onrender.com/api';

const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://127.0.0.1:8000/api'
    : RENDER_BACKEND_URL;

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// Page load effect
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// Contact Form Handler
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        if (!name || !email || !message) {
            alert('Please fill in all fields');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }

        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
    });
}

// State Management
let products = [];
let cart = [];

// Initialize page
document.addEventListener('DOMContentLoaded', async function() {
    if (document.getElementById('productsList')) {
        await fetchProducts();
        loadProducts('all');
        setupCategoryFilter();
    }
    updateCartDisplay();
});

// Fetch products from API
async function fetchProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/products/`);
        if (!response.ok) throw new Error('Failed to fetch products');
        products = await response.json();
        console.log('Products loaded from API:', products);
    } catch (error) {
        console.error('Error fetching products:', error);
        // Fallback to static products if API fails during development
        products = [
            { id: 1, name: "Broiler Chickens", category: "poultry", price: 3500, unit: "per bird", image: "../images/products/broilers.jpg" },
            { id: 2, name: "Layer Hens", category: "poultry", price: 2800, unit: "per bird", image: "../images/products/layers.jpg" },
            { id: 3, name: "Fresh Eggs", category: "poultry", price: 1800, unit: "per crate", image: "../images/products/eggs.jpg" }
        ];
    }
}

// Load products based on category
function loadProducts(category) {
    const productsList = document.getElementById('productsList');
    if (!productsList) return;

    const filteredProducts = category === 'all'
        ? products
        : products.filter(p => p.category === category);

    productsList.innerHTML = '';

    if (filteredProducts.length === 0) {
        productsList.innerHTML = '<div class="col-12 text-center"><p>No products found in this category.</p></div>';
        return;
    }

    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-select-card mb-3';
        productCard.innerHTML = `
            <div class="row align-items-center">
                <div class="col-auto">
                    <img src="${product.image || '../images/products/placeholder.jpg'}" alt="${product.name}" class="product-image-small">
                </div>
                <div class="col">
                    <h5 class="mb-1">${product.name}</h5>
                    <p class="text-muted mb-2">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
                    <p class="mb-0"><strong>₦${parseFloat(product.price).toLocaleString()} ${product.unit}</strong></p>
                </div>
                <div class="col-auto">
                    <button class="btn btn-success" onclick="addToCart(${product.id})">
                        <i class="bi bi-cart-plus"></i> Add to Cart
                    </button>
                </div>
            </div>
        `;
        productsList.appendChild(productCard);
    });
}

// Setup category filter
function setupCategoryFilter() {
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            loadProducts(this.value);
        });
    }
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCartDisplay();
    showToast(`${product.name} added to cart!`);
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
    showToast('Item removed from cart');
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity < 1) {
            removeFromCart(productId);
        } else {
            updateCartDisplay();
        }
    }
}

// Update cart display
function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const subtotal = document.getElementById('subtotal');
    const total = document.getElementById('total');
    if (!cartItems) return;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-muted text-center">No items in cart</p>';
        subtotal.textContent = '₦0';
        total.textContent = '₦0';
        return;
    }

    let subtotalAmount = 0;
    cartItems.innerHTML = '';

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotalAmount += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item border-bottom py-2';
        cartItem.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="mb-0">${item.name}</h6>
                <i class="bi bi-x-circle text-danger cursor-pointer" onclick="removeFromCart(${item.id})"></i>
            </div>
            <div class="d-flex justify-content-between align-items-center">
                <div class="quantity-control d-flex align-items-center">
                    <button class="btn btn-sm btn-outline-secondary py-0 px-2" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span class="mx-2">${item.quantity}</span>
                    <button class="btn btn-sm btn-outline-secondary py-0 px-2" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <strong>₦${itemTotal.toLocaleString()}</strong>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });

    subtotal.textContent = `₦${subtotalAmount.toLocaleString()}`;
    total.textContent = `₦${subtotalAmount.toLocaleString()}`;
}

// Navigation functions
function nextStep(step) {
    if (step === 2 && cart.length === 0) {
        alert('Please add at least one product to your cart');
        return;
    }

    if (step === 3) {
        if (!validateCustomerForm()) return;
        displayReview();
    }

    document.querySelectorAll('.form-section').forEach(section => section.classList.remove('active'));
    document.getElementById(`step${step}`).classList.add('active');
    updateStepIndicators(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function prevStep(step) {
    document.querySelectorAll('.form-section').forEach(section => section.classList.remove('active'));
    document.getElementById(`step${step}`).classList.add('active');
    updateStepIndicators(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateStepIndicators(currentStep) {
    document.querySelectorAll('.step').forEach(step => {
        const stepNum = parseInt(step.dataset.step);
        step.classList.remove('active', 'completed');
        if (stepNum === currentStep) {
            step.classList.add('active');
        } else if (stepNum < currentStep) {
            step.classList.add('completed');
        }
    });
}

function validateCustomerForm() {
    const name = document.getElementById('customerName').value.trim();
    const email = document.getElementById('customerEmail').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    const address = document.getElementById('customerAddress').value.trim();

    if (!name) { alert('Please enter your name'); return false; }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) { alert('Please enter a valid email'); return false; }
    if (!phone || !/^\d{10,15}$/.test(phone)) { alert('Please enter a valid phone number'); return false; }
    if (!address) { alert('Please enter your address'); return false; }

    return true;
}

function displayReview() {
    const reviewSection = document.getElementById('orderReview');
    if (!reviewSection) return;
    reviewSection.innerHTML = '';

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        const reviewItem = document.createElement('div');
        reviewItem.className = 'review-item mb-2';
        reviewItem.innerHTML = `
            <p class="mb-1"><strong>${item.name}</strong> - ${item.quantity} x ₦${parseFloat(item.price).toLocaleString()} = ₦${itemTotal.toLocaleString()}</p>
        `;
        reviewSection.appendChild(reviewItem);
    });

    const subtotalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const customerName = document.getElementById('customerName').value;
    const customerEmail = document.getElementById('customerEmail').value;
    const customerPhone = document.getElementById('customerPhone').value;
    const customerAddress = document.getElementById('customerAddress').value;

    const customerInfo = document.createElement('div');
    customerInfo.className = 'customer-info mt-3 pt-3 border-top';
    customerInfo.innerHTML = `
        <h6>Customer Information</h6>
        <p class="mb-1"><strong>Name:</strong> ${customerName}</p>
        <p class="mb-1"><strong>Email:</strong> ${customerEmail}</p>
        <p class="mb-1"><strong>Phone:</strong> ${customerPhone}</p>
        <p class="mb-1"><strong>Address:</strong> ${customerAddress}</p>
        <h5 class="mt-3 text-success">Total: ₦${subtotalAmount.toLocaleString()}</h5>
    `;
    reviewSection.appendChild(customerInfo);
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background: #28a745; color: white; padding: 10px 20px; border-radius: 5px; z-index: 1000; transition: opacity 0.3s;';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.style.opacity = '1', 100);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
}

// Checkout (submit order to API)
async function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    if (!validateCustomerForm()) return;

    const orderData = {
        customer_name: document.getElementById('customerName').value,
        customer_email: document.getElementById('customerEmail').value,
        customer_phone: document.getElementById('customerPhone').value,
        customer_address: document.getElementById('customerAddress').value,
        items: cart.map(item => ({ id: item.id, quantity: item.quantity }))
    };

    try {
        const response = await fetch(`${API_BASE_URL}/orders/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to submit order');
        }

        alert('Thank you for your order! Your order has been received.');
        cart = [];
        updateCartDisplay();
        nextStep(1);
    } catch (error) {
        console.error('Checkout error:', error);
        alert('Error submitting order: ' + error.message);
    }
}