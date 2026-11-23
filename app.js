const _defaultProducts = [
  {
    id: 1, name: "Laptop ASUS VivoBook 15", category: "laptop",
    price: 8500000, originalPrice: 9500000, discount: 11,
    rating: 4.7, reviews: 234, sold: 1200,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
    images: [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600",
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600"
    ],
    specs: "Intel Core i5-1235U | RAM 8GB DDR4 | SSD 512GB | 15.6\" FHD | Windows 11",
    weight: 1500,
    description: "Laptop tipis dan ringan cocok untuk kerja dan kuliah. Performa tinggi dengan prosesor Intel generasi terbaru.",
    badge: "Terlaris", stock: 45
  },
  {
    id: 2, name: "PC Gaming BOSNIALINE Titan X", category: "komputer",
    price: 15000000, originalPrice: 17000000, discount: 12,
    rating: 4.9, reviews: 89, sold: 320,
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400",
    images: [
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600",
      "https://images.unsplash.com/photo-1593640408182-31c228b29b5e?w=600",
      "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600"
    ],
    specs: "Intel Core i7-13700K | RAM 16GB DDR5 | RTX 4060 | SSD 1TB NVMe | Windows 11",
    weight: 8000,
    description: "PC Gaming rakitan premium siap pakai. Cocok untuk gaming AAA dan streaming dengan performa maksimal.",
    badge: "Best Seller", stock: 12
  },
  {
    id: 3, name: "Laptop Lenovo IdeaPad Slim 3", category: "laptop",
    price: 6200000, originalPrice: 7000000, discount: 11,
    rating: 4.5, reviews: 412, sold: 2100,
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400",
    images: [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600"
    ],
    specs: "AMD Ryzen 5 7520U | RAM 8GB | SSD 256GB | 14\" FHD | Windows 11",
    weight: 1400,
    description: "Laptop entry-level terbaik untuk pelajar dan mahasiswa. Ringan, tahan lama, dan harga terjangkau.",
    badge: "Hemat", stock: 78
  },
  {
    id: 4, name: "Monitor LG UltraWide 27\"", category: "monitor",
    price: 4200000, originalPrice: 4800000, discount: 13,
    rating: 4.6, reviews: 156, sold: 540,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400",
    images: [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600",
      "https://images.unsplash.com/photo-1593640408182-31c228b29b5e?w=600"
    ],
    specs: "27\" IPS | 2560x1440 QHD | 165Hz | 1ms | HDR400 | HDMI + DisplayPort",
    weight: 5500,
    description: "Monitor gaming dan kerja resolusi tinggi. Warna akurat dan refresh rate tinggi untuk pengalaman terbaik.",
    badge: "Promo", stock: 30
  },
  {
    id: 5, name: "Laptop MacBook Air M2", category: "laptop",
    price: 18500000, originalPrice: 20000000, discount: 8,
    rating: 4.9, reviews: 678, sold: 890,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600",
      "https://images.unsplash.com/photo-1611186871525-9c4f9b855c3e?w=600"
    ],
    specs: "Apple M2 | RAM 8GB Unified | SSD 256GB | 13.6\" Liquid Retina | macOS",
    weight: 1250,
    description: "Laptop premium Apple dengan chip M2 revolusioner. Performa luar biasa dengan daya tahan baterai hingga 18 jam.",
    badge: "Premium", stock: 20
  },
  {
    id: 6, name: "Keyboard Mechanical Rexus MX9", category: "aksesoris",
    price: 850000, originalPrice: 1000000, discount: 15,
    rating: 4.4, reviews: 320, sold: 1500,
    image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400",
    images: [
      "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=600",
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600"
    ],
    specs: "Switch Blue | RGB Backlight | TKL Layout | USB | Anti-ghosting",
    weight: 950,
    description: "Keyboard mechanical gaming dengan RGB yang memukau. Tactile feedback sempurna untuk gaming dan mengetik.",
    badge: "Diskon", stock: 200
  },
  {
    id: 7, name: "PC All-in-One ASUS Zen AiO", category: "komputer",
    price: 12000000, originalPrice: 13500000, discount: 11,
    rating: 4.6, reviews: 67, sold: 210,
    image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=400",
    images: [
      "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600",
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600"
    ],
    specs: "Intel Core i5-1240P | RAM 16GB | SSD 512GB | 23.8\" FHD Touch | Windows 11",
    weight: 7000,
    description: "PC All-in-One elegan untuk rumah dan kantor. Desain minimalis tanpa kabel berantakan.",
    badge: "Baru", stock: 15
  },
  {
    id: 8, name: "Mouse Gaming Logitech G502 X", category: "aksesoris",
    price: 950000, originalPrice: 1100000, discount: 14,
    rating: 4.8, reviews: 445, sold: 2300,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400",
    images: [
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600"
    ],
    specs: "25600 DPI | HERO 25K Sensor | 13 Programmable Buttons | RGB | USB",
    weight: 110,
    description: "Mouse gaming flagship Logitech dengan sensor terbaik di kelasnya. Presisi tinggi untuk gaming kompetitif.",
    badge: "Terlaris", stock: 150
  }
];

// Gunakan produk dari admin (localStorage) jika ada, fallback ke default
const products = JSON.parse(localStorage.getItem("bosnialine_products") || "null") || _defaultProducts;

const API_BASE = "api";

function formatPrice(price) {
  return "Rp " + price.toLocaleString("id-ID");
}

async function apiRequest(endpoint, data = null, method = "GET") {
  const opts = {
    method,
    credentials: 'include',
    headers: {}
  };
  if (method !== "GET") {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(data);
  }
  const response = await fetch(`${API_BASE}/${endpoint}`, opts);
  if (!response.ok) throw new Error(`API request failed: ${response.status}`);
  return response.json();
}

async function loadProductsFromApi() {
  try {
    const res = await apiRequest("products.php?action=list");
    if (res.ok && Array.isArray(res.products)) {
      products = res.products.map(p => ({
        ...p,
        images: Array.isArray(p.images) ? p.images : JSON.parse(p.images || '[]')
      }));
      renderHomeProducts();
    }
  } catch (error) {
    console.warn("Gagal memuat produk dari server:", error);
  }
}

function renderHomeProducts() {
  const laptopGrid = document.getElementById("laptop-grid");
  const komputerGrid = document.getElementById("komputer-grid");
  const allGrid = document.getElementById("all-grid");
  if (laptopGrid) laptopGrid.innerHTML = products.filter(p => p.category === "laptop").slice(0, 4).map(renderCard).join("");
  if (komputerGrid) komputerGrid.innerHTML = products.filter(p => p.category === "komputer").slice(0, 4).map(renderCard).join("");
  if (allGrid) allGrid.innerHTML = products.sort((a,b) => (b.sold || 0) - (a.sold || 0)).slice(0,4).map(renderCard).join("");
}

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  let stars = "";
  for (let i = 0; i < full; i++) stars += "★";
  if (half) stars += "½";
  while (stars.replace("½","x").length < 5) stars += "☆";
  return stars;
}

function getProduct(id) {
  return products.find(p => p.id === parseInt(id));
}

function getRecommended(excludeId, limit = 4) {
  return products.filter(p => p.id !== excludeId).slice(0, limit);
}

let cart = JSON.parse(localStorage.getItem("bosnialine_cart") || "[]");

function addToCart(productId, qty = 1) {
  const product = getProduct(productId);
  if (!product) return;
  const itemWeight = product.weight || 0;
  const existing = cart.find(i => i.id === productId);
  if (existing) {
    existing.qty += qty;
    existing.weight = existing.weight || itemWeight;
  } else {
    cart.push({ id: productId, qty, name: product.name, price: product.price, image: product.image, weight: itemWeight });
  }
  localStorage.setItem("bosnialine_cart", JSON.stringify(cart));
  updateCartBadge();
  showToast("Produk ditambahkan ke keranjang!");
}

function updateCartBadge() {
  const badge = document.getElementById("cart-badge");
  if (badge) {
    const total = cart.reduce((s, i) => s + i.qty, 0);
    badge.textContent = total;
    badge.style.display = total > 0 ? "flex" : "none";
  }
}

function showToast(msg) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  loadProductsFromApi();
});
