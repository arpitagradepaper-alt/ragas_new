import { useState } from "react";

function AddPartnerModal({
  isOpen,
  onClose,
  onPartnerCreated,
}) {
  const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

  const API_URL =
    `${API_BASE_URL}/api/partners`;

  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    alternatePhone: "",
    password: "",
    partnerType: "",
    specialization: "",
    geography: "",
    website: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    message: "",
  });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // -----------------------------------------
    // BASIC VALIDATION
    // -----------------------------------------

    if (
      !formData.companyName.trim() ||
      !formData.contactPerson.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.partnerType.trim() ||
      !formData.password.trim()
    ) {
      setError(
        "Please fill all required fields."
      );

      return;
    }

    try {
      setLoading(true);

      const token =
        localStorage.getItem(
          "ragasAdminToken"
        );

      if (!token) {
        setError(
          "Admin authentication required. Please login again."
        );

        return;
      }

      const response = await fetch(
        API_URL,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(
            formData
          ),
        }
      );

      const data =
        await response.json();

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        setError(
          data.message ||
            "Admin authentication failed. Please login again."
        );

        return;
      }

      if (
        !response.ok ||
        !data.success
      ) {
        setError(
          data.message ||
            "Unable to create partner."
        );

        return;
      }

      // -----------------------------------------
      // SUCCESS
      // -----------------------------------------

      setFormData({
        companyName: "",
        contactPerson: "",
        email: "",
        phone: "",
        alternatePhone: "",
        partnerType: "",
        specialization: "",
        geography: "",
        website: "",
        address: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
        message: "",
      });

      onPartnerCreated(
        data.partner ||
          data.data
      );

      onClose();
    } catch (err) {
      console.error(
        "Add partner error:",
        err
      );

      setError(
        "Unable to connect to server."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background:
          "rgba(15, 23, 42, 0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        zIndex: 9999,
      }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          maxHeight: "90vh",
          overflowY: "auto",
          background: "#ffffff",
          borderRadius: "16px",
          boxShadow:
            "0 25px 70px rgba(0,0,0,0.20)",
        }}
      >

        {/* HEADER */}

        <div
          style={{
            padding: "24px 28px",
            borderBottom:
              "1px solid #e5e7eb",
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            position: "sticky",
            top: 0,
            background: "#ffffff",
            zIndex: 2,
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing:
                  "0.12em",
                color: "#64748b",
              }}
            >
              PARTNER MANAGEMENT
            </p>

            <h2
              style={{
                margin:
                  "5px 0 0",
                fontSize: "24px",
                color: "#10243f",
              }}
            >
              Add Partner
            </h2>

            <p
              style={{
                margin:
                  "6px 0 0",
                color: "#64748b",
                fontSize: "13px",
              }}
            >
              Add a new recruitment
              partner to the system.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: "36px",
              height: "36px",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              background: "#ffffff",
              cursor: "pointer",
              fontSize: "20px",
              color: "#475569",
            }}
          >
            ×
          </button>
        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          style={{
            padding: "28px",
          }}
        >

          {error && (
            <div
              style={{
                marginBottom: "20px",
                padding: "12px 14px",
                borderRadius: "8px",
                background:
                  "#fff1f1",
                border:
                  "1px solid #f3c2c2",
                color: "#b42318",
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}

          {/* COMPANY INFORMATION */}

          <h3
            style={{
              margin:
                "0 0 16px",
              color: "#10243f",
              fontSize: "16px",
            }}
          >
            Company Information
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(2, minmax(0, 1fr))",
              gap: "16px",
              marginBottom: "28px",
            }}
          >

            <Field
              label="Company Name"
              name="companyName"
              value={
                formData.companyName
              }
              onChange={
                handleChange
              }
              required
            />

            <Field
              label="Partner Type"
              name="partnerType"
              value={
                formData.partnerType
              }
              onChange={
                handleChange
              }
              required
              select
              options={[
                "Recruitment Consultancy",
                "Overseas Recruitment",
                "Staffing Partner",
              ]}
            />

            <Field
              label="Specialization"
              name="specialization"
              value={
                formData.specialization
              }
              onChange={
                handleChange
              }
            />

            <Field
              label="Geography"
              name="geography"
              value={
                formData.geography
              }
              onChange={
                handleChange
              }
            />

            <Field
              label="Website"
              name="website"
              value={
                formData.website
              }
              onChange={
                handleChange
              }
              placeholder="https://example.com"
            />

          </div>

          {/* CONTACT */}

          <h3
            style={{
              margin:
                "0 0 16px",
              color: "#10243f",
              fontSize: "16px",
            }}
          >
            Contact Information
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(2, minmax(0, 1fr))",
              gap: "16px",
              marginBottom: "28px",
            }}
          >

            <Field
              label="Contact Person"
              name="contactPerson"
              value={
                formData.contactPerson
              }
              onChange={
                handleChange
              }
              required
            />

            <Field
              label="Email"
              name="email"
              type="email"
              value={
                formData.email
              }
              onChange={
                handleChange
              }
              required
            />

            <Field
              label="Phone"
              name="phone"
              value={
                formData.phone
              }
              onChange={
                handleChange
              }
              required
            />

            <Field
              label="Alternate Phone"
              name="alternatePhone"
              value={
                formData.alternatePhone
              }
              onChange={
                handleChange
              }
            />

          </div>

          {/* ADDRESS */}

          <h3
            style={{
              margin:
                "0 0 16px",
              color: "#10243f",
              fontSize: "16px",
            }}
          >
            Address & Location
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(2, minmax(0, 1fr))",
              gap: "16px",
              marginBottom: "28px",
            }}
          >

            <div
              style={{
                gridColumn:
                  "1 / -1",
              }}
            >
              <Field
                label="Address"
                name="address"
                value={
                  formData.address
                }
                onChange={
                  handleChange
                }
              />
            </div>

            <Field
              label="City"
              name="city"
              value={
                formData.city
              }
              onChange={
                handleChange
              }
            />

            <Field
              label="State"
              name="state"
              value={
                formData.state
              }
              onChange={
                handleChange
              }
            />

            <Field
              label="Country"
              name="country"
              value={
                formData.country
              }
              onChange={
                handleChange
              }
            />

            <Field
              label="Postal Code"
              name="postalCode"
              value={
                formData.postalCode
              }
              onChange={
                handleChange
              }
            />

          </div>

          {/* PARTNER LOGIN PASSWORD */}

          <h3
            style={{
              margin: "0 0 16px",
              color: "#10243f",
              fontSize: "16px",
            }}
          >
            Partner Login
          </h3>

          <div style={{ marginBottom: "28px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "7px",
                fontSize: "13px",
                fontWeight: 600,
                color: "#334155",
              }}
            >
              Set Partner Password (for first login) *
            </label>

            <input
              name="password"
              type="text"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              placeholder="Min 6 characters - share securely with the partner"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px 14px",
                border: "1px solid #dbe2ea",
                borderRadius: "8px",
                fontSize: "14px",
                outline: "none",
                fontFamily: "inherit",
              }}
            />
          </div>

          {/* MESSAGE */}

          <h3
            style={{
              margin:
                "0 0 16px",
              color: "#10243f",
              fontSize: "16px",
            }}
          >
            Additional Information
          </h3>

          <div
            style={{
              marginBottom: "28px",
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "7px",
                fontSize: "13px",
                fontWeight: 600,
                color: "#334155",
              }}
            >
              Message / Description
            </label>

            <textarea
              name="message"
              value={
                formData.message
              }
              onChange={
                handleChange
              }
              rows={4}
              placeholder="Enter additional partnership information..."
              style={{
                width: "100%",
                boxSizing:
                  "border-box",
                padding:
                  "12px 14px",
                border:
                  "1px solid #dbe2ea",
                borderRadius: "8px",
                resize: "vertical",
                fontSize: "14px",
                outline: "none",
                fontFamily:
                  "inherit",
              }}
            />
          </div>

          {/* ACTIONS */}

          <div
            style={{
              display: "flex",
              justifyContent:
                "flex-end",
              gap: "12px",
              paddingTop: "20px",
              borderTop:
                "1px solid #e5e7eb",
            }}
          >

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                padding:
                  "11px 20px",
                border:
                  "1px solid #d1d5db",
                borderRadius: "8px",
                background:
                  "#ffffff",
                color: "#334155",
                cursor: loading
                  ? "not-allowed"
                  : "pointer",
                fontWeight: 600,
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              style={{
                padding:
                  "11px 22px",
                border: "none",
                borderRadius: "8px",
                background:
                  "#0d3029",
                color: "#ffffff",
                cursor: loading
                  ? "not-allowed"
                  : "pointer",
                fontWeight: 600,
              }}
            >
              {loading
                ? "Adding..."
                : "Add Partner"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}

/* =====================================================
   REUSABLE FIELD
===================================================== */

function Field({
  label,
  name,
  value,
  onChange,
  required = false,
  type = "text",
  placeholder = "",
  select = false,
  options = [],
}) {
  const commonStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "11px 13px",
    border:
      "1px solid #dbe2ea",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#10243f",
    background: "#ffffff",
    outline: "none",
  };

  return (
    <div>
      <label
        style={{
          display: "block",
          marginBottom: "7px",
          fontSize: "13px",
          fontWeight: 600,
          color: "#334155",
        }}
      >
        {label}

        {required && (
          <span
            style={{
              color: "#b42318",
              marginLeft: "3px",
            }}
          >
            *
          </span>
        )}
      </label>

      {select ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          style={commonStyle}
        >
          <option value="">
            Select partner type
          </option>

          {options.map(
            (option) => (
              <option
                key={option}
                value={option}
              >
                {option}
              </option>
            )
          )}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          style={commonStyle}
        />
      )}
    </div>
  );
}

export default AddPartnerModal;