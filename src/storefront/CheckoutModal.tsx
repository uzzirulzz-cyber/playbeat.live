import React, { useState } from "react";
import { useStore } from "../context/StoreContext";
import { api } from "../services/api";
import { Order, License } from "../types";

export const CheckoutModal: React.FC = () => {
  const {
    cart,
    clearCart,
    cartSubtotal,
    appliedCoupon,
    isCheckoutOpen,
    setIsCheckoutOpen,
    user,
    showToast,
  } = useStore();

  const [customerName, setCustomerName] = useState(user?.name || "");
  const [customerEmail, setCustomerEmail] = useState(user?.email || "");
  const [customerPhone, setCustomerPhone] = useState(user?.phone || "");
  const [billingAddress, setBillingAddress] = useState("100 Technology Center, Austin, TX 78701");
  const [paymentMethod, setPaymentMethod] = useState<"Credit Card" | "Stripe" | "PayPal" | "Crypto">("Credit Card");
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [loading, setLoading] = useState(false);
  const [orderCompleteData, setOrderCompleteData] = useState<{ order: Order; licenses: License[] } | null>(null);

  if (!isCheckoutOpen) return null;

  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const finalTotal = Math.max(0, Math.round((cartSubtotal - discountAmount) * 100) / 100);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail) {
      showToast("Please provide your name and email.");
      return;
    }
    if (!termsAccepted) {
      showToast("Please accept the terms of service to proceed.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        customer: {
          id: user?.id,
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
        },
        items: cart.map((it) => ({
          productId: it.product.id,
          name: it.product.name,
          price: it.product.price,
          quantity: it.quantity,
        })),
        couponCode: appliedCoupon?.code,
        paymentMethod,
        billingAddress,
      };

      const res = await api.createOrder(payload);
      setOrderCompleteData({ order: res.order, licenses: res.assignedLicenses });
      clearCart();
      showToast(`Order ${res.order.orderNumber} successfully processed!`);
    } catch (err: any) {
      showToast(err.message || "Failed to process order.");
    } finally {
      setLoading(false);
    }
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    showToast("License key copied!");
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1060 }}>
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content border-0 shadow-2xl rounded-4 overflow-hidden">
          {/* Header */}
          <div className="modal-header border-bottom py-3 px-4 bg-light">
            <h5 className="modal-title fw-extrabold text-dark fs-6 d-flex align-items-center gap-2 mb-0">
              <i className="bi bi-shield-check text-success fs-5"></i>
              {orderCompleteData ? "Order Confirmed & License Allocated" : "Secure Checkout & License Vault"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => {
                setIsCheckoutOpen(false);
                setOrderCompleteData(null);
              }}
            ></button>
          </div>

          <div className="modal-body p-4 p-lg-5">
            {orderCompleteData ? (
              /* Success Confirmation Screen */
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-circle bg-success-subtle text-success mx-auto d-flex align-items-center justify-content-center shadow-sm">
                  <i className="bi bi-check-lg fs-1"></i>
                </div>

                <div>
                  <h4 className="fw-extrabold text-dark">Thank You for Your Order!</h4>
                  <p className="text-muted small">
                    Order Ref: <strong className="text-dark font-mono">{orderCompleteData.order.orderNumber}</strong> · Receipt sent to{" "}
                    <strong>{orderCompleteData.order.customerEmail}</strong>
                  </p>
                </div>

                {/* License Keys Vault Box */}
                {orderCompleteData.licenses && orderCompleteData.licenses.length > 0 && (
                  <div className="card p-4 border rounded-3 bg-light text-start shadow-sm space-y-3">
                    <div className="d-flex align-items-center justify-content-between">
                      <span className="fw-bold text-dark text-xs uppercase tracking-wider">
                        Allocated Cryptographic License Keys
                      </span>
                      <span className="badge bg-success">Verified</span>
                    </div>

                    <div className="space-y-2">
                      {orderCompleteData.licenses.map((lic) => (
                        <div
                          key={lic.id}
                          className="p-3 bg-white border rounded-2 d-flex flex-wrap align-items-center justify-content-between gap-2"
                        >
                          <div>
                            <span className="fw-bold text-dark text-xs d-block">{lic.productName}</span>
                            <code className="text-primary font-mono fw-bold fs-6">{lic.licenseKey}</code>
                          </div>
                          <button
                            onClick={() => copyKey(lic.licenseKey)}
                            className="btn btn-outline-dark btn-sm rounded-pill text-xs px-3"
                          >
                            <i className="bi bi-copy me-1"></i> Copy Key
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-3 d-flex justify-content-center gap-3">
                  <button
                    onClick={() => {
                      setIsCheckoutOpen(false);
                      setOrderCompleteData(null);
                    }}
                    className="btn btn-dark rounded-pill px-4 fw-bold text-xs"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              /* Checkout Form */
              <form onSubmit={handlePlaceOrder}>
                <div className="row g-4">
                  {/* Left: Customer & Payment */}
                  <div className="col-12 col-md-7 space-y-4">
                    <div>
                      <h6 className="fw-bold text-dark mb-3 text-xs uppercase tracking-wider">
                        1. Customer Information
                      </h6>
                      <div className="row g-2">
                        <div className="col-12">
                          <label className="form-label text-xs fw-semibold text-secondary">Full Name *</label>
                          <input
                            type="text"
                            required
                            className="form-control form-control-sm"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                          />
                        </div>
                        <div className="col-12 col-sm-6">
                          <label className="form-label text-xs fw-semibold text-secondary">Email Address *</label>
                          <input
                            type="email"
                            required
                            className="form-control form-control-sm"
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                          />
                        </div>
                        <div className="col-12 col-sm-6">
                          <label className="form-label text-xs fw-semibold text-secondary">Phone Number</label>
                          <input
                            type="tel"
                            className="form-control form-control-sm"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h6 className="fw-bold text-dark mb-3 text-xs uppercase tracking-wider">
                        2. Payment Method
                      </h6>
                      <div className="row g-2">
                        {[
                          { id: "Credit Card", label: "Credit / Debit Card", icon: "bi-credit-card" },
                          { id: "Stripe", label: "Stripe Checkout", icon: "bi-stripe" },
                          { id: "PayPal", label: "PayPal Express", icon: "bi-paypal" },
                          { id: "Crypto", label: "Crypto (USDC / BTC)", icon: "bi-currency-bitcoin" },
                        ].map((m) => (
                          <div key={m.id} className="col-6">
                            <label
                              className={`p-2.5 border rounded-3 d-flex align-items-center gap-2 cursor-pointer w-100 ${
                                paymentMethod === m.id
                                  ? "border-primary bg-primary-subtle bg-opacity-25 text-primary fw-bold"
                                  : "bg-light text-secondary"
                              }`}
                            >
                              <input
                                type="radio"
                                name="payMethod"
                                checked={paymentMethod === m.id}
                                onChange={() => setPaymentMethod(m.id as any)}
                                className="form-check-input mt-0"
                              />
                              <i className={`bi ${m.icon} fs-6`}></i>
                              <span className="small">{m.label}</span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="form-check">
                      <input
                        type="checkbox"
                        required
                        className="form-check-input"
                        id="termsCheck"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                      />
                      <label className="form-check-label text-xs text-muted" htmlFor="termsCheck">
                        I accept the Commercial Software Licensing Agreement & Digital Refund Policy.
                      </label>
                    </div>
                  </div>

                  {/* Right: Order Summary */}
                  <div className="col-12 col-md-5">
                    <div className="card p-3.5 border rounded-3 bg-light space-y-3">
                      <h6 className="fw-bold text-dark text-xs uppercase tracking-wider mb-2">Order Summary</h6>

                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {cart.map((it) => (
                          <div key={it.product.id} className="d-flex justify-content-between text-xs">
                            <span className="text-truncate" style={{ maxWidth: "160px" }}>
                              {it.product.name} × {it.quantity}
                            </span>
                            <b className="text-dark">${it.product.price * it.quantity}</b>
                          </div>
                        ))}
                      </div>

                      <hr className="my-2" />

                      <div className="space-y-1.5 text-xs text-muted">
                        <div className="d-flex justify-content-between">
                          <span>Subtotal</span>
                          <span className="text-dark font-medium">${cartSubtotal}</span>
                        </div>
                        {appliedCoupon && (
                          <div className="d-flex justify-content-between text-success">
                            <span>Coupon: {appliedCoupon.code}</span>
                            <span>-${discountAmount}</span>
                          </div>
                        )}
                        <div className="d-flex justify-content-between text-dark fw-extrabold fs-6 pt-1 border-top">
                          <span>Total</span>
                          <span className="text-primary">${finalTotal}</span>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading || cart.length === 0}
                        className="btn btn-primary btn-lg w-100 rounded-pill fw-bold text-sm py-2.5 shadow-sm mt-3"
                      >
                        {loading ? "Processing..." : `Authorize & Place Order ($${finalTotal})`}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
