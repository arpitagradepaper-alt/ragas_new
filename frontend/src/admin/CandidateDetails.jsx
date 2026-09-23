import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./CandidateDetails.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const API_URL = API_BASE_URL;

function CandidateDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/api/candidates/${id}`, {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("ragasAdminToken") || ""
            }`,
          },
        });

        if (!response.ok) {
          throw new Error("Unable to fetch candidate.");
        }

        const data = await response.json();

        setCandidate(data.data || data.candidate);
      } catch (err) {
        console.error("Candidate details error:", err);
        setError("Unable to load candidate details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [id]);

  const getInitials = (name = "Candidate") => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="candidate-details-page">
        <div className="candidate-details-loading">
          Loading candidate details...
        </div>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="candidate-details-page">
        <button
          className="candidate-back-btn"
          onClick={() => navigate("/admin/candidates")}
        >
          ← Back to Candidates
        </button>

        <div className="candidate-details-error">
          {error || "Candidate not found."}
        </div>
      </div>
    );
  }

  const whatsappNumber = candidate.phone
    ? candidate.phone.replace(/\D/g, "")
    : "";

  return (
    <div className="candidate-details-page">

      {/* TOP */}

      <div className="candidate-details-top">

        <button
          className="candidate-back-btn"
          onClick={() => navigate("/admin/candidates")}
        >
          ← Back to Candidates
        </button>

        <span className="candidate-details-label">
          CANDIDATE PROFILE
        </span>

      </div>


      {/* HEADER CARD */}

      <section className="candidate-profile-header">

        <div className="candidate-profile-main">

          <div className="candidate-large-avatar">
            {getInitials(candidate.name)}
          </div>

          <div>
            <h1>{candidate.name || "Candidate"}</h1>

            <p>
              CAN-
              {candidate._id
                ? candidate._id.slice(-5).toUpperCase()
                : "00000"}
            </p>

            <span className="candidate-active-badge">
              Active
            </span>
          </div>

        </div>


        <div className="candidate-contact-actions">

          {candidate.email && (
            <a
              href={`mailto:${candidate.email}`}
              className="candidate-action-btn"
            >
              ✉ Email
            </a>
          )}

          {candidate.phone && (
            <a
              href={`tel:${candidate.phone}`}
              className="candidate-action-btn"
            >
              ☎ Call
            </a>
          )}

          {whatsappNumber && (
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="candidate-action-btn whatsapp"
            >
              WhatsApp
            </a>
          )}

        </div>

      </section>


      {/* INFORMATION */}

      <div className="candidate-details-grid">

        {/* PERSONAL INFORMATION */}

        <section className="candidate-info-card">

          <div className="candidate-section-title">
            <h2>Personal Information</h2>
            <span>01</span>
          </div>

          <div className="candidate-info-grid">

            <div>
              <label>Full Name</label>
              <strong>{candidate.name || "—"}</strong>
            </div>

            <div>
              <label>Email Address</label>
              <strong>{candidate.email || "—"}</strong>
            </div>

            <div>
              <label>Phone Number</label>
              <strong>{candidate.phone || "—"}</strong>
            </div>

            <div>
              <label>Location</label>
              <strong>{candidate.location || "—"}</strong>
            </div>

          </div>

        </section>


        {/* PROFESSIONAL INFORMATION */}

        <section className="candidate-info-card">

          <div className="candidate-section-title">
            <h2>Professional Information</h2>
            <span>02</span>
          </div>

          <div className="candidate-info-grid">

            <div>
              <label>Qualification</label>
              <strong>
                {candidate.qualification || "—"}
              </strong>
            </div>

            <div>
              <label>Experience</label>
              <strong>
                {candidate.experience || "—"}
              </strong>
            </div>

            <div>
              <label>Current Status</label>
              <strong>Active</strong>
            </div>

            <div>
              <label>Registered On</label>
              <strong>
                {formatDate(candidate.createdAt)}
              </strong>
            </div>

          </div>

        </section>


        {/* CONTACT */}

        <section className="candidate-info-card candidate-full-card">

          <div className="candidate-section-title">
            <h2>Contact Candidate</h2>
            <span>03</span>
          </div>

          <div className="candidate-contact-box">

            <div>
              <span>Email</span>
              <strong>{candidate.email || "—"}</strong>
            </div>

            <div>
              <span>Phone</span>
              <strong>{candidate.phone || "—"}</strong>
            </div>

            <div>
              <span>Location</span>
              <strong>{candidate.location || "—"}</strong>
            </div>

          </div>

        </section>

      </div>

    </div>
  );
}

export default CandidateDetails;