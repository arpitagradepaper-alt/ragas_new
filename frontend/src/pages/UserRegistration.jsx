
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./UserRegistration.css";
import ragasLogo from "../assets/ragas-logo.png";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function UserRegistration() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const API_URL =
        API_BASE_URL;

      const response = await fetch(
        `${API_URL}/api/auth/user/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(
          data.message || "Registration failed. Please try again."
        );
        setLoading(false);
        return;
      }

      setLoading(false);

      // Registration successful
      navigate("/user-login", { state: { from: location.state?.from } });
    } catch (error) {
      console.error("Registration error:", error);

      setError(
        "Unable to connect to the server. Please try again."
      );

      setLoading(false);
    }
  };

  return (
    <div className="user-register-page">

      {/* LEFT SIDE */}
      <div className="user-register-left">

        <div className="user-register-brand">
          <img
            src={ragasLogo}
            alt="RAGAS Career World"
            className="user-register-logo"
          />

         
        </div>

        <div className="user-register-left-content">

          <p className="user-register-eyebrow">
            JOB SEEKER PORTAL
          </p>

          <h1>
            Start your career
            <span> journey with us.</span>
          </h1>

          <p className="user-register-description">
            Create your RAGAS Career World account to discover
            opportunities, manage applications, and build your
            professional profile.
          </p>

          <div className="user-register-features">

            <div>
              <span>✓</span>
              <p>Discover relevant job opportunities</p>
            </div>

            <div>
              <span>✓</span>
              <p>Manage your job applications</p>
            </div>

            <div>
              <span>✓</span>
              <p>Keep your resume and profile updated</p>
            </div>

          </div>

        </div>

        <div className="user-register-copyright">
          © 2026 RAGAS CAREER WORLD
        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="user-register-right">

        <div className="user-register-card">

          <div className="user-register-icon">
            ♙
          </div>

          <p className="user-register-card-eyebrow">
            JOB SEEKER REGISTRATION
          </p>

          <h2>
            Create your account
          </h2>

          <p className="user-register-card-description">
            Register to access job opportunities and manage your
            career profile.
          </p>

          {error && (
            <div className="user-register-error">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister}>

            {/* FULL NAME */}
            <div className="user-register-field">

              <label>
                Full Name
              </label>

              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
              />

            </div>

            {/* EMAIL */}
            <div className="user-register-field">

              <label>
                Email Address
              </label>

              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />

            </div>

            {/* PHONE */}
            <div className="user-register-field">

              <label>
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
              />

            </div>

            {/* PASSWORD */}
            <div className="user-register-field">

              <label>
                Password
              </label>

              <div className="user-register-password">

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
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

            {/* CONFIRM PASSWORD */}
            <div className="user-register-field">

              <label>
                Confirm Password
              </label>

              <div className="user-register-password">

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>

              </div>

            </div>

            {/* TERMS */}
            <div className="user-register-terms">

              <input
                type="checkbox"
                required
              />

              <span>
                I agree to the Terms & Conditions and Privacy Policy.
              </span>

            </div>

            {/* REGISTER BUTTON */}
            <button
              type="submit"
              className="user-register-btn"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}

              {!loading && <span>→</span>}
            </button>

          </form>

          {/* LOGIN */}
          <div className="user-register-login">

            <span>
              Already have an account?
            </span>

            <button
              type="button"
              onClick={() =>
                navigate("/user-login")
              }
            >
              Sign In
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default UserRegistration;

