

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


window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});


window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});


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

// Product Database
const products = [
    // Poultry
    { id: 1, name: "Broiler Chickens", category: "poultry", price: 3500, unit: "per bird", image: "../images/products/broilers.jpg" },
    { id: 2, name: "Layer Hens", category: "poultry", price: 2800, unit: "per bird", image: "../images/products/layers.jpg" },
    { id: 3, name: "Fresh Eggs", category: "poultry", price: 1800, unit: "per crate", image: "../images/products/eggs.jpg" },

    // Goats
    { id: 4, name: "Goats (West African Dwarf)", category: "goats", price: 35000, unit: "per animal", image: "../images/products/goats.jpg" },
    { id: 5, name: "Goats (Boer)", category: "goats", price: 50000, unit: "per animal", image: "../images/products/goats.jpg" },
    { id: 6, name: "Goat Milk", category: "goats", price: 1500, unit: "per liter", image: "../images/products/goat-milk.jpg" },

    // Sheep
    { id: 7, name: "Sheep (Yankasa)", category: "sheep", price: 45000, unit: "per animal", image: "../images/products/sheep.jpg" },
    { id: 8, name: "Sheep (Uda)", category: "sheep", price: 55000, unit: "per animal", image: "../images/products/sheep.jpg" },

    // Cattle
    { id: 9, name: "Beef Cattle", category: "cattle", price: 350000, unit: "per animal", image: "../images/products/beef-cattle.jpg" },
    { id: 10, name: "Dairy Cattle", category: "cattle", price: 450000, unit: "per animal", image: "../images/products/dairy-cattle.jpg" },
    { id: 11, name: "Fresh Cow Milk", category: "cattle", price: 1200, unit: "per liter", image: "../images/products/cow-milk.jpg" },

    // By-Products
    { id: 12, name: "Processed Meat", category: "products", price: 2500, unit: "per kg", image: "../images/products/meat.jpg" },
    { id: 13, name: "Organic Manure", category: "products", price: 5000, unit: "per bag", image: "../images/products/manure.jpg" },
    { id: 14, name: "Farm Cheese", category: "products", price: 3500, unit: "per kg", image: "../images/products/cheese.jpg" }
];

// Cart Storage
let cart = [];

// Initialize page
//document.addEventListener('DOMContentLoaded', function() {
//    loadProducts('all');
//    setupCategoryFilter();
//    updateCartDisplay();
//});

document.addEventListener('DOMContentLoaded', async function() {
    await loadProducts('all'); // load from backend
    setupCategoryFilter();
    updateCartDisplay();
});


// Load products based on category
function loadProducts(category) {
    const productsList = document.getElementById('productsList');
    const filteredProducts = category === 'all'
        ? products
        : products.filter(p => p.category === category);

    productsList.innerHTML = '';

    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-select-card';
        productCard.innerHTML = `
            <div class="row align-items-center">
                <div class="col-auto">
                    <img src="${product.image}" alt="${product.name}" class="product-image-small">
                </div>
                <div class="col">
                    <h5 class="mb-1">${product.name}</h5>
                    <p class="text-muted mb-2">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
                    <p class="mb-0"><strong>₦${product.price.toLocaleString()} ${product.unit}</strong></p>
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
    categoryFilter.addEventListener('change', function() {
        loadProducts(this.value);
    });
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
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

    // Show success message
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
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="mb-0">${item.name}</h6>
                <i class="bi bi-x-circle remove-item" onclick="removeFromCart(${item.id})"></i>
            </div>
            <div class="d-flex justify-content-between align-items-center">
                <div class="quantity-control">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
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
    // Validation
    if (step === 2 && cart.length === 0) {
        alert('Please add at least one product to your cart');
        return;
    }

    if (step === 3) {
        if (!validateCustomerForm()) {
            return;
        }
        displayReview();
    }

    // Hide all steps
    document.querySelectorAll('.form-section').forEach(section => {
        section.classList.remove('active');
    });

    // Show current step
    document.getElementById(`step${step}`).classList.add('active');

    // Update step indicators
    updateStepIndicators(step);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function prevStep(step) {
    // Hide all steps
    document.querySelectorAll('.form-section').forEach(section => {
        section.classList.remove('active');
    });

    // Show current step
    document.getElementById(`step${step}`).classList.add('active');

    // Update step indicators
    updateStepIndicators(step);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Update step indicators
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

// Validate customer form
function validateCustomerForm() {
    const name = document.getElementById('customerName').value.trim();
    const email = document.getElementById('customerEmail').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    const address = document.getElementById('customerAddress').value.trim();

    if (!name) {
        alert('Please enter your name');
        return false;
    }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        alert('Please enter a valid email');
        return false;
    }
    if (!phone || !/^\d{10,15}$/.test(phone)) {
        alert('Please enter a valid phone number');
        return false;
    }
    if (!address) {
        alert('Please enter your address');
        return false;
    }

    return true;
}

// Display review before checkout
function displayReview() {
    const reviewSection = document.getElementById('orderReview');
    reviewSection.innerHTML = '';

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        const reviewItem = document.createElement('div');
        reviewItem.className = 'review-item';
        reviewItem.innerHTML = `
            <p><strong>${item.name}</strong> - ${item.quantity} x ₦${item.price.toLocaleString()} = ₦${itemTotal.toLocaleString()}</p>
        `;
        reviewSection.appendChild(reviewItem);
    });

    const subtotalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const customerName = document.getElementById('customerName').value;
    const customerEmail = document.getElementById('customerEmail').value;
    const customerPhone = document.getElementById('customerPhone').value;
    const customerAddress = document.getElementById('customerAddress').value;

    const customerInfo = document.createElement('div');
    customerInfo.className = 'customer-info mt-3';
    customerInfo.innerHTML = `
        <h6>Customer Information</h6>
        <p><strong>Name:</strong> ${customerName}</p>
        <p><strong>Email:</strong> ${customerEmail}</p>
        <p><strong>Phone:</strong> ${customerPhone}</p>
        <p><strong>Address:</strong> ${customerAddress}</p>
        <h6 class="mt-2">Total: ₦${subtotalAmount.toLocaleString()}</h6>
    `;
    reviewSection.appendChild(customerInfo);
}

// Toast notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
}

// Checkout (submit order)
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    if (!validateCustomerForm()) {
        return;
    }

    // Here you could send the order data to your server via fetch/ajax
    console.log('Order submitted:', {
        customer: {
            name: document.getElementById('customerName').value,
            email: document.getElementById('customerEmail').value,
            phone: document.getElementById('customerPhone').value,
            address: document.getElementById('customerAddress').value
        },
        items: cart
    });

    alert('Thank you for your order!');
    cart = [];
    updateCartDisplay();
    nextStep(1);
}
