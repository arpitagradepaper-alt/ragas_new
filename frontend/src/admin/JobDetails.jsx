import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  Building2,
  Clock,
  IndianRupee,
  Users,
  FileText,
} from "lucide-react";
import "./JobDetails.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const API_URL = API_BASE_URL;

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/jobs/admin/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem("ragasAdminToken") || ""}` } }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to fetch job details."
          );
        }

        setJob(data.data);
      } catch (err) {
        console.error("Fetch job details error:", err);
        setError(
          err.message || "Unable to fetch job details."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJob();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="job-details-page">
        <div className="job-details-loading">
          Loading job details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="job-details-page">
        <button
          className="job-back-button"
          onClick={() => navigate("/admin/jobs")}
        >
          <ArrowLeft size={18} />
          Back to Jobs
        </button>

        <div className="job-details-error">
          {error}
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="job-details-page">
        <div className="job-details-error">
          Job not found.
        </div>
      </div>
    );
  }

  return (
    <div className="job-details-page">

      {/* HEADER */}
      <div className="job-details-header">

        <button
          className="job-back-button"
          onClick={() => navigate("/admin/jobs")}
        >
          <ArrowLeft size={18} />
          Back to Jobs
        </button>

        <div className="job-details-title-area">
          <div className="job-details-icon">
            <Briefcase size={28} />
          </div>

          <div>
            <p className="job-details-eyebrow">
              JOB DETAILS
            </p>

            <h1>
              {job.jobTitle || "Job Position"}
            </h1>

            <p className="job-details-company">
              <Building2 size={16} />
              {job.companyName || "Employer"}
            </p>
          </div>
        </div>

      </div>


      {/* MAIN */}
      <div className="job-details-grid">

        {/* LEFT */}
        <div className="job-details-main-card">

          <div className="job-details-section">
            <h2>
              <FileText size={20} />
              Job Description
            </h2>

            <p className="job-description-text">
              {job.description || "No job description provided."}
            </p>
          </div>


          {job.requirements && (
            <div className="job-details-section">
              <h2>
                <Briefcase size={20} />
                Requirements
              </h2>

              <p className="job-description-text">
                {job.requirements}
              </p>
            </div>
          )}


          {job.skills && (
            <div className="job-details-section">
              <h2>
                Skills
              </h2>

              <p className="job-description-text">
                {job.skills}
              </p>
            </div>
          )}

        </div>


        {/* RIGHT */}
        <aside className="job-details-side-card">

          <div className="job-status-row">
            <span>Status</span>

            <span
              className={`job-status ${
                (job.status || "Pending")
                  .toLowerCase()
                  .replace(/\s+/g, "-")
              }`}
            >
              {job.status || "Pending"}
            </span>
          </div>


          <div className="job-info-item">
            <MapPin size={19} />
            <div>
              <span>Location</span>
              <strong>
                {job.location || "Not provided"}
              </strong>
            </div>
          </div>


          {job.country && (
            <div className="job-info-item">
              <MapPin size={19} />
              <div>
                <span>Country</span>
                <strong>{job.country}</strong>
              </div>
            </div>
          )}


          <div className="job-info-item">
            <Clock size={19} />
            <div>
              <span>Employment Type</span>
              <strong>
                {job.jobType || "Not provided"}
              </strong>
            </div>
          </div>


          <div className="job-info-item">
            <Briefcase size={19} />
            <div>
              <span>Experience</span>
              <strong>
                {job.experience || "Not provided"}
              </strong>
            </div>
          </div>


          <div className="job-info-item">
            <IndianRupee size={19} />
            <div>
              <span>Salary</span>
              <strong>
                {job.salary || "Not provided"}
              </strong>
            </div>
          </div>


          <div className="job-info-item">
            <Users size={19} />
            <div>
              <span>Openings</span>
              <strong>
                {job.openings || "Not provided"}
              </strong>
            </div>
          </div>


          {job.category && (
            <div className="job-info-item">
              <Briefcase size={19} />
              <div>
                <span>Industry</span>
                <strong>{job.category}</strong>
              </div>
            </div>
          )}

        </aside>

      </div>

    </div>
  );
}

export default JobDetails;