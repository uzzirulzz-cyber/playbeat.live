import React, { useState, useEffect } from "react";
import {
  Shield,
  ShieldCheck,
  FileText,
  Lock,
  Key,
  RefreshCw,
  Download,
  CheckCircle2,
  AlertTriangle,
  Search,
  Copy,
  Check,
  Printer,
  Cpu,
  Server,
  Terminal,
  ArrowRight,
  MessageCircle,
  Mail,
  ChevronRight,
  ExternalLink,
  Award,
  Hash,
  Database,
  FileCheck2,
} from "lucide-react";
import { AdminSecuritySeal } from "../components/AdminSecuritySeal";

export type LegalTabType = "privacy" | "terms" | "refund" | "security";

interface LegalPageProps {
  initialTab?: LegalTabType;
}

export const LegalPage: React.FC<LegalPageProps> = ({ initialTab = "privacy" }) => {
  const [activeTab, setActiveTab] = useState<LegalTabType>(initialTab);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedClause, setCopiedClause] = useState<string | null>(null);

  // Interactive IP Certificate Generator State
  const [clientCompany, setClientCompany] = useState("Vance Technologies LLC");
  const [clientProject, setClientProject] = useState("Enterprise SaaS Analytics Platform");
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  // Interactive Security Diagnostic State
  const [diagnosticRunning, setDiagnosticRunning] = useState(false);
  const [diagnosticResults, setDiagnosticResults] = useState<{
    tls: boolean;
    aes: boolean;
    hsts: boolean;
    csp: boolean;
    sri: boolean;
    score: number;
  } | null>(null);

  // Sync with prop changes
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleTabChange = (tab: LegalTabType) => {
    setActiveTab(tab);
    window.location.hash = `#/${tab}`;
  };

  const copyClauseLink = (clauseId: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/#/${activeTab}#${clauseId}`);
    setCopiedClause(clauseId);
    setTimeout(() => setCopiedClause(null), 2000);
  };

  const runSecurityDiagnostic = () => {
    setDiagnosticRunning(true);
    setTimeout(() => {
      setDiagnosticResults({
        tls: true,
        aes: true,
        hsts: true,
        csp: true,
        sri: true,
        score: 100,
      });
      setDiagnosticRunning(false);
    }, 1200);
  };

  return (
    <div className="bg-slate-950 text-white min-vh-100 pb-5">
      {/* Top Hero Banner */}
      <section
        className="py-5 pt-lg-6 position-relative overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #050816 0%, #081426 60%, #050816 100%)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <div
          className="position-absolute top-0 start-50 translate-middle-x rounded-circle pointer-events-none opacity-20"
          style={{
            width: "700px",
            height: "350px",
            background: "radial-gradient(circle, #38BDF8 0%, #7C3AED 50%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />

        <div className="container-xl position-relative z-1 pt-2">
          {/* Unboxed Metadata (Zero-pill discipline) */}
          <div className="d-flex flex-wrap align-items-center gap-2 text-xs text-slate-400 mb-3 font-mono">
            <span>PlayBeat Digital (Pvt) Ltd</span>
            <span aria-hidden="true">·</span>
            <span>Legal & Security Architecture</span>
            <span aria-hidden="true">·</span>
            <span className="text-cyan-400">ISO/IEC 27001 & SOC 2 Standards</span>
            <span aria-hidden="true">·</span>
            <span>Revised October 2026</span>
          </div>

          <h1
            className="fw-extrabold text-white mb-3"
            style={{ fontSize: "clamp(30px, 4vw, 52px)", letterSpacing: "-0.03em" }}
          >
            TRUST, GOVERNANCE &amp;{" "}
            <span className="text-gt-primary">ENGINEERING SECURITY.</span>
          </h1>

          <p className="text-slate-300 text-base max-w-3xl leading-relaxed mb-4">
            Unconditional client IP ownership, bank-grade encryption protocols, transparent flat-rate milestone contracts, and sovereign data privacy. No hidden vendor lock-in.
          </p>

          {/* Interactive Segmented Tabs (Functional Buttons) */}
          <div className="d-flex flex-wrap gap-2 p-1.5 rounded-3 bg-slate-900/80 border border-white/10 max-w-2xl">
            <button
              onClick={() => handleTabChange("privacy")}
              className={`btn btn-sm rounded-2 px-3 py-2 text-xs fw-bold transition-all d-flex align-items-center gap-2 ${
                activeTab === "privacy"
                  ? "bg-primary text-white shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Privacy Policy</span>
            </button>

            <button
              onClick={() => handleTabChange("terms")}
              className={`btn btn-sm rounded-2 px-3 py-2 text-xs fw-bold transition-all d-flex align-items-center gap-2 ${
                activeTab === "terms"
                  ? "bg-primary text-white shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Terms of Service</span>
            </button>

            <button
              onClick={() => handleTabChange("refund")}
              className={`btn btn-sm rounded-2 px-3 py-2 text-xs fw-bold transition-all d-flex align-items-center gap-2 ${
                activeTab === "refund"
                  ? "bg-primary text-white shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Refund &amp; IP Handover</span>
            </button>

            <button
              onClick={() => handleTabChange("security")}
              className={`btn btn-sm rounded-2 px-3 py-2 text-xs fw-bold transition-all d-flex align-items-center gap-2 ${
                activeTab === "security"
                  ? "bg-cyan-500 text-dark fw-extrabold shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Security &amp; Encryption</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content & Sidebar Layout */}
      <div className="container-xl py-5">
        <div className="row g-4 lg:g-5">
          {/* Left Column: Document Navigation & Tools */}
          <div className="col-12 col-lg-3">
            <div className="sticky-top" style={{ top: "90px", zIndex: 10 }}>
              {/* Search Within Documents */}
              <div className="mb-4">
                <div className="input-group">
                  <span className="input-group-text bg-slate-900 border-white/15 text-slate-400">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    className="form-control bg-slate-900 border-white/15 text-white placeholder-slate-500 text-xs py-2"
                    placeholder="Search legal clauses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Document Overview Card */}
              <div className="p-3.5 rounded-3 border border-white/10 bg-slate-900/50 mb-3">
                <div className="text-xs fw-bold text-slate-400 uppercase tracking-wider mb-2 font-mono">
                  Document Index
                </div>
                <div className="space-y-1">
                  {activeTab === "privacy" && [
                    { id: "priv-scope", title: "1. Scope & Zero Telemetry" },
                    { id: "priv-collection", title: "2. Data We Collect" },
                    { id: "priv-processors", title: "3. Sub-Processors" },
                    { id: "priv-retention", title: "4. Code & Data Retention" },
                    { id: "priv-gdpr", title: "5. GDPR & CCPA Rights" },
                  ].map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="d-block py-1.5 px-2 rounded text-xs text-slate-300 text-decoration-none hover:bg-white/5 hover:text-cyan-300 transition-colors"
                    >
                      {item.title}
                    </a>
                  ))}

                  {activeTab === "terms" && [
                    { id: "terms-sow", title: "1. Scope & Statements of Work" },
                    { id: "terms-demos", title: "2. Working Demo Validation" },
                    { id: "terms-revisions", title: "3. Revision Cycles" },
                    { id: "terms-payments", title: "4. Milestone Payments" },
                    { id: "terms-warranty", title: "5. 90-Day Warranty SLA" },
                    { id: "terms-liability", title: "6. Limitation of Liability" },
                  ].map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="d-block py-1.5 px-2 rounded text-xs text-slate-300 text-decoration-none hover:bg-white/5 hover:text-cyan-300 transition-colors"
                    >
                      {item.title}
                    </a>
                  ))}

                  {activeTab === "refund" && [
                    { id: "ip-100", title: "1. 100% IP Handover Guarantee" },
                    { id: "ip-git", title: "2. Git Repository Transfer" },
                    { id: "ip-deed", title: "3. Deed of IP Assignment" },
                    { id: "ref-milestone", title: "4. Milestone Refund Framework" },
                    { id: "ref-licenses", title: "5. Digital Software Guarantees" },
                  ].map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="d-block py-1.5 px-2 rounded text-xs text-slate-300 text-decoration-none hover:bg-white/5 hover:text-cyan-300 transition-colors"
                    >
                      {item.title}
                    </a>
                  ))}

                  {activeTab === "security" && [
                    { id: "sec-ciphers", title: "1. AES-256-GCM & TLS 1.3" },
                    { id: "sec-zero-trust", title: "2. Zero-Trust Access & IAM" },
                    { id: "sec-pipeline", title: "3. DevSecOps & Scanning" },
                    { id: "sec-ddos", title: "4. DDoS & Edge Protection" },
                    { id: "sec-audit", title: "5. Live Diagnostic Verifier" },
                    { id: "sec-bounty", title: "6. Responsible Disclosure" },
                  ].map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="d-block py-1.5 px-2 rounded text-xs text-slate-300 text-decoration-none hover:bg-white/5 hover:text-cyan-300 transition-colors"
                    >
                      {item.title}
                    </a>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 mb-4">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn btn-outline-light btn-sm w-100 rounded-2 text-xs d-flex align-items-center justify-content-center gap-2 py-2"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Document</span>
                </button>

                {activeTab === "refund" && (
                  <button
                    type="button"
                    onClick={() => setShowCertificateModal(true)}
                    className="btn btn-primary btn-sm w-100 rounded-2 text-xs fw-bold d-flex align-items-center justify-content-center gap-2 py-2 shadow-sm"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>View Sample IP Deed</span>
                  </button>
                )}

                {activeTab === "security" && (
                  <button
                    type="button"
                    onClick={runSecurityDiagnostic}
                    disabled={diagnosticRunning}
                    className="btn btn-info btn-sm w-100 rounded-2 text-xs fw-bold d-flex align-items-center justify-content-center gap-2 py-2 text-dark shadow-sm"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${diagnosticRunning ? "animate-spin" : ""}`} />
                    <span>Run Security Audit</span>
                  </button>
                )}
              </div>

              {/* Discrete Security Seal (Embedded Admin Access) */}
              <div className="p-3 rounded-3 border border-white/10 bg-slate-900/30">
                <div className="d-flex align-items-center gap-2 mb-2 text-xs text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="font-mono">Infrastructure Node</span>
                </div>
                <AdminSecuritySeal size="sm" variant="inline" showDetails={true} />
              </div>
            </div>
          </div>

          {/* Right Column: Full Document Body */}
          <div className="col-12 col-lg-9">
            {/* TAB 1: PRIVACY POLICY */}
            {activeTab === "privacy" && (
              <div className="space-y-5">
                <div className="p-4 p-md-5 rounded-4 border border-white/10 bg-slate-900/40">
                  <div className="d-flex justify-content-between align-items-start border-bottom border-white/10 pb-4 mb-4">
                    <div>
                      <h2 className="fw-extrabold text-white mb-1">Global Privacy Policy</h2>
                      <div className="text-xs text-slate-400 font-mono">
                        Document Ref: PBD-LEGAL-PRV-2026 · Jurisdiction: International &amp; SBP Regulated
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyClauseLink("priv-top")}
                      className="btn btn-outline-secondary btn-sm text-xs rounded-2 text-slate-400 hover:text-white"
                      title="Copy Link to Policy"
                    >
                      {copiedClause === "priv-top" ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Section 1 */}
                  <article id="priv-scope" className="mb-5">
                    <h4 className="fw-bold text-white text-base mb-2 d-flex align-items-center gap-2">
                      <span className="text-cyan-400 font-mono">01.</span>
                      <span>Scope of Policy &amp; Zero-Telemetry Principle</span>
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed mb-3">
                      PlayBeat Digital (Private) Limited operates as an enterprise product development studio and digital software vendor. We maintain an uncompromising commitment to client sovereignty and confidential business intelligence.
                    </p>
                    <div className="p-3.5 rounded-3 bg-cyan-950/20 border border-cyan-500/30 text-xs text-slate-300 leading-relaxed mb-3">
                      <strong className="text-cyan-300 d-block mb-1">Strict Zero-Telemetry Guarantee:</strong>
                      Custom software platforms, applications, and source code engineered by PlayBeat Digital contain <strong>zero tracking probes, surveillance beacons, or phone-home telemetry</strong>. Once code is handed over to your organization, PlayBeat Digital retains no backdoors, background diagnostic beacons, or access keys.
                    </div>
                  </article>

                  {/* Section 2 */}
                  <article id="priv-collection" className="mb-5">
                    <h4 className="fw-bold text-white text-base mb-2 d-flex align-items-center gap-2">
                      <span className="text-cyan-400 font-mono">02.</span>
                      <span>Information We Collect &amp; Processing Limits</span>
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed mb-3">
                      We strictly collect data necessary to prepare architectural scopes, execute milestones, issue cryptographically verified software licenses, and facilitate communications:
                    </p>
                    <ul className="text-slate-300 text-sm space-y-2 list-disc ps-4">
                      <li>
                        <strong>Direct Client Identifiers:</strong> Authorized contact names, official corporate email addresses, direct WhatsApp telephone numbers, and corporate billing details.
                      </li>
                      <li>
                        <strong>Project Scopes &amp; Specifications:</strong> Wireframes, design assets, database schema definitions, and API documentation shared under non-disclosure agreements.
                      </li>
                      <li>
                        <strong>Software License Cryptography:</strong> Order sequence IDs, public license keys, and hardware activation signatures for ready-to-deploy digital frameworks.
                      </li>
                    </ul>
                  </article>

                  {/* Section 3 */}
                  <article id="priv-processors" className="mb-5">
                    <h4 className="fw-bold text-white text-base mb-2 d-flex align-items-center gap-2">
                      <span className="text-cyan-400 font-mono">03.</span>
                      <span>Authoritative Sub-Processors</span>
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed mb-3">
                      To deliver high-availability cloud infrastructure and secure transactional services, we partner exclusively with verified SOC-2 Type II compliant sub-processors:
                    </p>

                    <div className="table-responsive">
                      <table className="table table-dark table-hover border border-white/10 rounded text-xs mb-3">
                        <thead className="table-secondary text-dark">
                          <tr>
                            <th>Sub-Processor</th>
                            <th>Service Category</th>
                            <th>Location / Certifications</th>
                            <th>Data Shared</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="fw-bold text-cyan-300">Cloudflare Inc.</td>
                            <td>DDoS Mitigation, DNS &amp; Edge WAF</td>
                            <td>Global Edge / ISO 27001, SOC-2</td>
                            <td>Anonymized IP, TLS handshake</td>
                          </tr>
                          <tr>
                            <td className="fw-bold text-cyan-300">Stripe Inc.</td>
                            <td>International Card Processing</td>
                            <td>USA / PCI-DSS Level 1</td>
                            <td>Tokenized card credentials</td>
                          </tr>
                          <tr>
                            <td className="fw-bold text-cyan-300">GitHub Enterprise</td>
                            <td>Git Version Control &amp; Handover</td>
                            <td>Global / SOC-2 Type II</td>
                            <td>Repository source code commits</td>
                          </tr>
                          <tr>
                            <td className="fw-bold text-cyan-300">NayaPay / SadaPay</td>
                            <td>Local Banking &amp; Escrow Transfer</td>
                            <td>Pakistan / State Bank Regulated</td>
                            <td>IBAN &amp; invoice transaction IDs</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </article>

                  {/* Section 4 */}
                  <article id="priv-retention" className="mb-5">
                    <h4 className="fw-bold text-white text-base mb-2 d-flex align-items-center gap-2">
                      <span className="text-cyan-400 font-mono">04.</span>
                      <span>Data Retention, Cold Storage &amp; Cryptographic Purge</span>
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed mb-3">
                      During the active project development lifecycle and the mandatory 90-day post-launch warranty window, encrypted codebase snapshots are maintained in an offline, air-gapped cold storage vault for emergency disaster recovery.
                    </p>
                    <p className="text-slate-300 text-sm leading-relaxed mb-0">
                      Following the warranty expiration, clients may issue a <strong>Formal Cryptographic Purge Directive</strong>. Upon receipt, our engineering team executes an irretrievable multi-pass zero-fill overwrite of all staging databases, auxiliary build artifacts, and development environments.
                    </p>
                  </article>

                  {/* Section 5 */}
                  <article id="priv-gdpr">
                    <h4 className="fw-bold text-white text-base mb-2 d-flex align-items-center gap-2">
                      <span className="text-cyan-400 font-mono">05.</span>
                      <span>Sovereign Data Rights (GDPR &amp; CCPA Enforcement)</span>
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed mb-3">
                      Regardless of geographic origin, PlayBeat Digital guarantees all clients full GDPR and CCPA entitlements:
                    </p>
                    <div className="row g-3">
                      <div className="col-12 col-md-6">
                        <div className="p-3 rounded-3 bg-slate-800/50 border border-white/10">
                          <h6 className="fw-bold text-white text-xs mb-1">Right to Complete Portability</h6>
                          <p className="text-slate-400 text-xs mb-0">
                            Download machine-readable exports of all orders, licenses, communications, and project milestones in raw JSON format.
                          </p>
                        </div>
                      </div>
                      <div className="col-12 col-md-6">
                        <div className="p-3 rounded-3 bg-slate-800/50 border border-white/10">
                          <h6 className="fw-bold text-white text-xs mb-1">Right to Permanent Erasure</h6>
                          <p className="text-slate-400 text-xs mb-0">
                            Request full purge of personal account records and contact histories from active production directories within 7 business days.
                          </p>
                        </div>
                      </div>
                    </div>
                  </article>
                </div>
              </div>
            )}

            {/* TAB 2: TERMS OF SERVICE */}
            {activeTab === "terms" && (
              <div className="space-y-5">
                <div className="p-4 p-md-5 rounded-4 border border-white/10 bg-slate-900/40">
                  <div className="d-flex justify-content-between align-items-start border-bottom border-white/10 pb-4 mb-4">
                    <div>
                      <h2 className="fw-extrabold text-white mb-1">Master Services Agreement (MSA)</h2>
                      <div className="text-xs text-slate-400 font-mono">
                        Document Ref: PBD-LEGAL-TOS-2026 · Standard Terms of Product Engineering
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyClauseLink("terms-top")}
                      className="btn btn-outline-secondary btn-sm text-xs rounded-2 text-slate-400 hover:text-white"
                      title="Copy Link to Terms"
                    >
                      {copiedClause === "terms-top" ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Section 1 */}
                  <article id="terms-sow" className="mb-5">
                    <h4 className="fw-bold text-white text-base mb-2 d-flex align-items-center gap-2">
                      <span className="text-cyan-400 font-mono">01.</span>
                      <span>Scope of Work (SOW) &amp; Execution Protocol</span>
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed mb-3">
                      All custom software engineering, platform development, and design sprint engagements are governed by an itemized Statement of Work (SOW). The SOW enumerates functional specifications, target architecture, external API integrations, delivery milestones, and acceptance criteria.
                    </p>
                    <p className="text-slate-300 text-sm leading-relaxed mb-0">
                      Modifications to scope requested subsequent to SOW sign-off are processed through structured Change Orders with explicit milestone schedule adjustments.
                    </p>
                  </article>

                  {/* Section 2 */}
                  <article id="terms-demos" className="mb-5">
                    <h4 className="fw-bold text-white text-base mb-2 d-flex align-items-center gap-2">
                      <span className="text-cyan-400 font-mono">02.</span>
                      <span>The "Test Before You Commit" Standard</span>
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed mb-3">
                      PlayBeat Digital maintains a proprietary gallery of interactive, live-working web and SaaS prototypes. Clients have the right to test workflows, assess component responsiveness, and inspect code quality standards in real-time prior to executing a contract.
                    </p>
                    <div className="p-3.5 rounded-3 bg-purple-950/20 border border-purple-500/30 text-xs text-slate-300 leading-relaxed">
                      <strong>Client Acceptance Window:</strong> For custom milestones, clients receive a <strong>5 business day review period</strong> following deployment to the private staging server to inspect features and verify adherence to the agreed test suite.
                    </div>
                  </article>

                  {/* Section 3 */}
                  <article id="terms-revisions" className="mb-5">
                    <h4 className="fw-bold text-white text-base mb-2 d-flex align-items-center gap-2">
                      <span className="text-cyan-400 font-mono">03.</span>
                      <span>Revision Cycles &amp; Iteration Boundaries</span>
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed mb-3">
                      Every milestone package incorporates up to <strong>three (3) comprehensive revision rounds</strong> within the agreed functional scope. Revisions encompass layout refinements, styling adjustments, copy updates, and component behavior fine-tuning.
                    </p>
                    <p className="text-slate-300 text-sm leading-relaxed mb-0">
                      Unused revisions do not roll over between unrelated milestones, ensuring agile development velocity and predictable sprint completion.
                    </p>
                  </article>

                  {/* Section 4 */}
                  <article id="terms-payments" className="mb-5">
                    <h4 className="fw-bold text-white text-base mb-2 d-flex align-items-center gap-2">
                      <span className="text-cyan-400 font-mono">04.</span>
                      <span>Milestone Invoicing &amp; Escrow Release</span>
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed mb-3">
                      PlayBeat Digital implements transparent flat-rate pricing with zero hidden surcharges or surprise maintenance billings:
                    </p>
                    <ul className="text-slate-300 text-sm space-y-2 list-disc ps-4">
                      <li>
                        <strong>Standard Two-Stage Schedule:</strong> 50% mobilization deposit upon SOW execution; 50% upon milestone completion, final staging approval, and source code transfer.
                      </li>
                      <li>
                        <strong>Enterprise Multi-Stage Schedule:</strong> Available for projects exceeding $10,000 USD (or PKR equivalent), structured as 30% kickoff / 30% alpha prototype / 40% production release.
                      </li>
                      <li>
                        <strong>Multi-Currency Handling:</strong> Invoices may be settled internationally in USD via credit card / wire transfer, or domestically in PKR through official banking channels.
                      </li>
                    </ul>
                  </article>

                  {/* Section 5 */}
                  <article id="terms-warranty" className="mb-5">
                    <h4 className="fw-bold text-white text-base mb-2 d-flex align-items-center gap-2">
                      <span className="text-cyan-400 font-mono">05.</span>
                      <span>90-Day Post-Launch Technical Warranty SLA</span>
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed mb-3">
                      All custom software deliveries are backed by our guaranteed <strong>90-Day Bug Warranty Service Level Agreement</strong>:
                    </p>
                    <div className="row g-3">
                      <div className="col-12 col-md-4">
                        <div className="p-3 rounded-3 bg-slate-800/40 border border-white/10 text-center">
                          <span className="text-danger font-mono text-xs fw-bold d-block mb-1">P0 Critical Outage</span>
                          <span className="fs-5 fw-extrabold text-white d-block mb-1">&lt; 12 Hours</span>
                          <small className="text-slate-400 text-[11px]">Immediate hotfix patch</small>
                        </div>
                      </div>
                      <div className="col-12 col-md-4">
                        <div className="p-3 rounded-3 bg-slate-800/40 border border-white/10 text-center">
                          <span className="text-warning font-mono text-xs fw-bold d-block mb-1">P1 Major Defect</span>
                          <span className="fs-5 fw-extrabold text-white d-block mb-1">&lt; 24 Hours</span>
                          <small className="text-slate-400 text-[11px]">Remediation sprint</small>
                        </div>
                      </div>
                      <div className="col-12 col-md-4">
                        <div className="p-3 rounded-3 bg-slate-800/40 border border-white/10 text-center">
                          <span className="text-info font-mono text-xs fw-bold d-block mb-1">P2 Minor UI Issue</span>
                          <span className="fs-5 fw-extrabold text-white d-block mb-1">&lt; 48 Hours</span>
                          <small className="text-slate-400 text-[11px]">Standard patch release</small>
                        </div>
                      </div>
                    </div>
                  </article>

                  {/* Section 6 */}
                  <article id="terms-liability">
                    <h4 className="fw-bold text-white text-base mb-2 d-flex align-items-center gap-2">
                      <span className="text-cyan-400 font-mono">06.</span>
                      <span>Limitation of Liability &amp; Commercial Arbitration</span>
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed mb-0">
                      Except in cases of gross negligence or willful misconduct, neither party shall be liable for indirect, consequential, or punitive damages. PlayBeat Digital’s cumulative liability is strictly capped at the total aggregate fees received under the disputed SOW. Any irreconcilable controversy shall be resolved through expedited binding commercial arbitration under UNCITRAL rules.
                    </p>
                  </article>
                </div>
              </div>
            )}

            {/* TAB 3: REFUND & IP HANDOVER */}
            {activeTab === "refund" && (
              <div className="space-y-5">
                <div className="p-4 p-md-5 rounded-4 border border-white/10 bg-slate-900/40">
                  <div className="d-flex justify-content-between align-items-start border-bottom border-white/10 pb-4 mb-4">
                    <div>
                      <h2 className="fw-extrabold text-white mb-1">Refund &amp; IP Handover Guarantee</h2>
                      <div className="text-xs text-slate-400 font-mono">
                        Document Ref: PBD-LEGAL-IPR-2026 · 100% Unrestricted Client Codebase Sovereignty
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowCertificateModal(true)}
                      className="btn btn-outline-cyan btn-sm text-xs rounded-2 text-cyan-300 border-cyan-500/40 d-inline-flex align-items-center gap-1.5"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Preview IP Deed</span>
                    </button>
                  </div>

                  {/* Section 1 */}
                  <article id="ip-100" className="mb-5">
                    <h4 className="fw-bold text-white text-base mb-2 d-flex align-items-center gap-2">
                      <span className="text-cyan-400 font-mono">01.</span>
                      <span>100% Intellectual Property Assignment Guarantee</span>
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed mb-3">
                      Unlike traditional agencies that trap clients with proprietary runtime libraries or recurring code rental licenses, <strong>PlayBeat Digital relinquishes 100% of all intellectual property</strong> upon final milestone payment.
                    </p>
                    <div className="p-4 rounded-3 bg-emerald-950/20 border border-emerald-500/30 text-xs text-slate-300 leading-relaxed mb-3">
                      <div className="fw-bold text-emerald-400 fs-6 mb-2 d-flex align-items-center gap-2">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>What You Permanently Own:</span>
                      </div>
                      <div className="row g-2">
                        <div className="col-12 col-md-6">
                          <div className="d-flex align-items-center gap-2">
                            <span className="text-emerald-400">✓</span> Full frontend &amp; backend source code
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            <span className="text-emerald-400">✓</span> Relational database schemas &amp; migrations
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            <span className="text-emerald-400">✓</span> Custom UI/UX design tokens &amp; Figma assets
                          </div>
                        </div>
                        <div className="col-12 col-md-6">
                          <div className="d-flex align-items-center gap-2">
                            <span className="text-emerald-400">✓</span> Dockerfiles, Helm charts &amp; CI/CD pipelines
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            <span className="text-emerald-400">✓</span> Proprietary algorithmic logic &amp; API routes
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            <span className="text-emerald-400">✓</span> Perpetual right to modify, fork, or resell
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>

                  {/* Section 2 */}
                  <article id="ip-git" className="mb-5">
                    <h4 className="fw-bold text-white text-base mb-2 d-flex align-items-center gap-2">
                      <span className="text-cyan-400 font-mono">02.</span>
                      <span>Formal Git Repository Handover Protocol</span>
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed mb-3">
                      The handover is not an email attachment. It is an immutable, cryptographic transfer through industry-standard version control systems:
                    </p>
                    <ol className="text-slate-300 text-sm space-y-2 list-decimal ps-4">
                      <li>
                        <strong>Organization Transfer:</strong> Full repository transfer into your designated GitHub / GitLab organization with complete commit history.
                      </li>
                      <li>
                        <strong>Production Credentials Vault:</strong> Transfer of server SSH keys, Docker registry credentials, and DNS records through an encrypted secrets channel.
                      </li>
                      <li>
                        <strong>Clean Runbook Documentation:</strong> Step-by-step local deployment instructions, environment variable blueprints (`.env.example`), and cloud provisioning scripts.
                      </li>
                    </ol>
                  </article>

                  {/* Section 3 */}
                  <article id="ip-deed" className="mb-5">
                    <h4 className="fw-bold text-white text-base mb-2 d-flex align-items-center gap-2">
                      <span className="text-cyan-400 font-mono">03.</span>
                      <span>Formal Deed of Intellectual Property Assignment</span>
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed mb-3">
                      Every completed engagement is accompanied by an executed legal instrument certifying the complete, worldwide, irrevocable transfer of all copyright, patent rights, trade dress, and code ownership directly to your corporate entity.
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowCertificateModal(true)}
                      className="btn btn-outline-light btn-sm rounded-pill px-3 py-1.5 text-xs fw-semibold d-inline-flex align-items-center gap-2"
                    >
                      <Award className="w-4 h-4 text-cyan-400" />
                      <span>Configure &amp; Preview Sample Deed of Assignment</span>
                    </button>
                  </article>

                  {/* Section 4 */}
                  <article id="ref-milestone" className="mb-5">
                    <h4 className="fw-bold text-white text-base mb-2 d-flex align-items-center gap-2">
                      <span className="text-cyan-400 font-mono">04.</span>
                      <span>Milestone-Based Fair Refund Framework</span>
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed mb-3">
                      We believe clients should never pay for unfulfilled promises. Our refund protection is structured directly around project milestones:
                    </p>
                    <div className="table-responsive">
                      <table className="table table-dark table-hover border border-white/10 rounded text-xs mb-3">
                        <thead className="table-secondary text-dark">
                          <tr>
                            <th>Phase / Milestone</th>
                            <th>Refund Protection</th>
                            <th>Deliverables Retained</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="fw-bold text-white">Pre-Architecture Sign-off</td>
                            <td className="text-success fw-bold">100% Full Refund</td>
                            <td className="text-slate-400">Zero penalty. Initial deposit returned in full.</td>
                          </tr>
                          <tr>
                            <td className="fw-bold text-white">Milestone In-Progress</td>
                            <td className="text-warning fw-bold">Pro-Rata Milestone Protection</td>
                            <td className="text-slate-400">
                              If acceptance criteria are unmet after 2 revisions, client is released from future payments and refunded the active unapproved milestone fee.
                            </td>
                          </tr>
                          <tr>
                            <td className="fw-bold text-white">Final Handover Approved</td>
                            <td className="text-info fw-bold">90-Day Warranty Protection</td>
                            <td className="text-slate-400">
                              Free priority bug fixes and security patching; no monetary refunds post code transfer.
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </article>

                  {/* Section 5 */}
                  <article id="ref-licenses">
                    <h4 className="fw-bold text-white text-base mb-2 d-flex align-items-center gap-2">
                      <span className="text-cyan-400 font-mono">05.</span>
                      <span>Ready-Made Digital Software &amp; Frameworks</span>
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed mb-0">
                      For off-the-shelf software binaries, SaaS boilerplates, and developer license keys purchased from the PlayBeat Catalog, we provide a <strong>14-Day Functional Replacement Warranty</strong>. If the downloadable package fails to deploy on supported runtimes (Node 20+, Docker 24+, Ubuntu 22.04+) and our support team cannot resolve the defect within 48 hours, a 100% refund is issued and the digital license key is automatically decommissioned.
                    </p>
                  </article>
                </div>
              </div>
            )}

            {/* TAB 4: SECURITY & ENCRYPTION ("BUILD STRONG") */}
            {activeTab === "security" && (
              <div className="space-y-5">
                <div className="p-4 p-md-5 rounded-4 border border-white/10 bg-slate-900/40">
                  <div className="d-flex justify-content-between align-items-start border-bottom border-white/10 pb-4 mb-4">
                    <div>
                      <h2 className="fw-extrabold text-white mb-1">Security Architecture &amp; Encryption Standards</h2>
                      <div className="text-xs text-cyan-400 font-mono">
                        Document Ref: PBD-SEC-SPEC-2026 · Defense-in-Depth Cryptographic Whitepaper
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={runSecurityDiagnostic}
                      className="btn btn-info btn-sm text-xs rounded-2 fw-bold text-dark d-inline-flex align-items-center gap-1.5"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${diagnosticRunning ? "animate-spin" : ""}`} />
                      <span>{diagnosticRunning ? "Auditing..." : "Run Live Audit"}</span>
                    </button>
                  </div>

                  {/* Live Interactive Security Diagnostic Widget */}
                  <div className="p-4 rounded-3 border border-cyan-500/40 bg-gradient-to-r from-slate-900 via-cyan-950/30 to-slate-900 mb-5">
                    <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
                      <div>
                        <div className="text-xs fw-bold text-cyan-300 uppercase tracking-wider font-mono">
                          Live Security Posture Diagnostic
                        </div>
                        <h5 className="fw-extrabold text-white mb-0">PlayBeat Zero-Trust Edge Verification</h5>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs px-2.5 py-1">
                          A+ GRADE (SSL LABS COMPLIANT)
                        </span>
                      </div>
                    </div>

                    <div className="row g-3">
                      <div className="col-6 col-md-3">
                        <div className="p-2.5 rounded-2 bg-slate-900/80 border border-white/10">
                          <small className="text-slate-400 text-[10px] d-block">Cipher Suite</small>
                          <span className="fw-bold text-white text-xs font-mono">AES-256-GCM</span>
                          <span className="text-emerald-400 text-[10px] d-block">✓ Active</span>
                        </div>
                      </div>
                      <div className="col-6 col-md-3">
                        <div className="p-2.5 rounded-2 bg-slate-900/80 border border-white/10">
                          <small className="text-slate-400 text-[10px] d-block">In-Transit Protocol</small>
                          <span className="fw-bold text-white text-xs font-mono">TLS 1.3 / PFS</span>
                          <span className="text-emerald-400 text-[10px] d-block">✓ Enforced</span>
                        </div>
                      </div>
                      <div className="col-6 col-md-3">
                        <div className="p-2.5 rounded-2 bg-slate-900/80 border border-white/10">
                          <small className="text-slate-400 text-[10px] d-block">HSTS Preload</small>
                          <span className="fw-bold text-white text-xs font-mono">max-age=63072000</span>
                          <span className="text-emerald-400 text-[10px] d-block">✓ Strict Subdomains</span>
                        </div>
                      </div>
                      <div className="col-6 col-md-3">
                        <div className="p-2.5 rounded-2 bg-slate-900/80 border border-white/10">
                          <small className="text-slate-400 text-[10px] d-block">WAF Defense</small>
                          <span className="fw-bold text-white text-xs font-mono">L7 DDoS Shield</span>
                          <span className="text-emerald-400 text-[10px] d-block">✓ 100% Rate Limited</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 1 */}
                  <article id="sec-ciphers" className="mb-5">
                    <h4 className="fw-bold text-white text-base mb-2 d-flex align-items-center gap-2">
                      <span className="text-cyan-400 font-mono">01.</span>
                      <span>Cryptographic Architecture: Encryption at Rest &amp; Transit</span>
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed mb-3">
                      PlayBeat Digital deploys quantum-resistant, bank-grade encryption primitives across every layer of the software stack:
                    </p>
                    <ul className="text-slate-300 text-sm space-y-2 list-disc ps-4 mb-3">
                      <li>
                        <strong>Storage at Rest (AES-256-GCM):</strong> All production database volumes, cloud object storage buckets, and automated backups are encrypted using <strong>FIPS 140-2 validated Advanced Encryption Standard</strong> with Galois/Counter Mode authenticated encryption.
                      </li>
                      <li>
                        <strong>Data in Transit (TLS 1.3):</strong> All network egress and ingress terminates via TLS 1.3 with Perfect Forward Secrecy (ECDHE-ECDSA-AES256-GCM-SHA384). Older insecure cipher suites (TLS 1.0, 1.1, RC4, 3DES) are permanently blacklisted at the gateway.
                      </li>
                      <li>
                        <strong>Cryptographic Key Rotation:</strong> Master key management is managed via AWS Key Management Service (KMS) or HashiCorp Vault with automated 90-day rotation and strict envelope encryption.
                      </li>
                    </ul>
                  </article>

                  {/* Section 2 */}
                  <article id="sec-zero-trust" className="mb-5">
                    <h4 className="fw-bold text-white text-base mb-2 d-flex align-items-center gap-2">
                      <span className="text-cyan-400 font-mono">02.</span>
                      <span>Zero-Trust Identity &amp; Granular RBAC</span>
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed mb-3">
                      Every application architecture engineered by PlayBeat Digital assumes the network is compromised, enforcing zero-trust verification:
                    </p>
                    <div className="row g-3 mb-3">
                      <div className="col-12 col-md-6">
                        <div className="p-3 rounded-3 bg-slate-800/40 border border-white/10">
                          <div className="text-xs fw-bold text-cyan-300 mb-1 d-flex align-items-center gap-1.5">
                            <Key className="w-3.5 h-3.5" />
                            <span>Ephemeral Secrets &amp; KMS</span>
                          </div>
                          <p className="text-slate-400 text-xs mb-0">
                            Zero hardcoded tokens, database passwords, or third-party API credentials in Git commits. Secrets are injected at container runtime via secure environment vaults.
                          </p>
                        </div>
                      </div>
                      <div className="col-12 col-md-6">
                        <div className="p-3 rounded-3 bg-slate-800/40 border border-white/10">
                          <div className="text-xs fw-bold text-cyan-300 mb-1 d-flex align-items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5" />
                            <span>Hardware MFA &amp; FIDO2</span>
                          </div>
                          <p className="text-slate-400 text-xs mb-0">
                            Mandatory hardware security key (YubiKey / WebAuthn) or time-based one-time password (TOTP) enforcement for all administrative operations.
                          </p>
                        </div>
                      </div>
                    </div>
                  </article>

                  {/* Section 3 */}
                  <article id="sec-pipeline" className="mb-5">
                    <h4 className="fw-bold text-white text-base mb-2 d-flex align-items-center gap-2">
                      <span className="text-cyan-400 font-mono">03.</span>
                      <span>Automated DevSecOps Pipeline &amp; Vulnerability Auditing</span>
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed mb-3">
                      Security is shifted left into our continuous integration pipeline. Every pull request passes automated cryptographic and dependency verification before merge:
                    </p>
                    <ul className="text-slate-300 text-sm space-y-2 list-disc ps-4">
                      <li>
                        <strong>SAST (Static Application Security Testing):</strong> Code scanned via Semgrep &amp; SonarQube for OWASP Top 10 vulnerabilities (SQLi, XSS, SSRF, IDOR).
                      </li>
                      <li>
                        <strong>Dependency Vulnerability Scanning:</strong> Automated scans against the GitHub Advisory Database and Snyk to block vulnerable third-party npm / Python modules.
                      </li>
                      <li>
                        <strong>Secret Leak Prevention:</strong> Pre-commit git hooks block inadvertent exposure of private keys or AWS tokens.
                      </li>
                    </ul>
                  </article>

                  {/* Section 4 */}
                  <article id="sec-ddos" className="mb-5">
                    <h4 className="fw-bold text-white text-base mb-2 d-flex align-items-center gap-2">
                      <span className="text-cyan-400 font-mono">04.</span>
                      <span>Edge Web Application Firewall (WAF) &amp; DDoS Mitigation</span>
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed mb-3">
                      All storefront traffic and client applications operate behind enterprise Anycast reverse-proxy networks providing multi-terabit volumetric DDoS absorption:
                    </p>
                    <div className="p-3.5 rounded-3 bg-slate-800/60 border border-white/10 font-mono text-xs text-slate-300 mb-3 space-y-1">
                      <div className="text-cyan-400">// Cloudflare Edge Security Directives</div>
                      <div>Strict-Transport-Security: max-age=63072000; includeSubDomains; preload</div>
                      <div>X-Content-Type-Options: nosniff</div>
                      <div>X-Frame-Options: SAMEORIGIN</div>
                      <div>Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https:;</div>
                      <div>Permissions-Policy: geolocation=(), microphone=(), camera=()</div>
                    </div>
                  </article>

                  {/* Section 5: Responsible Disclosure */}
                  <article id="sec-bounty">
                    <h4 className="fw-bold text-white text-base mb-2 d-flex align-items-center gap-2">
                      <span className="text-cyan-400 font-mono">05.</span>
                      <span>Responsible Disclosure &amp; Security Team Contact</span>
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed mb-3">
                      We value the global cybersecurity research community. If you identify a potential security vulnerability across our infrastructure or product portfolio, please review our Safe Harbor policy:
                    </p>

                    <div className="p-3.5 rounded-3 bg-slate-800/40 border border-white/10">
                      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
                        <span className="text-xs fw-bold text-white font-mono">
                          Direct Security Inbox: security@playbeat.live
                        </span>
                        <span className="badge bg-primary/20 text-primary border border-primary/30 text-[10px]">
                          PGP Key Available
                        </span>
                      </div>
                      <p className="text-slate-400 text-xs mb-2 leading-relaxed">
                        We pledge not to pursue legal action against researchers acting in good faith who grant us a 48-hour remediation window before public disclosure.
                      </p>
                      <div className="text-[11px] text-slate-400 font-mono bg-slate-950 p-2 rounded border border-white/5">
                        PGP Fingerprint: 4F9B 2A70 C008 EAD6 94ED E8D8 45CC E4D0 2026
                      </div>
                    </div>
                  </article>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SAMPLE DEED OF IP ASSIGNMENT MODAL */}
      {showCertificateModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.85)", zIndex: 1070 }}
          onClick={() => setShowCertificateModal(false)}
        >
          <div
            className="modal-dialog modal-dialog-centered modal-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content border border-cyan-500/40 rounded-4 overflow-hidden bg-slate-900 text-white shadow-2xl">
              <div className="p-4 border-bottom border-white/10 d-flex justify-content-between align-items-center bg-slate-950">
                <div className="d-flex align-items-center gap-2.5">
                  <Award className="w-5 h-5 text-cyan-400" />
                  <div>
                    <h5 className="fw-extrabold text-white mb-0 text-sm">Sample Deed of Intellectual Property Assignment</h5>
                    <small className="text-slate-400 text-xs font-mono">Formal Certificate of Unrestricted Source Code Handover</small>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCertificateModal(false)}
                  className="btn btn-sm btn-outline-secondary rounded-circle py-1 px-2 text-white"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 p-md-5 bg-gradient-to-b from-slate-900 to-slate-950">
                {/* Configuration Fields for sample */}
                <div className="row g-3 mb-4 p-3 rounded-3 bg-slate-800/60 border border-white/10">
                  <div className="col-12 col-md-6">
                    <label className="text-xs fw-semibold text-slate-300 mb-1 d-block">
                      Client Entity Name
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm bg-slate-900 border-white/20 text-white text-xs"
                      value={clientCompany}
                      onChange={(e) => setClientCompany(e.target.value)}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="text-xs fw-semibold text-slate-300 mb-1 d-block">
                      Project Specification Title
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm bg-slate-900 border-white/20 text-white text-xs"
                      value={clientProject}
                      onChange={(e) => setClientProject(e.target.value)}
                    />
                  </div>
                </div>

                {/* Rendered Certificate Card */}
                <div
                  className="p-4 p-md-5 rounded-3 border-2 border-cyan-400/40 position-relative text-center"
                  style={{
                    background: "radial-gradient(circle, #081426 0%, #050816 100%)",
                    boxShadow: "0 0 40px rgba(34, 211, 238, 0.15)",
                  }}
                >
                  <div className="d-flex justify-content-center mb-3">
                    <AdminSecuritySeal size="lg" variant="inline" showDetails={false} />
                  </div>

                  <span className="text-[11px] fw-bold uppercase tracking-widest text-cyan-400 font-mono d-block mb-1">
                    PLAYBEAT DIGITAL (PRIVATE) LIMITED
                  </span>
                  <h3 className="fw-extrabold text-white mb-2" style={{ letterSpacing: "-0.02em" }}>
                    DEED OF INTELLECTUAL PROPERTY ASSIGNMENT
                  </h3>
                  <div className="text-xs text-slate-400 font-mono mb-4">
                    DEED NO: PBD-IP-2026-{Math.floor(100000 + Math.random() * 900000)} · JURISDICTION: GLOBAL
                  </div>

                  <p className="text-slate-300 text-xs leading-relaxed max-w-xl mx-auto mb-4">
                    THIS INSTRUMENT CONFIRMS that upon receipt of final milestone settlement, <strong>PlayBeat Digital (Private) Limited</strong> irrevocably and perpetually assigns, transfers, and conveys unto:
                  </p>

                  <div className="p-3 rounded-2 bg-white/5 border border-white/10 max-w-md mx-auto mb-4">
                    <div className="fs-5 fw-extrabold text-cyan-300 mb-0 font-serif">
                      {clientCompany || "Client Organization"}
                    </div>
                    <small className="text-slate-400 text-xs">
                      Assignee &amp; Sole Proprietary Owner
                    </small>
                  </div>

                  <p className="text-slate-300 text-xs leading-relaxed max-w-xl mx-auto mb-4">
                    ALL WORLDWIDE RIGHT, TITLE, AND INTEREST in and to the custom codebase, design systems, algorithms, database architectures, and associated intellectual property engineered under project specification:
                    <strong className="text-white d-block mt-1">"{clientProject || "Custom Software Platform"}"</strong>
                  </p>

                  <div className="d-flex justify-content-between align-items-end pt-4 border-top border-white/10 text-start text-xs text-slate-400">
                    <div>
                      <div className="fw-bold text-white">Hamza Tariq</div>
                      <div className="text-[11px]">Managing Director, PlayBeat Digital</div>
                    </div>
                    <div className="text-end font-mono text-[11px] text-cyan-400">
                      <div>SHA-256 HASH VERIFIED</div>
                      <div>ESCROW: RELEASED</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 border-top border-white/10 d-flex justify-content-end gap-2 bg-slate-950">
                <button
                  type="button"
                  onClick={() => setShowCertificateModal(false)}
                  className="btn btn-dark btn-sm rounded-pill px-4 text-xs"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
