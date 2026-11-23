/* ============================================================
   CHECKOUT.JS — BOSNIALine (Shopee-style flow)
   Steps: 1=Alamat  2=Pengiriman  3=Pembayaran  4=Konfirmasi
   ============================================================ */

let shippingCost = 0;
let discountAmount = 0;
let invoiceNumber = "";
let currentStep = 1;

// ---- Helpers ----
function formatPrice(n) {
  return "Rp " + n.toLocaleString("id-ID");
}

function createInvoiceNumber() {
  const d = new Date().toISOString().slice(0,10).replace(/-/g,"");
  const r = Math.floor(1000 + Math.random() * 9000);
  return `INV-${d}-${r}`;
}
function ensureInvoiceNumber() {
  if (!invoiceNumber) invoiceNumber = createInvoiceNumber();
  return invoiceNumber;
}

function showToast(msg, isError = false) {
  let t = document.getElementById("toast-msg");
  if (!t) {
    t = document.createElement("div");
    t.id = "toast-msg";
    t.style.cssText = "position:fixed;bottom:24px;left:50%;transform:translateX(-50%);padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600;z-index:9999;max-width:90vw;text-align:center;transition:opacity 0.4s";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.background = isError ? "#c62828" : "#212121";
  t.style.color = "white";
  t.style.opacity = "1";
  clearTimeout(t._to);
  t._to = setTimeout(() => { t.style.opacity = "0"; }, 3000);
}

// ---- Step navigation ----
function goStep(n) {
  currentStep = n;
  for (let i = 1; i <= 4; i++) {
    const panel = document.getElementById("step-" + i);
    if (panel) panel.style.display = i === n ? "block" : "none";
    const ind = document.getElementById("step-ind-" + i);
    if (ind) {
      ind.className = "co-step" + (i === n ? " active" : "") + (i < n ? " done" : "");
    }
    if (i < 4) {
      const line = document.getElementById("line-" + i + "-" + (i+1));
      if (line) line.classList.toggle("filled", i < n);
    }
  }
  if (n === 2) fillAddrSummary();
  if (n === 4) fillReview();
  updateSummary();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ---- Label chips ----
function selectLabelChip(el, label) {
  document.querySelectorAll(".co-chip").forEach(c => c.classList.remove("active"));
  el.classList.add("active");
  const inp = document.getElementById("c-label");
  if (inp) inp.value = label;
}

// ---- Toggle new address form ----
function toggleNewAddrForm() {
  const saved = document.getElementById("saved-addr-section");
  if (saved) saved.style.display = "none";
  const form = document.getElementById("addr-form");
  if (form) {
    ["c-name","c-phone","c-email","c-province","c-city","c-district","c-village","c-zip","c-address","c-note"]
      .forEach(id => { const el = document.getElementById(id); if(el) el.value = ""; });
  }
}

// ---- Saved address selection ----
function selectSavedAddr(el, addrId) {
  document.querySelectorAll(".co-saved-addr-card").forEach(c => c.classList.remove("selected"));
  el.classList.add("selected");
  const rb = el.querySelector("input[type=radio]");
  if (rb) rb.checked = true;

  const user = typeof getCurrentUser === "function" ? getCurrentUser() : null;
  if (!user) return;
  const addr = user.addresses?.find(a => a.id === addrId);
  if (!addr) return;
  const set = (id, val) => { const e = document.getElementById(id); if(e) e.value = val || ""; };
  set("c-name", addr.name);
  set("c-phone", addr.phone);
  set("c-address", addr.detail);
  set("c-city", addr.city);
  set("c-province", addr.province);
  set("c-zip", addr.zip);
}

// ---- Fill address summary on step 2 ----
function fillAddrSummary() {
  const name = document.getElementById("c-name")?.value || "";
  const phone = document.getElementById("c-phone")?.value || "";
  const addr = document.getElementById("c-address")?.value || "";
  const city = document.getElementById("c-city")?.value || "";
  const prov = document.getElementById("c-province")?.value || "";
  const zip  = document.getElementById("c-zip")?.value || "";
  const el1 = document.getElementById("sum-name");
  const el2 = document.getElementById("sum-addr");
  if (el1) el1.textContent = `${name}  ·  ${phone}`;
  if (el2) el2.textContent = `${addr}, ${city}, ${prov} ${zip}`;
}

// ---- Free shipping voucher ----
function applyFreeShip() {
  const opt = document.querySelector("input[name='shipping']:checked");
  if (opt) { opt.dataset._origCost = opt.dataset.cost; opt.dataset.cost = "0"; }
  showToast("🎉 Voucher Gratis Ongkir berhasil digunakan!");
  updateSummary();
}

// ---- Voucher code ----
const VOUCHER_CODES = {
  "BOSNIA10": { type:"percent", value:10, label:"Diskon 10%" },
  "HEMAT50K": { type:"flat",    value:50000, label:"Potongan Rp 50.000" },
  "GRATIS":   { type:"ship",    value:0,     label:"Gratis Ongkir" }
};
function applyVoucher() {
  const code = (document.getElementById("voucher-code")?.value || "").toUpperCase().trim();
  const msgEl = document.getElementById("voucher-msg");
  const v = VOUCHER_CODES[code];
  if (!v) {
    if (msgEl) { msgEl.style.display="block"; msgEl.style.color="#c62828"; msgEl.textContent="❌ Kode voucher tidak valid."; }
    return;
  }
  const subtotal = cart.reduce((s,i) => s + i.price * i.qty, 0);
  if (v.type === "percent") discountAmount = Math.round(subtotal * v.value / 100);
  else if (v.type === "flat") discountAmount = Math.min(v.value, subtotal);
  else if (v.type === "ship") applyFreeShip();
  if (msgEl) { msgEl.style.display="block"; msgEl.style.color="#2e7d32"; msgEl.textContent=`✅ Voucher "${v.label}" berhasil digunakan!`; }
  updateSummary();
}

// ---- Update sidebar summary ----
function updateSummary() {
  if (!cart || !cart.length) return;
  const subtotal = cart.reduce((s,i) => s + i.price * i.qty, 0);
  const sel = document.querySelector("input[name='shipping']:checked");
  shippingCost = sel ? parseInt(sel.dataset.cost || 0) : 0;
  const total = Math.max(0, subtotal + shippingCost - discountAmount);
  const totalQty = cart.reduce((s,i) => s + i.qty, 0);

  const sumItems = document.getElementById("summary-items");
  if (sumItems) {
    sumItems.innerHTML = cart.map(i => `
      <div class="co-summary-item">
        <img src="${i.image}" alt="${i.name}" onerror="this.src='https://via.placeholder.com/54x46?text=IMG'">
        <div class="co-summary-item-info">
          <div class="co-summary-item-name">${i.name}</div>
          <div class="co-summary-item-qty">x${i.qty}</div>
        </div>
        <div class="co-summary-item-price">${formatPrice(i.price * i.qty)}</div>
      </div>`).join("");
  }
  const set = (id, val) => { const e = document.getElementById(id); if(e) e.textContent = val; };
  set("sum-qty", totalQty);
  set("summary-subtotal", formatPrice(subtotal));
  set("summary-shipping", shippingCost === 0 && currentStep >= 2 ? "GRATIS" : (shippingCost > 0 ? formatPrice(shippingCost) : "-"));
  set("summary-total", formatPrice(total));

  const dRow = document.getElementById("sum-discount-row");
  if (dRow) dRow.style.display = discountAmount > 0 ? "flex" : "none";
  set("summary-discount", discountAmount > 0 ? "- " + formatPrice(discountAmount) : "");
}

// ---- Cicilan calculator ----
function calcCicilan() {
  const subtotal = cart.reduce((s,i) => s + i.price * i.qty, 0);
  const total = subtotal + shippingCost;
  const tenor = parseInt(document.querySelector("input[name='tenor']:checked")?.value || 3);
  const perBulan = Math.ceil(total / tenor);
  const bank = (document.querySelector("input[name='payment']:checked")?.value || "").replace("cicilan_","").toUpperCase();
  const res = document.getElementById("cicilan-result");
  if (res) res.innerHTML = `
    <div style="background:white;border-radius:8px;padding:12px 16px;border:1px solid #c8e6c9">
      <div style="display:flex;align-items:baseline;gap:6px;margin-bottom:4px">
        <span style="font-size:24px;font-weight:900;color:#2e7d32">${formatPrice(perBulan)}</span>
        <span style="font-size:13px;color:#388e3c;font-weight:600">/ bulan</span>
      </div>
      <div style="font-size:12px;color:#757575">${tenor}x cicilan · Total ${formatPrice(total)} · Kartu Kredit ${bank}</div>
    </div>`;
}

// ---- Payment info data ----
const PAYMENT_INFO = {
  shopeepay: { label:"ShopeePay", icon:"🟠", color:"#ee4d2d", type:"ewallet", account:"0857-1644-4966",
    instructions:["Buka aplikasi Shopee","Pilih menu ShopeePay","Scan QR atau transfer ke nomor yang tertera","Masukkan PIN ShopeePay kamu","Pembayaran otomatis terverifikasi"]
  },
  gopay: { label:"GoPay", icon:"💚", color:"#00aed6", type:"ewallet", account:"0857-1644-4966",
    instructions:["Buka aplikasi Gojek","Pastikan saldo GoPay mencukupi","Pilih Transfer → ke Nomor HP","Masukkan nomor tujuan dan jumlah","Konfirmasi dengan PIN GoPay"]
  },
  ovo: { label:"OVO", icon:"💜", color:"#4c3494", type:"ewallet", account:"0857-1644-4966",
    instructions:["Buka aplikasi OVO","Pastikan saldo OVO Cash mencukupi","Pilih Transfer → ke Nomor HP","Masukkan nomor tujuan dan jumlah","Konfirmasi dengan PIN OVO"]
  },
  dana: { label:"DANA", icon:"💙", color:"#118eea", type:"ewallet", account:"0857-1644-4966",
    instructions:["Buka aplikasi DANA","Pilih Kirim Uang → ke Nomor HP","Masukkan nomor: <strong>0857-1644-4966</strong>","Masukkan jumlah sesuai total pesanan","Konfirmasi dengan PIN DANA","Simpan bukti transfer"]
  },
  linkaja: { label:"LinkAja", icon:"❤️", color:"#e53935", type:"ewallet", account:"0857-1644-4966",
    instructions:["Buka aplikasi LinkAja","Pilih Transfer Uang","Masukkan nomor tujuan","Masukkan jumlah transfer","Konfirmasi pembayaran"]
  },
  bca:     { label:"BCA Virtual Account", icon:"🏦", color:"#005baa", type:"va", generateVA: id => "8277"+id.slice(-8)+"01",
    instructions:["Salin nomor Virtual Account di bawah","Buka BCA Mobile / ATM BCA","Pilih Transfer → BCA Virtual Account","Masukkan nomor VA dan konfirmasi jumlah","Selesaikan sebelum batas waktu"]
  },
  bni:     { label:"BNI Virtual Account", icon:"🏦", color:"#f26522", type:"va", generateVA: id => "8888"+id.slice(-8)+"02",
    instructions:["Salin nomor Virtual Account","Buka BNI Mobile / ATM BNI","Pilih Transfer → Virtual Account","Masukkan nomor VA","Selesaikan sebelum batas waktu"]
  },
  bri:     { label:"BRI Virtual Account", icon:"🏦", color:"#00529b", type:"va", generateVA: id => "9889"+id.slice(-8)+"03",
    instructions:["Salin nomor Virtual Account","Buka BRImo / ATM BRI","Pilih Pembayaran → BRIVA","Masukkan nomor VA","Konfirmasi dan selesaikan pembayaran"]
  },
  mandiri: { label:"Mandiri Virtual Account", icon:"🏦", color:"#003d79", type:"va", generateVA: id => "70012"+id.slice(-8)+"04",
    instructions:["Salin nomor Virtual Account","Buka Livin' by Mandiri / ATM Mandiri","Pilih Bayar → Multi Payment","Kode perusahaan <strong>70012</strong> lalu nomor VA","Konfirmasi dan selesaikan pembayaran"]
  },
  bsi:     { label:"BSI Virtual Account", icon:"🏦", color:"#2e7d32", type:"va", generateVA: id => "9016"+id.slice(-8)+"05",
    instructions:["Salin nomor Virtual Account","Buka BSI Mobile / ATM BSI","Pilih Transfer → Virtual Account","Masukkan nomor VA","Selesaikan sebelum batas waktu"]
  },
  qris: { label:"QRIS", icon:"📱", color:"#e53935", type:"qris",
    instructions:["Buka aplikasi e-wallet atau m-banking yang mendukung QRIS","Pilih menu Scan QR / QRIS","Arahkan kamera ke QR Code di bawah","Masukkan jumlah jika diminta","Konfirmasi pembayaran"]
  },
  indomaret: { label:"Indomaret", icon:"🏪", color:"#e53935", type:"minimarket",
    instructions:["Pergi ke gerai Indomaret terdekat","Tunjukkan kode bayar ke kasir","Kasir akan memproses pembayaran","Simpan struk sebagai bukti pembayaran"]
  },
  alfamart: { label:"Alfamart", icon:"🏪", color:"#e53935", type:"minimarket",
    instructions:["Pergi ke gerai Alfamart terdekat","Tunjukkan kode bayar ke kasir","Kasir akan memproses pembayaran","Simpan struk sebagai bukti pembayaran"]
  },
  cod: { label:"COD — Bayar di Tempat", icon:"💵", color:"#2e7d32", type:"cod",
    instructions:["Siapkan uang tunai sesuai total pesanan","Kurir akan menghubungi sebelum pengiriman","Bayar langsung ke kurir saat barang tiba","Simpan bukti pembayaran dari kurir"]
  }
};
["bca","mandiri","bni","bri"].forEach(b => {
  PAYMENT_INFO["cicilan_"+b] = {
    label: `Cicilan 0% Kartu Kredit ${b.toUpperCase()}`,
    icon:"💳", color:"#1565c0", type:"cicilan",
    instructions:[`Gunakan kartu kredit <strong>${b.toUpperCase()}</strong>`, "Cicilan 0% diproses otomatis oleh bank","Tagihan muncul di rekening kartu kredit","Tidak ada bunga dan biaya tambahan"]
  };
});

// ---- Render payment instructions ----
function renderPaymentInstructions(paymentValue, orderId, total) {
  const info = PAYMENT_INFO[paymentValue];
  if (!info) return "";

  const deadline = new Date(Date.now() + 24*60*60*1000).toLocaleString("id-ID", {
    day:"numeric", month:"long", year:"numeric", hour:"2-digit", minute:"2-digit"
  });

  let accountBlock = "";
  const payId = orderId || "BL-" + Date.now().toString().slice(-8);

  if (info.type === "va") {
    const va = info.generateVA(payId);
    accountBlock = `
      <div class="co-pay-instr-account">
        <div class="co-pay-acct-label">Nomor Virtual Account</div>
        <div class="co-pay-acct-number" id="va-num">${va}</div>
        <button class="co-btn-copy" onclick="copyText('${va}',this)">📋 Salin Nomor VA</button>
        <div class="co-pay-acct-label" style="margin-top:14px">Jumlah Transfer</div>
        <div class="co-pay-amount">${formatPrice(total)}</div>
        <button class="co-btn-copy" onclick="copyText('${total}',this)">📋 Salin Jumlah</button>
        <div class="co-pay-deadline">⏰ Batas bayar: <strong>${deadline}</strong></div>
      </div>`;
  } else if (info.type === "ewallet") {
    const num = info.account.split(" ")[0];
    accountBlock = `
      <div class="co-pay-instr-account">
        <div class="co-pay-acct-label">Nomor Tujuan Transfer</div>
        <div class="co-pay-acct-number">${num}</div>
        <div style="font-size:12px;color:#757575;margin-bottom:8px">BOSNIALine Official</div>
        <button class="co-btn-copy" onclick="copyText('${num}',this)">📋 Salin Nomor</button>
        <div class="co-pay-acct-label" style="margin-top:14px">Jumlah Transfer</div>
        <div class="co-pay-amount">${formatPrice(total)}</div>
        <button class="co-btn-copy" onclick="copyText('${total}',this)">📋 Salin Jumlah</button>
        <div class="co-pay-deadline">⏰ Batas bayar: <strong>${deadline}</strong></div>
      </div>`;
  } else if (info.type === "qris") {
    accountBlock = `
      <div class="co-pay-instr-account">
        <div class="co-pay-acct-label">Scan QR Code</div>
        <div style="margin:10px auto;display:inline-flex;flex-direction:column;align-items:center;padding:12px;border:2px solid #e0e0e0;border-radius:10px;background:white">
          <svg viewBox="0 0 100 100" width="130" height="130">
            <rect x="5" y="5" width="35" height="35" fill="none" stroke="#000" stroke-width="4"/>
            <rect x="12" y="12" width="21" height="21" fill="#000"/>
            <rect x="60" y="5" width="35" height="35" fill="none" stroke="#000" stroke-width="4"/>
            <rect x="67" y="12" width="21" height="21" fill="#000"/>
            <rect x="5" y="60" width="35" height="35" fill="none" stroke="#000" stroke-width="4"/>
            <rect x="12" y="67" width="21" height="21" fill="#000"/>
            <rect x="60" y="60" width="10" height="10" fill="#000"/><rect x="75" y="60" width="10" height="10" fill="#000"/>
            <rect x="60" y="75" width="10" height="10" fill="#000"/><rect x="75" y="75" width="10" height="10" fill="#000"/>
          </svg>
          <div style="font-size:11px;color:#666;margin-top:4px">QRIS BOSNIALine</div>
        </div>
        <div class="co-pay-amount">${formatPrice(total)}</div>
        <div class="co-pay-deadline">⏰ Batas bayar: <strong>${deadline}</strong></div>
      </div>`;
  } else if (info.type === "minimarket") {
    const code = "BL" + Date.now().toString().slice(-8);
    accountBlock = `
      <div class="co-pay-instr-account">
        <div class="co-pay-acct-label">Kode Pembayaran</div>
        <div class="co-pay-acct-number">${code}</div>
        <button class="co-btn-copy" onclick="copyText('${code}',this)">📋 Salin Kode</button>
        <div class="co-pay-amount" style="margin-top:12px">${formatPrice(total)}</div>
        <div class="co-pay-deadline">⏰ Batas bayar: <strong>${deadline}</strong></div>
      </div>`;
  } else if (info.type === "cod") {
    accountBlock = `
      <div class="co-pay-instr-account">
        <div style="font-size:40px;margin-bottom:8px">💵</div>
        <div class="co-pay-acct-label">Siapkan Uang Tunai</div>
        <div class="co-pay-amount">${formatPrice(total)}</div>
        <div class="co-pay-deadline" style="background:#e8f5e9;color:#2e7d32">📦 Bayar saat barang tiba di tangan kamu</div>
      </div>`;
  } else if (info.type === "cicilan") {
    const tenor = parseInt(document.querySelector("input[name='tenor']:checked")?.value || 3);
    const per = Math.ceil(total / tenor);
    accountBlock = `
      <div class="co-pay-instr-account">
        <div style="display:inline-block;background:#2e7d32;color:white;font-size:12px;font-weight:700;padding:3px 12px;border-radius:20px;margin-bottom:8px">0% Bunga</div>
        <div class="co-pay-acct-label">Cicilan per Bulan</div>
        <div class="co-pay-amount">${formatPrice(per)}</div>
        <div style="font-size:13px;color:#616161;margin-top:4px">${tenor}x cicilan · Total ${formatPrice(total)}</div>
        <div class="co-pay-deadline">💳 Tagihan akan muncul di kartu kredit kamu</div>
      </div>`;
  }

  const steps = info.instructions.map((s,i) =>
    `<div class="co-pay-step"><span class="co-pay-step-num">${i+1}</span><span>${s}</span></div>`
  ).join("");

  return `
    <div class="co-pay-instr-card" style="border-color:${info.color}30">
      <div class="co-pay-instr-header" style="background:${info.color}12;border-bottom:2px solid ${info.color}25">
        <span class="co-pay-instr-icon">${info.icon}</span>
        <div>
          <div class="co-pay-instr-name" style="color:${info.color}">${info.label}</div>
          <div class="co-pay-instr-sub">Ikuti langkah pembayaran di bawah ini</div>
        </div>
      </div>
      ${accountBlock}
      <div class="co-pay-steps-title">Cara Pembayaran:</div>
      <div class="co-pay-steps">${steps}</div>
    </div>`;
}

function copyText(text, btn) {
  navigator.clipboard.writeText(String(text)).then(() => {
    const orig = btn.textContent;
    btn.textContent = "✅ Tersalin!";
    btn.style.background = "#2e7d32";
    setTimeout(() => { btn.textContent = orig; btn.style.background = ""; }, 2000);
  });
}

// ---- Fill review (step 4) ----
function fillReview() {
  const name    = document.getElementById("c-name")?.value || "";
  const phone   = document.getElementById("c-phone")?.value || "";
  const email   = document.getElementById("c-email")?.value || "";
  const addr    = document.getElementById("c-address")?.value || "";
  const city    = document.getElementById("c-city")?.value || "";
  const prov    = document.getElementById("c-province")?.value || "";
  const zip     = document.getElementById("c-zip")?.value || "";
  const note    = document.getElementById("c-note")?.value || "";
  const label   = document.getElementById("c-label")?.value || "Rumah";
  const ship    = document.querySelector("input[name='shipping']:checked");
  const pay     = document.querySelector("input[name='payment']:checked");
  const subtotal = cart.reduce((s,i) => s + i.price * i.qty, 0);
  const total    = Math.max(0, subtotal + shippingCost - discountAmount);
  const payInfo  = PAYMENT_INFO[pay?.value] || {};

  const reviewAddr = document.getElementById("review-addr");
  if (reviewAddr) reviewAddr.innerHTML = `
    <strong>${name}</strong> · ${phone}<br>
    <span style="font-size:12px;background:#f5f5f5;padding:2px 8px;border-radius:4px;margin-right:4px">${label}</span>
    ${addr}, ${city}, ${prov} ${zip}
    ${note ? `<br><span style="color:#757575">📝 ${note}</span>` : ""}`;

  const reviewShip = document.getElementById("review-shipping");
  if (reviewShip) reviewShip.innerHTML = ship
    ? `<strong>${ship.closest("label")?.querySelector(".co-ship-name")?.textContent || ship.value}</strong>
       <br><span style="font-size:12px;color:#757575">Estimasi ${ship.dataset.eta}</span>
       <span style="float:right;font-weight:700;color:#ee4d2d">${shippingCost===0?"GRATIS":formatPrice(shippingCost)}</span>`
    : "Belum dipilih";

  const reviewPay = document.getElementById("review-payment");
  if (reviewPay) reviewPay.innerHTML = pay
    ? `<strong>${payInfo.label || pay.value}</strong>`
    : '<span style="color:#e53935">Belum dipilih</span>';

  const reviewItems = document.getElementById("review-items");
  if (reviewItems) reviewItems.innerHTML = cart.map(i => `
    <div style="display:flex;gap:10px;align-items:center;padding:8px 0;border-bottom:1px solid #f5f5f5">
      <img src="${i.image}" style="width:48px;height:40px;object-fit:cover;border-radius:6px;border:1px solid #f0f0f0" onerror="this.src='https://via.placeholder.com/48'">
      <div style="flex:1">
        <div style="font-size:13px;font-weight:600">${i.name}</div>
        <div style="font-size:12px;color:#9e9e9e">x${i.qty} · ${formatPrice(i.price)}</div>
      </div>
      <div style="font-size:13px;font-weight:700;color:#ee4d2d">${formatPrice(i.price*i.qty)}</div>
    </div>`).join("");

  const priceSummary = document.getElementById("review-price-summary");
  if (priceSummary) priceSummary.innerHTML = `
    <div style="display:flex;justify-content:space-between;font-size:13px;padding:6px 0;color:#616161"><span>Subtotal</span><span>${formatPrice(subtotal)}</span></div>
    <div style="display:flex;justify-content:space-between;font-size:13px;padding:6px 0;color:#616161"><span>Ongkos Kirim</span><span>${shippingCost===0?"GRATIS":formatPrice(shippingCost)}</span></div>
    ${discountAmount>0?`<div style="display:flex;justify-content:space-between;font-size:13px;padding:6px 0;color:#2e7d32"><span>Diskon</span><span>- ${formatPrice(discountAmount)}</span></div>`:""}
    <div style="display:flex;justify-content:space-between;font-size:16px;font-weight:800;padding:10px 0 4px;border-top:1.5px solid #e0e0e0;margin-top:6px"><span>Total Pembayaran</span><span style="color:#ee4d2d">${formatPrice(total)}</span></div>`;

  // Update pay button label
  const btn = document.getElementById("btn-place-order");
  if (btn) btn.textContent = `Bayar Sekarang  ${formatPrice(total)}`;
}

function proceedToConfirm() {
  const pay = document.querySelector("input[name='payment']:checked");
  if (!pay) { showToast("⚠️ Pilih metode pembayaran terlebih dahulu", true); return; }
  goStep(4);
}

// ---- Place Order ----
async function placeOrder() {
  if (!cart || !cart.length) { window.location.href = "index.html"; return; }

  const btn = document.getElementById("btn-place-order");
  if (btn) { btn.disabled = true; btn.textContent = "⏳ Memproses..."; }

  const name    = document.getElementById("c-name")?.value || "";
  const phone   = document.getElementById("c-phone")?.value || "";
  const email   = document.getElementById("c-email")?.value || "";
  const addr    = document.getElementById("c-address")?.value || "";
  const city    = document.getElementById("c-city")?.value || "";
  const prov    = document.getElementById("c-province")?.value || "";
  const zip     = document.getElementById("c-zip")?.value || "";
  const dist    = document.getElementById("c-district")?.value || "";
  const village = document.getElementById("c-village")?.value || "";
  const note    = document.getElementById("c-note")?.value || "";
  const addrLabel = document.getElementById("c-label")?.value || "Rumah";
  const ship    = document.querySelector("input[name='shipping']:checked");
  const pay     = document.querySelector("input[name='payment']:checked");

  const subtotal = cart.reduce((s,i) => s + i.price * i.qty, 0);
  const total    = Math.max(0, subtotal + shippingCost - discountAmount);
  const totalWeight = cart.reduce((s,i) => s + (i.weight||0)*i.qty, 0);
  ensureInvoiceNumber();

  const user = typeof getCurrentUser === "function" ? getCurrentUser() : null;

  const order = {
    orderId:  "BL-" + Date.now().toString().slice(-8),
    invoice:  invoiceNumber,
    userId:   user?.id || null,
    customer: { name, phone, email, addr, city, prov, zip, dist, village, note, addrLabel },
    items:    [...cart],
    shipping: {
      method:  ship?.value,
      label:   ship?.closest("label")?.querySelector(".co-ship-name")?.textContent || ship?.value,
      cost:    shippingCost,
      eta:     ship?.dataset.eta
    },
    payment:  pay?.value || null,
    paymentLabel: PAYMENT_INFO[pay?.value]?.label || pay?.value,
    subtotal,
    discount: discountAmount,
    total,
    totalWeight,
    status:   pay?.value === "cod" ? "confirmed" : "pending_payment",
    createdAt: new Date().toISOString()
  };

  // Save to server
  try {
    const res = await apiRequest("orders.php?action=create", {
      customer: order.customer,
      shipping: order.shipping,
      items: order.items,
      subtotal: order.subtotal,
      total: order.total,
      invoice: order.invoice
    }, "POST");
    if (res?.ok && res.order) {
      order.id = res.order.id;
      order.invoice = res.order.invoice || order.invoice;
    }
  } catch(e) { console.warn("Server save skipped:", e); }

  // Save to localStorage
  const stored = JSON.parse(localStorage.getItem("bosnialine_orders") || "[]");
  stored.unshift(order);
  localStorage.setItem("bosnialine_orders", JSON.stringify(stored));

  // Clear cart
  cart = [];
  if (typeof saveCart === "function") saveCart();
  else localStorage.setItem("bosnialine_cart", "[]");
  if (typeof updateCartCount === "function") updateCartCount();

  // Show success UI
  showOrderSuccess(order, total);
}

function showOrderSuccess(order, total) {
  const reviewSec = document.getElementById("order-review-section");
  const succSec   = document.getElementById("order-success-section");
  if (reviewSec) reviewSec.style.display = "none";
  if (succSec)   succSec.style.display   = "block";

  const set = (id, val) => { const e = document.getElementById(id); if(e) e.textContent = val; };
  set("order-id-display", order.orderId);

  // Post-order payment instructions
  const postInstr = document.getElementById("post-payment-instructions");
  if (postInstr && order.payment && order.payment !== "cod") {
    postInstr.innerHTML = renderPaymentInstructions(order.payment, order.orderId, total);
  } else if (postInstr && order.payment === "cod") {
    postInstr.innerHTML = `
      <div style="background:#e8f5e9;border:1.5px solid #a5d6a7;border-radius:10px;padding:14px 16px;text-align:center">
        <div style="font-size:28px;margin-bottom:6px">💵</div>
        <div style="font-weight:700;color:#2e7d32">Siapkan Uang Tunai ${formatPrice(total)}</div>
        <div style="font-size:13px;color:#388e3c;margin-top:4px">Bayarkan kepada kurir saat barang tiba</div>
      </div>`;
  }

  // Confirm detail rows
  const rows = document.getElementById("confirm-detail-rows");
  if (rows) rows.innerHTML = `
    <div class="co-confirm-row"><span>No. Pesanan</span><span style="font-family:monospace;color:#ee4d2d">${order.orderId}</span></div>
    <div class="co-confirm-row"><span>Invoice</span><span style="font-family:monospace">${order.invoice}</span></div>
    <div class="co-confirm-row"><span>Tanggal</span><span>${new Date().toLocaleDateString("id-ID",{day:"2-digit",month:"long",year:"numeric"})}</span></div>
    <div class="co-confirm-row"><span>Penerima</span><span>${order.customer.name}</span></div>
    <div class="co-confirm-row"><span>Alamat</span><span style="text-align:right">${order.customer.addr}, ${order.customer.city}, ${order.customer.prov} ${order.customer.zip}</span></div>
    <div class="co-confirm-row"><span>Pengiriman</span><span>${order.shipping.label || "-"}</span></div>
    <div class="co-confirm-row"><span>Pembayaran</span><span>${order.paymentLabel || "-"}</span></div>
    <div class="co-confirm-row"><span>Status</span><span style="color:${order.payment==="cod"?"#2e7d32":"#e65100"}">${order.payment==="cod"?"✅ Dikonfirmasi":"⏳ Menunggu Pembayaran"}</span></div>`;

  // Items
  const itemsList = document.getElementById("confirm-items-list");
  if (itemsList) itemsList.innerHTML = order.items.map(i => `
    <div style="display:flex;gap:10px;align-items:center;padding:7px 0;border-bottom:1px solid #f0f0f0">
      <img src="${i.image}" style="width:44px;height:38px;object-fit:cover;border-radius:5px" onerror="this.src='https://via.placeholder.com/44'">
      <div style="flex:1;font-size:13px"><strong>${i.name}</strong><br><span style="color:#9e9e9e">x${i.qty}</span></div>
      <span style="font-weight:700;color:#ee4d2d;font-size:13px">${formatPrice(i.price*i.qty)}</span>
    </div>`).join("");

  // Price rows
  const priceRows = document.getElementById("confirm-price-rows");
  if (priceRows) priceRows.innerHTML = `
    <div class="co-pr"><span>Subtotal</span><span>${formatPrice(order.subtotal)}</span></div>
    <div class="co-pr"><span>Ongkos Kirim</span><span>${order.shipping.cost===0?"GRATIS":formatPrice(order.shipping.cost)}</span></div>
    ${order.discount>0?`<div class="co-pr" style="color:#2e7d32"><span>Diskon</span><span>- ${formatPrice(order.discount)}</span></div>`:""}
    <div class="co-pr total"><span>Total Pembayaran</span><span>${formatPrice(total)}</span></div>`;

  showToast("🎉 Pesanan berhasil dibuat!");
}

function copyOrderId() {
  const id = document.getElementById("order-id-display")?.textContent || "";
  navigator.clipboard.writeText(id).then(() => showToast("✅ No. pesanan tersalin!"));
}

// ---- On page load ----
document.addEventListener("DOMContentLoaded", () => {
  if (!cart || !cart.length) { window.location.href = "index.html"; return; }

  // Auto-fill from logged-in user
  const user = typeof getCurrentUser === "function" ? getCurrentUser() : null;
  if (user) {
    const set = (id, val) => { const e = document.getElementById(id); if(e && val) e.value = val; };
    set("c-name",  user.name);
    set("c-phone", user.phone);
    set("c-email", user.email);

    const defAddr = user.addresses?.find(a => a.isDefault) || user.addresses?.[0];
    if (defAddr) {
      set("c-address",  defAddr.detail);
      set("c-city",     defAddr.city);
      set("c-province", defAddr.province);
      set("c-zip",      defAddr.zip);
    }

    // Show saved addresses
    if (user.addresses?.length) {
      const sec  = document.getElementById("saved-addr-section");
      const list = document.getElementById("saved-addr-list");
      if (sec && list) {
        sec.style.display = "block";
        list.innerHTML = user.addresses.map(a => `
          <div class="co-saved-addr-card ${a.isDefault?"selected":""}" onclick="selectSavedAddr(this,'${a.id}')" data-addr-id="${a.id}">
            <input type="radio" name="saved-addr" ${a.isDefault?"checked":""}>
            <div style="flex:1">
              <div style="font-size:13px;font-weight:700">${a.name} · ${a.phone}</div>
              <div style="font-size:12px;color:#616161;margin-top:2px">${a.detail}, ${a.city}, ${a.province} ${a.zip}</div>
            </div>
            ${a.isDefault?'<span style="background:#fff5f5;color:#ee4d2d;font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;border:1px solid #ffcdd2;white-space:nowrap">Utama</span>':""}
          </div>`).join("");
      }
    }
  } else {
    const banner = document.getElementById("checkout-login-banner");
    if (banner) banner.style.display = "flex";
  }

  updateSummary();

  // Listen for payment method change → show instructions preview
  document.addEventListener("change", e => {
    if (e.target.name === "shipping") updateSummary();
    if (e.target.name === "payment") {
      const isCicilan = e.target.value.startsWith("cicilan_");
      const tenorBox = document.getElementById("tenor-box");
      if (tenorBox) tenorBox.style.display = isCicilan ? "block" : "none";
      if (isCicilan) calcCicilan();

      // Show payment instructions preview in step 3
      const area = document.getElementById("payment-instructions-area");
      if (area) {
        const subtotal = cart.reduce((s,i) => s+i.price*i.qty, 0);
        const total = Math.max(0, subtotal + shippingCost - discountAmount);
        area.innerHTML = renderPaymentInstructions(e.target.value, null, total);
      }
    }
    if (e.target.name === "tenor") calcCicilan();
  });
});
