/**
 * ═══════════════════════════════════════════════════════════════
 * THE NASHVILLE — INTERACTIVE ONLINE ORDERING SYSTEM (`order.js`)
 * ═══════════════════════════════════════════════════════════════
 */

// Full 100% Halal American Menu Items
const MENU_ITEMS = [
  {
    id: 'smash-1',
    name: 'The Nashville Signature Smash',
    category: 'burgers',
    price: 7.99,
    desc: 'Double prime halal smashed beef patties, American cheddar, caramelized onions, pickles & secret Nashville hot glaze on brioche.',
    image: 'images/official_fudge_shake.png',
    badge: '🔥 Bestseller'
  },
  {
    id: 'smash-2',
    name: 'Classic Halal Double Smash',
    category: 'burgers',
    price: 6.99,
    desc: 'Two smashed beef patties with double melted aged cheddar, crisp shredded lettuce, tomato and house smash sauce.',
    image: 'images/official_fudge_shake.png',
    badge: null
  },
  {
    id: 'smash-3',
    name: 'Triple Melt Monster Smash',
    category: 'burgers',
    price: 9.49,
    desc: 'Three juicy smashed halal patties layered with triple cheddar, crispy halal beef rashers, jalapeños & smoky BBQ glaze.',
    image: 'images/official_fudge_shake.png',
    badge: "👨‍🍳 Chef's Special"
  },
  {
    id: 'smash-4',
    name: 'Truffle Mushroom Smash',
    category: 'burgers',
    price: 8.99,
    desc: 'Double smash patties topped with sautéed wild mushrooms, melted Swiss cheese & garlic truffle aioli on toasted brioche.',
    image: 'images/official_fudge_shake.png',
    badge: null
  },
  {
    id: 'sides-1',
    name: 'Nashville Hot Loaded Fries',
    category: 'sides',
    price: 5.49,
    desc: 'Crispy skin-on fries smothered in hot cheese dip, chopped spicy tender bits & jalapeños.',
    image: 'images/official_fudge_shake.png',
    badge: '🌶️ Spicy'
  },
  {
    id: 'sides-2',
    name: 'Cheesy Bacon Loaded Fries',
    category: 'sides',
    price: 5.99,
    desc: 'Golden skin-on fries topped with aged cheddar dip, crispy halal beef bacon bits and fresh spring onions.',
    image: 'images/official_fudge_shake.png',
    badge: null
  },
  {
    id: 'sides-3',
    name: 'Crispy Mozzarella Dippers (6 pcs)',
    category: 'sides',
    price: 4.49,
    desc: 'Hand-breaded mozzarella sticks with a gooey center, served with herb marinara dip.',
    image: 'images/official_fudge_shake.png',
    badge: null
  },
  {
    id: 'sides-4',
    name: 'Signature Smash Sauce Dip',
    category: 'sides',
    price: 1.20,
    desc: 'Our legendary house secret sauce, perfect for dipping crusty fries and burger bites.',
    image: 'images/official_fudge_shake.png',
    badge: null
  },
  {
    id: 'wings-1',
    name: 'Nashville Fiery Glazed Wings (6 pcs)',
    category: 'wings',
    price: 6.49,
    desc: 'Crispy halal chicken wings tossed in our signature Nashville cayenne honey glaze.',
    image: 'images/official_fudge_shake.png',
    badge: '🔥 Bestseller'
  },
  {
    id: 'wings-2',
    name: 'Smoky BBQ Wings (6 pcs)',
    category: 'wings',
    price: 5.99,
    desc: 'Tender wings glazed in rich hickory smoked BBQ sauce topped with toasted sesame seeds.',
    image: 'images/official_fudge_shake.png',
    badge: null
  },
  {
    id: 'combos-1',
    name: 'The Ultimate Nashville Box',
    category: 'combos',
    price: 13.99,
    desc: '1 Signature Smash Burger + Nashville Hot Loaded Fries + 3 Fiery Glazed Wings + 1 Ice Cold Drink.',
    image: 'images/official_fudge_shake.png',
    badge: '🔥 Bestseller'
  },
  {
    id: 'combos-2',
    name: 'Couples Feast Deal for 2',
    category: 'combos',
    price: 24.99,
    desc: 'Any 2 Smash Burgers + 2 Regular Fries + 6 Hot Wings + 2 Shakes or Craft Drinks.',
    image: 'images/official_fudge_shake.png',
    badge: '💎 Best Value'
  },
  {
    id: 'drinks-1',
    name: 'Hand-Spun Salted Caramel Shake',
    category: 'drinks',
    price: 4.99,
    desc: 'Rich vanilla bean gelato spun with salted caramel drizzle and fresh whipped cream.',
    image: 'images/official_fudge_shake.png',
    badge: null
  },
  {
    id: 'drinks-2',
    name: 'Double Chocolate Fudge Shake',
    category: 'drinks',
    price: 4.99,
    desc: 'Decadent Belgian chocolate gelato spun with fudge brownie bits.',
    image: 'images/official_fudge_shake.png',
    badge: null
  }
];

// State
let cart = JSON.parse(localStorage.getItem('nashville_cart')) || {};
let activeCategory = 'all';
let searchQuery = '';
let orderType = 'collection'; // 'collection' or 'delivery'
let discountRate = 0;
let liveProgressTimer = null;

// DOM Elements
const menuGrid = document.getElementById('menuGrid');
const categoryPills = document.querySelectorAll('.cat-pill');
const menuSearch = document.getElementById('menuSearch');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const categoryTitle = document.getElementById('categoryTitle');
const itemsCountShowing = document.getElementById('itemsCountShowing');
const noResults = document.getElementById('noResults');
const resetSearchBtn = document.getElementById('resetSearchBtn');

// Cart DOM
const openCartBtn = document.getElementById('openCartBtn');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const cartCount = document.getElementById('cartCount');
const cartTotalNav = document.getElementById('cartTotalNav');
const cdItemCount = document.getElementById('cdItemCount');
const cdItemsList = document.getElementById('cdItemsList');
const cartEmptyState = document.getElementById('cartEmptyState');
const summarySubtotal = document.getElementById('summarySubtotal');
const summaryDelivery = document.getElementById('summaryDelivery');
const summaryDiscount = document.getElementById('summaryDiscount');
const discountLine = document.getElementById('discountLine');
const summaryTotal = document.getElementById('summaryTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const startOrderingBtn = document.getElementById('startOrderingBtn');

// Promo & Order Type
const promoCodeInput = document.getElementById('promoCodeInput');
const applyPromoBtn = document.getElementById('applyPromoBtn');
const promoMessage = document.getElementById('promoMessage');
const orderTypeSwitch = document.getElementById('orderTypeSwitch');
const cdOrderNotice = document.getElementById('cdOrderNotice');

// Checkout Modal
const checkoutModalOverlay = document.getElementById('checkoutModalOverlay');
const closeModalBtn = document.getElementById('closeModalBtn');
const checkoutForm = document.getElementById('checkoutForm');
const modalPayTotal = document.getElementById('modalPayTotal');
const stepCustomerDetails = document.getElementById('stepCustomerDetails');
const stepOrderSuccess = document.getElementById('stepOrderSuccess');
const liveOrderId = document.getElementById('liveOrderId');
const trackerProgressBar = document.getElementById('trackerProgressBar');
const trackerStatusTitle = document.getElementById('trackerStatusTitle');
const trackerStatusSub = document.getElementById('trackerStatusSub');
const tsFinalLabel = document.getElementById('tsFinalLabel');
const receiptSummaryBox = document.getElementById('receiptSummaryBox');
const backToMenuSuccessBtn = document.getElementById('backToMenuSuccessBtn');

// Mobile Bar
const mobileCartBar = document.getElementById('mobileCartBar');
const mcbCount = document.getElementById('mcbCount');
const mcbTotal = document.getElementById('mcbTotal');
const mcbOpenBtn = document.getElementById('mcbOpenBtn');

// Toast
const toastPopup = document.getElementById('toastPopup');
const toastText = document.getElementById('toastText');

// ─── INITIALIZE ───
document.addEventListener('DOMContentLoaded', () => {
  renderMenu();
  updateCartUI();

  // Category Pills
  categoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      categoryPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCategory = pill.dataset.category;
      categoryTitle.textContent = pill.textContent.replace(/^.*? /, '') + (activeCategory === 'all' ? ' Items' : '');
      renderMenu();
    });
  });

  // Search
  menuSearch.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim().toLowerCase();
    clearSearchBtn.classList.toggle('hidden', searchQuery === '');
    renderMenu();
  });

  clearSearchBtn.addEventListener('click', () => {
    menuSearch.value = '';
    searchQuery = '';
    clearSearchBtn.classList.add('hidden');
    renderMenu();
  });

  resetSearchBtn.addEventListener('click', () => {
    menuSearch.value = '';
    searchQuery = '';
    clearSearchBtn.classList.add('hidden');
    activeCategory = 'all';
    categoryPills.forEach(p => p.classList.toggle('active', p.dataset.category === 'all'));
    categoryTitle.textContent = 'All Menu Items';
    renderMenu();
  });

  // Order Type Switcher
  const otsButtons = orderTypeSwitch.querySelectorAll('.ots-btn');
  otsButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      otsButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      orderType = btn.dataset.type;
      updateOrderNoticeUI();
      updateCartUI();
    });
  });

  // Cart Open/Close
  openCartBtn.addEventListener('click', openCart);
  if (mcbOpenBtn) mcbOpenBtn.addEventListener('click', openCart);
  closeCartBtn.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);
  startOrderingBtn.addEventListener('click', () => {
    closeCart();
    menuSearch.focus();
  });

  // Promo Code
  applyPromoBtn.addEventListener('click', applyPromo);
  promoCodeInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') applyPromo();
  });

  // Checkout
  checkoutBtn.addEventListener('click', openCheckoutModal);
  closeModalBtn.addEventListener('click', closeCheckoutModal);
  checkoutModalOverlay.addEventListener('click', (e) => {
    if (e.target === checkoutModalOverlay) closeCheckoutModal();
  });

  checkoutForm.addEventListener('submit', handlePlaceOrder);
  backToMenuSuccessBtn.addEventListener('click', () => {
    closeCheckoutModal();
    // clear cart after successful order continuation
    cart = {};
    saveCart();
    updateCartUI();
  });

  // Delivery Address Group toggle
  const payRadios = document.querySelectorAll('input[name="payMethod"]');
  payRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      document.querySelectorAll('.pay-option').forEach(op => op.classList.remove('active'));
      radio.closest('.pay-option').classList.add('active');
    });
  });
});

// ─── RENDER MENU ───
function renderMenu() {
  const filtered = MENU_ITEMS.filter(item => {
    const matchCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchSearch = !searchQuery ||
      item.name.toLowerCase().includes(searchQuery) ||
      item.desc.toLowerCase().includes(searchQuery) ||
      item.category.toLowerCase().includes(searchQuery);
    return matchCategory && matchSearch;
  });

  itemsCountShowing.textContent = `Showing ${filtered.length} item${filtered.length === 1 ? '' : 's'}`;

  if (filtered.length === 0) {
    menuGrid.classList.add('hidden');
    noResults.classList.remove('hidden');
    return;
  }

  menuGrid.classList.remove('hidden');
  noResults.classList.add('hidden');

  menuGrid.innerHTML = filtered.map(item => `
    <div class="menu-card" data-id="${item.id}">
      ${item.badge ? `<span class="mc-badge">${item.badge}</span>` : ''}
      <div class="mc-img-box">
        <img src="${item.image}" alt="${item.name}" loading="lazy" />
      </div>
      <div class="mc-content">
        <h3 class="mc-title">${item.name}</h3>
        <p class="mc-desc">${item.desc}</p>
        <div class="mc-foot">
          <span class="mc-price">£${item.price.toFixed(2)}</span>
          <button class="add-cart-btn" onclick="addToCart('${item.id}')">
            <span>+ Add</span>
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// ─── CART LOGIC ───
window.addToCart = function (id) {
  const item = MENU_ITEMS.find(i => i.id === id);
  if (!item) return;

  if (cart[id]) {
    cart[id].qty += 1;
  } else {
    cart[id] = { ...item, qty: 1 };
  }

  saveCart();
  updateCartUI();
  showToast(`Added ${item.name} to cart!`);
};

window.updateQty = function (id, delta) {
  if (!cart[id]) return;
  cart[id].qty += delta;
  if (cart[id].qty <= 0) {
    delete cart[id];
  }
  saveCart();
  updateCartUI();
};

function saveCart() {
  localStorage.setItem('nashville_cart', JSON.stringify(cart));
}

function updateCartUI() {
  const items = Object.values(cart);
  const totalItems = items.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.qty), 0);

  // Delivery fee
  let deliveryFee = 0;
  if (orderType === 'delivery') {
    deliveryFee = subtotal >= 25 ? 0 : 2.50;
  }

  const discountAmount = subtotal * discountRate;
  const total = Math.max(0, subtotal + deliveryFee - discountAmount);

  // Nav updates
  cartCount.textContent = totalItems;
  cartTotalNav.textContent = `£${total.toFixed(2)}`;
  cdItemCount.textContent = `${totalItems} item${totalItems === 1 ? '' : 's'}`;

  // Mobile bar
  if (totalItems > 0) {
    mobileCartBar.classList.remove('hidden');
    mcbCount.textContent = `${totalItems} item${totalItems === 1 ? '' : 's'}`;
    mcbTotal.textContent = `£${total.toFixed(2)}`;
  } else {
    mobileCartBar.classList.add('hidden');
  }

  // Cart Drawer items list
  if (items.length === 0) {
    cartEmptyState.classList.remove('hidden');
    // clear rendered items around it
    const renderedItems = cdItemsList.querySelectorAll('.cart-item');
    renderedItems.forEach(el => el.remove());
    checkoutBtn.disabled = true;
  } else {
    cartEmptyState.classList.add('hidden');
    checkoutBtn.disabled = false;

    // render items inside cdItemsList while keeping cartEmptyState DOM node
    const itemsHtml = items.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="ci-img" />
        <div class="ci-details">
          <h4 class="ci-name">${item.name}</h4>
          <span class="ci-price">£${(item.price * item.qty).toFixed(2)} (£${item.price.toFixed(2)} ea)</span>
        </div>
        <div class="ci-controls">
          <button class="ci-btn" onclick="updateQty('${item.id}', -1)">${item.qty === 1 ? '🗑️' : '−'}</button>
          <span class="ci-qty">${item.qty}</span>
          <button class="ci-btn" onclick="updateQty('${item.id}', 1)">+</button>
        </div>
      </div>
    `).join('');

    // replace children except empty state
    const renderedItems = cdItemsList.querySelectorAll('.cart-item');
    renderedItems.forEach(el => el.remove());
    cdItemsList.insertAdjacentHTML('afterbegin', itemsHtml);
  }

  // Summary figures
  summarySubtotal.textContent = `£${subtotal.toFixed(2)}`;
  if (orderType === 'collection') {
    summaryDelivery.textContent = 'FREE (Pickup)';
    summaryDelivery.style.color = 'var(--green)';
  } else {
    summaryDelivery.textContent = deliveryFee === 0 ? 'FREE (over £25)' : `£${deliveryFee.toFixed(2)}`;
    summaryDelivery.style.color = deliveryFee === 0 ? 'var(--green)' : 'var(--dark)';
  }

  if (discountRate > 0) {
    discountLine.classList.remove('hidden');
    summaryDiscount.textContent = `-£${discountAmount.toFixed(2)}`;
  } else {
    discountLine.classList.add('hidden');
  }

  summaryTotal.textContent = `£${total.toFixed(2)}`;
  modalPayTotal.textContent = `£${total.toFixed(2)}`;
}

function updateOrderNoticeUI() {
  const deliveryAddressGroup = document.getElementById('deliveryAddressGroup');
  if (orderType === 'collection') {
    cdOrderNotice.innerHTML = `
      <span class="cd-notice-icon">🛍️</span>
      <div class="cd-notice-text">
        <strong>Collection Order</strong>
        <small>Pickup at Griller Kitchens, 11E-11F, B6 4NG (Ready in 15-20 mins)</small>
      </div>
    `;
    if (deliveryAddressGroup) deliveryAddressGroup.classList.add('hidden');
  } else {
    cdOrderNotice.innerHTML = `
      <span class="cd-notice-icon">🛵</span>
      <div class="cd-notice-text">
        <strong>Delivery Order</strong>
        <small>Delivered from Griller Kitchens B6 4NG (£2.50 or FREE over £25)</small>
      </div>
    `;
    if (deliveryAddressGroup) deliveryAddressGroup.classList.remove('hidden');
  }
}

// ─── CART OPEN / CLOSE ───
function openCart() {
  cartDrawer.classList.add('open');
  cartOverlay.classList.add('open');
}

function closeCart() {
  cartDrawer.classList.remove('open');
  cartOverlay.classList.remove('open');
}

// ─── PROMO CODE ───
function applyPromo() {
  const code = promoCodeInput.value.trim().toUpperCase();
  if (!code) return;

  if (code === 'NASHVILLE10' || code === 'HALAL10' || code === 'BURGER10') {
    discountRate = 0.10; // 10% off
    promoMessage.textContent = '🎉 10% Discount applied successfully!';
    promoMessage.className = 'promo-message success';
    promoMessage.classList.remove('hidden');
    updateCartUI();
    showToast('Applied 10% promo discount!');
  } else {
    promoMessage.textContent = '❌ Invalid code. Try NASHVILLE10';
    promoMessage.className = 'promo-message';
    promoMessage.style.color = 'red';
    promoMessage.classList.remove('hidden');
  }
}

// ─── CHECKOUT MODAL ───
function openCheckoutModal() {
  closeCart();
  stepCustomerDetails.classList.remove('hidden');
  stepOrderSuccess.classList.add('hidden');
  checkoutModalOverlay.classList.add('open');
}

function closeCheckoutModal() {
  checkoutModalOverlay.classList.remove('open');
  if (liveProgressTimer) clearInterval(liveProgressTimer);
}

function handlePlaceOrder(e) {
  e.preventDefault();
  const name = document.getElementById('custName').value.trim();
  const phone = document.getElementById('custPhone').value.trim();

  if (!name || !phone) {
    alert('Please enter your Name and Phone Number to complete the order.');
    return;
  }

  // Switch to success tracker
  stepCustomerDetails.classList.add('hidden');
  stepOrderSuccess.classList.remove('hidden');

  const randomId = Math.floor(1000 + Math.random() * 9000);
  liveOrderId.textContent = `NSH-${randomId}`;

  // Populate receipt summary
  const items = Object.values(cart);
  const totalItems = items.reduce((sum, item) => sum + item.qty, 0);
  receiptSummaryBox.innerHTML = `
    <h4>Order Summary (${totalItems} items for ${orderType === 'collection' ? '🛍️ Collection' : '🛵 Delivery'})</h4>
    <p style="margin:4px 0;"><strong>Customer:</strong> ${name} • ${phone}</p>
    <p style="margin:4px 0;"><strong>Estimated ${orderType === 'collection' ? 'Ready Time' : 'Arrival'}:</strong> 15-20 Minutes</p>
    <hr style="border:none; border-top:1px solid rgba(0,0,0,0.1); margin:10px 0;" />
    ${items.map(i => `<p style="margin:4px 0; display:flex; justify-content:space-between;"><span>${i.qty}x ${i.name}</span><strong>£${(i.price * i.qty).toFixed(2)}</strong></p>`).join('')}
  `;

  // Start simulation of kitchen progress
  startKitchenTracker();
}

function startKitchenTracker() {
  if (liveProgressTimer) clearInterval(liveProgressTimer);

  tsFinalLabel.textContent = orderType === 'collection' ? 'Ready for Pickup' : 'Out for Delivery';

  const steps = [
    { width: '25%', title: '✅ Order Received by Kitchen', sub: 'We are prepping your halal patties & buns right now.', activeStep: 1 },
    { width: '50%', title: '🍳 Smashing on the Flat Top Grill', sub: 'Searing patties at 400°F for that ultimate caramelized crust.', activeStep: 2 },
    { width: '75%', title: '🔥 Glazing with Nashville Hot Sauce', sub: 'Dipping wings & burger layers in our secret signature glaze.', activeStep: 3 },
    { width: '100%', title: orderType === 'collection' ? '🛍️ Order Ready for Collection!' : '🛵 Order Out for Delivery!', sub: orderType === 'collection' ? 'Your hot box is waiting at Griller Kitchens, B6 4NG.' : 'Our driver is headed to your address with piping hot burgers!', activeStep: 4 }
  ];

  let currentIdx = 0;
  applyTrackerStep(steps[0]);

  liveProgressTimer = setInterval(() => {
    currentIdx++;
    if (currentIdx >= steps.length) {
      clearInterval(liveProgressTimer);
      return;
    }
    applyTrackerStep(steps[currentIdx]);
  }, 3500);
}

function applyTrackerStep(stepObj) {
  trackerProgressBar.style.width = stepObj.width;
  trackerStatusTitle.textContent = stepObj.title;
  trackerStatusSub.textContent = stepObj.sub;

  for (let i = 1; i <= 4; i++) {
    const tsEl = document.getElementById(`ts${i}`);
    if (i <= stepObj.activeStep) {
      tsEl.classList.add('active');
    } else {
      tsEl.classList.remove('active');
    }
  }
}

// ─── TOAST ───
let toastTimeout = null;
function showToast(msg) {
  toastText.textContent = msg;
  toastPopup.classList.add('show');
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toastPopup.classList.remove('show');
  }, 2800);
}
