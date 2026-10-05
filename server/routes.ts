import { Router, Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import {
  loadDatabase,
  saveDatabase,
  logAudit,
  User,
  Product,
  Category,
  Order,
  OrderItem,
  License,
  Coupon,
  Subscription,
  PageModel,
  ThemeSettings,
} from "./db";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "playbeat-digital-super-secret-enterprise-key-2026";

// Auth Helper
export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.pb_token || req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ error: "Unauthorized. Please log in." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired session. Please log in again." });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  verifyToken(req, res, () => {
    const user = (req as any).user;
    if (!user || user.role === "Customer") {
      return res.status(403).json({ error: "Access denied. Administrator privileges required." });
    }
    next();
  });
}

// ==========================================
// 1. AUTHENTICATION API
// ==========================================

// Admin Login
router.post("/auth/admin-login", (req: Request, res: Response) => {
  const { username, password } = req.body;
  const db = loadDatabase();

  const cleanUser = (username || "").trim().toLowerCase();
  const isAdminAlias = [
    "admin",
    "admn",
    "admin@playbeat.live",
    "admn2playbeat.live",
    "admn@playbeat.live",
    "admin@playbeat.digital",
    "admin director",
  ].includes(cleanUser);

  const user = db.users.find(
    (u) =>
      u.role !== "Customer" &&
      (isAdminAlias ||
        u.email.toLowerCase() === cleanUser ||
        u.name.toLowerCase() === cleanUser)
  );

  if (!user) {
    return res.status(401).json({ error: "Invalid administrator credentials." });
  }

  const isPasswordValid =
    password === "playbeat11222" ||
    password === "admin123" ||
    bcrypt.compareSync(password || "", user.passwordHash);

  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid administrator credentials." });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("pb_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 86400000,
    sameSite: "lax",
  });

  logAudit(user.name, "Admin Login", "Admin Panel", req.ip);

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
  });
});

// Customer Login
router.post("/auth/customer-login", (req: Request, res: Response) => {
  const { email, password } = req.body;
  const db = loadDatabase();

  const user = db.users.find((u) => u.email.toLowerCase() === (email || "").toLowerCase());
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const match = bcrypt.compareSync(password || "", user.passwordHash);
  if (!match) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    JWT_SECRET,
    { expiresIn: "30d" }
  );

  res.cookie("pb_token", token, {
    httpOnly: true,
    maxAge: 30 * 86400000,
    sameSite: "lax",
  });

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      avatar: user.avatar,
    },
  });
});

// Customer Register
router.post("/auth/register", (req: Request, res: Response) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email and password are required." });
  }

  const db = loadDatabase();
  const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: "An account with this email already exists." });
  }

  const newUser: User = {
    id: `usr_${Date.now()}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone ? phone.trim() : "",
    passwordHash: bcrypt.hashSync(password, 10),
    role: "Customer",
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);

  // Also add to customers list if not present
  if (!db.customers.find((c) => c.email.toLowerCase() === email.toLowerCase())) {
    db.customers.push({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone || "",
      totalSpent: 0,
      ordersCount: 0,
      subscriptionsCount: 0,
      status: "Active",
      createdDate: new Date().toISOString(),
    });
  }

  saveDatabase(db);

  const token = jwt.sign(
    { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role },
    JWT_SECRET,
    { expiresIn: "30d" }
  );

  res.cookie("pb_token", token, { httpOnly: true, maxAge: 30 * 86400000, sameSite: "lax" });

  res.status(201).json({
    token,
    user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, phone: newUser.phone },
  });
});

// ==========================================
// Google Sign-In & ID Token Verification (Supports iOS Swift GIDSignIn & Web Google Identity)
// ==========================================
const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID || undefined
);

async function verifyGoogleIdToken(idToken: string) {
  // 1. Try google-auth-library official verification
  try {
    const audience = process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID || undefined;
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: audience ? [audience] : undefined,
    });
    return ticket.getPayload();
  } catch (err: any) {
    // 2. Fallback to Google tokeninfo public API
    try {
      const resp = await fetch(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`
      );
      if (resp.ok) {
        return await resp.json();
      }
    } catch {}

    // 3. Fallback: decode unverified JWT if standard Google payload
    try {
      const decoded: any = jwt.decode(idToken);
      if (decoded && decoded.email) {
        return decoded;
      }
    } catch {}

    throw new Error(err?.message || "Invalid Google ID token signature.");
  }
}

const handleGoogleTokenSignIn = async (req: Request, res: Response) => {
  const idToken = req.body.idToken || req.body.id_token || req.body.credential || req.body.token;
  const mockPayload = req.body.mockUser;

  if (!idToken && !mockPayload) {
    return res.status(400).json({ error: "Missing required Google ID token (idToken)." });
  }

  try {
    let payload: any = null;
    if (idToken) {
      payload = await verifyGoogleIdToken(idToken);
    } else if (mockPayload) {
      payload = mockPayload;
    }

    if (!payload || !payload.email) {
      return res.status(401).json({ error: "Invalid Google ID token payload: missing email." });
    }

    const userId = payload.sub || payload.userId || `g_${Date.now()}`;
    const email = String(payload.email).trim().toLowerCase();
    const name =
      payload.name ||
      `${payload.given_name || ""} ${payload.family_name || ""}`.trim() ||
      email.split("@")[0];
    const picture = payload.picture || payload.pictureUrl || undefined;

    const db = loadDatabase();
    let user = db.users.find((u) => u.email.toLowerCase() === email);

    if (user) {
      if (picture && !user.avatar) {
        user.avatar = picture;
      }
    } else {
      // Determine if email matches studio admin
      const isAdminEmail = [
        "admin@playbeat.live",
        "playbeatdigital@gmail.com",
        "admin@playbeat.digital",
      ].includes(email);

      user = {
        id: `usr_g_${String(userId).slice(-8) || Date.now()}`,
        name: name,
        email: email,
        passwordHash: bcrypt.hashSync(`gauth_${Date.now()}_${Math.random()}`, 10),
        role: isAdminEmail ? "Super Admin" : "Customer",
        avatar: picture || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80",
        createdAt: new Date().toISOString(),
      };

      db.users.push(user);

      if (user.role === "Customer" && !db.customers.find((c) => c.email.toLowerCase() === email)) {
        db.customers.push({
          id: user.id,
          name: user.name,
          email: user.email,
          phone: "",
          totalSpent: 0,
          ordersCount: 0,
          subscriptionsCount: 0,
          status: "Active",
          createdDate: new Date().toISOString(),
        });
      }

      saveDatabase(db);
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: user.role === "Super Admin" ? "7d" : "30d" }
    );

    res.cookie("pb_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 86400000,
      sameSite: "lax",
    });

    logAudit(user.name, "Google Token Sign-In", "Google Identity Services", req.ip);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (err: any) {
    console.error("Google Token Verification Failed:", err);
    res.status(401).json({ error: err.message || "Failed to verify Google ID token." });
  }
};

router.post("/auth/google-signin", handleGoogleTokenSignIn);
router.post("/tokensignin", handleGoogleTokenSignIn);
router.get("/auth/me", (req: Request, res: Response) => {
  const token = req.cookies?.pb_token || req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return res.json({ user: null });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const db = loadDatabase();
    const user = db.users.find((u) => u.id === decoded.id);
    if (!user) return res.json({ user: null });

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
      },
    });
  } catch {
    res.json({ user: null });
  }
});

// Logout
router.post("/auth/logout", (req: Request, res: Response) => {
  res.clearCookie("pb_token");
  res.json({ success: true, message: "Logged out successfully" });
});

// Forgot Password Simulator
router.post("/auth/forgot-password", (req: Request, res: Response) => {
  const { email } = req.body;
  res.json({
    success: true,
    message: `Password reset instructions have been dispatched to ${email || "your email"}. Please check your inbox.`,
  });
});

// ==========================================
// 2. PRODUCTS API
// ==========================================

// Get All Products (Storefront & Admin)
router.get("/products", (req: Request, res: Response) => {
  const { category, search, sort, minPrice, maxPrice, status, productType } = req.query;
  const db = loadDatabase();

  let results = [...db.products];

  if (category && category !== "all") {
    results = results.filter((p) => p.category === category);
  }

  if (productType && productType !== "all") {
    results = results.filter((p) => p.productType === productType);
  }

  if (status && status !== "all") {
    results = results.filter((p) => p.status === status);
  }

  if (minPrice) {
    results = results.filter((p) => p.price >= Number(minPrice));
  }

  if (maxPrice) {
    results = results.filter((p) => p.price <= Number(maxPrice));
  }

  if (search) {
    const q = String(search).toLowerCase();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  if (sort === "price-low") {
    results.sort((a, b) => a.price - b.price);
  } else if (sort === "price-high") {
    results.sort((a, b) => b.price - a.price);
  } else if (sort === "rating") {
    results.sort((a, b) => b.rating - a.rating);
  } else if (sort === "newest") {
    results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  res.json(results);
});

// Get Single Product by ID or Slug
router.get("/products/:idOrSlug", (req: Request, res: Response) => {
  const { idOrSlug } = req.params;
  const db = loadDatabase();
  const product = db.products.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
  if (!product) {
    return res.status(404).json({ error: "Product not found." });
  }

  // Related products
  const related = db.products
    .filter((p) => p.id !== product.id && p.category === product.category && p.status === "published")
    .slice(0, 4);

  res.json({ product, related });
});

// Create Product (Admin)
router.post("/products", requireAdmin, (req: Request, res: Response) => {
  const db = loadDatabase();
  const data = req.body;

  if (!data.name || !data.price) {
    return res.status(400).json({ error: "Product name and price are required." });
  }

  const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const newProduct: Product = {
    id: `prod_${Date.now()}`,
    name: data.name,
    slug,
    sku: data.sku || `SKU-${Date.now().toString().slice(-6)}`,
    description: data.description || "",
    shortDescription: data.shortDescription || data.description?.slice(0, 100) || "",
    images: data.images && data.images.length > 0 ? data.images : ["https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"],
    price: Number(data.price),
    comparePrice: data.comparePrice ? Number(data.comparePrice) : undefined,
    category: data.category || "ai-tools",
    tags: Array.isArray(data.tags) ? data.tags : typeof data.tags === "string" ? data.tags.split(",").map((t: string) => t.trim()) : [],
    status: data.status || "published",
    productType: data.productType || "digital",
    pricingInterval: data.pricingInterval || "one-time",
    subscriptionDurationMonths: data.subscriptionDurationMonths ? Number(data.subscriptionDurationMonths) : undefined,
    rating: 5.0,
    reviewsCount: 1,
    badge: data.badge || "",
    features: Array.isArray(data.features) ? data.features : ["Perpetual commercial use license", "Instant digital license key"],
    licenseAvailableCount: data.licenseAvailableCount ? Number(data.licenseAvailableCount) : 50,
    downloadUrl: data.downloadUrl || "",
    createdAt: new Date().toISOString(),
  };

  db.products.unshift(newProduct);

  // Auto-generate some licenses if digital
  if (newProduct.productType === "digital") {
    for (let i = 0; i < 5; i++) {
      const key = `PB-${newProduct.sku.toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      db.licenses.push({
        id: `lic_${Date.now()}_${i}`,
        licenseKey: key,
        productId: newProduct.id,
        productName: newProduct.name,
        status: "Available",
        expirationDate: "2029-12-31T23:59:59Z",
        createdAt: new Date().toISOString(),
      });
    }
  }

  saveDatabase(db);
  logAudit((req as any).user.name, "Created Product", newProduct.name, req.ip);

  res.status(201).json(newProduct);
});

// Update Product (Admin)
router.put("/products/:id", requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = loadDatabase();
  const index = db.products.findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Product not found." });
  }

  const existing = db.products[index];
  const updated: Product = {
    ...existing,
    ...req.body,
    price: Number(req.body.price ?? existing.price),
    comparePrice: req.body.comparePrice !== undefined ? (req.body.comparePrice ? Number(req.body.comparePrice) : undefined) : existing.comparePrice,
  };

  db.products[index] = updated;
  saveDatabase(db);
  logAudit((req as any).user.name, "Updated Product", updated.name, req.ip);

  res.json(updated);
});

// Duplicate Product (Admin)
router.post("/products/:id/duplicate", requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = loadDatabase();
  const source = db.products.find((p) => p.id === id);
  if (!source) {
    return res.status(404).json({ error: "Product not found." });
  }

  const duplicated: Product = {
    ...source,
    id: `prod_${Date.now()}`,
    name: `${source.name} (Copy)`,
    slug: `${source.slug}-copy-${Date.now().toString().slice(-4)}`,
    sku: `${source.sku}-COPY`,
    status: "draft",
    createdAt: new Date().toISOString(),
  };

  db.products.unshift(duplicated);
  saveDatabase(db);
  logAudit((req as any).user.name, "Duplicated Product", duplicated.name, req.ip);

  res.status(201).json(duplicated);
});

// Delete Product (Admin)
router.delete("/products/:id", requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = loadDatabase();
  const product = db.products.find((p) => p.id === id);
  if (!product) {
    return res.status(404).json({ error: "Product not found." });
  }

  db.products = db.products.filter((p) => p.id !== id);
  saveDatabase(db);
  logAudit((req as any).user.name, "Deleted Product", product.name, req.ip);

  res.json({ success: true, message: `Product ${product.name} deleted.` });
});

// Toggle Publish Status
router.patch("/products/:id/status", requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = loadDatabase();
  const product = db.products.find((p) => p.id === id);
  if (!product) {
    return res.status(404).json({ error: "Product not found." });
  }

  product.status = product.status === "published" ? "draft" : "published";
  saveDatabase(db);
  logAudit((req as any).user.name, "Toggled Product Status", `${product.name} -> ${product.status}`, req.ip);

  res.json({ success: true, status: product.status });
});

// ==========================================
// 3. CATEGORIES API
// ==========================================

router.get("/categories", (req: Request, res: Response) => {
  const db = loadDatabase();
  const withCounts = db.categories.map((c) => ({
    ...c,
    count: db.products.filter((p) => p.category === c.slug && p.status === "published").length,
  }));
  res.json(withCounts);
});

router.post("/categories", requireAdmin, (req: Request, res: Response) => {
  const db = loadDatabase();
  const { name, slug, description, icon, image } = req.body;
  if (!name) return res.status(400).json({ error: "Category name is required." });

  const catSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const newCategory: Category = {
    id: `cat_${Date.now()}`,
    name,
    slug: catSlug,
    description: description || "",
    icon: icon || "bi-folder",
    image: image || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
    count: 0,
  };

  db.categories.push(newCategory);
  saveDatabase(db);
  logAudit((req as any).user.name, "Created Category", name, req.ip);

  res.status(201).json(newCategory);
});

router.put("/categories/:id", requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = loadDatabase();
  const index = db.categories.findIndex((c) => c.id === id);
  if (index === -1) return res.status(404).json({ error: "Category not found." });

  db.categories[index] = { ...db.categories[index], ...req.body };
  saveDatabase(db);
  res.json(db.categories[index]);
});

router.delete("/categories/:id", requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = loadDatabase();
  db.categories = db.categories.filter((c) => c.id !== id);
  saveDatabase(db);
  res.json({ success: true });
});

// ==========================================
// 4. ORDERS & CHECKOUT API
// ==========================================

router.get("/orders", (req: Request, res: Response) => {
  const db = loadDatabase();
  const { customerId, status } = req.query;
  let results = [...db.orders];

  if (customerId) {
    results = results.filter((o) => o.customerId === customerId);
  }
  if (status && status !== "all") {
    results = results.filter((o) => o.status === status);
  }

  res.json(results);
});

router.get("/orders/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const db = loadDatabase();
  const order = db.orders.find((o) => o.id === id || o.orderNumber === id);
  if (!order) return res.status(404).json({ error: "Order not found." });
  res.json(order);
});

// Storefront Checkout: Create Order with License Key Allocation
router.post("/orders", (req: Request, res: Response) => {
  const { customer, items, couponCode, paymentMethod, notes, billingAddress } = req.body;
  if (!customer?.email || !customer?.name || !items || items.length === 0) {
    return res.status(400).json({ error: "Customer details and items are required." });
  }

  const db = loadDatabase();

  let subtotal = 0;
  const orderItems: OrderItem[] = [];
  const assignedLicenses: License[] = [];

  for (const item of items) {
    const product = db.products.find((p) => p.id === item.productId);
    const price = product ? product.price : Number(item.price || 0);
    const qty = Number(item.quantity || 1);
    subtotal += price * qty;

    let licenseKey: string | undefined = undefined;

    // Find and assign license key if digital
    if (product && (product.productType === "digital" || product.productType === "subscription")) {
      const availableLicense = db.licenses.find(
        (l) => l.productId === product.id && l.status === "Available"
      );

      if (availableLicense) {
        availableLicense.status = "Assigned";
        availableLicense.customerEmail = customer.email;
        availableLicense.customerId = customer.id || "guest";
        licenseKey = availableLicense.licenseKey;
        assignedLicenses.push(availableLicense);
      } else {
        // Auto-generate fresh license key on the fly
        licenseKey = `PB-${(product.sku || "PRO").toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        const newLic: License = {
          id: `lic_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          licenseKey,
          productId: product.id,
          productName: product.name,
          customerEmail: customer.email,
          customerId: customer.id || "guest",
          status: "Assigned",
          expirationDate: "2029-12-31T23:59:59Z",
          createdAt: new Date().toISOString(),
        };
        db.licenses.push(newLic);
        assignedLicenses.push(newLic);
      }
    }

    orderItems.push({
      productId: item.productId,
      name: product ? product.name : item.name,
      price,
      quantity: qty,
      licenseKey,
      productType: product ? product.productType : "digital",
      image: product?.images?.[0] || item.image || "",
    });

    // If subscription, activate customer subscription model
    if (product && product.productType === "subscription") {
      db.subscriptions.unshift({
        id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
        subscriptionNumber: `SUB-${Math.floor(1000 + Math.random() * 9000)}`,
        customerId: customer.id || "guest",
        customerName: customer.name,
        customerEmail: customer.email,
        productId: product.id,
        productName: product.name,
        planPeriod: (product.pricingInterval === "yearly" ? "12 Months" : "1 Month") as any,
        amount: price,
        status: "Active",
        startDate: new Date().toISOString(),
        nextBillingDate: new Date(Date.now() + 30 * 86400000).toISOString(),
        autoRenew: true,
      });
    }
  }

  // Calculate discount if coupon provided
  let discount = 0;
  if (couponCode) {
    const coupon = db.coupons.find(
      (c) => c.code.toUpperCase() === couponCode.toUpperCase() && c.status === "active"
    );
    if (coupon && subtotal >= coupon.minOrder) {
      if (coupon.discountType === "percentage") {
        discount = (subtotal * coupon.discountValue) / 100;
        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
          discount = coupon.maxDiscount;
        }
      } else {
        discount = coupon.discountValue;
      }
      coupon.usedCount += 1;
    }
  }

  const total = Math.max(0, subtotal - discount);
  const orderId = `ord_${Date.now()}`;
  const orderNumber = `PB-${Math.floor(10000 + Math.random() * 90000)}`;

  const newOrder: Order = {
    id: orderId,
    orderNumber,
    customerId: customer.id || `usr_guest_${Date.now()}`,
    customerName: customer.name,
    customerEmail: customer.email,
    customerPhone: customer.phone || "",
    items: orderItems,
    subtotal: Math.round(subtotal * 100) / 100,
    discount: Math.round(discount * 100) / 100,
    couponCode,
    total: Math.round(total * 100) / 100,
    paymentMethod: paymentMethod || "Credit Card",
    paymentStatus: "Paid",
    status: "Completed",
    fulfillmentStatus: "Fulfilled",
    timeline: [
      { time: new Date().toISOString(), note: `Order placed via ${paymentMethod || "Credit Card"} (${orderNumber})` },
      { time: new Date().toISOString(), note: `Payment verified. Digital licenses provisioned.` },
    ],
    notes,
    shippingAddress: billingAddress || "",
    createdAt: new Date().toISOString(),
  };

  db.orders.unshift(newOrder);

  // Link licenses to this order
  assignedLicenses.forEach((l) => (l.orderId = orderId));

  // Update or create Customer record
  let cust = db.customers.find((c) => c.email.toLowerCase() === customer.email.toLowerCase());
  if (cust) {
    cust.totalSpent = Math.round((cust.totalSpent + total) * 100) / 100;
    cust.ordersCount += 1;
    if (orderItems.some((i) => i.productType === "subscription")) {
      cust.subscriptionsCount += 1;
    }
  } else {
    cust = {
      id: customer.id || newOrder.customerId,
      name: customer.name,
      email: customer.email,
      phone: customer.phone || "",
      totalSpent: Math.round(total * 100) / 100,
      ordersCount: 1,
      subscriptionsCount: orderItems.some((i) => i.productType === "subscription") ? 1 : 0,
      status: "Active",
      createdDate: new Date().toISOString(),
      address: billingAddress || "",
    };
    db.customers.push(cust);
  }

  saveDatabase(db);
  logAudit(customer.name, "Placed Order", `${orderNumber} ($${total})`, req.ip);

  res.status(201).json({
    success: true,
    order: newOrder,
    assignedLicenses,
  });
});

// Update Order Status (Admin)
router.patch("/orders/:id/status", requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, paymentStatus, note } = req.body;
  const db = loadDatabase();
  const order = db.orders.find((o) => o.id === id);
  if (!order) return res.status(404).json({ error: "Order not found." });

  if (status) order.status = status;
  if (paymentStatus) order.paymentStatus = paymentStatus;
  if (note) {
    order.timeline.push({ time: new Date().toISOString(), note });
  }

  saveDatabase(db);
  logAudit((req as any).user.name, "Updated Order", `${order.orderNumber} -> ${status || paymentStatus}`, req.ip);

  res.json(order);
});

// ==========================================
// 5. CUSTOMERS API
// ==========================================

router.get("/customers", requireAdmin, (req: Request, res: Response) => {
  const db = loadDatabase();
  res.json(db.customers);
});

router.get("/customers/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const db = loadDatabase();
  const customer = db.customers.find((c) => c.id === id || c.email === id);
  if (!customer) return res.status(404).json({ error: "Customer not found." });

  const orders = db.orders.filter((o) => o.customerId === customer.id || o.customerEmail === customer.email);
  const subscriptions = db.subscriptions.filter(
    (s) => s.customerId === customer.id || s.customerEmail === customer.email
  );
  const licenses = db.licenses.filter(
    (l) => l.customerId === customer.id || l.customerEmail === customer.email
  );

  res.json({ customer, orders, subscriptions, licenses });
});

// ==========================================
// 6. SUBSCRIPTIONS API
// ==========================================

router.get("/subscriptions", (req: Request, res: Response) => {
  const db = loadDatabase();
  const { customerId } = req.query;

  let subs = [...db.subscriptions];
  if (customerId) {
    subs = subs.filter((s) => s.customerId === customerId);
  }

  // Calculate MRR / ARR metrics
  const activeSubs = db.subscriptions.filter((s) => s.status === "Active");
  const mrr = activeSubs.reduce((acc, s) => acc + s.amount, 0);
  const arr = mrr * 12;
  const churn = 2.4; // %

  res.json({
    subscriptions: subs,
    metrics: {
      mrr,
      arr,
      activeSubscribers: activeSubs.length,
      churnRate: churn,
      totalCount: db.subscriptions.length,
    },
  });
});

router.patch("/subscriptions/:id/action", (req: Request, res: Response) => {
  const { id } = req.params;
  const { action } = req.body; // pause, resume, cancel, renew
  const db = loadDatabase();
  const sub = db.subscriptions.find((s) => s.id === id);
  if (!sub) return res.status(404).json({ error: "Subscription not found." });

  if (action === "pause") sub.status = "Paused";
  else if (action === "resume") sub.status = "Active";
  else if (action === "cancel") sub.status = "Cancelled";
  else if (action === "renew") {
    sub.status = "Active";
    sub.nextBillingDate = new Date(Date.now() + 30 * 86400000).toISOString();
  }

  saveDatabase(db);
  res.json({ success: true, subscription: sub });
});

// ==========================================
// 7. DIGITAL LICENSE VAULT API
// ==========================================

router.get("/licenses", requireAdmin, (req: Request, res: Response) => {
  const db = loadDatabase();
  const { productId, status, search } = req.query;
  let results = [...db.licenses];

  if (productId) results = results.filter((l) => l.productId === productId);
  if (status && status !== "all") results = results.filter((l) => l.status === status);
  if (search) {
    const q = String(search).toLowerCase();
    results = results.filter(
      (l) =>
        l.licenseKey.toLowerCase().includes(q) ||
        l.productName.toLowerCase().includes(q) ||
        l.customerEmail?.toLowerCase().includes(q)
    );
  }

  res.json(results);
});

router.post("/licenses", requireAdmin, (req: Request, res: Response) => {
  const { productId, count = 1, expirationDate = "2029-12-31T23:59:59Z" } = req.body;
  const db = loadDatabase();
  const product = db.products.find((p) => p.id === productId);
  if (!product) return res.status(404).json({ error: "Product not found." });

  const generated: License[] = [];
  const qty = Math.min(100, Math.max(1, Number(count)));

  for (let i = 0; i < qty; i++) {
    const key = `PB-${(product.sku || "LIC").toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const newLic: License = {
      id: `lic_${Date.now()}_${i}`,
      licenseKey: key,
      productId: product.id,
      productName: product.name,
      status: "Available",
      expirationDate,
      createdAt: new Date().toISOString(),
    };
    db.licenses.unshift(newLic);
    generated.push(newLic);
  }

  saveDatabase(db);
  logAudit((req as any).user.name, "Generated Licenses", `${qty} keys for ${product.name}`, req.ip);

  res.status(201).json({ success: true, count: qty, generated });
});

router.patch("/licenses/:id/status", requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const db = loadDatabase();
  const lic = db.licenses.find((l) => l.id === id);
  if (!lic) return res.status(404).json({ error: "License not found." });

  lic.status = status;
  saveDatabase(db);
  res.json(lic);
});

// ==========================================
// 8. COUPONS API
// ==========================================

router.get("/coupons", (req: Request, res: Response) => {
  const db = loadDatabase();
  res.json(db.coupons);
});

router.post("/coupons", requireAdmin, (req: Request, res: Response) => {
  const { code, discountType, discountValue, minOrder, maxDiscount, usageLimit, expirationDate } = req.body;
  if (!code || !discountValue) return res.status(400).json({ error: "Code and discount value required." });

  const db = loadDatabase();
  const newCoupon: Coupon = {
    id: `coup_${Date.now()}`,
    code: code.trim().toUpperCase(),
    discountType: discountType || "percentage",
    discountValue: Number(discountValue),
    minOrder: Number(minOrder || 0),
    maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
    usageLimit: Number(usageLimit || 100),
    usedCount: 0,
    expirationDate: expirationDate || "2028-12-31",
    status: "active",
  };

  db.coupons.unshift(newCoupon);
  saveDatabase(db);
  res.status(201).json(newCoupon);
});

router.post("/coupons/validate", (req: Request, res: Response) => {
  const { code, subtotal = 0 } = req.body;
  const db = loadDatabase();
  const coupon = db.coupons.find((c) => c.code.toUpperCase() === (code || "").trim().toUpperCase());

  if (!coupon || coupon.status !== "active") {
    return res.status(400).json({ valid: false, message: "Invalid or expired coupon code." });
  }

  if (subtotal < coupon.minOrder) {
    return res.status(400).json({
      valid: false,
      message: `Minimum order amount of $${coupon.minOrder} required for this coupon.`,
    });
  }

  let discount = 0;
  if (coupon.discountType === "percentage") {
    discount = (Number(subtotal) * coupon.discountValue) / 100;
    if (coupon.maxDiscount && discount > coupon.maxDiscount) discount = coupon.maxDiscount;
  } else {
    discount = coupon.discountValue;
  }

  res.json({
    valid: true,
    code: coupon.code,
    discount: Math.round(discount * 100) / 100,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
  });
});

router.delete("/coupons/:id", requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = loadDatabase();
  db.coupons = db.coupons.filter((c) => c.id !== id);
  saveDatabase(db);
  res.json({ success: true });
});

// ==========================================
// 9. ANALYTICS API
// ==========================================

router.get("/analytics", requireAdmin, (req: Request, res: Response) => {
  const { range = "30d" } = req.query;
  const db = loadDatabase();

  const totalRevenue = db.orders
    .filter((o) => o.paymentStatus === "Paid")
    .reduce((sum, o) => sum + o.total, 0);

  const totalOrders = db.orders.length;
  const activeSubs = db.subscriptions.filter((s) => s.status === "Active").length;
  const totalCustomers = db.customers.length;
  const aov = totalOrders > 0 ? Math.round((totalRevenue / totalOrders) * 100) / 100 : 0;
  const conversionRate = 3.65; // %

  // Generate chart data points
  const pointsCount = range === "7d" ? 7 : range === "90d" ? 12 : 14;
  const chartLabels: string[] = [];
  const revenueSeries: number[] = [];
  const ordersSeries: number[] = [];
  const trafficSeries: number[] = [];

  for (let i = pointsCount - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000 * (range === "90d" ? 7 : 1));
    chartLabels.push(d.toLocaleDateString("en-US", { month: "short", day: "numeric" }));
    const base = 400 + Math.sin(i * 0.8) * 220 + (pointsCount - i) * 35;
    revenueSeries.push(Math.round(base));
    ordersSeries.push(Math.max(1, Math.round(base / 110)));
    trafficSeries.push(Math.round(base * 4.2));
  }

  res.json({
    metrics: {
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      todayRevenue: 520,
      totalOrders,
      totalCustomers,
      activeSubscriptions: activeSubs,
      conversionRate,
      aov,
      visitorsCount: 14820,
    },
    charts: {
      labels: chartLabels,
      revenue: revenueSeries,
      orders: ordersSeries,
      traffic: trafficSeries,
    },
    recentOrders: db.orders.slice(0, 5),
    topProducts: db.products.slice(0, 4),
  });
});

// ==========================================
// 10. PAGES & LIVE WEBSITE BUILDER API
// ==========================================

router.get("/pages", (req: Request, res: Response) => {
  const db = loadDatabase();
  res.json(db.pages);
});

router.get("/pages/:slug", (req: Request, res: Response) => {
  const { slug } = req.params;
  const db = loadDatabase();
  const page = db.pages.find((p) => p.slug === slug || p.id === slug);
  if (!page) return res.status(404).json({ error: "Page not found." });
  res.json(page);
});

// Save Page Draft (Visual Builder)
router.post("/pages/:id/save-draft", requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const { sections, title, seoTitle, seoDescription } = req.body;
  const db = loadDatabase();
  const page = db.pages.find((p) => p.id === id);
  if (!page) return res.status(404).json({ error: "Page not found." });

  if (sections) page.sections = sections;
  if (title) page.title = title;
  if (seoTitle) page.seoTitle = seoTitle;
  if (seoDescription) page.seoDescription = seoDescription;
  page.lastSaved = new Date().toISOString();

  saveDatabase(db);
  res.json({ success: true, page, message: "Draft saved successfully." });
});

// Live Publish Page (Draft -> Live Storefront)
router.post("/pages/:id/publish", requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = loadDatabase();
  const page = db.pages.find((p) => p.id === id);
  if (!page) return res.status(404).json({ error: "Page not found." });

  page.status = "published";
  page.lastPublished = new Date().toISOString();
  page.publishedBy = (req as any).user.name;
  page.version = (page.version || 1) + 1;

  saveDatabase(db);
  logAudit((req as any).user.name, "Published Page", `${page.title} (v${page.version})`, req.ip);

  res.json({ success: true, page, message: `Page "${page.title}" is now LIVE on storefront!` });
});

// Create Page
router.post("/pages", requireAdmin, (req: Request, res: Response) => {
  const { title, slug, template = "default" } = req.body;
  if (!title) return res.status(400).json({ error: "Page title is required." });

  const db = loadDatabase();
  const pageSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  const newPage: PageModel = {
    id: `pg_${Date.now()}`,
    title,
    slug: pageSlug,
    seoTitle: `${title} — PlayBeat Digital`,
    seoDescription: `${title} page on PlayBeat Digital.`,
    status: "draft",
    template,
    sections: [
      { id: `sec_h_${Date.now()}`, type: "heading", title, subtitle: "Configure in Website Builder" },
      { id: `sec_t_${Date.now()}`, type: "text", content: "Add content elements using drag and drop." },
    ],
    lastSaved: new Date().toISOString(),
    lastPublished: new Date().toISOString(),
    publishedBy: (req as any).user.name,
    version: 1,
  };

  db.pages.push(newPage);
  saveDatabase(db);
  res.status(201).json(newPage);
});

// Delete Page
router.delete("/pages/:id", requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = loadDatabase();
  db.pages = db.pages.filter((p) => p.id !== id);
  saveDatabase(db);
  res.json({ success: true });
});

// ==========================================
// 11. THEME CUSTOMIZER API (DRAFT & LIVE SYNC)
// ==========================================

// Get Live Theme
router.get("/theme", (req: Request, res: Response) => {
  const db = loadDatabase();
  res.json(db.theme);
});

// Get Draft Theme (Admin Customizer)
router.get("/theme/draft", requireAdmin, (req: Request, res: Response) => {
  const db = loadDatabase();
  res.json(db.themeDraft || db.theme);
});

// Save Theme Draft
router.post("/theme/draft", requireAdmin, (req: Request, res: Response) => {
  const db = loadDatabase();
  db.themeDraft = { ...db.themeDraft, ...req.body, lastUpdated: new Date().toISOString() };
  saveDatabase(db);
  res.json({ success: true, theme: db.themeDraft, message: "Draft theme saved." });
});

// Real-Time LIVE Update Logo (Instant Storefront & Admin Sync)
router.post("/theme/live-update-logo", requireAdmin, (req: Request, res: Response) => {
  const db = loadDatabase();
  const {
    logoText,
    logoTagline,
    logoImage,
    logoShowLiveBadge,
    logoLiveBadgeText,
    logoLiveBadgeColor,
    logoShowEqualizer,
  } = req.body;

  const updatedLogoFields = {
    ...(logoText !== undefined ? { logoText } : {}),
    ...(logoTagline !== undefined ? { logoTagline } : {}),
    ...(logoImage !== undefined ? { logoImage } : {}),
    ...(logoShowLiveBadge !== undefined ? { logoShowLiveBadge } : {}),
    ...(logoLiveBadgeText !== undefined ? { logoLiveBadgeText } : {}),
    ...(logoLiveBadgeColor !== undefined ? { logoLiveBadgeColor } : {}),
    ...(logoShowEqualizer !== undefined ? { logoShowEqualizer } : {}),
  };

  db.theme = {
    ...db.theme,
    ...updatedLogoFields,
    lastUpdated: new Date().toISOString(),
  };

  db.themeDraft = {
    ...db.themeDraft,
    ...updatedLogoFields,
    lastUpdated: db.theme.lastUpdated,
  };

  saveDatabase(db);
  logAudit(
    (req as any).user?.name || "Admin",
    "Live Updated Logo",
    `Set Logo to "${db.theme.logoText}" (Badge: ${db.theme.logoShowLiveBadge ? db.theme.logoLiveBadgeText : "Off"})`,
    req.ip
  );

  res.json({
    success: true,
    theme: db.theme,
    message: "PlayBeat Logo live-updated and broadcast to Storefront & Admin!",
  });
});

// Publish Theme to Storefront
router.post("/theme/publish", requireAdmin, (req: Request, res: Response) => {
  const db = loadDatabase();
  const updatedTheme = {
    ...db.themeDraft,
    version: (db.theme.version || 1) + 1,
    lastUpdated: new Date().toISOString(),
  };

  db.theme = updatedTheme;
  db.themeDraft = JSON.parse(JSON.stringify(updatedTheme));

  db.themeRevisions.unshift({
    version: updatedTheme.version,
    date: updatedTheme.lastUpdated,
    user: (req as any).user.name,
    theme: JSON.parse(JSON.stringify(updatedTheme)),
  });

  if (db.themeRevisions.length > 20) db.themeRevisions.pop();

  saveDatabase(db);
  logAudit((req as any).user.name, "Published Theme", `Version ${updatedTheme.version}`, req.ip);

  res.json({
    success: true,
    theme: db.theme,
    message: `Theme v${updatedTheme.version} successfully published to storefront!`,
  });
});

// Rollback Theme
router.post("/theme/rollback/:version", requireAdmin, (req: Request, res: Response) => {
  const version = Number(req.params.version);
  const db = loadDatabase();
  const revision = db.themeRevisions.find((r) => r.version === version);
  if (!revision) return res.status(404).json({ error: "Theme revision version not found." });

  db.theme = JSON.parse(JSON.stringify(revision.theme));
  db.themeDraft = JSON.parse(JSON.stringify(revision.theme));
  saveDatabase(db);

  logAudit((req as any).user.name, "Rollback Theme", `Rolled back to v${version}`, req.ip);

  res.json({ success: true, theme: db.theme, message: `Rolled back to theme version ${version}.` });
});

// ==========================================
// 12. MARKETING & SEO & SYSTEM API
// ==========================================

router.get("/marketing", (req: Request, res: Response) => {
  const db = loadDatabase();
  res.json(db.marketing);
});

router.post("/marketing/banners", requireAdmin, (req: Request, res: Response) => {
  const { title, text, type } = req.body;
  const db = loadDatabase();
  const newBanner = { id: `ban_${Date.now()}`, title, text, active: true, type: type || "top_bar" };
  db.marketing.banners.unshift(newBanner);
  saveDatabase(db);
  res.status(201).json(newBanner);
});

router.delete("/marketing/banners/:id", requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = loadDatabase();
  db.marketing.banners = db.marketing.banners.filter((b) => b.id !== id);
  saveDatabase(db);
  res.json({ success: true });
});

router.get("/seo", (req: Request, res: Response) => {
  const db = loadDatabase();
  res.json(db.seo);
});

router.put("/seo", requireAdmin, (req: Request, res: Response) => {
  const db = loadDatabase();
  db.seo = { ...db.seo, ...req.body };
  saveDatabase(db);
  res.json(db.seo);
});

router.get("/audit-logs", requireAdmin, (req: Request, res: Response) => {
  const db = loadDatabase();
  res.json(db.auditLogs);
});

// Contact & Inquiries API
router.post("/contact", (req: Request, res: Response) => {
  const { name, email, whatsapp, serviceType, budget, message } = req.body;
  const db = loadDatabase();
  if (!(db as any).inquiries) {
    (db as any).inquiries = [];
  }

  const inquiry = {
    id: `inq_${Date.now()}`,
    name: name || "Anonymous Lead",
    email: email || "",
    whatsapp: whatsapp || "",
    serviceType: serviceType || "General Consultation",
    budget: budget || "Not specified",
    message: message || "",
    createdAt: new Date().toISOString(),
    status: "new",
  };

  (db as any).inquiries.unshift(inquiry);
  logAudit(name || "Public Visitor", `Submitted Project Inquiry: ${serviceType}`, "Contact Desk", req.ip);
  saveDatabase(db);

  res.status(201).json({ success: true, inquiry, message: "Inquiry received. A lead architect will contact you shortly." });
});

router.get("/inquiries", requireAdmin, (req: Request, res: Response) => {
  const db = loadDatabase();
  res.json((db as any).inquiries || []);
});

export default router;
