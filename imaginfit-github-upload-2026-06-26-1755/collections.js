const collectionFallbackDesigns = [
  {
    id: "new-halter-border-set",
    title: "Black Co-ord Set",
    designer: "ImaginFit Studio",
    likes: "New",
    note: "Sleeveless top with palazzo",
    price: 3999,
    collection: "Traditional",
    image: "./uploads/new-collection-halter-set.jpeg",
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
  },
  {
    id: "new-black-shirt-grey-trouser",
    title: "Black Shirt With Grey Trousers",
    designer: "ImaginFit Studio",
    likes: "New",
    note: "Relaxed semiformal office fit",
    price: 2999,
    collection: "Semiformal",
    image: "./uploads/new-collection-black-shirt-grey-trouser.png",
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
  },
];

let collectionDesigns = [];
let activeCollectionFilter = "All";

const collectionGrid = document.querySelector("[data-gallery-grid]");
const collectionTabs = document.querySelector(".gallery-tabs");
const customerReviewsGrid = document.querySelector("[data-customer-reviews]");
const siteIntro = document.querySelector("[data-site-intro]");
const siteIntroVideo = document.querySelector("[data-site-intro-video]");
const heroVideo = document.querySelector("[data-hero-video]");
const heroVideoToggle = document.querySelector("[data-hero-video-toggle]");
const heroAudioToggle = document.querySelector("[data-hero-audio-toggle]");
const leadForm = document.querySelector("[data-lead-form]");
const leadStatus = document.querySelector("[data-lead-status]");
const leadWhatsApp = document.querySelector("[data-lead-whatsapp]");
const assistantForm = document.querySelector("[data-assistant-form]");
const assistantResponse = document.querySelector("[data-assistant-response]");
const assistantPromptButtons = document.querySelectorAll("[data-assistant-prompt]");
const dreamFitOpen = document.querySelector("[data-dream-fit-open]");
const dreamFitPanel = document.querySelector("[data-dream-fit-panel]");
const dreamFitFile = document.querySelector("[data-dream-fit-file]");
const dreamFitLinkForm = document.querySelector("[data-dream-fit-link-form]");
const dreamFitLink = document.querySelector("[data-dream-fit-link]");
const dreamFitStatus = document.querySelector("[data-dream-fit-status]");
const localDesignsStorageKey = "imaginfit-local-designs";
const localCrmStorageKey = "imaginfit-local-crm";
const pendingCustomersStorageKey = "imaginfit-pending-customers";
const assistantIdeasStorageKey = "imaginfit-assistant-ideas";
const selectedLookStorageKey = "imaginfit-selected-look";
const customerReviewsStorageKey = "imaginfit-customer-reviews";
const siteIntroSeenStorageKey = "imaginfit-site-intro-seen";
const dreamReferenceStorageKey = "imaginfit-dream-reference";
const publicCollectionSections = ["Semiformal", "Traditional", "Customer References", "Finished Outfits", "Fabric Samples"];
const categoryStartingPrices = {
  Kurti: 2499,
  Suit: 3999,
  "Saree Blouse": 2199,
  Dress: 3299,
  Shirt: 1899,
  West: 2499,
  Trousers: 2299,
};
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

function escapeCollectionHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function cleanLeadPhone(phone) {
  return String(phone || "").replace(/[^\d+]/g, "").replace(/^\+/, "");
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

function collectionFileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result));
    reader.addEventListener("error", reject);
    reader.readAsDataURL(file);
  });
}

function openDreamFitPanel() {
  if (!dreamFitPanel || !dreamFitOpen) return;
  dreamFitPanel.hidden = false;
  dreamFitOpen.setAttribute("aria-expanded", "true");
  dreamFitPanel.scrollIntoView({ behavior: "smooth", block: "center" });
  dreamFitFile?.focus();
}

function saveDreamReference(payload) {
  try {
    sessionStorage.setItem(dreamReferenceStorageKey, JSON.stringify(payload));
  } catch {
    // The studio still opens if browser storage is unavailable.
  }
  window.location.href = "./design.html#reference";
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
  const pinLabel = escapeCollectionHtml(pinId ? `Pin ${pinId}` : "Pinterest source");
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="900" height="1080" viewBox="0 0 900 1080">
      <rect width="900" height="1080" fill="#f6f3ee"/>
      <rect x="74" y="74" width="752" height="932" rx="34" fill="#ffffff" stroke="#d7dbe2" stroke-width="4"/>
      <circle cx="450" cy="374" r="112" fill="#bd081c"/>
      <text x="450" y="420" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="142" font-weight="800">P</text>
      <text x="450" y="600" text-anchor="middle" fill="#111111" font-family="Arial, sans-serif" font-size="54" font-weight="800">Pinterest Look</text>
      <text x="450" y="674" text-anchor="middle" fill="#6b7280" font-family="Arial, sans-serif" font-size="34">${pinLabel}</text>
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

function formatCollectionPrice(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function getCollectionPrice(design = {}) {
  return Number(design.price || categoryStartingPrices[design.config?.category] || 0);
}

function getOccasionTags(design = {}) {
  if (Array.isArray(design.tags) && design.tags.length) return design.tags.slice(0, 3);

  const text = `${design.title || ""} ${design.note || ""} ${design.collection || ""} ${design.config?.category || ""}`.toLowerCase();
  const tags = [];
  const addTag = (tag) => {
    if (!tags.includes(tag) && tags.length < 3) tags.push(tag);
  };

  if (text.includes("office") || text.includes("formal") || text.includes("shirt") || text.includes("trouser")) addTag("Office");
  if (text.includes("daily") || text.includes("everyday") || text.includes("kurti")) addTag("Daily wear");
  if (text.includes("festive") || text.includes("suit") || text.includes("dupatta") || text.includes("traditional")) addTag("Festive");
  if (text.includes("party") || text.includes("evening") || text.includes("dress")) addTag("Party");
  if (text.includes("co-ord") || text.includes("coord") || text.includes("travel")) addTag("Travel");
  if (text.includes("customer") || text.includes("reference")) addTag("Reference");

  if (!tags.length) addTag(design.collection || "Custom");
  addTag("Custom fit");
  return tags;
}

function isPublicCollectionDesign(design = {}) {
  return publicCollectionSections.includes(design.collection || "Semiformal");
}

function mergeWithBuiltInDesigns(designs = []) {
  const merged = new Map();
  collectionFallbackDesigns.forEach((design) => merged.set(design.id, design));
  designs.forEach((design) => {
    if (design?.id) merged.set(design.id, design);
  });
  return Array.from(merged.values());
}

function localLeadId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `lead-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function readLocalLeads(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function saveLocalLeads(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function tomorrowDate() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

function buildLeadMessage(customer) {
  return [
    `Hi ImaginFit Studio, I want to enquire about ${customer.business}.`,
    `Name: ${customer.name}`,
    `Budget: ₹${Number(customer.orderValue || 0).toLocaleString("en-IN")}+`,
    customer.notes ? `Notes: ${customer.notes}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function buildLeadWhatsAppUrl(customer) {
  const businessPhone = cleanLeadPhone(
    localStorage.getItem("imaginfit-business-whatsapp") || document.body.dataset.businessWhatsapp || ""
  );
  const text = encodeURIComponent(buildLeadMessage(customer));
  return `https://web.whatsapp.com/send?${businessPhone ? `phone=${businessPhone}&` : ""}text=${text}`;
}

function buildDesignWhatsAppUrl(design = {}) {
  const businessPhone = cleanLeadPhone(
    localStorage.getItem("imaginfit-business-whatsapp") || document.body.dataset.businessWhatsapp || ""
  );
  const text = encodeURIComponent(
    [
      `Hi ImaginFit Studio, I want to ask about this look: ${design.title || "Custom outfit"}.`,
      `Starting price: ${formatCollectionPrice(getCollectionPrice(design))}`,
      `Category: ${design.config?.category || design.collection || "Custom"}`,
      "Please guide me with fabric, measurements, and final quote.",
    ].join("\n")
  );
  return `https://web.whatsapp.com/send?${businessPhone ? `phone=${businessPhone}&` : ""}text=${text}`;
}

function getStoredCustomerReviews() {
  try {
    const stored = JSON.parse(localStorage.getItem(customerReviewsStorageKey) || "[]");
    return Array.isArray(stored) && stored.length ? stored : fallbackCustomerReviews;
  } catch {
    return fallbackCustomerReviews;
  }
}

function renderCustomerReviews() {
  if (!customerReviewsGrid) return;
  const reviews = getStoredCustomerReviews();
  customerReviewsGrid.innerHTML = reviews.length
    ? reviews
        .slice(0, 6)
        .map((review) => {
          const rating = Math.max(1, Math.min(5, Number(review.rating || 5)));
          return `
            <article class="review-card">
              <div class="review-copy">
                <div class="review-person">
                  <strong>${escapeCollectionHtml(review.name || "Customer")}</strong>
                  <span>${escapeCollectionHtml(review.outfit || "Custom outfit order")}</span>
                </div>
                <div class="review-topline">
                  <span>${escapeCollectionHtml(review.outfit || "Custom fit")}</span>
                  <strong>${"★".repeat(rating)}${"☆".repeat(5 - rating)}</strong>
                </div>
                <blockquote>“${escapeCollectionHtml(review.text || "Loved the custom fit and guidance.")}”</blockquote>
                <p><strong>Customer note</strong> ${escapeCollectionHtml(review.note || "Custom order with measurements and fabric support.")}</p>
              </div>
            </article>
          `;
        })
        .join("")
    : '<p class="empty-cart">Reviews will appear here after you add them from backend.</p>';
}

function saveAssistantIdea(idea) {
  try {
    const ideas = JSON.parse(localStorage.getItem(assistantIdeasStorageKey) || "[]");
    ideas.unshift({
      id: localLeadId(),
      idea,
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem(assistantIdeasStorageKey, JSON.stringify(ideas.slice(0, 30)));
  } catch {
    // Assistant can still respond even when browser storage is unavailable.
  }
}

function buildAssistantReply(idea) {
  const text = idea.toLowerCase();

  if (text.includes("reference") || text.includes("photo") || text.includes("picture") || text.includes("similar")) {
    return {
      title: "Yes, start with your reference photo.",
      body: "Open the design studio, upload or paste your reference photo, then choose the garment, fabric, neckline, sleeves, and changes you want.",
      primaryHref: "./design.html#reference",
      primaryLabel: "Upload Reference",
      secondaryHref: "./fabrics.html",
      secondaryLabel: "Pick Fabric",
    };
  }

  if (text.includes("measure") || text.includes("size") || text.includes("fit")) {
    return {
      title: "For sizing, start in the design studio.",
      body: "Choose the garment first, then use the measurement section to add chest, waist, hip, shoulder, sleeve, length, and fit notes.",
      primaryHref: "./design.html#measurements",
      primaryLabel: "Add Measurements",
      secondaryHref: "./design.html",
      secondaryLabel: "Start Design",
    };
  }

  if (text.includes("fabric") || text.includes("silk") || text.includes("linen") || text.includes("satin")) {
    return {
      title: "Start with fabric selection.",
      body: "Open the fabric library, choose the closest fabric, then continue to the design studio with that fabric selected.",
      primaryHref: "./fabrics.html",
      primaryLabel: "Choose Fabric",
      secondaryHref: "./design.html",
      secondaryLabel: "Start Design",
    };
  }

  if (text.includes("price") || text.includes("budget") || text.includes("cost") || text.includes("estimate")) {
    return {
      title: "A quick estimate starts with garment and fabric.",
      body: "Daily wear starts lower, premium fabric and embroidery increase the final quote. Start the order and choose fabric/details so the studio can confirm the exact price.",
      primaryHref: "./design.html",
      primaryLabel: "Get Estimate",
      secondaryHref: "./fabrics.html",
      secondaryLabel: "View Fabrics",
    };
  }

  if (text.includes("delivery") || text.includes("ready") || text.includes("urgent") || text.includes("fast")) {
    return {
      title: "Delivery depends on detail level.",
      body: "Simple outfits can start faster. Heavy embroidery, lining, premium fabric, and multiple pieces need more time. Add your need-by date inside the order form.",
      primaryHref: "./design.html",
      primaryLabel: "Start Order",
      secondaryHref: "./design.html#measurements",
      secondaryLabel: "Add Need Details",
    };
  }

  if (
    text.includes("neckline") ||
    text.includes("sleeve") ||
    text.includes("lace") ||
    text.includes("pearl") ||
    text.includes("embroidery") ||
    text.includes("change")
  ) {
    return {
      title: "Yes, you can customize design details.",
      body: "Use the design studio to change neckline, sleeves, fit, accessories, lace, pearls, embroidery, and measurement notes before saving the order.",
      primaryHref: "./design.html",
      primaryLabel: "Customize Fit",
      secondaryHref: "./fabrics.html",
      secondaryLabel: "Choose Fabric",
    };
  }

  return {
    title: "Good idea. Build it in the design studio.",
    body: "Start with the closest garment type, add fabric and details, then save the order with measurement notes so the studio can prepare it.",
    primaryHref: "./design.html",
    primaryLabel: "Start Designing",
    secondaryHref: "./fabrics.html",
    secondaryLabel: "View Fabrics",
  };
}

async function postLeadToBackend(customer) {
  const response = await fetch("/api/customers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(customer),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Could not save enquiry online.");
  return result;
}

async function postLeadToNetlify(formData) {
  if (!/netlify\.app$/i.test(window.location.hostname)) return;
  const body = new URLSearchParams(formData);
  await fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
}

function saveLeadLocally(customer) {
  const localLeads = readLocalLeads(localCrmStorageKey);
  const existingIndex = localLeads.findIndex((lead) => cleanLeadPhone(lead.phone) === cleanLeadPhone(customer.phone));
  const nextCustomer = {
    ...customer,
    updatedAt: new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    localLeads[existingIndex] = {
      ...localLeads[existingIndex],
      ...nextCustomer,
      id: localLeads[existingIndex].id,
      createdAt: localLeads[existingIndex].createdAt,
    };
  } else {
    localLeads.unshift(nextCustomer);
  }

  saveLocalLeads(localCrmStorageKey, localLeads);
}

function savePendingLead(customer) {
  const pending = readLocalLeads(pendingCustomersStorageKey);
  const nextPending = pending.filter((lead) => cleanLeadPhone(lead.phone) !== cleanLeadPhone(customer.phone));
  nextPending.unshift(customer);
  saveLocalLeads(pendingCustomersStorageKey, nextPending.slice(0, 60));
}

async function syncPendingLeads() {
  const pending = readLocalLeads(pendingCustomersStorageKey);
  if (!pending.length) return;

  const remaining = [];
  for (const customer of pending) {
    try {
      await postLeadToBackend(customer);
    } catch {
      remaining.push(customer);
    }
  }
  saveLocalLeads(pendingCustomersStorageKey, remaining);
}

function renderCollectionGallery() {
  const visible =
    activeCollectionFilter === "All"
      ? collectionDesigns
      : collectionDesigns.filter((design) => (design.collection || "Semiformal") === activeCollectionFilter);

  collectionGrid.innerHTML = visible.length
    ? visible
        .map((design) => {
          const sourceUrl = getDesignSourceUrl(design);
          const occasionTags = getOccasionTags(design);
          return `
            <article>
              <div class="gallery-image">
                <img src="${escapeCollectionHtml(getDesignPreviewImage(design))}" alt="${escapeCollectionHtml(design.title)}" />
                <div class="gallery-image-overlay">
                  <span>Tap to personalize</span>
                  <strong>${escapeCollectionHtml(design.config?.fabric || "Custom fabric")}</strong>
                </div>
              </div>
              <div class="gallery-copy">
                <div class="gallery-card-top">
                  <span class="gallery-badge">${escapeCollectionHtml(design.collection || "Semiformal")}</span>
                  <span>${escapeCollectionHtml(design.likes || "New")}</span>
                </div>
                <h3>${escapeCollectionHtml(design.title)}</h3>
                <p>By ${escapeCollectionHtml(design.designer || "ImaginFit Studio")}</p>
                <p>${escapeCollectionHtml(design.note || "Made to order")}</p>
                <div class="occasion-tags" aria-label="Best for">
                  ${occasionTags.map((tag) => `<span>${escapeCollectionHtml(tag)}</span>`).join("")}
                </div>
                <strong class="collection-price">From ${formatCollectionPrice(getCollectionPrice(design))}</strong>
                ${sourceUrl ? `<a class="gallery-source-link" href="${escapeCollectionHtml(sourceUrl)}" target="_blank" rel="noopener">Open Pinterest source</a>` : ""}
                <div class="gallery-actions">
                  <a
                    class="gallery-design-link"
                    href="./design.html?look=${encodeURIComponent(design.id)}"
                    data-select-look="${escapeCollectionHtml(design.id)}"
                  >Start Designing</a>
                  <a
                    class="gallery-design-link secondary"
                    href="./design.html?look=${encodeURIComponent(design.id)}&order=1"
                    data-select-look="${escapeCollectionHtml(design.id)}"
                  >Continue With Sizing</a>
                  <a
                    class="gallery-design-link whatsapp-look-link"
                    href="${escapeCollectionHtml(buildDesignWhatsAppUrl(design))}"
                    target="_blank"
                    rel="noopener"
                  >Talk to Consultant</a>
                </div>
              </div>
            </article>
          `
        })
        .join("")
    : '<p class="empty-cart">No photos in this section yet.</p>';

  bindLuxuryCardTilt();
}

function bindLuxuryCardTilt() {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  collectionGrid.querySelectorAll("article").forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty("--tilt-x", `${x * 5}deg`);
      card.style.setProperty("--tilt-y", `${y * -5}deg`);
    });

    card.addEventListener("mouseleave", () => {
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
    });
  });
}

async function loadCollectionGallery() {
  try {
    const localDesigns = JSON.parse(localStorage.getItem(localDesignsStorageKey) || "[]");
    if (Array.isArray(localDesigns) && localDesigns.length) {
      collectionDesigns = mergeWithBuiltInDesigns(localDesigns);
      collectionDesigns = collectionDesigns.filter(isPublicCollectionDesign);
      renderCollectionGallery();
      return;
    }
  } catch {
    collectionDesigns = [];
  }

  try {
    const response = await fetch("/api/designs");
    if (!response.ok) throw new Error("Backend unavailable");
    collectionDesigns = await response.json();
  } catch {
    try {
      const response = await fetch("./data/designs.json");
      collectionDesigns = await response.json();
    } catch {
      collectionDesigns = collectionFallbackDesigns;
    }
  }

  collectionDesigns = mergeWithBuiltInDesigns(collectionDesigns);
  collectionDesigns = collectionDesigns.filter(isPublicCollectionDesign);
  renderCollectionGallery();
}

collectionTabs.addEventListener("click", (event) => {
  const filterButton = event.target.closest("[data-gallery-filter]");
  if (!filterButton) return;

  activeCollectionFilter = filterButton.dataset.galleryFilter;
  collectionTabs.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("is-selected", button === filterButton);
  });
  renderCollectionGallery();
});

collectionGrid.addEventListener("click", (event) => {
  const lookLink = event.target.closest("[data-select-look]");
  if (!lookLink) return;

  const design = collectionDesigns.find((item) => item.id === lookLink.dataset.selectLook);
  if (!design) return;

  try {
    sessionStorage.setItem(selectedLookStorageKey, JSON.stringify(design));
  } catch {
    // Query parameters still carry the selected look when session storage is unavailable.
  }
});

document.addEventListener("click", (event) => {
  const packageLink = event.target.closest("[data-package-choice]");
  if (!packageLink || !leadForm) return;

  leadForm.elements.package.value = packageLink.dataset.packageChoice;
  leadForm.elements.budget.value = packageLink.dataset.packageValue;
  leadStatus.textContent = `${packageLink.dataset.packageChoice} selected. Add customer details to save the enquiry.`;
  leadWhatsApp.hidden = true;
});

leadForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(leadForm);
  const customer = {
    id: localLeadId(),
    name: String(data.get("name") || "").trim(),
    phone: cleanLeadPhone(data.get("phone")),
    business: String(data.get("package") || "Custom outfit enquiry").trim(),
    source: "Website quick order",
    status: "Lead",
    notes: String(data.get("notes") || "").trim(),
    followUpDate: tomorrowDate(),
    orderValue: Number(data.get("budget") || 0),
    createdAt: new Date().toISOString(),
    updatedAt: "",
  };

  if (!customer.name || customer.phone.length < 10) {
    leadStatus.textContent = "Add a name and valid WhatsApp number.";
    leadWhatsApp.hidden = true;
    return;
  }

  leadStatus.textContent = "Saving enquiry...";
  saveLeadLocally(customer);
  savePendingLead(customer);

  try {
    const savedCustomer = await postLeadToBackend(customer);
    saveLeadLocally(savedCustomer);
    saveLocalLeads(
      pendingCustomersStorageKey,
      readLocalLeads(pendingCustomersStorageKey).filter((lead) => cleanLeadPhone(lead.phone) !== customer.phone)
    );
    leadStatus.textContent = "Enquiry saved in CRM. Open WhatsApp to continue.";
  } catch {
    leadStatus.textContent = "Enquiry saved on this system. Open WhatsApp to continue.";
  }

  try {
    await postLeadToNetlify(data);
  } catch {
    // CRM/local save and WhatsApp continue to work when Netlify form capture is unavailable.
  }

  leadWhatsApp.href = buildLeadWhatsAppUrl(customer);
  leadWhatsApp.hidden = false;
  leadForm.reset();
  leadForm.elements.package.value = "Premium Fabric Fit";
  leadForm.elements.budget.value = "3999";
});

assistantPromptButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (!assistantForm) return;
    assistantForm.elements.idea.value = button.dataset.assistantPrompt || "";
    assistantForm.elements.idea.focus();
  });
});

assistantForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const idea = String(new FormData(assistantForm).get("idea") || "").trim();
  if (!idea) return;

  saveAssistantIdea(idea);
  const reply = buildAssistantReply(idea);
  assistantResponse.hidden = false;
  assistantResponse.innerHTML = `
    <strong>${escapeCollectionHtml(reply.title)}</strong>
    <p>${escapeCollectionHtml(reply.body)}</p>
    <div>
      <a href="${escapeCollectionHtml(reply.primaryHref)}">${escapeCollectionHtml(reply.primaryLabel)}</a>
      <a href="${escapeCollectionHtml(reply.secondaryHref || "./fabrics.html")}">${escapeCollectionHtml(
        reply.secondaryLabel || "View Fabrics"
      )}</a>
      <a href="./design.html">Design Studio</a>
    </div>
  `;
});

dreamFitOpen?.addEventListener("click", openDreamFitPanel);

dreamFitFile?.addEventListener("change", async () => {
  const file = dreamFitFile.files?.[0];
  if (!file) return;

  if (dreamFitStatus) dreamFitStatus.textContent = "Adding your photo to the design studio...";

  try {
    saveDreamReference({
      type: "image",
      value: await collectionFileToDataUrl(file),
      source: "Uploaded dream fit",
    });
  } catch {
    if (dreamFitStatus) dreamFitStatus.textContent = "This photo could not be loaded. Please try another image.";
  }
});

dreamFitLinkForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = dreamFitLink?.value.trim();

  if (!value) {
    if (dreamFitStatus) dreamFitStatus.textContent = "Paste a Pinterest or website link first.";
    dreamFitLink?.focus();
    return;
  }

  saveDreamReference({
    type: "link",
    value,
    source: "Dream fit link",
  });
});

function closeSiteIntro() {
  if (!siteIntro) return;
  siteIntro.classList.add("is-hidden");
  siteIntroVideo?.pause();
  try {
    sessionStorage.setItem(siteIntroSeenStorageKey, "true");
  } catch {
    // The intro still closes if session storage is unavailable.
  }
}

function initSiteIntro() {
  if (!siteIntro) return;

  try {
    if (sessionStorage.getItem(siteIntroSeenStorageKey) === "true") {
      closeSiteIntro();
      return;
    }
  } catch {
    // Show the intro when browser storage is blocked.
  }

  siteIntro.addEventListener("click", closeSiteIntro);
  siteIntroVideo?.addEventListener("ended", closeSiteIntro);
  window.setTimeout(closeSiteIntro, 11500);
}

heroVideoToggle?.addEventListener("click", () => {
  if (!heroVideo) return;

  if (heroVideo.paused) {
    heroVideo.play();
    heroVideoToggle.textContent = "Pause";
    heroVideoToggle.setAttribute("aria-label", "Pause video");
    return;
  }

  heroVideo.pause();
  heroVideoToggle.textContent = "Play";
  heroVideoToggle.setAttribute("aria-label", "Play video");
});

heroAudioToggle?.addEventListener("click", () => {
  if (!heroVideo) return;

  heroVideo.muted = !heroVideo.muted;
  heroAudioToggle.textContent = heroVideo.muted ? "Sound" : "Mute";
  heroAudioToggle.setAttribute("aria-label", heroVideo.muted ? "Unmute video" : "Mute video");
});

initSiteIntro();
loadCollectionGallery();
renderCustomerReviews();
syncPendingLeads();
