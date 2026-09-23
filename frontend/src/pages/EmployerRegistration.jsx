import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  User,
  Mail,
  Phone,
  Globe,
  MapPin,
  BriefcaseBusiness,
  Users,
  FileText,
  CheckCircle2,
} from "lucide-react";

import "./EmployerRegistration.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const API_URL = API_BASE_URL;

function EmployerRegistration() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    website: "",
    industry: "",
    location: "",
    companySize: "",
    hiringRequirement: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName: formData.companyName,
          contactPerson: formData.contactPerson,
          email: formData.email,
          phone: formData.phone,
          industry: formData.industry,
          companyWebsite: formData.website,
          companySize: formData.companySize,
          location: formData.location,
          hiringNeeds: formData.hiringRequirement,
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to submit registration.");
      }

      console.log("Employer saved:", data);

      setSubmitted(true);
    } catch (err) {
      console.error("Employer Registration Error:", err);

      setError(
        err.message ||
          "Something went wrong. Please check the backend server."
      );
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <main className="employer-registration-page">
        <div className="registration-success">
          <div className="success-icon">
            <CheckCircle2 size={38} />
          </div>

          <p className="registration-eyebrow">
            REGISTRATION SUBMITTED
          </p>

          <h1>Thank You for Registering</h1>

          <p>
            Your employer registration has been successfully submitted.
            Our team will review your details and contact you shortly.
          </p>

          <div className="success-actions">
            <button onClick={() => navigate("/")}>
              Back to Website
            </button>

            <button
              className="success-outline"
              onClick={() => navigate("/#contact")}
            >
              Contact Us
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="employer-registration-page">
      <section className="registration-container">

        {/* HEADER */}
        <div className="registration-header">
          <p className="registration-eyebrow">
            FOR EMPLOYERS
          </p>

          <h1>Register Your Company</h1>

          <p>
            Partner with RAGAS CAREER WORLD to connect with qualified
            talent across India and international markets.
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div
            style={{
              marginBottom: "20px",
              padding: "14px 16px",
              borderRadius: "10px",
              background: "#fff1f1",
              color: "#b42318",
              border: "1px solid #f3b5b5",
            }}
          >
            {error}
          </div>
        )}

        {/* FORM */}
        <form
          className="employer-registration-form"
          onSubmit={handleSubmit}
        >

          {/* COMPANY INFORMATION */}
          <div className="form-section">
            <div className="form-section-title">
              <Building2 size={19} />

              <div>
                <h2>Company Information</h2>
                <p>Tell us about your organisation.</p>
              </div>
            </div>

            <div className="form-grid">

              <div className="form-group">
                <label>Company Name *</label>

                <div className="input-wrapper">
                  <Building2 size={17} />

                  <input
                    type="text"
                    name="companyName"
                    placeholder="Enter company name"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Industry *</label>

                <div className="input-wrapper">
                  <BriefcaseBusiness size={17} />

                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select industry</option>
                    <option>Information Technology</option>
                    <option>Healthcare</option>
                    <option>Banking & Finance</option>
                    <option>Manufacturing</option>
                    <option>Construction</option>
                    <option>Hospitality</option>
                    <option>Logistics</option>
                    <option>Aviation</option>
                    <option>Retail</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Company Website</label>

                <div className="input-wrapper">
                  <Globe size={17} />

                  <input
                    type="url"
                    name="website"
                    placeholder="https://company.com"
                    value={formData.website}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Company Size *</label>

                <div className="input-wrapper">
                  <Users size={17} />

                  <select
                    name="companySize"
                    value={formData.companySize}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select company size</option>
                    <option>1–10 employees</option>
                    <option>11–50 employees</option>
                    <option>51–200 employees</option>
                    <option>201–500 employees</option>
                    <option>501–1000 employees</option>
                    <option>1000+ employees</option>
                  </select>
                </div>
              </div>

              <div className="form-group full-width">
                <label>Company Location *</label>

                <div className="input-wrapper">
                  <MapPin size={17} />

                  <input
                    type="text"
                    name="location"
                    placeholder="City, State, Country"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

            </div>
          </div>

          {/* CONTACT INFORMATION */}
          <div className="form-section">
            <div className="form-section-title">
              <User size={19} />

              <div>
                <h2>Contact Information</h2>
                <p>
                  Primary contact for recruitment communication.
                </p>
              </div>
            </div>

            <div className="form-grid">

              <div className="form-group">
                <label>Contact Person *</label>

                <div className="input-wrapper">
                  <User size={17} />

                  <input
                    type="text"
                    name="contactPerson"
                    placeholder="Full name"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Official Email *</label>

                <div className="input-wrapper">
                  <Mail size={17} />

                  <input
                    type="email"
                    name="email"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label>Phone Number *</label>

                <div className="input-wrapper">
                  <Phone size={17} />

                  <input
                    type="tel"
                    name="phone"
                    placeholder="+91 XXXXX XXXXX"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

            </div>
          </div>

          {/* HIRING REQUIREMENT */}
          <div className="form-section">
            <div className="form-section-title">
              <BriefcaseBusiness size={19} />

              <div>
                <h2>Hiring Requirements</h2>
                <p>
                  Help us understand your recruitment needs.
                </p>
              </div>
            </div>

            <div className="form-group">
              <label>Current Hiring Requirement *</label>

              <textarea
                name="hiringRequirement"
                placeholder="Example: We need 20 software developers with 3+ years of experience..."
                value={formData.hiringRequirement}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Additional Message</label>

              <textarea
                name="message"
                placeholder="Tell us anything else about your hiring requirements..."
                value={formData.message}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* DOCUMENT NOTE */}
          <div className="verification-note">
            <FileText size={18} />

            <div>
              <strong>Employer Verification</strong>

              <p>
                After submission, our team may contact you for company
                verification and additional documentation.
              </p>
            </div>
          </div>

          {/* SUBMIT */}
          <div className="registration-submit">
            <button type="submit" disabled={loading}>
              {loading
                ? "Submitting..."
                : "Submit Employer Registration"}
            </button>

            <p>
              By submitting this form, you agree to be contacted by
              RAGAS CAREER WORLD regarding recruitment services.
            </p>
          </div>

        </form>
      </section>
    </main>
  );
}

export default EmployerRegistration;