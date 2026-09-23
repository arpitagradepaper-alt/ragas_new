import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ApplicationDetails.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://rosybrown-snake-826018.hostingersite.com";

const API_URL = `${API_BASE_URL}/api/applications`;

const STATUSES = [
  "Applied",
  "Under Review",
  "Shortlisted",
  "Interview",
  "Selected",
  "Rejected",
];

function ApplicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // =====================================================
  // FETCH APPLICATION
  // =====================================================

  const fetchApplication = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/${encodeURIComponent(id)}`,
        {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("ragasAdminToken") || ""
            }`,
          },
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        throw new Error(
          "Server returned an invalid response. Please check the application API."
        );
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to fetch application."
        );
      }

      setApplication(data.data);
    } catch (err) {
      console.error(
        "Application details error:",
        err
      );

      setError(
        err.message ||
          "Unable to connect to server."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchApplication();
    }
  }, [id]);

  // =====================================================
  // UPDATE STATUS
  // =====================================================

  const updateStatus = async (newStatus) => {
    if (!application?._id) return;

    try {
      setUpdatingStatus(true);

      const response = await fetch(
        `${API_URL}/${application._id}/status`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              localStorage.getItem("ragasAdminToken") || ""
            }`,
          },

          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        throw new Error(
          "Server returned an invalid response while updating status."
        );
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to update status."
        );
      }

      setApplication(data.data);
    } catch (err) {
      console.error(
        "Status update error:",
        err
      );

      alert(
        err.message ||
          "Unable to update status."
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // RESUME URL
  // =====================================================

  const resumeUrl =
    application?.resumeFile
      ? `${API_URL}/api/applications/resume/${encodeURIComponent(
          application.resumeFile
        )}`
      : null;

  // =====================================================
  // WHATSAPP
  // =====================================================

  const whatsappNumber =
    application?.phone
      ? application.phone.replace(/\D/g, "")
      : "";

  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}`
    : "#";

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="application-details-loading">
        <div className="application-details-loader"></div>

        <p>
          Loading candidate details...
        </p>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error || !application) {
    return (
      <div className="application-details-error">
        <h2>
          Unable to load application
        </h2>

        <p>
          {error ||
            "Application not found."}
        </p>

        <button
          onClick={() =>
            navigate(
              "/admin/applications"
            )
          }
        >
          ← Back to Applications
        </button>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="application-details-page">

      {/* BACK */}

      <button
        className="application-back-btn"
        onClick={() =>
          navigate(
            "/admin/applications"
          )
        }
      >
        ← Back to Applications
      </button>

      {/* HEADER */}

      <div className="application-details-header">

        <div className="candidate-main-info">

          <div className="candidate-large-avatar">
            {application.fullName
              ? application.fullName
                  .charAt(0)
                  .toUpperCase()
              : "C"}
          </div>

          <div>

            <p className="details-eyebrow">
              JOB APPLICATION
            </p>

            <h1>
              {application.fullName ||
                "Unknown Candidate"}
            </h1>

            <p className="candidate-applied-job">
              Applied for{" "}
              <strong>
                {application.jobTitle ||
                  "Job Position"}
              </strong>
            </p>

          </div>

        </div>

        <div className="application-status-control">

          <label>
            Application Status
          </label>

          <select
            value={
              application.status ||
              "Applied"
            }
            onChange={(e) =>
              updateStatus(
                e.target.value
              )
            }
            disabled={updatingStatus}
          >

            {STATUSES.map(
              (status) => (
                <option
                  key={status}
                  value={status}
                >
                  {status}
                </option>
              )
            )}

          </select>

        </div>

      </div>

      {/* CONTACT ACTIONS */}

      <div className="candidate-contact-actions">

        <a
          href={`mailto:${
            application.email || ""
          }`}
          className="contact-action email-action"
        >
          <span>✉</span>

          <div>
            <strong>
              Send Email
            </strong>

            <small>
              {application.email ||
                "No email"}
            </small>
          </div>
        </a>

        <a
          href={
            application.phone
              ? `tel:${application.phone}`
              : "#"
          }
          className="contact-action call-action"
        >
          <span>☎</span>

          <div>
            <strong>
              Call Candidate
            </strong>

            <small>
              {application.phone ||
                "No phone"}
            </small>
          </div>
        </a>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="contact-action whatsapp-action"
        >
          <span>◉</span>

          <div>
            <strong>
              WhatsApp
            </strong>

            <small>
              Start conversation
            </small>
          </div>
        </a>

        {resumeUrl && (
          <a
            href={resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="contact-action resume-action"
          >
            <span>↥</span>

            <div>
              <strong>
                View Resume
              </strong>

              <small>
                Open candidate resume
              </small>
            </div>
          </a>
        )}

      </div>

      {/* MAIN GRID */}

      <div className="application-details-grid">

        {/* PERSONAL INFORMATION */}

        <section className="details-card">

          <div className="details-card-header">
            <h2>
              Personal Information
            </h2>
          </div>

          <div className="details-info-grid">

            <div className="details-field">
              <span>
                Full Name
              </span>

              <strong>
                {application.fullName ||
                  "—"}
              </strong>
            </div>

            <div className="details-field">
              <span>
                Email
              </span>

              <strong>
                {application.email ||
                  "—"}
              </strong>
            </div>

            <div className="details-field">
              <span>
                Phone
              </span>

              <strong>
                {application.phone ||
                  "—"}
              </strong>
            </div>

            <div className="details-field">
              <span>
                Date of Birth
              </span>

              <strong>
                {application.dateOfBirth ||
                  "—"}
              </strong>
            </div>

            <div className="details-field">
              <span>
                Current Location
              </span>

              <strong>
                {application.currentLocation ||
                  "—"}
              </strong>
            </div>

            <div className="details-field">
              <span>
                Applied On
              </span>

              <strong>
                {formatDate(
                  application.createdAt
                )}
              </strong>
            </div>

          </div>

        </section>

        {/* PROFESSIONAL INFORMATION */}

        <section className="details-card">

          <div className="details-card-header">
            <h2>
              Professional Information
            </h2>
          </div>

          <div className="details-info-grid">

            <div className="details-field">
              <span>
                Current Job Title
              </span>

              <strong>
                {application.currentJobTitle ||
                  "—"}
              </strong>
            </div>

            <div className="details-field">
              <span>
                Current Company
              </span>

              <strong>
                {application.currentCompany ||
                  "—"}
              </strong>
            </div>

            <div className="details-field">
              <span>
                Total Experience
              </span>

              <strong>
                {application.totalExperience ||
                  "—"}
              </strong>
            </div>

            <div className="details-field">
              <span>
                Highest Qualification
              </span>

              <strong>
                {application.highestQualification ||
                  "—"}
              </strong>
            </div>

            <div className="details-field full-field">
              <span>
                Key Skills
              </span>

              <strong>
                {application.keySkills ||
                  "—"}
              </strong>
            </div>

          </div>

        </section>

        {/* JOB INFORMATION */}

        <section className="details-card">

          <div className="details-card-header">
            <h2>
              Job Information
            </h2>
          </div>

          <div className="details-info-grid">

            <div className="details-field">
              <span>
                Job Position
              </span>

              <strong>
                {application.jobTitle ||
                  "—"}
              </strong>
            </div>

            <div className="details-field">
              <span>
                Job ID
              </span>

              <strong>
                {application.jobId ||
                  "—"}
              </strong>
            </div>

            <div className="details-field">
              <span>
                Preferred Location
              </span>

              <strong>
                {application.preferredLocation ||
                  "—"}
              </strong>
            </div>

            <div className="details-field">
              <span>
                Preferred Country
              </span>

              <strong>
                {application.preferredCountry ||
                  "—"}
              </strong>
            </div>

            <div className="details-field">
              <span>
                Expected Salary
              </span>

              <strong>
                {application.expectedSalary ||
                  "—"}
              </strong>
            </div>

            <div className="details-field">
              <span>
                Notice Period
              </span>

              <strong>
                {application.noticePeriod ||
                  "—"}
              </strong>
            </div>

          </div>

        </section>

        {/* RESUME */}

        <section className="details-card">

          <div className="details-card-header">
            <h2>
              Resume
            </h2>
          </div>

          {application.resumeFile ? (
            <div className="resume-details-box">

              <div className="resume-file-icon">
                PDF
              </div>

              <div className="resume-file-info">

                <strong>
                  {application.resumeFile}
                </strong>

                <span>
                  Candidate uploaded resume
                </span>

              </div>

              <a
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="resume-open-btn"
              >
                Open Resume
              </a>

            </div>
          ) : (
            <div className="no-resume">
              No resume was uploaded with
              this application.
            </div>
          )}

        </section>

        {/* COVER LETTER */}

        <section className="details-card details-card-full">

          <div className="details-card-header">
            <h2>
              Cover Letter / Message
            </h2>
          </div>

          <div className="cover-letter-content">

            {application.coverLetter ? (
              application.coverLetter
            ) : (
              <span>
                No cover letter or message
                provided.
              </span>
            )}

          </div>

        </section>

      </div>

      {/* BOTTOM CONTACT */}

      <div className="application-details-footer">

        <div>

          <strong>
            Need to contact this candidate?
          </strong>

          <span>
            Use the options above to reach
            the candidate directly.
          </span>

        </div>

        <div className="footer-contact-buttons">

          <a
            href={`mailto:${
              application.email || ""
            }`}
            className="footer-email-btn"
          >
            ✉ Email
          </a>

          <a
            href={
              application.phone
                ? `tel:${application.phone}`
                : "#"
            }
            className="footer-call-btn"
          >
            ☎ Call
          </a>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="footer-whatsapp-btn"
          >
            ◉ WhatsApp
          </a>

        </div>

      </div>

    </div>
  );
}

export default ApplicationDetails;