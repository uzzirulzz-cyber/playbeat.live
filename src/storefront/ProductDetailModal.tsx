import React, { useState } from "react";
import { Product } from "../types";
import { useStore } from "../context/StoreContext";

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart, setIsCheckoutOpen, showToast } = useStore();
  const [selectedImage, setSelectedImage] = useState(product.images?.[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"features" | "reviews" | "faq">("features");

  // Review Form State
  const [reviewName, setReviewName] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewsList, setReviewsList] = useState([
    {
      author: "Alexandre Moreau",
      role: "CTO, Horizon Infrastructure",
      rating: 5,
      date: "3 days ago",
      text: "The integration took less than 20 minutes in our microservices cluster. The autonomous agent logic runs flawlessly without token leaks.",
    },
    {
      author: "Elena Rostova",
      role: "Lead Security Auditor",
      rating: 5,
      date: "1 week ago",
      text: "Zero-knowledge encryption keys were delivered and cryptographically verified in our vault. Top tier software quality.",
    },
  ]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    onClose();
    setIsCheckoutOpen(true);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;
    setReviewsList([
      {
        author: reviewName,
        role: "Verified Purchaser",
        rating: reviewRating,
        date: "Just now",
        text: reviewComment,
      },
      ...reviewsList,
    ]);
    setReviewName("");
    setReviewComment("");
    showToast("Thank you! Your verified review has been submitted.");
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1060 }}>
      <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content border-0 shadow-2xl rounded-4 overflow-hidden">
          {/* Header */}
          <div className="modal-header border-bottom py-3 px-4 bg-light">
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-primary text-white rounded-pill text-xs">
                {product.productType.toUpperCase()}
              </span>
              <span className="text-muted text-xs font-mono">{product.sku}</span>
            </div>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body p-4 p-lg-5">
            <div className="row g-5">
              {/* Left Column: Image Gallery */}
              <div className="col-12 col-lg-6">
                <div className="rounded-4 overflow-hidden border bg-light mb-3" style={{ height: "360px" }}>
                  <img
                    src={selectedImage || product.images?.[0]}
                    alt={product.name}
                    className="w-100 h-100 object-cover"
                  />
                </div>

                {/* Thumbnails */}
                {product.images && product.images.length > 1 && (
                  <div className="d-flex gap-2">
                    {product.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(img)}
                        className={`rounded-3 border overflow-hidden p-0 border-2 ${
                          selectedImage === img ? "border-primary" : "border-light"
                        }`}
                        style={{ width: "70px", height: "70px" }}
                      >
                        <img src={img} alt="Thumbnail" className="w-100 h-100 object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                {/* License Verification Badge */}
                <div className="p-3 rounded-3 bg-light border mt-4 d-flex align-items-center gap-3">
                  <div className="p-2 rounded-circle bg-success text-white">
                    <i className="bi bi-shield-lock-fill fs-5"></i>
                  </div>
                  <div>
                    <b className="d-block text-dark text-xs">Instant Cryptographic Key Provisioning</b>
                    <small className="text-muted">
                      Your unique license key is generated in the Vault upon checkout and permanently linked to your account.
                    </small>
                  </div>
                </div>
              </div>

              {/* Right Column: Info & Actions */}
              <div className="col-12 col-lg-6 space-y-4">
                <div>
                  <div className="d-flex align-items-center gap-2 mb-2 text-warning small font-semibold">
                    <div className="d-flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <i key={s} className="bi bi-star-fill"></i>
                      ))}
                    </div>
                    <span>{product.rating}</span>
                    <span className="text-muted">({product.reviewsCount} verified reviews)</span>
                  </div>

                  <h3 className="fw-extrabold text-dark tracking-tight mb-2">{product.name}</h3>
                  <p className="text-secondary text-sm leading-relaxed">{product.shortDescription}</p>
                </div>

                {/* Pricing Box */}
                <div className="p-3.5 rounded-3 bg-light border d-flex align-items-center justify-content-between">
                  <div>
                    <span className="text-muted text-xs d-block">Investment Tier</span>
                    <span className="display-6 fw-extrabold text-dark">${product.price}</span>
                    {product.comparePrice && (
                      <span className="text-muted text-decoration-line-through ms-2 fs-6">
                        ${product.comparePrice}
                      </span>
                    )}
                  </div>
                  <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-1.5 text-xs font-bold">
                    {product.pricingInterval === "one-time" ? "Perpetual License" : `Recurring ${product.pricingInterval}`}
                  </span>
                </div>

                {/* Quantity and Actions */}
                <div className="d-flex align-items-center gap-3 pt-2">
                  <div className="d-flex align-items-center border rounded-pill bg-white p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="btn btn-sm btn-light rounded-circle p-1 text-dark"
                      style={{ width: "28px", height: "28px" }}
                    >
                      -
                    </button>
                    <span className="px-3 fw-bold text-sm">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="btn btn-sm btn-light rounded-circle p-1 text-dark"
                      style={{ width: "28px", height: "28px" }}
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="btn btn-outline-dark btn-lg flex-grow-1 rounded-pill fw-bold text-sm py-2.5 d-flex align-items-center justify-content-center gap-2"
                  >
                    <i className="bi bi-cart-plus"></i> Add to Cart
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="btn btn-primary btn-lg flex-grow-1 rounded-pill fw-bold text-sm py-2.5 shadow-sm"
                  >
                    Buy Now
                  </button>
                </div>

                {/* Tabs: Features, Reviews, FAQ */}
                <div className="pt-3">
                  <div className="border-bottom d-flex gap-3 mb-3">
                    <button
                      onClick={() => setActiveTab("features")}
                      className={`btn btn-sm border-0 border-bottom border-2 rounded-0 px-2 py-2 fw-bold text-xs ${
                        activeTab === "features" ? "border-primary text-primary" : "text-muted"
                      }`}
                    >
                      Features & Specs
                    </button>
                    <button
                      onClick={() => setActiveTab("reviews")}
                      className={`btn btn-sm border-0 border-bottom border-2 rounded-0 px-2 py-2 fw-bold text-xs ${
                        activeTab === "reviews" ? "border-primary text-primary" : "text-muted"
                      }`}
                    >
                      Customer Reviews ({reviewsList.length})
                    </button>
                    <button
                      onClick={() => setActiveTab("faq")}
                      className={`btn btn-sm border-0 border-bottom border-2 rounded-0 px-2 py-2 fw-bold text-xs ${
                        activeTab === "faq" ? "border-primary text-primary" : "text-muted"
                      }`}
                    >
                      FAQ & Licensing
                    </button>
                  </div>

                  {activeTab === "features" && (
                    <div className="space-y-3">
                      <p className="text-secondary small leading-relaxed">{product.description}</p>
                      <ul className="space-y-2 list-unstyled text-xs text-dark font-medium">
                        {product.features?.map((f, idx) => (
                          <li key={idx} className="d-flex align-items-center gap-2">
                            <i className="bi bi-check-circle-fill text-success"></i>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeTab === "reviews" && (
                    <div className="space-y-4">
                      {/* Reviews List */}
                      <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                        {reviewsList.map((rev, idx) => (
                          <div key={idx} className="p-3 rounded-3 bg-light border text-xs">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <b className="text-dark">{rev.author}</b>
                              <span className="text-muted text-[11px]">{rev.date}</span>
                            </div>
                            <div className="text-warning text-[11px] mb-1">{"★".repeat(rev.rating)}</div>
                            <p className="text-secondary mb-0">{rev.text}</p>
                          </div>
                        ))}
                      </div>

                      {/* Add Review Form */}
                      <form onSubmit={handleAddReview} className="p-3 border rounded-3 bg-light space-y-2">
                        <span className="fw-bold text-xs d-block">Write a Review</span>
                        <div className="row g-2">
                          <div className="col-8">
                            <input
                              type="text"
                              required
                              placeholder="Your Name / Title"
                              className="form-control form-control-sm text-xs"
                              value={reviewName}
                              onChange={(e) => setReviewName(e.target.value)}
                            />
                          </div>
                          <div className="col-4">
                            <select
                              className="form-select form-select-sm text-xs"
                              value={reviewRating}
                              onChange={(e) => setReviewRating(Number(e.target.value))}
                            >
                              <option value={5}>5 Stars ★★★★★</option>
                              <option value={4}>4 Stars ★★★★</option>
                              <option value={3}>3 Stars ★★★</option>
                            </select>
                          </div>
                        </div>
                        <textarea
                          required
                          rows={2}
                          placeholder="Share your experience with this software package..."
                          className="form-control form-control-sm text-xs"
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                        />
                        <button type="submit" className="btn btn-dark btn-sm text-xs px-3">
                          Submit Review
                        </button>
                      </form>
                    </div>
                  )}

                  {activeTab === "faq" && (
                    <div className="accordion accordion-flush" id="productFaq">
                      <div className="accordion-item border-0">
                        <h2 className="accordion-header">
                          <button className="accordion-button collapsed px-0 text-xs fw-bold text-dark py-2">
                            How do I receive my license key after payment?
                          </button>
                        </h2>
                        <div className="accordion-body px-0 text-xs text-muted">
                          License keys are cryptographically generated and displayed on your order confirmation screen immediately. They are also permanently stored in your Customer Account Vault.
                        </div>
                      </div>
                      <div className="accordion-item border-0">
                        <h2 className="accordion-header">
                          <button className="accordion-button collapsed px-0 text-xs fw-bold text-dark py-2">
                            Are commercial rights included?
                          </button>
                        </h2>
                        <div className="accordion-body px-0 text-xs text-muted">
                          Yes, all digital software licenses on PlayBeat Cloud grant unrestricted commercial deployment rights for client and SaaS production use.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
