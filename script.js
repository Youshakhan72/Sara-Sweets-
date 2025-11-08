// ============================================================
// Sara Sweets Website JS - Full Updated Version
// ============================================================

const el = (id) => document.getElementById(id);
const randId = () => "p" + Math.random().toString(36).slice(2, 9);

// ---------- PRODUCTS ----------
function loadProducts() {
  const raw = localStorage.getItem("sara_products");
  if (!raw) {
    localStorage.setItem("sara_products", JSON.stringify([]));
    return [];
  }
  try { return JSON.parse(raw); } catch { return []; }
}

function saveProducts(arr) {
  localStorage.setItem("sara_products", JSON.stringify(arr));
}

function renderProducts() {
  const grid = el("productGrid");
  const products = loadProducts();
  const lang = localStorage.getItem("sara_lang") || "en";

  if (products.length === 0) {
    grid.innerHTML = `<p style="text-align:center;opacity:0.6;">${lang === "ar" ? "لم تتم إضافة منتجات بعد." : "No products available yet."}</p>`;
    return;
  }

  grid.innerHTML = products.map(p => {
    const name = lang === "ar" ? p.nameAr || p.name : p.name;
    const desc = lang === "ar" ? p.descAr || p.desc : p.desc;
    return `
      <article class="card fade-item">
        <img src="${p.img}" alt="${name}" onerror="this.src='images/placeholder.jpg'" />
        <h4>${name}</h4>
        <p>${desc}</p>
        <div class="actions">
          <div class="price">${p.price} SAR</div>
          <button class="btn">${lang === "ar" ? "أضف" : "Add"}</button>
        </div>
      </article>`;
  }).join("");
}

// ---------- ADMIN PANEL ----------
const ADMIN_PASSWORD = "Sara@123";
const adminOverlay = el("adminOverlay");
const closeAdmin = el("closeAdmin");
const adminLoginBtn = el("adminLoginBtn");
const adminPassword = el("adminPassword");
const panelContent = el("panelContent");
const loginPane = el("loginPane");
const adminLogoutBtn = el("adminLogoutBtn");
let isAdmin = false;

// Open admin overlay
el("adminOpenBtn").addEventListener("click", () => {
  adminOverlay.classList.remove("hidden");
  document.body.style.overflow = "hidden";
});

// Close admin overlay
closeAdmin.addEventListener("click", () => {
  adminOverlay.classList.add("hidden");
  document.body.style.overflow = "auto";
});

// Admin login
adminLoginBtn.addEventListener("click", () => {
  if (adminPassword.value.trim() === ADMIN_PASSWORD) {
    isAdmin = true;
    loginPane.classList.add("hidden");
    panelContent.classList.remove("hidden");
    renderAdminProducts();
  } else alert("❌ Incorrect password!");
});

// Admin logout
adminLogoutBtn.addEventListener("click", () => {
  isAdmin = false;
  adminPassword.value = "";
  loginPane.classList.remove("hidden");
  panelContent.classList.add("hidden");
  adminOverlay.classList.add("hidden");
  document.body.style.overflow = "auto";
});

// ---------- ADD PRODUCT ----------
el("productForm").addEventListener("submit", (e) => {
  e.preventDefault();
  if (!isAdmin) return alert("⚠️ Only admin can add products.");

  const name = el("pName").value.trim();
  const nameAr = el("pNameAr").value.trim() || name;
  const price = Number(el("pPrice").value);
  const desc = el("pDesc").value.trim();
  const descAr = el("pDescAr").value.trim() || desc;
  const imgFile = el("pImageUpload").files[0];

  if (!name || !price || !imgFile) return alert("Please fill all fields!");

  const reader = new FileReader();
  reader.onload = (ev) => {
    const arr = loadProducts();
    arr.unshift({ id: randId(), name, nameAr, price, img: ev.target.result, desc, descAr });
    saveProducts(arr);

    // Show products for everyone immediately
    renderProducts();
    renderAdminProducts();

    // Reset form
    e.target.reset();
    el("previewImg").classList.add("hidden");
  };
  reader.readAsDataURL(imgFile);
});

// Preview image before adding
el("pImageUpload").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (evt) => {
      el("previewImg").src = evt.target.result;
      el("previewImg").classList.remove("hidden");
    };
    reader.readAsDataURL(file);
  }
});

// Render products in admin panel
function renderAdminProducts() {
  const box = el("adminProducts");
  const arr = loadProducts();
  if (arr.length === 0) return box.innerHTML = "<small>No products yet.</small>";
  box.innerHTML = arr.map(p => `
    <div class="admin-item">
      <img src="${p.img}" onerror="this.src='images/placeholder.jpg'" />
      <div style="flex:1">
        <strong>${p.name}</strong> — ${p.price} SAR<br/>
        <small>${p.desc}</small>
      </div>
      <button class="btn" onclick="removeProduct('${p.id}')">Remove</button>
    </div>
  `).join("");
}

// Remove product
function removeProduct(id) {
  if (!isAdmin) return alert("⚠️ Only admin can remove products.");
  if (!confirm("Remove this product?")) return;
  const arr = loadProducts().filter(p => p.id !== id);
  saveProducts(arr);
  renderAdminProducts();
  renderProducts();
}
window.removeProduct = removeProduct;

// ---------- TRANSLATION ----------
let lang = localStorage.getItem("sara_lang") || "en";

const translations = {
  en: {
    brandTitle: "Sara Sweets",
    brandSub: "Delighting every bite since forever",
    heroTitle: "Handmade Sweets · Fresh Every Day",
    heroDesc: "Small-batch recipes, big heart. Taste the tradition.",
    quote: "\"A little sweetness makes the world softer.\"",
    aboutTitle: "About Sara Sweets",
    aboutDesc: "Founded with love, Sara Sweets blends traditional recipes and modern flavours. Every piece is handcrafted with premium ingredients.",
    productsTitle: "Our Specialties",
    galleryTitle: "Gallery",
    contactTitle: "Visit Us",
    contactDesc: "Ahmad Ibn Ghalib, Jarir, Riyadh 12833, Saudi Arabia  11:30 AM - 11:30 PM, Sun - Thu and 1:00 PM - 12:00 AM, Fri",
    footerText: "© Sara Sweets • Made with ❤️"
  },
  ar: {
    brandTitle: "سارة للحلويات",
    brandSub: "نُسعد كل قضمة منذ الأزل",
    heroTitle: "حلويات يدوية · طازجة كل يوم",
    heroDesc: "وصفات تقليدية بحب كبير. تذوّق الأصالة.",
    quote: "«القليل من الحلاوة يجعل العالم ألطف»",
    aboutTitle: "عن سارة للحلويات",
    aboutDesc: "تأسست بحب، تمزج سارة للحلويات بين النكهات التقليدية والحديثة. كل قطعة مصنوعة يدوياً من مكونات عالية الجودة.",
    productsTitle: "تخصصاتنا",
    galleryTitle: "المعرض",
    contactTitle: "زرونا",
    contactDesc: "أحمد بن غالب، جرير، الرياض 12833، المملكة العربية السعودية  11:30 صباحاً - 11:30 مساءً، الأحد - الخميس و 1:00 مساءً - 12:00 صباحاً، الجمعة",
    footerText: "© سارة للحلويات • صُنع بحب ❤️"
  }
};

// On page load
document.addEventListener("DOMContentLoaded", () => {
  el("translateBtn").addEventListener("click", () => {
    lang = lang === "en" ? "ar" : "en";
    localStorage.setItem("sara_lang", lang);
    applyTranslations();
  });

  renderProducts();
  applyTranslations();
  el("year").textContent = new Date().getFullYear();
});

// Apply translations
function applyTranslations() {
  const t = translations[lang];
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

  el("brand-title").textContent = t.brandTitle;
  el("brand-sub").textContent = t.brandSub;
  el("hero-title").textContent = t.heroTitle;
  el("hero-desc").textContent = t.heroDesc;
  el("quote").textContent = t.quote;
  el("about-title").textContent = t.aboutTitle;
  el("about-desc").textContent = t.aboutDesc;
  el("products-title").textContent = t.productsTitle;
  el("gallery-title").textContent = t.galleryTitle;
  el("contact-title").textContent = t.contactTitle;
  el("contact-desc").textContent = t.contactDesc;
  el("footer-text").textContent = t.footerText;

  renderProducts(); // Update product names/descriptions
}
