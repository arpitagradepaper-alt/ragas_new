import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import "./Applications.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const API_URL = `${API_BASE_URL}/api/applications`;

function Applications() {
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("ragasAdminToken");

      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token || ""}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to fetch applications."
        );
      }

      setApplications(data.data || []);
    } catch (err) {
      console.error("Applications fetch error:", err);
      setError(err.message || "Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const filteredApplications = useMemo(() => {
    return applications.filter((application) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        application.fullName?.toLowerCase().includes(searchText) ||
        application.email?.toLowerCase().includes(searchText) ||
        application.phone?.toLowerCase().includes(searchText) ||
        application.jobTitle?.toLowerCase().includes(searchText) ||
        application.jobId?.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "All Status" ||
        application.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applications, search, statusFilter]);

  const totalApplications = applications.length;

  const newApplications = applications.filter(
    (application) => application.status === "Applied"
  ).length;

  const shortlistedApplications = applications.filter(
    (application) => application.status === "Shortlisted"
  ).length;

  const hiredApplications = applications.filter(
    (application) => application.status === "Selected"
  ).length;

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="applications-page">

      {/* HEADER */}
      <div className="applications-header">
        <div>
          <p className="applications-eyebrow">
            CANDIDATE MANAGEMENT
          </p>

          <h1>Applications</h1>

          <p>
            Manage and review all job applications submitted by
            candidates.
          </p>
        </div>

        <button
          className="applications-refresh"
          onClick={fetchApplications}
        >
          ↻ Refresh
        </button>
      </div>

      {/* STATS */}
      <div className="applications-stats">

        <div className="application-stat-card">
          <span>Total Applications</span>
          <strong>{totalApplications}</strong>
        </div>

        <div className="application-stat-card">
          <span>New / Applied</span>
          <strong>{newApplications}</strong>
        </div>

        <div className="application-stat-card">
          <span>Shortlisted</span>
          <strong>{shortlistedApplications}</strong>
        </div>

        <div className="application-stat-card">
          <span>Selected</span>
          <strong>{hiredApplications}</strong>
        </div>

      </div>

      {/* FILTERS */}
      <div className="applications-toolbar">

        <div className="application-search">
          <span>⌕</span>

          <input
            type="text"
            placeholder="Search candidate, email or job..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>All Status</option>
          <option>New</option>
          <option>Under Review</option>
          <option>Shortlisted</option>
          <option>Rejected</option>
          <option>Hired</option>
        </select>

      </div>

      {/* ERROR */}
      {error && (
        <div className="applications-error">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* LOADING */}
      {loading ? (
        <div className="applications-empty">
          <div className="applications-loader"></div>
          <p>Loading applications...</p>
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="applications-empty">
          <div className="applications-empty-icon">◎</div>

          <h3>No applications found</h3>

          <p>
            {applications.length === 0
              ? "No candidate applications have been submitted yet."
              : "No applications match your search or filter."}
          </p>
        </div>
      ) : (
        <div className="applications-table-wrapper">

          <table className="applications-table">

            <thead>
              <tr>
                <th>Candidate</th>
                <th>Job Position</th>
                <th>Location</th>
                <th>Experience</th>
                <th>Applied On</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredApplications.map((application) => (

                <tr key={application._id}>

                  {/* CANDIDATE */}
                  <td>
                    <div className="application-candidate">

                      <div className="application-avatar">
                        {application.fullName
                          ? application.fullName
                              .charAt(0)
                              .toUpperCase()
                          : "C"}
                      </div>

                      <div>
                        <strong>
                          {application.fullName || "Unknown Candidate"}
                        </strong>

                        <span>
                          {application.email || "No email"}
                        </span>
                      </div>

                    </div>
                  </td>

                  {/* JOB */}
                  <td>
                    <div className="application-job">
                      <strong>
                        {application.jobTitle || "Job Position"}
                      </strong>

                      <span>
                        {application.jobId || "—"}
                      </span>
                    </div>
                  </td>

                  {/* LOCATION */}
                  <td>
                    {application.currentLocation || "—"}
                  </td>

                  {/* EXPERIENCE */}
                  <td>
                    {application.totalExperience || "—"}
                  </td>

                  {/* DATE */}
                  <td>
                    {formatDate(application.createdAt)}
                  </td>

                  {/* STATUS */}
                  <td>
                    <span
                      className={`application-status status-${(
                        application.status || "New"
                      )
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {application.status || "New"}
                    </span>
                  </td>

                  {/* ACTION */}
                  <td>
                    <NavLink
                      to={`/admin/applications/${application._id}`}
                      className="application-view-btn"
                    >
                      View
                    </NavLink>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}

export default Applications;