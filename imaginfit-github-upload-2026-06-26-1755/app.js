const defaultOptions = {
  category: [
    { label: "Kurti", price: 2499 },
    { label: "Suit", price: 3999 },
    { label: "Saree Blouse", price: 2199 },
    { label: "Dress", price: 3299 },
    { label: "Shirt", price: 1899 },
    { label: "Semi Formal", price: 3299 },
    { label: "West", price: 2499 },
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
    { label: "Sage Green", value: "#315d57" },
    { label: "Lilac", value: "#9da9d8" },
    { label: "Burgundy", value: "#872233" },
    { label: "Sky Blue", value: "#b8ddea" },
    { label: "Cream", value: "#efe3cc" },
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

let options = structuredClone(defaultOptions);
const hiddenBuilderOptionLabels = {
  extras: new Set(["Embroidery", "Monogram"]),
  accessories: new Set(["Pearl Detail", "Tassels", "Mirror Work"]),
};
const builderOptionsStorageKey = "imaginfit-builder-options";
const localDesignsStorageKey = "imaginfit-local-designs";
const localCrmStorageKey = "imaginfit-local-crm";
const pendingCustomersStorageKey = "imaginfit-pending-customers";
const selectedLookStorageKey = "imaginfit-selected-look";
const dreamReferenceStorageKey = "imaginfit-dream-reference";
const requestedGarment = normalizeWardrobeGarment(new URLSearchParams(window.location.search).get("garment"));

const quizSuggestions = {
  Wedding: { preset: "suit", text: "Try a silk suit with lining, lace border, and a custom fit." },
  Office: { preset: "shirt", text: "Try a charcoal linen shirt with a collar and tailored body fit." },
  College: {
    preset: "dress",
    text: "Try a cotton A-line dress in slate or white with a tailored body profile.",
  },
  Party: {
    preset: "dress",
    text: "Try a silver or black dress with lining, a boat neckline, and a sharper fit.",
  },
};

const selected = {
  category: "Kurti",
  fabric: "Silk",
  color: "Charcoal",
  neckline: "Round",
  sleeves: "Three Quarter",
  fit: "Tailored",
  measurement: "Tailored Body",
  extras: ["Pockets"],
  accessories: ["Lace Border"],
  layout: "embroidered-kurti",
  lookTitle: "",
  referenceImage: "",
  sourceDesignId: "",
};

const cart = [];
let galleryDesigns = [];
const offlineGalleryDesigns = [
  {
    id: "new-halter-border-set",
    title: "Black Co-ord Set",
    designer: "ImaginFit Studio",
    likes: "New",
    note: "Sleeveless top with palazzo",
    price: 3999,
    collection: "Traditional",
    image: "./uploads/new-collection-halter-set.jpeg",
    config: { category: "Suit", fabric: "Cotton", color: "Black", neckline: "Halter", sleeves: "Sleeveless", fit: "A-Line", measurement: "Tailored Body", extras: ["Lining"], layout: "border-coord" },
  },
  {
    id: "new-everyday-printed-kurti",
    title: "Green Kurti With Palazzo",
    designer: "ImaginFit Studio",
    likes: "New",
    note: "Printed everyday kurti",
    price: 2499,
    collection: "Traditional",
    image: "./uploads/new-collection-everyday-kurti.jpeg",
    config: { category: "Kurti", fabric: "Cotton", color: "Sage Green", neckline: "V Neck", sleeves: "Three Quarter", fit: "Relaxed", measurement: "Tailored Body", extras: ["Pockets"], layout: "printed-kurti" },
  },
  {
    id: "new-lilac-tassel-tunic",
    title: "Lilac Short Kurti",
    designer: "ImaginFit Studio",
    likes: "New",
    note: "Peacock print with tassels",
    price: 2499,
    collection: "Traditional",
    image: "./uploads/new-collection-lilac-tunic.jpeg",
    config: { category: "Kurti", fabric: "Cotton", color: "Lilac", neckline: "Round", sleeves: "Three Quarter", fit: "Relaxed", measurement: "Tailored Body", extras: ["Lining"], layout: "tassel-tunic" },
  },
  {
    id: "new-striped-shirt-trouser-set",
    title: "Striped Shirt With Cream Pants",
    designer: "ImaginFit Studio",
    likes: "New",
    note: "Formal shirt and trouser look",
    price: 1899,
    collection: "Semiformal",
    image: "./uploads/new-collection-striped-shirt-set.jpeg",
    config: { category: "Shirt", fabric: "Linen", color: "White", neckline: "Collar", sleeves: "Full", fit: "Tailored", measurement: "Tailored Body", extras: ["Pockets"], layout: "striped-shirt-cream-pants" },
  },
  {
    id: "new-burgundy-wrap-shirt",
    title: "Maroon Top With Black Palazzo",
    designer: "ImaginFit Studio",
    likes: "New",
    note: "Pinstripe wrap-style top",
    price: 2999,
    collection: "Semiformal",
    image: "./uploads/new-collection-burgundy-wrap-shirt.jpeg",
    config: { category: "Shirt", fabric: "Linen", color: "Burgundy", neckline: "Collar", sleeves: "Full", fit: "Tailored", measurement: "Tailored Body", extras: ["Lining"], layout: "burgundy-wrap-palazzo" },
  },
  {
    id: "new-white-shirt-wide-trouser",
    title: "White Shirt With Beige Pants",
    designer: "ImaginFit Studio",
    likes: "New",
    note: "Classic shirt and wide pants",
    price: 3299,
    collection: "Semiformal",
    image: "./uploads/new-collection-white-shirt-trouser.jpeg",
    config: { category: "Shirt", fabric: "Linen", color: "White", neckline: "Collar", sleeves: "Three Quarter", fit: "Tailored", measurement: "Tailored Body", extras: ["Pockets"], layout: "white-shirt-beige-trouser" },
  },
  {
    id: "new-blue-suit-dupatta",
    title: "Blue Suit With Dupatta",
    designer: "ImaginFit Studio",
    likes: "New",
    note: "Soft embroidered suit set",
    price: 3999,
    collection: "Traditional",
    image: "./uploads/new-collection-blue-suit.jpeg",
    config: { category: "Suit", fabric: "Cotton", color: "Sky Blue", neckline: "Round", sleeves: "Full", fit: "Tailored", measurement: "Tailored Body", extras: ["Lining"], layout: "blue-suit-dupatta" },
  },
  {
    id: "new-ikat-coord-set",
    title: "Black Printed Co-ord Set",
    designer: "ImaginFit Studio",
    likes: "New",
    note: "Jacket and wide pant co-ord",
    price: 4999,
    collection: "Semiformal",
    image: "./uploads/new-collection-ikat-coord.jpeg",
    config: { category: "Suit", fabric: "Linen", color: "Graphite", neckline: "Collar", sleeves: "Full", fit: "Tailored", measurement: "Tailored Body", extras: ["Pockets"], layout: "ikat-coord" },
  },
];
let galleryFilter = "All";
const pageParams = new URLSearchParams(window.location.search);
let orderOnlyMode = pageParams.get("order") === "1";

const cartPanel = document.querySelector(".cart-panel");
const cartTrigger = document.querySelector(".cart-trigger");
const closeCart = document.querySelector(".close-cart");
const scrim = document.querySelector("[data-scrim]");
const cartItems = document.querySelector("[data-cart-items]");
const cartCount = document.querySelector("[data-cart-count]");
const cartTotal = document.querySelector("[data-cart-total]");
const cartCheckoutForm = document.querySelector("[data-cart-checkout]");
const cartWhatsApp = document.querySelector("[data-cart-whatsapp]");
const cartStatus = document.querySelector("[data-cart-status]");
const designName = document.querySelector("[data-design-name]");
const livePrice = document.querySelector("[data-live-price]");
const liveFabric = document.querySelector("[data-live-fabric]");
const liveFabricSwatch = document.querySelector("[data-live-fabric-swatch]");
const liveModification = document.querySelector("[data-live-modification]");
const selectedFabricLabel = document.querySelector("[data-selected-fabric]");
const selectedLookNote = document.querySelector("[data-selected-look-note]");
const designTags = document.querySelector("[data-design-tags]");
const preview = document.querySelector("[data-preview]");
const modelCanvas = document.querySelector("[data-model-canvas]");
const modelPreview = window.createImaginFitModelPreview?.(modelCanvas);
const dropZone = document.querySelector("[data-drop-zone]");
const dropZoneHint = document.querySelector("[data-drop-zone-hint]");
const quizResult = document.querySelector("[data-quiz-result]");
const galleryGrid = document.querySelector("[data-gallery-grid]");
const photoBoards = document.querySelector("[data-photo-boards]");
const dragLookBoard = document.querySelector("[data-drag-look-board]");
const dragStatus = document.querySelector("[data-drag-status]");
const referenceFile = document.querySelector("[data-reference-file]");
const referenceUrl = document.querySelector("[data-reference-url]");
const referencePreview = document.querySelector("[data-reference-preview]");
const liveReferencePhoto = document.querySelector("[data-live-reference-photo]");
const galleryTabs = document.querySelector(".gallery-tabs");
const orderModeBanner = document.querySelector("[data-order-mode-banner]");
const designModeButtons = document.querySelectorAll("[data-mode-choice]");
const saveDesignButton = document.querySelector("[data-save-design]");
const addCustomButton = document.querySelector("[data-add-custom]");
const measurementFields = document.querySelectorAll("[data-measurement-field]");
const measurementNotes = document.querySelector("[data-measurement-notes]");
const fillSampleMeasurements = document.querySelector("[data-fill-sample-measurements]");
const customerLoginLinks = document.querySelectorAll("[data-customer-login]");

const customerReference = {
  image: "",
  source: "",
};

function renderCustomerSession() {
  try {
    const customer = JSON.parse(localStorage.getItem("imaginfit-customer-session") || "null");
    if (!customer?.name || !customer?.phone) return;

    customerLoginLinks.forEach((link) => {
      link.textContent = `Hi, ${customer.name.split(" ")[0]}`;
      link.href = "#studio";
      link.setAttribute("aria-label", `Signed in as ${customer.name}`);
    });

    if (cartCheckoutForm) {
      cartCheckoutForm.elements.name.value = cartCheckoutForm.elements.name.value || customer.name;
      cartCheckoutForm.elements.phone.value = cartCheckoutForm.elements.phone.value || customer.phone;
    }
  } catch {
    // Leave the normal login links visible when stored session data is invalid.
  }
}

async function syncPendingCustomers() {
  try {
    const pending = JSON.parse(localStorage.getItem("imaginfit-pending-customers") || "[]");
    if (!Array.isArray(pending) || !pending.length) return;

    const remaining = [];
    for (const customer of pending) {
      try {
        const response = await fetch("/api/customers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(customer),
        });
        if (!response.ok) remaining.push(customer);
      } catch {
        remaining.push(customer);
      }
    }
    localStorage.setItem("imaginfit-pending-customers", JSON.stringify(remaining));
  } catch {
    // Keep browsing functional; pending customer data will retry on a later visit.
  }
}

function normalizeGalleryHash() {
  if (window.location.hash === "#galler") {
    window.location.replace("#gallery");
  }
}

function formatPrice(price) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

function cleanPhone(phone) {
  return String(phone || "").replace(/[^\d+]/g, "").replace(/^\+/, "");
}

function localLeadId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `lead-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function tomorrowDate() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
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

function getCollectionPrice(design = {}) {
  const category = design.config?.category;
  return Number(design.price || getOption("category", category)?.price || 0);
}

function getOption(group, label) {
  return options[group].find((option) => option.label === label) || defaultOptions[group].find((option) => option.label === label);
}

function sanitizeBuilderOptions(source = defaultOptions) {
  const sanitized = { ...structuredClone(defaultOptions), ...source };
  Object.entries(hiddenBuilderOptionLabels).forEach(([group, hiddenLabels]) => {
    sanitized[group] = (sanitized[group] || []).filter((option) => !hiddenLabels.has(option.label));
  });
  return sanitized;
}

function cleanSelectedMultiOptions() {
  selected.extras = selected.extras.filter((label) => getOption("extras", label));
  selected.accessories = selected.accessories.filter((label) => getOption("accessories", label));
}

function normalizeWardrobeGarment(value = "") {
  return String(value || "").trim().toLowerCase().replace(/\s+/g, " ");
}

function getStudioCategoryForGarment(garment = "") {
  const normalized = normalizeWardrobeGarment(garment);
  const map = {
    "salwar kameez": "Suit",
    blouse: "Saree Blouse",
    "ready to wear saree": "Saree Blouse",
    vest: "West",
    west: "West",
    top: "Semi Formal",
    blazer: "Semi Formal",
    "semi formal": "Semi Formal",
  };
  const direct = options.category?.find((option) => normalizeWardrobeGarment(option.label) === normalized)?.label;
  return map[normalized] || direct || "";
}

function getDesignSearchText(design = {}) {
  return `${design.title || ""} ${design.note || ""} ${design.collection || ""} ${design.config?.category || ""}`.toLowerCase();
}

function designMatchesGarment(design = {}, garment = "") {
  const normalized = normalizeWardrobeGarment(garment);
  if (!normalized) return true;

  const category = normalizeWardrobeGarment(design.config?.category || "");
  const collection = normalizeWardrobeGarment(design.collection || "");
  const text = getDesignSearchText(design);

  if (normalized === "kurti") return category === "kurti" || text.includes("kurti") || text.includes("tunic");
  if (normalized === "salwar kameez") return category === "suit" || text.includes("suit") || text.includes("dupatta");
  if (normalized === "blouse") return category === "saree blouse" || text.includes("blouse");
  if (normalized === "ready to wear saree") return category === "saree blouse" || text.includes("saree");
  if (normalized === "shirt") return category === "shirt" || text.includes("shirt");
  if (normalized === "trousers") return category === "trousers" || text.includes("trouser") || text.includes("pant");
  if (normalized === "dress") return category === "dress" || text.includes("dress");
  if (normalized === "vest" || normalized === "west") return category === "west" || text.includes("vest") || text.includes("west") || text.includes("jacket") || category === "semi formal";
  if (normalized === "top") return text.includes("top") || category === "semi formal" || category === "shirt";
  if (normalized === "blazer") return text.includes("blazer") || text.includes("jacket") || category === "semi formal";
  if (normalized === "semi formal") return collection === "semiformal" || category === "semi formal" || category === "shirt";

  return category === normalized || text.includes(normalized);
}

function getDragBoardGarmentFilter() {
  return requestedGarment || normalizeWardrobeGarment(selected.category);
}

function normalizeReferenceImage(image = "") {
  if (!image) return "";
  if (window.location.protocol === "file:" && image.startsWith("/uploads/")) return `.${image}`;
  return image;
}

function updateLiveReferencePhoto(image = "") {
  if (!liveReferencePhoto) return;
  if (!image) {
    liveReferencePhoto.hidden = true;
    liveReferencePhoto.removeAttribute("src");
    return;
  }

  liveReferencePhoto.hidden = false;
  liveReferencePhoto.src = image;
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
  const pinLabel = pinId ? `Pin ${pinId}` : "Pinterest source";
  const safePinLabel = escapeHtml(pinLabel);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="900" height="1080" viewBox="0 0 900 1080">
      <rect width="900" height="1080" fill="#f6f3ee"/>
      <rect x="74" y="74" width="752" height="932" rx="34" fill="#ffffff" stroke="#d7dbe2" stroke-width="4"/>
      <circle cx="450" cy="374" r="112" fill="#bd081c"/>
      <text x="450" y="420" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="142" font-weight="800">P</text>
      <text x="450" y="600" text-anchor="middle" fill="#111111" font-family="Arial, sans-serif" font-size="54" font-weight="800">Pinterest Look</text>
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
  const image = normalizeReferenceImage(design.image || "");
  return isPinterestPageUrl(image) ? createPinterestPlaceholderImage(image) : image;
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function inferLookLayout(design = {}) {
  const text = `${design.id || ""} ${design.title || ""} ${design.note || ""}`.toLowerCase();
  if (text.includes("halter") || text.includes("border set")) return "border-coord";
  if (text.includes("printed") || text.includes("everyday")) return "printed-kurti";
  if (text.includes("lilac") || text.includes("tassel") || text.includes("peacock")) return "tassel-tunic";
  if (text.includes("striped")) return "striped-shirt-cream-pants";
  if (text.includes("burgundy") || text.includes("wrap")) return "burgundy-wrap-palazzo";
  if (text.includes("white shirt") || text.includes("beige")) return "white-shirt-beige-trouser";
  if (text.includes("blue suit") || text.includes("dupatta")) return "blue-suit-dupatta";
  if (text.includes("ikat") || text.includes("jacket")) return "ikat-coord";
  if (text.includes("office") || text.includes("linen shirt")) return "striped-shirt-cream-pants";
  if (text.includes("silk suit") || text.includes("festive")) return "blue-suit-dupatta";
  return "";
}

function getDesignConfig(design = {}) {
  const config = design.config || {};
  return {
    ...config,
    category: config.category || selected.category,
    fabric: config.fabric || selected.fabric,
    color: config.color || selected.color,
    extras: Array.isArray(config.extras) ? [...config.extras] : [],
    accessories: Array.isArray(config.accessories) ? [...config.accessories] : [],
    layout: config.layout || inferLookLayout(design),
    lookTitle: config.lookTitle || design.title || "",
    referenceImage: normalizeReferenceImage(config.referenceImage || getDesignPreviewImage(design) || ""),
    sourceUrl: config.sourceUrl || getDesignSourceUrl(design),
  };
}

function formatLayoutTag(layout) {
  const labels = {
    "border-coord": "Border co-ord layout",
    "printed-kurti": "Printed kurti layout",
    "tassel-tunic": "Tassel tunic layout",
    "striped-shirt-cream-pants": "Striped shirt layout",
    "burgundy-wrap-palazzo": "Wrap top layout",
    "white-shirt-beige-trouser": "Shirt-trouser layout",
    "blue-suit-dupatta": "Suit with dupatta layout",
    "ikat-coord": "Ikat co-ord layout",
    "embroidered-kurti": "Embroidery layout",
  };
  return labels[layout] || "";
}

function getDesignPrice() {
  const base =
    getOption("category", selected.category).price +
    getOption("fabric", selected.fabric).price +
    getOption("neckline", selected.neckline).price +
    getOption("sleeves", selected.sleeves).price +
    getOption("fit", selected.fit).price +
    getOption("measurement", selected.measurement).price;

  const extrasTotal = selected.extras.reduce((sum, extra) => sum + (getOption("extras", extra)?.price || 0), base);
  return selected.accessories.reduce(
    (sum, accessory) => sum + (getOption("accessories", accessory)?.price || 0),
    extrasTotal
  );
}

function getTailorMeasurements() {
  const entries = [...measurementFields]
    .map((field) => ({
      label: field.dataset.measurementField,
      value: field.value.trim(),
    }))
    .filter((measurement) => measurement.value);
  const notes = measurementNotes.value.trim();

  return {
    entries,
    notes,
    summary: [
      ...entries.map((measurement) => `${measurement.label}: ${measurement.value}"`),
      notes ? `Notes: ${notes}` : "",
    ]
      .filter(Boolean)
      .join("; "),
  };
}

function getCartDetails(includeStyleDetails = true) {
  const tailorMeasurements = getTailorMeasurements();
  const layoutTag = formatLayoutTag(selected.layout);
  const extrasSummary = selected.extras.join(", ") || "No extras";
  const accessoriesSummary = selected.accessories.join(", ") || "No accessories";
  const styleDetails = includeStyleDetails
    ? [
        selected.lookTitle,
        layoutTag,
        selected.color,
        selected.neckline,
        selected.sleeves,
        selected.measurement,
        accessoriesSummary,
      ]
    : [selected.lookTitle, layoutTag, selected.color, selected.fit, selected.measurement, extrasSummary, accessoriesSummary];

  return [
    ...styleDetails,
    tailorMeasurements.summary ? `Measurements - ${tailorMeasurements.summary}` : "Measurements pending",
    customerReference.image ? customerReference.source : "",
  ]
    .filter(Boolean)
    .join(", ");
}

function buildCartLeadMessage(customer) {
  const orderLines = cart.length
    ? cart.map((item, index) => `${index + 1}. ${item.name} - ${formatPrice(item.price)} - ${item.details}`)
    : [`1. ${selected.fabric} ${selected.category} - ${formatPrice(getDesignPrice())} - ${getCartDetails(true)}`];

  return [
    "Hi ImaginFit Studio, I want to place this custom outfit order.",
    `Name: ${customer.name}`,
    customer.needBy ? `Need by: ${customer.needBy}` : "",
    `Estimated total: ${formatPrice(customer.orderValue)}`,
    "Outfits:",
    ...orderLines,
    customer.notes ? `Notes: ${customer.notes}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function buildCartWhatsAppUrl(customer) {
  const businessPhone = cleanPhone(
    localStorage.getItem("imaginfit-business-whatsapp") || document.body.dataset.businessWhatsapp || ""
  );
  const text = encodeURIComponent(buildCartLeadMessage(customer));
  return `https://web.whatsapp.com/send?${businessPhone ? `phone=${businessPhone}&` : ""}text=${text}`;
}

function saveCustomerLocally(customer) {
  const localCustomers = readLocalArray(localCrmStorageKey);
  const existingIndex = localCustomers.findIndex((item) => cleanPhone(item.phone) === cleanPhone(customer.phone));
  const nextCustomer = { ...customer, updatedAt: new Date().toISOString() };

  if (existingIndex >= 0) {
    localCustomers[existingIndex] = {
      ...localCustomers[existingIndex],
      ...nextCustomer,
      id: localCustomers[existingIndex].id,
      createdAt: localCustomers[existingIndex].createdAt,
    };
  } else {
    localCustomers.unshift(nextCustomer);
  }

  saveLocalArray(localCrmStorageKey, localCustomers);
}

function savePendingCustomer(customer) {
  const pendingCustomers = readLocalArray(pendingCustomersStorageKey)
    .filter((item) => cleanPhone(item.phone) !== cleanPhone(customer.phone));
  pendingCustomers.unshift(customer);
  saveLocalArray(pendingCustomersStorageKey, pendingCustomers.slice(0, 60));
}

async function postCustomerToBackend(customer) {
  const response = await fetch("/api/customers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(customer),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Could not save order lead.");
  return result;
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result));
    reader.addEventListener("error", reject);
    reader.readAsDataURL(file);
  });
}

function renderOptionGroups() {
  Object.entries(options).forEach(([group, values]) => {
    const container = document.querySelector(`[data-option-group="${group}"]`);
    if (!container) return;

    if (group === "color") {
      container.innerHTML = values
        .map(
          (option) => `
            <button
              class="swatch ${selected.color === option.label ? "is-selected" : ""}"
              type="button"
              data-group="color"
              data-value="${option.label}"
              data-drag-type="color"
              data-drag-value="${option.label}"
              draggable="true"
              aria-label="${option.label}"
            >
              <span style="background:${option.value}"></span>
              ${option.label}
            </button>
          `
        )
        .join("");
      return;
    }

    if (["extras", "accessories"].includes(group)) {
      container.innerHTML = values
        .map(
          (option) => `
            <label class="check-option">
              <input
                type="checkbox"
                data-check-group="${group}"
                data-check-value="${option.label}"
                ${selected[group].includes(option.label) ? "checked" : ""}
              />
              <span>${option.label}</span>
              <small>${option.price ? `+${formatPrice(option.price)}` : "Included"}</small>
            </label>
          `
        )
        .join("");
      return;
    }

    container.innerHTML = values
      .map(
        (option) => `
          <button
            class="option-button ${selected[group] === option.label ? "is-selected" : ""}"
            type="button"
            data-group="${group}"
            data-value="${option.label}"
            data-drag-type="${group}"
            data-drag-value="${option.label}"
            draggable="true"
          >
            <span>${option.label}</span>
            ${getOptionLabel(group, option)}
          </button>
        `
      )
      .join("");
  });
}

function getOptionLabel(group, option) {
  if (group === "category") return `<small>${formatPrice(option.price)} base</small>`;
  if (["neckline", "sleeves", "fit", "measurement", "extras", "accessories"].includes(group)) {
    return "<small>No extra cost</small>";
  }
  return option.price ? `<small>+${formatPrice(option.price)}</small>` : "<small>Included</small>";
}

function updatePreview() {
  const color = getOption("color", selected.color).value;
  const activeReferenceImage = customerReference.image || selected.referenceImage || "";
  preview?.style.setProperty("--garment-color", color);
  updateLiveReferencePhoto(activeReferenceImage);
  modelPreview?.update({ ...selected, referenceImage: activeReferenceImage }, color);
  designName.textContent = selected.lookTitle || `${selected.fabric} ${selected.category}`;
  if (selectedLookNote) {
    selectedLookNote.textContent = selected.lookTitle
      ? "Selected design loaded. Customize it or continue to sizing."
      : "Ready for customization";
  }
  if (selectedFabricLabel) selectedFabricLabel.textContent = selected.fabric;
  if (liveFabric) liveFabric.textContent = selected.fabric;
  if (liveFabricSwatch) {
    liveFabricSwatch.style.setProperty("--swatch-color", color);
    liveFabricSwatch.dataset.fabric = selected.fabric;
  }
  if (liveModification) {
    liveModification.textContent = `${selected.neckline}, ${selected.sleeves}, ${selected.fit}`;
  }
  livePrice.textContent = formatPrice(getDesignPrice());

  designTags.innerHTML = [
    selected.lookTitle,
    formatLayoutTag(selected.layout),
    selected.color,
    selected.neckline,
    selected.sleeves,
    selected.fit,
    selected.measurement,
    orderOnlyMode ? "Sizing and order only" : "",
    activeReferenceImage ? "Reference on outfit" : "",
    ...selected.extras,
    ...selected.accessories,
  ]
    .filter(Boolean)
    .map((tag) => `<li>${tag}</li>`)
    .join("");
}

function renderCart() {
  cartCount.textContent = cart.length;
  cartTotal.textContent = formatPrice(cart.reduce((sum, item) => sum + item.price, 0));

  if (!cart.length) {
    cartItems.innerHTML = '<p class="empty-cart">No saved outfits yet.</p>';
    return;
  }

  cartItems.innerHTML = cart
    .map(
      (item, index) => `
        <div class="cart-line ${item.referenceImage ? "has-reference" : ""}">
          <div class="cart-swatch" style="background:${item.colorValue}"></div>
          ${item.referenceImage ? `<img class="cart-reference" src="${item.referenceImage}" alt="Attached reference" />` : ""}
          <div class="cart-copy">
            <h3>${item.name}</h3>
            <p>${item.details}</p>
            <p>${formatPrice(item.price)}</p>
          </div>
          <button class="remove-item" type="button" data-remove="${index}" aria-label="Remove ${item.name}">
            Remove
          </button>
        </div>
      `
    )
    .join("");
}

function setDragStatus(message) {
  if (dragStatus) dragStatus.textContent = message;
}

function renderDragLookBoard(looks = galleryDesigns) {
  if (!dragLookBoard) return;

  const activeGarment = getDragBoardGarmentFilter();
  const sourceLooks = looks.length ? looks : galleryDesigns;
  const pinnedLooks = activeGarment ? sourceLooks.filter((design) => designMatchesGarment(design, activeGarment)) : sourceLooks;

  if (!pinnedLooks.length) {
    const label = activeGarment ? activeGarment.replace(/\b\w/g, (letter) => letter.toUpperCase()) : "";
    dragLookBoard.innerHTML = `<p class="empty-cart">No ${escapeHtml(label || "matching")} looks ready yet. Add them from backend.</p>`;
    setDragStatus(activeGarment ? `Showing ${label} looks only.` : "No looks ready yet.");
    return;
  }

  if (activeGarment) {
    const label = activeGarment.replace(/\b\w/g, (letter) => letter.toUpperCase());
    setDragStatus(`Showing ${label} looks only.`);
  }

  dragLookBoard.innerHTML = pinnedLooks
    .slice(0, 8)
    .map(
      (design) => `
        <button
          class="drag-look-card ${selected.sourceDesignId === design.id ? "is-active-look" : ""}"
          type="button"
          data-design-id="${escapeHtml(design.id)}"
          data-drag-type="design"
          data-drag-id="${escapeHtml(design.id)}"
          draggable="true"
        >
          <img src="${escapeHtml(getDesignPreviewImage(design))}" alt="${escapeHtml(design.title)}" />
          <span>${escapeHtml(design.title)}</span>
          ${
            selected.sourceDesignId === design.id
              ? `<small>${escapeHtml(selected.fabric)} / ${escapeHtml(selected.color)}</small>`
              : ""
          }
        </button>
      `
    )
    .join("");
}

function renderGallery() {
  const visibleDesigns =
    galleryFilter === "All"
      ? galleryDesigns
      : galleryDesigns.filter((design) => (design.collection || "Semiformal") === galleryFilter);

  renderDragLookBoard(visibleDesigns);

  if (!visibleDesigns.length) {
    galleryGrid.innerHTML = '<p class="empty-cart">No photos in this section yet.</p>';
    return;
  }

  galleryGrid.innerHTML = visibleDesigns
    .map((design) => {
      const sourceUrl = getDesignSourceUrl(design);
      return `
        <article>
          <div class="gallery-image">
            <img src="${escapeHtml(getDesignPreviewImage(design))}" alt="${escapeHtml(design.title)}" />
          </div>
          <div class="gallery-copy">
            <div class="gallery-card-top">
              <span class="gallery-badge">${escapeHtml(design.collection || "Semiformal")}</span>
              <span>${escapeHtml(design.likes)}</span>
            </div>
            <h3>${escapeHtml(design.title)}</h3>
            <p>By ${escapeHtml(design.designer)}</p>
            <p>${escapeHtml(design.note || `${design.config.fabric} ${design.config.category}`)}</p>
            <strong class="collection-price">From ${formatPrice(getCollectionPrice(design))}</strong>
            ${sourceUrl ? `<a class="gallery-source-link" href="${escapeHtml(sourceUrl)}" target="_blank" rel="noopener">Open Pinterest source</a>` : ""}
            <button type="button" data-design-id="${design.id}">Use This Look</button>
          </div>
        </article>
      `
    })
    .join("");
}

function renderPhotoBoards() {
  const sections = ["Customer References", "Finished Outfits", "Fabric Samples"];

  photoBoards.innerHTML = sections
    .map((section) => {
      const photos = galleryDesigns.filter((design) => (design.collection || "Semiformal") === section);
      const content = photos.length
        ? photos
            .slice(0, 4)
            .map((photo) => `<img src="${escapeHtml(getDesignPreviewImage(photo))}" alt="${escapeHtml(photo.title)}" />`)
            .join("")
        : "<p>No photos added yet.</p>";

      return `
        <article class="photo-board">
          <div>
            <p class="eyebrow">${section}</p>
            <h3>${section === "Customer References" ? "Ideas customers bring in" : section}</h3>
          </div>
          <div class="photo-board-strip">${content}</div>
        </article>
      `;
    })
    .join("");
}

async function loadGallery() {
  try {
    const localDesigns = JSON.parse(localStorage.getItem(localDesignsStorageKey) || "[]");
    if (Array.isArray(localDesigns) && localDesigns.length) {
      galleryDesigns = localDesigns;
      applyRequestedLook();
      renderGallery();
      renderPhotoBoards();
      return;
    }
  } catch {
    galleryDesigns = [];
  }

  try {
    const response = await fetch("/api/designs");
    if (!response.ok) throw new Error("Backend gallery unavailable");
    galleryDesigns = await response.json();
    applyRequestedLook();
    renderGallery();
    renderPhotoBoards();
  } catch {
    try {
      const response = await fetch("./data/designs.json");
      galleryDesigns = await response.json();
      applyRequestedLook();
      renderGallery();
      renderPhotoBoards();
    } catch {
      galleryDesigns = offlineGalleryDesigns;
      applyRequestedLook();
      renderGallery();
      renderPhotoBoards();
    }
  }
}

async function loadBuilderOptions() {
  try {
    const saved = JSON.parse(localStorage.getItem(builderOptionsStorageKey) || "null");
    if (saved) {
      options = sanitizeBuilderOptions(saved);
      return;
    }
  } catch {
    options = sanitizeBuilderOptions();
  }

  try {
    const response = await fetch("/api/options");
    if (!response.ok) throw new Error("Backend options unavailable");
    options = sanitizeBuilderOptions(await response.json());
  } catch {
    try {
      const response = await fetch("./data/options.json");
      options = sanitizeBuilderOptions(await response.json());
    } catch {
      options = sanitizeBuilderOptions();
    }
  }
}

function refresh() {
  cleanSelectedMultiOptions();
  renderOptionGroups();
  updatePreview();
}

function showSelectedReference(image = "", label = "Selected look placed on outfit") {
  if (!referencePreview) return;
  referencePreview.innerHTML = image
    ? `
      <img src="${escapeHtml(image)}" alt="${escapeHtml(label)}" />
      <strong>${escapeHtml(label)}</strong>
    `
    : "<span>No reference placed on outfit</span>";
}

function isDirectImageReference(value = "") {
  const nextValue = String(value || "").trim();
  return /^data:image\//i.test(nextValue) || /\.(jpe?g|png|webp|gif|avif)(\?|#|$)/i.test(nextValue);
}

function getStoredDreamReference() {
  try {
    return JSON.parse(sessionStorage.getItem(dreamReferenceStorageKey) || "null");
  } catch {
    return null;
  }
}

function clearStoredDreamReference() {
  try {
    sessionStorage.removeItem(dreamReferenceStorageKey);
  } catch {
    // The reference should still display even if storage cleanup is blocked.
  }
}

function applyDreamReference() {
  const stored = getStoredDreamReference();
  const value = String(stored?.value || "").trim();
  if (!value) return;

  clearStoredDreamReference();

  if (stored.type === "image" || isDirectImageReference(value)) {
    const image = normalizeReferenceImage(value);
    if (!image) return;
    customerReference.image = image;
    customerReference.source = stored.source || "Dream fit reference";
    selected.referenceImage = "";
    if (referenceUrl) referenceUrl.value = /^https?:\/\//i.test(value) ? value : "";
    showSelectedReference(image, `${customerReference.source} placed on outfit`);
    updatePreview();
    setDragStatus("Dream fit reference added to the preview.");
    document.querySelector("#reference")?.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  customerReference.image = "";
  customerReference.source = stored.source || "Dream fit link";
  if (referenceUrl) referenceUrl.value = value;
  if (referencePreview) {
    referencePreview.innerHTML = `
      <strong>Reference link saved</strong>
      <a href="${escapeHtml(value)}" target="_blank" rel="noopener">Open reference link</a>
      <span>We will use this as the customer dream fit idea.</span>
    `;
  }
  updatePreview();
  setDragStatus("Dream fit link saved for this design.");
  document.querySelector("#reference")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function setDesign(config, design = {}) {
  const nextConfig = {
    ...config,
    layout: config.layout || inferLookLayout(design),
    lookTitle: config.lookTitle || design.title || "",
    referenceImage: normalizeReferenceImage(config.referenceImage || getDesignPreviewImage(design) || ""),
    sourceDesignId: design.id || config.sourceDesignId || "",
  };
  Object.assign(selected, nextConfig);
  selected.extras = Array.isArray(nextConfig.extras) ? [...nextConfig.extras] : [];
  selected.accessories = Array.isArray(nextConfig.accessories) ? [...nextConfig.accessories] : [];
  cleanSelectedMultiOptions();
  if (selected.referenceImage) {
    customerReference.image = "";
    customerReference.source = "";
    showSelectedReference(selected.referenceImage);
  }
  refresh();
  renderDragLookBoard();
  setDragStatus(`${selected.lookTitle || selected.category} is loaded on the design board.`);
  document.querySelector("#studio")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function getStoredRequestedLook(lookId = "") {
  try {
    const stored = JSON.parse(sessionStorage.getItem(selectedLookStorageKey) || "null");
    if (!stored?.id) return null;
    return !lookId || stored.id === lookId ? stored : null;
  } catch {
    return null;
  }
}

function applyRequestedLook() {
  const lookId = pageParams.get("look");
  const fabric = pageParams.get("fabric");
  const garmentCategory = getStudioCategoryForGarment(requestedGarment);

  if (lookId) {
    const design =
      galleryDesigns.find((item) => item.id === lookId) ||
      offlineGalleryDesigns.find((item) => item.id === lookId) ||
      getStoredRequestedLook(lookId);
    if (design) setDesign(getDesignConfig(design), design);
  }

  if (!lookId && garmentCategory && getOption("category", garmentCategory)) {
    selected.category = garmentCategory;
    selected.lookTitle = "";
    refresh();
  }

  if (fabric && getOption("fabric", fabric)) {
    selected.fabric = fabric;
    refresh();
  }
}

function syncOrderModeUrl() {
  const nextParams = new URLSearchParams(window.location.search);
  if (orderOnlyMode) {
    nextParams.set("order", "1");
  } else {
    nextParams.delete("order");
  }

  const query = nextParams.toString();
  const nextUrl = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
  window.history.replaceState(null, "", nextUrl);
}

function applyOrderModeUI(syncUrl = false) {
  document.body.classList.toggle("order-only-mode", orderOnlyMode);
  if (orderModeBanner) orderModeBanner.hidden = false;
  if (saveDesignButton) saveDesignButton.textContent = orderOnlyMode ? "Save Sizing" : "Save Design";
  if (addCustomButton) addCustomButton.textContent = orderOnlyMode ? "Add To Order" : "Add Outfit To Order";

  designModeButtons.forEach((button) => {
    const isSelected =
      (button.dataset.modeChoice === "order" && orderOnlyMode) ||
      (button.dataset.modeChoice === "customize" && !orderOnlyMode);
    button.classList.toggle("is-selected", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });

  if (syncUrl) syncOrderModeUrl();
  updatePreview();
}

function openCart() {
  cartPanel.classList.add("is-open");
  scrim.classList.add("is-open");
  cartPanel.setAttribute("aria-hidden", "false");
}

function closeCartPanel() {
  cartPanel.classList.remove("is-open");
  scrim.classList.remove("is-open");
  cartPanel.setAttribute("aria-hidden", "true");
}

function setDropZoneActive(isActive) {
  dropZone?.classList.toggle("is-drop-ready", isActive);
  modelCanvas?.classList.toggle("is-drop-ready", isActive);
  dropZoneHint?.classList.toggle("is-visible", isActive);
}

function getDragPayload(source) {
  if (!source?.dataset.dragType) return null;
  if (source.dataset.dragType === "design") {
    return {
      type: "design",
      id: source.dataset.dragId || source.dataset.designId,
    };
  }

  return {
    type: source.dataset.dragType,
    value: source.dataset.dragValue || source.dataset.value,
  };
}

function placeReferenceImage(image, source = "Dropped reference") {
  const nextImage = normalizeReferenceImage(image || "");
  if (!nextImage) return false;

  customerReference.image = nextImage;
  customerReference.source = source;
  selected.referenceImage = "";
  showSelectedReference(nextImage, `${source} placed on outfit`);
  updatePreview();
  setDragStatus("Reference placed on the preview.");
  return true;
}

function applyDragPayload(payload) {
  if (!payload?.type) return false;

  if (payload.type === "design") {
    const design =
      galleryDesigns.find((item) => item.id === payload.id) ||
      offlineGalleryDesigns.find((item) => item.id === payload.id);
    if (!design) return false;
    setDesign(getDesignConfig(design), design);
    setDragStatus(`${design.title} applied to the preview.`);
    return true;
  }

  if (payload.type in selected && typeof selected[payload.type] === "string") {
    const option = getOption(payload.type, payload.value);
    if (!option) return false;
    selected[payload.type] = payload.value;
    refresh();
    setDragStatus(`${payload.value} applied to the preview.`);
    return true;
  }

  return false;
}

async function handlePreviewDrop(event) {
  event.preventDefault();
  setDropZoneActive(false);

  const imageFile = [...(event.dataTransfer?.files || [])].find((file) => file.type.startsWith("image/"));
  if (imageFile) {
    placeReferenceImage(await fileToDataUrl(imageFile), "Dropped photo");
    return;
  }

  const payloadText = event.dataTransfer?.getData("application/x-imaginfit");
  if (payloadText) {
    try {
      if (applyDragPayload(JSON.parse(payloadText))) return;
    } catch {
      // Fall through to URL handling for ordinary browser drops.
    }
  }

  const imageUrl =
    event.dataTransfer?.getData("text/uri-list") ||
    event.dataTransfer?.getData("text/plain") ||
    "";

  if (/^(https?:|data:image|\.\/|\/uploads\/)/i.test(imageUrl.trim())) {
    placeReferenceImage(imageUrl.trim(), "Dropped image");
    return;
  }

  setDragStatus("Drop a look, fabric, color, or image.");
}

document.addEventListener("dragstart", (event) => {
  const source = event.target.closest("[data-drag-type]");
  const payload = getDragPayload(source);
  if (!payload || !event.dataTransfer) return;

  event.dataTransfer.effectAllowed = "copy";
  event.dataTransfer.setData("application/x-imaginfit", JSON.stringify(payload));
  event.dataTransfer.setData("text/plain", payload.value || payload.id || "");
  source.classList.add("is-drag-source");
  setDragStatus("Drop it on the preview.");
});

document.addEventListener("dragend", (event) => {
  event.target.closest("[data-drag-type]")?.classList.remove("is-drag-source");
  setDropZoneActive(false);
});

if (dropZone) {
  dropZone.addEventListener("dragenter", (event) => {
    event.preventDefault();
    setDropZoneActive(true);
  });

  dropZone.addEventListener("dragover", (event) => {
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
    setDropZoneActive(true);
  });

  dropZone.addEventListener("dragleave", (event) => {
    if (!dropZone.contains(event.relatedTarget)) setDropZoneActive(false);
  });

  dropZone.addEventListener("drop", handlePreviewDrop);
}

document.addEventListener("click", (event) => {
  const optionButton = event.target.closest("[data-group]");
  const designButton = event.target.closest("[data-design-id]");
  const quizButton = event.target.closest("[data-quiz]");
  const filterButton = event.target.closest("[data-gallery-filter]");

  if (optionButton) {
    selected[optionButton.dataset.group] = optionButton.dataset.value;
    refresh();
    if (optionButton.dataset.group === "category") renderGallery();
    return;
  }

  if (designButton) {
    const design = galleryDesigns.find((item) => item.id === designButton.dataset.designId);
    if (design) setDesign(getDesignConfig(design), design);
    return;
  }

  if (quizButton) {
    const suggestion = quizSuggestions[quizButton.dataset.quiz];
    const design = galleryDesigns.find((item) => item.id === suggestion.preset);
    if (design) setDesign(getDesignConfig(design), design);
    quizResult.textContent = suggestion.text;
  }

  if (filterButton) {
    galleryFilter = filterButton.dataset.galleryFilter;
    galleryTabs.querySelectorAll("button").forEach((button) => {
      button.classList.toggle("is-selected", button === filterButton);
    });
    renderGallery();
  }
});

document.addEventListener("change", (event) => {
  if (!event.target.matches("[data-check-group]")) return;

  const group = event.target.dataset.checkGroup;
  const value = event.target.dataset.checkValue;
  if (!Array.isArray(selected[group])) selected[group] = [];
  if (event.target.checked) {
    selected[group].push(value);
  } else {
    selected[group] = selected[group].filter((item) => item !== value);
  }

  updatePreview();
});

designModeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    orderOnlyMode = button.dataset.modeChoice === "order";
    applyOrderModeUI(true);
  });
});

liveReferencePhoto?.addEventListener("error", () => {
  liveReferencePhoto.hidden = true;
  referencePreview.innerHTML =
    "<span>This image link could not be shown. Upload the photo file, or paste a direct image address ending in .jpg, .jpeg, .png, or .webp.</span>";
});

async function previewReference() {
  const file = referenceFile.files[0];
  const url = referenceUrl.value.trim();

  if (!file && isPinterestPageUrl(url)) {
    customerReference.image = "";
    customerReference.source = "";
    referencePreview.innerHTML = "<span>Open the image, copy image address, then paste that direct image link.</span>";
    updatePreview();
    return;
  }

  const image = normalizeReferenceImage(file ? await fileToDataUrl(file) : url);

  customerReference.image = image;
  customerReference.source = image ? (file ? "Uploaded reference" : "Reference URL") : "";

  referencePreview.innerHTML = image
    ? `<img src="${image}" alt="Customer reference preview" />`
    : "<span>No reference placed on outfit</span>";
  updatePreview();
}

referenceFile.addEventListener("change", previewReference);
referenceUrl.addEventListener("input", previewReference);

document.querySelector("[data-attach-reference]").addEventListener("click", async () => {
  const file = referenceFile.files[0];
  const url = referenceUrl.value.trim();

  if (!file && isPinterestPageUrl(url)) {
    referencePreview.innerHTML = "<span>That is a Pinterest page link. Copy image address and paste the direct image link.</span>";
    return;
  }

  const image = normalizeReferenceImage(file ? await fileToDataUrl(file) : url);

  if (!image) {
    referencePreview.innerHTML = "<span>Add a file or URL first</span>";
    return;
  }

  try {
    const response = await fetch("/api/reference-photos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image }),
    });
    const saved = response.ok ? await response.json() : { image };
    customerReference.image = saved.image;
    customerReference.source = file ? "Uploaded reference" : "Reference URL";
    referencePreview.innerHTML = `
      <img src="${customerReference.image}" alt="Attached customer reference" />
      <strong>Reference placed on outfit</strong>
    `;
    updatePreview();
  } catch {
    customerReference.image = image;
    customerReference.source = file ? "Uploaded reference" : "Reference URL";
    referencePreview.innerHTML = `
      <img src="${customerReference.image}" alt="Attached customer reference" />
      <strong>Reference placed on outfit for this design</strong>
    `;
    updatePreview();
  }
});

saveDesignButton.addEventListener("click", () => {
  cart.push({
    name: `${selected.fabric} ${selected.category}`,
    details: getCartDetails(false),
    price: getDesignPrice(),
    colorValue: getOption("color", selected.color).value,
    referenceImage: customerReference.image,
  });
  renderCart();
  openCart();
});

addCustomButton.addEventListener("click", () => {
  cart.push({
    name: `${selected.fabric} ${selected.category}`,
    details: getCartDetails(true),
    price: getDesignPrice(),
    colorValue: getOption("color", selected.color).value,
    referenceImage: customerReference.image,
  });
  renderCart();
  openCart();
});

cartCheckoutForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(cartCheckoutForm);
  const orderValue = cart.length ? cart.reduce((sum, item) => sum + item.price, 0) : getDesignPrice();
  const customer = {
    id: localLeadId(),
    name: String(data.get("name") || "").trim(),
    phone: cleanPhone(data.get("phone")),
    business: cart.length
      ? `${cart.length} custom outfit${cart.length === 1 ? "" : "s"} from Design Studio`
      : `${selected.fabric} ${selected.category} from Design Studio`,
    source: "Design studio checkout",
    status: "Lead",
    notes: [
      String(data.get("notes") || "").trim(),
      `Order details: ${cart.length ? cart.map((item) => `${item.name} (${formatPrice(item.price)})`).join("; ") : getCartDetails(true)}`,
    ]
      .filter(Boolean)
      .join("\n"),
    followUpDate: tomorrowDate(),
    orderValue,
    needBy: String(data.get("needBy") || "").trim(),
    createdAt: new Date().toISOString(),
    updatedAt: "",
  };

  if (!customer.name || customer.phone.length < 10) {
    cartStatus.textContent = "Add a name and valid contact number.";
    cartWhatsApp.hidden = true;
    return;
  }

  cartStatus.textContent = "Saving order...";
  saveCustomerLocally(customer);
  savePendingCustomer(customer);

  try {
    const savedCustomer = await postCustomerToBackend(customer);
    saveCustomerLocally(savedCustomer);
    saveLocalArray(
      pendingCustomersStorageKey,
      readLocalArray(pendingCustomersStorageKey).filter((item) => cleanPhone(item.phone) !== customer.phone)
    );
    cartStatus.textContent = "Order saved in CRM. Send the order details when ready.";
  } catch {
    cartStatus.textContent = "Order saved on this system. Send the order details when ready.";
  }

  cartWhatsApp.href = buildCartWhatsAppUrl(customer);
  cartWhatsApp.hidden = false;
});

cartItems.addEventListener("click", (event) => {
  const removeButton = event.target.closest("[data-remove]");
  if (!removeButton) return;
  cart.splice(Number(removeButton.dataset.remove), 1);
  renderCart();
});

cartTrigger.addEventListener("click", openCart);
closeCart.addEventListener("click", closeCartPanel);
scrim.addEventListener("click", closeCartPanel);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeCartPanel();
});

fillSampleMeasurements.addEventListener("click", () => {
  const samples = {
    Chest: "36",
    Waist: "30",
    Hip: "38",
    Shoulder: "15",
    Sleeve: "18",
    "Top Length": "42",
    "Bottom Length": "38",
    Armhole: "16",
  };

  measurementFields.forEach((field) => {
    field.value = samples[field.dataset.measurementField] || "";
  });
  measurementNotes.value = "Comfort fit with half inch stitching margin.";
});

window.addEventListener("hashchange", normalizeGalleryHash);

normalizeGalleryHash();
renderCustomerSession();
syncPendingCustomers();
applyOrderModeUI();
loadBuilderOptions().then(refresh);
renderCart();
loadGallery().then(applyDreamReference);
