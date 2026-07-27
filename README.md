# 👟 Nike Store Mini Project - Frontend Web Application

A responsive e-commerce web application for a sneaker store, developed as a Web Development frontend project using **HTML5**, **CSS3**, and plain **Vanilla JavaScript**.

---

## 📖 Overview of What I Built & Learned

In this project, I built a 4-page online shoe store consisting of:
1. **Homepage (`index.html`)**: Hero section with product showcase, service stats, and main store layout.
2. **Product Page (`product.html`)**: Interactive shoe details view with quantity controls, color selection, and smooth angle thumbnail switching.
3. **Shopping Cart Page (`cart.html`)**: Dynamic cart table showing added items, quantity adjustments (`+` / `-`), item removals, and promo code calculations.
4. **Checkout Page (`payment.html`)**: Multi-option payment setup supporting Cards, Crypto, Net Banking, and UPI with real-time error feedback and simulated payment processing.

---

## ⚙️ Key Technical Features

### 1. Dynamic LocalStorage Cart (Starts at 0)
- Used browser `localStorage` so items added on the product page remain saved across pages.
- The shopping cart starts at **0 items by default** and increases dynamically.
- Header cart counter badge updates across all pages automatically.

### 2. Multi-Tab Payment Validation & Text Error Messages
- Designed real-time input checks for 4 payment methods:
  - **Cards**: Enforces **16-digit card numbers**, **3-digit CVVs**, **6-digit zip codes**, and `MM/YY` expiry.
  - **Crypto**: Currency selection + minimum 8-character TxID/Wallet address.
  - **Net Banking**: Popular bank selection with custom bank name input for "Other".
  - **UPI**: Checks for valid UPI VPA format containing `@`.
- **User Feedback**: Explicit red error text messages (`<small class="error-text">`) appear directly under input fields when validation rules fail.
- **Pay Now Button**: Button remains disabled (`opacity: 0.45`) until the required fields in the active tab are valid and the cart contains items.

### 3. Smooth Product Gallery Image Transitions
- Clicking thumbnail views on `product.html` triggers a smooth CSS opacity/scale transition before swapping the main shoe image.

### 4. Realistic Payment Processing Simulation
- Clicking "Pay Now" triggers a simulated payment modal overlay with a loading spinner.
- Generates a simulated Order ID (e.g. `#NIKE-49120`), displays the paid amount, confirms transaction approval, and redirects to the home page while clearing the cart.

### 5. Fully Responsive Design
- Included media queries for tablet (`<992px`), mobile (`<768px`), and small screen phones (`<480px`) with a collapsible navigation drawer.

---

## 🛠️ File Structure
├── index.html # Homepage
├── product.html # Product display & thumbnail gallery
├── cart.html # Cart item table & order summary
├── payment.html # Payment checkout form & simulated gateway modal
├── style.css # Styling, mobile breakpoints & animation rules
├── script.js # Core Vanilla JS logic, cart state & form validation
└── README.md # Project documentation

---

## 🚀 How to Run
Open `index.html` in any web browser. No external packages or local web servers required.