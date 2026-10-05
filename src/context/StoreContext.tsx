import React, { createContext, useContext, useState, useEffect } from "react";
import { User, CartItem, Product, ThemeSettings, Order, License } from "../types";
import { api } from "../services/api";

interface StoreContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  adminUser: User | null;
  setAdminUser: (user: User | null) => void;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, interval?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  appliedCoupon: { code: string; discount: number; discountType: string; discountValue: number } | null;
  setAppliedCoupon: (coupon: any) => void;
  theme: ThemeSettings | null;
  setTheme: React.Dispatch<React.SetStateAction<ThemeSettings | null>>;
  refreshTheme: () => Promise<void>;
  // Modals & Drawers
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isAuthOpen: boolean;
  setIsAuthOpen: (open: boolean) => void;
  authMode: "login" | "register";
  setAuthMode: (mode: "login" | "register") => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isAccountOpen: boolean;
  setIsAccountOpen: (open: boolean) => void;
  viewingProduct: Product | null;
  setViewingProduct: (product: Product | null) => void;
  recentOrder: { order: Order; licenses: License[] } | null;
  setRecentOrder: (orderData: { order: Order; licenses: License[] } | null) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  navigate: (route: string) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<ThemeSettings | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);

  // Cart state persisted to localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem("pb_cart");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [recentOrder, setRecentOrder] = useState<{ order: Order; licenses: License[] } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("pb_cart", JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Initial Load: Theme and Auth Me
  useEffect(() => {
    refreshTheme();
    checkAuth();
  }, []);

  const refreshTheme = async () => {
    try {
      const t = await api.getTheme();
      setTheme(t);
    } catch (e) {
      console.error("Failed to load theme:", e);
    }
  };

  const checkAuth = async () => {
    try {
      const res = await api.getMe();
      if (res.user) {
        if (res.user.role === "Customer") {
          setUser(res.user);
        } else {
          setAdminUser(res.user);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 3200);
  };

  const addToCart = (product: Product, quantity: number = 1, interval?: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, selectedInterval: interval || product.pricingInterval }];
    });
    showToast(`Added "${product.name}" to cart`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart((prev) =>
        prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
      );
    }
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = Math.round(
    cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0) * 100
  ) / 100;

  const navigate = (route: string) => {
    window.location.hash = route.startsWith("#") ? route : `#${route}`;
  };

  return (
    <StoreContext.Provider
      value={{
        user,
        setUser,
        adminUser,
        setAdminUser,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        appliedCoupon,
        setAppliedCoupon,
        theme,
        setTheme,
        refreshTheme,
        isCartOpen,
        setIsCartOpen,
        isAuthOpen,
        setIsAuthOpen,
        authMode,
        setAuthMode,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isAccountOpen,
        setIsAccountOpen,
        viewingProduct,
        setViewingProduct,
        recentOrder,
        setRecentOrder,
        toastMessage,
        showToast,
        navigate,
      }}
    >
      {children}

      {/* Global floating toast notification */}
      {toastMessage && (
        <div
          className="position-fixed bottom-0 start-50 translate-middle-x mb-4 px-4 py-3 bg-dark text-white rounded-3 shadow-lg z-3 border border-secondary"
          style={{ minWidth: "280px", maxWidth: "90vw", animation: "fadeIn 0.2s" }}
        >
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-check-circle-fill text-success fs-5"></i>
            <span className="small fw-semibold">{toastMessage}</span>
          </div>
        </div>
      )}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};
