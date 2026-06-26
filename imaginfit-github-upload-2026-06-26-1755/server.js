const http = require("http");
const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");

const root = __dirname;
const bundledDataDir = path.join(root, "data");
const dataDir = process.env.DATA_DIR || bundledDataDir;
const dataFile = path.join(dataDir, "designs.json");
const customersFile = path.join(dataDir, "customers.json");
const optionsFile = path.join(dataDir, "options.json");
const fabricsFile = path.join(dataDir, "fabrics.json");
const uploadsDir = process.env.UPLOADS_DIR || path.join(root, "uploads");
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || "0.0.0.0";
const operatorCode = process.env.OPERATOR_CODE || "imaginfit2026";
const collections = ["Semiformal", "Traditional", "Customer References", "Finished Outfits", "Fabric Samples"];
const customerStatuses = ["Lead", "Contacted", "Measuring", "Designing", "Ordered", "Delivered", "Follow-up"];
let customerWriteQueue = Promise.resolve();

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

async function readJson() {
  try {
    const content = await fs.readFile(dataFile, "utf8");
    return JSON.parse(content);
  } catch {
    const seed = await fs.readFile(path.join(bundledDataDir, "designs.json"), "utf8");
    const designs = JSON.parse(seed);
    await writeJson(designs);
    return designs;
  }
}

async function writeJson(data) {
  await fs.mkdir(path.dirname(dataFile), { recursive: true });
  await fs.writeFile(dataFile, `${JSON.stringify(data, null, 2)}\n`);
}

async function readOptions() {
  try {
    const content = await fs.readFile(optionsFile, "utf8");
    return JSON.parse(content);
  } catch {
    const seed = await fs.readFile(path.join(bundledDataDir, "options.json"), "utf8");
    const options = JSON.parse(seed);
    await writeOptions(options);
    return options;
  }
}

async function writeOptions(options) {
  await fs.mkdir(path.dirname(optionsFile), { recursive: true });
  await fs.writeFile(optionsFile, `${JSON.stringify(options, null, 2)}\n`);
}

async function readFabrics() {
  try {
    const content = await fs.readFile(fabricsFile, "utf8");
    return JSON.parse(content);
  } catch {
    const seed = await fs.readFile(path.join(bundledDataDir, "fabrics.json"), "utf8");
    const fabrics = JSON.parse(seed);
    await writeFabrics(fabrics);
    return fabrics;
  }
}

async function writeFabrics(fabrics) {
  await fs.mkdir(path.dirname(fabricsFile), { recursive: true });
  await fs.writeFile(fabricsFile, `${JSON.stringify(fabrics, null, 2)}\n`);
}

async function readCustomers() {
  try {
    const content = await fs.readFile(customersFile, "utf8");
    return JSON.parse(content);
  } catch {
    return [];
  }
}

async function writeCustomers(customers) {
  await fs.mkdir(path.dirname(customersFile), { recursive: true });
  const temporaryFile = `${customersFile}.tmp`;
  await fs.writeFile(temporaryFile, `${JSON.stringify(customers, null, 2)}\n`);
  await fs.rename(temporaryFile, customersFile);
}

function saveCustomer(customer) {
  const saveOperation = customerWriteQueue.then(async () => {
    const customers = await readCustomers();
    const existingIndex = customers.findIndex((item) => item.phone === customer.phone);

    if (existingIndex >= 0) {
      const existing = customers[existingIndex];
      customers[existingIndex] = {
        ...existing,
        ...customer,
        id: existing.id,
        createdAt: existing.createdAt,
        status: existing.status || customer.status,
        notes: existing.notes || customer.notes,
        followUpDate: existing.followUpDate || customer.followUpDate,
        lastContactedAt: existing.lastContactedAt || customer.lastContactedAt,
        orderValue: Number(existing.orderValue || customer.orderValue || 0),
        updatedAt: new Date().toISOString(),
      };
      customer = customers[existingIndex];
    } else {
      customers.unshift(customer);
    }

    await writeCustomers(customers);
    return customer;
  });

  customerWriteQueue = saveOperation.catch(() => {});
  return saveOperation;
}

function updateCustomer(id, input) {
  const updateOperation = customerWriteQueue.then(async () => {
    const customers = await readCustomers();
    const index = customers.findIndex((customer) => customer.id === id);

    if (index === -1) return null;

    const current = customers[index];
    const updatedCustomer = cleanCustomer({
      ...current,
      ...input,
      id: current.id,
      phone: input.phone === undefined ? current.phone : input.phone,
      createdAt: current.createdAt,
      updatedAt: new Date().toISOString(),
    });
    if (!updatedCustomer.name || updatedCustomer.phone.length < 10) {
      throw new Error("Add a name and valid WhatsApp number.");
    }
    customers[index] = updatedCustomer;
    await writeCustomers(customers);
    return customers[index];
  });

  customerWriteQueue = updateOperation.catch(() => {});
  return updateOperation;
}

function deleteCustomer(id) {
  const deleteOperation = customerWriteQueue.then(async () => {
    const customers = await readCustomers();
    const nextCustomers = customers.filter((customer) => customer.id !== id);
    if (nextCustomers.length === customers.length) return false;
    await writeCustomers(nextCustomers);
    return true;
  });

  customerWriteQueue = deleteOperation.catch(() => {});
  return deleteOperation;
}

function send(response, status, body, contentType = "application/json; charset=utf-8") {
  response.writeHead(status, { "Content-Type": contentType });
  response.end(body);
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 12_000_000) {
        reject(new Error("Request too large"));
        request.destroy();
      }
    });
    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

function cleanDesign(input) {
  const config = input.config || {};
  const price = Number(input.price || 0);
  return {
    id: input.id || crypto.randomUUID(),
    title: String(input.title || "").slice(0, 80),
    designer: String(input.designer || "").slice(0, 60),
    likes: String(input.likes || "New").slice(0, 30),
    note: String(input.note || "").slice(0, 80),
    price: Number.isFinite(price) && price >= 0 ? Math.round(price) : 0,
    collection: collections.includes(input.collection) ? input.collection : "Semiformal",
    image: String(input.image || ""),
    config: {
      category: String(config.category || "Kurti"),
      fabric: String(config.fabric || "Cotton"),
      color: String(config.color || "White"),
      neckline: String(config.neckline || "Round"),
      sleeves: String(config.sleeves || "Short"),
      fit: String(config.fit || "Relaxed"),
      measurement: String(config.measurement || "Tailored Body"),
      extras: Array.isArray(config.extras) ? config.extras.map(String).slice(0, 4) : [],
      accessories: Array.isArray(config.accessories) ? config.accessories.map(String).slice(0, 8) : [],
      layout: String(config.layout || "").slice(0, 60),
      lookTitle: String(config.lookTitle || input.title || "").slice(0, 80),
      referenceImage: String(config.referenceImage || "").slice(0, 1_000_000),
      sourceUrl: String(config.sourceUrl || "").slice(0, 1000),
    },
  };
}

function cleanOptionList(list, hasColorValue = false) {
  return Array.isArray(list)
    ? list
        .map((option) => ({
          label: String(option.label || "").trim().slice(0, 40),
          ...(hasColorValue
            ? { value: String(option.value || "#cccccc").trim().slice(0, 20) }
            : { price: Math.max(0, Math.round(Number(option.price || 0))) }),
        }))
        .filter((option) => option.label)
        .slice(0, 12)
    : [];
}

function cleanOptions(input) {
  return {
    category: cleanOptionList(input.category),
    fabric: cleanOptionList(input.fabric),
    color: cleanOptionList(input.color, true),
    neckline: cleanOptionList(input.neckline),
    sleeves: cleanOptionList(input.sleeves),
    fit: cleanOptionList(input.fit),
    measurement: cleanOptionList(input.measurement),
    extras: cleanOptionList(input.extras),
    accessories: cleanOptionList(input.accessories),
  };
}

function cleanFabric(input = {}) {
  return {
    id: String(input.id || crypto.randomUUID()).slice(0, 80),
    name: String(input.name || "").trim().slice(0, 50),
    category: String(input.category || "Daily Wear").trim().slice(0, 40),
    bestFor: String(input.bestFor || "").trim().slice(0, 160),
    comfort: String(input.comfort || "").trim().slice(0, 80),
    priceRange: String(input.priceRange || "").trim().slice(0, 80),
    care: String(input.care || "").trim().slice(0, 100),
    image: String(input.image || "").trim().slice(0, 1000),
    note: String(input.note || "").trim().slice(0, 220),
  };
}

function cleanFabricList(input) {
  return Array.isArray(input) ? input.map(cleanFabric).filter((fabric) => fabric.name).slice(0, 80) : [];
}

function cleanPhone(phone) {
  return String(phone || "").replace(/[^\d+]/g, "").replace(/^\+/, "");
}

function cleanCustomer(input) {
  const status = customerStatuses.includes(input.status) ? input.status : "Lead";
  const orderValue = Number(input.orderValue || 0);

  return {
    id: input.id || crypto.randomUUID(),
    name: String(input.name || "").trim().slice(0, 80),
    phone: cleanPhone(input.phone),
    business: String(input.business || "Customer login").trim().slice(0, 120),
    source: String(input.source || "Login page").trim().slice(0, 60),
    status,
    notes: String(input.notes || "").trim().slice(0, 2000),
    followUpDate: String(input.followUpDate || "").slice(0, 10),
    needBy: String(input.needBy || "").slice(0, 10),
    lastContactedAt: String(input.lastContactedAt || "").slice(0, 30),
    orderValue: Number.isFinite(orderValue) && orderValue >= 0 ? Math.round(orderValue) : 0,
    createdAt: input.createdAt || new Date().toISOString(),
    updatedAt: input.updatedAt || "",
  };
}

function isRemoteImage(image) {
  try {
    const url = new URL(image);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
}

async function normalizeImage(image, id) {
  if (image.startsWith("data:image/")) return saveUploadedImage(image, id);
  if (isRemoteImage(image)) return image;
  if (image.startsWith("/uploads/")) return image;
  throw new Error("Image must be an uploaded file or an image URL.");
}

function requireOperator(request, response) {
  if (request.headers["x-operator-code"] === operatorCode) return true;
  send(response, 401, JSON.stringify({ error: "Invalid operator code." }));
  return false;
}

function isLocalHost(hostHeader = "") {
  const value = String(hostHeader).toLowerCase();
  const hostName = value.startsWith("[") ? value.slice(1, value.indexOf("]")) : value.split(":")[0];
  return ["localhost", "127.0.0.1", "::1", "0.0.0.0"].includes(hostName);
}

async function saveUploadedImage(dataUrl, id) {
  const match = /^data:(image\/(?:png|jpeg|jpg|webp|svg\+xml));base64,(.+)$/u.exec(dataUrl);
  const svgTextMatch = /^data:(image\/svg\+xml)(?:;charset=utf-8)?,(.+)$/u.exec(dataUrl);

  if (!match && !svgTextMatch) {
    throw new Error("Image must be a PNG, JPG, WEBP, or SVG file.");
  }

  const mimeType = match ? match[1] : svgTextMatch[1];
  const extensionByMime = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/webp": "webp",
    "image/svg+xml": "svg",
  };
  const extension = extensionByMime[mimeType];
  const filename = `${id}.${extension}`;
  const filePath = path.join(uploadsDir, filename);
  const imageData = match
    ? Buffer.from(match[2], "base64")
    : Buffer.from(decodeURIComponent(svgTextMatch[2]), "utf8");

  await fs.mkdir(uploadsDir, { recursive: true });
  await fs.writeFile(filePath, imageData);
  return `/uploads/${filename}`;
}

async function handleApi(request, response) {
  const url = new URL(request.url, `http://${request.headers.host}`);

  if (request.method === "GET" && url.pathname === "/api/health") {
    send(response, 200, JSON.stringify({ ok: true }));
    return true;
  }

  if (request.method === "GET" && url.pathname === "/api/customers") {
    send(response, 200, JSON.stringify(await readCustomers()));
    return true;
  }

  if (request.method === "POST" && url.pathname === "/api/customers") {
    try {
      const customer = cleanCustomer(JSON.parse(await readBody(request)));

      if (!customer.name || customer.phone.length < 10) {
        send(response, 400, JSON.stringify({ error: "Add a name and valid WhatsApp number." }));
        return true;
      }

      const savedCustomer = await saveCustomer(customer);
      send(response, 201, JSON.stringify(savedCustomer));
      return true;
    } catch (error) {
      send(response, 400, JSON.stringify({ error: error.message }));
      return true;
    }
  }

  if (request.method === "GET" && url.pathname === "/api/options") {
    send(response, 200, JSON.stringify(await readOptions()));
    return true;
  }

  if (request.method === "PATCH" && url.pathname === "/api/options") {
    try {
      if (!requireOperator(request, response)) return true;

      const options = cleanOptions(JSON.parse(await readBody(request)));
      await writeOptions(options);
      send(response, 200, JSON.stringify(options));
      return true;
    } catch (error) {
      send(response, 400, JSON.stringify({ error: error.message }));
      return true;
    }
  }

  if (request.method === "GET" && url.pathname === "/api/fabrics") {
    send(response, 200, JSON.stringify(await readFabrics()));
    return true;
  }

  if (request.method === "PUT" && url.pathname === "/api/fabrics") {
    try {
      if (!requireOperator(request, response)) return true;

      const fabrics = cleanFabricList(JSON.parse(await readBody(request)));
      await writeFabrics(fabrics);
      send(response, 200, JSON.stringify(fabrics));
      return true;
    } catch (error) {
      send(response, 400, JSON.stringify({ error: error.message }));
      return true;
    }
  }

  if (request.method === "PATCH" && url.pathname.startsWith("/api/customers/")) {
    try {
      if (!requireOperator(request, response)) return true;

      const id = decodeURIComponent(url.pathname.split("/").pop());
      const customer = await updateCustomer(id, JSON.parse(await readBody(request)));

      if (!customer) {
        send(response, 404, JSON.stringify({ error: "Customer not found." }));
        return true;
      }

      if (!customer.name || customer.phone.length < 10) {
        send(response, 400, JSON.stringify({ error: "Add a name and valid WhatsApp number." }));
        return true;
      }

      send(response, 200, JSON.stringify(customer));
      return true;
    } catch (error) {
      send(response, 400, JSON.stringify({ error: error.message }));
      return true;
    }
  }

  if (request.method === "DELETE" && url.pathname.startsWith("/api/customers/")) {
    if (!requireOperator(request, response)) return true;

    const id = decodeURIComponent(url.pathname.split("/").pop());
    const deleted = await deleteCustomer(id);
    send(response, deleted ? 200 : 404, JSON.stringify(deleted ? { ok: true } : { error: "Customer not found." }));
    return true;
  }

  if (request.method === "GET" && url.pathname === "/api/designs") {
    send(response, 200, JSON.stringify(await readJson()));
    return true;
  }

  if (request.method === "POST" && url.pathname === "/api/designs") {
    try {
      if (!requireOperator(request, response)) return true;

      const design = cleanDesign(JSON.parse(await readBody(request)));

      if (!design.title || !design.designer || !design.image) {
        send(response, 400, JSON.stringify({ error: "Missing title, designer, or image." }));
        return true;
      }

      design.image = await normalizeImage(design.image, design.id);

      const designs = await readJson();
      designs.unshift(design);
      await writeJson(designs);
      send(response, 201, JSON.stringify(design));
      return true;
    } catch (error) {
      send(response, 400, JSON.stringify({ error: error.message }));
      return true;
    }
  }

  if (request.method === "PATCH" && url.pathname.startsWith("/api/designs/")) {
    try {
      if (!requireOperator(request, response)) return true;

      const id = decodeURIComponent(url.pathname.split("/").pop());
      const input = JSON.parse(await readBody(request));
      const designs = await readJson();
      const index = designs.findIndex((design) => design.id === id);

      if (index === -1) {
        send(response, 404, JSON.stringify({ error: "Design not found." }));
        return true;
      }

      const merged = cleanDesign({ ...designs[index], ...input, id });
      merged.image =
        input.image && input.image !== designs[index].image
          ? await normalizeImage(input.image, id)
          : designs[index].image;
      designs[index] = merged;
      await writeJson(designs);
      send(response, 200, JSON.stringify(merged));
      return true;
    } catch (error) {
      send(response, 400, JSON.stringify({ error: error.message }));
      return true;
    }
  }

  if (request.method === "DELETE" && url.pathname.startsWith("/api/designs/")) {
    if (!requireOperator(request, response)) return true;

    const id = decodeURIComponent(url.pathname.split("/").pop());
    const designs = await readJson();
    const nextDesigns = designs.filter((design) => design.id !== id);
    await writeJson(nextDesigns);
    send(response, 200, JSON.stringify({ ok: true }));
    return true;
  }

  if (request.method === "POST" && url.pathname === "/api/designs/reorder") {
    try {
      if (!requireOperator(request, response)) return true;

      const { orderedIds } = JSON.parse(await readBody(request));
      const designs = await readJson();
      const byId = new Map(designs.map((design) => [design.id, design]));
      const ordered = Array.isArray(orderedIds)
        ? orderedIds.map((id) => byId.get(id)).filter(Boolean)
        : [];
      const remaining = designs.filter((design) => !orderedIds?.includes(design.id));

      await writeJson([...ordered, ...remaining]);
      send(response, 200, JSON.stringify({ ok: true }));
      return true;
    } catch (error) {
      send(response, 400, JSON.stringify({ error: error.message }));
      return true;
    }
  }

  if (request.method === "POST" && url.pathname === "/api/reference-photos") {
    try {
      const body = JSON.parse(await readBody(request));
      const id = crypto.randomUUID();
      const image = await normalizeImage(String(body.image || ""), id);
      send(response, 201, JSON.stringify({ image }));
      return true;
    } catch (error) {
      send(response, 400, JSON.stringify({ error: error.message }));
      return true;
    }
  }

  return false;
}

async function serveStatic(request, response) {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const requestedPath = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);

  if (requestedPath === "/admin.html" && !isLocalHost(request.headers.host)) {
    send(response, 404, "Not found", "text/plain; charset=utf-8");
    return;
  }

  const isUpload = requestedPath.startsWith("/uploads/");
  const baseDirectory = isUpload ? uploadsDir : root;
  const relativePath = isUpload ? requestedPath.slice("/uploads/".length) : requestedPath;
  const filePath = path.normalize(path.join(baseDirectory, relativePath));

  if (!filePath.startsWith(baseDirectory)) {
    send(response, 403, "Forbidden", "text/plain; charset=utf-8");
    return;
  }

  try {
    const file = await fs.readFile(filePath);
    const contentType = mimeTypes[path.extname(filePath)] || "application/octet-stream";
    send(response, 200, file, contentType);
  } catch {
    send(response, 404, "Not found", "text/plain; charset=utf-8");
  }
}

const server = http.createServer(async (request, response) => {
  try {
    if (await handleApi(request, response)) return;
    await serveStatic(request, response);
  } catch (error) {
    send(response, 500, JSON.stringify({ error: error.message }));
  }
});

if (require.main === module) {
  server.listen(port, host, () => {
    console.log(`ImaginFit backend running at http://${host}:${port}`);
  });
}

module.exports = {
  cleanCustomer,
  readCustomers,
  saveCustomer,
  updateCustomer,
  deleteCustomer,
  readOptions,
  writeOptions,
  readFabrics,
  writeFabrics,
  writeCustomers,
};
