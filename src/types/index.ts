export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription: string;
  images: string[];
  price: number;
  comparePrice?: number;
  category: string;
  tags: string[];
  status: "published" | "draft";
  productType: "digital" | "subscription" | "service" | "physical";
  pricingInterval: "one-time" | "monthly" | "quarterly" | "yearly";
  subscriptionDurationMonths?: number;
  rating: number;
  reviewsCount: number;
  badge?: string;
  features: string[];
  licenseAvailableCount?: number;
  downloadUrl?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image: string;
  count?: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  licenseKey?: string;
  productType: string;
  image?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  total: number;
  paymentMethod: "Credit Card" | "Stripe" | "PayPal" | "Bank Transfer" | "Crypto";
  paymentStatus: "Paid" | "Pending" | "Processing" | "Refunded" | "Failed";
  status: "Pending" | "Paid" | "Processing" | "Completed" | "Cancelled" | "Refunded";
  fulfillmentStatus: "Fulfilled" | "Unfulfilled";
  timeline: { time: string; note: string }[];
  notes?: string;
  shippingAddress?: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalSpent: number;
  ordersCount: number;
  subscriptionsCount: number;
  status: "Active" | "Inactive";
  createdDate: string;
  address?: string;
}

export interface Subscription {
  id: string;
  subscriptionNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  productId: string;
  productName: string;
  planPeriod: "1 Month" | "3 Months" | "6 Months" | "12 Months";
  amount: number;
  status: "Active" | "Trial" | "Cancelled" | "Expired" | "Paused";
  nextBillingDate: string;
  startDate: string;
  autoRenew: boolean;
}

export interface License {
  id: string;
  licenseKey: string;
  productId: string;
  productName: string;
  customerId?: string;
  customerEmail?: string;
  orderId?: string;
  status: "Available" | "Assigned" | "Used" | "Expired" | "Revoked";
  expirationDate: string;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: "percentage" | "fixed" | "subscription";
  discountValue: number;
  minOrder: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  expirationDate: string;
  status: "active" | "expired" | "disabled";
}

export interface PageSection {
  id: string;
  type: string;
  title?: string;
  subtitle?: string;
  content?: string;
  styles?: Record<string, any>;
  settings?: Record<string, any>;
}

export interface PageModel {
  id: string;
  title: string;
  slug: string;
  seoTitle: string;
  seoDescription: string;
  status: "published" | "draft";
  template: string;
  sections: PageSection[];
  lastSaved: string;
  lastPublished: string;
  publishedBy: string;
  version: number;
}

export interface ThemeSettings {
  logoText: string;
  logoTagline?: string;
  logoImage?: string;
  logoShowLiveBadge?: boolean;
  logoLiveBadgeText?: string;
  logoLiveBadgeColor?: "green" | "cyan" | "orange" | "purple";
  logoShowEqualizer?: boolean;
  primaryColor: string;
  secondaryColor: string;
  darkColor: string;
  lightColor: string;
  fontFamily: string;
  borderRadius: string;
  containerWidth: string;
  header: {
    announcementBanner: string;
    announcementLink: string;
    showAnnouncement: boolean;
    navLinks: { label: string; href: string; badge?: string }[];
    showSearch: boolean;
    showCart: boolean;
    showAccount: boolean;
    ctaButton: { text: string; link: string };
  };
  footer: {
    aboutText: string;
    newsletterTitle: string;
    copyright: string;
    socials: { twitter?: string; github?: string; discord?: string; linkedin?: string };
  };
  version: number;
  lastUpdated: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Admin" | "Editor" | "Customer";
  avatar?: string;
  phone?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedInterval?: string;
}
