// ============================================================
// CART DRAWER - shared across all pages
// ============================================================

function openCart() {
  renderCartDrawer();
  document.getElementById("cart-drawer").classList.add("open");
  document.getElementById("cart-overlay").classList.add("open");
}

function closeCart() {
  document.getElementById("cart-drawer").classList.remove("open");
  document.getElementById("cart-overlay").classList.remove("open");
}

function renderCartDrawer() {
  const list = document.getElementById("cart-items-list");
  const footer = document.getElementById("cart-footer");

  if (!cart.length) {
    list.innerHTML = `<div class="cart-empty"><div style="font-size:48px">🛒</div><p data-i18n="cart_empty">Keranjang kamu kosong</p><a href="search.html" onclick="closeCart()" class="btn-shop-now" data-i18n="cart_shop_now">Mulai Belanja</a></div>`;
    footer.style.display = "none";
    if (typeof applyTranslations === "function") applyTranslations();
    return;
  }

  footer.style.display = "block";
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const totalQty = cart.reduce((s, i) => s + i.qty, 0);

  list.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${formatPrice(item.price)}</div>
        <div class="cart-item-qty">
          <button onclick="updateCartQty(${item.id}, -1)">−</button>
          <span>${item.qty}</span>
          <button onclick="updateCartQty(${item.id}, 1)">+</button>
          <button class="cart-item-del" onclick="removeFromCart(${item.id})">🗑️</button>
        </div>
      </div>
    </div>`).join("");

  document.getElementById("cart-total-qty").textContent = totalQty + " item";
  document.getElementById("cart-total-price").textContent = formatPrice(total);
}

function updateCartQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  localStorage.setItem("bosnialine_cart", JSON.stringify(cart));
  updateCartBadge();
  renderCartDrawer();
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  localStorage.setItem("bosnialine_cart", JSON.stringify(cart));
  updateCartBadge();
  renderCartDrawer();
}

function goToCheckout() {
  if (!cart.length) return;
  closeCart();
  window.location.href = "checkout.html";
}

// Inject cart drawer HTML into body
document.addEventListener("DOMContentLoaded", () => {
  const drawerHTML = `
    <div class="cart-overlay" id="cart-overlay" onclick="closeCart()"></div>
    <div class="cart-drawer" id="cart-drawer">
      <div class="cart-drawer-header">
        <h3 data-i18n="cart_title">🛒 Keranjang Belanja</h3>
        <button class="cart-close-btn" onclick="closeCart()">✕</button>
      </div>
      <div class="cart-items-list" id="cart-items-list"></div>
      <div class="cart-footer" id="cart-footer" style="display:none">
        <div class="cart-summary-row">
          <span id="cart-total-qty">0 item</span>
          <span id="cart-total-price">Rp 0</span>
        </div>
        <button class="btn-checkout" onclick="goToCheckout()" data-i18n="cart_checkout">Lanjut ke Checkout →</button>
      </div>
    </div>`;
  document.body.insertAdjacentHTML("beforeend", drawerHTML);

  // Wire up all cart buttons in navbar
  document.querySelectorAll(".cart-trigger").forEach(btn => {
    btn.addEventListener("click", openCart);
  });

  updateCartBadge();
});

// ============================================================
// WHATSAPP LIVE CHAT FLOATING BUTTON
// ============================================================
(function injectWAButton() {
  const wa = document.createElement("a");
  wa.href = "https://wa.me/6285716444966?text=Halo%20BOSNIALine%2C%20saya%20ingin%20bertanya%20tentang%20produk";
  wa.target = "_blank";
  wa.rel = "noopener noreferrer";
  wa.id = "wa-float-btn";
  wa.title = "Chat via WhatsApp";
  wa.innerHTML = `
    <svg viewBox="0 0 32 32" width="28" height="28" fill="white">
      <path d="M16 2C8.268 2 2 8.268 2 16c0 2.49.648 4.83 1.78 6.86L2 30l7.34-1.74A13.94 13.94 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.5a11.44 11.44 0 0 1-5.83-1.6l-.42-.25-4.35 1.03 1.06-4.24-.27-.44A11.5 11.5 0 1 1 16 27.5zm6.29-8.6c-.34-.17-2.02-1-2.34-1.11-.32-.11-.55-.17-.78.17-.23.34-.9 1.11-1.1 1.34-.2.23-.4.26-.74.09-.34-.17-1.44-.53-2.74-1.69-1.01-.9-1.7-2.01-1.9-2.35-.2-.34-.02-.52.15-.69.15-.15.34-.4.51-.6.17-.2.23-.34.34-.57.11-.23.06-.43-.03-.6-.09-.17-.78-1.88-1.07-2.57-.28-.67-.57-.58-.78-.59h-.66c-.23 0-.6.09-.91.43-.31.34-1.19 1.16-1.19 2.83s1.22 3.28 1.39 3.51c.17.23 2.4 3.66 5.81 5.13.81.35 1.44.56 1.93.72.81.26 1.55.22 2.13.13.65-.1 2.02-.83 2.3-1.62.29-.8.29-1.48.2-1.62-.08-.14-.31-.23-.65-.4z"/>
    </svg>
    <span>Live Chat</span>`;
  document.body.appendChild(wa);

  // CSS injected inline so no extra file needed
  const style = document.createElement("style");
  style.textContent = `
    #wa-float-btn {
      position: fixed; bottom: 24px; right: 24px; z-index: 9999;
      background: #25d366;
      color: white; text-decoration: none;
      display: flex; align-items: center; gap: 8px;
      padding: 12px 18px 12px 14px;
      border-radius: 50px;
      box-shadow: 0 4px 20px rgba(37,211,102,0.45);
      font-size: 14px; font-weight: 700;
      transition: transform 0.2s, box-shadow 0.2s;
      animation: wa-pop 0.4s ease;
    }
    #wa-float-btn:hover {
      transform: scale(1.06);
      box-shadow: 0 6px 28px rgba(37,211,102,0.6);
    }
    @keyframes wa-pop {
      from { transform: scale(0.5); opacity: 0; }
      to   { transform: scale(1);   opacity: 1; }
    }
    @media (max-width: 480px) {
      #wa-float-btn span { display: none; }
      #wa-float-btn { padding: 14px; border-radius: 50%; }
    }
  `;
  document.head.appendChild(style);
})();
