import { useEffect, useState } from "react";

function AdminPostJobModal({
  isOpen,
  onClose,
  onJobCreated,
  API_URL = API_BASE_URL,
}) {
  const [postFor, setPostFor] = useState("self"); // 'self' | 'partner'
  const [partnersList, setPartnersList] = useState([]);

  const [formData, setFormData] = useState({
    partnerId: "",
    companyName: "RAGAS CAREER WORLD",
    jobTitle: "",
    jobType: "Full Time",
    category: "",
    experience: "",
    qualification: "",
    location: "",
    country: "India",
    salary: "",
    skills: "",
    description: "",
    requirements: "",
    contactEmail: "",
    contactPhone: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Agar backend me /api/partners route hai to partners fetch honge
  useEffect(() => {
    if (!isOpen) return;

    fetch(`${API_URL}/api/partners`, { headers: { Authorization: `Bearer ${localStorage.getItem("ragasAdminToken") || ""}` } })
      .then((res) => (res.ok ? res.json() : null))
      .then((resData) => {
        if (resData?.data && Array.isArray(resData.data)) {
          setPartnersList(resData.data);
        }
      })
      .catch(() => {
        setPartnersList([]);
      });
  }, [isOpen, API_URL]);

  if (!isOpen) return null;

  const handlePostForSelection = (mode) => {
    setPostFor(mode);
    if (mode === "self") {
      setFormData((prev) => ({
        ...prev,
        partnerId: "",
        companyName: "RAGAS CAREER WORLD",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        partnerId: "",
        companyName: "",
      }));
    }
  };

  const handlePartnerSelect = (e) => {
    const selectedId = e.target.value;
    const foundPartner = partnersList.find((p) => p._id === selectedId);

    setFormData((prev) => ({
      ...prev,
      partnerId: selectedId,
      companyName: foundPartner
        ? foundPartner.companyName || foundPartner.name
        : "",
      contactEmail: foundPartner?.email || prev.contactEmail,
      contactPhone: foundPartner?.phone || prev.contactPhone,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch(`${API_URL}/api/jobs/admin/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("ragasAdminToken") || ""}` },
        body: JSON.stringify({
          ...formData,
          postFor,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to create job.");
      }

      onJobCreated(result.data);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="applicants-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="applicants-modal"
        style={{
          maxWidth: "760px",
          maxHeight: "92vh",
          overflowY: "auto",
          padding: "24px",
          background: "#fff",
          borderRadius: "12px",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            borderBottom: "1px solid #eef2f6",
            paddingBottom: "12px",
            marginBottom: "16px",
          }}
        >
          <div>
            <span
              style={{
                fontSize: "12px",
                color: "#6b7280",
                fontWeight: "700",
                letterSpacing: "0.5px",
              }}
            >
              ADMIN PANEL
            </span>
            <h2 style={{ fontSize: "20px", color: "#111827", margin: "4px 0 0" }}>
              Post a New Job Vacancy
            </h2>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            style={{ fontSize: "26px", cursor: "pointer", background: "none", border: "none" }}
          >
            ×
          </button>
        </div>

        {errorMsg && (
          <div
            style={{
              padding: "10px 14px",
              background: "#fff4f4",
              color: "#b42318",
              borderRadius: "8px",
              marginBottom: "14px",
              fontSize: "14px",
            }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          
          {/* Post Destination Selection */}
          <div
            style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              padding: "12px 16px",
            }}
          >
            <label style={{ display: "block", fontSize: "13px", fontWeight: "700", marginBottom: "8px", color: "#1e293b" }}>
              Who is this job vacancy for?
            </label>
            <div style={{ display: "flex", gap: "24px" }}>
              <label style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontWeight: "600", fontSize: "14px" }}>
                <input
                  type="radio"
                  name="postTarget"
                  checked={postFor === "self"}
                  onChange={() => handlePostForSelection("self")}
                />
                Ragas Career World (Internal / Own)
              </label>

              <label style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontWeight: "600", fontSize: "14px" }}>
                <input
                  type="radio"
                  name="postTarget"
                  checked={postFor === "partner"}
                  onChange={() => handlePostForSelection("partner")}
                />
                Employer / Client Partner
              </label>
            </div>
          </div>

          {/* Employer Fields if partner selected */}
          {postFor === "partner" && (
            <div style={{ display: "grid", gridTemplateColumns: partnersList.length > 0 ? "1fr 1fr" : "1fr", gap: "12px" }}>
              {partnersList.length > 0 && (
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "4px" }}>
                    Select Partner Company
                  </label>
                  <select
                    value={formData.partnerId}
                    onChange={handlePartnerSelect}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #d1d5db" }}
                  >
                    <option value="">-- Choose From Registered Partners --</option>
                    {partnersList.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.companyName || p.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "4px" }}>
                  Company Name *
                </label>
                <input
                  required
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="e.g. Wipro, TCS, Axis Bank"
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #d1d5db" }}
                />
              </div>
            </div>
          )}

          {/* Job Title & Category */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "4px" }}>
                Job Title *
              </label>
              <input
                required
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                placeholder="e.g. React Native Developer"
                style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #d1d5db" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "4px" }}>
                Category / Industry
              </label>
              <input
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. IT, Healthcare, BPO"
                style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #d1d5db" }}
              />
            </div>
          </div>

          {/* Job Type & Experience */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "4px" }}>
                Job Type *
              </label>
              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #d1d5db" }}
              >
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "4px" }}>
                Experience Required
              </label>
              <input
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="e.g. 1-3 Years / Freshers"
                style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #d1d5db" }}
              />
            </div>
          </div>

          {/* Location & Country */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "4px" }}>
                Location *
              </label>
              <input
                required
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Salt Lake, Kolkata"
                style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #d1d5db" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "4px" }}>
                Country
              </label>
              <input
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="e.g. India"
                style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #d1d5db" }}
              />
            </div>
          </div>

          {/* Salary & Qualification */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "4px" }}>
                Salary
              </label>
              <input
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="e.g. ₹20,000 - ₹30,000 / month"
                style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #d1d5db" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "4px" }}>
                Qualification
              </label>
              <input
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                placeholder="e.g. Graduate, B.Tech, Any"
                style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #d1d5db" }}
              />
            </div>
          </div>

          {/* Skills */}
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "4px" }}>
              Skills (Comma Separated)
            </label>
            <input
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g. React, JavaScript, Node.js, Communication"
              style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #d1d5db" }}
            />
          </div>

          {/* Description */}
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "4px" }}>
              Job Description *
            </label>
            <textarea
              required
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed job overview and responsibilities..."
              style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #d1d5db" }}
            />
          </div>

          {/* Requirements */}
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "4px" }}>
              Requirements / Key Highlights
            </label>
            <textarea
              rows={2}
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              placeholder="Specific criteria, shifts, or certifications required..."
              style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #d1d5db" }}
            />
          </div>

          {/* Contact Details */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "4px" }}>
                Contact Email
              </label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                placeholder="contact@ragasworld.com"
                style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #d1d5db" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "4px" }}>
                Contact Phone
              </label>
              <input
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                placeholder="+91 9876543210"
                style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #d1d5db" }}
              />
            </div>
          </div>

          {/* Actions */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              marginTop: "8px",
              borderTop: "1px solid #eef2f6",
              paddingTop: "14px",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "8px 18px",
                borderRadius: "6px",
                border: "1px solid #d1d5db",
                background: "#fff",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "8px 22px",
                background: "#08332d",
                color: "#fff",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              {loading ? "Posting..." : "Publish Job Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminPostJobModal;