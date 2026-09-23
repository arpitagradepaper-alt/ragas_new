import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  PlusCircle,
  Search,
  MapPin,
  Clock3,
  Users,
  Eye,
  Pencil,
  XCircle,
} from "lucide-react";
import "./PartnerJobs.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const PARTNER_JOBS_API = `${API_BASE_URL}/api/partners/jobs`;

function PartnerJobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("ragasPartnerToken");

      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch(PARTNER_JOBS_API, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        const receivedJobs =
          data.jobs ||
          data.data ||
          (Array.isArray(data) ? data : []);

        setJobs(receivedJobs);
      } else {
        console.error(
          data.message || "Unable to fetch jobs."
        );
      }
    } catch (error) {
      console.error("Fetch jobs error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getJobStatus = (job) => {
    if (job.status) {
      return job.status;
    }

    if (job.isActive === false) {
      return "Closed";
    }

    return "Active";
  };

  const filteredJobs = jobs.filter((job) => {
    const title =
      job.title ||
      job.jobTitle ||
      "";

    const location =
      job.location ||
      "";

    const matchesSearch =
      title
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      location
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const status = getJobStatus(job);

    const matchesStatus =
      statusFilter === "All" ||
      status.toLowerCase() ===
        statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const handleCloseJob = async (jobId) => {
    const confirmed = window.confirm(
      "Are you sure you want to close this job?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("ragasPartnerToken");

      const response = await fetch(
        `${PARTNER_JOBS_API}/${jobId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            close: true,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to close job."
        );
      }

      fetchJobs();
    } catch (error) {
      console.error("Close job error:", error);
      alert(error.message);
    }
  };

  /* -----------------------------------------
     PUBLISH A DRAFT

     Only a verified partner account can publish. The
     backend refuses with 403 until the admin verifies.
  ----------------------------------------- */

  const handlePublishJob = async (jobId) => {
    const confirmed = window.confirm(
      "Publish this draft? It will be sent to the admin for approval."
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("ragasPartnerToken");

      const response = await fetch(
        `${PARTNER_JOBS_API}/${jobId}/publish`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to publish job."
        );
      }

      alert(data.message);
      fetchJobs();
    } catch (error) {
      console.error("Publish job error:", error);
      alert(error.message);
    }
  };

  return (
    <div className="partner-jobs">

      <div className="partner-jobs-heading">

        <div>
          <p className="partner-jobs-eyebrow">
            JOB MANAGEMENT
          </p>

          <h2>My Jobs</h2>

          <p className="partner-jobs-description">
            Manage the job vacancies posted by your company.
          </p>
        </div>

        <button
          type="button"
          className="partner-post-job-button"
          onClick={() =>
            navigate("/partner-dashboard/post-job")
          }
        >
          <PlusCircle size={17} />
          Post New Job
        </button>

      </div>

      <div className="partner-jobs-toolbar">

        <div className="partner-job-search">
          <Search size={16} />

          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />
        </div>

        <div className="partner-job-filter">
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <option value="All">All Status</option>
            <option value="Draft">Draft</option>
            <option value="Approved">Published</option>
            <option value="Pending">Pending Approval</option>
            <option value="Closed">Closed</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

      </div>

      <div className="partner-jobs-count">
        <BriefcaseBusiness size={15} />
        <span>
          {filteredJobs.length}{" "}
          {filteredJobs.length === 1 ? "Job" : "Jobs"}
        </span>
      </div>

      {loading ? (
        <div className="partner-jobs-empty">
          <BriefcaseBusiness size={30} />
          <h3>Loading jobs...</h3>
          <p>
            Please wait while your jobs are being loaded.
          </p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="partner-jobs-empty">

          <div className="partner-empty-icon">
            <BriefcaseBusiness size={30} />
          </div>

          <h3>No jobs found</h3>

          <p>
            You have not posted any jobs yet, or no jobs
            match your current search.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/partner-dashboard/post-job")
            }
          >
            <PlusCircle size={16} />
            Post Your First Job
          </button>

        </div>
      ) : (
        <div className="partner-jobs-list">

          {filteredJobs.map((job) => {
            const jobId = job._id || job.id;

            const title =
              job.title ||
              job.jobTitle ||
              "Untitled Job";

            const location =
              job.location ||
              "Location not specified";

            const jobType =
              job.jobType ||
              job.type ||
              "Full-time";

            const company =
              job.company ||
              job.companyName ||
              "Company";

            const applications =
              job.applicationCount ??
              job.applicationsCount ??
              (Array.isArray(job.applications)
                ? job.applications.length
                : 0);

            const status = getJobStatus(job);

            return (
              <div
                className="partner-job-card"
                key={jobId}
              >

                <div className="partner-job-card-main">

                  <div className="partner-job-icon">
                    <BriefcaseBusiness size={21} />
                  </div>

                  <div className="partner-job-info">

                    <div className="partner-job-title-row">

                      <h3>{title}</h3>

                      <span
                        className={`partner-job-status partner-status-${status
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      >
                        {status}
                      </span>

                    </div>

                    <p className="partner-job-company">
                      {company}
                    </p>

                    <div className="partner-job-meta">

                      <span>
                        <MapPin size={14} />
                        {location}
                      </span>

                      <span>
                        <Clock3 size={14} />
                        {jobType}
                      </span>

                      <span>
                        <Users size={14} />
                        {applications} Applications
                      </span>

                    </div>

                  </div>

                </div>

                <div className="partner-job-actions">

                  <button
                    type="button"
                    title="View Job"
                    onClick={() =>
                      navigate(
                        `/partner-dashboard/jobs/${jobId}`
                      )
                    }
                  >
                    <Eye size={16} />
                    <span>View</span>
                  </button>

                  <button
                    type="button"
                    title="Edit Job"
                    onClick={() =>
                      navigate(
                        `/partner-dashboard/jobs/${jobId}?edit=true`
                      )
                    }
                  >
                    <Pencil size={16} />
                    <span>Edit</span>
                  </button>

                  {/* Drafts can be published once the partner account is verified */}
                  {status.toLowerCase() === "draft" && (
                    <button
                      type="button"
                      title="Publish Job"
                      onClick={() =>
                        handlePublishJob(jobId)
                      }
                    >
                      <PlusCircle size={16} />
                      <span>Publish</span>
                    </button>
                  )}

                  {(status.toLowerCase() === "approved" ||
                    status.toLowerCase() === "active") && (
                    <button
                      type="button"
                      className="partner-close-job-btn"
                      title="Close Job"
                      onClick={() =>
                        handleCloseJob(jobId)
                      }
                    >
                      <XCircle size={16} />
                      <span>Close</span>
                    </button>
                  )}

                </div>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}

export default PartnerJobs;