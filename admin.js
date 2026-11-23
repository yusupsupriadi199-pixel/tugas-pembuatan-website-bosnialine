// Admin Panel Logic
let adminProducts = JSON.parse(localStorage.getItem("bosnialine_products") || "null");
if (!adminProducts) {
  adminProducts = [...products];
  saveToStorage();
}

let deleteTargetId = null;

function saveToStorage() {
  localStorage.setItem("bosnialine_products", JSON.stringify(adminProducts));
}

function showTab(name) {
  document.querySelectorAll(".tab-content").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".menu-item").forEach(m => m.classList.remove("active"));
  document.getElementById("tab-" + name).classList.add("active");
  document.querySelectorAll(".menu-item")[["daftar","tambah","pesanan","statistik"].indexOf(name)].classList.add("active");
  if (name === "daftar") renderTable();
  if (name === "pesanan") renderOrdersTable();
  if (name === "statistik") renderStats();
}

function renderTable() {
  const q = (document.getElementById("admin-search")?.value || "").toLowerCase();
  const filtered = adminProducts.filter(p => p.name.toLowerCase().includes(q) || p.category.includes(q));
  const tbody = document.getElementById("product-table-body");
  tbody.innerHTML = filtered.map(p => `
    <tr>
      <td><img src="${p.image}" alt="${p.name}" class="table-img"></td>
      <td><strong>${p.name}</strong></td>
      <td><span class="cat-tag">${p.category}</span></td>
      <td>${formatPrice(p.price)}</td>
      <td><span class="${p.stock < 10 ? 'stock-low' : 'stock-ok'}">${p.stock}</span></td>
      <td><span class="product-badge">${p.badge}</span></td>
      <td class="action-cell">
        <button class="btn-edit" onclick="editProduct(${p.id})">✏️ Edit</button>
        <button class="btn-del" onclick="openDeleteModal(${p.id}, '${p.name.replace(/'/g,"\\'")}')">🗑️ Hapus</button>
      </td>
    </tr>
  `).join("");
}

function editProduct(id) {
  const p = adminProducts.find(x => x.id === id);
  if (!p) return;
  document.getElementById("edit-id").value = p.id;
  document.getElementById("f-name").value = p.name;
  document.getElementById("f-category").value = p.category;
  document.getElementById("f-price").value = p.price;
  document.getElementById("f-original-price").value = p.originalPrice;
  document.getElementById("f-discount").value = p.discount;
  document.getElementById("f-stock").value = p.stock;
  document.getElementById("f-rating").value = p.rating;
  document.getElementById("f-sold").value = p.sold;
  document.getElementById("f-badge").value = p.badge;
  document.getElementById("f-image").value = p.image;
  document.getElementById("f-specs").value = p.specs;
  document.getElementById("f-description").value = p.description;
  document.getElementById("f-images").value = (p.images || []).join(", ");
  document.getElementById("form-title").textContent = "Edit Produk";
  document.getElementById("btn-save").textContent = "💾 Update Produk";
  document.getElementById("form-preview").style.display = "none";
  showTab("tambah");
}

function saveProduct(e) {
  e.preventDefault();
  const editId = document.getElementById("edit-id").value;
  const discount = parseInt(document.getElementById("f-discount").value) ||
    Math.round((1 - parseInt(document.getElementById("f-price").value) / parseInt(document.getElementById("f-original-price").value)) * 100);

  const data = {
    id: editId ? parseInt(editId) : Date.now(),
    name: document.getElementById("f-name").value.trim(),
    category: document.getElementById("f-category").value,
    price: parseInt(document.getElementById("f-price").value),
    originalPrice: parseInt(document.getElementById("f-original-price").value),
    discount,
    stock: parseInt(document.getElementById("f-stock").value),
    rating: parseFloat(document.getElementById("f-rating").value) || 4.5,
    reviews: 0,
    sold: parseInt(document.getElementById("f-sold").value) || 0,
    badge: document.getElementById("f-badge").value,
    image: document.getElementById("f-image").value.trim(),
    specs: document.getElementById("f-specs").value.trim(),
    description: document.getElementById("f-description").value.trim(),
    images: document.getElementById("f-images").value.split(",").map(s => s.trim()).filter(Boolean)
  };
  if (!data.images.length) data.images = [data.image];

  if (editId) {
    const idx = adminProducts.findIndex(p => p.id === parseInt(editId));
    if (idx !== -1) adminProducts[idx] = data;
  } else {
    adminProducts.push(data);
  }

  saveToStorage();
  showToast(editId ? "Produk berhasil diupdate!" : "Produk berhasil ditambahkan!");
  resetForm();
  showTab("daftar");
}

function resetForm() {
  document.getElementById("edit-id").value = "";
  ["f-name","f-price","f-original-price","f-discount","f-stock","f-rating","f-sold","f-image","f-specs","f-description","f-images"].forEach(id => {
    document.getElementById(id).value = "";
  });
  document.getElementById("f-category").value = "";
  document.getElementById("f-badge").value = "Baru";
  document.getElementById("form-title").textContent = "Tambah Produk Baru";
  document.getElementById("btn-save").textContent = "💾 Simpan & Publish";
  document.getElementById("form-preview").style.display = "none";
}

function previewProduct() {
  const name = document.getElementById("f-name").value || "Nama Produk";
  const price = parseInt(document.getElementById("f-price").value) || 0;
  const originalPrice = parseInt(document.getElementById("f-original-price").value) || 0;
  const discount = parseInt(document.getElementById("f-discount").value) || 0;
  const image = document.getElementById("f-image").value || "https://via.placeholder.com/300x200";
  const badge = document.getElementById("f-badge").value;
  const rating = parseFloat(document.getElementById("f-rating").value) || 4.5;
  const sold = parseInt(document.getElementById("f-sold").value) || 0;

  document.getElementById("preview-card").innerHTML = `
    <div class="product-card" style="max-width:220px;pointer-events:none">
      <span class="product-badge">${badge}</span>
      <img class="product-img" src="${image}" alt="${name}">
      <div class="product-info">
        <div class="product-name">${name}</div>
        <div>
          <span class="product-original">${formatPrice(originalPrice)}</span>
          <span class="product-discount">-${discount}%</span>
        </div>
        <div class="product-price">${formatPrice(price)}</div>
        <div class="product-rating">
          <span class="stars">${renderStars(rating)}</span>
          <span class="rating-count">${rating}</span>
          <span class="product-sold">| ${sold.toLocaleString("id-ID")} terjual</span>
        </div>
      </div>
    </div>`;
  document.getElementById("form-preview").style.display = "block";
}

function openDeleteModal(id, name) {
  deleteTargetId = id;
  document.getElementById("delete-modal-name").textContent = `Yakin ingin menghapus "${name}"?`;
  document.getElementById("delete-modal").classList.add("open");
}

function closeDeleteModal() {
  deleteTargetId = null;
  document.getElementById("delete-modal").classList.remove("open");
}

function confirmDelete() {
  adminProducts = adminProducts.filter(p => p.id !== deleteTargetId);
  saveToStorage();
  closeDeleteModal();
  renderTable();
  showToast("Produk berhasil dihapus.");
}

function renderStats() {
  const total = adminProducts.length;
  const totalSold = adminProducts.reduce((s, p) => s + p.sold, 0);
  const totalValue = adminProducts.reduce((s, p) => s + p.price * p.stock, 0);
  const lowStock = adminProducts.filter(p => p.stock < 10).length;

  document.getElementById("stat-grid").innerHTML = `
    <div class="stat-card"><div class="stat-icon">📦</div><div class="stat-val">${total}</div><div class="stat-label">Total Produk</div></div>
    <div class="stat-card"><div class="stat-icon">🛒</div><div class="stat-val">${totalSold.toLocaleString("id-ID")}</div><div class="stat-label">Total Terjual</div></div>
    <div class="stat-card"><div class="stat-icon">💰</div><div class="stat-val">${formatPrice(totalValue)}</div><div class="stat-label">Nilai Stok</div></div>
    <div class="stat-card"><div class="stat-icon">⚠️</div><div class="stat-val" style="color:#e53935">${lowStock}</div><div class="stat-label">Stok Menipis</div></div>
  `;

  const top = [...adminProducts].sort((a, b) => b.sold - a.sold).slice(0, 4);
  document.getElementById("stat-top-products").innerHTML = top.map(p => `
    <div class="product-card" onclick="editProduct(${p.id}); showTab('tambah')">
      <span class="product-badge">${p.badge}</span>
      <img class="product-img" src="${p.image}" alt="${p.name}">
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-price">${formatPrice(p.price)}</div>
        <div class="product-rating">
          <span class="stars">${renderStars(p.rating)}</span>
          <span class="product-sold">${p.sold.toLocaleString("id-ID")} terjual</span>
        </div>
      </div>
    </div>`).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  renderTable();
  // Auto-refresh tab pesanan setiap 8 detik agar pesanan baru dari user langsung masuk
  let lastOrderCount = getOrders().length;
  setInterval(() => {
    const orders = getOrders();
    const currentCount = orders.length;
    if (currentCount > lastOrderCount) {
      const diff = currentCount - lastOrderCount;
      showToast(`🛒 ${diff} pesanan baru masuk!`);
      lastOrderCount = currentCount;
      updateTabCounts();
      // Jika tab pesanan sedang aktif, refresh otomatis
      if (document.getElementById("tab-pesanan")?.classList.contains("active")) {
        renderOrdersTable();
      }
      // Update badge di sidebar
      const sideBtn = document.querySelectorAll(".menu-item")[2];
      if (sideBtn && !sideBtn.querySelector(".sidebar-badge")) {
        const badge = document.createElement("span");
        badge.className = "sidebar-badge";
        badge.textContent = "●";
        badge.style.cssText = "color:#e53935;margin-left:6px;font-size:16px;animation:pulse 1s infinite";
        sideBtn.appendChild(badge);
      }
    } else {
      lastOrderCount = currentCount;
    }
  }, 8000);
});

// ============================================================
// ORDER MANAGEMENT
// ============================================================
const ORDER_STATUSES = {
  pending:    { label: "Menunggu Pembayaran", color: "#ff6f00", bg: "#fff8e1", icon: "⏳", desc: "Menunggu konfirmasi pembayaran dari pembeli." },
  paid:       { label: "Pembayaran Diterima",  color: "#1565c0", bg: "#e3f2fd", icon: "✅", desc: "Pembayaran sudah diterima. Siapkan pesanan untuk dikemas." },
  processing: { label: "Sedang Diproses",      color: "#6a1b9a", bg: "#f3e5f5", icon: "⚙️", desc: "Pesanan sedang dikemas dan disiapkan untuk pengiriman." },
  shipped:    { label: "Dalam Pengiriman",     color: "#00838f", bg: "#e0f7fa", icon: "🚚", desc: "Paket sudah diserahkan ke kurir dan dalam perjalanan." },
  delivered:  { label: "Pesanan Tiba",         color: "#2e7d32", bg: "#e8f5e9", icon: "📦", desc: "Paket sudah tiba di tangan pembeli." },
  cancelled:  { label: "Dibatalkan",           color: "#c62828", bg: "#ffebee", icon: "❌", desc: "Pesanan ini telah dibatalkan." }
};

const STATUS_FLOW = ["pending","paid","processing","shipped","delivered"];

const STATUS_NEXT = {
  pending:    { next: "paid",       label: "✅ Konfirmasi Pembayaran",  color: "#1565c0" },
  paid:       { next: "processing", label: "⚙️ Proses Pesanan",         color: "#6a1b9a" },
  processing: { next: "shipped",    label: "🚚 Tandai Dikirim",          color: "#00838f" },
  shipped:    { next: "delivered",  label: "📦 Tandai Pesanan Tiba",     color: "#2e7d32" },
  delivered:  { next: null,         label: null }
};

let currentAdminStatusFilter = "";

function getOrders() {
  const raw = JSON.parse(localStorage.getItem("bosnialine_orders") || "[]");
  return raw.map(o => ({
    ...o,
    id:     o.id || o.orderId || "",
    orderId: o.orderId || o.id || "",
    date:   o.date || (o.createdAt ? new Date(o.createdAt).toLocaleDateString("id-ID",{day:"2-digit",month:"long",year:"numeric"}) : "-"),
    status: o.status || "pending",
    payment: o.payment || o.paymentLabel || "-",
    paymentLabel: o.paymentLabel || o.payment || "-",
    customer: {
      name:     o.customer?.name     || o.customer?.nama     || "-",
      phone:    o.customer?.phone    || o.customer?.telepon  || "-",
      email:    o.customer?.email    || "-",
      address:  o.customer?.address  || o.customer?.addr     || o.customer?.alamat || "-",
      city:     o.customer?.city     || o.customer?.kota     || "-",
      province: o.customer?.province || o.customer?.prov     || o.customer?.provinsi || "-",
      zip:      o.customer?.zip      || o.customer?.kodePos  || "-",
      note:     o.customer?.note     || ""
    },
    shipping: {
      label: o.shipping?.label || "-",
      eta:   o.shipping?.eta   || "-",
      cost:  o.shipping?.cost  ?? 0
    },
    items:    Array.isArray(o.items) ? o.items : [],
    subtotal: o.subtotal || 0,
    discount: o.discount || 0,
    total:    o.total    || 0
  }));
}

function saveOrders(orders) {
  // Simpan ulang dengan menggabungkan field asli agar tidak kehilangan data lain
  const raw = JSON.parse(localStorage.getItem("bosnialine_orders") || "[]");
  const updated = raw.map(rawOrder => {
    const normalId = rawOrder.id || rawOrder.orderId || "";
    const match = orders.find(o => o.id === normalId);
    if (match) return { ...rawOrder, status: match.status };
    return rawOrder;
  });
  localStorage.setItem("bosnialine_orders", JSON.stringify(updated));
}

function orderStatusBadge(status) {
  const s = ORDER_STATUSES[status || "pending"];
  return `<span class="order-status-pill" style="background:${s.bg};color:${s.color};border:1.5px solid ${s.color}40">${s.icon} ${s.label}</span>`;
}

// ---- TAB NAVIGATION ----
function setAdminStatusTab(btn) {
  document.querySelectorAll(".ast-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  currentAdminStatusFilter = btn.dataset.status;
  renderOrdersTable();
}

function updateTabCounts() {
  const STATUS_ALIAS = { confirmed: "paid", pending_payment: "pending", done: "delivered", complete: "delivered" };
  const orders = getOrders().map(o => ({
    ...o,
    status: STATUS_ALIAS[o.status] || (ORDER_STATUSES[o.status] ? o.status : "pending")
  }));
  const elAll = document.getElementById("ast-count-all");
  if (elAll) elAll.textContent = orders.length > 0 ? orders.length : "";
  ["pending","paid","processing","shipped","delivered","cancelled"].forEach(s => {
    const cnt = orders.filter(o => o.status === s).length;
    const el2 = document.getElementById("ast-count-" + s);
    if (el2) el2.textContent = cnt > 0 ? cnt : "";
  });
}

// ---- RENDER KARTU PESANAN ----
function renderOrdersTable() {
  updateTabCounts();
  const orders = getOrders();
  const q = (document.getElementById("order-search-admin")?.value || "").toLowerCase();

  const STATUS_ALIAS = { confirmed: "paid", pending_payment: "pending", done: "delivered", complete: "delivered" };

  const filtered = orders.map(o => ({
    ...o,
    status: STATUS_ALIAS[o.status] || (ORDER_STATUSES[o.status] ? o.status : "pending")
  })).filter(o => {
    const matchQ = !q ||
      o.id.toLowerCase().includes(q) ||
      o.customer.name.toLowerCase().includes(q) ||
      (o.customer.email || "").toLowerCase().includes(q);
    const matchStatus = !currentAdminStatusFilter || o.status === currentAdminStatusFilter;
    return matchQ && matchStatus;
  });

  const container = document.getElementById("orders-card-list");
  const empty = document.getElementById("orders-empty");

  if (!filtered.length) {
    if (container) container.innerHTML = "";
    if (empty) empty.style.display = "block";
    return;
  }
  if (empty) empty.style.display = "none";

  container.innerHTML = filtered.map(o => {
    const s = ORDER_STATUSES[o.status || "pending"];
    const nxt = STATUS_NEXT[o.status || "pending"];
    const itemCount = o.items.reduce((sum, i) => sum + i.qty, 0);
    const currentIdx = STATUS_FLOW.indexOf(o.status || "pending");
    const isCancelled = o.status === "cancelled";

    const progressBar = !isCancelled ? `
      <div class="order-progress-wrap">
        ${STATUS_FLOW.map((step, i) => {
          const sl = ORDER_STATUSES[step];
          const done = i <= currentIdx;
          const active = i === currentIdx;
          return `<div class="op-step ${done ? 'done' : ''} ${active ? 'active' : ''}">
            <div class="op-dot" title="${sl.label}">${done ? sl.icon : ''}</div>
            <div class="op-label">${sl.label}</div>
            ${i < STATUS_FLOW.length - 1 ? `<div class="op-line ${i < currentIdx ? 'filled' : ''}"></div>` : ''}
          </div>`;
        }).join("")}
      </div>` : `<div class="order-cancelled-pill">❌ Pesanan Dibatalkan</div>`;

    return `
      <div class="admin-order-card" id="ocard-${o.id}">
        <div class="aoc-header">
          <div class="aoc-id-wrap">
            <span class="aoc-id">${o.id}</span>
            <span class="aoc-date">${o.date}</span>
          </div>
          ${orderStatusBadge(o.status)}
        </div>
        ${progressBar}
        <div class="aoc-items">
          ${o.items.slice(0,4).map(i => `
            <div class="aoc-item">
              <div class="aoc-img-wrap">
                <img src="${i.image || ''}" alt="${i.name}"
                  onerror="this.onerror=null;this.src='https://placehold.co/64x54/f5f5f5/bdbdbd?text=No+Img'">
              </div>
              <div class="aoc-item-info">
                <div class="aoc-item-name">${i.name}</div>
                <div class="aoc-item-qty">x${i.qty} · ${formatPrice(i.price)}</div>
              </div>
            </div>`).join("")}
          ${o.items.length > 4 ? `<div class="aoc-more">+${o.items.length - 4} item lainnya</div>` : ""}
        </div>
        <div class="aoc-meta">
          <div class="aoc-customer">
            <span class="aoc-cname">👤 ${o.customer.name}</span>
            <span class="aoc-cphone">${o.customer.phone}</span>
            <span class="aoc-cemail">${o.customer.email !== "-" ? "✉️ "+o.customer.email : ""}</span>
            <span class="aoc-payment">💳 ${o.paymentLabel || o.payment}</span>
          </div>
          <div class="aoc-total">
            <span class="aoc-total-label">${itemCount} item · Total</span>
            <span class="aoc-total-price">${formatPrice(o.total)}</span>
          </div>
        </div>
        <div class="aoc-actions">
          <button class="aoc-btn-detail" onclick="openOrderDetail('${o.id}')">👁 Lihat Detail</button>
          ${nxt?.next ? `<button class="aoc-btn-next" style="background:${nxt.color}" onclick="quickUpdateStatus('${o.id}','${nxt.next}')">${nxt.label}</button>` : ""}
          ${!isCancelled && o.status !== "delivered" ? `<button class="aoc-btn-cancel" onclick="cancelOrder('${o.id}')">❌ Batalkan</button>` : ""}
          <button class="aoc-btn-del" onclick="deleteOrder('${o.id}')">🗑️</button>
        </div>
      </div>`;
  }).join("");
}

function quickUpdateStatus(id, newStatus) {
  const orders = getOrders();
  const idx = orders.findIndex(o => o.id === id);
  if (idx === -1) return;
  orders[idx].status = newStatus;
  saveOrders(orders);
  renderOrdersTable();
  const s = ORDER_STATUSES[newStatus];
  showToast(`${s.icon} Pesanan ${id} → ${s.label}`);
}

function cancelOrder(id) {
  if (!confirm("Batalkan pesanan " + id + "?")) return;
  quickUpdateStatus(id, "cancelled");
}

// ---- MODAL DETAIL ----
function openOrderDetail(id) {
  const orders = getOrders();
  const o = orders.find(x => x.id === id);
  if (!o) return;

  const currentIdx = STATUS_FLOW.indexOf(o.status || "pending");
  const isCancelled = o.status === "cancelled";
  const s = ORDER_STATUSES[o.status || "pending"];

  const timeline = STATUS_FLOW.map((step, i) => {
    const sl = ORDER_STATUSES[step];
    const done = i <= currentIdx && !isCancelled;
    const active = i === currentIdx && !isCancelled;
    return `
      <div class="tl-step ${done ? 'done' : ''} ${active ? 'active' : ''}">
        <div class="tl-icon-wrap">
          <div class="tl-icon">${done || active ? sl.icon : '○'}</div>
          ${i < STATUS_FLOW.length - 1 ? `<div class="tl-connector ${done && i < currentIdx ? 'filled' : ''}"></div>` : ''}
        </div>
        <div class="tl-info">
          <div class="tl-label">${sl.label}</div>
          ${active ? `<div class="tl-desc">${sl.desc}</div>` : ''}
        </div>
      </div>`;
  }).join("");

  const banner = `
    <div class="order-status-banner" style="background:${s.bg};border-left:4px solid ${s.color}">
      <div class="osb-icon">${s.icon}</div>
      <div>
        <div class="osb-label" style="color:${s.color}">${s.label}</div>
        <div class="osb-desc">${s.desc}</div>
      </div>
    </div>`;

  const actionBtns = `
    <div class="order-action-panel">
      <div class="oap-title">🔄 Update Status Pesanan:</div>
      <div class="oap-buttons">
        ${STATUS_FLOW.map(step => {
          const sl = ORDER_STATUSES[step];
          const isCurrent = (o.status || "pending") === step;
          const isDone = STATUS_FLOW.indexOf(step) < currentIdx;
          return `<button
            class="oap-btn ${isCurrent ? 'current' : ''} ${isDone ? 'done' : ''}"
            style="${isCurrent ? `background:${sl.color};color:white;border-color:${sl.color}` : ''}"
            onclick="updateStatusFromModal('${o.id}','${step}')"
            ${isCurrent ? 'disabled' : ''}
          >${sl.icon} ${sl.label}</button>`;
        }).join("")}
        <button class="oap-btn cancel-btn"
          onclick="updateStatusFromModal('${o.id}','cancelled')"
          ${o.status === 'cancelled' ? 'disabled' : ''}>❌ Batalkan</button>
      </div>
    </div>`;

  document.getElementById("order-detail-modal-content").innerHTML = `
    <div style="padding:20px">
      <div class="order-detail-id" style="margin-bottom:12px">
        <span style="font-family:monospace;font-size:16px;font-weight:700">${o.id}</span>
        <span style="font-size:12px;color:#9e9e9e">${o.date}</span>
      </div>
      ${banner}
      <div class="order-timeline-full" style="margin:16px 0">
        <div class="tl-title">📍 Alur Status Pesanan</div>
        <div class="tl-track">${timeline}</div>
      </div>
      ${actionBtns}
      <div class="order-detail-section">
        <h4>📦 Item Pesanan</h4>
        ${o.items.map(i => `
          <div class="admin-order-item-row">
            <div class="aoir-img-wrap">
              <img src="${i.image || ''}" alt="${i.name}"
                onerror="this.onerror=null;this.src='https://placehold.co/76x64/f5f5f5/bdbdbd?text=No+Img'">
            </div>
            <div class="order-detail-item-info">
              <div style="font-size:13px;font-weight:700;color:#212121;line-height:1.4">${i.name}</div>
              <div class="muted" style="margin-top:4px">x${i.qty} × ${formatPrice(i.price)}</div>
            </div>
            <div class="order-detail-item-price">${formatPrice(i.price * i.qty)}</div>
          </div>`).join("")}
      </div>
      <div class="order-detail-section">
        <h4>👤 Data Pelanggan</h4>
        <div class="order-info-grid">
          <div><span class="muted">Nama</span><span>${o.customer.name}</span></div>
          <div><span class="muted">Telepon</span><span>${o.customer.phone}</span></div>
          <div><span class="muted">Email</span><span>${o.customer.email || "-"}</span></div>
          <div><span class="muted">Kota</span><span>${o.customer.city}, ${o.customer.province}</span></div>
        </div>
        <p style="font-size:13px;margin-top:8px">📍 ${[o.customer.address, o.customer.city, o.customer.province, o.customer.zip].filter(v=>v&&v!=="-").join(", ")}</p>
        ${o.customer.note ? `<p style="font-size:12px;color:#9e9e9e;margin-top:4px">📝 Catatan: ${o.customer.note}</p>` : ""}
      </div>
      <div class="order-detail-section">
        <h4>🚚 Pengiriman & Pembayaran</h4>
        <div class="order-info-grid">
          <div><span class="muted">Kurir</span><span>${o.shipping.label}</span></div>
          <div><span class="muted">Estimasi</span><span>${o.shipping.eta}</span></div>
          <div><span class="muted">Pembayaran</span><span style="font-weight:700">${o.paymentLabel || o.payment}</span></div>
          <div><span class="muted">Ongkir</span><span>${o.shipping.cost === 0 ? "GRATIS" : formatPrice(o.shipping.cost)}</span></div>
        </div>
      </div>
      ${o.cicilan ? `
      <div class="order-detail-section">
        <h4>💳 Info Cicilan 0%</h4>
        <div class="cicilan-info-box">
          <div class="cicilan-info-row"><span>Bank</span><span>Kartu Kredit ${o.cicilan.bank}</span></div>
          <div class="cicilan-info-row"><span>Tenor</span><span>${o.cicilan.tenor} Bulan</span></div>
          <div class="cicilan-info-row highlight"><span>Per Bulan</span><span>${formatPrice(o.cicilan.perBulan)}</span></div>
          <div class="cicilan-info-row"><span>Bunga</span><span style="color:#2e7d32;font-weight:700">0% (Gratis)</span></div>
        </div>
      </div>` : ""}
      <div class="order-price-summary">
        <div class="order-price-row"><span>Subtotal</span><span>${formatPrice(o.subtotal)}</span></div>
        <div class="order-price-row"><span>Ongkos Kirim</span><span>${o.shipping.cost === 0 ? "GRATIS" : formatPrice(o.shipping.cost)}</span></div>
        ${o.discount > 0 ? `<div class="order-price-row" style="color:#2e7d32"><span>Diskon</span><span>- ${formatPrice(o.discount)}</span></div>` : ""}
        <div class="order-price-row total"><span>Total Bayar</span><span>${formatPrice(o.total)}</span></div>
      </div>
    </div>`;

  document.getElementById("order-detail-modal").classList.add("open");
  document.body.style.overflow = "hidden";
}

function updateStatusFromModal(id, newStatus) {
  const orders = getOrders();
  const idx = orders.findIndex(o => o.id === id);
  if (idx === -1) return;
  orders[idx].status = newStatus;
  saveOrders(orders);
  closeOrderDetailModal();
  renderOrdersTable();
  const s = ORDER_STATUSES[newStatus];
  showToast(`${s.icon} Status diperbarui → ${s.label}`);
}

function deleteOrder(id) {
  if (!confirm("Hapus pesanan " + id + "?")) return;
  const orders = getOrders().filter(o => o.id !== id);
  saveOrders(orders);
  renderOrdersTable();
  showToast("Pesanan dihapus.");
}

function closeOrderDetailModal() {
  document.getElementById("order-detail-modal").classList.remove("open");
  document.body.style.overflow = "";
}
