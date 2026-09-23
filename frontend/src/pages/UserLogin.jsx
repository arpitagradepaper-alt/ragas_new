
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./UserLogin.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function UserLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const API_URL =
        API_BASE_URL;

      const response = await fetch(
        `${API_URL}/api/auth/user/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Invalid email or password.");
        setLoading(false);
        return;
      }

      // The current backend may return the account as either `user` or
      // `admin`; keep the profile data under one consistent browser key.
      const loggedInUser = data.user || data.admin;

      if (!loggedInUser) {
        setError("Login succeeded, but profile details were not received.");
        setLoading(false);
        return;
      }

      // ==============================
      // SAVE LOGIN DATA
      // ==============================

      if (rememberMe) {
        localStorage.setItem("ragasUserToken", data.token);
        localStorage.setItem("ragasUserLoggedIn", "true");
        localStorage.setItem(
          "ragasUser",
          JSON.stringify(loggedInUser)
        );
      } else {
        sessionStorage.setItem("ragasUserToken", data.token);
        sessionStorage.setItem("ragasUserLoggedIn", "true");
        sessionStorage.setItem(
          "ragasUser",
          JSON.stringify(loggedInUser)
        );
      }

      setLoading(false);

      // ==============================
      // GO TO WEBSITE
      // ==============================
      const requestedPage = location.state?.from;
      navigate(
        requestedPage
          ? `${requestedPage.pathname}${requestedPage.search || ""}${requestedPage.hash || ""}`
          : "/"
      );
    } catch (error) {
      console.error("Login error:", error);

      setError(
        "Unable to connect to the server. Please try again."
      );

      setLoading(false);
    }
  };

  return (
    <div className="user-login-page">

      {/* LEFT SIDE */}
      <div className="user-login-left">

        <div className="user-login-brand">
          <strong>RAGAS</strong>
          <span>CAREER WORLD</span>
        </div>

        <div className="user-login-left-content">

          <p className="user-login-eyebrow">
            JOB SEEKER PORTAL
          </p>

          <h1>
            Welcome back.
            <span> Your career journey continues here.</span>
          </h1>

          <p className="user-login-description">
            Sign in to explore opportunities, manage your
            applications, and keep your professional profile updated.
          </p>

        </div>

        <div className="user-login-copyright">
          © 2026 RAGAS CAREER WORLD
        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="user-login-right">

        <div className="user-login-card">

          <div className="user-login-icon">
            ♙
          </div>

          <p className="user-login-card-eyebrow">
            JOB SEEKER LOGIN
          </p>

          <h2>
            Welcome back
          </h2>

          <p className="user-login-card-description">
            Sign in to access your account and continue your career journey.
          </p>

          {error && (
            <div className="user-login-error">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>

            {/* EMAIL */}
            <div className="user-login-field">

              <label>
                Email Address
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
              />

            </div>

            {/* PASSWORD */}
            <div className="user-login-field">

              <label>
                Password
              </label>

              <div className="user-login-password">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
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

            {/* OPTIONS */}
            <div className="user-login-options">

              <label className="user-login-remember">

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(e.target.checked)
                  }
                />

                <span>
                  Remember me
                </span>

              </label>

              <button
                type="button"
                className="user-login-forgot"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot password?
              </button>

            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="user-login-btn"
              disabled={loading}
            >
              {loading
                ? "Signing In..."
                : "Sign In"}

              {!loading && <span>→</span>}
            </button>

          </form>

          {/* REGISTER */}
          <div className="user-login-register">

            <span>
              Don't have an account?
            </span>

            <button
              type="button"
              onClick={() =>
                navigate("/user-registration", {
                  state: { from: location.state?.from },
                })
              }
            >
              Create Account
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default UserLogin;
