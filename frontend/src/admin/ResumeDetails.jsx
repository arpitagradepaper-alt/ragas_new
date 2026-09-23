import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ResumeDetails.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const API_URL = API_BASE_URL;

export default function ResumeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await fetch(`${API_URL}/api/resume/${id}`, {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("ragasAdminToken") || ""
            }`,
          },
        });
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load resume.");
        }

        setResume(data.data);
      } catch (err) {
        console.error("Resume details error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [id]);

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="resume-details-page">
        <div className="resume-details-loading">
          Loading resume details...
        </div>
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="resume-details-page">
        <div className="resume-details-error">
          <h2>Resume Not Found</h2>
          <p>{error || "Unable to load resume details."}</p>

          <button onClick={() => navigate("/admin/resumes")}>
            ← Back to Resume Database
          </button>
        </div>
      </div>
    );
  }

  const resumeUrl = resume.resumeFile
    ? `${API_URL}/api/resume/file/${resume.resumeFile}`
    : null;

  return (
    <div className="resume-details-page">

      <div className="resume-details-header">
        <div>
          <span className="resume-details-eyebrow">
            RESUME MANAGEMENT
          </span>

          <h1>Resume Details</h1>

          <p>
            Review candidate information and submitted resume.
          </p>
        </div>

        <button
          className="back-resumes-btn"
          onClick={() => navigate("/admin/resumes")}
        >
          ← Back to Resume Database
        </button>
      </div>

      <div className="resume-profile-card">

        <div className="resume-profile-top">

          <div className="resume-avatar">
            {resume.name?.charAt(0)?.toUpperCase() || "R"}
          </div>

          <div>
            <h2>{resume.name || "Unnamed Candidate"}</h2>

            <p>{resume.email || "No email available"}</p>

            <span className="resume-status">
              Active
            </span>
          </div>

        </div>

        <div className="resume-section">

          <h3>Personal Information</h3>

          <div className="resume-info-grid">

            <div className="resume-info-item">
              <span>Full Name</span>
              <strong>{resume.name || "—"}</strong>
            </div>

            <div className="resume-info-item">
              <span>Email Address</span>
              <strong>{resume.email || "—"}</strong>
            </div>

            <div className="resume-info-item">
              <span>Phone Number</span>
              <strong>{resume.phone || "—"}</strong>
            </div>

            <div className="resume-info-item">
              <span>Current Location</span>
              <strong>{resume.currentLocation || "—"}</strong>
            </div>

          </div>

        </div>

        <div className="resume-section">

          <h3>Professional Information</h3>

          <div className="resume-info-grid">

            <div className="resume-info-item">
              <span>Preferred Industry</span>
              <strong>{resume.preferredIndustry || "—"}</strong>
            </div>

            <div className="resume-info-item">
              <span>Preferred Country</span>
              <strong>{resume.preferredCountry || "—"}</strong>
            </div>

            <div className="resume-info-item">
              <span>Experience</span>
              <strong>
                {resume.experience !== undefined &&
                resume.experience !== null
                  ? `${resume.experience} Years`
                  : "—"}
              </strong>
            </div>

            <div className="resume-info-item">
              <span>Skills</span>
              <strong>{resume.skills || "—"}</strong>
            </div>

          </div>

        </div>

        <div className="resume-section">

          <h3>Resume File</h3>

          <div className="resume-file-card">

            <div className="resume-file-icon">
              📄
            </div>

            <div className="resume-file-info">
              <strong>
                {resume.originalFileName ||
                  resume.resumeFile ||
                  "Resume"}
              </strong>

              <span>
                Uploaded on {formatDate(resume.createdAt)}
              </span>
            </div>

            <div className="resume-file-actions">

              {resumeUrl && (
                <>
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="resume-open-btn"
                  >
                    Open Resume
                  </a>

                  <a
                    href={resumeUrl}
                    download
                    className="resume-download-btn"
                  >
                    Download
                  </a>
                </>
              )}

            </div>

          </div>

        </div>

        <div className="resume-section resume-meta-section">

          <div className="resume-meta">
            <span>Resume ID</span>
            <strong>{resume._id}</strong>
          </div>

          <div className="resume-meta">
            <span>Uploaded</span>
            <strong>{formatDate(resume.createdAt)}</strong>
          </div>

          <div className="resume-meta">
            <span>Last Updated</span>
            <strong>{formatDate(resume.updatedAt)}</strong>
          </div>

        </div>

      </div>
    </div>
  );
}