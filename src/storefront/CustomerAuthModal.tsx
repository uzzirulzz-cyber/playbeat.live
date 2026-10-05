import React, { useState } from "react";
import { useStore } from "../context/StoreContext";
import { api } from "../services/api";

export const CustomerAuthModal: React.FC = () => {
  const { isAuthOpen, setIsAuthOpen, authMode, setAuthMode, setUser, showToast } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isAuthOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (authMode === "login") {
        const res = await api.customerLogin(email, password);
        setUser(res.user);
        showToast(`Welcome back, ${res.user.name}`);
        setIsAuthOpen(false);
      } else {
        const res = await api.register(name, email, password, phone);
        setUser(res.user);
        showToast(`Account created! Welcome, ${res.user.name}`);
        setIsAuthOpen(false);
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async (overrideEmail?: string, overrideName?: string) => {
    setError("");
    setGoogleLoading(true);

    try {
      // Simulate/Trigger Google ID Token payload
      // In production, GIDSignIn (iOS) or google.accounts.id (Web) supplies the signed JWT idToken.
      // We pass the token payload to the backend /tokensignin endpoint.
      const targetEmail = overrideEmail || "playbeatdigital@gmail.com";
      const targetName = overrideName || "PlayBeat Digital";

      // Create a standard base64 Google ID token representation for verification
      const header = btoa(JSON.stringify({ alg: "RS256", typ: "JWT", kid: "google_cert_key_1" }));
      const payload = btoa(
        JSON.stringify({
          iss: "https://accounts.google.com",
          sub: "118239048102938491023",
          email: targetEmail,
          email_verified: true,
          name: targetName,
          picture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80",
          given_name: targetName.split(" ")[0],
          family_name: targetName.split(" ")[1] || "",
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 3600,
        })
      );
      const signature = btoa("valid_google_rsa_signature_sample");
      const clientGoogleIdToken = `${header}.${payload}.${signature}`;

      const res = await api.googleSignIn(clientGoogleIdToken, {
        email: targetEmail,
        name: targetName,
        picture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80",
        userId: "118239048102938491023",
      });

      setUser(res.user);
      showToast(`Signed in with Google as ${res.user.name}`);
      setIsAuthOpen(false);
    } catch (err: any) {
      setError(err.message || "Failed to verify Google ID token.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleAutofillDemo = () => {
    setEmail("sophia@example.com");
    setPassword("password123");
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1060 }}>
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "420px" }}>
        <div className="modal-content border-0 shadow-2xl rounded-4 overflow-hidden">
          {/* Header */}
          <div className="modal-header border-bottom py-3 px-4 bg-light">
            <h5 className="modal-title fw-bold text-dark fs-6 mb-0">
              {authMode === "login" ? "Customer Sign In" : "Create Member Account"}
            </h5>
            <button type="button" className="btn-close" onClick={() => setIsAuthOpen(false)}></button>
          </div>

          <div className="modal-body p-4 space-y-3">
            {/* Google Sign-In Button */}
            <div className="mb-3">
              <button
                type="button"
                disabled={googleLoading}
                onClick={() => handleGoogleSignIn()}
                className="btn btn-outline-dark w-100 py-2.5 rounded-3 fw-bold text-xs d-flex align-items-center justify-content-center gap-2.5 shadow-sm hover:bg-light transition-all border"
                style={{ borderColor: "#dadce0" }}
              >
                {googleLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status"></span>
                    <span>Verifying with Google...</span>
                  </>
                ) : (
                  <>
                    {/* Official Multi-colored Google G Icon */}
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.26-2.09 3.675-5.17 3.675-9.15z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.05c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.28v3.15C3.26 21.26 7.36 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.28C.46 8.24 0 10.06 0 12s.46 3.76 1.28 5.39l3.99-3.15z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.74 1.28 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.73-4.96z"
                      />
                    </svg>
                    <span>Sign in with Google</span>
                  </>
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="d-flex align-items-center gap-2 my-3 text-muted text-[11px]">
              <hr className="flex-grow-1 my-0 opacity-25" />
              <span className="text-uppercase fw-semibold text-secondary">or continue with email</span>
              <hr className="flex-grow-1 my-0 opacity-25" />
            </div>

            {/* Mode Switch Tabs */}
            <div className="btn-group btn-group-sm w-100 mb-2">
              <button
                type="button"
                onClick={() => setAuthMode("login")}
                className={`btn ${authMode === "login" ? "btn-dark text-white fw-bold" : "btn-light border"}`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setAuthMode("register")}
                className={`btn ${authMode === "register" ? "btn-dark text-white fw-bold" : "btn-light border"}`}
              >
                Create Account
              </button>
            </div>

            {error && (
              <div className="alert alert-danger py-2 px-3 small rounded-3 mb-2" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              {authMode === "register" && (
                <>
                  <div>
                    <label className="form-label text-xs fw-semibold text-secondary">Full Name *</label>
                    <input
                      type="text"
                      required
                      className="form-control form-control-sm"
                      placeholder="e.g. Alex Morgan"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="form-label text-xs fw-semibold text-secondary">Phone Number</label>
                    <input
                      type="tel"
                      className="form-control form-control-sm"
                      placeholder="e.g. +1 (555) 234-8901"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </>
              )}

              <div>
                <label className="form-label text-xs fw-semibold text-secondary">Email Address *</label>
                <input
                  type="email"
                  required
                  className="form-control form-control-sm"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="form-label text-xs fw-semibold text-secondary">Password *</label>
                <input
                  type="password"
                  required
                  className="form-control form-control-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-100 rounded-pill fw-bold text-xs py-2.5 mt-2"
              >
                {loading ? "Verifying..." : authMode === "login" ? "Sign In" : "Register Account"}
              </button>
            </form>

            {authMode === "login" && (
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={handleAutofillDemo}
                  className="btn btn-link btn-sm text-decoration-none text-muted text-[11px]"
                >
                  Quick Demo Login: sophia@example.com / password123
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
