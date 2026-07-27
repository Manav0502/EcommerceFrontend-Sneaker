/**
 * Nike Store - Simple Vanilla JavaScript Application
 * Features:
 * - LocalStorage cart management (defaults to 0 items).
 * - Live input validation with text error messages under fields.
 * - Tab-aware payment validation (Cards, Crypto, Bank, UPI).
 * - Smooth product gallery transitions.
 * - Simulated payment processing modal with generated transaction receipt.
 */

// Global key for cart storage
const CART_KEY = 'nike_cart_student_v1';

document.addEventListener('DOMContentLoaded', function() {
    initNavbar();
    updateCartBadge();

    // Route based on current page
    if (document.querySelector('.product-page-main')) {
        initProductPage();
    }
    if (document.querySelector('.cart-page-main')) {
        initCartPage();
    }
    if (document.querySelector('.payment-page-main')) {
        initPaymentPage();
    }
});

// --- 1. Cart LocalStorage Functions ---
function getCartItems() {
    const data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : []; // Default empty array (0 items)
}

function saveCartItems(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartBadge();
}

function updateCartBadge() {
    const cart = getCartItems();
    let totalQty = 0;
    for (let i = 0; i < cart.length; i++) {
        totalQty += cart[i].quantity;
    }

    const badges = document.querySelectorAll('.cart-badge');
    badges.forEach(badge => {
        badge.textContent = totalQty;
    });
}

// --- 2. Navbar Sliding Underline & Mobile Toggle ---
function initNavbar() {
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileBtn = document.querySelector('.mobile-nav-toggle');

    if (mobileBtn && navMenu) {
        mobileBtn.addEventListener('click', function() {
            navMenu.classList.toggle('mobile-open');
        });
    }

    if (!navMenu || navLinks.length === 0) return;

    let indicator = document.querySelector('.nav-indicator');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.className = 'nav-indicator';
        navMenu.appendChild(indicator);
    }

    function moveIndicator(linkElement) {
        if (!linkElement) return;
        const rect = linkElement.getBoundingClientRect();
        const parentRect = navMenu.getBoundingClientRect();
        
        indicator.style.left = (rect.left - parentRect.left) + 'px';
        indicator.style.width = rect.width + 'px';
        indicator.style.opacity = '1';
    }

    const activeLink = document.querySelector('.nav-link.active') || navLinks[0];
    moveIndicator(activeLink);

    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function(e) {
            moveIndicator(e.target);
        });
    });

    navMenu.addEventListener('mouseleave', function() {
        const currentActive = document.querySelector('.nav-link.active') || navLinks[0];
        moveIndicator(currentActive);
    });
}

// --- 3. Toast Notifications ---
function showToast(msg) {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${msg}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 2500);
}

// --- 4. Product Page Logic (product.html) ---
function initProductPage() {
    const qtyDisplay = document.querySelector('.qty-display');
    const minusBtn = document.querySelector('.qty-btn-minus');
    const plusBtn = document.querySelector('.qty-btn-plus');
    const addBtn = document.querySelector('.btn-add-cart');
    const galleryThumbs = document.querySelectorAll('.gallery-card');
    const mainImg = document.querySelector('.product-main-img');

    let currentQty = 1;

    if (minusBtn && plusBtn && qtyDisplay) {
        minusBtn.addEventListener('click', function() {
            if (currentQty > 1) {
                currentQty--;
                qtyDisplay.textContent = currentQty;
            }
        });

        plusBtn.addEventListener('click', function() {
            if (currentQty < 10) {
                currentQty++;
                qtyDisplay.textContent = currentQty;
            }
        });
    }

    // Add to Cart Action
    if (addBtn) {
        addBtn.addEventListener('click', function() {
            const cart = getCartItems();
            const product = {
                id: 'nike-alpha-5',
                title: 'Nike Air Max Alpha Trainer 5',
                color: 'Red',
                price: 1334,
                quantity: currentQty,
                image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80'
            };

            let found = false;
            for (let i = 0; i < cart.length; i++) {
                if (cart[i].id === product.id) {
                    cart[i].quantity += currentQty;
                    found = true;
                    break;
                }
            }

            if (!found) {
                cart.push(product);
            }

            saveCartItems(cart);
            showToast(`Added ${currentQty} item(s) to cart!`);
        });
    }

    // Gallery Image Switcher with Fade Animation
    galleryThumbs.forEach(thumb => {
        thumb.addEventListener('click', function() {
            galleryThumbs.forEach(t => t.classList.remove('active-thumb'));
            thumb.classList.add('active-thumb');

            const clickedImg = thumb.querySelector('img');
            if (clickedImg && mainImg) {
                // Apply fade out class
                mainImg.classList.add('fade-out');
                setTimeout(() => {
                    mainImg.src = clickedImg.src;
                    mainImg.classList.remove('fade-out');
                }, 200);
            }
        });
    });
}

// --- 5. Cart Page Logic (cart.html) ---
let appliedDiscount = 0;

function initCartPage() {
    renderCart();
    initCoupons();
}

function renderCart() {
    const cart = getCartItems();
    const tableBody = document.querySelector('.cart-table tbody');
    const leftCol = document.querySelector('.cart-left-col');

    if (!leftCol) return;

    if (cart.length === 0) {
        leftCol.innerHTML = `
            <div class="empty-cart-view">
                <i class="fa-solid fa-cart-flatbed empty-cart-icon"></i>
                <h3 style="font-family: var(--font-heading); font-size:1.4rem; margin-bottom:0.5rem;">Your Cart is Empty</h3>
                <p style="color:var(--text-muted); margin-bottom:1.5rem;">Add some shoes to start your purchase.</p>
                <a href="product.html" class="shop-now-btn" style="display:inline-flex;">Browse Products</a>
            </div>
        `;
        updatePriceSummary(0);
        return;
    }

    if (tableBody) {
        let html = '';
        for (let i = 0; i < cart.length; i++) {
            const item = cart[i];
            html += `
                <tr>
                    <td class="product-cell">
                        <img src="${item.image}" alt="${item.title}" class="cart-item-img">
                        <div>
                            <h4 style="font-size:0.95rem; font-weight:700;">${item.title}</h4>
                            <span style="font-size:0.8rem; color:var(--text-muted);">Color: ${item.color}</span>
                        </div>
                    </td>
                    <td>
                        <div class="interactive-qty-box">
                            <button class="qty-btn" onclick="changeQty(${i}, -1)">-</button>
                            <span class="qty-display">${item.quantity}</span>
                            <button class="qty-btn" onclick="changeQty(${i}, 1)">+</button>
                        </div>
                    </td>
                    <td style="font-weight:700; color:var(--primary-dark);">₹ ${(item.price * item.quantity).toLocaleString('en-IN')}</td>
                    <td>
                        <button class="remove-btn" onclick="removeItem(${i})"><i class="fa-solid fa-xmark"></i></button>
                    </td>
                </tr>
            `;
        }
        tableBody.innerHTML = html;
    }

    let subtotal = 0;
    for (let i = 0; i < cart.length; i++) {
        subtotal += cart[i].price * cart[i].quantity;
    }
    updatePriceSummary(subtotal);
}

function changeQty(index, change) {
    const cart = getCartItems();
    if (cart[index]) {
        cart[index].quantity += change;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        saveCartItems(cart);
        renderCart();
    }
}

function removeItem(index) {
    const cart = getCartItems();
    if (cart[index]) {
        cart.splice(index, 1);
        saveCartItems(cart);
        renderCart();
        showToast('Item removed from cart.');
    }
}

function updatePriceSummary(subtotal) {
    const gst = subtotal > 0 ? Math.round(subtotal * 0.18) : 0;
    const total = Math.max(0, subtotal + gst - appliedDiscount);

    const subtotalEl = document.querySelector('.summary-subtotal');
    const taxEl = document.querySelector('.summary-tax');
    const discountEl = document.querySelector('.summary-discount');
    const totalEls = document.querySelectorAll('.total-val, .pay-now-amount');

    if (subtotalEl) subtotalEl.textContent = `₹ ${subtotal.toLocaleString('en-IN')}`;
    if (taxEl) taxEl.textContent = `₹ ${gst.toLocaleString('en-IN')}`;
    if (discountEl) discountEl.textContent = `- ₹ ${appliedDiscount.toLocaleString('en-IN')}`;

    totalEls.forEach(el => {
        el.textContent = `₹ ${total.toLocaleString('en-IN')}`;
    });
}

function initCoupons() {
    const applyBtn = document.querySelector('.btn-apply-coupon');
    const input = document.querySelector('.coupon-input');

    if (applyBtn && input) {
        applyBtn.addEventListener('click', function() {
            const val = input.value.trim().toUpperCase();
            if (val === 'NIKE10' || val === 'SAVE200') {
                appliedDiscount = 223;
                showToast('Promo code applied! (₹ 223 OFF)');
            } else if (val === '') {
                showToast('Please enter a coupon code.');
                return;
            } else {
                showToast('Invalid code. Try NIKE10');
                appliedDiscount = 0;
            }

            const cart = getCartItems();
            let subtotal = 0;
            for (let i = 0; i < cart.length; i++) {
                subtotal += cart[i].price * cart[i].quantity;
            }
            updatePriceSummary(subtotal);
        });
    }
}

// --- 6. Checkout Page Validation & Simulation (payment.html) ---
function initPaymentPage() {
    const emailInput = document.getElementById('customerEmail');
    const payBtn = document.getElementById('payNowBtn');
    const tabs = document.querySelectorAll('.method-tab');
    const panels = document.querySelectorAll('.payment-panel');

    // Cards Inputs
    const cardNum = document.getElementById('cardNumber');
    const cardExp = document.getElementById('cardExpiry');
    const cardCvv = document.getElementById('cardCvv');
    const cardZip = document.getElementById('cardZip');

    // Crypto Inputs
    const cryptoSelect = document.getElementById('cryptoSelect');
    const cryptoTx = document.getElementById('cryptoTxInput');

    // Bank Inputs
    const bankSelect = document.getElementById('bankSelect');
    const otherBankInput = document.getElementById('otherBankName');
    const otherBankGroup = document.getElementById('otherBankGroup');

    // UPI Inputs
    const upiInput = document.getElementById('upiIdInput');

    let activeTab = 'cards';

    // Calculate cart total
    const cart = getCartItems();
    let subtotal = 0;
    for (let i = 0; i < cart.length; i++) {
        subtotal += cart[i].price * cart[i].quantity;
    }
    updatePriceSummary(subtotal);

    // Tab Switcher
    tabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            activeTab = tab.dataset.method;

            panels.forEach(panel => {
                if (panel.id === 'panel-' + activeTab) {
                    panel.classList.add('active-panel');
                } else {
                    panel.classList.remove('active-panel');
                }
            });

            validateForm();
        });
    });

    if (bankSelect && otherBankGroup) {
        bankSelect.addEventListener('change', function() {
            if (bankSelect.value === 'other') {
                otherBankGroup.style.display = 'flex';
            } else {
                otherBankGroup.style.display = 'none';
            }
            validateForm();
        });
    }

    // Error message helper
    function toggleError(inputEl, errorId, isValid, msg) {
        const errorEl = document.getElementById(errorId);
        if (!inputEl) return;

        if (!isValid && inputEl.value.trim().length > 0) {
            inputEl.classList.add('input-invalid');
            if (errorEl) {
                errorEl.textContent = msg;
                errorEl.classList.add('show-error');
            }
        } else {
            inputEl.classList.remove('input-invalid');
            if (errorEl) {
                errorEl.classList.remove('show-error');
            }
        }
    }

    // Master Form Validation
    function validateForm() {
        if (!payBtn) return;

        // 1. Email check
        const emailVal = emailInput ? emailInput.value.trim() : '';
        const emailOk = emailVal.includes('@') && emailVal.includes('.');
        toggleError(emailInput, 'emailError', emailOk, 'Please enter a valid email address.');

        const cartOk = getCartItems().length > 0;
        let tabOk = false;

        // 2. Active Tab Validation
        if (activeTab === 'cards') {
            const rawCard = cardNum ? cardNum.value.replace(/\D/g, '') : '';
            const cardOk = rawCard.length === 16; // STRICT 16 digits
            toggleError(cardNum, 'cardError', cardOk, 'Card number must be exactly 16 digits.');

            const expVal = cardExp ? cardExp.value.trim() : '';
            const expOk = /^(0[1-9]|1[0-2])\/\d{2}$/.test(expVal);
            toggleError(cardExp, 'expError', expOk, 'Format must be MM/YY.');

            const cvvVal = cardCvv ? cardCvv.value.trim() : '';
            const cvvOk = cvvVal.length === 3 && /^\d{3}$/.test(cvvVal); // STRICT 3 digits
            toggleError(cardCvv, 'cvvError', cvvOk, 'CVV must be 3 digits.');

            const zipVal = cardZip ? cardZip.value.trim() : '';
            const zipOk = zipVal.length === 6 && /^\d{6}$/.test(zipVal); // STRICT 6 digits
            toggleError(cardZip, 'zipError', zipOk, 'Zip code must be 6 digits.');

            tabOk = cardOk && expOk && cvvOk && zipOk;

        } else if (activeTab === 'crypto') {
            const selOk = cryptoSelect && cryptoSelect.value !== '';
            const txVal = cryptoTx ? cryptoTx.value.trim() : '';
            const txOk = txVal.length >= 8;
            toggleError(cryptoTx, 'cryptoError', txOk, 'Wallet address/TxID must be at least 8 characters.');

            tabOk = selOk && txOk;

        } else if (activeTab === 'bank') {
            if (bankSelect && bankSelect.value === 'other') {
                const otherVal = otherBankInput ? otherBankInput.value.trim() : '';
                const bankOk = otherVal.length >= 3;
                toggleError(otherBankInput, 'bankError', bankOk, 'Please enter bank name.');
                tabOk = bankOk;
            } else {
                tabOk = bankSelect && bankSelect.value !== '';
            }

        } else if (activeTab === 'upi') {
            const upiVal = upiInput ? upiInput.value.trim() : '';
            const upiOk = upiVal.includes('@') && upiVal.length >= 5;
            toggleError(upiInput, 'upiError', upiOk, 'Enter valid UPI ID (e.g. user@upi).');

            tabOk = upiOk;
        }

        // Enable or Disable Pay Now button
        if (emailOk && tabOk && cartOk) {
            payBtn.removeAttribute('disabled');
        } else {
            payBtn.setAttribute('disabled', 'true');
        }
    }

    // Add input event listeners to all fields
    const inputs = document.querySelectorAll('.form-input, .select-input');
    inputs.forEach(input => {
        input.addEventListener('input', validateForm);
        input.addEventListener('change', validateForm);
    });

    validateForm();

    // Simulated Payment Modal Trigger
    if (payBtn) {
        payBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (payBtn.hasAttribute('disabled')) return;

            // Generate Simulated Order Receipt
            const randomOrderId = '#NIKE-' + Math.floor(10000 + Math.random() * 90000);
            const totalAmountStr = document.querySelector('.total-val') ? document.querySelector('.total-val').textContent : '₹ 0';

            const modalOverlay = document.getElementById('paymentModal');
            const modalBody = document.getElementById('modalContent');

            if (modalOverlay && modalBody) {
                modalOverlay.classList.add('active-modal');

                // Step 1: Processing state
                modalBody.innerHTML = `
                    <div class="modal-spinner"><i class="fa-solid fa-circle-notch fa-spin"></i></div>
                    <h3 class="modal-title">Processing Payment...</h3>
                    <p style="font-size:0.85rem; color:var(--text-muted);">Communicating with simulated payment gateway.</p>
                `;

                // Step 2: Confirmation state after 2 seconds
                setTimeout(() => {
                    modalBody.innerHTML = `
                        <div style="font-size:3rem; color:var(--success-green); margin-bottom:0.5rem;">
                            <i class="fa-solid fa-circle-check"></i>
                        </div>
                        <h3 class="modal-title">Payment Successful!</h3>
                        <div class="modal-details">
                            <div><strong>Order ID:</strong> ${randomOrderId}</div>
                            <div><strong>Payment Method:</strong> ${activeTab.toUpperCase()}</div>
                            <div><strong>Amount Paid:</strong> ${totalAmountStr}</div>
                            <div><strong>Status:</strong> Approved</div>
                        </div>
                        <p style="font-size:0.8rem; color:var(--text-muted);">Redirecting to home page...</p>
                    `;

                    // Clear cart storage and redirect
                    localStorage.removeItem(CART_KEY);
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 2200);
                }, 2000);
            }
        });
    }
}