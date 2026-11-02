// JENCY Atelier - Core Application Logic & State Management

(function () {
  "use strict";

  // Currency Exchange Rates (Base USD)
  const CURRENCIES = {
    USD: { symbol: "$", rate: 1.0, label: "USD ($)" },
    EUR: { symbol: "€", rate: 0.92, label: "EUR (€)" },
    GBP: { symbol: "£", rate: 0.79, label: "GBP (£)" },
    INR: { symbol: "₹", rate: 84.5, label: "INR (₹)" }
  };

  // State
  let state = {
    cart: JSON.parse(localStorage.getItem("jency_cart") || "[]"),
    wishlist: JSON.parse(localStorage.getItem("jency_wishlist") || "[]"),
    currentCategory: "all",
    searchQuery: "",
    sortBy: "featured",
    activeCurrency: localStorage.getItem("jency_currency") || "USD",
    appliedCoupon: JSON.parse(localStorage.getItem("jency_coupon") || "null"),
    freeShippingThreshold: 350
  };

  // Valid Coupons
  const PROMO_CODES = {
    "JENCY15": { discount: 0.15, label: "15% Private Atelier Privilege" },
    "WELCOME10": { discount: 0.10, label: "10% Inaugural Welcome" },
    "SUMMER20": { discount: 0.20, label: "20% High Summer Privilege" }
  };

  // Save to LocalStorage
  function saveState() {
    localStorage.setItem("jency_cart", JSON.stringify(state.cart));
    localStorage.setItem("jency_wishlist", JSON.stringify(state.wishlist));
    localStorage.setItem("jency_currency", state.activeCurrency);
    if (state.appliedCoupon) {
      localStorage.setItem("jency_coupon", JSON.stringify(state.appliedCoupon));
    } else {
      localStorage.removeItem("jency_coupon");
    }
  }

  // Currency Formatter
  function formatMoney(amountInUSD) {
    const cur = CURRENCIES[state.activeCurrency] || CURRENCIES.USD;
    const converted = amountInUSD * cur.rate;
    if (state.activeCurrency === "INR") {
      return cur.symbol + Math.round(converted).toLocaleString("en-IN");
    }
    return cur.symbol + converted.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  // Toast Notification System
  function showToast(title, message = "", type = "info") {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "toast-item flex items-center gap-3.5 bg-[#24201E] text-[#FAF7F2] px-5 py-3.5 rounded-full shadow-2xl border border-[#3D3531] text-xs sm:text-sm tracking-wide z-50 pointer-events-auto max-w-md";
    
    let iconSvg = `<svg class="w-4 h-4 text-[#C59B67] shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>`;
    if (type === "heart") {
      iconSvg = `<svg class="w-4 h-4 text-[#D8A48F] fill-current shrink-0" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
    } else if (type === "error") {
      iconSvg = `<svg class="w-4 h-4 text-red-400 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
    }

    toast.innerHTML = `
      ${iconSvg}
      <div class="flex flex-col">
        <span class="font-medium text-[#FAF7F2] font-serif tracking-normal text-sm">${title}</span>
        ${message ? `<span class="text-[#B5ABA1] text-[11px] font-sans">${message}</span>` : ""}
      </div>
      <button class="ml-auto text-[#B5ABA1] hover:text-white p-1" onclick="this.parentElement.remove()">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("removing");
      setTimeout(() => toast.remove(), 300);
    }, 4200);
  }

  // Update UI Badges (Cart & Wishlist counters)
  function updateBadges() {
    const totalCartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountEl = document.getElementById("cartCountBadge");
    if (cartCountEl) {
      cartCountEl.textContent = totalCartCount;
      cartCountEl.classList.toggle("opacity-0", totalCartCount === 0);
      cartCountEl.classList.toggle("scale-0", totalCartCount === 0);
    }

    const wishlistCount = state.wishlist.length;
    const wishlistCountEl = document.getElementById("wishlistCountBadge");
    if (wishlistCountEl) {
      wishlistCountEl.textContent = wishlistCount;
      wishlistCountEl.classList.toggle("opacity-0", wishlistCount === 0);
      wishlistCountEl.classList.toggle("scale-0", wishlistCount === 0);
    }
  }

  // Wishlist Toggle
  function toggleWishlist(productId) {
    const idx = state.wishlist.indexOf(productId);
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    if (idx > -1) {
      state.wishlist.splice(idx, 1);
      showToast("Removed from Wishlist", product ? product.name : "", "info");
    } else {
      state.wishlist.push(productId);
      showToast("Saved to Private Wishlist", product ? product.name : "", "heart");
    }
    saveState();
    updateBadges();
    renderProducts();
    renderWishlistDrawer();
  }

  // Add To Cart
  function addToCart(productId, selectedColor = null, selectedSize = null, quantity = 1) {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    if (!product) return;

    const color = selectedColor || (product.colors && product.colors[0] ? product.colors[0].name : "Standard");
    const size = selectedSize || (product.sizes && product.sizes[0] ? product.sizes[0] : "One Size");

    const existingIndex = state.cart.findIndex(
      item => item.id === productId && item.selectedColor === color && item.selectedSize === size
    );

    if (existingIndex > -1) {
      state.cart[existingIndex].quantity += quantity;
    } else {
      state.cart.push({
        id: productId,
        product: product,
        selectedColor: color,
        selectedSize: size,
        quantity: quantity
      });
    }

    saveState();
    updateBadges();
    renderCartDrawer();
    showToast("Added to Shopping Bag", `${product.name} (${size})`, "info");
    openCartDrawer();
  }

  // Cart Adjustments
  function updateCartQuantity(cartIndex, delta) {
    if (!state.cart[cartIndex]) return;
    state.cart[cartIndex].quantity += delta;
    if (state.cart[cartIndex].quantity <= 0) {
      state.cart.splice(cartIndex, 1);
      showToast("Item Removed from Bag");
    }
    saveState();
    updateBadges();
    renderCartDrawer();
  }

  function removeFromCart(cartIndex) {
    if (!state.cart[cartIndex]) return;
    state.cart.splice(cartIndex, 1);
    saveState();
    updateBadges();
    renderCartDrawer();
    showToast("Item Removed from Bag");
  }

  // Render Product Catalog
  function renderProducts() {
    const container = document.getElementById("productsGrid");
    if (!container) return;

    let filtered = PRODUCTS_DATA.filter(prod => {
      const matchCat = state.currentCategory === "all" || prod.category === state.currentCategory;
      const matchSearch = !state.searchQuery || 
        prod.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        prod.description.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        prod.categoryLabel.toLowerCase().includes(state.searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });

    // Sorting
    if (state.sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (state.sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (state.sortBy === "rating") {
      filtered.sort((a, b) => b.rating - a.rating);
    } else {
      // featured: bestsellers and new first
      filtered.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
    }

    const countLabel = document.getElementById("productsCountLabel");
    if (countLabel) {
      countLabel.textContent = `Displaying ${filtered.length} curated creations`;
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-20 text-center">
          <div class="w-16 h-16 rounded-full bg-[#F4EFEB] mx-auto flex items-center justify-center text-[#9C938C] mb-4">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </div>
          <h3 class="font-serif text-2xl text-[#24201E]">No creations found</h3>
          <p class="text-sm text-[#6B625C] mt-2">Try adjusting your filters or search keywords.</p>
          <button id="resetFiltersBtn" class="mt-5 px-6 py-2.5 text-xs uppercase tracking-widest bg-[#24201E] text-white rounded-full">Reset Filters</button>
        </div>
      `;
      const resetBtn = document.getElementById("resetFiltersBtn");
      if (resetBtn) {
        resetBtn.addEventListener("click", () => {
          state.currentCategory = "all";
          state.searchQuery = "";
          document.querySelectorAll(".filter-pill").forEach(p => p.classList.toggle("active", p.dataset.category === "all"));
          renderProducts();
        });
      }
      return;
    }

    container.innerHTML = filtered.map(product => {
      const isWishlisted = state.wishlist.includes(product.id);
      return `
        <article class="product-card group relative flex flex-col bg-[#FAF7F2] border border-[#E8DFD5]/70 rounded-2xl overflow-hidden transition-all duration-500 hover:border-[#C59B67]/50 hover:shadow-xl" data-id="${product.id}">
          <!-- Image Container -->
          <div class="img-zoom-container relative w-full aspect-[3/4] bg-[#F4EFEB] cursor-pointer overflow-hidden" onclick="window.JencyApp.openQuickView('${product.id}')">
            <img 
              src="${product.images[0]}" 
              alt="${product.name}" 
              loading="lazy"
              class="w-full h-full object-cover object-center"
            />
            
            <!-- Badges -->
            <div class="absolute top-3.5 left-3.5 flex flex-col gap-1.5 z-10">
              ${product.badge ? `<span class="px-3 py-1 bg-[#24201E]/85 backdrop-blur-md text-[#FAF7F2] text-[10px] font-sans tracking-widest uppercase rounded-full">${product.badge}</span>` : ""}
              ${product.originalPrice ? `<span class="px-2.5 py-1 bg-[#D8A48F] text-[#FAF7F2] text-[10px] font-medium tracking-wide rounded-full">Privilege Offer</span>` : ""}
            </div>

            <!-- Wishlist Heart Button -->
            <button 
              type="button"
              onclick="event.stopPropagation(); window.JencyApp.toggleWishlist('${product.id}')"
              aria-label="Save to Wishlist"
              class="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#24201E] hover:text-[#D8A48F] transition-all transform hover:scale-110 shadow-sm z-10"
            >
              <svg class="w-4 h-4 ${isWishlisted ? 'text-[#D8A48F] fill-current' : 'fill-none stroke-current stroke-[1.75]'}" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
              </svg>
            </button>

            <!-- Quick View Hover Pill -->
            <div class="absolute inset-x-4 bottom-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
              <button 
                type="button"
                onclick="event.stopPropagation(); window.JencyApp.openQuickView('${product.id}')"
                class="w-full py-2.5 bg-white/95 backdrop-blur-md text-[#24201E] text-xs font-medium tracking-wider uppercase rounded-full shadow-lg hover:bg-[#24201E] hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                Explore Details
              </button>
            </div>
          </div>

          <!-- Product Details -->
          <div class="p-5 flex flex-col flex-1 justify-between bg-white">
            <div>
              <div class="flex items-center justify-between text-[11px] text-[#9C938C] uppercase tracking-wider mb-1.5">
                <span>${product.categoryLabel}</span>
                <span class="flex items-center gap-1 text-[#C59B67]">
                  <svg class="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                  <span>${product.rating.toFixed(1)}</span>
                </span>
              </div>

              <h3 class="font-serif text-lg sm:text-xl text-[#24201E] font-medium leading-snug group-hover:text-[#C59B67] transition-colors cursor-pointer" onclick="window.JencyApp.openQuickView('${product.id}')">
                ${product.name}
              </h3>
              <p class="text-xs text-[#6B625C] line-clamp-1 mt-1 font-light">${product.subtitle}</p>

              <!-- Color dots preview -->
              <div class="flex items-center gap-1.5 mt-3">
                ${product.colors.map(c => `
                  <span class="w-3.5 h-3.5 rounded-full border border-black/15 shadow-inner" style="background-color: ${c.hex};" title="${c.name}"></span>
                `).join("")}
                <span class="text-[10px] text-[#9C938C] ml-1">${product.colors.length} hues</span>
              </div>
            </div>

            <!-- Price & Quick Add Button -->
            <div class="pt-4 mt-4 border-t border-[#F0E8DF] flex items-center justify-between">
              <div>
                <span class="text-base sm:text-lg font-serif font-semibold text-[#24201E]">${formatMoney(product.price)}</span>
                ${product.originalPrice ? `<span class="text-xs text-[#9C938C] line-through ml-1.5">${formatMoney(product.originalPrice)}</span>` : ""}
              </div>

              <button 
                type="button" 
                onclick="window.JencyApp.addToCart('${product.id}')"
                class="px-4 py-2 bg-[#24201E] hover:bg-[#C59B67] text-[#FAF7F2] text-xs font-medium uppercase tracking-wider rounded-full transition-all duration-300 flex items-center gap-1.5 shadow-sm"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                Bag
              </button>
            </div>
          </div>
        </article>
      `;
    }).join("");
  }

  // Quick View Modal Logic
  let activeQuickViewProduct = null;
  let selectedModalColor = null;
  let selectedModalSize = null;
  let selectedModalQty = 1;

  function openQuickView(productId) {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    if (!product) return;

    activeQuickViewProduct = product;
    selectedModalColor = product.colors[0]?.name || "Standard";
    selectedModalSize = product.sizes[0] || "One Size";
    selectedModalQty = 1;

    const modal = document.getElementById("quickViewModal");
    const content = document.getElementById("quickViewContent");
    if (!modal || !content) return;

    content.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8">
        <!-- Gallery Section -->
        <div class="flex flex-col gap-3">
          <div class="w-full aspect-[4/5] rounded-xl overflow-hidden bg-[#F4EFEB] relative">
            <img id="modalMainImage" src="${product.images[0]}" alt="${product.name}" class="w-full h-full object-cover object-center transition-all duration-300" />
            ${product.badge ? `<span class="absolute top-3 left-3 px-3 py-1 bg-[#24201E]/80 backdrop-blur-md text-[#FAF7F2] text-[10px] font-sans tracking-widest uppercase rounded-full">${product.badge}</span>` : ""}
          </div>
          <div class="flex gap-2.5 overflow-x-auto pb-1">
            ${product.images.map((img, i) => `
              <button type="button" onclick="document.getElementById('modalMainImage').src='${img}'" class="w-16 h-16 rounded-lg overflow-hidden border-2 border-transparent hover:border-[#C59B67] transition-all shrink-0">
                <img src="${img}" class="w-full h-full object-cover" />
              </button>
            `).join("")}
          </div>
        </div>

        <!-- Info & Actions -->
        <div class="flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between text-xs text-[#9C938C] uppercase tracking-wider mb-2">
              <span>${product.categoryLabel}</span>
              <div class="flex items-center gap-1 text-[#C59B67]">
                <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                <span class="font-medium text-[#24201E]">${product.rating.toFixed(1)}</span>
                <span class="text-[#9C938C]">(${product.reviewsCount} reviews)</span>
              </div>
            </div>

            <h2 class="font-serif text-2xl sm:text-3xl text-[#24201E] font-medium leading-tight">${product.name}</h2>
            <p class="text-xs text-[#6B625C] mt-1 font-light">${product.subtitle}</p>

            <div class="flex items-baseline gap-3 my-4">
              <span class="text-2xl font-serif font-bold text-[#24201E]">${formatMoney(product.price)}</span>
              ${product.originalPrice ? `<span class="text-sm text-[#9C938C] line-through">${formatMoney(product.originalPrice)}</span>` : ""}
              ${product.originalPrice ? `<span class="text-xs text-[#D8A48F] font-medium">Save ${formatMoney(product.originalPrice - product.price)}</span>` : ""}
            </div>

            <p class="text-xs sm:text-sm text-[#6B625C] leading-relaxed mb-5 font-light">${product.description}</p>

            <!-- Color Palette Selector -->
            <div class="mb-5">
              <label class="block text-xs uppercase tracking-wider font-medium text-[#24201E] mb-2.5">
                Selected Hue: <span id="modalColorLabel" class="text-[#6B625C] font-normal">${selectedModalColor}</span>
              </label>
              <div class="flex items-center gap-3" id="modalColorSwatches">
                ${product.colors.map((c, i) => `
                  <button 
                    type="button"
                    class="color-swatch w-7 h-7 rounded-full border border-black/20 transition-transform ${i === 0 ? 'selected ring-2 ring-[#24201E] ring-offset-2' : ''}" 
                    style="background-color: ${c.hex};"
                    onclick="window.JencyApp.selectModalColor('${c.name}', this)"
                    title="${c.name}"
                  ></button>
                `).join("")}
              </div>
            </div>

            <!-- Size Selector -->
            <div class="mb-5">
              <div class="flex items-center justify-between mb-2">
                <label class="text-xs uppercase tracking-wider font-medium text-[#24201E]">Measurement / Size</label>
                <button type="button" class="text-[11px] text-[#C59B67] underline hover:text-[#24201E]" onclick="alert('Atelier Sizing Guide:\\n\\nAll garments follow true-to-size European haute tailoring standards. Silk draping includes 1.5 inch ease for comfortable movement. For bespoke sizing inquiries, contact concierge@jency.atelier.')">Size Guide</button>
              </div>
              <div class="flex flex-wrap gap-2" id="modalSizePills">
                ${product.sizes.map((s, i) => `
                  <button 
                    type="button" 
                    onclick="window.JencyApp.selectModalSize('${s}', this)"
                    class="size-btn px-4 py-2 border border-[#E8DFD5] text-xs font-medium rounded-lg hover:border-[#24201E] transition-all ${i === 0 ? 'selected bg-[#24201E] text-white' : 'text-[#24201E]'}"
                  >
                    ${s}
                  </button>
                `).join("")}
              </div>
            </div>

            <!-- Artisan Bullet Highlights -->
            <div class="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E8DFD5]/70 mb-5">
              <h4 class="text-[11px] uppercase tracking-widest font-semibold text-[#24201E] mb-2">Craftsmanship & Atelier Notes</h4>
              <ul class="text-xs text-[#6B625C] space-y-1 font-light">
                ${product.details.map(d => `<li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-[#C59B67]"></span>${d}</li>`).join("")}
              </ul>
            </div>
          </div>

          <!-- Quantity & Add to Bag -->
          <div class="pt-4 border-t border-[#F0E8DF] flex items-center gap-3">
            <div class="flex items-center border border-[#E8DFD5] rounded-full px-3 py-1.5 bg-[#FAF7F2]">
              <button type="button" class="text-[#6B625C] hover:text-[#24201E] px-2 py-0.5 text-base" onclick="window.JencyApp.changeModalQty(-1)">-</button>
              <span id="modalQtyDisplay" class="px-2 text-xs font-medium text-[#24201E]">1</span>
              <button type="button" class="text-[#6B625C] hover:text-[#24201E] px-2 py-0.5 text-base" onclick="window.JencyApp.changeModalQty(1)">+</button>
            </div>

            <button 
              type="button"
              onclick="window.JencyApp.addModalToCart()"
              class="flex-1 py-3.5 px-6 bg-[#24201E] hover:bg-[#C59B67] text-[#FAF7F2] text-xs uppercase tracking-widest font-semibold rounded-full transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
              <span>Add to Shopping Bag</span>
            </button>

            <button 
              type="button" 
              onclick="window.JencyApp.toggleWishlist('${product.id}')"
              class="p-3 border border-[#E8DFD5] hover:border-[#24201E] rounded-full text-[#24201E] transition-colors"
              title="Save to Wishlist"
            >
              <svg class="w-5 h-5 ${state.wishlist.includes(product.id) ? 'text-[#D8A48F] fill-current' : 'fill-none stroke-current'}" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;

    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function closeQuickView() {
    const modal = document.getElementById("quickViewModal");
    if (modal) {
      modal.classList.add("hidden");
      document.body.style.overflow = "";
    }
  }

  function selectModalColor(colorName, btn) {
    selectedModalColor = colorName;
    const label = document.getElementById("modalColorLabel");
    if (label) label.textContent = colorName;
    document.querySelectorAll("#modalColorSwatches button").forEach(b => {
      b.classList.remove("selected", "ring-2", "ring-[#24201E]", "ring-offset-2");
    });
    btn.classList.add("selected", "ring-2", "ring-[#24201E]", "ring-offset-2");
  }

  function selectModalSize(sizeName, btn) {
    selectedModalSize = sizeName;
    document.querySelectorAll("#modalSizePills button").forEach(b => {
      b.classList.remove("selected", "bg-[#24201E]", "text-white");
      b.classList.add("text-[#24201E]");
    });
    btn.classList.add("selected", "bg-[#24201E]", "text-white");
  }

  function changeModalQty(delta) {
    selectedModalQty = Math.max(1, selectedModalQty + delta);
    const disp = document.getElementById("modalQtyDisplay");
    if (disp) disp.textContent = selectedModalQty;
  }

  function addModalToCart() {
    if (!activeQuickViewProduct) return;
    addToCart(activeQuickViewProduct.id, selectedModalColor, selectedModalSize, selectedModalQty);
    closeQuickView();
  }

  // Drawers Controls
  function openCartDrawer() {
    const drawer = document.getElementById("cartDrawer");
    if (drawer) {
      renderCartDrawer();
      drawer.classList.remove("pointer-events-none");
      const backdrop = drawer.querySelector(".drawer-backdrop");
      const panel = drawer.querySelector(".drawer-panel");
      if (backdrop) backdrop.classList.remove("opacity-0");
      if (panel) panel.classList.remove("translate-x-full");
      document.body.style.overflow = "hidden";
    }
  }

  function closeCartDrawer() {
    const drawer = document.getElementById("cartDrawer");
    if (drawer) {
      const backdrop = drawer.querySelector(".drawer-backdrop");
      const panel = drawer.querySelector(".drawer-panel");
      if (backdrop) backdrop.classList.add("opacity-0");
      if (panel) panel.classList.add("translate-x-full");
      setTimeout(() => {
        drawer.classList.add("pointer-events-none");
        document.body.style.overflow = "";
      }, 350);
    }
  }

  function openWishlistDrawer() {
    const drawer = document.getElementById("wishlistDrawer");
    if (drawer) {
      renderWishlistDrawer();
      drawer.classList.remove("pointer-events-none");
      const backdrop = drawer.querySelector(".drawer-backdrop");
      const panel = drawer.querySelector(".drawer-panel");
      if (backdrop) backdrop.classList.remove("opacity-0");
      if (panel) panel.classList.remove("translate-x-full");
      document.body.style.overflow = "hidden";
    }
  }

  function closeWishlistDrawer() {
    const drawer = document.getElementById("wishlistDrawer");
    if (drawer) {
      const backdrop = drawer.querySelector(".drawer-backdrop");
      const panel = drawer.querySelector(".drawer-panel");
      if (backdrop) backdrop.classList.add("opacity-0");
      if (panel) panel.classList.add("translate-x-full");
      setTimeout(() => {
        drawer.classList.add("pointer-events-none");
        document.body.style.overflow = "";
      }, 350);
    }
  }

  // Render Shopping Bag Drawer Contents
  function renderCartDrawer() {
    const itemsContainer = document.getElementById("cartItemsList");
    const summaryContainer = document.getElementById("cartSummarySection");
    const freeShippingProgress = document.getElementById("freeShippingProgress");
    const freeShippingText = document.getElementById("freeShippingText");
    const emptyState = document.getElementById("cartEmptyState");

    if (!itemsContainer) return;

    const subtotal = state.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    // Free shipping calculation
    const remaining = Math.max(0, state.freeShippingThreshold - subtotal);
    const progressPercent = Math.min(100, Math.round((subtotal / state.freeShippingThreshold) * 100));

    if (freeShippingProgress) {
      freeShippingProgress.style.width = `${progressPercent}%`;
    }
    if (freeShippingText) {
      if (remaining <= 0) {
        freeShippingText.innerHTML = `✨ <strong>Complimentary Express Courier</strong> applied to your order!`;
      } else {
        freeShippingText.innerHTML = `Add <strong>${formatMoney(remaining)}</strong> more to receive complimentary global express courier.`;
      }
    }

    if (state.cart.length === 0) {
      itemsContainer.innerHTML = "";
      if (emptyState) emptyState.classList.remove("hidden");
      if (summaryContainer) summaryContainer.classList.add("hidden");
      return;
    }

    if (emptyState) emptyState.classList.add("hidden");
    if (summaryContainer) summaryContainer.classList.remove("hidden");

    // Items list
    itemsContainer.innerHTML = state.cart.map((item, index) => {
      const lineTotal = item.product.price * item.quantity;
      return `
        <div class="flex gap-4 py-4 border-b border-[#F0E8DF] items-center">
          <img src="${item.product.images[0]}" alt="${item.product.name}" class="w-18 h-22 w-20 h-24 object-cover rounded-lg bg-[#F4EFEB] shrink-0" />
          <div class="flex-1 flex flex-col justify-between">
            <div class="flex justify-between items-start gap-2">
              <div>
                <h4 class="font-serif text-sm font-medium text-[#24201E] line-clamp-1">${item.product.name}</h4>
                <p class="text-[11px] text-[#6B625C] mt-0.5">${item.selectedColor} • ${item.selectedSize}</p>
              </div>
              <button type="button" onclick="window.JencyApp.removeFromCart(${index})" class="text-[#9C938C] hover:text-red-600 transition-colors p-1" title="Remove">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>
            </div>

            <div class="flex items-center justify-between mt-3">
              <div class="flex items-center border border-[#E8DFD5] rounded-full bg-[#FAF7F2] px-2 py-0.5">
                <button type="button" class="text-[#6B625C] hover:text-[#24201E] px-1.5 text-xs font-semibold" onclick="window.JencyApp.updateCartQuantity(${index}, -1)">-</button>
                <span class="text-xs font-medium px-2 text-[#24201E]">${item.quantity}</span>
                <button type="button" class="text-[#6B625C] hover:text-[#24201E] px-1.5 text-xs font-semibold" onclick="window.JencyApp.updateCartQuantity(${index}, 1)">+</button>
              </div>

              <span class="text-sm font-serif font-medium text-[#24201E]">${formatMoney(lineTotal)}</span>
            </div>
          </div>
        </div>
      `;
    }).join("");

    // Calculate totals
    const discountRate = state.appliedCoupon ? state.appliedCoupon.discount : 0;
    const discountAmount = subtotal * discountRate;
    const shipping = subtotal >= state.freeShippingThreshold ? 0 : 25;
    const finalTotal = subtotal - discountAmount + shipping;

    const subtotalEl = document.getElementById("cartSubtotal");
    const discountEl = document.getElementById("cartDiscount");
    const shippingEl = document.getElementById("cartShipping");
    const totalEl = document.getElementById("cartTotal");
    const couponRow = document.getElementById("cartCouponRow");
    const couponNameEl = document.getElementById("appliedCouponName");

    if (subtotalEl) subtotalEl.textContent = formatMoney(subtotal);
    if (totalEl) totalEl.textContent = formatMoney(finalTotal);
    if (shippingEl) shippingEl.textContent = shipping === 0 ? "Complimentary" : formatMoney(shipping);

    if (couponRow && couponNameEl && discountEl) {
      if (state.appliedCoupon) {
        couponRow.classList.remove("hidden");
        couponNameEl.textContent = `${state.appliedCoupon.code} (${Math.round(state.appliedCoupon.discount * 100)}% Off)`;
        discountEl.textContent = `-${formatMoney(discountAmount)}`;
      } else {
        couponRow.classList.add("hidden");
      }
    }
  }

  // Apply Coupon
  function applyCoupon(code) {
    const cleanCode = (code || "").trim().toUpperCase();
    if (PROMO_CODES[cleanCode]) {
      state.appliedCoupon = {
        code: cleanCode,
        discount: PROMO_CODES[cleanCode].discount,
        label: PROMO_CODES[cleanCode].label
      };
      saveState();
      renderCartDrawer();
      showToast("Privilege Code Applied", PROMO_CODES[cleanCode].label, "info");
    } else {
      showToast("Invalid Privilege Code", "Please verify and try again.", "error");
    }
  }

  function removeCoupon() {
    state.appliedCoupon = null;
    saveState();
    renderCartDrawer();
    showToast("Privilege Code Removed");
  }

  // Render Wishlist Drawer
  function renderWishlistDrawer() {
    const list = document.getElementById("wishlistItemsList");
    const emptyState = document.getElementById("wishlistEmptyState");
    if (!list) return;

    const wishlistedProducts = PRODUCTS_DATA.filter(p => state.wishlist.includes(p.id));

    if (wishlistedProducts.length === 0) {
      list.innerHTML = "";
      if (emptyState) emptyState.classList.remove("hidden");
      return;
    }

    if (emptyState) emptyState.classList.add("hidden");

    list.innerHTML = wishlistedProducts.map(product => {
      return `
        <div class="flex gap-4 py-4 border-b border-[#F0E8DF] items-center">
          <img src="${product.images[0]}" alt="${product.name}" class="w-20 h-24 object-cover rounded-lg bg-[#F4EFEB] shrink-0" />
          <div class="flex-1 flex flex-col justify-between">
            <div class="flex justify-between items-start gap-2">
              <div>
                <h4 class="font-serif text-sm font-medium text-[#24201E] line-clamp-1">${product.name}</h4>
                <p class="text-[11px] text-[#9C938C] uppercase tracking-wider">${product.categoryLabel}</p>
                <p class="text-sm font-serif font-semibold text-[#24201E] mt-1">${formatMoney(product.price)}</p>
              </div>
              <button type="button" onclick="window.JencyApp.toggleWishlist('${product.id}')" class="text-[#9C938C] hover:text-red-600 transition-colors p-1" title="Remove">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <div class="mt-3 flex gap-2">
              <button 
                type="button" 
                onclick="window.JencyApp.addToCart('${product.id}'); window.JencyApp.toggleWishlist('${product.id}');"
                class="flex-1 py-1.5 px-3 bg-[#24201E] hover:bg-[#C59B67] text-[#FAF7F2] text-[11px] uppercase tracking-wider rounded-full transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Move to Bag</span>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");
  }

  // Checkout Modal Simulation
  function openCheckoutModal() {
    if (state.cart.length === 0) {
      showToast("Your Shopping Bag is empty", "Add creations before checkout.", "error");
      return;
    }
    closeCartDrawer();

    const checkoutModal = document.getElementById("checkoutModal");
    if (!checkoutModal) return;

    // Render Order Review Summary in Checkout
    const subtotal = state.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const discountRate = state.appliedCoupon ? state.appliedCoupon.discount : 0;
    const discountAmount = subtotal * discountRate;
    const shipping = subtotal >= state.freeShippingThreshold ? 0 : 25;
    const total = subtotal - discountAmount + shipping;

    const summaryList = document.getElementById("checkoutSummaryList");
    if (summaryList) {
      summaryList.innerHTML = state.cart.map(item => `
        <div class="flex items-center justify-between text-xs py-2 border-b border-[#F0E8DF]">
          <div class="flex items-center gap-2">
            <span class="w-5 h-5 rounded-full bg-[#24201E] text-white flex items-center justify-center text-[10px] font-sans">${item.quantity}</span>
            <span class="text-[#24201E] line-clamp-1 max-w-[160px]">${item.product.name}</span>
          </div>
          <span class="font-serif text-[#24201E]">${formatMoney(item.product.price * item.quantity)}</span>
        </div>
      `).join("");
    }

    const modalTotal = document.getElementById("checkoutFinalTotal");
    if (modalTotal) modalTotal.textContent = formatMoney(total);

    // Reset checkout form view
    document.getElementById("checkoutFormStep").classList.remove("hidden");
    document.getElementById("checkoutSuccessStep").classList.add("hidden");

    checkoutModal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function closeCheckoutModal() {
    const checkoutModal = document.getElementById("checkoutModal");
    if (checkoutModal) {
      checkoutModal.classList.add("hidden");
      document.body.style.overflow = "";
    }
  }

  function completeOrder(event) {
    if (event) event.preventDefault();

    // Generate random order id
    const orderNumber = "JCY-" + Math.floor(100000 + Math.random() * 900000);
    const orderTotal = document.getElementById("checkoutFinalTotal")?.textContent || "$0";

    document.getElementById("orderReferenceBadge").textContent = `Order Reference: ${orderNumber}`;
    document.getElementById("orderTotalConfirmation").textContent = orderTotal;

    // Transition view
    document.getElementById("checkoutFormStep").classList.add("hidden");
    document.getElementById("checkoutSuccessStep").classList.remove("hidden");

    // Clear cart state
    state.cart = [];
    state.appliedCoupon = null;
    saveState();
    updateBadges();
    renderCartDrawer();

    showToast("Order Confirmed with JENCY Atelier", `Confirmation #${orderNumber}`, "info");
  }

  // Setup Event Listeners
  function init() {
    updateBadges();
    renderProducts();

    // Category filter pills
    document.querySelectorAll(".filter-pill").forEach(pill => {
      pill.addEventListener("click", () => {
        document.querySelectorAll(".filter-pill").forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        state.currentCategory = pill.dataset.category;
        renderProducts();
      });
    });

    // Sorting Dropdown
    const sortSelect = document.getElementById("sortSelector");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        state.sortBy = e.target.value;
        renderProducts();
      });
    }

    // Live Search Input in Top Bar
    const searchInputs = document.querySelectorAll(".jency-search-input");
    searchInputs.forEach(input => {
      input.addEventListener("input", (e) => {
        state.searchQuery = e.target.value;
        renderProducts();
      });
    });

    // Currency Selector
    const currencySelectors = document.querySelectorAll(".currency-picker");
    currencySelectors.forEach(select => {
      select.value = state.activeCurrency;
      select.addEventListener("change", (e) => {
        state.activeCurrency = e.target.value;
        saveState();
        renderProducts();
        renderCartDrawer();
        renderWishlistDrawer();
        showToast("Currency Updated", `Prices displayed in ${state.activeCurrency}`, "info");
      });
    });

    // Coupon form submission
    const couponForm = document.getElementById("cartCouponForm");
    if (couponForm) {
      couponForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = document.getElementById("cartCouponInput");
        if (input) {
          applyCoupon(input.value);
          input.value = "";
        }
      });
    }

    // VIP Newsletter Form
    const newsletterForm = document.getElementById("newsletterForm");
    if (newsletterForm) {
      newsletterForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const emailInput = document.getElementById("newsletterEmail");
        if (emailInput && emailInput.value) {
          showToast("Welcome to the JENCY Circle", "Use code JENCY15 for 15% off your inaugural order.", "info");
          emailInput.value = "";
          // Auto fill coupon into cart if empty
          if (!state.appliedCoupon) {
            applyCoupon("JENCY15");
          }
        }
      });
    }

    // Checkout Form
    const checkoutForm = document.getElementById("checkoutActualForm");
    if (checkoutForm) {
      checkoutForm.addEventListener("submit", completeOrder);
    }
  }

  // Public Interface for Inline HTML event handlers
  window.JencyApp = {
    state,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    toggleWishlist,
    openQuickView,
    closeQuickView,
    selectModalColor,
    selectModalSize,
    changeModalQty,
    addModalToCart,
    openCartDrawer,
    closeCartDrawer,
    openWishlistDrawer,
    closeWishlistDrawer,
    openCheckoutModal,
    closeCheckoutModal,
    applyCoupon,
    removeCoupon,
    completeOrder,
    formatMoney
  };

  document.addEventListener("DOMContentLoaded", init);
})();

