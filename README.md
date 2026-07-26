# 👟 Nike Store - CSS Mini Project

A sleek, responsive, and modern 4-page E-Commerce web application for a sneaker store built purely with **HTML5** and **CSS3**. This project strictly adheres to modern frontend industry standards, featuring a unified red theme, responsive Flexbox and Grid layouts, and custom UI components.

---

## 🚀 Live Demo & Page Walkthrough

The project consists of 4 main interconnected pages:

1. **Landing Page (`index.html`)**
   - Navigation header with brand logo, quick menu links, search bar, shopping cart counter badge, and user profile avatar.
   - Hero section featuring product headline, short description, interactive "Shop Now" button, and high-impact sneaker showcase image.
   - Service overview achievements banner displaying reviews, customer stats, quality assurance, and rating highlights.

2. **Product Display Page (`product.html`)**
   - Breadcrumb navigation path at the top (`Product > Nike Air Max Alpha Trainer 5`).
   - Main shoe section with single-color selector (Red), main product image, short description, and price in Indian Rupees (₹).
   - Quantity selector dropdown menu and custom styled action buttons:
     - **Add to Cart**: White background, red border, red text.
     - **Buy Now**: Red background, white border, white text.
   - Horizontal scrolling image gallery displaying **7 different angle views** of the sneaker.

3. **Shopping Cart Page (`cart.html`)**
   - Itemized table displaying selected shoe, color meta, quantity, unit price calculation, and removal button.
   - Order summary card with coupon code input field, tax/discount breakdown (18% GST applied), and total sum.
   - Links to continue shopping and secure checkout with Razorpay trust badges.

4. **Payment & Checkout Page (`payment.html`)**
   - Checkout header and contact details input field for Customer Email ID.
   - Multi-option payment tab selector (Pay via Cards, Crypto, Bank, or UPI).
   - Credit/Debit card form fields (Card Number, Expiry, CVV, Country, and Zip Code).
   - Live Order Summary review card with instant "Pay Now" action button and 100% secure payment trust badges.

---

## 📁 File Structure
├── index.html # Landing page / Homepage<br>
├── product.html # Product details & image gallery page<br>
├── cart.html # Shopping cart & coupon page<br>
├── payment.html # Payment checkout page<br>
├── style.css # Unified master CSS stylesheet for all 4 pages<br>
└── README.md # Project documentation<br>

---

## 🛠️ Built With

* **HTML5**: Semantic tags (`<header>`, `<nav>`, `<main>`, `<section>`, `<table>`, etc.)
* **CSS3**: CSS Flexbox, Grid, CSS Custom Properties (`:root` variables), custom scrollbars, and media queries for responsiveness.
* **Font Awesome (v6.4.0)**: Modern vector icons for UI elements.
* **Google Fonts**: `Montserrat` for headers and `Poppins` for body typography.

---

## 💻 How to Run the Project

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Manav0502/EcommerceFrontend-Sneaker.git
   ```
2. **Open the project folder** and launch `index.html` directly in any modern browser (Chrome, Firefox, Edge).
3. **Navigate** through all 4 pages using the navbar links and action buttons.

> **Note:** No build tools, bundlers, or local server are required — this is a pure HTML + CSS project.