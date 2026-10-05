import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { Order } from "../types";
import { useStore } from "../context/StoreContext";

export const OrderManagement: React.FC = () => {
  const { showToast } = useStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await api.getOrders();
      setOrders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string, paymentStatus?: string) => {
    try {
      const updated = await api.updateOrderStatus(orderId, {
        status: newStatus,
        paymentStatus,
        note: `Status updated to ${newStatus} by Admin`,
      });
      showToast(`Order status updated to ${newStatus}`);
      setSelectedOrder(updated);
      loadOrders();
    } catch (e: any) {
      showToast(e.message || "Failed to update status");
    }
  };

  const handleAddNote = async (orderId: string) => {
    if (!newNote.trim()) return;
    try {
      const updated = await api.updateOrderStatus(orderId, { note: newNote.trim() });
      setNewNote("");
      setSelectedOrder(updated);
      showToast("Timeline note added");
      loadOrders();
    } catch (e: any) {
      showToast(e.message || "Failed to add note");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
      case "Paid":
        return "bg-success-subtle text-success border border-success-subtle";
      case "Processing":
        return "bg-primary-subtle text-primary border border-primary-subtle";
      case "Pending":
        return "bg-warning-subtle text-warning border border-warning-subtle";
      case "Cancelled":
      case "Refunded":
      case "Failed":
        return "bg-danger-subtle text-danger border border-danger-subtle";
      default:
        return "bg-secondary-subtle text-secondary";
    }
  };

  const filtered = orders.filter((o) => {
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    const matchSearch =
      !search ||
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
        <div>
          <h4 className="fw-bold text-dark mb-1">Orders & Transaction Management</h4>
          <p className="text-muted small mb-0">Track live orders placed on the storefront, payment states, and digital provisioning.</p>
        </div>

        <button onClick={loadOrders} className="btn btn-outline-secondary btn-sm rounded-3">
          <i className="bi bi-arrow-clockwise me-1"></i> Refresh Orders
        </button>
      </div>

      {/* Filter Bar */}
      <div className="card border rounded-3 p-3 bg-white shadow-sm">
        <div className="row g-2 align-items-center">
          <div className="col-12 col-md-6">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-white text-muted border-end-0">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                placeholder="Search by order ID, customer name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-control border-start-0"
              />
            </div>
          </div>

          <div className="col-6 col-md-3">
            <select
              className="form-select form-select-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Paid">Paid</option>
              <option value="Processing">Processing</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>

          <div className="col-6 col-md-3 text-end text-muted small">
            {filtered.length} matching order(s)
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card border rounded-3 bg-white shadow-sm overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 text-sm">
            <thead className="table-light text-muted small text-uppercase">
              <tr>
                <th>Order Number</th>
                <th>Customer</th>
                <th>Items Purchased</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Order Status</th>
                <th>Date</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-4">
                    <span className="spinner-border spinner-border-sm text-primary"></span>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-muted small">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filtered.map((ord) => (
                  <tr key={ord.id}>
                    <td className="fw-bold font-mono text-dark">{ord.orderNumber}</td>
                    <td>
                      <div className="fw-semibold text-dark text-xs">{ord.customerName}</div>
                      <div className="text-muted text-[11px]">{ord.customerEmail}</div>
                    </td>
                    <td>
                      <div className="text-xs text-dark">{ord.items?.[0]?.name}</div>
                      {ord.items.length > 1 && (
                        <span className="text-muted text-[10px]">+{ord.items.length - 1} more item(s)</span>
                      )}
                    </td>
                    <td className="fw-bold text-dark text-xs">${ord.total}</td>
                    <td>
                      <span className={`badge rounded-pill text-[10px] ${getStatusBadge(ord.paymentStatus)}`}>
                        {ord.paymentStatus}
                      </span>
                    </td>
                    <td>
                      <span className={`badge rounded-pill text-[10px] ${getStatusBadge(ord.status)}`}>
                        {ord.status}
                      </span>
                    </td>
                    <td className="text-muted text-xs">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>
                    <td className="text-end">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="btn btn-outline-dark btn-sm rounded-2 text-xs py-1 px-2.5"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-bottom py-3 px-4">
                <div>
                  <h5 className="modal-title fw-bold text-dark fs-6 mb-0">
                    Order Details: {selectedOrder.orderNumber}
                  </h5>
                  <small className="text-muted">Placed on {new Date(selectedOrder.createdAt).toLocaleString()}</small>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedOrder(null)}
                ></button>
              </div>

              <div className="modal-body p-4 space-y-4">
                {/* Status Switcher Bar */}
                <div className="p-3 bg-light rounded-3 d-flex flex-wrap align-items-center justify-content-between gap-3">
                  <div>
                    <span className="text-muted text-xs d-block">Current Status:</span>
                    <span className={`badge rounded-pill text-xs mt-1 ${getStatusBadge(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </div>

                  <div className="d-flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.id, "Completed", "Paid")}
                      className="btn btn-sm btn-outline-success rounded-2 text-xs fw-semibold"
                    >
                      Mark Completed
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.id, "Refunded", "Refunded")}
                      className="btn btn-sm btn-outline-danger rounded-2 text-xs fw-semibold"
                    >
                      Refund Order
                    </button>
                  </div>
                </div>

                {/* Customer Information */}
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <div className="card p-3 border rounded-3 bg-white h-100">
                      <h6 className="fw-bold text-dark text-xs text-uppercase tracking-wider mb-2">Customer Info</h6>
                      <div className="text-sm fw-bold text-dark">{selectedOrder.customerName}</div>
                      <div className="text-muted small">{selectedOrder.customerEmail}</div>
                      {selectedOrder.customerPhone && <div className="text-muted small">{selectedOrder.customerPhone}</div>}
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="card p-3 border rounded-3 bg-white h-100">
                      <h6 className="fw-bold text-dark text-xs text-uppercase tracking-wider mb-2">Payment Details</h6>
                      <div className="text-sm fw-bold text-dark">${selectedOrder.total}</div>
                      <div className="text-muted small">Method: {selectedOrder.paymentMethod}</div>
                      {selectedOrder.couponCode && (
                        <div className="badge bg-info-subtle text-info w-max text-xs mt-1">
                          Coupon applied: {selectedOrder.couponCode} (-${selectedOrder.discount})
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Items Purchased & Digital Licenses */}
                <div>
                  <h6 className="fw-bold text-dark text-xs text-uppercase tracking-wider mb-2">Purchased Items & Digital Keys</h6>
                  <div className="card border rounded-3 bg-white overflow-hidden">
                    <div className="table-responsive">
                      <table className="table mb-0 align-middle text-sm">
                        <thead className="table-light text-muted small">
                          <tr>
                            <th>Item</th>
                            <th>Price</th>
                            <th>Qty</th>
                            <th>Subtotal</th>
                            <th>Allocated License Key</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedOrder.items.map((it, idx) => (
                            <tr key={idx}>
                              <td className="fw-semibold text-xs">{it.name}</td>
                              <td className="text-xs">${it.price}</td>
                              <td className="text-xs">{it.quantity}</td>
                              <td className="text-xs font-bold">${it.price * it.quantity}</td>
                              <td>
                                {it.licenseKey ? (
                                  <span className="badge bg-dark font-mono text-cyan-300 text-xs">
                                    {it.licenseKey}
                                  </span>
                                ) : (
                                  <span className="text-muted text-xs">N/A</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Timeline History */}
                <div>
                  <h6 className="fw-bold text-dark text-xs text-uppercase tracking-wider mb-2">Order Timeline</h6>
                  <div className="p-3 bg-light rounded-3 space-y-2 text-xs">
                    {selectedOrder.timeline.map((item, idx) => (
                      <div key={idx} className="d-flex items-start gap-2">
                        <i className="bi bi-clock text-primary shrink-0 mt-0.5"></i>
                        <div>
                          <div className="text-dark font-medium">{item.note}</div>
                          <small className="text-muted">{new Date(item.time).toLocaleString()}</small>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Note */}
                  <div className="input-group input-group-sm mt-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Add an internal audit note to this order..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                    />
                    <button
                      className="btn btn-outline-dark"
                      onClick={() => handleAddNote(selectedOrder.id)}
                    >
                      Post Note
                    </button>
                  </div>
                </div>
              </div>

              <div className="modal-footer border-top py-2.5 px-4 bg-light">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setSelectedOrder(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
