import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const API_URL = API_BASE_URL;

function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOtp = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/user/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) throw new Error(data.message);
      setMessage(data.message);
      setStep("reset");
    } catch (requestError) {
      setError(requestError.message || "Unable to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/user/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) throw new Error(data.message);
      navigate("/user-login", { state: { resetMessage: data.message } });
    } catch (requestError) {
      setError(requestError.message || "Unable to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="forgot-password-page">
      <section className="forgot-password-card">
        <p className="forgot-password-eyebrow">RAGAS CAREER WORLD</p>
        <h1>{step === "email" ? "Reset your password" : "Enter your OTP"}</h1>
        <p>
          {step === "email"
            ? "Enter your registered email and we will send a six-digit OTP."
            : `Enter the OTP sent to ${email}, then choose your new password.`}
        </p>

        {message && <div className="forgot-password-message">{message}</div>}
        {error && <div className="forgot-password-error">{error}</div>}

        {step === "email" ? (
          <form onSubmit={sendOtp}>
            <label>Email address</label>
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            <button type="submit" disabled={loading}>{loading ? "Sending OTP..." : "Send OTP"}</button>
          </form>
        ) : (
          <form onSubmit={resetPassword}>
            <label>Six-digit OTP</label>
            <input inputMode="numeric" maxLength="6" value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))} required />
            <label>New password</label>
            <input type="password" minLength="6" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required />
            <label>Confirm new password</label>
            <input type="password" minLength="6" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required />
            <button type="submit" disabled={loading}>{loading ? "Updating..." : "Reset password"}</button>
            <button className="forgot-password-link" type="button" onClick={sendOtp} disabled={loading}>Resend OTP</button>
          </form>
        )}

        <button className="forgot-password-back" type="button" onClick={() => navigate("/user-login")}>Back to sign in</button>
      </section>
    </main>
  );
}

export default ForgotPassword;
