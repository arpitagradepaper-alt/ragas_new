import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Globe,
  Users,
  FileText,
} from "lucide-react";
import "./EmployerDetails.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const API_URL = API_BASE_URL;

function EmployerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employer, setEmployer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEmployer = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/api/employers/${id}`, {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("ragasAdminToken") || ""
            }`,
          },
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to fetch employer details."
          );
        }

        setEmployer(data.data);
      } catch (err) {
        console.error("Employer details error:", err);
        setError(
          err.message || "Unable to fetch employer details."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEmployer();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="employer-details-page">
        <div className="employer-details-loading">
          Loading employer details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="employer-details-page">
        <button
          className="employer-back-button"
          onClick={() => navigate("/admin/employers")}
        >
          <ArrowLeft size={18} />
          Back to Employers
        </button>

        <div className="employer-details-error">
          {error}
        </div>
      </div>
    );
  }

  if (!employer) {
    return (
      <div className="employer-details-page">
        <div className="employer-details-error">
          Employer not found.
        </div>
      </div>
    );
  }

  return (
    <div className="employer-details-page">

      {/* HEADER */}

      <div className="employer-details-header">

        <button
          className="employer-back-button"
          onClick={() => navigate("/admin/employers")}
        >
          <ArrowLeft size={18} />
          Back to Employers
        </button>

        <div className="employer-title-area">

          <div className="employer-details-icon">
            <Building2 size={30} />
          </div>

          <div>
            <p className="employer-details-eyebrow">
              EMPLOYER DETAILS
            </p>

            <h1>
              {employer.companyName || "Company"}
            </h1>

            <p className="employer-contact-person">
              {employer.contactPerson || "Contact Person"}
            </p>
          </div>

        </div>

      </div>

      {/* CONTENT */}

      <div className="employer-details-grid">

        {/* MAIN */}

        <div className="employer-details-main">

          <div className="employer-details-card">

            <div className="employer-section-title">
              <Building2 size={20} />
              Company Information
            </div>

            <div className="employer-info-grid">

              <div className="employer-info-item">
                <span>Company Name</span>
                <strong>
                  {employer.companyName || "—"}
                </strong>
              </div>

              <div className="employer-info-item">
                <span>Industry</span>
                <strong>
                  {employer.industry || "—"}
                </strong>
              </div>

              <div className="employer-info-item">
                <span>Company Size</span>
                <strong>
                  {employer.companySize || "—"}
                </strong>
              </div>

              <div className="employer-info-item">
                <span>Location</span>
                <strong>
                  {employer.location || "—"}
                </strong>
              </div>

              <div className="employer-info-item">
                <span>Website</span>
                <strong>
                  {employer.companyWebsite || "—"}
                </strong>
              </div>

            </div>

          </div>

          <div className="employer-details-card">

            <div className="employer-section-title">
              <Users size={20} />
              Contact Information
            </div>

            <div className="employer-info-grid">

              <div className="employer-info-item">
                <span>Contact Person</span>
                <strong>
                  {employer.contactPerson || "—"}
                </strong>
              </div>

              <div className="employer-info-item">
                <span>Email</span>
                <strong>
                  {employer.email || "—"}
                </strong>
              </div>

              <div className="employer-info-item">
                <span>Phone</span>
                <strong>
                  {employer.phone || "—"}
                </strong>
              </div>

            </div>

          </div>

          <div className="employer-details-card">

            <div className="employer-section-title">
              <Briefcase size={20} />
              Hiring Requirements
            </div>

            <p className="employer-description">
              {employer.hiringNeeds ||
                "No hiring requirements provided."}
            </p>

          </div>

          <div className="employer-details-card">

            <div className="employer-section-title">
              <FileText size={20} />
              Additional Message
            </div>

            <p className="employer-description">
              {employer.message ||
                "No additional message provided."}
            </p>

          </div>

        </div>

        {/* SIDE */}

        <aside className="employer-details-sidebar">

          <div className="employer-status-card">

            <span className="sidebar-label">
              STATUS
            </span>

            <span className="employer-detail-status">
              Registered
            </span>

          </div>

          <div className="employer-details-card">

            <div className="employer-sidebar-item">
              <Mail size={19} />

              <div>
                <span>Email</span>
                <strong>
                  {employer.email || "—"}
                </strong>
              </div>
            </div>

            <div className="employer-sidebar-item">
              <Phone size={19} />

              <div>
                <span>Phone</span>
                <strong>
                  {employer.phone || "—"}
                </strong>
              </div>
            </div>

            <div className="employer-sidebar-item">
              <MapPin size={19} />

              <div>
                <span>Location</span>
                <strong>
                  {employer.location || "—"}
                </strong>
              </div>
            </div>

            <div className="employer-sidebar-item">
              <Globe size={19} />

              <div>
                <span>Website</span>
                <strong>
                  {employer.companyWebsite || "—"}
                </strong>
              </div>
            </div>

          </div>

        </aside>

      </div>

    </div>
  );
}

export default EmployerDetails;