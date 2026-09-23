import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Jobs.css";
import AdminPostJobModal from "./AdminPostJobModal";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const API_URL = API_BASE_URL;
const JOBS_PER_PAGE = 10;

function Jobs() {
  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  const [search, setSearch] = useState("");
  const [industryFilter, setIndustryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [updatingJobId, setUpdatingJobId] = useState(null);

  // Applicant modal
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplicants, setShowApplicants] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  // =====================================================
  // SAFE JSON FUNCTION
  // =====================================================
  const getJsonResponse = async (response) => {
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch (error) {
      console.error("Invalid API response:", text);
      throw new Error("Backend API returned an invalid response.");
    }
  };

  // =====================================================
  // FETCH JOBS + APPLICATIONS
  // =====================================================
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("ragasAdminToken");

      const authHeaders = {
        Authorization: `Bearer ${token}`,
      };

      const [jobsResponse, applicationsResponse] = await Promise.all([
        fetch(`${API_URL}/api/jobs/admin/all`, {
          headers: authHeaders,
        }),
        fetch(`${API_URL}/api/applications`, {
          headers: authHeaders,
        }),
      ]);

      if (!jobsResponse.ok) {
        throw new Error("Unable to load jobs.");
      }

      if (!applicationsResponse.ok) {
        throw new Error("Unable to load applications.");
      }

      const jobsData = await getJsonResponse(jobsResponse);
      const applicationsData = await getJsonResponse(applicationsResponse);

      console.log("Admin Jobs:", jobsData);
      console.log("Applications:", applicationsData);

      /* Partner drafts are private to the partner panel until the
         partner publishes them, so they never enter this queue. */
      const visibleJobs = (jobsData.data || []).filter(
        (job) => job.status !== "Draft"
      );

      setJobs(visibleJobs);
      setApplications(applicationsData.data || []);
    } catch (err) {
      console.error("Jobs error:", err);
      setError(err.message || "Unable to load jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // =====================================================
  // NORMALIZE & SLUGIFY
  // =====================================================
  const normalize = (value) => {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
  };

  const slugify = (value) => {
    return String(value || "")
      .toLowerCase()
      .trim()
      .replace(/[—–]/g, "-")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const getDisplayStatus = (status) => {
    if (status === "Approved") return "Published";
    if (status === "Pending") return "Pending";
    if (status === "Rejected") return "Rejected";
    if (status === "Closed") return "Closed";
    return status || "Pending";
  };

  // =====================================================
  // INDUSTRIES
  // =====================================================
  const industries = useMemo(() => {
    const values = jobs.map((job) => job.category).filter(Boolean);
    return [...new Set(values)].sort();
  }, [jobs]);

  // =====================================================
  // APPLICATION BELONGS TO JOB
  // =====================================================
  const applicationBelongsToJob = (application, job) => {
    const applicationJobId = normalize(application.jobId);
    const applicationJobTitle = normalize(application.jobTitle);
    const mongoJobId = normalize(job._id);
    const adminJobTitle = normalize(job.jobTitle);
    const adminJobSlug = normalize(slugify(job.jobTitle));

    if (applicationJobId && mongoJobId && applicationJobId === mongoJobId) return true;
    if (applicationJobTitle && adminJobTitle && applicationJobTitle === adminJobTitle) return true;
    if (applicationJobId && adminJobTitle && applicationJobId === adminJobTitle) return true;
    if (applicationJobId && adminJobSlug && applicationJobId === adminJobSlug) return true;

    return false;
  };

  const getApplicants = (job) => {
    return applications.filter((application) => applicationBelongsToJob(application, job));
  };

  const getApplicantCount = (job) => {
    return getApplicants(job).length;
  };

  const openApplicants = (job) => {
    setSelectedJob(job);
    setSelectedApplication(null);
    setShowApplicants(true);
  };

  const handleViewJob = (job) => {
    if (!job?._id) {
      alert("Job ID is not available.");
      return;
    }
    navigate(`/admin/jobs/${job._id}`);
  };

  // =====================================================
  // UPDATE JOB STATUS
  // =====================================================
  const updateJobStatus = async (jobId, newStatus) => {
    if (!jobId) {
      alert("Job ID is not available.");
      return;
    }

    try {
      setUpdatingJobId(jobId);
      setError("");

      const token = localStorage.getItem("ragasAdminToken");

      const response = await fetch(`${API_URL}/api/jobs/${jobId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await getJsonResponse(response);

      if (!response.ok) {
        throw new Error(result.message || "Unable to update job status.");
      }

      setJobs((previousJobs) =>
        previousJobs.map((job) =>
          job._id === jobId ? { ...job, status: newStatus } : job
        )
      );

      setSelectedJob((previousJob) => {
        if (!previousJob || previousJob._id !== jobId) return previousJob;
        return { ...previousJob, status: newStatus };
      });
    } catch (err) {
      console.error("Update job status error:", err);
      alert(err.message || "Unable to update job status.");
    } finally {
      setUpdatingJobId(null);
    }
  };

  const approveJob = (job) => job?._id && updateJobStatus(job._id, "Approved");
  const rejectJob = (job) => job?._id && updateJobStatus(job._id, "Rejected");
  const closeJob = (job) => job?._id && updateJobStatus(job._id, "Closed");
  const reopenJob = (job) => job?._id && updateJobStatus(job._id, "Pending");

  const closeApplicants = () => {
    setShowApplicants(false);
    setSelectedJob(null);
    setSelectedApplication(null);
  };

  const openApplication = (application) => setSelectedApplication(application);
  const backToApplicants = () => setSelectedApplication(null);

  // =====================================================
  // CONTACT HANDLERS
  // =====================================================
  const emailCandidate = (application) => {
    if (!application?.email) return alert("Candidate email is not available.");
    const subject = encodeURIComponent(`Regarding your application - ${application.jobTitle || "Job Application"}`);
    const body = encodeURIComponent(`Dear ${application.fullName || "Candidate"},\n\nWe are contacting you regarding your job application.\n\nRegards,\nRAGAS CAREER WORLD`);
    window.location.href = `mailto:${application.email}?subject=${subject}&body=${body}`;
  };

  const whatsappCandidate = (application) => {
    if (!application?.phone) return alert("Candidate phone number is not available.");
    let phone = String(application.phone).replace(/\D/g, "");
    if (phone.length === 10) phone = `91${phone}`;
    const message = encodeURIComponent(`Hello ${application.fullName || "Candidate"}, this is RAGAS CAREER WORLD regarding your job application.`);
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  const callCandidate = (application) => {
    if (!application?.phone) return alert("Candidate phone number is not available.");
    window.location.href = `tel:${application.phone}`;
  };

  const handleResume = (application) => {
    if (!application?.resumeFile) return alert("Resume is not available.");
    const resumeUrl = `${API_URL}/api/applications/resume/${encodeURIComponent(application.resumeFile)}`;
    window.open(resumeUrl, "_blank");
  };

  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/api/applications/${applicationId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("ragasAdminToken") || ""}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await getJsonResponse(response);
      if (!response.ok) throw new Error(result.message || "Unable to update application status.");

      setApplications((previous) =>
        previous.map((app) => (app._id === applicationId ? { ...app, status: newStatus } : app))
      );

      setSelectedApplication((prev) => (prev && prev._id === applicationId ? { ...prev, status: newStatus } : prev));
    } catch (err) {
      console.error(err);
      alert(err.message || "Unable to update application status.");
    }
  };

  // =====================================================
  // FILTER JOBS
  // =====================================================
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const searchValue = normalize(search);
      const matchesSearch =
        !searchValue ||
        normalize(job.jobTitle).includes(searchValue) ||
        normalize(job.companyName).includes(searchValue) ||
        normalize(job.location).includes(searchValue) ||
        normalize(job.category).includes(searchValue) ||
        normalize(job._id).includes(searchValue);

      const matchesIndustry = industryFilter === "All" || job.category === industryFilter;
      const displayStatus = getDisplayStatus(job.status);
      const matchesStatus = statusFilter === "All" || displayStatus === statusFilter;

      return matchesSearch && matchesIndustry && matchesStatus;
    });
  }, [jobs, search, industryFilter, statusFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, industryFilter, statusFilter]);

  // =====================================================
  // PAGINATION
  // =====================================================
  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / JOBS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * JOBS_PER_PAGE;
  const endIndex = startIndex + JOBS_PER_PAGE;
  const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

  const showingStart = filteredJobs.length === 0 ? 0 : startIndex + 1;
  const showingEnd = Math.min(endIndex, filteredJobs.length);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const getJobId = (job, index) => {
    if (job?._id) return `JOB-${job._id.slice(-4).toUpperCase()}`;
    return `JOB-${String(index + 1).padStart(4, "0")}`;
  };

  const totalApplicants = applications.length;
  const publishedJobs = jobs.filter((job) => job.status === "Approved").length;
  const pendingJobs = jobs.filter((job) => job.status === "Pending").length;
  const rejectedJobs = jobs.filter((job) => job.status === "Rejected").length;

  const resetFilters = () => {
    setSearch("");
    setIndustryFilter("All");
    setStatusFilter("All");
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="jobs-admin-page">
        <div style={{ textAlign: "center", padding: "80px 20px" }}>Loading jobs...</div>
      </div>
    );
  }

  return (
    <div className="jobs-admin-page">
      {/* HEADING */}
      <div className="jobs-admin-heading">
        <div>
          <p>JOB MANAGEMENT</p>
          <h2>Job Posts</h2>
          <span>Review, approve and manage job vacancies submitted by employers.</span>
        </div>
        <button className="add-job-btn" type="button" onClick={() => {
    setShowAddJobModal(true);
  }}>
          + Add Job
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {/* STATS */}
      <div className="job-admin-stats">
        <div><span>Total Jobs</span><strong>{jobs.length}</strong><small>All job postings</small></div>
        <div><span>Published</span><strong>{publishedJobs}</strong><small>Currently approved</small></div>
        <div><span>Pending Approval</span><strong>{pendingJobs}</strong><small>Requires review</small></div>
        <div><span>Rejected</span><strong>{rejectedJobs}</strong><small>Rejected job posts</small></div>
        <div><span>Total Applicants</span><strong>{totalApplicants}</strong><small>Applications received</small></div>
      </div>

      {/* TABLE CARD */}
      <section className="jobs-admin-card">
        <div className="jobs-admin-toolbar">
          <div className="jobs-admin-search">
            <span>⌕</span>
            <input
              type="text"
              placeholder="Search job title, company or job ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select value={industryFilter} onChange={(e) => setIndustryFilter(e.target.value)}>
            <option value="All">All Industries</option>
            {industries.map((ind) => (<option key={ind} value={ind}>{ind}</option>))}
          </select>

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All Status</option>
            <option value="Published">Published</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
            <option value="Closed">Closed</option>
          </select>

          <button className="jobs-filter-btn" type="button" onClick={resetFilters}>Reset</button>
        </div>

        {/* TABLE */}
        <div className="jobs-table-wrapper">
          <table className="jobs-admin-table">
            <thead>
              <tr>
                <th>Job</th>
                <th>Employer</th>
                <th>Location</th>
                <th>Industry</th>
                <th>Applicants</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedJobs.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "40px" }}>No jobs found.</td>
                </tr>
              ) : (
                paginatedJobs.map((job, index) => {
                  const realIndex = startIndex + index;
                  const jobId = getJobId(job, realIndex);
                  const displayStatus = getDisplayStatus(job.status);
                  const applicantCount = getApplicantCount(job);
                  const isUpdating = updatingJobId === job._id;

                  return (
                    <tr key={job._id || jobId}>
                      <td>
                        <div className="job-title-cell">
                          <strong>{job.jobTitle || "Job Position"}</strong>
                          <small>{jobId}</small>
                        </div>
                      </td>
                      <td>{job.companyName || "—"}</td>
                      <td>{job.location || "—"}</td>
                      <td>{job.category || "—"}</td>
                      <td>
                        <button type="button" className="applicant-count applicant-count-btn" onClick={() => openApplicants(job)}>
                          {applicantCount}
                        </button>
                      </td>
                      <td>
                        <span className={`job-admin-status ${displayStatus.toLowerCase().replace(/\s+/g, "-")}`}>
                          {displayStatus}
                        </span>
                      </td>
                      <td>
                        <div className="job-action-buttons">
                          <button className="job-view-btn" type="button" onClick={() => handleViewJob(job)}>View</button>
                          {job.status === "Pending" && (
                            <>
                              <button className="job-approve-btn" type="button" disabled={isUpdating} onClick={() => approveJob(job)}>
                                {isUpdating ? "..." : "Approve"}
                              </button>
                              <button className="job-reject-btn" type="button" disabled={isUpdating} onClick={() => rejectJob(job)}>
                                Reject
                              </button>
                            </>
                          )}
                          {job.status === "Approved" && (
                            <button className="job-close-btn" type="button" disabled={isUpdating} onClick={() => closeJob(job)}>
                              {isUpdating ? "..." : "Close"}
                            </button>
                          )}
                          {(job.status === "Rejected" || job.status === "Closed") && (
                            <button className="job-reopen-btn" type="button" disabled={isUpdating} onClick={() => reopenJob(job)}>
                              {isUpdating ? "..." : "Reopen"}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {filteredJobs.length > 0 && (
          <div className="jobs-pagination">
            <span>Showing {showingStart} to {showingEnd} of {filteredJobs.length} jobs</span>
            <div className="pagination-buttons">
              <button disabled={safeCurrentPage === 1} onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}>Previous</button>
              {pageNumbers.map((p) => (
                <button key={p} className={safeCurrentPage === p ? "active" : ""} onClick={() => setCurrentPage(p)}>{p}</button>
              ))}
              <button disabled={safeCurrentPage === totalPages} onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}>Next</button>
            </div>
          </div>
        )}
      </section>

      {/* =====================================================
          ADD JOB MODAL INTEGRATION
      ===================================================== */}
        {showAddJobModal && (
          <AdminPostJobModal
            isOpen={showAddJobModal}
            API_URL={API_URL}
            onClose={() => setShowAddJobModal(false)}
            onJobCreated={() => {
              setShowAddJobModal(false);
              fetchData();
            }}
          />
        )}

      {/* =====================================================
          APPLICANTS MODAL INTEGRATION
      ===================================================== */}
      {showApplicants && selectedJob && (
        <div className="modal-overlay" onClick={closeApplicants}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedApplication ? "Application Details" : `Applicants for ${selectedJob.jobTitle}`}</h3>
              <button className="close-btn" onClick={closeApplicants}>&times;</button>
            </div>
            <div className="modal-body">
              {selectedApplication ? (
                <div className="application-detail-view">
                  <button className="back-btn" onClick={backToApplicants}>&larr; Back to Applicants</button>
                  <h4>{selectedApplication.fullName}</h4>
                  <p><strong>Email:</strong> {selectedApplication.email}</p>
                  <p><strong>Phone:</strong> {selectedApplication.phone}</p>
                  <p><strong>Status:</strong> {selectedApplication.status || "Pending"}</p>
                  <div className="applicant-actions">
                    <button onClick={() => emailCandidate(selectedApplication)}>Email</button>
                    <button onClick={() => whatsappCandidate(selectedApplication)}>WhatsApp</button>
                    <button onClick={() => callCandidate(selectedApplication)}>Call</button>
                    <button onClick={() => handleResume(selectedApplication)}>View Resume</button>
                  </div>
                  <div className="status-change-buttons">
                    <button onClick={() => updateApplicationStatus(selectedApplication._id, "Shortlisted")}>Shortlist</button>
                    <button onClick={() => updateApplicationStatus(selectedApplication._id, "Rejected")}>Reject</button>
                  </div>
                </div>
              ) : (
                <div className="applicants-list-view">
                  {getApplicants(selectedJob).length === 0 ? (
                    <p>No applicants found for this position.</p>
                  ) : (
                    <ul>
                      {getApplicants(selectedJob).map((app) => (
                        <li key={app._id} onClick={() => openApplication(app)}>
                          <strong>{app.fullName}</strong> — {app.email} ({app.status || "Pending"})
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Jobs;