import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PartnerLogin.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const API_URL = `${API_BASE_URL}/api/auth/partner`;

function PartnerLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Partner login failed."
        );
      }

      /* -----------------------------------------
         SAVE LOGIN DATA
      ----------------------------------------- */

      localStorage.setItem(
        "ragasPartnerToken",
        data.token
      );

      localStorage.setItem(
        "ragasPartnerLoggedIn",
        "true"
      );

      localStorage.setItem(
        "ragasPartner",
        JSON.stringify(data.partner)
      );

      /* -----------------------------------------
         GO TO PARTNER DASHBOARD
      ----------------------------------------- */

      navigate("/partner-dashboard");
    } catch (error) {
      console.error("Partner login error:", error);

      setError(
        error.message ||
          "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="partner-login-page">
      <div className="partner-login-card">

        <div className="partner-login-header">
          <h1>Partner Login</h1>

          <p>
            Login to access your RAGAS Career World
            Partner Dashboard.
          </p>
        </div>

        {error && (
          <div className="partner-login-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="partner-login-field">
            <label htmlFor="email">
              Email Address
            </label>

            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your registered email"
              autoComplete="email"
            />
          </div>

          <div className="partner-login-field">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="partner-login-button"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <div className="partner-login-footer">
          <p>
            Not a partner yet?
          </p>

          <button
            type="button"
            onClick={() => navigate("/partner-with-us")}
          >
            Partner With Us
          </button>
        </div>

      </div>
    </div>
  );
}

export default PartnerLogin;