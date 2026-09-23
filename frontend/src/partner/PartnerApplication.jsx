import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Search,
  FileText,
  MapPin,
  CalendarDays,
  Eye,
  Users,
  Filter,
} from "lucide-react";
import "./PartnerApplications.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const API_URL = `${API_BASE_URL}/api/partners/applications`;

function PartnerApplications() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const jobId = searchParams.get("job");

  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [jobFilter, setJobFilter] = useState(jobId || "All");

  useEffect(() => {
    fetchApplications();
    fetchJobs();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("ragasPartnerToken");

      if (!token) {
        setError("Partner authentication required.");
        setLoading(false);
        return;
      }

      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load applications."
        );
      }

      const receivedApplications =
        data.applications ||
        data.data ||
        data.results ||
        (Array.isArray(data) ? data : []);

      setApplications(receivedApplications);
    } catch (err) {
      console.error("Fetch applications error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("ragasPartnerToken");

      if (!token) {
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/partners/jobs`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return;
      }

      const receivedJobs =
        data.jobs ||
        data.data ||
        (Array.isArray(data) ? data : []);

      setJobs(receivedJobs);
    } catch (err) {
      console.error("Fetch jobs error:", err);
    }
  };

  const getCandidateName = (application) => {
    return (
      application.candidateName ||
      application.fullName ||
      application.name ||
      application.candidate?.fullName ||
      application.candidate?.name ||
      "Candidate"
    );
  };

  const getCandidateEmail = (application) => {
    return (
      application.email ||
      application.candidate?.email ||
      "Email not available"
    );
  };

  const getJobTitle = (application) => {
    return (
      application.jobTitle ||
      application.job?.title ||
      application.job?.jobTitle ||
      "Job"
    );
  };

  const getJobId = (application) => {
    return (
      application.jobId ||
      application.job?._id ||
      application.job?._id?.toString?.() ||
      ""
    );
  };

  const getStatus = (application) => {
    return (
      application.status ||
      application.applicationStatus ||
      "Pending"
    );
  };

  const getLocation = (application) => {
    return (
      application.location ||
      application.job?.location ||
      "Location not specified"
    );
  };

  const getAppliedDate = (application) => {
    const date =
      application.createdAt ||
      application.appliedAt ||
      application.applicationDate;

    if (!date) {
      return "Date unavailable";
    }

    try {
      return new Date(date).toLocaleDateString();
    } catch {
      return "Date unavailable";
    }
  };

  const getStatusClass = (status) => {
    return String(status)
      .toLowerCase()
      .replace(/\s+/g, "-");
  };

  const filteredApplications = useMemo(() => {
    return applications.filter((application) => {
      const candidateName =
        getCandidateName(application).toLowerCase();

      const email =
        getCandidateEmail(application).toLowerCase();

      const jobTitle =
        getJobTitle(application).toLowerCase();

      const search =
        searchTerm.trim().toLowerCase();

      const matchesSearch =
        !search ||
        candidateName.includes(search) ||
        email.includes(search) ||
        jobTitle.includes(search);

      const applicationStatus =
        String(getStatus(application)).toLowerCase();

      const matchesStatus =
        statusFilter === "All" ||
        applicationStatus ===
          statusFilter.toLowerCase();

      const applicationJobId =
        String(getJobId(application));

      const matchesJob =
        jobFilter === "All" ||
        applicationJobId === String(jobFilter);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesJob
      );
    });
  }, [
    applications,
    searchTerm,
    statusFilter,
    jobFilter,
  ]);

  const statusCounts = useMemo(() => {
    const counts = {
      All: applications.length,
      Pending: 0,
      Shortlisted: 0,
      Rejected: 0,
      Hired: 0,
    };

    applications.forEach((application) => {
      const status = String(
        getStatus(application)
      ).toLowerCase();

      if (status === "pending") {
        counts.Pending += 1;
      } else if (status === "shortlisted") {
        counts.Shortlisted += 1;
      } else if (status === "rejected") {
        counts.Rejected += 1;
      } else if (status === "hired") {
        counts.Hired += 1;
      }
    });

    return counts;
  }, [applications]);

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setJobFilter("All");
  };

  if (loading) {
    return (
      <div className="partner-applications-state">
        <Users size={30} />
        <h3>Loading applications...</h3>
        <p>Please wait while applications are loaded.</p>
      </div>
    );
  }

  return (
    <div className="partner-applications">

      <div className="partner-applications-header">

        <div>
          <p className="partner-applications-eyebrow">
            APPLICATION MANAGEMENT
          </p>

          <h2>Applications</h2>

          <p className="partner-applications-subtitle">
            Review and manage candidates who applied
            to your jobs.
          </p>
        </div>

      </div>

      {error && (
        <div className="partner-applications-error">
          {error}
        </div>
      )}

      {/* =========================
          STATUS SUMMARY
      ========================= */}

      <div className="partner-application-summary">

        <button
          type="button"
          className={`partner-application-summary-card ${
            statusFilter === "All"
              ? "active"
              : ""
          }`}
          onClick={() => setStatusFilter("All")}
        >
          <span>All Applications</span>
          <strong>{statusCounts.All}</strong>
        </button>

        <button
          type="button"
          className={`partner-application-summary-card ${
            statusFilter === "Pending"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setStatusFilter("Pending")
          }
        >
          <span>Pending</span>
          <strong>{statusCounts.Pending}</strong>
        </button>

        <button
          type="button"
          className={`partner-application-summary-card ${
            statusFilter === "Shortlisted"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setStatusFilter("Shortlisted")
          }
        >
          <span>Shortlisted</span>
          <strong>
            {statusCounts.Shortlisted}
          </strong>
        </button>

        <button
          type="button"
          className={`partner-application-summary-card ${
            statusFilter === "Hired"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setStatusFilter("Hired")
          }
        >
          <span>Hired</span>
          <strong>{statusCounts.Hired}</strong>
        </button>

      </div>

      {/* =========================
          FILTERS
      ========================= */}

      <div className="partner-applications-filters">

        <div className="partner-application-search">
          <Search size={17} />

          <input
            type="text"
            placeholder="Search candidate, email or job..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />
        </div>

        <div className="partner-application-filter">
          <Filter size={15} />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Shortlisted">
              Shortlisted
            </option>
            <option value="Rejected">
              Rejected
            </option>
            <option value="Hired">Hired</option>
          </select>
        </div>

        <div className="partner-application-filter">
          <BriefcaseIcon />

          <select
            value={jobFilter}
            onChange={(e) =>
              setJobFilter(e.target.value)
            }
          >
            <option value="All">All Jobs</option>

            {jobs.map((job) => (
              <option
                key={job._id || job.id}
                value={job._id || job.id}
              >
                {job.title ||
                  job.jobTitle ||
                  "Untitled Job"}
              </option>
            ))}
          </select>
        </div>

        {(searchTerm ||
          statusFilter !== "All" ||
          jobFilter !== "All") && (
          <button
            type="button"
            className="partner-clear-filters"
            onClick={clearFilters}
          >
            Clear
          </button>
        )}

      </div>

      {/* =========================
          RESULTS
      ========================= */}

      <div className="partner-applications-results">

        <div className="partner-results-heading">
          <div>
            <h3>
              Candidate Applications
            </h3>

            <p>
              {filteredApplications.length} application
              {filteredApplications.length !== 1
                ? "s"
                : ""} found
            </p>
          </div>
        </div>

        {filteredApplications.length === 0 ? (
          <div className="partner-applications-empty">

            <div className="partner-empty-icon">
              <FileText size={28} />
            </div>

            <h3>No applications found</h3>

            <p>
              There are no applications matching
              your current filters.
            </p>

            {(searchTerm ||
              statusFilter !== "All" ||
              jobFilter !== "All") && (
              <button
                type="button"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            )}

          </div>
        ) : (
          <div className="partner-application-list">

            {filteredApplications.map(
              (application, index) => {
                const applicationId =
                  application._id ||
                  application.id;

                const status =
                  getStatus(application);

                return (
                  <div
                    className="partner-application-card"
                    key={
                      applicationId ||
                      `application-${index}`
                    }
                  >

                    <div className="partner-application-avatar">
                      {getCandidateName(
                        application
                      )
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="partner-application-main">

                      <div className="partner-application-top">

                        <div>
                          <h4>
                            {getCandidateName(
                              application
                            )}
                          </h4>

                          <p>
                            {getCandidateEmail(
                              application
                            )}
                          </p>
                        </div>

                        <span
                          className={`partner-application-status partner-status-${getStatusClass(
                            status
                          )}`}
                        >
                          {status}
                        </span>

                      </div>

                      <div className="partner-application-meta">

                        <span>
                          <FileText size={14} />
                          {getJobTitle(
                            application
                          )}
                        </span>

                        <span>
                          <MapPin size={14} />
                          {getLocation(
                            application
                          )}
                        </span>

                        <span>
                          <CalendarDays size={14} />
                          Applied{" "}
                          {getAppliedDate(
                            application
                          )}
                        </span>

                      </div>

                    </div>

                    <button
                      type="button"
                      className="partner-view-application-btn"
                      onClick={() =>
                        navigate(
                          `/partner-dashboard/applications/${applicationId}`
                        )
                      }
                    >
                      <Eye size={15} />
                      View
                    </button>

                  </div>
                );
              }
            )}

          </div>
        )}

      </div>

    </div>
  );
}

function BriefcaseIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect
        x="3"
        y="7"
        width="18"
        height="13"
        rx="2"
      />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

export default PartnerApplications;