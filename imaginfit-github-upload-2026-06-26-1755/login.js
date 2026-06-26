const loginForm = document.querySelector("[data-login-form]");
const loginStatus = document.querySelector("[data-login-status]");
const whatsappStorageKey = "imaginfit-whatsapp-desk";
const customerSessionKey = "imaginfit-customer-session";
const pendingCustomersKey = "imaginfit-pending-customers";

function getCustomerSession() {
  try {
    return JSON.parse(localStorage.getItem(customerSessionKey) || "null");
  } catch {
    return null;
  }
}

function saveCustomerSession(customer) {
  localStorage.setItem(
    customerSessionKey,
    JSON.stringify({
      ...customer,
      signedInAt: new Date().toISOString(),
    })
  );
}

function getPendingCustomers() {
  try {
    const pending = JSON.parse(localStorage.getItem(pendingCustomersKey) || "[]");
    return Array.isArray(pending) ? pending : [];
  } catch {
    return [];
  }
}

function savePendingCustomers(customers) {
  localStorage.setItem(pendingCustomersKey, JSON.stringify(customers));
}

function queueCustomer(customer) {
  const pending = getPendingCustomers();
  const phone = cleanPhone(customer.phone);
  const next = pending.filter((item) => cleanPhone(item.phone) !== phone);
  next.push(customer);
  savePendingCustomers(next);
}

async function syncPendingCustomers() {
  const pending = getPendingCustomers();
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

  savePendingCustomers(remaining);
  return remaining.length === 0;
}

function cleanPhone(phone) {
  return String(phone || "").replace(/[^\d+]/g, "").replace(/^\+/, "");
}

function saveCustomerToBrowser(customer) {
  const saved = JSON.parse(localStorage.getItem(whatsappStorageKey) || "{}");
  const customers = Array.isArray(saved.customers) ? saved.customers : [];
  const phone = cleanPhone(customer.phone);
  const nextCustomer = {
    id: customer.id || crypto.randomUUID(),
    name: customer.name,
    phone: `+${phone}`,
    business: customer.business,
  };
  const existingIndex = customers.findIndex((item) => cleanPhone(item.phone) === phone);

  if (existingIndex >= 0) {
    customers[existingIndex] = { ...customers[existingIndex], ...nextCustomer };
  } else {
    customers.unshift(nextCustomer);
  }

  localStorage.setItem(
    whatsappStorageKey,
    JSON.stringify({
      ...saved,
      customers,
    })
  );

  return nextCustomer;
}

const existingSession = getCustomerSession();

if (existingSession?.phone && !new URLSearchParams(window.location.search).has("change")) {
  window.location.replace("./index.html#studio");
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  loginStatus.textContent = "Saving your number...";

  const data = new FormData(loginForm);
  const customer = {
    name: data.get("name").trim(),
    phone: data.get("phone").trim(),
    business: data.get("business").trim() || "Customer login",
    source: "Customer login",
  };

  if (!customer.name || cleanPhone(customer.phone).length < 10) {
    loginStatus.textContent = "Add your name and a valid WhatsApp number.";
    return;
  }

  const savedCustomer = saveCustomerToBrowser(customer);
  saveCustomerSession(savedCustomer);
  queueCustomer(customer);

  const centrallySaved = await syncPendingCustomers();
  loginStatus.textContent = centrallySaved
    ? "Signed in. Your information is saved with ImaginFit Studio."
    : "Signed in on this device. We will retry saving your information to ImaginFit Studio.";

  loginForm.reset();
  setTimeout(() => {
    window.location.href = "./index.html#studio";
  }, 900);
});

syncPendingCustomers();
