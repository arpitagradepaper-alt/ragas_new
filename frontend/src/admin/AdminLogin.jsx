import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
     const API_URL = API_BASE_URL;

      const response = await fetch(
        `${API_URL}/api/auth/admin/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(
          data.message || "Invalid admin email or password."
        );
        setLoading(false);
        return;
      }

      /*
       * ADMIN AUTHENTICATION
       *
       * Backend has already verified:
       * - email
       * - password
       * - admin account
       *
       * Store the JWT token and admin role.
       */

      localStorage.setItem("ragasAdminLoggedIn", "true");
      localStorage.setItem("ragasAdminToken", data.token);

      const adminData = {
        ...(data.admin || {}),
        role: "admin",
      };

      localStorage.setItem(
        "ragasAdmin",
        JSON.stringify(adminData)
      );

      // Store role separately for quick frontend checks
      localStorage.setItem("ragasUserRole", "admin");

      setLoading(false);

      // Open admin dashboard
      navigate("/admin");
    } catch (error) {
      console.error("Admin login error:", error);

      setError(
        "Unable to connect to the server. Please try again."
      );

      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">

      <div className="admin-login-left">

        <div className="login-brand">
          <strong>RAGAS</strong>
          <span>CAREER WORLD</span>
        </div>

        <div className="login-left-content">

          <p>ADMINISTRATION PORTAL</p>

          <h1>
            Manage your recruitment
            <span> platform with confidence.</span>
          </h1>

          <div className="login-features">

            <div>
              <span>✓</span>
              <p>Manage candidates & employers</p>
            </div>

            <div>
              <span>✓</span>
              <p>Monitor chatbot conversations</p>
            </div>

            <div>
              <span>✓</span>
              <p>Control jobs, resumes & partners</p>
            </div>

          </div>

        </div>

        <div className="login-copyright">
          © 2026 RAGAS CAREER WORLD
        </div>

      </div>

      <div className="admin-login-right">

        <div className="login-card">

          <div className="login-icon">
            ♙
          </div>

          <p className="login-eyebrow">
            SECURE ACCESS
          </p>

          <h2>Welcome back</h2>

          <p className="login-description">
            Sign in to access the RAGAS Career World admin dashboard.
          </p>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>

            <div className="login-field">

              <label>Email Address</label>

              <input
                type="email"
                placeholder="admin@ragascareerworld.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

            </div>

            <div className="login-field">

              <label>Password</label>

              <div className="password-input">

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>

            </div>

            <div className="login-options">

              <label>
                <input type="checkbox" />
                Remember me
              </label>

              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot password?
              </button>

            </div>

            <button
              type="submit"
              className="admin-login-btn"
              disabled={loading}
            >
              {loading
                ? "Signing In..."
                : "Sign In to Admin Panel"}

              {!loading && <span>→</span>}
            </button>

          </form>

          <div className="login-security">
            <span>🔒</span>
            Secure administrator access
          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminLogin;