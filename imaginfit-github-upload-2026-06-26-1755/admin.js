if (window.IMAGINFIT_OPERATOR_ALLOWED === false) {
  throw new Error("Operator access is local only.");
}

const form = document.querySelector("[data-design-form]");
const statusMessage = document.querySelector("[data-status]");
const adminDesigns = document.querySelector("[data-admin-designs]");
const managerCode = document.querySelector("[data-manager-code]");
const uploadPreview = document.querySelector("[data-upload-preview]");
const waForm = document.querySelector("[data-wa-form]");
const waTemplate = document.querySelector("[data-wa-template]");
const waList = document.querySelector("[data-wa-list]");
const waCount = document.querySelector("[data-wa-count]");
const waStatus = document.querySelector("[data-wa-status]");
const waOpenAll = document.querySelector("[data-wa-open-all]");
const waDemo = document.querySelector("[data-wa-demo]");
const waRefresh = document.querySelector("[data-wa-refresh]");
const waLinks = document.querySelector("[data-wa-links]");
const waPhotoFile = document.querySelector("[data-wa-photo-file]");
const waPhotoUrl = document.querySelector("[data-wa-photo-url]");
const waPhotoPreview = document.querySelector("[data-wa-photo-preview]");
const waClearPhoto = document.querySelector("[data-wa-clear-photo]");
const waAudienceCount = document.querySelector("[data-wa-audience-count]");
const waReadyCount = document.querySelector("[data-wa-ready-count]");
const waPhotoState = document.querySelector("[data-wa-photo-state]");
const waPreview = document.querySelector("[data-wa-preview]");
const waTemplateChoices = document.querySelectorAll("[data-wa-template-choice]");
const waSegmentFilter = document.querySelector("[data-wa-segment-filter]");
const waSearch = document.querySelector("[data-wa-search]");
const crmStats = document.querySelector("[data-crm-stats]");
const crmSearch = document.querySelector("[data-crm-search]");
const crmFilter = document.querySelector("[data-crm-filter]");
const crmCode = document.querySelector("[data-crm-code]");
const crmRefresh = document.querySelector("[data-crm-refresh]");
const crmList = document.querySelector("[data-crm-list]");
const crmStatus = document.querySelector("[data-crm-status]");
const crmAddForm = document.querySelector("[data-crm-add-form]");
const crmActionBoard = document.querySelector("[data-crm-action-board]");
const crmStatusBoard = document.querySelector("[data-crm-status-board]");
const contentPlanner = document.querySelector("[data-content-planner]");
const contentStatus = document.querySelector("[data-content-status]");
const fabricForm = document.querySelector("[data-fabric-form]");
const fabricList = document.querySelector("[data-fabric-list]");
const fabricStatus = document.querySelector("[data-fabric-status]");
const reviewForm = document.querySelector("[data-review-form]");
const reviewList = document.querySelector("[data-review-list]");
const reviewStatus = document.querySelector("[data-review-status]");
const optionsEditor = document.querySelector("[data-options-editor]");
const optionsCode = document.querySelector("[data-options-code]");
const optionsRefresh = document.querySelector("[data-options-refresh]");
const optionsSave = document.querySelector("[data-options-save]");
const optionsStatus = document.querySelector("[data-options-status]");
const pinterestForm = document.querySelector("[data-pinterest-form]");
const pinterestDropZone = document.querySelector("[data-pinterest-drop-zone]");
const pinterestPreview = document.querySelector("[data-pinterest-preview]");
const pinterestPreviewButton = document.querySelector("[data-pinterest-preview-button]");
const pinterestStatus = document.querySelector("[data-pinterest-status]");
const adminOverview = document.querySelector("[data-admin-overview]");

let designs = [];
let whatsappCustomers = [];
let whatsappPhoto = "";
let crmCustomers = [];
let builderOptions = {};
let fabricLibrary = [];
let customerReviews = [];
const defaultWhatsAppTemplate =
  "Hi {name}, this is ImaginFit Studio. Your custom clothing update for {date}: {business}. Reply here if you need any changes.";
const whatsappTemplates = {
  newLook:
    "Hi {name}, new ImaginFit look is ready today. We can customize it for {business} with your fabric, fitting, and measurements. Reply LOOK if you want me to share options.",
  followUp:
    "Hi {name}, following up on {business}. Do you want to continue with fabric selection, measurements, or design changes today?",
  fabric:
    "Hi {name}, for {business}, we can help choose fabric based on comfort, fall, budget, and occasion. Reply FABRIC and send any reference you like.",
  measurement:
    "Hi {name}, to move ahead with {business}, please share chest, waist, hip, shoulder, sleeve, and length measurements. I can guide you step by step.",
  offer:
    "Hi {name}, ImaginFit has limited stitching slots this week for custom outfits. If you want {business}, reply SLOT and we will plan fabric and measurements.",
};
const whatsappStorageKey = "imaginfit-whatsapp-desk";
const builderOptionsStorageKey = "imaginfit-builder-options";
const localDesignsStorageKey = "imaginfit-local-designs";
const localCrmStorageKey = "imaginfit-local-crm";
const fabricLibraryStorageKey = "imaginfit-fabric-library";
const customerReviewsStorageKey = "imaginfit-customer-reviews";
const crmStatuses = ["Lead", "Contacted", "Measuring", "Designing", "Ordered", "Delivered", "Follow-up"];
const fallbackCustomerReviews = [
  {
    id: "review-traditional-suit",
    name: "Ananya Sharma",
    outfit: "Traditional suit order",
    rating: 5,
    text: "The fit felt comfortable and the suit looked exactly like the soft occasion look I wanted.",
    note: "Family function outfit with dupatta styling and full sleeve comfort.",
  },
  {
    id: "review-semi-formal",
    name: "Mehak Kapoor",
    outfit: "Semi-formal order",
    rating: 5,
    text: "The shirt and trouser idea became much clearer after choosing fabric and measurements.",
    note: "Office-ready custom sizing with clean collar and wide-leg trouser direction.",
  },
  {
    id: "review-custom-coord",
    name: "Riya Malhotra",
    outfit: "Custom co-ord order",
    rating: 5,
    text: "I liked that the design could be adjusted before ordering instead of choosing a fixed size.",
    note: "Repeat-wear outfit planned around comfort, pockets, and fabric feel.",
  },
];
const defaultFabricLibrary = [
  {
    "id": "imported-festive-brocade-stack",
    "name": "Festive Brocade Stack",
    "category": "Festive",
    "bestFor": "Wedding blouses, festive suits, statement dupattas",
    "comfort": "Rich and structured",
    "priceRange": "Quote after selection",
    "care": "Dry clean recommended",
    "image": "./assets/fabric-uploads/fabric-01.jpeg",
    "note": "Multiple rich brocade colors for premium festive outfits."
  },
  {
    "id": "imported-floral-jacquard",
    "name": "Multicolor Floral Jacquard",
    "category": "Festive",
    "bestFor": "Party kurtis, festive suits, premium co-ords",
    "comfort": "Structured shine",
    "priceRange": "Quote after selection",
    "care": "Dry clean recommended",
    "image": "./assets/fabric-uploads/fabric-02.jpeg",
    "note": "Colorful floral weave with a festive, eye-catching finish."
  },
  {
    "id": "imported-pastel-satin-stack",
    "name": "Pastel Satin Stack",
    "category": "Premium",
    "bestFor": "Scarves, premium tops, soft party pieces",
    "comfort": "Smooth and soft",
    "priceRange": "Quote after selection",
    "care": "Gentle wash or dry clean",
    "image": "./assets/fabric-uploads/fabric-03.jpeg",
    "note": "Soft pastel satin shades for elegant custom outfits."
  },
  {
    "id": "imported-glossy-satin",
    "name": "Glossy Structured Satin",
    "category": "Premium",
    "bestFor": "Evening shirts, dresses, statement blouses",
    "comfort": "Smooth with high shine",
    "priceRange": "Quote after selection",
    "care": "Dry clean recommended",
    "image": "./assets/fabric-uploads/fabric-04.jpeg",
    "note": "High-shine fabric for bold evening and party looks."
  },
  {
    "id": "imported-wine-satin",
    "name": "Deep Wine Satin",
    "category": "Premium",
    "bestFor": "Evening tops, blouses, occasion wear",
    "comfort": "Smooth and drapey",
    "priceRange": "Quote after selection",
    "care": "Gentle wash or dry clean",
    "image": "./assets/fabric-uploads/fabric-05.jpeg",
    "note": "Dark wine satin with a rich, polished finish."
  },
  {
    "id": "imported-blush-crepe",
    "name": "Blush Draped Crepe",
    "category": "Semi-formal",
    "bestFor": "Kurtis, dresses, semi-formal tops",
    "comfort": "Soft fall",
    "priceRange": "Quote after selection",
    "care": "Gentle wash",
    "image": "./assets/fabric-uploads/fabric-06.jpeg",
    "note": "Soft blush fabric with a clean drape for elegant daily or semi-formal fits."
  },
  {
    "id": "imported-pearl-linen-lilac",
    "name": "Pearl Linen Lilac",
    "category": "Semi-formal",
    "bestFor": "Kurtis, summer suits, elegant daily wear",
    "comfort": "Light and breathable",
    "priceRange": "Quote after selection",
    "care": "Gentle wash",
    "image": "./assets/fabric-uploads/fabric-07.jpeg",
    "note": "Soft lilac linen-look fabric with pearl detailing."
  },
  {
    "id": "imported-pearl-linen-mint",
    "name": "Pearl Linen Mint",
    "category": "Semi-formal",
    "bestFor": "Kurtis, pastel suits, day functions",
    "comfort": "Light and breathable",
    "priceRange": "Quote after selection",
    "care": "Gentle wash",
    "image": "./assets/fabric-uploads/fabric-08.jpeg",
    "note": "Fresh mint fabric with delicate pearl work."
  },
  {
    "id": "imported-pearl-linen-charcoal",
    "name": "Pearl Linen Charcoal",
    "category": "Semi-formal",
    "bestFor": "Statement kurtis, evening co-ords, semi-formal tops",
    "comfort": "Light with structure",
    "priceRange": "Quote after selection",
    "care": "Gentle wash",
    "image": "./assets/fabric-uploads/fabric-09.jpeg",
    "note": "Dark charcoal pearl fabric for a clean premium look."
  },
  {
    "id": "imported-champagne-satin",
    "name": "Champagne Satin Swirl",
    "category": "Premium",
    "bestFor": "Evening shirts, blouses, dresses, party tops",
    "comfort": "Smooth shine",
    "priceRange": "Quote after selection",
    "care": "Dry clean recommended",
    "image": "./assets/fabric-uploads/fabric-10.jpeg",
    "note": "Champagne satin with a luxurious polished finish."
  },
  {
    "id": "imported-pink-silk-blend",
    "name": "Pink Silk Blend",
    "category": "Premium",
    "bestFor": "Kurtis, blouses, festive soft suits",
    "comfort": "Soft and smooth",
    "priceRange": "Quote after selection",
    "care": "Gentle wash or dry clean",
    "image": "./assets/fabric-uploads/fabric-11.jpeg",
    "note": "Soft pink silk-blend texture with a graceful fall."
  },
  {
    "id": "imported-navy-silk-blend",
    "name": "Navy Silk Blend",
    "category": "Premium",
    "bestFor": "Evening kurtis, formal tops, premium shirts",
    "comfort": "Smooth and structured",
    "priceRange": "Quote after selection",
    "care": "Gentle wash or dry clean",
    "image": "./assets/fabric-uploads/fabric-12.jpeg",
    "note": "Deep navy silk-blend fabric for refined outfits."
  },
  {
    "id": "imported-white-embroidered-net-border",
    "name": "White Embroidered Net Border",
    "category": "Dupatta",
    "bestFor": "Dupattas, overlays, festive suit accents",
    "comfort": "Light decorative layer",
    "priceRange": "Quote after selection",
    "care": "Delicate handling",
    "image": "./assets/fabric-uploads/fabric-13.jpeg",
    "note": "White net with statement embroidery and border detailing."
  },
  {
    "id": "imported-white-floral-net",
    "name": "White Floral Embroidered Net",
    "category": "Dupatta",
    "bestFor": "Dupattas, overlays, sleeves, festive layers",
    "comfort": "Light decorative layer",
    "priceRange": "Quote after selection",
    "care": "Delicate handling",
    "image": "./assets/fabric-uploads/fabric-14.jpeg",
    "note": "White floral embroidered net for elegant festive styling."
  },
  {
    "id": "imported-pearl-linen-rose",
    "name": "Pearl Linen Rose",
    "category": "Semi-formal",
    "bestFor": "Kurtis, day suits, soft pastel outfits",
    "comfort": "Light and breathable",
    "priceRange": "Quote after selection",
    "care": "Gentle wash",
    "image": "./assets/fabric-uploads/fabric-15.jpeg",
    "note": "Rose pink linen-look fabric with pearl detailing."
  }
];
const removedStarterFabricIds = new Set([
  "cotton-daily",
  "linen-semiformal",
  "silk-premium",
  "georgette-flowy",
  "chanderi-festive",
  "banarasi-brocade",
  "organza-overlay",
  "rayon-budget",
  "crepe-drape",
  "satin-evening",
  "denim-fusion",
  "lace-net-detail",
]);
const optionGroups = [
  ["category", "Garment base prices"],
  ["fabric", "Fabric choices"],
  ["color", "Color swatches"],
  ["neckline", "Necklines"],
  ["sleeves", "Sleeves"],
  ["fit", "Fit styles"],
  ["measurement", "Measurement methods"],
  ["extras", "Extras / add-ons"],
  ["accessories", "Accessories / trims"],
];
const noExtraCostGroups = new Set(["neckline", "sleeves", "fit", "measurement", "extras", "accessories"]);
const defaultBuilderOptions = {
  category: [
    { label: "Kurti", price: 2499 },
    { label: "Suit", price: 3999 },
    { label: "Saree Blouse", price: 2199 },
    { label: "Dress", price: 3299 },
    { label: "Shirt", price: 1899 },
    { label: "Trousers", price: 2299 },
  ],
  fabric: [
    { label: "Cotton", price: 0 },
    { label: "Silk", price: 799 },
    { label: "Linen", price: 499 },
    { label: "Georgette", price: 599 },
  ],
  color: [
    { label: "White", value: "#f7f7f7" },
    { label: "Charcoal", value: "#222222" },
    { label: "Graphite", value: "#3f3f46" },
    { label: "Silver", value: "#c9c9c9" },
    { label: "Slate", value: "#6b7280" },
    { label: "Black", value: "#171717" },
  ],
  neckline: [
    { label: "Round", price: 0 },
    { label: "V Neck", price: 0 },
    { label: "Collar", price: 0 },
    { label: "Boat", price: 0 },
    { label: "Halter", price: 0 },
  ],
  sleeves: [
    { label: "Sleeveless", price: 0 },
    { label: "Short", price: 0 },
    { label: "Three Quarter", price: 0 },
    { label: "Full", price: 0 },
  ],
  fit: [
    { label: "Relaxed", price: 0 },
    { label: "Tailored", price: 0 },
    { label: "A-Line", price: 0 },
    { label: "Long", price: 0 },
  ],
  measurement: [
    { label: "Tailored Body", price: 0 },
    { label: "Body Scan", price: 0 },
    { label: "Home Measure", price: 0 },
    { label: "In-Studio Fit", price: 0 },
  ],
  extras: [
    { label: "Pockets", price: 0 },
    { label: "Lining", price: 0 },
  ],
  accessories: [
    { label: "Lace Border", price: 0 },
    { label: "Statement Buttons", price: 0 },
    { label: "Dori Tie", price: 0 },
  ],
};
const hiddenBuilderOptionLabels = {
  extras: new Set(["Embroidery", "Monogram"]),
  accessories: new Set(["Pearl Detail", "Tassels", "Mirror Work"]),
};
const categoryStartingPrices = {
  Kurti: 2499,
  Suit: 3999,
  "Saree Blouse": 2199,
  Dress: 3299,
  Shirt: 1899,
  Trousers: 2299,
};

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result));
    reader.addEventListener("error", reject);
    reader.readAsDataURL(file);
  });
}

async function getWhatsAppPhotoInput() {
  const file = waPhotoFile.files[0];
  const url = waPhotoUrl.value.trim();

  if (file) return fileToDataUrl(file);
  return url;
}

function selectedExtras(select) {
  return [...select.selectedOptions].map((option) => option.value);
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function cleanPhone(phone) {
  return String(phone || "").replace(/[^\d+]/g, "").replace(/^\+/, "");
}

function localId(prefix) {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function isPinterestUrl(url = "") {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return host.includes("pinimg.com") || host.includes("pinterest.");
  } catch {
    return false;
  }
}

function isPinterestPageUrl(url = "") {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    return host.includes("pinterest.") && !host.includes("pinimg.com");
  } catch {
    return false;
  }
}

function getPinterestPinId(url = "") {
  try {
    const match = new URL(url).pathname.match(/\/pin\/([^/?#]+)/i);
    return match?.[1] || "";
  } catch {
    return "";
  }
}

function createPinterestPlaceholderImage(url = "") {
  const pinId = getPinterestPinId(url);
  const pinLabel = pinId ? `Source ${pinId}` : "Inspiration source";
  const safePinLabel = escapeHtml(pinLabel);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="900" height="1080" viewBox="0 0 900 1080">
      <rect width="900" height="1080" fill="#f6f3ee"/>
      <rect x="74" y="74" width="752" height="932" rx="34" fill="#ffffff" stroke="#d7dbe2" stroke-width="4"/>
      <circle cx="450" cy="374" r="112" fill="#bd081c"/>
      <text x="450" y="420" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="142" font-weight="800">P</text>
      <text x="450" y="600" text-anchor="middle" fill="#111111" font-family="Arial, sans-serif" font-size="54" font-weight="800">Inspiration Look</text>
      <text x="450" y="674" text-anchor="middle" fill="#6b7280" font-family="Arial, sans-serif" font-size="34">${safePinLabel}</text>
      <text x="450" y="748" text-anchor="middle" fill="#9ca3af" font-family="Arial, sans-serif" font-size="28">Open the source link for the original pin</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.trim())}`;
}

function getDesignSourceUrl(design = {}) {
  return design.config?.sourceUrl || (isPinterestPageUrl(design.image) ? design.image : "");
}

function getDesignPreviewImage(design = {}) {
  return isPinterestPageUrl(design.image) ? createPinterestPlaceholderImage(design.image) : design.image;
}

function renderPinterestSourceCard(url = "", title = "Source link added") {
  const sourceUrl = escapeHtml(url);
  const pinId = escapeHtml(getPinterestPinId(url));
  return `
    <div class="pinterest-source-card">
      <span class="pinterest-source-mark">P</span>
      <strong>${escapeHtml(title)}</strong>
      <p>${pinId ? `Source ${pinId}` : "Inspiration source link"}</p>
      <a href="${sourceUrl}" target="_blank" rel="noopener">Open Source</a>
    </div>
  `;
}

function readLocalArray(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function saveLocalArray(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function normalizeReview(review = {}) {
  return {
    id: review.id || localId("review"),
    name: String(review.name || "Customer").trim(),
    outfit: String(review.outfit || "Custom outfit order").trim(),
    rating: Math.max(1, Math.min(5, Number(review.rating || 5))),
    text: String(review.text || "").trim(),
    note: String(review.note || "Custom order with measurements and fabric support.").trim(),
  };
}

function loadCustomerReviews() {
  const stored = readLocalArray(customerReviewsStorageKey);
  customerReviews = (stored.length ? stored : fallbackCustomerReviews).map(normalizeReview);
  saveLocalArray(customerReviewsStorageKey, customerReviews);
  renderCustomerReviews();
  renderAdminOverview();
}

function saveCustomerReviews(message = "Reviews saved.") {
  saveLocalArray(customerReviewsStorageKey, customerReviews.map(normalizeReview));
  renderCustomerReviews();
  renderAdminOverview();
  if (reviewStatus) reviewStatus.textContent = message;
}

function renderCustomerReviews() {
  if (!reviewList) return;
  reviewList.innerHTML = customerReviews.length
    ? customerReviews
        .map(
          (review) => `
            <article class="review-manager-card" data-review-id="${escapeHtml(review.id)}">
              <div>
                <strong>${escapeHtml(review.name)}</strong>
                <span>${escapeHtml(review.outfit)} · ${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}</span>
              </div>
              <p>${escapeHtml(review.text)}</p>
              <small>${escapeHtml(review.note)}</small>
              <button class="danger-button" type="button" data-review-delete="${escapeHtml(review.id)}">Delete</button>
            </article>
          `
        )
        .join("")
    : '<p class="empty-cart">No reviews yet. Add your first real customer review.</p>';
}

function isOfflineApiError(error) {
  return !error || /fetch|backend|load|network|failed/i.test(error.message || "");
}

function todayLabel() {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());
}

function loadWhatsAppDesk() {
  try {
    const saved = JSON.parse(localStorage.getItem(whatsappStorageKey) || "{}");
    whatsappCustomers = Array.isArray(saved.customers)
      ? saved.customers.map((customer) => ({ segment: "Lead", ...customer }))
      : [];
    waTemplate.value = saved.template || defaultWhatsAppTemplate;
    whatsappPhoto = saved.photo || "";
    waPhotoUrl.value = whatsappPhoto && !whatsappPhoto.startsWith("data:") ? whatsappPhoto : "";
  } catch {
    whatsappCustomers = [];
    waTemplate.value = defaultWhatsAppTemplate;
    whatsappPhoto = "";
  }

  renderWhatsAppPhoto();
  renderWhatsAppCustomers();
}

async function loadSubmittedCustomers() {
  try {
    const response = await fetch("/api/customers");
    const submittedCustomers = response.ok ? await response.json() : [];
    const byPhone = new Map(whatsappCustomers.map((customer) => [cleanPhone(customer.phone), customer]));

    submittedCustomers.forEach((customer) => {
      const phone = cleanPhone(customer.phone);
      if (!phone) return;
      byPhone.set(phone, {
        id: customer.id,
        name: customer.name,
        phone: `+${phone}`,
        business: customer.business || customer.source || "Customer login",
        segment: customer.status || "Lead",
      });
    });

    whatsappCustomers = [...byPhone.values()];
    renderWhatsAppCustomers();
    saveWhatsAppDesk();
    waStatus.textContent = `Loaded ${submittedCustomers.length} centrally saved customer${
      submittedCustomers.length === 1 ? "" : "s"
    }.`;
  } catch {
    const localCustomers = readLocalArray(localCrmStorageKey);
    if (localCustomers.length) {
      const byPhone = new Map(whatsappCustomers.map((customer) => [cleanPhone(customer.phone), customer]));
      localCustomers.forEach((customer) => {
        const phone = cleanPhone(customer.phone);
        if (!phone) return;
        byPhone.set(phone, {
          id: customer.id,
          name: customer.name,
          phone: `+${phone}`,
          business: customer.business || customer.source || "Customer login",
          segment: customer.status || "Lead",
        });
      });
      whatsappCustomers = [...byPhone.values()];
      renderWhatsAppCustomers();
      saveWhatsAppDesk();
      waStatus.textContent = `Loaded ${localCustomers.length} locally saved customer${
        localCustomers.length === 1 ? "" : "s"
      }.`;
      return;
    }
    waStatus.textContent = "No online customer list found. Local WhatsApp list is ready.";
  }
}

function saveWhatsAppDesk() {
  localStorage.setItem(
    whatsappStorageKey,
    JSON.stringify({
      customers: whatsappCustomers,
      template: waTemplate.value.trim() || defaultWhatsAppTemplate,
      photo: whatsappPhoto,
    })
  );
}

function renderWhatsAppPhoto() {
  waPhotoPreview.innerHTML = whatsappPhoto
    ? `
      <img src="${whatsappPhoto}" alt="Selected WhatsApp photo" />
      <strong>Photo ready for WhatsApp attachment</strong>
    `
    : "<span>No WhatsApp photo selected</span>";
}

function buildWhatsAppMessage(customer) {
  return (waTemplate.value.trim() || defaultWhatsAppTemplate)
    .replaceAll("{name}", customer.name)
    .replaceAll("{business}", customer.business || "ImaginFit Studio")
    .replaceAll("{date}", todayLabel());
}

function buildWhatsAppUrl(customer) {
  return `https://web.whatsapp.com/send?phone=${cleanPhone(customer.phone)}&text=${encodeURIComponent(
    buildWhatsAppMessage(customer)
  )}`;
}

function getFilteredWhatsAppCustomers() {
  const segment = waSegmentFilter?.value || "All";
  const query = (waSearch?.value || "").trim().toLowerCase();

  return whatsappCustomers.filter((customer) => {
    const matchesSegment = segment === "All" || (customer.segment || "Lead") === segment;
    const searchable = [customer.name, customer.phone, customer.business, customer.segment].join(" ").toLowerCase();
    return matchesSegment && (!query || searchable.includes(query));
  });
}

function renderWhatsAppStats() {
  const ready = whatsappCustomers.filter((customer) => cleanPhone(customer.phone)).length;
  if (waAudienceCount) waAudienceCount.textContent = String(whatsappCustomers.length);
  if (waReadyCount) waReadyCount.textContent = String(ready);
  if (waPhotoState) waPhotoState.textContent = whatsappPhoto ? "Yes" : "No";
}

function renderWhatsAppPreview() {
  if (!waPreview) return;
  const sampleCustomer = getFilteredWhatsAppCustomers()[0] || {
    name: "Customer",
    business: "custom outfit",
  };
  waPreview.textContent = buildWhatsAppMessage(sampleCustomer);
}

async function copyWhatsAppMessage(customer) {
  const message = buildWhatsAppMessage(customer);

  try {
    await navigator.clipboard.writeText(message);
    waStatus.textContent = `Copied message for ${customer.name}.`;
  } catch {
    waStatus.textContent = `Copy failed. Select the message text manually and copy it.`;
  }
}

function renderWhatsAppCustomers() {
  waCount.textContent = `${whatsappCustomers.length} saved`;
  renderWhatsAppStats();
  renderWhatsAppPreview();

  if (!whatsappCustomers.length) {
    waList.innerHTML = '<p class="empty-cart">No WhatsApp customers yet.</p>';
    return;
  }

  const visibleCustomers = getFilteredWhatsAppCustomers();
  if (!visibleCustomers.length) {
    waList.innerHTML = '<p class="empty-cart">No customers match this WhatsApp view.</p>';
    return;
  }

  waList.innerHTML = visibleCustomers
    .map(
      (customer) => {
        const phone = cleanPhone(customer.phone);
        const canOpen = Boolean(phone);

        return `
        <article class="whatsapp-customer">
          <div>
            <h3>${escapeHtml(customer.name)}</h3>
            <p>${escapeHtml(customer.phone)}</p>
            <p>${escapeHtml(customer.business || "ImaginFit Studio")}</p>
            <span class="whatsapp-segment">${escapeHtml(customer.segment || "Lead")}</span>
          </div>
          <div>
            ${
              canOpen
                ? `<a class="checkout-button" href="${buildWhatsAppUrl(customer)}" target="_blank" rel="noopener">Open WhatsApp</a>`
                : `<button class="checkout-button" type="button" disabled>Missing Number</button>`
            }
            ${
              whatsappPhoto
                ? `<a class="save-button" href="${whatsappPhoto}" target="_blank" rel="noopener">Open Photo</a>`
                : ""
            }
            <button class="save-button" type="button" data-wa-copy="${customer.id}">Copy Text</button>
            <button class="save-button" type="button" data-wa-remove="${customer.id}">Remove</button>
          </div>
        </article>
      `;
      }
    )
    .join("");
}

function renderWhatsAppLinks() {
  const validCustomers = getFilteredWhatsAppCustomers().filter((customer) => cleanPhone(customer.phone));

  if (!validCustomers.length) {
    waLinks.hidden = true;
    return;
  }

  waLinks.hidden = false;
  waLinks.innerHTML = `
    <h3>Ready WhatsApp links</h3>
    <p>Open each link and press send after checking the message.</p>
    <div>
      ${validCustomers
        .map(
          (customer) => `
            <a href="${buildWhatsAppUrl(customer)}" target="_blank" rel="noopener">
              ${escapeHtml(customer.name)}
            </a>
          `
        )
        .join("")}
    </div>
    ${
      whatsappPhoto
        ? `<a class="whatsapp-photo-link" href="${whatsappPhoto}" target="_blank" rel="noopener">Open selected photo</a>`
        : ""
    }
  `;
}

function sanitizeBuilderOptions(source = defaultBuilderOptions) {
  const sanitized = { ...structuredClone(defaultBuilderOptions), ...source };
  Object.entries(hiddenBuilderOptionLabels).forEach(([group, hiddenLabels]) => {
    sanitized[group] = (sanitized[group] || []).filter((option) => !hiddenLabels.has(option.label));
  });
  return sanitized;
}

async function loadBuilderOptions() {
  optionsStatus.textContent = "Loading builder options...";

  try {
    const response = await fetch("/api/options");
    if (!response.ok) throw new Error("Backend options unavailable");
    builderOptions = await response.json();
  } catch {
    try {
      builderOptions = JSON.parse(localStorage.getItem(builderOptionsStorageKey) || "null");
    } catch {
      builderOptions = null;
    }

    if (!builderOptions) {
      try {
        const response = await fetch("./data/options.json");
        builderOptions = await response.json();
      } catch {
        builderOptions = structuredClone(defaultBuilderOptions);
      }
    }
  }

  builderOptions = sanitizeBuilderOptions(builderOptions);
  renderBuilderOptions();
  optionsStatus.textContent = "Builder options loaded.";
}

function renderBuilderOptions() {
  optionsEditor.innerHTML = optionGroups
    .map(([group, title]) => {
      const rows = Array.isArray(builderOptions[group]) ? builderOptions[group] : [];
      return `
        <section class="options-group" data-options-group="${group}">
          <div class="section-title">
            <h2>${title}</h2>
            <button class="save-button" type="button" data-option-add="${group}">Add Option</button>
          </div>
          <div class="option-edit-rows">
            ${rows.map((option) => renderOptionRow(group, option)).join("")}
          </div>
        </section>
      `;
    })
    .join("");
}

function renderOptionRow(group, option = {}) {
  const isColor = group === "color";
  const priceValue = noExtraCostGroups.has(group) ? Number(option.price || 0) : Number(option.price || 0);

  return `
    <div class="option-edit-row" data-option-row>
      <label>
        Label
        <input data-option-label value="${escapeHtml(option.label || "")}" />
      </label>
      <label>
        ${isColor ? "Swatch color" : noExtraCostGroups.has(group) ? "Price (₹, usually 0)" : "Price (₹)"}
        <input data-option-${isColor ? "value" : "price"} type="${isColor ? "text" : "number"}" min="0" value="${escapeHtml(
          isColor ? option.value || "#cccccc" : priceValue
        )}" />
      </label>
      <button class="danger-button" type="button" data-option-remove>Remove</button>
    </div>
  `;
}

function normalizeFabric(input = {}) {
  return {
    id: String(input.id || localId("fabric")),
    name: String(input.name || "").trim().slice(0, 50),
    category: String(input.category || "Daily Wear").trim().slice(0, 40),
    bestFor: String(input.bestFor || "").trim().slice(0, 160),
    comfort: String(input.comfort || "").trim().slice(0, 80),
    priceRange: String(input.priceRange || "").trim().slice(0, 80),
    care: String(input.care || "").trim().slice(0, 100),
    image: String(input.image || "").trim(),
    note: String(input.note || "").trim().slice(0, 220),
  };
}

function removeStarterFabrics(fabrics = []) {
  return Array.isArray(fabrics) ? fabrics.filter((fabric) => !removedStarterFabricIds.has(fabric.id)) : [];
}

function mergeWithDefaultFabrics(fabrics = []) {
  const byId = new Map(defaultFabricLibrary.map((fabric) => [fabric.id, fabric]));
  removeStarterFabrics(fabrics).forEach((fabric) => byId.set(fabric.id, fabric));
  return [...byId.values()];
}

function renderFabricLibrary() {
  if (!fabricList) return;
  renderAdminOverview();

  if (!fabricLibrary.length) {
    fabricList.innerHTML = '<p class="empty-cart">No fabrics yet.</p>';
    return;
  }

  fabricList.innerHTML = fabricLibrary
    .map(
      (fabric) => `
        <article class="fabric-manager-card" data-fabric-id="${escapeHtml(fabric.id)}">
          <div class="fabric-manager-image">
            ${
              fabric.image
                ? `<img src="${escapeHtml(fabric.image)}" alt="${escapeHtml(fabric.name)} fabric" />`
                : `<span>${escapeHtml(fabric.name || "FA").slice(0, 2).toUpperCase()}</span>`
            }
          </div>
          <div class="fabric-manager-fields">
            <label>Name <input data-fabric-field="name" value="${escapeHtml(fabric.name)}" /></label>
            <label>Category <input data-fabric-field="category" value="${escapeHtml(fabric.category)}" /></label>
            <label>Best for <input data-fabric-field="bestFor" value="${escapeHtml(fabric.bestFor)}" /></label>
            <label>Comfort <input data-fabric-field="comfort" value="${escapeHtml(fabric.comfort)}" /></label>
            <label>Price range <input data-fabric-field="priceRange" value="${escapeHtml(fabric.priceRange)}" /></label>
            <label>Care <input data-fabric-field="care" value="${escapeHtml(fabric.care)}" /></label>
            <label class="fabric-manager-wide">Image URL <input data-fabric-field="image" value="${escapeHtml(
              fabric.image
            )}" /></label>
            <label class="fabric-manager-wide">Selling note <textarea data-fabric-field="note" rows="3">${escapeHtml(
              fabric.note
            )}</textarea></label>
          </div>
          <div class="manager-actions">
            <button class="save-button" type="button" data-fabric-save="${escapeHtml(fabric.id)}">Save Fabric</button>
            <button class="danger-button" type="button" data-fabric-delete="${escapeHtml(fabric.id)}">Delete</button>
          </div>
        </article>
      `
    )
    .join("");
}

async function saveFabricLibrary(statusText = "Fabric library saved.") {
  localStorage.setItem(fabricLibraryStorageKey, JSON.stringify(fabricLibrary));
  if (fabricStatus) fabricStatus.textContent = `${statusText} Saved in this browser.`;

  const operatorCode = fabricForm?.elements.operatorCode?.value || "";
  if (!operatorCode) return;

  try {
    const response = await fetch("/api/fabrics", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Operator-Code": operatorCode,
      },
      body: JSON.stringify(fabricLibrary),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Could not save fabrics online.");
    fabricLibrary = result;
    localStorage.setItem(fabricLibraryStorageKey, JSON.stringify(fabricLibrary));
    renderFabricLibrary();
    if (fabricStatus) fabricStatus.textContent = `${statusText} Saved online and in this browser.`;
  } catch {
    if (fabricStatus) fabricStatus.textContent = `${statusText} Saved in this browser. Online save needs server and code.`;
  }
}

async function loadFabricLibrary() {
  try {
    const storedLibrary = localStorage.getItem(fabricLibraryStorageKey);
    if (storedLibrary !== null) {
      const localLibrary = JSON.parse(storedLibrary);
      fabricLibrary = removeStarterFabrics(localLibrary);
      if (fabricLibrary.length !== localLibrary.length) {
        localStorage.setItem(fabricLibraryStorageKey, JSON.stringify(fabricLibrary));
      }
      if (fabricLibrary.length) {
        fabricLibrary = mergeWithDefaultFabrics(fabricLibrary);
        if (fabricLibrary.length !== localLibrary.length) {
          localStorage.setItem(fabricLibraryStorageKey, JSON.stringify(fabricLibrary));
        }
        renderFabricLibrary();
        if (fabricStatus) fabricStatus.textContent = `${fabricLibrary.length} local fabrics loaded.`;
        return;
      }
    }
  } catch {
    fabricLibrary = [];
  }

  try {
    const response = await fetch("/api/fabrics");
    if (!response.ok) throw new Error("Could not load fabrics.");
    fabricLibrary = mergeWithDefaultFabrics(await response.json());
  } catch {
    try {
      const response = await fetch("./data/fabrics.json");
      fabricLibrary = mergeWithDefaultFabrics(await response.json());
    } catch {
      fabricLibrary = mergeWithDefaultFabrics(defaultFabricLibrary);
    }
  }

  renderFabricLibrary();
  if (fabricStatus) fabricStatus.textContent = `${fabricLibrary.length} fabrics loaded.`;
}

function collectBuilderOptions() {
  const nextOptions = {};

  optionGroups.forEach(([group]) => {
    const groupElement = optionsEditor.querySelector(`[data-options-group="${group}"]`);
    nextOptions[group] = [...groupElement.querySelectorAll("[data-option-row]")]
      .map((row) => {
        const label = row.querySelector("[data-option-label]").value.trim();
        if (!label) return null;

        if (group === "color") {
          return {
            label,
            value: row.querySelector("[data-option-value]").value.trim() || "#cccccc",
          };
        }

        return {
          label,
          price: Math.max(0, Math.round(Number(row.querySelector("[data-option-price]").value || 0))),
        };
      })
      .filter(Boolean);
  });

  return nextOptions;
}

async function saveBuilderOptions() {
  const nextOptions = collectBuilderOptions();
  localStorage.setItem(builderOptionsStorageKey, JSON.stringify(nextOptions));
  builderOptions = nextOptions;
  optionsStatus.textContent = "Options saved in this browser.";

  try {
    const response = await fetch("/api/options", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-Operator-Code": optionsCode.value,
      },
      body: JSON.stringify(nextOptions),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Could not save online.");
    builderOptions = sanitizeBuilderOptions(result);
    localStorage.setItem(builderOptionsStorageKey, JSON.stringify(builderOptions));
    optionsStatus.textContent = "Options saved online and in this browser.";
  } catch (error) {
    optionsStatus.textContent = `Saved in this browser. Online save needs the running server and operator code.`;
  }
}

function formatMoney(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function getDesignStartingPrice(design = {}) {
  return Number(design.price || categoryStartingPrices[design.config?.category] || 0);
}

function formatDate(value) {
  if (!value) return "Not scheduled";
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(
    new Date(`${value}T12:00:00`)
  );
}

function crmStatusOptions(selected) {
  return crmStatuses
    .map((status) => `<option ${status === selected ? "selected" : ""}>${status}</option>`)
    .join("");
}

function renderAdminOverview() {
  if (!adminOverview) return;

  const today = new Date().toISOString().slice(0, 10);
  const pipelineValue = crmCustomers.reduce((sum, customer) => sum + Number(customer.orderValue || 0), 0);
  const followUps = crmCustomers.filter(
    (customer) => customer.followUpDate && customer.followUpDate <= today && customer.status !== "Delivered"
  ).length;
  const liveProducts = designs.filter((design) =>
    ["Semiformal", "Traditional", "Customer References", "Finished Outfits", "Fabric Samples"].includes(
      design.collection || "Semiformal"
    )
  ).length;
  const activeOrders = crmCustomers.filter((customer) =>
    ["Contacted", "Measuring", "Designing", "Ordered", "Follow-up"].includes(customer.status)
  ).length;

  const metrics = [
    ["Pipeline value", formatMoney(pipelineValue), "Potential order value"],
    ["Active orders", activeOrders, "Customers in progress"],
    ["Follow-ups due", followUps, "Need attention today"],
    ["Products", liveProducts, "Looks and references"],
    ["Fabrics", fabricLibrary.length, "Customer fabric choices"],
    ["Reviews", customerReviews.length, "Trust builders"],
  ];

  adminOverview.innerHTML = metrics
    .map(
      ([label, value, note]) => `
        <article>
          <span>${escapeHtml(label)}</span>
          <strong>${escapeHtml(value)}</strong>
          <small>${escapeHtml(note)}</small>
        </article>
      `
    )
    .join("");
}

function renderCrmStats() {
  const totalValue = crmCustomers.reduce((sum, customer) => sum + Number(customer.orderValue || 0), 0);
  const today = new Date().toISOString().slice(0, 10);
  const followUps = crmCustomers.filter(
    (customer) => customer.followUpDate && customer.followUpDate <= today && customer.status !== "Delivered"
  ).length;
  const active = crmCustomers.filter((customer) => !["Delivered", "Lead"].includes(customer.status)).length;

  crmStats.innerHTML = `
    <article><span>Total customers</span><strong>${crmCustomers.length}</strong></article>
    <article><span>Active outfits</span><strong>${active}</strong></article>
    <article><span>Follow-ups due</span><strong>${followUps}</strong></article>
    <article><span>Pipeline value</span><strong>${formatMoney(totalValue)}</strong></article>
  `;
  renderAdminOverview();
}

function getCrmPriority(customer = {}) {
  const today = new Date().toISOString().slice(0, 10);
  if (customer.followUpDate && customer.followUpDate <= today && customer.status !== "Delivered") return "Needs follow-up";
  if (["Measuring", "Designing"].includes(customer.status)) return "Needs measurement";
  if (customer.status === "Ordered") return "In production";
  if (Number(customer.orderValue || 0) >= 5000) return "High value";
  if (["Lead", "Contacted"].includes(customer.status)) return "Hot lead";
  if (customer.status === "Delivered") return "Delivered";
  return "Normal";
}

function renderCrmStatusBoard() {
  if (!crmStatusBoard) return;
  const boardStages = [
    ["Lead", "New enquiries"],
    ["Contacted", "Conversation started"],
    ["Measuring", "Measurements pending"],
    ["Designing", "Design approval"],
    ["Ordered", "Stitching / delivery"],
    ["Delivered", "Completed"],
  ];

  crmStatusBoard.innerHTML = boardStages
    .map(([stage, note]) => {
      const stageCustomers = crmCustomers.filter((customer) => customer.status === stage);
      const value = stageCustomers.reduce((sum, customer) => sum + Number(customer.orderValue || 0), 0);
      return `
        <article>
          <span>${escapeHtml(stage)}</span>
          <strong>${stageCustomers.length}</strong>
          <small>${escapeHtml(note)}</small>
          <em>${formatMoney(value)}</em>
        </article>
      `;
    })
    .join("");
}

function buildCrmWhatsAppUrl(customer, message = "") {
  const fallbackMessage = `Hi ${customer.name}, this is ImaginFit Studio. I am following up about ${customer.business || "your custom outfit"}.`;
  return `https://web.whatsapp.com/send?phone=${cleanPhone(customer.phone)}&text=${encodeURIComponent(
    message || fallbackMessage
  )}`;
}

function renderCrmActionBoard() {
  if (!crmActionBoard) return;
  const today = new Date().toISOString().slice(0, 10);
  const dueCustomers = crmCustomers
    .filter((customer) => customer.followUpDate && customer.followUpDate <= today && customer.status !== "Delivered")
    .slice(0, 6);
  const hotCustomers = crmCustomers
    .filter((customer) => ["Lead", "Contacted", "Follow-up"].includes(customer.status))
    .sort((a, b) => Number(b.orderValue || 0) - Number(a.orderValue || 0))
    .slice(0, 6);

  const renderActionList = (customers, emptyText) =>
    customers.length
      ? customers
          .map(
            (customer) => `
              <article>
                <div>
                  <strong>${escapeHtml(customer.name)}</strong>
                  <p>${escapeHtml(customer.business || customer.source)} · ${formatMoney(customer.orderValue || 0)}</p>
                </div>
                <a href="${buildCrmWhatsAppUrl(customer)}" target="_blank" rel="noopener">WhatsApp</a>
              </article>
            `
          )
          .join("")
      : `<p class="empty-cart">${emptyText}</p>`;

  crmActionBoard.innerHTML = `
    <section>
      <div>
        <p class="eyebrow">Today</p>
        <h3>${dueCustomers.length} follow-up${dueCustomers.length === 1 ? "" : "s"} due</h3>
      </div>
      <div class="crm-action-list">${renderActionList(dueCustomers, "No follow-ups due today.")}</div>
    </section>
    <section>
      <div>
        <p class="eyebrow">Hot leads</p>
        <h3>Message these first</h3>
      </div>
      <div class="crm-action-list">${renderActionList(hotCustomers, "No hot leads yet.")}</div>
    </section>
  `;
}

function filteredCrmCustomers() {
  const query = crmSearch.value.trim().toLowerCase();
  const status = crmFilter.value;

  return crmCustomers.filter((customer) => {
    const matchesStatus = status === "All" || customer.status === status;
    const searchable = [customer.name, customer.phone, customer.business, customer.source, customer.notes]
      .join(" ")
      .toLowerCase();
    return matchesStatus && (!query || searchable.includes(query));
  });
}

function renderCrmCustomers() {
  renderCrmStats();
  renderCrmStatusBoard();
  renderCrmActionBoard();
  const customers = filteredCrmCustomers();

  if (!customers.length) {
    crmList.innerHTML = '<p class="empty-cart">No customers match this view.</p>';
    return;
  }

  const today = new Date().toISOString().slice(0, 10);
  crmList.innerHTML = customers
    .map((customer) => {
      const followUpDue =
        customer.followUpDate && customer.followUpDate <= today && customer.status !== "Delivered";
      const whatsappUrl = `https://web.whatsapp.com/send?phone=${cleanPhone(customer.phone)}&text=${encodeURIComponent(
        `Hi ${customer.name}, this is ImaginFit Studio. I am following up about your custom outfit.`
      )}`;
      const priority = getCrmPriority(customer);

      return `
        <article class="crm-customer" data-crm-id="${customer.id}">
          <div class="crm-customer-head">
            <div>
              <span class="crm-stage crm-stage-${escapeHtml(customer.status).toLowerCase()}">${escapeHtml(
                customer.status
              )}</span>
              <span class="crm-priority">${escapeHtml(priority)}</span>
              <h3>${escapeHtml(customer.name)}</h3>
              <p>${escapeHtml(customer.phone)} · ${escapeHtml(customer.business || customer.source)}</p>
            </div>
            <div class="crm-follow-up ${followUpDue ? "is-due" : ""}">
              <span>${followUpDue ? "Follow-up due" : "Next follow-up"}</span>
              <strong>${formatDate(customer.followUpDate)}</strong>
            </div>
          </div>
          <div class="crm-fields">
            <label>
              Stage
              <select data-crm-field="status">${crmStatusOptions(customer.status)}</select>
            </label>
            <label>
              Follow-up date
              <input data-crm-field="followUpDate" type="date" value="${escapeHtml(customer.followUpDate)}" />
            </label>
            <label>
              Need by
              <input data-crm-field="needBy" type="date" value="${escapeHtml(customer.needBy || "")}" />
            </label>
            <label>
              Order value (₹)
              <input data-crm-field="orderValue" type="number" min="0" step="100" value="${Number(
                customer.orderValue || 0
              )}" />
            </label>
            <label class="crm-notes">
              Notes
              <textarea data-crm-field="notes" rows="3" placeholder="Measurements, style choices, next steps...">${escapeHtml(
                customer.notes
              )}</textarea>
            </label>
          </div>
          <div class="manager-actions">
            <button class="checkout-button" type="button" data-crm-save="${customer.id}">Save Customer</button>
            <a class="save-button" href="${whatsappUrl}" target="_blank" rel="noopener">WhatsApp</a>
            <button class="danger-button" type="button" data-crm-delete="${customer.id}">Delete</button>
          </div>
        </article>
      `;
    })
    .join("");
}

async function loadCrmCustomers() {
  crmStatus.textContent = "Loading customer CRM...";
  try {
    const response = await fetch("/api/customers");
    if (!response.ok) throw new Error("Could not load customers.");
    crmCustomers = (await response.json()).map((customer) => ({
      status: "Lead",
      notes: "",
      followUpDate: "",
      orderValue: 0,
      ...customer,
    }));
    renderCrmCustomers();
    crmStatus.textContent = `${crmCustomers.length} customer${crmCustomers.length === 1 ? "" : "s"} loaded.`;
  } catch (error) {
    crmCustomers = readLocalArray(localCrmStorageKey);
    renderCrmCustomers();
    crmStatus.textContent = crmCustomers.length
      ? `${crmCustomers.length} local customer${crmCustomers.length === 1 ? "" : "s"} loaded.`
      : "Server is not running. CRM will save locally on this system.";
  }
}

async function saveCrmCustomer(button) {
  const card = button.closest("[data-crm-id]");
  const changes = {};
  card.querySelectorAll("[data-crm-field]").forEach((field) => {
    changes[field.dataset.crmField] = field.value;
  });

  try {
    const response = await fetch(`/api/customers/${encodeURIComponent(card.dataset.crmId)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-Operator-Code": crmCode.value,
      },
      body: JSON.stringify(changes),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Could not save customer.");
    crmStatus.textContent = `${result.name} was updated.`;
    await loadCrmCustomers();
  } catch (error) {
    if (!isOfflineApiError(error)) throw error;
    const index = crmCustomers.findIndex((customer) => customer.id === card.dataset.crmId);
    if (index === -1) throw new Error("Customer not found.");
    crmCustomers[index] = { ...crmCustomers[index], ...changes, updatedAt: new Date().toISOString() };
    saveLocalArray(localCrmStorageKey, crmCustomers);
    crmStatus.textContent = `${crmCustomers[index].name} was saved locally.`;
    renderCrmCustomers();
  }
}

function collectionOptions(selected) {
  return ["Semiformal", "Traditional", "Customer References", "Finished Outfits", "Fabric Samples"]
    .map((collection) => `<option ${collection === selected ? "selected" : ""}>${collection}</option>`)
    .join("");
}

async function getImageInput(data) {
  const imageFile = data.get("image");
  const imageUrl = data.get("imageUrl").trim();

  if (imageFile && imageFile.size) return fileToDataUrl(imageFile);
  if (imageUrl) return imageUrl;
  return "";
}

async function showUploadPreview() {
  const data = new FormData(form);
  const image = await getImageInput(data);

  if (!image) {
    uploadPreview.innerHTML = "<span>Preview appears here</span>";
    return;
  }

  uploadPreview.innerHTML = isPinterestPageUrl(image)
    ? renderPinterestSourceCard(image, "Source link ready")
    : `<img src="${escapeHtml(image)}" alt="Selected upload preview" />`;
}

async function loadDesigns() {
  try {
    const response = await fetch("/api/designs");
    if (!response.ok) throw new Error("Backend designs unavailable");
    designs = await response.json();
  } catch {
    designs = readLocalArray(localDesignsStorageKey);
    if (!designs.length) {
      try {
        const response = await fetch("./data/designs.json");
        designs = await response.json();
      } catch {
        designs = [];
      }
    }
  }

  renderDesigns();
}

function renderDesigns() {
  adminDesigns.innerHTML = designs
    .map((design, index) => {
      const sourceUrl = getDesignSourceUrl(design);
      const imageFieldValue = sourceUrl || design.image;
      return `
        <article class="manager-card" data-card-id="${design.id}">
          <img src="${escapeHtml(getDesignPreviewImage(design))}" alt="${escapeHtml(design.title)}" />
          <div class="manager-fields">
            <label>
              Title
              <input data-field="title" value="${escapeHtml(design.title)}" />
            </label>
            <label>
              Section
              <select data-field="collection">${collectionOptions(design.collection || "Semiformal")}</select>
            </label>
            <label>
              Photo URL
              <input data-field="image" value="${escapeHtml(imageFieldValue)}" />
              ${sourceUrl ? `<a class="source-link" href="${escapeHtml(sourceUrl)}" target="_blank" rel="noopener">Open Source</a>` : ""}
            </label>
            <div class="form-row">
              <label>
                Designer
                <input data-field="designer" value="${escapeHtml(design.designer)}" />
              </label>
              <label>
                Likes
                <input data-field="likes" value="${escapeHtml(design.likes)}" />
              </label>
            </div>
            <label>
              Starting price (₹)
              <input data-field="price" type="number" min="0" step="100" value="${getDesignStartingPrice(design)}" />
            </label>
            <label>
              Note
              <input data-field="note" value="${escapeHtml(design.note)}" />
            </label>
          </div>
          <div class="manager-actions">
            <button class="save-button" type="button" data-save="${design.id}">Save</button>
            <button class="save-button" type="button" data-move-up="${index}" ${index === 0 ? "disabled" : ""}>Move Up</button>
            <button class="save-button" type="button" data-move-down="${index}" ${
              index === designs.length - 1 ? "disabled" : ""
            }>Move Down</button>
            <button class="danger-button" type="button" data-delete="${design.id}">Delete</button>
          </div>
        </article>
      `
    })
    .join("");
  renderContentPlanner();
  renderAdminOverview();
}

function buildContentCopies(design = {}) {
  const price = formatMoney(getDesignStartingPrice(design));
  const title = design.title || "custom outfit";
  const category = design.config?.category || "custom outfit";
  const fabric = design.config?.fabric || "selected fabric";
  const note = design.note || "made to order";

  return [
    {
      label: "Instagram caption",
      text: `${title}\n\nA made-to-order ${category.toLowerCase()} starting from ${price}. Choose your fabric, share measurements, and customize the details with ImaginFit Studio.\n\nDM or WhatsApp to book your fit.\n\n#customclothing #tailoredfit #imaginfitstudio`,
    },
    {
      label: "Story poll",
      text: `New look: ${title}\nFabric: ${fabric}\nStarting: ${price}\n\nPoll: Would you wear this in ${fabric}?\nOptions: Yes / Customize it`,
    },
    {
      label: "Reference post",
      text: `${title} - ${note}. Save this custom outfit inspiration for your next stitched fit. Starting from ${price}.`,
    },
    {
      label: "WhatsApp broadcast",
      text: `Hi {name}, new ImaginFit look added: ${title}. It starts from ${price} and can be customized with your measurements. Reply "FIT" if you want details today.`,
    },
  ];
}

function renderContentPlanner() {
  if (!contentPlanner) return;

  const contentDesigns = designs.slice(0, 6);
  if (!contentDesigns.length) {
    contentPlanner.innerHTML = '<p class="empty-cart">Add gallery looks first, then content ideas will appear here.</p>';
    return;
  }

  contentPlanner.innerHTML = contentDesigns
    .map((design) => {
      const copies = buildContentCopies(design);
      return `
        <article class="content-card">
          <img src="${escapeHtml(getDesignPreviewImage(design))}" alt="${escapeHtml(design.title)}" />
          <div class="content-card-copy">
            <div>
              <p class="eyebrow">${escapeHtml(design.collection || "Gallery")}</p>
              <h3>${escapeHtml(design.title)}</h3>
              <strong>${formatMoney(getDesignStartingPrice(design))}</strong>
            </div>
            <div class="content-copy-grid">
              ${copies
                .map(
                  (copy) => `
                    <div class="content-copy-box">
                      <div>
                        <strong>${escapeHtml(copy.label)}</strong>
                        <button class="save-button" type="button" data-copy-content="${encodeURIComponent(copy.text)}">Copy</button>
                      </div>
                      <p>${escapeHtml(copy.text)}</p>
                    </div>
                  `
                )
                .join("")}
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

async function copyContentText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.append(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

function getManagerCode() {
  return managerCode.value || form.elements.operatorCode.value;
}

async function saveOrder() {
  saveLocalArray(localDesignsStorageKey, designs);

  try {
    const response = await fetch("/api/designs/reorder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Operator-Code": getManagerCode(),
      },
      body: JSON.stringify({ orderedIds: designs.map((design) => design.id) }),
    });

    if (!response.ok) throw new Error("Could not save the new order.");
  } catch (error) {
    if (!isOfflineApiError(error)) throw error;
  }
}

function previewPinterestUrl() {
  const imageUrl = pinterestForm.elements.pinterestUrl.value.trim();
  if (!imageUrl) {
    pinterestPreview.innerHTML = "<span>Paste an image address first</span>";
    pinterestStatus.textContent = "Paste a source link or direct image address.";
    return;
  }

  if (isPinterestPageUrl(imageUrl)) {
    pinterestPreview.innerHTML = renderPinterestSourceCard(imageUrl);
    pinterestStatus.textContent =
      "This is a source page. I will save it as an inspiration source card. For the actual photo, paste a direct image address.";
    return;
  }

  pinterestPreview.innerHTML = `<img src="${escapeHtml(imageUrl)}" alt="Inspiration preview" />`;
  const previewImage = pinterestPreview.querySelector("img");
  previewImage.addEventListener("error", () => {
    pinterestPreview.innerHTML = renderPinterestSourceCard(imageUrl, "Image preview unavailable");
    pinterestStatus.textContent = isPinterestUrl(imageUrl)
      ? "This site did not allow this link as a photo. Save it as a source card or paste a direct image address."
      : "This link did not load as a photo. Use a direct image address for image preview.";
  });
  pinterestStatus.textContent = isPinterestUrl(imageUrl)
    ? "Direct image preview added. You can save it."
    : "Preview added. You can save it if the image appears above.";
}

async function getPinterestDropImage(dataTransfer) {
  const imageFile = [...(dataTransfer.files || [])].find((file) => file.type.startsWith("image/"));
  if (imageFile) {
    return {
      value: await fileToDataUrl(imageFile),
      label: imageFile.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "),
      kind: "file",
    };
  }

  const uriList = dataTransfer.getData("text/uri-list").trim();
  const plainText = dataTransfer.getData("text/plain").trim();
  const html = dataTransfer.getData("text/html");
  const htmlSrc = html.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1] || "";
  const value = htmlSrc || uriList || plainText;
  return {
    value,
    label: "Inspiration Look",
    kind: "link",
  };
}

async function applyPinterestDrop(dataTransfer) {
  const dropped = await getPinterestDropImage(dataTransfer);
  if (!dropped.value) {
    pinterestStatus.textContent = "Drop an image file or image/source link.";
    return;
  }

  pinterestForm.elements.pinterestUrl.value = dropped.value;
  if (dropped.kind === "file") {
    pinterestForm.elements.title.value = dropped.label || "Dropped Outfit Look";
    pinterestStatus.textContent = "Outfit image dropped. Add section/category, then save it.";
  } else {
    pinterestStatus.textContent = "Source link dropped. Preview it, then save it.";
  }
  previewPinterestUrl();
}

function buildPinterestDesign(data) {
  const sourceUrl = data.get("pinterestUrl").trim();
  const image = isPinterestPageUrl(sourceUrl) ? createPinterestPlaceholderImage(sourceUrl) : sourceUrl;
  const category = data.get("category");
  return {
    id: localId("inspiration"),
    title: data.get("title").trim(),
    designer: "Inspiration Upload",
    likes: "Inspiration",
    note: data.get("note").trim() || "Saved inspiration",
    price: Math.max(0, Math.round(Number(data.get("price") || categoryStartingPrices[category] || 0))),
    collection: data.get("collection"),
    image,
    config: {
      category,
      fabric: data.get("fabric"),
      color: "Charcoal",
      neckline: "Round",
      sleeves: "Three Quarter",
      fit: "Tailored",
      measurement: "Tailored Body",
      extras: [],
      accessories: [],
      sourceUrl: isPinterestPageUrl(sourceUrl) ? sourceUrl : "",
    },
  };
}

async function saveDesignRecord(design, operatorCode = "") {
  try {
    const response = await fetch("/api/designs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Operator-Code": operatorCode,
      },
      body: JSON.stringify(design),
    });

    if (!response.ok) throw new Error(response.status === 401 ? "The operator code is not correct." : "Could not save online.");
    return {
      design: await response.json(),
      online: true,
    };
  } catch (error) {
    if (!isOfflineApiError(error) && error.message !== "The operator code is not correct.") throw error;
    return {
      design,
      online: false,
    };
  }
}

form.addEventListener("change", showUploadPreview);
form.addEventListener("input", (event) => {
  if (event.target.name === "imageUrl") showUploadPreview();
});

pinterestPreviewButton.addEventListener("click", previewPinterestUrl);
pinterestForm.elements.pinterestUrl.addEventListener("input", previewPinterestUrl);

pinterestDropZone?.addEventListener("dragover", (event) => {
  event.preventDefault();
  pinterestDropZone.classList.add("is-drag-over");
});

pinterestDropZone?.addEventListener("dragleave", () => {
  pinterestDropZone.classList.remove("is-drag-over");
});

pinterestDropZone?.addEventListener("drop", async (event) => {
  event.preventDefault();
  pinterestDropZone.classList.remove("is-drag-over");
  await applyPinterestDrop(event.dataTransfer);
});

pinterestDropZone?.addEventListener("paste", async (event) => {
  if (!event.clipboardData) return;
  event.preventDefault();
  await applyPinterestDrop(event.clipboardData);
});

pinterestForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  pinterestStatus.textContent = "Saving inspiration look...";
  const data = new FormData(pinterestForm);
  const design = buildPinterestDesign(data);

  if (!design.title || !design.image) {
    pinterestStatus.textContent = "Add a title and image address.";
    return;
  }

  try {
    const result = await saveDesignRecord(design, data.get("operatorCode"));
    designs.unshift(result.design);
    saveLocalArray(localDesignsStorageKey, designs);
    pinterestStatus.textContent = result.online
      ? "Inspiration look saved online and added to the gallery."
      : "Inspiration look saved locally on this system.";
    pinterestForm.reset();
    pinterestForm.elements.title.value = "Inspiration Look";
    pinterestForm.elements.price.value = "2999";
    pinterestForm.elements.note.value = "Saved inspiration";
    pinterestPreview.innerHTML = "<span>Preview appears here</span>";
    renderDesigns();
  } catch (error) {
    pinterestStatus.textContent = error.message;
  }
});

waTemplate.addEventListener("input", saveWhatsAppDesk);
waTemplate.addEventListener("input", renderWhatsAppPreview);

waTemplateChoices.forEach((button) => {
  button.addEventListener("click", () => {
    const nextTemplate = whatsappTemplates[button.dataset.waTemplateChoice];
    if (!nextTemplate) return;
    waTemplate.value = nextTemplate;
    waTemplateChoices.forEach((item) => item.classList.toggle("is-selected", item === button));
    renderWhatsAppPreview();
    saveWhatsAppDesk();
  });
});

waSegmentFilter?.addEventListener("change", () => {
  renderWhatsAppCustomers();
  renderWhatsAppLinks();
});

waSearch?.addEventListener("input", () => {
  renderWhatsAppCustomers();
  renderWhatsAppLinks();
});

async function updateWhatsAppPhoto() {
  whatsappPhoto = await getWhatsAppPhotoInput();
  renderWhatsAppPhoto();
  renderWhatsAppCustomers();
  renderWhatsAppLinks();
  saveWhatsAppDesk();
}

waPhotoFile.addEventListener("change", updateWhatsAppPhoto);
waPhotoUrl.addEventListener("input", updateWhatsAppPhoto);

waClearPhoto.addEventListener("click", () => {
  whatsappPhoto = "";
  waPhotoFile.value = "";
  waPhotoUrl.value = "";
  renderWhatsAppPhoto();
  renderWhatsAppCustomers();
  renderWhatsAppLinks();
  saveWhatsAppDesk();
});

waForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(waForm);

  whatsappCustomers.unshift({
    id: crypto.randomUUID(),
    name: data.get("name").trim(),
    phone: data.get("phone").trim(),
    business: data.get("business").trim(),
    segment: data.get("segment") || "Lead",
  });

  waForm.reset();
  waForm.elements.business.value = "ImaginFit Studio";
  waForm.elements.segment.value = "Lead";
  waStatus.textContent = "Customer added for WhatsApp messages.";
  renderWhatsAppCustomers();
  saveWhatsAppDesk();
});

waList.addEventListener("click", (event) => {
  const copyButton = event.target.closest("[data-wa-copy]");
  const removeButton = event.target.closest("[data-wa-remove]");

  if (copyButton) {
    const customer = whatsappCustomers.find((item) => item.id === copyButton.dataset.waCopy);
    if (customer) copyWhatsAppMessage(customer);
  }

  if (removeButton) {
    whatsappCustomers = whatsappCustomers.filter((item) => item.id !== removeButton.dataset.waRemove);
    waStatus.textContent = "Customer removed.";
    renderWhatsAppCustomers();
    renderWhatsAppLinks();
    saveWhatsAppDesk();
  }
});

waOpenAll.addEventListener("click", () => {
  if (!whatsappCustomers.length) {
    waStatus.textContent = "Add customers first, then prepare their WhatsApp links.";
    return;
  }

  renderWhatsAppLinks();
  const preparedCount = getFilteredWhatsAppCustomers().filter((customer) => cleanPhone(customer.phone)).length;
  waStatus.textContent = `Prepared ${preparedCount} WhatsApp message${
    preparedCount === 1 ? "" : "s"
  }. Use the browser links on the right to open each WhatsApp Web chat.`;
});

waDemo.addEventListener("click", () => {
  whatsappCustomers = [
    {
      id: crypto.randomUUID(),
      name: "Test Customer 1",
      phone: "+91 98765 43210",
      business: "Demo only - replace with a real WhatsApp number",
      segment: "Lead",
    },
    {
      id: crypto.randomUUID(),
      name: "Test Customer 2",
      phone: "+91 91234 56789",
      business: "Demo only - replace with a real WhatsApp number",
      segment: "Measurement Pending",
    },
  ];
  waStatus.textContent = "Demo customers added.";
  renderWhatsAppCustomers();
  saveWhatsAppDesk();
});

waRefresh.addEventListener("click", loadSubmittedCustomers);

optionsRefresh.addEventListener("click", loadBuilderOptions);
optionsSave.addEventListener("click", saveBuilderOptions);
optionsEditor.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-option-add]");
  const removeButton = event.target.closest("[data-option-remove]");

  if (addButton) {
    const group = addButton.dataset.optionAdd;
    const rows = addButton.closest("[data-options-group]").querySelector(".option-edit-rows");
    rows.insertAdjacentHTML("beforeend", renderOptionRow(group, group === "color" ? { value: "#cccccc" } : { price: 0 }));
  }

  if (removeButton) {
    removeButton.closest("[data-option-row]").remove();
  }
});

crmSearch.addEventListener("input", renderCrmCustomers);
crmFilter.addEventListener("change", renderCrmCustomers);
crmRefresh.addEventListener("click", loadCrmCustomers);
crmAddForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(crmAddForm);
  crmStatus.textContent = "Adding customer...";

  try {
    const response = await fetch("/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.get("name"),
        phone: data.get("phone"),
        business: data.get("business"),
        source: "Operator CRM",
      }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Could not add customer.");
    crmAddForm.reset();
    crmAddForm.elements.business.value = "Custom outfit enquiry";
    crmStatus.textContent = `${result.name} was added to the CRM.`;
    await loadCrmCustomers();
  } catch (error) {
    if (!isOfflineApiError(error)) {
      crmStatus.textContent = error.message;
      return;
    }

    const customer = {
      id: localId("customer"),
      name: data.get("name").trim(),
      phone: cleanPhone(data.get("phone")),
      business: data.get("business").trim() || "Custom outfit enquiry",
      source: "Operator CRM",
      status: "Lead",
      notes: "",
      followUpDate: "",
      orderValue: 0,
      createdAt: new Date().toISOString(),
      updatedAt: "",
    };

    if (!customer.name || customer.phone.length < 10) {
      crmStatus.textContent = "Add a name and valid WhatsApp number.";
      return;
    }

    crmCustomers.unshift(customer);
    saveLocalArray(localCrmStorageKey, crmCustomers);
    crmAddForm.reset();
    crmAddForm.elements.business.value = "Custom outfit enquiry";
    crmStatus.textContent = `${customer.name} was saved locally.`;
    renderCrmCustomers();
  }
});

crmList.addEventListener("click", async (event) => {
  const saveButton = event.target.closest("[data-crm-save]");
  const deleteButton = event.target.closest("[data-crm-delete]");

  try {
    if (saveButton) await saveCrmCustomer(saveButton);

    if (deleteButton) {
      const customer = crmCustomers.find((item) => item.id === deleteButton.dataset.crmDelete);
      if (!customer || !window.confirm(`Delete ${customer.name} from the CRM?`)) return;

      const response = await fetch(`/api/customers/${encodeURIComponent(customer.id)}`, {
        method: "DELETE",
        headers: { "X-Operator-Code": crmCode.value },
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not delete customer.");
      crmStatus.textContent = `${customer.name} was deleted.`;
      await loadCrmCustomers();
    }
  } catch (error) {
    const deleteButton = event.target.closest("[data-crm-delete]");
    const customer = deleteButton
      ? crmCustomers.find((item) => item.id === deleteButton.dataset.crmDelete)
      : null;

    if (!deleteButton || !customer || !isOfflineApiError(error)) {
      crmStatus.textContent = error.message;
      return;
    }

    crmCustomers = crmCustomers.filter((item) => item.id !== customer.id);
    saveLocalArray(localCrmStorageKey, crmCustomers);
    crmStatus.textContent = `${customer.name} was deleted locally.`;
    renderCrmCustomers();
  }
});

fabricForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(fabricForm);
  const fabric = normalizeFabric({
    name: data.get("name"),
    category: data.get("category"),
    bestFor: data.get("bestFor"),
    comfort: data.get("comfort"),
    priceRange: data.get("priceRange"),
    care: data.get("care"),
    image: data.get("image"),
    note: data.get("note"),
  });

  if (!fabric.name) {
    if (fabricStatus) fabricStatus.textContent = "Add a fabric name.";
    return;
  }

  fabricLibrary.unshift(fabric);
  renderFabricLibrary();
  await saveFabricLibrary(`${fabric.name} added.`);
  fabricForm.reset();
  fabricForm.elements.name.value = "Cotton";
  fabricForm.elements.bestFor.value = "Everyday kurtis and shirts";
  fabricForm.elements.comfort.value = "Breathable";
  fabricForm.elements.priceRange.value = "₹1,999-₹3,499 outfits";
  fabricForm.elements.care.value = "Easy wash";
  fabricForm.elements.note.value = "Best first choice for comfort and repeat orders.";
});

fabricList?.addEventListener("click", async (event) => {
  const saveButton = event.target.closest("[data-fabric-save]");
  const deleteButton = event.target.closest("[data-fabric-delete]");
  const button = saveButton || deleteButton;
  if (!button) return;

  if (deleteButton) {
    const fabric = fabricLibrary.find((item) => item.id === deleteButton.dataset.fabricDelete);
    fabricLibrary = fabricLibrary.filter((item) => item.id !== deleteButton.dataset.fabricDelete);
    renderFabricLibrary();
    await saveFabricLibrary(`${fabric?.name || "Fabric"} deleted.`);
    return;
  }

  const card = saveButton.closest("[data-fabric-id]");
  const fabric = fabricLibrary.find((item) => item.id === card.dataset.fabricId);
  if (!fabric) return;

  card.querySelectorAll("[data-fabric-field]").forEach((field) => {
    fabric[field.dataset.fabricField] = field.value.trim();
  });

  const normalized = normalizeFabric(fabric);
  fabricLibrary = fabricLibrary.map((item) => (item.id === normalized.id ? normalized : item));
  renderFabricLibrary();
  await saveFabricLibrary(`${normalized.name} updated.`);
});

reviewForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(reviewForm);
  const review = normalizeReview({
    id: localId("review"),
    name: data.get("name"),
    outfit: data.get("outfit"),
    rating: data.get("rating"),
    text: data.get("text"),
    note: data.get("note"),
  });

  if (!review.name || !review.text) {
    if (reviewStatus) reviewStatus.textContent = "Add customer name and review text.";
    return;
  }

  customerReviews.unshift(review);
  saveCustomerReviews(`${review.name} review added to homepage.`);
  reviewForm.reset();
  reviewForm.elements.name.value = "Ananya Sharma";
  reviewForm.elements.outfit.value = "Traditional suit order";
  reviewForm.elements.rating.value = "5";
  reviewForm.elements.text.value = "The fit felt comfortable and the suit looked exactly like the soft occasion look I wanted.";
  reviewForm.elements.note.value = "Family function outfit with dupatta styling and full sleeve comfort.";
});

reviewList?.addEventListener("click", (event) => {
  const deleteButton = event.target.closest("[data-review-delete]");
  if (!deleteButton) return;
  const review = customerReviews.find((item) => item.id === deleteButton.dataset.reviewDelete);
  customerReviews = customerReviews.filter((item) => item.id !== deleteButton.dataset.reviewDelete);
  saveCustomerReviews(`${review?.name || "Review"} deleted.`);
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  statusMessage.textContent = "Publishing photo...";

  const data = new FormData(form);
  const imageInput = await getImageInput(data);
  const image = isPinterestPageUrl(imageInput) ? createPinterestPlaceholderImage(imageInput) : imageInput;

  const design = {
    id: localId("design"),
    title: data.get("title").trim(),
    designer: data.get("designer").trim(),
    likes: data.get("likes").trim(),
    note: data.get("note").trim() || data.get("photoPurpose"),
    price: Math.max(0, Math.round(Number(data.get("price") || 0))),
    collection: data.get("collection"),
    image,
    config: {
      category: data.get("category"),
      fabric: data.get("fabric"),
      color: data.get("color"),
      neckline: data.get("neckline"),
      sleeves: data.get("sleeves"),
      fit: data.get("fit"),
      measurement: data.get("measurement"),
      extras: selectedExtras(form.elements.extras),
      accessories: selectedExtras(form.elements.accessories),
      sourceUrl: isPinterestPageUrl(imageInput) ? imageInput : "",
    },
  };

  if (!design.title || !design.designer || !design.image) {
    statusMessage.textContent = "Upload failed. Add title, designer, and a photo file or URL.";
    return;
  }

  try {
    const response = await fetch("/api/designs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Operator-Code": data.get("operatorCode"),
      },
      body: JSON.stringify(design),
    });

    if (!response.ok) {
      statusMessage.textContent =
        response.status === 401
          ? "Upload failed. The operator code is not correct."
          : "Upload failed. Add a photo file or URL and check the required fields.";
      return;
    }

    const savedDesign = await response.json();
    designs.unshift(savedDesign);
    saveLocalArray(localDesignsStorageKey, designs);
    statusMessage.textContent = "Photo published online. It is now visible on the website.";
  } catch (error) {
    if (!isOfflineApiError(error)) {
      statusMessage.textContent = error.message;
      return;
    }

    try {
      designs.unshift(design);
      saveLocalArray(localDesignsStorageKey, designs);
      statusMessage.textContent = "Photo posted locally. It is visible on this system.";
    } catch {
      designs.shift();
      statusMessage.textContent =
        "Photo is too large for local browser storage. Use an image URL or run the backend server for uploads.";
      return;
    }
  }

  form.reset();
  uploadPreview.innerHTML = "<span>Preview appears here</span>";
  renderDesigns();
});

adminDesigns.addEventListener("click", async (event) => {
  const deleteButton = event.target.closest("[data-delete]");
  const saveButton = event.target.closest("[data-save]");
  const upButton = event.target.closest("[data-move-up]");
  const downButton = event.target.closest("[data-move-down]");

  try {
    if (saveButton) {
      const card = saveButton.closest("[data-card-id]");
      const id = card.dataset.cardId;
      const design = designs.find((item) => item.id === id);

      card.querySelectorAll("[data-field]").forEach((field) => {
        design[field.dataset.field] =
          field.dataset.field === "price" ? Math.max(0, Math.round(Number(field.value || 0))) : field.value.trim();
      });
      if (!design.config) design.config = {};
      if (isPinterestPageUrl(design.image)) {
        design.config.sourceUrl = design.image;
        design.image = createPinterestPlaceholderImage(design.image);
      }

      try {
        const response = await fetch(`/api/designs/${encodeURIComponent(id)}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "X-Operator-Code": getManagerCode(),
          },
          body: JSON.stringify(design),
        });

        if (!response.ok) throw new Error("Could not save this photo.");
        statusMessage.textContent = "Photo updated.";
        await loadDesigns();
      } catch (error) {
        if (!isOfflineApiError(error)) throw error;
        saveLocalArray(localDesignsStorageKey, designs);
        statusMessage.textContent = "Photo updated locally.";
        renderDesigns();
      }
    }

    if (deleteButton) {
      try {
        const response = await fetch(`/api/designs/${encodeURIComponent(deleteButton.dataset.delete)}`, {
          method: "DELETE",
          headers: { "X-Operator-Code": getManagerCode() },
        });

        if (!response.ok) throw new Error("Could not delete this photo.");
        statusMessage.textContent = "Photo deleted.";
        await loadDesigns();
      } catch (error) {
        if (!isOfflineApiError(error)) throw error;
        designs = designs.filter((design) => design.id !== deleteButton.dataset.delete);
        saveLocalArray(localDesignsStorageKey, designs);
        statusMessage.textContent = "Photo deleted locally.";
        renderDesigns();
      }
    }

    if (upButton || downButton) {
      const index = Number((upButton || downButton).dataset.moveUp ?? downButton?.dataset.moveDown);
      const direction = upButton ? -1 : 1;
      const nextIndex = index + direction;
      [designs[index], designs[nextIndex]] = [designs[nextIndex], designs[index]];
      await saveOrder();
      statusMessage.textContent = "Gallery order saved.";
      renderDesigns();
    }
  } catch (error) {
    statusMessage.textContent = error.message;
  }
});

contentPlanner?.addEventListener("click", async (event) => {
  const copyButton = event.target.closest("[data-copy-content]");
  if (!copyButton) return;

  try {
    await copyContentText(decodeURIComponent(copyButton.dataset.copyContent));
    if (contentStatus) contentStatus.textContent = "Content copied.";
  } catch {
    if (contentStatus) contentStatus.textContent = "Could not copy automatically. Select the text and copy it manually.";
  }
});

loadDesigns().catch(() => {
  statusMessage.textContent = "Could not load designs. Make sure the backend server is running.";
});

loadWhatsAppDesk();
loadSubmittedCustomers();
loadCrmCustomers();
loadFabricLibrary();
loadCustomerReviews();
loadBuilderOptions().catch((error) => {
  optionsStatus.textContent = error.message;
});
