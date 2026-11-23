// ============================================================
// BOSNIALine - Multi Language System
// Bahasa: ID, EN, JA, ZH, SU
// ============================================================

const LANGUAGES = {
  id: { label: "🇮🇩 Indonesia", name: "Indonesia" },
  en: { label: "🇺🇸 English",   name: "English" },
  ja: { label: "🇯🇵 日本語",     name: "日本語" },
  zh: { label: "🇨🇳 中文",       name: "中文" },
  su: { label: "🌿 Sunda",      name: "Basa Sunda" }
};

const TRANSLATIONS = {
  // ---- NAVBAR ----
  nav_search_placeholder: {
    id: "Cari laptop, komputer, aksesoris...",
    en: "Search laptops, computers, accessories...",
    ja: "ノートパソコン、コンピューター、アクセサリーを検索...",
    zh: "搜索笔记本、电脑、配件...",
    su: "Sungsi laptop, komputer, aksesoris..."
  },
  nav_admin:    { id:"Admin",    en:"Admin",    ja:"管理者",  zh:"管理员",  su:"Admin" },
  nav_orders:   { id:"Pesanan",  en:"Orders",   ja:"注文",    zh:"订单",    su:"Pesenan" },
  nav_search:   { id:"Cari",     en:"Search",   ja:"検索",    zh:"搜索",    su:"Sungsi" },
  nav_cart:     { id:"Keranjang",en:"Cart",      ja:"カート",  zh:"购物车",  su:"Karanjang" },

  // ---- CATEGORY NAV ----
  cat_all:        { id:"Semua",     en:"All",        ja:"すべて",    zh:"全部",     su:"Sadayana" },
  cat_laptop:     { id:"Laptop",    en:"Laptop",     ja:"ノートPC",  zh:"笔记本",   su:"Laptop" },
  cat_komputer:   { id:"Komputer",  en:"Computer",   ja:"コンピューター", zh:"电脑", su:"Komputer" },
  cat_monitor:    { id:"Monitor",   en:"Monitor",    ja:"モニター",  zh:"显示器",   su:"Monitor" },
  cat_aksesoris:  { id:"Aksesoris", en:"Accessories",ja:"アクセサリー",zh:"配件",   su:"Aksesoris" },
  cat_printer:    { id:"Printer",   en:"Printer",    ja:"プリンター",zh:"打印机",   su:"Printer" },
  cat_networking: { id:"Networking",en:"Networking", ja:"ネットワーク",zh:"网络",   su:"Networking" },
  cat_storage:    { id:"Storage",   en:"Storage",    ja:"ストレージ",zh:"存储",     su:"Storage" },

  // ---- BANNER ----
  banner_tag:   { id:"🔥 FLASH SALE HARI INI", en:"🔥 TODAY'S FLASH SALE", ja:"🔥 本日のフラッシュセール", zh:"🔥 今日闪购", su:"🔥 FLASH SALE AYEUNA" },
  banner_h1:    { id:"Laptop & PC Gaming<br>Harga Terbaik!", en:"Laptop & Gaming PC<br>Best Prices!", ja:"ノートPC & ゲーミングPC<br>最安値！", zh:"笔记本 & 游戏电脑<br>最优惠价格！", su:"Laptop & PC Gaming<br>Harga Pangalusna!" },
  banner_p:     { id:"Diskon hingga 20% untuk semua produk pilihan BOSNIALine", en:"Up to 20% discount on all selected BOSNIALine products", ja:"BOSNIALineの厳選商品が最大20%オフ", zh:"BOSNIALine精选商品最高享8折优惠", su:"Diskon nepi ka 20% keur sadaya produk pilihan BOSNIALine" },
  banner_btn:   { id:"Belanja Sekarang →", en:"Shop Now →", ja:"今すぐ購入 →", zh:"立即购买 →", su:"Balanja Ayeuna →" },

  // ---- PROMO STRIP ----
  promo_ongkir_title: { id:"Gratis Ongkir",   en:"Free Shipping",    ja:"送料無料",      zh:"免费配送",    su:"Gratis Ongkos" },
  promo_ongkir_desc:  { id:"Untuk pembelian di atas Rp 500rb", en:"For orders above Rp 500K", ja:"Rp50万以上のご注文", zh:"订单满50万盾", su:"Keur beuli leuwih ti Rp 500rb" },
  promo_garansi_title:{ id:"Garansi Resmi",   en:"Official Warranty", ja:"正規保証",      zh:"官方保修",    su:"Garansi Resmi" },
  promo_garansi_desc: { id:"Semua produk bergaransi resmi", en:"All products with official warranty", ja:"全商品に正規保証付き", zh:"所有产品均有官方保修", su:"Sadaya produk aya garansi resmi" },
  promo_retur_title:  { id:"Retur 7 Hari",    en:"7-Day Returns",    ja:"7日間返品可",   zh:"7天退货",     su:"Mulang 7 Poé" },
  promo_retur_desc:   { id:"Tidak puas? Kembalikan saja", en:"Not satisfied? Return it", ja:"ご満足いただけない場合は返品可", zh:"不满意？可退货", su:"Teu puas? Balikkeun wé" },
  promo_cicilan_title:{ id:"Cicilan 0%",      en:"0% Installment",   ja:"分割払い0%",    zh:"零利率分期",  su:"Cicilan 0%" },
  promo_cicilan_desc: { id:"Tersedia cicilan tanpa bunga", en:"Interest-free installments available", ja:"無利子分割払い対応", zh:"提供免息分期付款", su:"Aya cicilan tanpa bunga" },

  // ---- SECTION TITLES ----
  sec_kategori:   { id:"Kategori Produk",       en:"Product Categories",  ja:"商品カテゴリー",  zh:"产品分类",    su:"Kategori Produk" },
  sec_laptop:     { id:"Rekomendasi Laptop",    en:"Laptop Recommendations",ja:"おすすめノートPC",zh:"推荐笔记本",  su:"Rekomendasi Laptop" },
  sec_komputer:   { id:"Rekomendasi Komputer",  en:"Computer Recommendations",ja:"おすすめPC",  zh:"推荐电脑",    su:"Rekomendasi Komputer" },
  sec_terlaris:   { id:"Produk Terlaris",       en:"Best Sellers",        ja:"ベストセラー",    zh:"热销产品",    su:"Produk Pangpopulerna" },
  see_all:        { id:"Lihat Semua →",         en:"See All →",           ja:"すべて見る →",   zh:"查看全部 →",  su:"Tingali Sadayana →" },

  // ---- PRODUCT CARD ----
  btn_cart:   { id:"+ Keranjang", en:"+ Cart",    ja:"+ カート", zh:"+ 购物车", su:"+ Karanjang" },
  sold:       { id:"terjual",     en:"sold",      ja:"販売済み",  zh:"已售",    su:"kaical" },

  // ---- FOOTER ----
  footer_desc:    { id:"Toko komputer dan laptop terpercaya dengan produk original bergaransi resmi. Melayani seluruh Indonesia sejak 2010.", en:"Trusted computer and laptop store with original products and official warranty. Serving all of Indonesia since 2010.", ja:"正規保証付きの正規品を取り扱う信頼のコンピューター・ノートPCショップ。2010年より全インドネシアにサービス提供。", zh:"值得信赖的电脑和笔记本商店，提供正品和官方保修。自2010年起服务全印度尼西亚。", su:"Toko komputer jeung laptop anu dipercaya kalayan produk asli anu aya garansi resmi. Ngalayanan sakuliah Indonesia ti taun 2010." },
  footer_layanan: { id:"Layanan",   en:"Services",  ja:"サービス",  zh:"服务",    su:"Layanan" },
  footer_pemesanan:{ id:"Cara Pemesanan", en:"How to Order", ja:"注文方法", zh:"如何下单", su:"Cara Mesenan" },
  footer_pengiriman:{ id:"Pengiriman", en:"Shipping", ja:"配送",    zh:"配送",    su:"Pangiriman" },
  footer_pengembalian:{ id:"Pengembalian", en:"Returns", ja:"返品",  zh:"退货",    su:"Mulangkeun" },
  footer_garansi: { id:"Garansi",   en:"Warranty",  ja:"保証",     zh:"保修",    su:"Garansi" },
  footer_kategori:{ id:"Kategori",  en:"Categories",ja:"カテゴリー",zh:"分类",    su:"Kategori" },
  footer_hubungi: { id:"Hubungi Kami", en:"Contact Us", ja:"お問い合わせ", zh:"联系我们", su:"Hubungi Kami" },
  footer_copy:    { id:"© 2026 BOSNIALine. Semua hak dilindungi.", en:"© 2026 BOSNIALine. All rights reserved.", ja:"© 2026 BOSNIALine. 全著作権所有。", zh:"© 2026 BOSNIALine. 版权所有。", su:"© 2026 BOSNIALine. Sadaya hak dilindungi." },

  // ---- SEARCH PAGE ----
  filter_title:   { id:"🔧 Filter",  en:"🔧 Filter",  ja:"🔧 フィルター", zh:"🔧 筛选", su:"🔧 Filter" },
  filter_cat:     { id:"Kategori",   en:"Category",   ja:"カテゴリー",    zh:"分类",    su:"Kategori" },
  filter_price:   { id:"Rentang Harga", en:"Price Range", ja:"価格帯",    zh:"价格范围", su:"Rentang Harga" },
  filter_rating:  { id:"Rating Minimum", en:"Min Rating", ja:"最低評価",  zh:"最低评分", su:"Rating Minimum" },
  filter_apply:   { id:"Terapkan Filter", en:"Apply Filter", ja:"フィルター適用", zh:"应用筛选", su:"Terapkeun Filter" },
  filter_reset:   { id:"Reset",      en:"Reset",      ja:"リセット",      zh:"重置",    su:"Reset" },
  sort_default:   { id:"Urutkan: Default", en:"Sort: Default", ja:"並び替え: デフォルト", zh:"排序: 默认", su:"Urutan: Default" },
  sort_price_asc: { id:"Harga: Terendah", en:"Price: Lowest", ja:"価格: 安い順", zh:"价格: 从低到高", su:"Harga: Pangmurahna" },
  sort_price_desc:{ id:"Harga: Tertinggi",en:"Price: Highest",ja:"価格: 高い順", zh:"价格: 从高到低", su:"Harga: Pangmahalna" },
  sort_rating:    { id:"Rating Tertinggi",en:"Highest Rating",ja:"評価: 高い順", zh:"评分最高",       su:"Rating Pangluhurna" },
  sort_sold:      { id:"Terlaris",   en:"Best Selling",ja:"売れ筋",        zh:"最畅销",  su:"Panglarisna" },
  sort_discount:  { id:"Diskon Terbesar",en:"Biggest Discount",ja:"割引率: 高い順",zh:"折扣最大", su:"Diskon Panggedena" },
  no_results:     { id:"Produk tidak ditemukan.", en:"No products found.", ja:"商品が見つかりません。", zh:"未找到产品。", su:"Produk teu kapanggih." },
  no_results_sub: { id:"Coba kata kunci atau filter lain.", en:"Try different keywords or filters.", ja:"別のキーワードやフィルターをお試しください。", zh:"请尝试其他关键词或筛选条件。", su:"Coba kecap konci atawa filter séjén." },
  results_found:  { id:"produk ditemukan", en:"products found", ja:"件の商品", zh:"件产品", su:"produk kapanggih" },

  // ---- PRODUCT DETAIL ----
  spec_label:     { id:"Spesifikasi",  en:"Specifications", ja:"仕様",      zh:"规格",    su:"Spésifikasi" },
  stock_label:    { id:"Stok:",        en:"Stock:",         ja:"在庫:",      zh:"库存:",   su:"Stok:" },
  stock_unit:     { id:"unit tersedia",en:"units available",ja:"点在庫あり", zh:"件有货",  su:"unit sadia" },
  qty_label:      { id:"Jumlah:",      en:"Qty:",           ja:"数量:",      zh:"数量:",   su:"Jumlah:" },
  btn_buy:        { id:"⚡ Beli Sekarang", en:"⚡ Buy Now",  ja:"⚡ 今すぐ購入", zh:"⚡ 立即购买", su:"⚡ Beuli Ayeuna" },
  btn_add_cart:   { id:"🛒 + Keranjang", en:"🛒 + Cart",    ja:"🛒 + カート", zh:"🛒 + 购物车", su:"🛒 + Karanjang" },
  guarantee_1:    { id:"✅ Garansi Resmi", en:"✅ Official Warranty", ja:"✅ 正規保証", zh:"✅ 官方保修", su:"✅ Garansi Resmi" },
  guarantee_2:    { id:"🚚 Gratis Ongkir", en:"🚚 Free Shipping",    ja:"🚚 送料無料",  zh:"🚚 免费配送", su:"🚚 Gratis Ongkos" },
  guarantee_3:    { id:"↩️ Retur 7 Hari", en:"↩️ 7-Day Returns",    ja:"↩️ 7日間返品", zh:"↩️ 7天退货", su:"↩️ Mulang 7 Poé" },
  guarantee_4:    { id:"💳 Cicilan 0%",   en:"💳 0% Installment",   ja:"💳 分割0%",    zh:"💳 零利率分期", su:"💳 Cicilan 0%" },
  desc_label:     { id:"Deskripsi Produk", en:"Product Description", ja:"商品説明",   zh:"产品描述",  su:"Déskripsi Produk" },
  other_products: { id:"Produk Lainnya",   en:"Other Products",      ja:"その他の商品",zh:"其他产品",  su:"Produk Séjénna" },
  reviews_label:  { id:"ulasan",           en:"reviews",             ja:"件のレビュー",zh:"条评价",    su:"ulasan" },
  savings_label:  { id:"Hemat",            en:"Save",                ja:"節約",        zh:"节省",      su:"Hemat" },

  // ---- CART DRAWER ----
  cart_title:     { id:"🛒 Keranjang Belanja", en:"🛒 Shopping Cart", ja:"🛒 ショッピングカート", zh:"🛒 购物车", su:"🛒 Karanjang Balanja" },
  cart_empty:     { id:"Keranjang kamu kosong", en:"Your cart is empty", ja:"カートは空です", zh:"购物车是空的", su:"Karanjang anjeun kosong" },
  cart_shop_now:  { id:"Mulai Belanja",    en:"Start Shopping",  ja:"買い物を始める", zh:"开始购物",  su:"Mimiti Balanja" },
  cart_checkout:  { id:"Lanjut ke Checkout →", en:"Proceed to Checkout →", ja:"チェックアウトへ →", zh:"去结账 →", su:"Lanjut ka Checkout →" },

  // ---- CHECKOUT ----
  co_step1:       { id:"Alamat",      en:"Address",    ja:"住所",      zh:"地址",    su:"Alamat" },
  co_step2:       { id:"Pengiriman",  en:"Shipping",   ja:"配送",      zh:"配送",    su:"Pangiriman" },
  co_step3:       { id:"Pembayaran",  en:"Payment",    ja:"支払い",    zh:"支付",    su:"Pamayaran" },
  co_step4:       { id:"Konfirmasi",  en:"Confirmation",ja:"確認",     zh:"确认",    su:"Konfirmasi" },
  co_secure:      { id:"🔒 Checkout Aman", en:"🔒 Secure Checkout", ja:"🔒 安全なチェックアウト", zh:"🔒 安全结账", su:"🔒 Checkout Aman" },
  co_success_h2:  { id:"Pesanan Berhasil!", en:"Order Placed!", ja:"ご注文完了！", zh:"下单成功！", su:"Pesenan Hasil!" },
  co_success_p:   { id:"Terima kasih telah berbelanja di BOSNIALine.", en:"Thank you for shopping at BOSNIALine.", ja:"BOSNIALineでのご購入ありがとうございます。", zh:"感谢您在BOSNIALine购物。", su:"Hatur nuhun parantos balanja di BOSNIALine." },

  // ---- ORDERS PAGE ----
  ord_title:      { id:"Cek Status Pesanan", en:"Check Order Status", ja:"注文状況確認", zh:"查询订单状态", su:"Cek Status Pesenan" },
  ord_placeholder:{ id:"Contoh: BL-12345678 atau email@contoh.com", en:"E.g.: BL-12345678 or email@example.com", ja:"例: BL-12345678 またはメールアドレス", zh:"例: BL-12345678 或邮箱地址", su:"Conto: BL-12345678 atawa email@conto.com" },
  ord_btn:        { id:"🔍 Cek Pesanan", en:"🔍 Check Order", ja:"🔍 注文を確認", zh:"🔍 查询订单", su:"🔍 Cek Pesenan" },
  ord_history:    { id:"📋 Riwayat Pesanan di Perangkat Ini", en:"📋 Order History on This Device", ja:"📋 このデバイスの注文履歴", zh:"📋 本设备订单历史", su:"📋 Riwayat Pesenan di Alat Ieu" },
  ord_detail:     { id:"Lihat Detail →", en:"View Detail →", ja:"詳細を見る →", zh:"查看详情 →", su:"Tingali Detail →" },
  ord_empty:      { id:"Belum ada pesanan", en:"No orders yet", ja:"注文はまだありません", zh:"暂无订单", su:"Tacan aya pesenan" },
};

// ---- CORE ENGINE ----
function getLang() {
  return localStorage.getItem("bosnialine_lang") || "id";
}

function setLang(lang) {
  localStorage.setItem("bosnialine_lang", lang);
  applyTranslations();
  updateLangButton();
}

function t(key) {
  const lang = getLang();
  return (TRANSLATIONS[key] && TRANSLATIONS[key][lang]) || (TRANSLATIONS[key] && TRANSLATIONS[key]["id"]) || key;
}

function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    const val = t(key);
    if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
      el.placeholder = val;
    } else if (el.hasAttribute("data-i18n-html")) {
      el.innerHTML = val;
    } else {
      el.textContent = val;
    }
  });
}

function updateLangButton() {
  const lang = getLang();
  const btn = document.getElementById("lang-btn-label");
  if (btn) btn.textContent = LANGUAGES[lang]?.label || "🌐";
}

// ---- INJECT LANGUAGE DROPDOWN INTO NAVBAR ----
function injectLangDropdown() {
  const navActions = document.querySelector(".nav-actions");
  if (!navActions || document.getElementById("lang-dropdown-wrap")) return;

  const wrap = document.createElement("div");
  wrap.id = "lang-dropdown-wrap";
  wrap.className = "lang-wrap";
  wrap.innerHTML = `
    <button class="nav-btn lang-btn" onclick="toggleLangMenu(event)" id="lang-btn">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22">
        <circle cx="12" cy="12" r="10"/>
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
      <span id="lang-btn-label">🇮🇩 Indonesia</span>
    </button>
    <div class="lang-menu" id="lang-menu">
      ${Object.entries(LANGUAGES).map(([code, info]) => `
        <button class="lang-option" onclick="setLang('${code}')" data-lang="${code}">
          ${info.label}
        </button>`).join("")}
    </div>`;

  // Insert before first child of nav-actions
  navActions.insertBefore(wrap, navActions.firstChild);

  // Close on outside click
  document.addEventListener("click", e => {
    if (!wrap.contains(e.target)) {
      document.getElementById("lang-menu")?.classList.remove("open");
    }
  });
}

function toggleLangMenu(e) {
  e.stopPropagation();
  document.getElementById("lang-menu").classList.toggle("open");
}

// ---- INIT ----
document.addEventListener("DOMContentLoaded", () => {
  injectLangDropdown();
  updateLangButton();
  applyTranslations();
});
