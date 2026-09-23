import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PartnerProfile.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const EDITABLE_FIELDS = [
  ["contactPerson", "Contact Person"],
  ["phone", "Phone"],
  ["alternatePhone", "Alternate Phone"],
  ["website", "Website"],
  ["address", "Address"],
  ["city", "City"],
  ["state", "State"],
  ["country", "Country"],
  ["postalCode", "Postal Code"],
];

/* =========================================================
   GET PARTNER TOKEN
========================================================= */

const getPartnerToken = () => {
  return (
    localStorage.getItem("ragasPartnerToken") ||
    sessionStorage.getItem("ragasPartnerToken")
  );
};

/* =========================================================
   SAFE JSON RESPONSE
========================================================= */

const parseResponse = async (response) => {
  const contentType =
    response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    const text = await response.text();

    console.error(
      "Partner API returned non-JSON response:",
      text.slice(0, 500)
    );

    throw new Error(
      "The server returned an invalid response. Please check the API URL and backend."
    );
  }

  return response.json();
};

function PartnerProfile() {
  const navigate = useNavigate();

  const [partner, setPartner] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /* =======================================================
     LOAD PROFILE
  ======================================================= */

  useEffect(() => {
    const fetchProfile = async () => {
      const token = getPartnerToken();

      if (!token) {
        navigate("/partner-login");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/api/partners/me`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        /*
         * Handle expired/invalid token first.
         */

        if (
          response.status === 401 ||
          response.status === 403
        ) {
          localStorage.removeItem(
            "ragasPartnerToken"
          );

          sessionStorage.removeItem(
            "ragasPartnerToken"
          );

          localStorage.removeItem(
            "ragasPartner"
          );

          sessionStorage.removeItem(
            "ragasPartner"
          );

          navigate("/partner-login");
          return;
        }

        const data = await parseResponse(response);

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "Unable to load your profile."
          );
        }

        const partnerData = data.data;

        setPartner(partnerData);

        setForm({
          contactPerson:
            partnerData?.contactPerson || "",

          phone:
            partnerData?.phone || "",

          alternatePhone:
            partnerData?.alternatePhone || "",

          website:
            partnerData?.website || "",

          address:
            partnerData?.address || "",

          city:
            partnerData?.city || "",

          state:
            partnerData?.state || "",

          country:
            partnerData?.country || "",

          postalCode:
            partnerData?.postalCode || "",
        });
      } catch (err) {
        console.error(
          "Partner profile fetch error:",
          err
        );

        setError(
          err?.message ||
            "Unable to load your profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  /* =======================================================
     INPUT CHANGE
  ======================================================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =======================================================
     SAVE PROFILE
  ======================================================= */

  const handleSave = async (event) => {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const token = getPartnerToken();

      if (!token) {
        navigate("/partner-login");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/partners/me`,
        {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      /*
       * Handle authentication failure.
       */

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        localStorage.removeItem(
          "ragasPartnerToken"
        );

        sessionStorage.removeItem(
          "ragasPartnerToken"
        );

        localStorage.removeItem(
          "ragasPartner"
        );

        sessionStorage.removeItem(
          "ragasPartner"
        );

        navigate("/partner-login");
        return;
      }

      const data = await parseResponse(response);

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to save your profile."
        );
      }

      setPartner(data.data);

      setForm({
        contactPerson:
          data.data?.contactPerson || "",

        phone:
          data.data?.phone || "",

        alternatePhone:
          data.data?.alternatePhone || "",

        website:
          data.data?.website || "",

        address:
          data.data?.address || "",

        city:
          data.data?.city || "",

        state:
          data.data?.state || "",

        country:
          data.data?.country || "",

        postalCode:
          data.data?.postalCode || "",
      });

      setMessage(
        "Profile updated successfully."
      );
    } catch (err) {
      console.error(
        "Partner profile save error:",
        err
      );

      setError(
        err?.message ||
          "Unable to save your profile."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="partner-profile-page">
        <div className="partner-profile-loading">
          Loading your profile...
        </div>
      </div>
    );
  }

  /* =======================================================
     COMPLETE LOAD ERROR
  ======================================================= */

  if (error && !partner) {
    return (
      <div className="partner-profile-page">
        <div className="partner-profile-error">
          {error}

          <button
            type="button"
            onClick={() =>
              navigate("/partner-login")
            }
            style={{
              display: "block",
              margin: "20px auto 0",
            }}
          >
            Back to Partner Login
          </button>
        </div>
      </div>
    );
  }

  /* =======================================================
     PARTNER STATUS
  ======================================================= */

  const status =
    partner?.status || "Pending";

  const isVerified =
    status.toLowerCase() === "verified";

  const isRejected =
    status.toLowerCase() === "rejected";

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <div className="partner-profile-page">

      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="partner-profile-header">

        <div>

          <span className="partner-profile-eyebrow">
            PARTNER ACCOUNT
          </span>

          <h1>
            {partner?.companyName ||
              "Partner Profile"}
          </h1>

          <p>
            {partner?.partnerType || "Partner"}

            {partner?.email
              ? ` - ${partner.email}`
              : ""}
          </p>

        </div>

        <span
          className={`partner-profile-status ${
            isVerified
              ? "verified"
              : isRejected
              ? "rejected"
              : "pending"
          }`}
        >
          {isVerified
            ? "Verified"
            : isRejected
            ? "Rejected"
            : "Pending Verification"}
        </span>

      </div>

      {/* ===================================================
          PENDING MESSAGE
      =================================================== */}

      {!isVerified && !isRejected && (
        <div className="partner-profile-note">
          Your account is active, but job
          publishing stays locked until an
          administrator verifies your partnership.
        </div>
      )}

      {/* ===================================================
          SUCCESS
      =================================================== */}

      {message && (
        <div className="partner-profile-success">
          {message}
        </div>
      )}

      {/* ===================================================
          ERROR
      =================================================== */}

      {error && (
        <div className="partner-profile-error">
          {error}
        </div>
      )}

      {/* ===================================================
          FORM
      =================================================== */}

      <form
        className="partner-profile-form"
        onSubmit={handleSave}
      >

        {/* =================================================
            COMPANY INFORMATION
        ================================================= */}

        <h2>
          Company Information (read only)
        </h2>

        <div className="partner-profile-grid">

          <div className="partner-profile-item">
            <span>Company Name</span>

            <strong>
              {partner?.companyName || "-"}
            </strong>
          </div>

          <div className="partner-profile-item">
            <span>Partner Type</span>

            <strong>
              {partner?.partnerType || "-"}
            </strong>
          </div>

          <div className="partner-profile-item">
            <span>Specialization</span>

            <strong>
              {partner?.specialization || "-"}
            </strong>
          </div>

          <div className="partner-profile-item">
            <span>Geography</span>

            <strong>
              {partner?.geography || "-"}
            </strong>
          </div>

          <div className="partner-profile-item">
            <span>Email (login)</span>

            <strong>
              {partner?.email || "-"}
            </strong>
          </div>

          <div className="partner-profile-item">
            <span>Registration No.</span>

            <strong>
              {partner?.registrationNumber || "-"}
            </strong>
          </div>

        </div>

        {/* =================================================
            CONTACT & ADDRESS
        ================================================= */}

        <h2>
          Contact &amp; Address (editable)
        </h2>

        <div className="partner-profile-grid">

          {EDITABLE_FIELDS.map(
            ([name, label]) => (
              <label
                key={name}
                className="partner-profile-field"
              >

                <span>
                  {label}
                </span>

                <input
                  type="text"
                  name={name}
                  value={form[name] || ""}
                  onChange={handleChange}
                />

              </label>
            )
          )}

        </div>

        {/* =================================================
            SAVE
        ================================================= */}

        <button
          type="submit"
          className="partner-profile-save"
          disabled={saving}
        >
          {saving
            ? "Saving..."
            : "Save Changes"}
        </button>

      </form>

    </div>
  );
}

export default PartnerProfile;