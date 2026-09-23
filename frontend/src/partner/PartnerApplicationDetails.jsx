import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  BriefcaseBusiness,
  MapPin,
  CalendarDays,
  FileText,
  CheckCircle2,
  XCircle,
  Clock3,
  Download,
} from "lucide-react";
import "./PartnerApplicationDetails.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const API_URL = `${API_BASE_URL}/api/partners/applications`;

function PartnerApplicationDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchApplication = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("ragasPartnerToken");

      if (!token) {
        setError("Partner authentication required.");
        return;
      }

      const response = await fetch(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load application."
        );
      }

      const receivedApplication =
        data.application ||
        data.data ||
        data;

      setApplication(receivedApplication);
    } catch (err) {
      console.error("Fetch application error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const getCandidateName = () => {
    return (
      application?.candidateName ||
      application?.fullName ||
      application?.name ||
      application?.candidate?.fullName ||
      application?.candidate?.name ||
      "Candidate"
    );
  };

  const getEmail = () => {
    return (
      application?.email ||
      application?.candidate?.email ||
      "Not available"
    );
  };

  const getPhone = () => {
    return (
      application?.phone ||
      application?.candidate?.phone ||
      "Not available"
    );
  };

  const getJobTitle = () => {
    return (
      application?.jobTitle ||
      application?.job?.title ||
      application?.job?.jobTitle ||
      "Job"
    );
  };

  const getLocation = () => {
    return (
      application?.location ||
      application?.job?.location ||
      "Not specified"
    );
  };

  const getStatus = () => {
    return (
      application?.status ||
      application?.applicationStatus ||
      "Pending"
    );
  };

  const getAppliedDate = () => {
    const date =
      application?.createdAt ||
      application?.appliedAt ||
      application?.applicationDate;

    if (!date) {
      return "Not available";
    }

    return new Date(date).toLocaleDateString();
  };

  const getResume = () => {
    return (
      application?.resumeFile ? `${API_BASE_URL}/api/applications/resume/${encodeURIComponent(application.resumeFile)}` :
      application?.resumeUrl ||
      application?.resumePath ||
      application?.candidate?.resume ||
      ""
    );
  };

  const updateStatus = async (newStatus) => {
    try {
      const token = localStorage.getItem("ragasPartnerToken");

      const response = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to update application status."
        );
      }

      await fetchApplication();
    } catch (err) {
      console.error("Update application error:", err);
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="partner-application-details-state">
        <User size={30} />
        <h3>Loading application...</h3>
        <p>Please wait while the application is loaded.</p>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="partner-application-details-state">
        <User size={30} />

        <h3>Application not found</h3>

        <p>
          {error ||
            "Unable to find this application."}
        </p>

        <button
          type="button"
          onClick={() =>
            navigate(
              "/partner-dashboard/applications"
            )
          }
        >
          <ArrowLeft size={15} />
          Back to Applications
        </button>
      </div>
    );
  }

  const status = getStatus();
  const resume = getResume();

  return (
    <div className="partner-application-details">

      {/* =========================
          HEADER
      ========================= */}

      <div className="partner-application-details-header">

        <div>

          <button
            type="button"
            className="partner-application-back-btn"
            onClick={() =>
              navigate(
                "/partner-dashboard/applications"
              )
            }
          >
            <ArrowLeft size={15} />
            Back to Applications
          </button>

          <p className="partner-application-eyebrow">
            APPLICATION DETAILS
          </p>

          <h2>{getCandidateName()}</h2>

          <p className="partner-application-job">
            Applied for{" "}
            <strong>{getJobTitle()}</strong>
          </p>

        </div>

        <div
          className={`partner-application-large-status partner-large-status-${String(
            status
          )
            .toLowerCase()
            .replace(/\s+/g, "-")}`}
        >
          {status}
        </div>

      </div>

      {error && (
        <div className="partner-application-error">
          {error}
        </div>
      )}

      {/* =========================
          QUICK INFORMATION
      ========================= */}

      <div className="partner-application-info-grid">

        <div className="partner-application-info-card">
          <div className="partner-application-info-icon">
            <Mail size={18} />
          </div>

          <div>
            <span>Email</span>
            <strong>{getEmail()}</strong>
          </div>
        </div>

        <div className="partner-application-info-card">
          <div className="partner-application-info-icon">
            <Phone size={18} />
          </div>

          <div>
            <span>Phone</span>
            <strong>{getPhone()}</strong>
          </div>
        </div>

        <div className="partner-application-info-card">
          <div className="partner-application-info-icon">
            <MapPin size={18} />
          </div>

          <div>
            <span>Location</span>
            <strong>{getLocation()}</strong>
          </div>
        </div>

        <div className="partner-application-info-card">
          <div className="partner-application-info-icon">
            <CalendarDays size={18} />
          </div>

          <div>
            <span>Applied On</span>
            <strong>{getAppliedDate()}</strong>
          </div>
        </div>

      </div>

      {/* =========================
          MAIN CONTENT
      ========================= */}

      <div className="partner-application-details-layout">

        <main className="partner-application-main">

          {/* Candidate Information */}

          <section className="partner-application-card">

            <div className="partner-application-card-heading">
              <User size={18} />

              <div>
                <h3>Candidate Information</h3>
                <p>
                  Personal information provided by the candidate.
                </p>
              </div>
            </div>

            <div className="partner-candidate-fields">

              <div>
                <span>Full Name</span>
                <strong>{getCandidateName()}</strong>
              </div>

              <div>
                <span>Email Address</span>
                <strong>{getEmail()}</strong>
              </div>

              <div>
                <span>Phone Number</span>
                <strong>{getPhone()}</strong>
              </div>

              <div>
                <span>Location</span>
                <strong>{getLocation()}</strong>
              </div>

            </div>

          </section>

          {/* Job Information */}

          <section className="partner-application-card">

            <div className="partner-application-card-heading">
              <BriefcaseBusiness size={18} />

              <div>
                <h3>Job Information</h3>
                <p>
                  Position for which the candidate applied.
                </p>
              </div>
            </div>

            <div className="partner-candidate-fields">

              <div>
                <span>Position</span>
                <strong>{getJobTitle()}</strong>
              </div>

              <div>
                <span>Job Location</span>
                <strong>{getLocation()}</strong>
              </div>

              <div>
                <span>Job Type</span>
                <strong>
                  {application?.jobType ||
                    application?.job?.jobType ||
                    "Not specified"}
                </strong>
              </div>

              <div>
                <span>Industry</span>
                <strong>
                  {application?.industry ||
                    application?.job?.industry ||
                    "Not specified"}
                </strong>
              </div>

            </div>

          </section>

          {/* Cover Letter / Message */}

          <section className="partner-application-card">

            <div className="partner-application-card-heading">
              <FileText size={18} />

              <div>
                <h3>Candidate Message</h3>
                <p>
                  Message or cover letter submitted with the application.
                </p>
              </div>
            </div>

            <div className="partner-candidate-message">

              {application.coverLetter ||
              application.message ||
              application.cover_letter ? (
                <p>
                  {application.coverLetter ||
                    application.message ||
                    application.cover_letter}
                </p>
              ) : (
                <p className="partner-application-muted">
                  No message or cover letter was provided.
                </p>
              )}

            </div>

          </section>

          {/* Resume */}

          <section className="partner-application-card">

            <div className="partner-application-card-heading">
              <FileText size={18} />

              <div>
                <h3>Resume</h3>
                <p>
                  Candidate resume submitted with this application.
                </p>
              </div>
            </div>

            {resume ? (
              <a
                href={resume}
                target="_blank"
                rel="noopener noreferrer"
                className="partner-resume-btn"
              >
                <Download size={16} />
                View / Download Resume
              </a>
            ) : (
              <p className="partner-application-muted">
                No resume is available for this application.
              </p>
            )}

          </section>

        </main>

        {/* =========================
            SIDEBAR
        ========================= */}

        <aside className="partner-application-side">

          <section className="partner-application-card">

            <div className="partner-application-card-heading">
              <Clock3 size={18} />

              <div>
                <h3>Application Status</h3>
                <p>
                  Update the candidate's progress.
                </p>
              </div>
            </div>

            <div className="partner-status-actions">

              <button
                type="button"
                className="partner-status-action shortlist"
                onClick={() =>
                  updateStatus("Shortlisted")
                }
              >
                <CheckCircle2 size={16} />
                Shortlist
              </button>

              <button
                type="button"
                className="partner-status-action hired"
                onClick={() =>
                  updateStatus("Hired")
                }
              >
                <CheckCircle2 size={16} />
                Mark as Hired
              </button>

              <button
                type="button"
                className="partner-status-action reject"
                onClick={() =>
                  updateStatus("Rejected")
                }
              >
                <XCircle size={16} />
                Reject
              </button>

              <button
                type="button"
                className="partner-status-action pending"
                onClick={() =>
                  updateStatus("Pending")
                }
              >
                <Clock3 size={16} />
                Move to Pending
              </button>

            </div>

          </section>

          <section className="partner-application-card">

            <div className="partner-application-card-heading">
              <CalendarDays size={18} />

              <div>
                <h3>Application Timeline</h3>
              </div>
            </div>

            <div className="partner-application-timeline">

              <div className="partner-timeline-item">
                <div className="partner-timeline-dot">
                  <CheckCircle2 size={13} />
                </div>

                <div>
                  <strong>Application Received</strong>
                  <span>
                    {getAppliedDate()}
                  </span>
                </div>
              </div>

              <div className="partner-timeline-item">
                <div className="partner-timeline-dot">
                  <Clock3 size={13} />
                </div>

                <div>
                  <strong>Current Status</strong>
                  <span>{status}</span>
                </div>
              </div>

            </div>

          </section>

        </aside>

      </div>

    </div>
  );
}

export default PartnerApplicationDetails;