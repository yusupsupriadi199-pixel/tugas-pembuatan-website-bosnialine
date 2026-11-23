// ============================================================
// BOSNIALine — AUTH SYSTEM (localStorage + PHP API)
// ============================================================

const AUTH_API_BASE = "api";
const AUTH_KEY = "bosnialine_users";
const SESSION_KEY = "bosnialine_session";

// ============================================================
// VALIDASI NOMOR TELEPON INDONESIA
// ============================================================

/**
 * Validasi format nomor telepon Indonesia.
 * Menerima: 08xx, 8xx, +628xx, 628xx
 * Mengembalikan { valid, normalized, msg }
 */
function validatePhone(raw) {
  const cleaned = raw.replace(/[\s\-().]/g, "");

  // Normalisasi ke format +62xxx
  let normalized = cleaned;
  if (/^\+62/.test(cleaned))      normalized = cleaned;
  else if (/^62/.test(cleaned))   normalized = "+" + cleaned;
  else if (/^0/.test(cleaned))    normalized = "+62" + cleaned.slice(1);
  else if (/^8/.test(cleaned))    normalized = "+62" + cleaned;
  else return { valid: false, normalized: "", msg: "Format nomor tidak dikenali." };

  // Hapus +62, cek sisa digit
  const digits = normalized.slice(3); // setelah +62
  if (!/^\d+$/.test(digits))
    return { valid: false, normalized: "", msg: "Nomor hanya boleh mengandung angka." };

  if (digits.length < 7 || digits.length > 13)
    return { valid: false, normalized: "", msg: "Nomor telepon harus 9–15 digit." };

  // Validasi prefix operator Indonesia (8xx)
  if (!/^8/.test(digits))
    return { valid: false, normalized: "", msg: "Nomor HP Indonesia harus diawali 08 atau +628." };

  return { valid: true, normalized, msg: "" };
}

/**
 * Format nomor untuk tampilan: +62 812-3456-7890
 */
function formatPhoneDisplay(normalized) {
  const digits = normalized.replace("+62", "");
  if (digits.length <= 3)  return "+62 " + digits;
  if (digits.length <= 7)  return "+62 " + digits.slice(0,3) + "-" + digits.slice(3);
  return "+62 " + digits.slice(0,3) + "-" + digits.slice(3,7) + "-" + digits.slice(7);
}

/**
 * Pasang listener validasi real-time pada input telepon.
 * @param {string} inputId - ID elemen input
 * @param {string} feedbackId - ID elemen feedback (span/div)
 * @param {string} prefixId - (opsional) ID elemen prefix +62
 */
function attachPhoneValidator(inputId, feedbackId, prefixId = null) {
  const inp = document.getElementById(inputId);
  const fb  = document.getElementById(feedbackId);
  if (!inp || !fb) return;

  inp.addEventListener("input", () => {
    const val = inp.value.trim();
    if (!val) { fb.textContent = ""; fb.className = "phone-feedback"; return; }

    const result = validatePhone((prefixId ? "+62" : "") + val);
    if (result.valid) {
      fb.textContent = "✓ " + formatPhoneDisplay(result.normalized);
      fb.className = "phone-feedback valid";
    } else {
      fb.textContent = "✗ " + result.msg;
      fb.className = "phone-feedback invalid";
    }
  });

  inp.addEventListener("blur", () => {
    if (!inp.value.trim()) return;
    const result = validatePhone((prefixId ? "+62" : "") + inp.value.trim());
    if (result.valid) inp.value = result.normalized.replace("+62", "");
  });
}

// ============================================================
// SIMULASI OTP / VERIFIKASI EMAIL
// ============================================================

const OTP_KEY = "bosnialine_otp_store";

function _generateOTP() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

/**
 * Simpan OTP ke localStorage dengan expiry 5 menit.
 */
function _saveOTP(target, code) {
  const store = JSON.parse(localStorage.getItem(OTP_KEY) || "{}");
  store[target] = { code, expires: Date.now() + 5 * 60 * 1000, attempts: 0 };
  localStorage.setItem(OTP_KEY, JSON.stringify(store));
}

function _getOTP(target) {
  const store = JSON.parse(localStorage.getItem(OTP_KEY) || "{}");
  return store[target] || null;
}

function _clearOTP(target) {
  const store = JSON.parse(localStorage.getItem(OTP_KEY) || "{}");
  delete store[target];
  localStorage.setItem(OTP_KEY, JSON.stringify(store));
}

/**
 * Kirim OTP simulasi.
 * @param {string} type - "email" | "phone"
 * @param {string} target - alamat email atau nomor HP
 * @returns {{ ok: boolean, code: string (dev only), msg: string }}
 */
function sendOTP(type, target) {
  const code = _generateOTP();
  _saveOTP(target, code);

  // Simulasi: tampilkan kode di console & toast (di produksi ganti dengan SMTP/SMS API)
  console.info(`[OTP Simulasi] Kode ${type === "email" ? "Email" : "SMS"} untuk ${target}: ${code}`);

  const displayTarget = type === "email"
    ? target.replace(/(.{2})(.*)(@.*)/, "$1***$3")
    : target.slice(0, 6) + "****" + target.slice(-3);

  showToast(`📨 Kode OTP dikirim ke ${displayTarget} (cek console untuk dev)`);
  return { ok: true, code, msg: "" }; // `code` hanya untuk dev — hapus di produksi
}

/**
 * Verifikasi kode OTP yang dimasukkan user.
 */
function verifyOTP(target, inputCode) {
  const entry = _getOTP(target);
  if (!entry) return { ok: false, msg: "Kode OTP tidak ditemukan. Kirim ulang." };
  if (Date.now() > entry.expires) {
    _clearOTP(target);
    return { ok: false, msg: "Kode OTP sudah kedaluwarsa. Kirim ulang." };
  }
  entry.attempts = (entry.attempts || 0) + 1;
  if (entry.attempts > 5) {
    _clearOTP(target);
    return { ok: false, msg: "Terlalu banyak percobaan. Kirim ulang kode." };
  }
  // Update attempts
  const store = JSON.parse(localStorage.getItem(OTP_KEY) || "{}");
  store[target] = entry;
  localStorage.setItem(OTP_KEY, JSON.stringify(store));

  if (inputCode.trim() !== entry.code)
    return { ok: false, msg: "Kode OTP salah." };

  _clearOTP(target);
  return { ok: true, msg: "" };
}

// ============================================================
// OTP MODAL — tampilkan dialog input kode
// ============================================================

/**
 * Tampilkan modal OTP input.
 * @param {object} opts
 *   type: "email"|"phone"
 *   target: email atau nomor HP
 *   onSuccess: callback() dipanggil saat OTP benar
 */
function showOTPModal({ type, target, onSuccess }) {
  // Kirim OTP pertama kali
  sendOTP(type, target);

  let secondsLeft = 60;
  let timerInterval = null;

  const overlay = document.createElement("div");
  overlay.id = "otp-modal-overlay";
  overlay.style.cssText = `
    position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:10000;
    display:flex;align-items:center;justify-content:center;padding:16px;
    animation:auth-pop 0.2s ease;
  `;

  const displayTarget = type === "email"
    ? target.replace(/(.{2})(.*)(@.*)/, "$1***$3")
    : target.slice(0, 6) + "****" + target.slice(-3);

  overlay.innerHTML = `
    <div style="background:white;border-radius:16px;padding:32px 28px;width:100%;max-width:380px;text-align:center;position:relative">
      <div style="font-size:48px;margin-bottom:12px">${type === "email" ? "📧" : "📱"}</div>
      <h3 style="font-size:18px;font-weight:800;margin-bottom:8px">Verifikasi ${type === "email" ? "Email" : "Nomor HP"}</h3>
      <p style="font-size:13px;color:#616161;margin-bottom:20px">
        Masukkan kode 6 digit yang dikirim ke<br>
        <strong>${displayTarget}</strong>
      </p>
      <div id="otp-boxes" style="display:flex;gap:8px;justify-content:center;margin-bottom:16px">
        ${[0,1,2,3,4,5].map(i => `
          <input type="text" maxlength="1" inputmode="numeric" pattern="[0-9]"
            class="otp-box" data-index="${i}"
            style="width:44px;height:52px;border:2px solid #e0e0e0;border-radius:10px;
                   text-align:center;font-size:22px;font-weight:700;outline:none;
                   transition:border-color 0.2s;font-family:monospace">
        `).join("")}
      </div>
      <div id="otp-error" style="background:#ffebee;color:#c62828;border-radius:8px;padding:8px 12px;font-size:12px;margin-bottom:12px;display:none"></div>
      <button id="otp-verify-btn" onclick="window._otpVerify()"
        style="width:100%;padding:13px;background:#e53935;color:white;border:none;
               border-radius:8px;font-size:15px;font-weight:700;cursor:pointer;margin-bottom:12px">
        Verifikasi
      </button>
      <div style="font-size:13px;color:#9e9e9e">
        Tidak menerima kode?
        <button id="otp-resend-btn" onclick="window._otpResend()"
          style="background:none;border:none;color:#e53935;font-weight:700;cursor:pointer;font-size:13px"
          disabled>Kirim ulang (<span id="otp-timer">60</span>s)</button>
      </div>
      <button onclick="window._otpCancel()"
        style="position:absolute;top:12px;right:12px;background:#f5f5f5;border:none;
               width:28px;height:28px;border-radius:50%;cursor:pointer;font-size:13px">✕</button>
    </div>
  `;

  document.body.appendChild(overlay);

  // OTP box — auto-focus & auto-advance
  const boxes = overlay.querySelectorAll(".otp-box");
  boxes[0].focus();

  boxes.forEach((box, i) => {
    box.addEventListener("input", e => {
      const val = e.target.value.replace(/\D/g, "");
      e.target.value = val;
      if (val && i < 5) boxes[i + 1].focus();
      if (val && i === 5) document.getElementById("otp-verify-btn").focus();
    });
    box.addEventListener("keydown", e => {
      if (e.key === "Backspace" && !box.value && i > 0) boxes[i - 1].focus();
      if (e.key === "Enter") window._otpVerify();
    });
    box.addEventListener("paste", e => {
      e.preventDefault();
      const pasted = (e.clipboardData || window.clipboardData).getData("text").replace(/\D/g, "").slice(0, 6);
      [...pasted].forEach((ch, idx) => { if (boxes[idx]) boxes[idx].value = ch; });
      if (boxes[Math.min(pasted.length, 5)]) boxes[Math.min(pasted.length, 5)].focus();
    });
    box.addEventListener("focus", () => box.style.borderColor = "#e53935");
    box.addEventListener("blur",  () => box.style.borderColor = box.value ? "#43a047" : "#e0e0e0");
  });

  // Timer countdown
  timerInterval = setInterval(() => {
    secondsLeft--;
    const timerEl = document.getElementById("otp-timer");
    const resendBtn = document.getElementById("otp-resend-btn");
    if (timerEl) timerEl.textContent = secondsLeft;
    if (secondsLeft <= 0) {
      clearInterval(timerInterval);
      if (resendBtn) {
        resendBtn.disabled = false;
        resendBtn.innerHTML = "Kirim ulang";
      }
    }
  }, 1000);

  // Handlers
  window._otpVerify = () => {
    const code = [...boxes].map(b => b.value).join("");
    if (code.length < 6) {
      const err = document.getElementById("otp-error");
      err.textContent = "Masukkan 6 digit kode OTP.";
      err.style.display = "block";
      return;
    }
    const result = verifyOTP(target, code);
    if (!result.ok) {
      const err = document.getElementById("otp-error");
      err.textContent = result.msg;
      err.style.display = "block";
      boxes.forEach(b => { b.style.borderColor = "#e53935"; b.value = ""; });
      boxes[0].focus();
      return;
    }
    clearInterval(timerInterval);
    overlay.remove();
    delete window._otpVerify;
    delete window._otpResend;
    delete window._otpCancel;
    onSuccess();
  };

  window._otpResend = () => {
    sendOTP(type, target);
    secondsLeft = 60;
    const resendBtn = document.getElementById("otp-resend-btn");
    const timerEl = document.getElementById("otp-timer");
    if (resendBtn) { resendBtn.disabled = true; resendBtn.innerHTML = `Kirim ulang (<span id="otp-timer">60</span>s)`; }
    const err = document.getElementById("otp-error");
    if (err) err.style.display = "none";
    boxes.forEach(b => b.value = "");
    boxes[0].focus();
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      secondsLeft--;
      const t = document.getElementById("otp-timer");
      if (t) t.textContent = secondsLeft;
      if (secondsLeft <= 0) {
        clearInterval(timerInterval);
        const rb = document.getElementById("otp-resend-btn");
        if (rb) { rb.disabled = false; rb.innerHTML = "Kirim ulang"; }
      }
    }, 1000);
  };

  window._otpCancel = () => {
    clearInterval(timerInterval);
    overlay.remove();
    delete window._otpVerify;
    delete window._otpResend;
    delete window._otpCancel;
  };
}

async function apiRequest(endpoint, data = null, method = "POST") {
  const opts = {
    method,
    credentials: 'include',
    headers: {}
  };
  if (method !== "GET") {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(data);
  }
  const response = await fetch(`${AUTH_API_BASE}/${endpoint}`, opts);
  if (!response.ok) throw new Error(`API error ${response.status}`);
  return response.json();
}

// ---- Helpers ----
function getUsers() {
  return JSON.parse(localStorage.getItem(AUTH_KEY) || "[]");
}
function saveUsers(users) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(users));
}
function getCurrentUser() {
  const id = localStorage.getItem(SESSION_KEY);
  if (!id) return null;
  return getUsers().find(u => u.id === id) || null;
}
function saveSession(userId) {
  localStorage.setItem(SESSION_KEY, userId);
}
function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

// ---- Register ----
async function authRegister({ name, email, phone, password }) {
  // Validasi nomor telepon sebelum dikirim
  const phoneResult = validatePhone(phone);
  if (!phoneResult.valid) return { ok: false, msg: "Nomor telepon: " + phoneResult.msg };
  const normalizedPhone = phoneResult.normalized;

  try {
    const res = await apiRequest("auth.php?action=register", { name, email, phone: normalizedPhone, password }, "POST");
    if (res.ok) {
      const user = res.user;
      const users = getUsers();
      if (!users.find(u => u.email === user.email)) {
        users.push(user);
        saveUsers(users);
      }
      saveSession(user.id);
      return { ok: true, user };
    }
    return { ok: false, msg: res.msg || "Gagal mendaftar." };
  } catch (error) {
    const users = getUsers();
    if (users.find(u => u.email === email)) {
      return { ok: false, msg: "Email sudah terdaftar." };
    }
    const user = {
      id: "U" + Date.now(),
      name, email,
      phone: normalizedPhone,
      password,
      avatar: "",
      addresses: [],
      wallet: 0,
      emailVerified: false,
      phoneVerified: false,
      createdAt: new Date().toLocaleString("id-ID")
    };
    users.push(user);
    saveUsers(users);
    saveSession(user.id);
    return { ok: true, user };
  }
}

// ---- Login ----
async function authLogin({ email, password }) {
  try {
    const res = await apiRequest("auth.php?action=login", { email, password }, "POST");
    if (res.ok) {
      const user = res.user;
      const users = getUsers();
      if (!users.find(u => u.email === user.email)) {
        users.push(user);
        saveUsers(users);
      }
      saveSession(user.id);
      return { ok: true, user };
    }
    return { ok: false, msg: res.msg || "Email atau password salah." };
  } catch (error) {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return { ok: false, msg: "Email atau password salah." };
    saveSession(user.id);
    return { ok: true, user };
  }
}

// ---- Logout ----
async function authLogout() {
  try {
    await apiRequest("auth.php?action=logout", null, "POST");
  } catch (error) {
    console.warn("Logout API gagal:", error);
  }
  clearSession();
  window.location.href = "index.html";
}

// ---- Update profile ----
function authUpdateProfile(data) {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === data.id);
  if (idx === -1) return false;
  users[idx] = { ...users[idx], ...data };
  saveUsers(users);
  return true;
}

// ---- Add address ----
function authAddAddress(userId, addr) {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === userId);
  if (idx === -1) return false;
  addr.id = "A" + Date.now();
  if (!users[idx].addresses.length) addr.isDefault = true;
  users[idx].addresses.push(addr);
  saveUsers(users);
  return true;
}

// ---- Set default address ----
function authSetDefaultAddress(userId, addrId) {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === userId);
  if (idx === -1) return;
  users[idx].addresses.forEach(a => a.isDefault = a.id === addrId);
  saveUsers(users);
}

// ---- Delete address ----
function authDeleteAddress(userId, addrId) {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === userId);
  if (idx === -1) return;
  users[idx].addresses = users[idx].addresses.filter(a => a.id !== addrId);
  saveUsers(users);
}

// ---- Get user orders ----
function getUserOrders(userId) {
  const all = JSON.parse(localStorage.getItem("bosnialine_orders") || "[]");
  return all.filter(o => o.userId === userId);
}

// ============================================================
// NAVBAR AUTH WIDGET — inject ke semua halaman
// ============================================================
function injectAuthWidget() {
  const navActions = document.querySelector(".nav-actions");
  if (!navActions) return;

  const user = getCurrentUser();

  // Remove existing auth widget if any
  const existing = document.getElementById("nav-auth-widget");
  if (existing) existing.remove();

  const wrap = document.createElement("div");
  wrap.id = "nav-auth-widget";
  wrap.style.cssText = "position:relative;display:flex;align-items:center";

  if (!user) {
    wrap.innerHTML = `
      <a href="login.html" class="nav-btn nav-login-btn" style="background:rgba(255,255,255,0.15);border-radius:6px;padding:6px 14px;font-size:12px;font-weight:700;color:white;white-space:nowrap;border:1.5px solid rgba(255,255,255,0.4)">
        Masuk / Daftar
      </a>`;
  } else {
    const initials = user.name.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase();
    wrap.innerHTML = `
      <button class="nav-btn" id="nav-user-btn" onclick="toggleUserMenu()" style="display:flex;flex-direction:row;align-items:center;gap:8px;padding:4px 10px;background:rgba(255,255,255,0.12);border-radius:8px;border:1.5px solid rgba(255,255,255,0.3)">
        <div style="width:30px;height:30px;border-radius:50%;background:#ffeb3b;color:#212121;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;flex-shrink:0">${initials}</div>
        <span style="font-size:12px;font-weight:700;max-width:80px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${user.name.split(" ")[0]}</span>
        <span style="font-size:10px;opacity:0.7">▼</span>
      </button>
      <div id="user-dropdown" class="user-dropdown" style="display:none">
        <div class="user-dropdown-header">
          <div class="ud-avatar">${initials}</div>
          <div>
            <div class="ud-name">${user.name}</div>
            <div class="ud-email">${user.email}</div>
          </div>
        </div>
        <div class="ud-divider"></div>
        <a href="profile.html" class="ud-item">👤 Profil Saya</a>
        <a href="profile.html#addresses" class="ud-item">📍 Alamat Saya</a>
        <a href="orders.html" class="ud-item">📦 Pesanan Saya</a>
        <div class="ud-divider"></div>
        <button class="ud-item ud-logout" onclick="authLogout()">🚪 Keluar</button>
      </div>`;
  }

  // Insert before cart button
  const cartBtn = navActions.querySelector(".cart-trigger");
  if (cartBtn) navActions.insertBefore(wrap, cartBtn);
  else navActions.appendChild(wrap);

  // Close dropdown on outside click
  document.addEventListener("click", e => {
    const dd = document.getElementById("user-dropdown");
    const btn = document.getElementById("nav-user-btn");
    if (dd && !dd.contains(e.target) && btn && !btn.contains(e.target)) {
      dd.style.display = "none";
    }
  });
}

function toggleUserMenu() {
  const dd = document.getElementById("user-dropdown");
  if (dd) dd.style.display = dd.style.display === "none" ? "block" : "none";
}

// ============================================================
// AUTH MODAL (login/register popup dari halaman manapun)
// ============================================================
function openAuthModal(tab = "login") {
  let modal = document.getElementById("auth-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "auth-modal";
    modal.className = "auth-modal-overlay";
    modal.innerHTML = buildAuthModalHTML();
    document.body.appendChild(modal);
    modal.addEventListener("click", e => {
      if (e.target === modal) closeAuthModal();
    });
  }
  modal.style.display = "flex";
  document.body.style.overflow = "hidden";
  switchAuthTab(tab);
}

function closeAuthModal() {
  const modal = document.getElementById("auth-modal");
  if (modal) { modal.style.display = "none"; document.body.style.overflow = ""; }
}

function buildAuthModalHTML() {
  return `
  <div class="auth-modal-box">
    <button class="auth-modal-close" onclick="closeAuthModal()">✕</button>
    <div class="auth-logo">💻 BOSNIA<span>Line</span></div>

    <div class="auth-tabs">
      <button class="auth-tab active" id="tab-login" onclick="switchAuthTab('login')">Masuk</button>
      <button class="auth-tab" id="tab-register" onclick="switchAuthTab('register')">Daftar</button>
    </div>

    <!-- LOGIN FORM -->
    <form id="auth-login-form" onsubmit="handleLogin(event)">
      <div class="auth-field">
        <label>Email</label>
        <input type="email" id="login-email" placeholder="email@contoh.com" required autocomplete="email">
      </div>
      <div class="auth-field">
        <label>Password</label>
        <div class="auth-pw-wrap">
          <input type="password" id="login-password" placeholder="Password" required autocomplete="current-password">
          <button type="button" class="auth-pw-toggle" onclick="togglePw('login-password',this)">👁</button>
        </div>
      </div>
      <div id="login-error" class="auth-error" style="display:none"></div>
      <button type="submit" class="auth-submit-btn">Masuk</button>
      <div class="auth-divider"><span>atau masuk dengan</span></div>
      <div class="auth-social">
        <button type="button" class="auth-social-btn" onclick="socialLoginDemo('Google')">
          <svg viewBox="0 0 24 24" width="18" height="18"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Google
        </button>
        <button type="button" class="auth-social-btn" onclick="socialLoginDemo('Facebook')">
          <svg viewBox="0 0 24 24" width="18" height="18"><path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          Facebook
        </button>
      </div>
      <p class="auth-switch">Belum punya akun? <button type="button" onclick="switchAuthTab('register')">Daftar sekarang</button></p>
    </form>

    <!-- REGISTER FORM -->
    <form id="auth-register-form" onsubmit="handleRegister(event)" style="display:none">
      <div class="auth-field">
        <label>Nama Lengkap</label>
        <input type="text" id="reg-name" placeholder="Nama lengkap kamu" required>
      </div>
      <div class="auth-field">
        <label>Email</label>
        <input type="email" id="reg-email" placeholder="email@contoh.com" required autocomplete="email">
      </div>
      <div class="auth-field">
        <label>No. Telepon</label>
        <input type="tel" id="reg-phone" placeholder="08xx-xxxx-xxxx" required>
      </div>
      <div class="auth-field">
        <label>Password</label>
        <div class="auth-pw-wrap">
          <input type="password" id="reg-password" placeholder="Min. 6 karakter" required minlength="6" autocomplete="new-password">
          <button type="button" class="auth-pw-toggle" onclick="togglePw('reg-password',this)">👁</button>
        </div>
      </div>
      <div class="auth-field">
        <label>Konfirmasi Password</label>
        <div class="auth-pw-wrap">
          <input type="password" id="reg-password2" placeholder="Ulangi password" required autocomplete="new-password">
          <button type="button" class="auth-pw-toggle" onclick="togglePw('reg-password2',this)">👁</button>
        </div>
      </div>
      <div id="reg-error" class="auth-error" style="display:none"></div>
      <div class="auth-tos">
        <input type="checkbox" id="reg-tos" required>
        <label for="reg-tos">Saya setuju dengan <a href="#" onclick="return false">Syarat & Ketentuan</a> dan <a href="#" onclick="return false">Kebijakan Privasi</a> BOSNIALine</label>
      </div>
      <button type="submit" class="auth-submit-btn">Daftar Sekarang</button>
      <p class="auth-switch">Sudah punya akun? <button type="button" onclick="switchAuthTab('login')">Masuk</button></p>
    </form>
  </div>`;
}

function switchAuthTab(tab) {
  document.getElementById("tab-login").classList.toggle("active", tab === "login");
  document.getElementById("tab-register").classList.toggle("active", tab === "register");
  document.getElementById("auth-login-form").style.display = tab === "login" ? "block" : "none";
  document.getElementById("auth-register-form").style.display = tab === "register" ? "block" : "none";
}

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;
  const res = await authLogin({ email, password });
  if (!res.ok) {
    showAuthError("login-error", res.msg);
    return;
  }
  closeAuthModal();
  injectAuthWidget();
  showToast("✅ Selamat datang, " + res.user.name + "!");
  if (window.location.pathname.includes("login.html")) {
    const next = new URLSearchParams(window.location.search).get("next") || "index.html";
    window.location.href = next;
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById("reg-name").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const phone = document.getElementById("reg-phone").value.trim();
  const password = document.getElementById("reg-password").value;
  const password2 = document.getElementById("reg-password2").value;
  if (password !== password2) { showAuthError("reg-error", "Password tidak cocok."); return; }

  // Validasi telepon sebelum kirim
  const phoneCheck = validatePhone(phone);
  if (!phoneCheck.valid) { showAuthError("reg-error", "No. HP: " + phoneCheck.msg); return; }

  const res = await authRegister({ name, email, phone, password });
  if (!res.ok) { showAuthError("reg-error", res.msg); return; }

  // Tutup modal dulu, lalu tampilkan OTP email
  closeAuthModal();

  showOTPModal({
    type: "email",
    target: email,
    onSuccess: () => {
      // Tandai email terverifikasi
      const users = getUsers();
      const idx = users.findIndex(u => u.email === email);
      if (idx !== -1) { users[idx].emailVerified = true; saveUsers(users); }

      injectAuthWidget();
      showToast("🎉 Akun berhasil dibuat & email terverifikasi! Selamat datang, " + res.user.name + "!");
      if (window.location.pathname.includes("login.html")) {
        window.location.href = "index.html";
      }
    }
  });
}

function showAuthError(id, msg) {
  const el = document.getElementById(id);
  if (el) { el.textContent = msg; el.style.display = "block"; }
}

function togglePw(inputId, btn) {
  const inp = document.getElementById(inputId);
  if (!inp) return;
  inp.type = inp.type === "password" ? "text" : "password";
  btn.textContent = inp.type === "password" ? "👁" : "🙈";
}

async function socialLoginDemo(provider) {
  const email = provider.toLowerCase() + "_demo@bosnialine.id";
  const users = getUsers();
  let user = users.find(u => u.email === email);
  if (!user) {
    const res = await authRegister({ name: provider + " User", email, phone: "08000000000", password: "social_" + provider });
    if (!res.ok) {
      showAuthError("login-error", res.msg);
      return;
    }
    user = res.user;
  } else {
    const res = await authLogin({ email, password: "social_" + provider });
    if (!res.ok) {
      showAuthError("login-error", res.msg);
      return;
    }
    user = res.user;
  }
  closeAuthModal();
  injectAuthWidget();
  showToast("✅ Masuk dengan " + provider);
  if (window.location.pathname.includes("login.html")) {
    window.location.href = "index.html";
  }
}

// ============================================================
// GUARD — redirect ke login jika belum login
// ============================================================
function requireAuth(redirectBack = true) {
  const user = getCurrentUser();
  if (!user) {
    const next = redirectBack ? encodeURIComponent(window.location.href) : "";
    window.location.href = "login.html" + (next ? "?next=" + next : "");
    return null;
  }
  return user;
}

// ============================================================
// AUTO-INIT on DOMContentLoaded
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  injectAuthWidget();
});
