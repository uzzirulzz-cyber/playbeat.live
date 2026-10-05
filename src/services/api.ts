import {
  Product,
  Category,
  Order,
  Customer,
  Subscription,
  License,
  Coupon,
  PageModel,
  ThemeSettings,
  User,
} from "../types";

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`/api${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || data.message || "An error occurred during API request");
  }
  return data as T;
}

export const api = {
  // Auth
  adminLogin: (username: string, password: string) =>
    request<{ token: string; user: User }>("/auth/admin-login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),

  customerLogin: (email: string, password: string) =>
    request<{ token: string; user: User }>("/auth/customer-login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (name: string, email: string, password: string, phone?: string) =>
    request<{ token: string; user: User }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, phone }),
    }),

  googleSignIn: (idToken?: string, mockUser?: any) =>
    request<{ success: boolean; token: string; user: User }>("/auth/google-signin", {
      method: "POST",
      body: JSON.stringify({ idToken, mockUser }),
    }),

  getMe: () => request<{ user: User | null }>("/auth/me"),
  logout: () => request<{ success: boolean }>("/auth/logout", { method: "POST" }),
  forgotPassword: (email: string) =>
    request<{ success: boolean; message: string }>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  // Products
  getProducts: (params: Record<string, any> = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") qs.append(k, String(v));
    });
    return request<Product[]>(`/products?${qs.toString()}`);
  },

  getProduct: (idOrSlug: string) =>
    request<{ product: Product; related: Product[] }>(`/products/${idOrSlug}`),

  createProduct: (data: Partial<Product>) =>
    request<Product>("/products", { method: "POST", body: JSON.stringify(data) }),

  updateProduct: (id: string, data: Partial<Product>) =>
    request<Product>(`/products/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  duplicateProduct: (id: string) =>
    request<Product>(`/products/${id}/duplicate`, { method: "POST" }),

  deleteProduct: (id: string) =>
    request<{ success: boolean }>(`/products/${id}`, { method: "DELETE" }),

  toggleProductStatus: (id: string) =>
    request<{ success: boolean; status: string }>(`/products/${id}/status`, { method: "PATCH" }),

  // Categories
  getCategories: () => request<Category[]>("/categories"),
  createCategory: (data: Partial<Category>) =>
    request<Category>("/categories", { method: "POST", body: JSON.stringify(data) }),
  updateCategory: (id: string, data: Partial<Category>) =>
    request<Category>(`/categories/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteCategory: (id: string) =>
    request<{ success: boolean }>(`/categories/${id}`, { method: "DELETE" }),

  // Orders & Checkout
  getOrders: (params: Record<string, any> = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v) qs.append(k, String(v));
    });
    return request<Order[]>(`/orders?${qs.toString()}`);
  },

  getOrder: (id: string) => request<Order>(`/orders/${id}`),

  createOrder: (payload: {
    customer: { name: string; email: string; phone?: string; id?: string };
    items: { productId: string; quantity: number; price?: number; name?: string }[];
    couponCode?: string;
    paymentMethod: string;
    notes?: string;
    billingAddress?: string;
  }) =>
    request<{ success: boolean; order: Order; assignedLicenses: License[] }>("/orders", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateOrderStatus: (id: string, payload: { status?: string; paymentStatus?: string; note?: string }) =>
    request<Order>(`/orders/${id}/status`, { method: "PATCH", body: JSON.stringify(payload) }),

  // Customers
  getCustomers: () => request<Customer[]>("/customers"),
  getCustomerProfile: (id: string) =>
    request<{
      customer: Customer;
      orders: Order[];
      subscriptions: Subscription[];
      licenses: License[];
    }>(`/customers/${id}`),

  // Subscriptions
  getSubscriptions: (customerId?: string) =>
    request<{
      subscriptions: Subscription[];
      metrics: {
        mrr: number;
        arr: number;
        activeSubscribers: number;
        churnRate: number;
        totalCount: number;
      };
    }>(`/subscriptions${customerId ? `?customerId=${customerId}` : ""}`),

  updateSubscriptionAction: (id: string, action: string) =>
    request<{ success: boolean; subscription: Subscription }>(`/subscriptions/${id}/action`, {
      method: "PATCH",
      body: JSON.stringify({ action }),
    }),

  // License Vault
  getLicenses: (params: Record<string, any> = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v) qs.append(k, String(v));
    });
    return request<License[]>(`/licenses?${qs.toString()}`);
  },

  generateLicenses: (productId: string, count: number, expirationDate?: string) =>
    request<{ success: boolean; count: number; generated: License[] }>("/licenses", {
      method: "POST",
      body: JSON.stringify({ productId, count, expirationDate }),
    }),

  updateLicenseStatus: (id: string, status: string) =>
    request<License>(`/licenses/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),

  // Coupons
  getCoupons: () => request<Coupon[]>("/coupons"),
  createCoupon: (data: Partial<Coupon>) =>
    request<Coupon>("/coupons", { method: "POST", body: JSON.stringify(data) }),
  validateCoupon: (code: string, subtotal: number) =>
    request<{
      valid: boolean;
      code: string;
      discount: number;
      discountType: string;
      discountValue: number;
      message?: string;
    }>("/coupons/validate", {
      method: "POST",
      body: JSON.stringify({ code, subtotal }),
    }),
  deleteCoupon: (id: string) => request<{ success: boolean }>(`/coupons/${id}`, { method: "DELETE" }),

  // Analytics
  getAnalytics: (range: string = "30d") =>
    request<{
      metrics: {
        totalRevenue: number;
        todayRevenue: number;
        totalOrders: number;
        totalCustomers: number;
        activeSubscriptions: number;
        conversionRate: number;
        aov: number;
        visitorsCount: number;
      };
      charts: {
        labels: string[];
        revenue: number[];
        orders: number[];
        traffic: number[];
      };
      recentOrders: Order[];
      topProducts: Product[];
    }>(`/analytics?range=${range}`),

  // Pages & Visual Builder
  getPages: () => request<PageModel[]>("/pages"),
  getPage: (slug: string) => request<PageModel>(`/pages/${slug}`),
  savePageDraft: (id: string, data: Partial<PageModel>) =>
    request<{ success: boolean; page: PageModel; message: string }>(`/pages/${id}/save-draft`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  publishPage: (id: string) =>
    request<{ success: boolean; page: PageModel; message: string }>(`/pages/${id}/publish`, {
      method: "POST",
    }),
  createPage: (title: string, slug?: string) =>
    request<PageModel>("/pages", { method: "POST", body: JSON.stringify({ title, slug }) }),
  deletePage: (id: string) => request<{ success: boolean }>(`/pages/${id}`, { method: "DELETE" }),

  // Theme Customizer
  getTheme: () => request<ThemeSettings>("/theme"),
  getThemeDraft: () => request<ThemeSettings>("/theme/draft"),
  saveThemeDraft: (theme: Partial<ThemeSettings>) =>
    request<{ success: boolean; theme: ThemeSettings; message: string }>("/theme/draft", {
      method: "POST",
      body: JSON.stringify(theme),
    }),
  liveUpdateLogo: (logoData: {
    logoText?: string;
    logoTagline?: string;
    logoImage?: string;
    logoShowLiveBadge?: boolean;
    logoLiveBadgeText?: string;
    logoLiveBadgeColor?: "green" | "cyan" | "orange" | "purple";
    logoShowEqualizer?: boolean;
  }) =>
    request<{ success: boolean; theme: ThemeSettings; message: string }>("/theme/live-update-logo", {
      method: "POST",
      body: JSON.stringify(logoData),
    }),
  publishTheme: () =>
    request<{ success: boolean; theme: ThemeSettings; message: string }>("/theme/publish", {
      method: "POST",
    }),
  rollbackTheme: (version: number) =>
    request<{ success: boolean; theme: ThemeSettings; message: string }>(`/theme/rollback/${version}`, {
      method: "POST",
    }),

  // Marketing & System
  getMarketing: () => request<any>("/marketing"),
  createBanner: (data: { title: string; text: string; type?: string }) =>
    request<any>("/marketing/banners", { method: "POST", body: JSON.stringify(data) }),
  deleteBanner: (id: string) => request<any>(`/marketing/banners/${id}`, { method: "DELETE" }),
  getSEO: () => request<any>("/seo"),
  updateSEO: (data: any) => request<any>("/seo", { method: "PUT", body: JSON.stringify(data) }),
  getAuditLogs: () => request<any[]>("/audit-logs"),

  // Contact Desk
  submitContact: (data: {
    name: string;
    email: string;
    whatsapp?: string;
    serviceType: string;
    budget?: string;
    message: string;
  }) => request<{ success: boolean; inquiry: any; message: string }>("/contact", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  getInquiries: () => request<any[]>("/inquiries"),
};
