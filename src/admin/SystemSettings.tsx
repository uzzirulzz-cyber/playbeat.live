import React, { useState, useEffect } from "react";
import { api } from "../services/api";

export const SystemSettings: React.FC = () => {
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const logs = await api.getAuditLogs();
      setAuditLogs(logs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="fw-bold text-dark mb-1">System Audit Logs & Governance</h4>
        <p className="text-muted small mb-0">Immutable compliance audit trail logging administrator actions and checkout events.</p>
      </div>

      <div className="card border rounded-3 bg-white shadow-sm overflow-hidden">
        <div className="p-3 border-bottom d-flex align-items-center justify-content-between">
          <h6 className="fw-bold text-dark mb-0">Audit Trail ({auditLogs.length} Events)</h6>
          <button onClick={loadLogs} className="btn btn-sm btn-outline-secondary py-1 px-2.5 text-xs">
            <i className="bi bi-arrow-clockwise me-1"></i> Refresh Logs
          </button>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 text-sm">
            <thead className="table-light text-muted small text-uppercase">
              <tr>
                <th>Timestamp</th>
                <th>Operator</th>
                <th>Action</th>
                <th>Target Object</th>
                <th>IP Address</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    <span className="spinner-border spinner-border-sm text-primary"></span>
                  </td>
                </tr>
              ) : auditLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-muted small">No audit logs recorded yet.</td>
                </tr>
              ) : (
                auditLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="text-muted text-xs font-mono">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="fw-bold text-dark text-xs">{log.user}</td>
                    <td>
                      <span className="badge bg-light text-dark border text-[11px]">{log.action}</span>
                    </td>
                    <td className="text-xs text-secondary">{log.target}</td>
                    <td className="text-xs text-muted font-mono">{log.ip}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
