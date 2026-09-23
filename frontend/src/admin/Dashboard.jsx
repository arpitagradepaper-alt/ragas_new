import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const API_URL = API_BASE_URL;

function Dashboard() {
  const navigate = useNavigate();

  // ==========================================
  // STATE
  // ==========================================

  const [stats, setStats] = useState({
    conversations: 0,
    candidates: 0,
    employers: 0,
    jobs: 0,
    resumes: 0,
    applications: 0,
    contacts: 0,
    pendingJobs: 0,
    partners: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedMonth, setSelectedMonth] =
    useState("September 2026");

  const [showMonths, setShowMonths] = useState(false);

  // ==========================================
  // LOAD DASHBOARD DATA
  // ==========================================

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        // ==========================================
        // ADMIN TOKEN
        // ==========================================

        const token =
          localStorage.getItem("ragasAdminToken");

        // ==========================================
        // FETCH ALL DATA
        // ==========================================

        const [
          candidatesRes,
          employersRes,
          jobsRes,
          resumesRes,
          applicationsRes,
          contactsRes,
          partnersRes,
        ] = await Promise.all([
          fetch(`${API_URL}/api/candidates`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),

          fetch(`${API_URL}/api/employers`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),

          // ADMIN MUST SEE ALL JOBS
          fetch(`${API_URL}/api/jobs/admin/all`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),

          fetch(`${API_URL}/api/resume`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),

          fetch(`${API_URL}/api/applications`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),

          fetch(`${API_URL}/api/contact`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),

          // PARTNERS REQUIRE ADMIN AUTH
          fetch(`${API_URL}/api/partners`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        // ==========================================
        // CHECK RESPONSE STATUS
        // ==========================================

        if (
          !candidatesRes.ok ||
          !employersRes.ok ||
          !jobsRes.ok ||
          !resumesRes.ok ||
          !applicationsRes.ok ||
          !contactsRes.ok ||
          !partnersRes.ok
        ) {
          console.error(
            "Dashboard API status:",
            {
              candidates: candidatesRes.status,
              employers: employersRes.status,
              jobs: jobsRes.status,
              resumes: resumesRes.status,
              applications: applicationsRes.status,
              contacts: contactsRes.status,
              partners: partnersRes.status,
            }
          );

          throw new Error(
            "Unable to load dashboard data."
          );
        }

        // ==========================================
        // CONVERT TO JSON
        // ==========================================

        const [
          candidatesData,
          employersData,
          jobsData,
          resumesData,
          applicationsData,
          contactsData,
          partnersData,
        ] = await Promise.all([
          candidatesRes.json(),
          employersRes.json(),
          jobsRes.json(),
          resumesRes.json(),
          applicationsRes.json(),
          contactsRes.json(),
          partnersRes.json(),
        ]);

        // ==========================================
        // NORMALIZE DATA
        // ==========================================

        const candidates =
          candidatesData.data || [];

        const employers =
          employersData.data || [];

        const jobs =
          jobsData.data ||
          jobsData.jobs ||
          [];

        const resumes =
          resumesData.data || [];

        const applications =
          applicationsData.data || [];

        const contacts =
          contactsData.data || [];

        // IMPORTANT:
        // Partners API returns `partners`
        const partners =
          partnersData.partners || [];

        // ==========================================
        // JOB COUNTS
        // ==========================================

        const pendingJobs = jobs.filter(
          (job) =>
            job.status === "Pending"
        ).length;

        const approvedJobs = jobs.filter(
          (job) =>
            job.status === "Approved"
        ).length;

        // ==========================================
        // UPDATE STATS
        // ==========================================

        setStats({
          conversations:
            contacts.length +
            applications.length,

          candidates:
            candidates.length,

          employers:
            employers.length,

          jobs:
            approvedJobs,

          resumes:
            resumes.length,

          applications:
            applications.length,

          contacts:
            contacts.length,

          pendingJobs:
            pendingJobs,

          partners:
            partners.length,
        });
      } catch (err) {
        console.error(
          "Dashboard error:",
          err
        );

        setError(
          "Unable to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // ==========================================
  // NAVIGATION
  // ==========================================

  const goTo = (path) => {
    navigate(path);
  };

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    setShowMonths(false);
  };

  // ==========================================
  // RETURN
  // ==========================================

  return (
    <div className="dashboard-page">

      {/* ======================================
          PAGE HEADING
      ====================================== */}

      <div className="dashboard-heading">

        <div>
          <p className="dashboard-eyebrow">
            ADMIN OVERVIEW
          </p>

          <h2>
            Dashboard
          </h2>

          <span>
            Monitor recruitment activity, chatbot
            conversations and platform performance.
          </span>
        </div>

        <div className="dashboard-month-wrapper">

          <button
            type="button"
            className="dashboard-date"
            onClick={() =>
              setShowMonths(
                (prev) => !prev
              )
            }
          >
            {selectedMonth} ▾
          </button>

          {showMonths && (
            <div className="dashboard-month-menu">

              {[
                "September 2026",
                "August 2026",
                "July 2026",
                "June 2026",
                "May 2026",
              ].map((month) => (
                <button
                  type="button"
                  key={month}
                  onClick={() =>
                    handleMonthChange(
                      month
                    )
                  }
                >
                  {month}
                </button>
              ))}

            </div>
          )}

        </div>

      </div>

      {/* ======================================
          ERROR
      ====================================== */}

      {error && (
        <div
          style={{
            padding: "12px 16px",
            marginBottom: "20px",
            background: "#fff4f4",
            color: "#b42318",
            borderRadius: "8px",
          }}
        >
          {error}
        </div>
      )}

      {/* ======================================
          STAT CARDS
      ====================================== */}

      <div className="dashboard-stats">

        {/* CONVERSATIONS */}

        <button
          type="button"
          className="dashboard-stat dashboard-stat-button"
          onClick={() =>
            goTo("/admin/chatbot-logs")
          }
        >
          <div className="stat-top">
            <span>
              Total Conversations
            </span>

            <b>◫</b>
          </div>

          <strong>
            {loading
              ? "..."
              : stats.conversations}
          </strong>

          <small>
            Contact + application activity
          </small>
        </button>

        {/* APPLICATIONS */}

        <button
          type="button"
          className="dashboard-stat dashboard-stat-button"
          onClick={() =>
            goTo("/admin/applications")
          }
        >
          <div className="stat-top">
            <span>
              Job Applications
            </span>

            <b>↗</b>
          </div>

          <strong>
            {loading
              ? "..."
              : stats.applications}
          </strong>

          <small>
            Total applications received
          </small>
        </button>

        {/* CANDIDATES */}

        <button
          type="button"
          className="dashboard-stat dashboard-stat-button"
          onClick={() =>
            goTo("/admin/candidates")
          }
        >
          <div className="stat-top">
            <span>
              Candidates
            </span>

            <b>♙</b>
          </div>

          <strong>
            {loading
              ? "..."
              : stats.candidates}
          </strong>

          <small>
            Registered candidates
          </small>
        </button>

        {/* JOBS */}

        <button
          type="button"
          className="dashboard-stat dashboard-stat-button"
          onClick={() =>
            goTo("/admin/jobs")
          }
        >
          <div className="stat-top">
            <span>
              Active Jobs
            </span>

            <b>▣</b>
          </div>

          <strong>
            {loading
              ? "..."
              : stats.jobs}
          </strong>

          <small>
            Approved jobs in platform
          </small>
        </button>

      </div>

      {/* ======================================
          MAIN GRID
      ====================================== */}

      <div className="dashboard-grid">

        {/* ====================================
            RECRUITMENT ACTIVITY
        ==================================== */}

        <section className="dashboard-card chatbot-overview">

          <div className="card-heading">

            <div>
              <p>
                PLATFORM ACTIVITY
              </p>

              <h3>
                Recruitment Activity
              </h3>
            </div>

            <button
              type="button"
              className="online-label"
              onClick={() =>
                goTo("/admin/applications")
              }
            >
              <i></i>
              Live
            </button>

          </div>

          <div className="chatbot-chart">

            <div className="chart-value">

              <strong>
                {loading
                  ? "..."
                  : stats.applications}
              </strong>

              <span>
                applications
              </span>

            </div>

            <div className="fake-chart">

              <div className="chart-line">

                <span
                  style={{
                    height: "38%",
                  }}
                ></span>

                <span
                  style={{
                    height: "52%",
                  }}
                ></span>

                <span
                  style={{
                    height: "44%",
                  }}
                ></span>

                <span
                  style={{
                    height: "68%",
                  }}
                ></span>

                <span
                  style={{
                    height: "57%",
                  }}
                ></span>

                <span
                  style={{
                    height: "78%",
                  }}
                ></span>

                <span
                  style={{
                    height: "72%",
                  }}
                ></span>

                <span
                  style={{
                    height: "91%",
                  }}
                ></span>

              </div>

            </div>

            <div className="chart-days">

              <button
                type="button"
                onClick={() =>
                  goTo("/admin/applications")
                }
              >
                Mon
              </button>

              <button
                type="button"
                onClick={() =>
                  goTo("/admin/applications")
                }
              >
                Tue
              </button>

              <button
                type="button"
                onClick={() =>
                  goTo("/admin/applications")
                }
              >
                Wed
              </button>

              <button
                type="button"
                onClick={() =>
                  goTo("/admin/applications")
                }
              >
                Thu
              </button>

              <button
                type="button"
                onClick={() =>
                  goTo("/admin/applications")
                }
              >
                Fri
              </button>

              <button
                type="button"
                onClick={() =>
                  goTo("/admin/applications")
                }
              >
                Sat
              </button>

              <button
                type="button"
                onClick={() =>
                  goTo("/admin/applications")
                }
              >
                Sun
              </button>

            </div>

          </div>

        </section>

        {/* ====================================
            QUICK SUMMARY
        ==================================== */}

        <section className="dashboard-card summary-card">

          <div className="card-heading">

            <div>
              <p>
                PLATFORM
              </p>

              <h3>
                Quick Summary
              </h3>
            </div>

          </div>

          {/* CANDIDATES */}

          <button
            type="button"
            className="summary-row summary-button"
            onClick={() =>
              goTo("/admin/candidates")
            }
          >
            <span>
              New Candidates
            </span>

            <strong>
              {loading
                ? "..."
                : stats.candidates}
            </strong>
          </button>

          {/* EMPLOYERS */}

          <button
            type="button"
            className="summary-row summary-button"
            onClick={() =>
              goTo("/admin/employers")
            }
          >
            <span>
              New Employers
            </span>

            <strong>
              {loading
                ? "..."
                : stats.employers}
            </strong>
          </button>

          {/* PENDING JOBS */}

          <button
            type="button"
            className="summary-row summary-button"
            onClick={() =>
              goTo("/admin/jobs")
            }
          >
            <span>
              Jobs Pending Approval
            </span>

            <strong>
              {loading
                ? "..."
                : stats.pendingJobs}
            </strong>
          </button>

          {/* PARTNERS */}

          <button
            type="button"
            className="summary-row summary-button"
            onClick={() =>
              goTo("/admin/partners")
            }
          >
            <span>
              Partner Registrations
            </span>

            <strong>
              {loading
                ? "..."
                : stats.partners}
            </strong>
          </button>

          {/* RESUMES */}

          <button
            type="button"
            className="summary-row summary-button"
            onClick={() =>
              goTo("/admin/resumes")
            }
          >
            <span>
              Resumes Uploaded
            </span>

            <strong>
              {loading
                ? "..."
                : stats.resumes}
            </strong>
          </button>

        </section>

      </div>

      {/* ======================================
          RECENT CHATBOT CONVERSATIONS
      ====================================== */}

      <section className="dashboard-card recent-card">

        <div className="card-heading">

          <div>

            <p>
              RECENT ACTIVITY
            </p>

            <h3>
              Recent Chatbot Conversations
            </h3>

          </div>

          <button
            type="button"
            className="dashboard-view-all"
            onClick={() =>
              goTo("/admin/chatbot-logs")
            }
          >
            View All →
          </button>

        </div>

        <div className="dashboard-table-wrapper">

          <table className="dashboard-table">

            <thead>

              <tr>

                <th>
                  Conversation
                </th>

                <th>
                  User
                </th>

                <th>
                  Topic
                </th>

                <th>
                  Status
                </th>

                <th>
                  Last Activity
                </th>

              </tr>

            </thead>

            <tbody>

              <tr
                className="conversation-row"
                onClick={() =>
                  goTo("/admin/chatbot-logs")
                }
              >

                <td>
                  <strong>
                    Chatbot Logs
                  </strong>
                </td>

                <td>
                  View conversations
                </td>

                <td>
                  Chatbot
                </td>

                <td>
                  <span className="status-badge live">
                    Live
                  </span>
                </td>

                <td>
                  View All
                </td>

              </tr>

            </tbody>

          </table>

        </div>

      </section>

    </div>
  );
}

export default Dashboard;