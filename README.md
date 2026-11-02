# JENCY — Maison de Luxe & Haute Living

A luxury e-commerce boutique web application designed with a warm pastel aesthetic, editorial typography, and micro-interactions.

---

## 🌟 Key Highlights

- **Aesthetic Direction**: Warm ivory cream (`#FAF7F2`), champagne gold accents (`#C59B67`), blush terracotta (`#D8A48F`), and rich espresso typography (`#24201E`).
- **Typography**: Cormorant Garamond (Editorial Serif) paired with Plus Jakarta Sans (Clean Modern Sans-Serif).
- **Architecture**: Zero-build pure modern web app (HTML5, Tailwind CSS, Vanilla JavaScript, CSS3 animations). Runs instantaneously in any browser without needing `npm install` or bundlers.

---

## ✨ Features & User Experience

1. **Editorial Hero & Announcement Ticker**:
   - Live promotional top bar with multi-currency selector (**USD, EUR, GBP, INR**).
   - Dynamic marquee ticker celebrating artisan heritage.
   - Editorial hero section featuring lookbook previews and atelier proof points.

2. **Interactive Product Catalog**:
   - Filter creations by universe: *Haute Couture, Fine Jewelry, Leather Goods, Accessories, Living & Scent*.
   - Live search filter across titles, descriptions, and materials.
   - Sorting by *Curated/Bestsellers, Price (Low to High), Price (High to Low)*, and *Customer Rating*.
   - Hover zoom effect, wishlist bookmarking, and quick add buttons.

3. **Quick View Atelier Modal**:
   - Interactive multi-image gallery switcher.
   - Live color palette swatch selector.
   - Size/measurement picker with sizing guide modal note.
   - Quantity selector & immediate bag dispatch.

4. **Slide-Over Shopping Bag (Cart)**:
   - Live subtotal and order calculation.
   - Dynamic Free Express Courier progress bar (updates live as items are added).
   - Quantity increment/decrement/removal controls.
   - Privilege Coupon Code system:
     - `JENCY15` — 15% Private Privilege
     - `WELCOME10` — 10% Inaugural Welcome
     - `SUMMER20` — 20% High Summer Privilege

5. **Slide-Over Wishlist**:
   - Bookmark favorite creations with heart animation.
   - One-click "Move to Bag" functionality.
   - Persistent across browser refreshes via `localStorage`.

6. **Luxury Checkout Simulation**:
   - Private client address entry form.
   - Live order recap preview.
   - Instant order authorization screen with unique order tracking reference (e.g. `JCY-882910`).

7. **VIP Atelier Circle Newsletter**:
   - VIP newsletter sign-up with immediate toast feedback and promotional discount unlock.

---

## 🚀 How to Launch and Preview

### Option 1: Direct Browser Launch
Simply double-click `index.html` or open it with your favorite browser:
```bash
# In Windows PowerShell:
Start-Process .\index.html
```

### Option 2: Local HTTP Server (Python / Node / Live Server)
If you prefer running a local development server:
```bash
# Using Python:
python -m http.server 8000

# Or using npx:
npx serve .
```
Then visit `http://localhost:8000` in your web browser.

---

## 📁 Project Structure

```
SIH/
├── index.html        # Main luxury boutique storefront & modals
├── css/
│   └── styles.css    # Custom luxury styles, animations & typography
├── js/
│   ├── products.js   # Curated product catalog & story data
│   └── app.js        # State management (Cart, Wishlist, Currency, Filters)
└── README.md         # Documentation & guide
```

