import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PartnerDashboard.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const DASHBOARD_API = `${API_BASE_URL}/api/partners/dashboard`;

function PartnerDashboard() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState({
    stats: {
      totalJobs: 0,
      activeJobs: 0,
      closedJobs: 0,
      totalApplications: 0,
      pendingReview: 0,
      drafts: 0,
      rejectedJobs: 0,
      shortlisted: 0,
      interviews: 0,
      selectedCandidates: 0,
    },
    partnerStatus: null,
    canPublishJobs: false,
    jobs: [],
    applications: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("ragasPartnerToken");

  useEffect(() => {
    const loadPartnerDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        if (!token) {
          navigate("/partner-login", { replace: true });
          return;
        }

        const response = await fetch(DASHBOARD_API, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load partner dashboard data.");
        }

        setDashboard({
          stats: data.data.stats,
          partnerStatus: data.data.partnerStatus || null,
          canPublishJobs: data.data.canPublishJobs === true,
          jobs: data.data.jobs || [],
          applications: data.data.applications || [],
        });
      } catch (err) {
        console.error("Partner dashboard error:", err);
        setError(err.message || "Unable to load partner dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    loadPartnerDashboard();
  }, [token, navigate]);

  return (
    <div className="partner-dashboard-page">
      <section className="partner-dashboard-head-row">
        <div className="partner-dashboard-head-copy">
          <p className="partner-dashboard-eyebrow">PARTNER PORTAL</p>
          <h1>Dashboard</h1>
          <p className="partner-dashboard-description">
            Monitor your recruitment activity, jobs, applications and applicant pipeline.
          </p>
        </div>

        <div className="partner-dashboard-top-right">
          <span className="partner-dashboard-date">September 2026</span>
        </div>
      </section>

      {error && <div className="partner-dashboard-error">{error}</div>}

      {/* -----------------------------------------
          PARTNER VERIFICATION NOTICE

          Login and the dashboard work immediately after
          registration. Publishing jobs requires the admin to
          verify this account, and drafts are allowed meanwhile.
      ----------------------------------------- */}

      {!loading && dashboard.partnerStatus && (
        <div
          className={
            dashboard.canPublishJobs
              ? "partner-dashboard-notice partner-dashboard-notice-verified"
              : "partner-dashboard-notice partner-dashboard-notice-pending"
          }
        >
          {dashboard.canPublishJobs ? (
            <p>
              <strong>Account verified.</strong> You can publish jobs
              directly - each published job is sent to the admin for
              final approval.
            </p>
          ) : (
            <p>
              <strong>
                Account verification {dashboard.partnerStatus}.
              </strong>{}
              You can create jobs and keep them as drafts. Publishing
              will be enabled as soon as the admin verifies your
              account.
            </p>
          )}
        </div>
      )}

      {loading ? (
        <div className="partner-dashboard-loading">Loading partner dashboard...</div>
      ) : (
        <>
          <section className="partner-stat-card-grid">
            <article className="partner-dashboard-stat-card">
              <div className="partner-dashboard-stat-head">
                <span>Total Jobs Posted</span>
                <span className="partner-dashboard-stat-icon">▣</span>
              </div>
              <strong>{dashboard.stats.totalJobs}</strong>
              <small>Jobs published by your team</small>
            </article>

            <article className="partner-dashboard-stat-card">
              <div className="partner-dashboard-stat-head">
                <span>Active Jobs</span>
                <span className="partner-dashboard-stat-icon">✓</span>
              </div>
              <strong>{dashboard.stats.activeJobs}</strong>
              <small>Currently live jobs</small>
            </article>

            <article className="partner-dashboard-stat-card">
              <div className="partner-dashboard-stat-head">
                <span>Closed Jobs</span>
                <span className="partner-dashboard-stat-icon">□</span>
              </div>
              <strong>{dashboard.stats.closedJobs}</strong>
              <small>Jobs closed or archived</small>
            </article>

            <article className="partner-dashboard-stat-card">
              <div className="partner-dashboard-stat-head">
                <span>Total Applications</span>
                <span className="partner-dashboard-stat-icon">✎</span>
              </div>
              <strong>{dashboard.stats.totalApplications}</strong>
              <small>All applications received</small>
            </article>

            <article className="partner-dashboard-stat-card">
              <div className="partner-dashboard-stat-head">
                <span>Pending Review</span>
                <span className="partner-dashboard-stat-icon">◌</span>
              </div>
              <strong>{dashboard.stats.pendingReview}</strong>
              <small>Jobs awaiting approval</small>
            </article>

            <article className="partner-dashboard-stat-card">
              <div className="partner-dashboard-stat-head">
                <span>Shortlisted</span>
                <span className="partner-dashboard-stat-icon">♙</span>
              </div>
              <strong>{dashboard.stats.shortlisted}</strong>
              <small>Candidates shortlisted</small>
            </article>

            <article className="partner-dashboard-stat-card">
              <div className="partner-dashboard-stat-head">
                <span>Interviews</span>
                <span className="partner-dashboard-stat-icon">☏</span>
              </div>
              <strong>{dashboard.stats.interviews}</strong>
              <small>Interview stage</small>
            </article>

            <article className="partner-dashboard-stat-card">
              <div className="partner-dashboard-stat-head">
                <span>Selected Candidates</span>
                <span className="partner-dashboard-stat-icon">✦</span>
              </div>
              <strong>{dashboard.stats.selectedCandidates}</strong>
              <small>Selected successfully</small>
            </article>
          </section>

          <section className="partner-dashboard-main-grid">
            <section className="partner-dashboard-panel partner-dashboard-activity-panel">
              <div className="partner-dashboard-panel-header">
                <div>
                  <span className="partner-dashboard-panel-kicker">PARTNER ACTIVITY</span>
                  <h2>Recruitment Activity</h2>
                </div>
                <span className="partner-dashboard-live">
                  <span></span>Live
                </span>
              </div>

              <div className="partner-dashboard-chart">
                {[45, 56, 62, 40, 70, 55, 83].map((height, index) => (
                  <div className="partner-dashboard-chart-col" key={index}>
                    <div className="partner-dashboard-chart-bg">
                      <span className="partner-dashboard-chart-bar" style={{ height: `${height}%` }}></span>
                    </div>
                    <span className="partner-dashboard-chart-label">{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}</span>
                  </div>
                ))}
              </div>
            </section>

            <aside className="partner-dashboard-panel partner-dashboard-summary-panel">
              <div className="partner-dashboard-summary-head">
                <h2>Quick Summary</h2>
              </div>
              <div className="partner-dashboard-summary-list">
                <div className="partner-dashboard-summary-row">
                  <span>Active Jobs</span>
                  <strong>{dashboard.stats.activeJobs}</strong>
                </div>
                <div className="partner-dashboard-summary-row">
                  <span>Applications Received</span>
                  <strong>{dashboard.stats.totalApplications}</strong>
                </div>
                <div className="partner-dashboard-summary-row">
                  <span>Pending Applications</span>
                  <strong>{Math.max(dashboard.stats.totalApplications - dashboard.stats.shortlisted - dashboard.stats.interviews - dashboard.stats.selectedCandidates, 0)}</strong>
                </div>
                <div className="partner-dashboard-summary-row">
                  <span>Shortlisted Candidates</span>
                  <strong>{dashboard.stats.shortlisted}</strong>
                </div>
                <div className="partner-dashboard-summary-row">
                  <span>Interviews</span>
                  <strong>{dashboard.stats.interviews}</strong>
                </div>
                <div className="partner-dashboard-summary-row">
                  <span>Selected Candidates</span>
                  <strong>{dashboard.stats.selectedCandidates}</strong>
                </div>
              </div>
            </aside>
          </section>

          <section className="partner-dashboard-lower-grid">
            <section className="partner-dashboard-panel partner-dashboard-list-panel">
              <div className="partner-dashboard-panel-header partner-dashboard-list-header">
                <div>
                  <span className="partner-dashboard-panel-kicker">RECENT JOBS</span>
                  <h2>Recently Posted Jobs</h2>
                </div>
                <div className="partner-dashboard-actions">
                  <button className="partner-dashboard-action-button" onClick={() => navigate("/partner-dashboard/post-job")}>Post New Job</button>
                  <button className="partner-dashboard-action-button secondary" onClick={() => navigate("/partner-dashboard/jobs")}>My Jobs</button>
                </div>
              </div>

              <div className="partner-dashboard-list">
                {dashboard.jobs.length === 0 && (
                  <div className="partner-dashboard-empty">No jobs posted yet.</div>
                )}

                {dashboard.jobs.slice(0, 5).map((job) => (
                  <div className="partner-dashboard-list-row" key={job._id}>
                    <div className="partner-dashboard-list-title">
                      <span className="partner-dashboard-list-icon">J</span>
                      <div>
                        <strong>{job.jobTitle}</strong>
                        <span>{job.location}</span>
                      </div>
                    </div>
                    <div className="partner-dashboard-list-meta">
                      <span>{job.jobType}</span>
                      <span className={`partner-dashboard-status ${job.status?.toLowerCase()}`}>{job.status}</span>
                    </div>
                    <div className="partner-dashboard-list-count">
                      <span>{dashboard.applications.filter((app) => app.jobId === job._id).length}</span>
                    </div>
                    <div className="partner-dashboard-list-date">
                      <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="partner-dashboard-list-actions">
                      <button className="small-view-btn">View</button>
                      <button className="small-edit-btn">Edit</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="partner-dashboard-panel partner-dashboard-list-panel">
              <div className="partner-dashboard-panel-header partner-dashboard-list-header">
                <div>
                  <span className="partner-dashboard-panel-kicker">RECENT APPLICATIONS</span>
                  <h2>Applications</h2>
                </div>
                <div className="partner-dashboard-actions">
                  <button className="partner-dashboard-action-button" onClick={() => navigate("/partner-dashboard/applications")}>View Applications</button>
                  <button className="partner-dashboard-action-button secondary" onClick={() => navigate("/partner-dashboard/profile")}>My Profile</button>
                </div>
              </div>

              <div className="partner-dashboard-list">
                {dashboard.applications.length === 0 && (
                  <div className="partner-dashboard-empty">No applications received yet.</div>
                )}

                {dashboard.applications.slice(0, 5).map((app) => (
                  <div className="partner-dashboard-list-row application-row" key={app._id}>
                    <div className="partner-dashboard-list-title">
                      <span className="partner-dashboard-list-icon user-icon">{(app.fullName || "C").charAt(0).toUpperCase()}</span>
                      <div>
                        <strong>{app.fullName}</strong>
                        <span>{app.jobTitle}</span>
                      </div>
                    </div>
                    <div className="partner-dashboard-list-meta">
                      <span>{new Date(app.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="partner-dashboard-list-status">
                      <span className={`partner-dashboard-status ${app.status?.toLowerCase().replace(/\s/g, "-")}`}>{app.status}</span>
                    </div>
                    <div className="partner-dashboard-list-actions">
                      <button className="small-view-btn">View Candidate</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </section>
        </>
      )}
    </div>
  );
}

export default PartnerDashboard;