import React, { useState } from "react";
import { useStore } from "../context/StoreContext";
import { api } from "../services/api";

export const CartDrawer: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    isCartOpen,
    setIsCartOpen,
    appliedCoupon,
    setAppliedCoupon,
    setIsCheckoutOpen,
    showToast,
  } = useStore();

  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    if (!couponInput.trim()) return;

    setCouponLoading(true);
    try {
      const res = await api.validateCoupon(couponInput.trim(), cartSubtotal);
      if (res.valid) {
        setAppliedCoupon({
          code: res.code,
          discount: res.discount,
          discountType: res.discountType,
          discountValue: res.discountValue,
        });
        showToast(`Coupon "${res.code}" applied: -$${res.discount}`);
        setCouponInput("");
      }
    } catch (err: any) {
      setCouponError(err.message || "Invalid coupon code.");
    } finally {
      setCouponLoading(false);
    }
  };

  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const finalTotal = Math.max(0, Math.round((cartSubtotal - discountAmount) * 100) / 100);

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div
      className="position-fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-xs d-flex justify-content-end"
      onClick={() => setIsCartOpen(false)}
    >
      <div
        className="bg-white h-100 shadow-2xl d-flex flex-column"
        style={{ width: "420px", maxWidth: "100vw", animation: "slideLeft 0.3s ease" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-bottom d-flex align-items-center justify-content-between shrink-0">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-bag-check fs-5 text-primary"></i>
            <h5 className="fw-extrabold text-dark mb-0 fs-6">Your Shopping Cart</h5>
            <span className="badge bg-light text-dark border rounded-pill text-xs">
              {cart.length}
            </span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="btn btn-sm btn-light border-0 text-muted p-1"
          >
            <i className="bi bi-x-lg fs-6"></i>
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-grow-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-cart-x fs-1 opacity-50 d-block mb-3"></i>
              <h6 className="fw-bold text-dark">Your cart is empty</h6>
              <p className="small mb-4">Explore our catalog to add digital software and tools.</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="btn btn-outline-dark btn-sm rounded-pill px-4 fw-semibold"
              >
                Browse Products
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product.id}
                className="p-3 border rounded-3 bg-light d-flex gap-3 align-items-center"
              >
                <img
                  src={
                    item.product.images?.[0] ||
                    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80"
                  }
                  alt={item.product.name}
                  className="rounded-2 border object-cover shrink-0"
                  style={{ width: "54px", height: "54px" }}
                />

                <div className="flex-grow-1 overflow-hidden">
                  <div className="fw-bold text-dark text-xs text-truncate">
                    {item.product.name}
                  </div>
                  <div className="text-muted text-[11px] mb-1.5">
                    ${item.product.price} · {item.selectedInterval || item.product.pricingInterval}
                  </div>

                  {/* Quantity Controller */}
                  <div className="d-flex align-items-center gap-2">
                    <div className="d-flex align-items-center border rounded-pill bg-white px-1">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="btn btn-sm btn-link p-0 text-dark text-decoration-none fw-bold px-1.5"
                        style={{ fontSize: "11px" }}
                      >
                        -
                      </button>
                      <span className="small fw-bold px-1.5">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="btn btn-sm btn-link p-0 text-dark text-decoration-none fw-bold px-1.5"
                        style={{ fontSize: "11px" }}
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="btn btn-sm btn-link text-danger p-0 text-[11px] text-decoration-none ms-auto"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="text-end">
                  <b className="text-dark fs-6">${item.product.price * item.quantity}</b>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout Action */}
        {cart.length > 0 && (
          <div className="p-4 border-top bg-white space-y-3 shrink-0 shadow-lg">
            {/* Coupon Code Input */}
            <form onSubmit={handleApplyCoupon} className="space-y-1">
              <div className="input-group input-group-sm">
                <input
                  type="text"
                  placeholder="Coupon code (e.g. SPRING50)"
                  className="form-control font-mono uppercase"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                />
                <button
                  type="submit"
                  disabled={couponLoading || !couponInput}
                  className="btn btn-dark fw-semibold"
                >
                  {couponLoading ? "..." : "Apply"}
                </button>
              </div>
              {couponError && <div className="text-danger text-[11px] fw-medium">{couponError}</div>}
              {appliedCoupon && (
                <div className="d-flex justify-content-between align-items-center text-xs text-success pt-1">
                  <span>
                    <i className="bi bi-tag-fill me-1"></i> Coupon {appliedCoupon.code}
                  </span>
                  <button
                    type="button"
                    onClick={() => setAppliedCoupon(null)}
                    className="btn btn-link btn-sm p-0 text-danger text-[11px] text-decoration-none"
                  >
                    Remove
                  </button>
                </div>
              )}
            </form>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-muted pt-2 border-top">
              <div className="d-flex justify-content-between">
                <span>Subtotal</span>
                <span className="text-dark font-medium">${cartSubtotal}</span>
              </div>
              {appliedCoupon && (
                <div className="d-flex justify-content-between text-success">
                  <span>Discount</span>
                  <span>-${discountAmount}</span>
                </div>
              )}
              <div className="d-flex justify-content-between text-dark fw-extrabold fs-6 pt-1 border-top">
                <span>Total Due</span>
                <span className="text-primary">${finalTotal}</span>
              </div>
            </div>

            <button
              onClick={handleProceedCheckout}
              className="btn btn-primary btn-lg w-100 rounded-pill fw-bold text-sm py-2.5 shadow-sm d-flex align-items-center justify-content-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <i className="bi bi-arrow-right"></i>
            </button>

            <button
              onClick={() => setIsCartOpen(false)}
              className="btn btn-link w-100 text-muted small text-decoration-none py-0"
            >
              Continue Browsing
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
