/**
 * Nike Store - Core Vanilla JavaScript Application
 * Features:
 * - Cart starts at 0 by default. Items added increment the counter dynamically.
 * - LocalStorage cart persistence & real-time badge updates.
 * - Dynamic sliding tab indicator in main navbar.
 * - Strict payment validation rules:
 *   - Card Number: Exactly 16 digits.
 *   - CVV: Exactly 3 digits.
 *   - Zip Code: Exactly 6 digits.
 *   - Expiry Date: MM/YY format.
 * - Tab-aware Checkout validation for Cards, Crypto, Net Banking, and UPI methods.
 * - Disables/fades "Pay Now" button until active tab requirements pass.
 */

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

// --- Main App Initializer ---
function initApp() {
    initCartState();
    initSlidingNavbar();
    initMobileNav();
    initToastContainer();

    if (document.querySelector('.product-page-main')) {
        initProductPage();
    }
    if (document.querySelector('.cart-page-main')) {
        initCartPage();
    }
    if (document.querySelector('.payment-page-main')) {
        initPaymentPage();
    }
}

// ==========================================
// 1. Cart State Management (LocalStorage)
// ==========================================
const CART_STORAGE_KEY = 'nike_store_cart_v2';
const DEFAULT_PRODUCT = {
    id: 'nike-alpha-5',
    title: 'Nike Air Max Alpha Trainer 5',
    color: 'Red',
    price: 1334,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80'
};

// Returns cart array. Defaults to empty [] (0 items)
function getCart() {
    const rawData = localStorage.getItem(CART_STORAGE_KEY);
    if (!rawData) {
        return []; // Cart starts at 0 by default
    }
    return JSON.parse(rawData);
}

function saveCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateCartBadge();
}

function initCartState() {
    updateCartBadge();
}

function updateCartBadge() {
    const cart = getCart();
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badges = document.querySelectorAll('.cart-badge');

    badges.forEach(badge => {
        badge.textContent = totalCount;
        badge.classList.remove('pop-anim');
        void badge.offsetWidth; // Trigger DOM reflow for animation reset
        badge.classList.add('pop-anim');
    });
}

// ==========================================
// 2. Sliding Navbar Indicator
// ==========================================
function initSlidingNavbar() {
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!navMenu || navLinks.length === 0) return;

    let indicator = document.querySelector('.nav-indicator');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.className = 'nav-indicator';
        navMenu.appendChild(indicator);
    }

    function positionIndicator(target) {
        if (!target) return;
        const rect = target.getBoundingClientRect();
        const parentRect = navMenu.getBoundingClientRect();
        
        indicator.style.left = `${rect.left - parentRect.left}px`;
        indicator.style.width = `${rect.width}px`;
        indicator.style.opacity = '1';
    }

    const activeLink = document.querySelector('.nav-link.active') || navLinks[0];
    positionIndicator(activeLink);

    navLinks.forEach(link => {
        link.addEventListener('mouseenter', (e) => positionIndicator(e.target));
    });

    navMenu.addEventListener('mouseleave', () => {
        const currentActive = document.querySelector('.nav-link.active') || navLinks[0];
        positionIndicator(currentActive);
    });

    window.addEventListener('resize', () => {
        const currentActive = document.querySelector('.nav-link.active') || navLinks[0];
        positionIndicator(currentActive);
    });
}

function initMobileNav() {
    const toggleBtn = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (toggleBtn && navMenu) {
        toggleBtn.addEventListener('click', () => {
            navMenu.classList.toggle('mobile-open');
        });
    }
}

// ==========================================
// 3. Toast Feedback System
// ==========================================
function initToastContainer() {
    if (!document.querySelector('.toast-container')) {
        const container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
}

function showToast(message) {
    const container = document.querySelector('.toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-circle-check toast-icon"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// ==========================================
// 4. Product Page Logic (product.html)
// ==========================================
function initProductPage() {
    const qtyDisplay = document.querySelector('.qty-display');
    const qtyMinusBtn = document.querySelector('.qty-btn-minus');
    const qtyPlusBtn = document.querySelector('.qty-btn-plus');
    const addToCartBtn = document.querySelector('.btn-add-cart');
    const galleryCards = document.querySelectorAll('.gallery-card');
    const mainImg = document.querySelector('.product-main-img');

    let selectedQty = 1;

    if (qtyMinusBtn && qtyPlusBtn && qtyDisplay) {
        qtyDisplay.textContent = selectedQty;

        qtyMinusBtn.addEventListener('click', () => {
            if (selectedQty > 1) {
                selectedQty--;
                qtyDisplay.textContent = selectedQty;
            }
        });

        qtyPlusBtn.addEventListener('click', () => {
            if (selectedQty < 10) {
                selectedQty++;
                qtyDisplay.textContent = selectedQty;
            }
        });
    }

    // Add to Cart
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            const cart = getCart();
            const existingIndex = cart.findIndex(item => item.id === DEFAULT_PRODUCT.id);

            if (existingIndex > -1) {
                cart[existingIndex].quantity += selectedQty;
            } else {
                cart.push({ ...DEFAULT_PRODUCT, quantity: selectedQty });
            }

            saveCart(cart);
            showToast(`Added ${selectedQty} pair(s) to your cart!`);
        });
    }

    // Gallery Thumbnails
    galleryCards.forEach(card => {
        card.addEventListener('click', () => {
            galleryCards.forEach(c => c.classList.remove('active-thumb'));
            card.classList.add('active-thumb');
            const imgInside = card.querySelector('img');
            if (imgInside && mainImg) {
                mainImg.src = imgInside.src;
            }
        });
    });
}

// ==========================================
// 5. Cart Page Logic (cart.html)
// ==========================================
let activeDiscount = 0;

function initCartPage() {
    renderCartTable();
    initCouponSystem();
}

function renderCartTable() {
    const cart = getCart();
    const tableBody = document.querySelector('.cart-table tbody');
    const cartLeftCol = document.querySelector('.cart-left-col');

    if (!cartLeftCol) return;

    if (cart.length === 0) {
        cartLeftCol.innerHTML = `
            <div class="empty-cart-view">
                <i class="fa-solid fa-cart-flatbed empty-cart-icon"></i>
                <h3 class="empty-cart-title">Your Cart is Currently Empty</h3>
                <p class="empty-cart-text">Explore our collection and add your favorite sneakers to get started.</p>
                <a href="product.html" class="shop-now-btn" style="display:inline-flex;">
                    <span>Browse Products</span>
                    <i class="fa-solid fa-arrow-right"></i>
                </a>
            </div>
        `;
        updateSummaryCalculations(0);
        return;
    }

    if (tableBody) {
        tableBody.innerHTML = cart.map((item, index) => `
            <tr>
                <td class="product-cell">
                    <img src="${item.image}" alt="${item.title}" class="cart-item-img">
                    <div class="cart-item-meta">
                        <h4 class="cart-item-title">${item.title}</h4>
                        <span class="cart-item-color">Color: ${item.color}</span>
                    </div>
                </td>
                <td class="quantity-cell">
                    <div class="interactive-qty-box">
                        <button class="qty-btn" onclick="updateItemQty(${index}, -1)">-</button>
                        <span class="qty-display">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateItemQty(${index}, 1)">+</button>
                    </div>
                </td>
                <td class="price-cell">₹ ${(item.price * item.quantity).toLocaleString('en-IN')}</td>
                <td class="remove-cell">
                    <button class="remove-btn" onclick="removeCartItem(${index})" aria-label="Remove item">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    updateSummaryCalculations(subtotal);
}

function updateItemQty(index, change) {
    const cart = getCart();
    if (cart[index]) {
        cart[index].quantity += change;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        saveCart(cart);
        renderCartTable();
    }
}

function removeCartItem(index) {
    const cart = getCart();
    if (cart[index]) {
        cart.splice(index, 1);
        saveCart(cart);
        renderCartTable();
        showToast('Item removed from cart');
    }
}

function updateSummaryCalculations(subtotal) {
    const tax = subtotal > 0 ? Math.round(subtotal * 0.18) : 0; // 18% GST
    const grandTotal = Math.max(0, subtotal + tax - activeDiscount);

    const subtotalElem = document.querySelector('.summary-subtotal');
    const taxElem = document.querySelector('.summary-tax');
    const discountElem = document.querySelector('.summary-discount');
    const totalElems = document.querySelectorAll('.total-val, .pay-now-amount');

    if (subtotalElem) subtotalElem.textContent = `₹ ${subtotal.toLocaleString('en-IN')}`;
    if (taxElem) taxElem.textContent = `₹ ${tax.toLocaleString('en-IN')}`;
    if (discountElem) discountElem.textContent = `- ₹ ${activeDiscount.toLocaleString('en-IN')}`;
    
    totalElems.forEach(el => {
        el.textContent = `₹ ${grandTotal.toLocaleString('en-IN')}`;
    });
}

function initCouponSystem() {
    const applyBtn = document.querySelector('.btn-apply-coupon');
    const couponInput = document.querySelector('.coupon-input');

    if (applyBtn && couponInput) {
        applyBtn.addEventListener('click', () => {
            const code = couponInput.value.trim().toUpperCase();
            if (code === 'NIKE10' || code === 'SAVE200') {
                activeDiscount = 223;
                showToast('Coupon applied! (₹ 223 Discount)');
            } else if (code === '') {
                showToast('Please enter a promo code.');
                return;
            } else {
                showToast('Invalid Code. Use NIKE10');
                activeDiscount = 0;
            }
            const cart = getCart();
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            updateSummaryCalculations(subtotal);
        });
    }
}

// ==========================================
// 6. Checkout & Payment Logic (payment.html)
// ==========================================
function initPaymentPage() {
    const emailInput = document.getElementById('customerEmail');
    const payBtn = document.getElementById('payNowBtn');
    const methodTabs = document.querySelectorAll('.method-tab');
    const paymentPanels = document.querySelectorAll('.payment-panel');

    // Inputs for Tab 1: Cards
    const cardNumInput = document.getElementById('cardNumber');
    const expiryInput = document.getElementById('cardExpiry');
    const cvvInput = document.getElementById('cardCvv');
    const zipInput = document.getElementById('cardZip');

    // Inputs for Tab 2: Crypto
    const cryptoSelect = document.getElementById('cryptoSelect');
    const cryptoTxInput = document.getElementById('cryptoTxInput');

    // Inputs for Tab 3: Bank
    const bankSelect = document.getElementById('bankSelect');
    const otherBankInput = document.getElementById('otherBankName');
    const otherBankGroup = document.getElementById('otherBankGroup');

    // Inputs for Tab 4: UPI
    const upiIdInput = document.getElementById('upiIdInput');

    let currentActiveTab = 'cards';

    // Calculate dynamic cart totals
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    updateSummaryCalculations(subtotal);

    // Dynamic Tab Switching
    methodTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            methodTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            currentActiveTab = tab.dataset.method;

            paymentPanels.forEach(panel => {
                if (panel.id === `panel-${currentActiveTab}`) {
                    panel.classList.add('active-panel');
                } else {
                    panel.classList.remove('active-panel');
                }
            });

            validateFormByActiveTab();
        });
    });

    // Toggle "Other Bank" extra input
    if (bankSelect && otherBankGroup) {
        bankSelect.addEventListener('change', () => {
            if (bankSelect.value === 'other') {
                otherBankGroup.style.display = 'flex';
            } else {
                otherBankGroup.style.display = 'none';
            }
            validateFormByActiveTab();
        });
    }

    // --- Strict Validation Helper Functions ---
    function isEmailValid() {
        return emailInput && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim());
    }

    function isCardValid() {
        if (!cardNumInput) return false;
        const digitsOnly = cardNumInput.value.replace(/\D/g, '');
        return digitsOnly.length === 16; // STRICT: exactly 16 digits
    }

    function isExpiryValid() {
        return expiryInput && /^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryInput.value.trim());
    }

    function isCvvValid() {
        if (!cvvInput) return false;
        const val = cvvInput.value.trim();
        return val.length === 3 && /^\d{3}$/.test(val); // STRICT: exactly 3 digits
    }

    function isZipValid() {
        if (!zipInput) return false;
        const val = zipInput.value.trim();
        return val.length === 6 && /^\d{6}$/.test(val); // STRICT: exactly 6 digits
    }

    function isUpiValid() {
        if (!upiIdInput) return false;
        const val = upiIdInput.value.trim();
        return /^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/.test(val); // e.g. name@upi
    }

    function isCryptoValid() {
        const hasCryptoSelected = cryptoSelect && cryptoSelect.value !== '';
        const hasTx = cryptoTxInput && cryptoTxInput.value.trim().length >= 8;
        return hasCryptoSelected && hasTx;
    }

    function isBankValid() {
        if (!bankSelect || bankSelect.value === '') return false;
        if (bankSelect.value === 'other') {
            return otherBankInput && otherBankInput.value.trim().length >= 3;
        }
        return true;
    }

    // Master Validator evaluating active tab + Email + Cart Not Empty
    function validateFormByActiveTab() {
        if (!payBtn) return;

        const emailOk = isEmailValid();
        const cartNotEmpty = getCart().length > 0;

        let tabOk = false;

        if (currentActiveTab === 'cards') {
            tabOk = isCardValid() && isExpiryValid() && isCvvValid() && isZipValid();
        } else if (currentActiveTab === 'crypto') {
            tabOk = isCryptoValid();
        } else if (currentActiveTab === 'bank') {
            tabOk = isBankValid();
        } else if (currentActiveTab === 'upi') {
            tabOk = isUpiValid();
        }

        if (emailOk && tabOk && cartNotEmpty) {
            payBtn.removeAttribute('disabled');
            payBtn.classList.add('valid-ready');
        } else {
            payBtn.setAttribute('disabled', 'true');
            payBtn.classList.remove('valid-ready');
        }
    }

    // Attach listener to all form input elements
    const allInputs = document.querySelectorAll('.form-input, .select-input');
    allInputs.forEach(input => {
        input.addEventListener('input', validateFormByActiveTab);
        input.addEventListener('change', validateFormByActiveTab);
    });

    validateFormByActiveTab();

    // Form Submission Handler
    if (payBtn) {
        payBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (payBtn.hasAttribute('disabled')) return;

            payBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Processing...';
            payBtn.style.pointerEvents = 'none';

            setTimeout(() => {
                showToast('Payment Successful! Order Confirmed.');
                localStorage.removeItem(CART_STORAGE_KEY);
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1600);
            }, 2000);
        });
    }
}