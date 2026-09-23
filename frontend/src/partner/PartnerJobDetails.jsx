import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BriefcaseBusiness,
  MapPin,
  Building2,
  Clock3,
  DollarSign,
  Users,
  Pencil,
  XCircle,
  CheckCircle2,
  CalendarDays,
} from "lucide-react";
import "./PartnerJobDetails.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const API_URL = `${API_BASE_URL}/api/partners/jobs`;

function PartnerJobDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    company: "",
    location: "",
    jobType: "",
    industry: "",
    salary: "",
    experience: "",
    skills: "",
  });

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("ragasPartnerToken");

      if (!token) {
        setError("Partner authentication required.");
        setLoading(false);
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
          data.message || "Unable to load job details."
        );
      }

      const receivedJob =
        data.job ||
        data.data ||
        data;

      setJob(receivedJob);

      setFormData({
        title:
          receivedJob.title ||
          receivedJob.jobTitle ||
          "",
        description:
          receivedJob.description || "",
        company:
          receivedJob.company ||
          receivedJob.companyName ||
          "",
        location:
          receivedJob.location || "",
        jobType:
          receivedJob.jobType ||
          receivedJob.type ||
          "Full-time",
        industry:
          receivedJob.industry || "",
        salary:
          receivedJob.salary || "",
        experience:
          receivedJob.experience || "",
        skills:
          receivedJob.skills || "",
      });
    } catch (err) {
      console.error("Fetch job error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const token = localStorage.getItem("ragasPartnerToken");

      const response = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to update job."
        );
      }

      setEditMode(false);

      await fetchJob();
    } catch (err) {
      console.error("Update job error:", err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCloseJob = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to close this job?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("ragasPartnerToken");

      const response = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          close: true,
          isActive: false,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to close job."
        );
      }

      await fetchJob();
    } catch (err) {
      console.error("Close job error:", err);
      setError(err.message);
    }
  };

  const getStatus = () => {
    if (!job) {
      return "Unknown";
    }

    if (job.status) {
      return job.status;
    }

    if (job.isActive === false) {
      return "Closed";
    }

    return "Active";
  };

  const status = getStatus();

  if (loading) {
    return (
      <div className="partner-job-details-state">
        <BriefcaseBusiness size={30} />
        <h3>Loading job details...</h3>
        <p>Please wait.</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="partner-job-details-state">
        <BriefcaseBusiness size={30} />
        <h3>Job not found</h3>
        <p>{error || "Unable to find this job."}</p>

        <button
          type="button"
          onClick={() =>
            navigate("/partner-dashboard/jobs")
          }
        >
          <ArrowLeft size={15} />
          Back to My Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="partner-job-details">

      <div className="partner-job-details-header">

        <div>
          <button
            type="button"
            className="partner-job-back-btn"
            onClick={() =>
              navigate("/partner-dashboard/jobs")
            }
          >
            <ArrowLeft size={15} />
            Back to My Jobs
          </button>

          <p className="partner-job-details-eyebrow">
            JOB DETAILS
          </p>

          <h2>
            {job.title ||
              job.jobTitle ||
              "Job Details"}
          </h2>

          <p className="partner-job-details-company">
            {job.company ||
              job.companyName ||
              "Company"}
          </p>
        </div>

        <div className="partner-job-details-actions">

          {!editMode && (
            <button
              type="button"
              className="partner-edit-job-btn"
              onClick={() => setEditMode(true)}
            >
              <Pencil size={15} />
              Edit Job
            </button>
          )}

          {!editMode &&
            status.toLowerCase() === "active" && (
              <button
                type="button"
                className="partner-close-details-btn"
                onClick={handleCloseJob}
              >
                <XCircle size={15} />
                Close Job
              </button>
            )}

        </div>

      </div>

      {error && (
        <div className="partner-job-details-error">
          {error}
        </div>
      )}

      {editMode ? (
        <form
          className="partner-job-edit-form"
          onSubmit={handleSave}
        >

          <div className="partner-job-detail-card">

            <div className="partner-detail-card-header">
              <BriefcaseBusiness size={18} />

              <div>
                <h3>Edit Job</h3>
                <p>
                  Update the information for this vacancy.
                </p>
              </div>
            </div>

            <div className="partner-job-edit-grid">

              <div className="partner-edit-group full-width">
                <label>Job Title</label>

                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="partner-edit-group">
                <label>Company Name</label>

                <input
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                />
              </div>

              <div className="partner-edit-group">
                <label>Location</label>

                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>

              <div className="partner-edit-group">
                <label>Job Type</label>

                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                >
                  <option value="Full-time">
                    Full-time
                  </option>

                  <option value="Part-time">
                    Part-time
                  </option>

                  <option value="Contract">
                    Contract
                  </option>

                  <option value="Temporary">
                    Temporary
                  </option>

                  <option value="Internship">
                    Internship
                  </option>
                </select>
              </div>

              <div className="partner-edit-group">
                <label>Industry</label>

                <input
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                />
              </div>

              <div className="partner-edit-group">
                <label>Salary</label>

                <input
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                />
              </div>

              <div className="partner-edit-group">
                <label>Experience</label>

                <input
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                />
              </div>

              <div className="partner-edit-group full-width">
                <label>Job Description</label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="7"
                  required
                />
              </div>

              <div className="partner-edit-group full-width">
                <label>Required Skills</label>

                <textarea
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  rows="4"
                />
              </div>

            </div>

            <div className="partner-edit-actions">

              <button
                type="button"
                className="partner-cancel-edit-btn"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="partner-save-job-btn"
                disabled={saving}
              >
                <CheckCircle2 size={15} />
                {saving ? "Saving..." : "Save Changes"}
              </button>

            </div>

          </div>

        </form>
      ) : (
        <>
          <div className="partner-job-overview-grid">

            <div className="partner-job-overview-card">
              <div className="partner-overview-icon">
                <MapPin size={19} />
              </div>

              <span>Location</span>

              <strong>
                {job.location ||
                  "Not specified"}
              </strong>
            </div>

            <div className="partner-job-overview-card">
              <div className="partner-overview-icon">
                <Clock3 size={19} />
              </div>

              <span>Job Type</span>

              <strong>
                {job.jobType ||
                  job.type ||
                  "Full-time"}
              </strong>
            </div>

            <div className="partner-job-overview-card">
              <div className="partner-overview-icon">
                <DollarSign size={19} />
              </div>

              <span>Salary</span>

              <strong>
                {job.salary ||
                  "Not specified"}
              </strong>
            </div>

            <div className="partner-job-overview-card">
              <div className="partner-overview-icon">
                <Users size={19} />
              </div>

              <span>Applications</span>

              <strong>
                {job.applicationCount ??
                  job.applicationsCount ??
                  0}
              </strong>
            </div>

          </div>

          <div className="partner-job-detail-layout">

            <div className="partner-job-main-column">

              <section className="partner-job-detail-card">

                <div className="partner-detail-card-header">
                  <FileTextIcon />
                  <div>
                    <h3>Job Description</h3>
                    <p>
                      Complete information about this vacancy.
                    </p>
                  </div>
                </div>

                <div className="partner-job-description-content">
                  {job.description ? (
                    <p>{job.description}</p>
                  ) : (
                    <p className="partner-muted">
                      No job description available.
                    </p>
                  )}
                </div>

              </section>

              <section className="partner-job-detail-card">

                <div className="partner-detail-card-header">
                  <BriefcaseBusiness size={18} />

                  <div>
                    <h3>Required Skills</h3>
                    <p>
                      Skills and qualifications required for the role.
                    </p>
                  </div>
                </div>

                <div className="partner-skills">
                  {job.skills ? (
                    String(job.skills)
                      .split(",")
                      .map((skill) => (
                        <span key={skill.trim()}>
                          {skill.trim()}
                        </span>
                      ))
                  ) : (
                    <p className="partner-muted">
                      No skills specified.
                    </p>
                  )}
                </div>

              </section>

            </div>

            <aside className="partner-job-side-column">

              <section className="partner-job-detail-card">

                <div className="partner-detail-card-header">
                  <CalendarDays size={18} />

                  <div>
                    <h3>Job Information</h3>
                  </div>
                </div>

                <div className="partner-info-list">

                  <div>
                    <span>Status</span>

                    <strong
                      className={`partner-details-status partner-details-status-${status
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {status}
                    </strong>
                  </div>

                  <div>
                    <span>Industry</span>

                    <strong>
                      {job.industry ||
                        "Not specified"}
                    </strong>
                  </div>

                  <div>
                    <span>Experience</span>

                    <strong>
                      {job.experience ||
                        "Not specified"}
                    </strong>
                  </div>

                  <div>
                    <span>Posted</span>

                    <strong>
                      {job.createdAt
                        ? new Date(
                            job.createdAt
                          ).toLocaleDateString()
                        : "Not available"}
                    </strong>
                  </div>

                </div>

              </section>

              <button
                type="button"
                className="partner-view-applications-btn"
                onClick={() =>
                  navigate(
                    `/partner-dashboard/applications?job=${id}`
                  )
                }
              >
                <Users size={16} />
                View Applications
              </button>

            </aside>

          </div>
        </>
      )}

    </div>
  );
}

function FileTextIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

export default PartnerJobDetails;