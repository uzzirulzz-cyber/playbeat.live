import React, { useState } from "react";
import { Product, Category } from "../types";
import { useStore } from "../context/StoreContext";

interface ProductGridProps {
  products: Product[];
  categories: Category[];
  isFeaturedOnly?: boolean;
  title?: string;
  subtitle?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  categories,
  isFeaturedOnly = false,
  title,
  subtitle,
}) => {
  const { addToCart, setViewingProduct, setIsCheckoutOpen } = useStore();
  const [selectedCat, setSelectedCat] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [search, setSearch] = useState("");

  const handleBuyNow = (p: Product) => {
    addToCart(p, 1);
    setIsCheckoutOpen(true);
  };

  let list = isFeaturedOnly ? products.slice(0, 4) : [...products];

  if (!isFeaturedOnly) {
    if (selectedCat !== "all") {
      list = list.filter((p) => p.category === selectedCat);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (sortBy === "price-low") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "newest") {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  }

  return (
    <section className="py-5">
      <div className="container-xl">
        {/* Header */}
        <div className="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-4">
          <div>
            <span className="text-primary text-xs fw-bold text-uppercase tracking-wider">
              {isFeaturedOnly ? "Hand-Curated" : "Catalog"}
            </span>
            <h2 className="fw-bold text-dark mb-1">
              {title || (isFeaturedOnly ? "Featured Enterprise Suites" : "Explore All Products & Tools")}
            </h2>
            <p className="text-muted small mb-0">
              {subtitle || "Software suites tested for high-volume performance with perpetual licenses."}
            </p>
          </div>

          {!isFeaturedOnly && (
            <div className="d-flex flex-wrap items-center gap-2">
              <div className="input-group input-group-sm" style={{ width: "200px" }}>
                <span className="input-group-text bg-white text-muted border-end-0">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  placeholder="Filter products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="form-control border-start-0"
                />
              </div>

              <select
                className="form-select form-select-sm"
                style={{ width: "160px" }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Sort: Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          )}
        </div>

        {/* Category Pills Filter (if full catalog) */}
        {!isFeaturedOnly && (
          <div className="d-flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
            <button
              onClick={() => setSelectedCat("all")}
              className={`btn btn-sm rounded-pill px-3 py-1.5 text-xs fw-semibold ${
                selectedCat === "all" ? "btn-dark text-white" : "btn-light border text-secondary"
              }`}
            >
              All Domains
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCat(c.slug)}
                className={`btn btn-sm rounded-pill px-3 py-1.5 text-xs fw-semibold text-nowrap ${
                  selectedCat === c.slug ? "btn-dark text-white" : "btn-light border text-secondary"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}

        {/* Product Cards Grid */}
        {list.length === 0 ? (
          <div className="text-center p-5 card border rounded-4 bg-light">
            <i className="bi bi-inbox fs-2 text-muted mb-2"></i>
            <h6 className="fw-bold text-dark">No products found</h6>
            <p className="text-muted small">Try adjusting your search or domain filter criteria.</p>
          </div>
        ) : (
          <div className="row g-4">
            {list.map((p) => {
              const catObj = categories.find((c) => c.slug === p.category);
              return (
                <div key={p.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                  <div className="card h-100 border rounded-4 overflow-hidden shadow-xs hover:shadow-md hover:border-primary transition-all d-flex flex-column group bg-white">
                    {/* Image Thumbnail */}
                    <div
                      className="position-relative overflow-hidden cursor-pointer bg-light d-flex align-items-center justify-content-center"
                      style={{ height: "190px" }}
                      onClick={() => setViewingProduct(p)}
                    >
                      <img
                        src={p.images?.[0] || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80"}
                        alt={p.name}
                        className="w-100 h-100 object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Top Badges */}
                      <div className="position-absolute top-0 start-0 m-2.5 d-flex gap-1.5 flex-wrap">
                        {p.badge && (
                          <span className="badge bg-dark bg-opacity-75 text-white rounded-pill px-2.5 py-1 text-[10px] fw-bold">
                            {p.badge}
                          </span>
                        )}
                        <span className="badge bg-light text-dark border rounded-pill px-2 py-1 text-[10px] fw-semibold">
                          {catObj?.name || p.category}
                        </span>
                      </div>

                      {p.comparePrice && (
                        <div className="position-absolute top-0 end-0 m-2.5 badge bg-danger text-white rounded-pill px-2 py-1 text-[10px] fw-bold">
                          {Math.round(((p.comparePrice - p.price) / p.comparePrice) * 100)}% OFF
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-3.5 flex-grow-1 d-flex flex-column justify-content-between">
                      <div>
                        {/* Rating & Type */}
                        <div className="d-flex align-items-center justify-content-between mb-1.5 text-xs">
                          <span className="text-warning fw-semibold d-flex align-items-center gap-1">
                            <i className="bi bi-star-fill"></i> {p.rating}
                            <span className="text-muted text-[11px]">({p.reviewsCount})</span>
                          </span>
                          <span className="text-muted text-[11px] text-capitalize font-mono">
                            {p.productType}
                          </span>
                        </div>

                        {/* Title */}
                        <h6
                          className="fw-bold text-dark text-sm mb-1.5 cursor-pointer group-hover:text-primary transition-colors text-truncate-2"
                          onClick={() => setViewingProduct(p)}
                          title={p.name}
                        >
                          {p.name}
                        </h6>

                        {/* Short Description */}
                        <p className="text-muted text-[12px] line-clamp-2 leading-relaxed mb-3">
                          {p.shortDescription || p.description}
                        </p>
                      </div>

                      {/* Pricing & Cart Action */}
                      <div className="pt-2 border-top">
                        <div className="d-flex align-items-center justify-content-between mb-2.5">
                          <div>
                            <span className="fs-5 fw-extrabold text-dark">${p.price}</span>
                            {p.comparePrice && (
                              <span className="text-muted text-decoration-line-through ms-1.5 small">
                                ${p.comparePrice}
                              </span>
                            )}
                            <span className="text-muted text-[10px] d-block">
                              {p.pricingInterval === "one-time" ? "Lifetime license" : `Billed ${p.pricingInterval}`}
                            </span>
                          </div>
                        </div>

                        <div className="d-grid grid-cols-2 gap-1.5">
                          <button
                            onClick={() => addToCart(p, 1)}
                            className="btn btn-outline-dark btn-sm rounded-pill fw-semibold text-xs py-1.5 d-flex align-items-center justify-content-center gap-1"
                          >
                            <i className="bi bi-cart-plus"></i> Add
                          </button>
                          <button
                            onClick={() => handleBuyNow(p)}
                            className="btn btn-primary btn-sm rounded-pill fw-bold text-xs py-1.5 shadow-xs"
                          >
                            Buy Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
