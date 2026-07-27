# 👟 Nike Store - Frontend E-Commerce Web Application

A fully responsive, interactive 4-page frontend web application for a sneaker web store. Built with **HTML5**, **CSS3**, and clean **Vanilla JavaScript**.

---

## 🌟 Key Features & Interactivity

### 1. Dynamic Shopping Cart & State Persistence
- **Global LocalStorage State**: Add items on the Product page, modify quantities in the Cart, and view totals seamlessly across all pages.
- **Real-time Badge Counter**: The shopping cart counter badge in the header dynamically updates and animates whenever items are added or removed.
- **Dynamic Line-Item Adjustments**: Increment (`+`), decrement (`-`), or remove items from the cart table with instant price recalculation.

### 2. Animated Sliding Navbar Underline
- Built an interactive sliding pill indicator (`.nav-indicator`) in Vanilla JS that smoothly slides under active and hovered navigation links.

### 3. Tactile Micro-Interactions & Button Animations
- Active scale compression (`transform: scale(0.96)`) on clicks.
- Hover lift elevations and custom button glow shadows for `Shop Now`, `Add to Cart`, `Buy Now`, and `Pay Now`.

### 4. Smart Checkout Form Validation
- On `payment.html`, the "Pay Now" button remains **disabled and faded (45% opacity)** until valid formats are entered for:
  - Email Address
  - Card Number (min 15 digits)
  - Expiry Date (`MM/YY` format)
  - CVV (3+ digits)
  - Zip Code (5+ digits)
- Once all mandatory fields pass validation, the button activates with an animated pulse ring.

### 5. Interactive Product Gallery & Promo Engine
- Clickable sneaker thumbnails in `product.html` instantly swap the primary featured product view.
- Promo code input accepts codes such as `NIKE10` or `SAVE200`, automatically recalculating Subtotal, 18% GST tax, and net discounts.

---

## 🛠️ Project Structure
├──index.html # Landing page with Hero section and brand overview
├── product.html # Detailed product display, quantity controls & thumbnail gallery
├── cart.html # Interactive cart table, coupon application & price breakdown
├── payment.html # Live validation checkout form and payment tab selector
├── style.css # Master stylesheet with root CSS variables & responsive design
├── script.js # Core Vanilla JS logic for state, form validation & UI effects
└── README.md # Technical documentation

---

## 🚀 How to Run Locally

1. Clone or download this project repository.
2. Open `index.html` directly in any web browser (Chrome, Safari, Firefox, Edge).
3. No build tools, Node modules, or external web servers are required.

---

## 💻 Tech Stack

- HTML5 (Semantic Structure)
- CSS3 (Flexbox, Grid, CSS Variables, Custom Scrollbars, Animations)
- Vanilla JavaScript (ES6+)
- Font Awesome 6.4.0 (Icons)
- Google Fonts: `Montserrat` & `Poppins`

---

## 🔗 Demo Links

- **Live Deployment**: [nikestore-mini-project.vercel.app](https://nikestore-mini-project.vercel.app/)
- **GitHub Repo**: [github.com/Manav0502/EcommerceFrontend-Sneaker](https://github.com/Manav0502/EcommerceFrontend-Sneaker)   