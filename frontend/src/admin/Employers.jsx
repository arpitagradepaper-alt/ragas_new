import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Employers.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const API_URL = API_BASE_URL;

function Employers() {
  const navigate = useNavigate();

  const [employers, setEmployers] = useState([]);
  const [jobs, setJobs] = useState([]);

  const [search, setSearch] = useState("");
  const [industryFilter, setIndustryFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================
  // FETCH EMPLOYERS + JOBS
  // =========================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("ragasAdminToken");

        const authHeaders = {
          Authorization: `Bearer ${token || ""}`,
        };

        const [employersResponse, jobsResponse] =
          await Promise.all([
            fetch(`${API_URL}/api/employers`, {
              headers: authHeaders,
            }),

            // ADMIN MUST COUNT EVERY JOB,
            // NOT ONLY THE APPROVED ONES
            fetch(`${API_URL}/api/jobs/admin/all`, {
              headers: authHeaders,
            }),
          ]);

        if (!employersResponse.ok || !jobsResponse.ok) {
          throw new Error("Unable to load employer data.");
        }

        const employersData = await employersResponse.json();
        const jobsData = await jobsResponse.json();

        setEmployers(employersData.data || []);
        setJobs(jobsData.data || []);
      } catch (err) {
        console.error("Employers error:", err);
        setError("Unable to load employers.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // =========================================
  // INDUSTRIES
  // =========================================

  const industries = useMemo(() => {
    const values = employers
      .map((employer) => employer.industry)
      .filter(Boolean);

    return [...new Set(values)];
  }, [employers]);

  // =========================================
  // JOB COUNT FOR COMPANY
  // =========================================

  const getCompanyJobs = (companyName) => {
    return jobs.filter(
      (job) =>
        job.companyName?.toLowerCase().trim() ===
        companyName?.toLowerCase().trim()
    ).length;
  };

  // =========================================
  // FILTER
  // =========================================

  const filteredEmployers = useMemo(() => {
    return employers.filter((employer) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        employer.companyName
          ?.toLowerCase()
          .includes(searchValue) ||
        employer.contactPerson
          ?.toLowerCase()
          .includes(searchValue) ||
        employer.email
          ?.toLowerCase()
          .includes(searchValue);

      const matchesIndustry =
        industryFilter === "All" ||
        employer.industry === industryFilter;

      return matchesSearch && matchesIndustry;
    });
  }, [employers, search, industryFilter]);

  // =========================================
  // EMPLOYER ID
  // =========================================

  const getEmployerId = (employer, index) => {
    if (employer._id) {
      return `EMP-${employer._id
        .slice(-4)
        .toUpperCase()}`;
    }

    return `EMP-${String(index + 1).padStart(4, "0")}`;
  };

  // =========================================
  // AVATAR
  // =========================================

  const getInitials = (name = "Company") => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  // =========================================
  // VIEW EMPLOYER
  // =========================================

  const handleViewEmployer = (employer) => {
    if (!employer?._id) {
      return;
    }

    navigate(`/admin/employers/${employer._id}`);
  };

  // =========================================
  // RENDER
  // =========================================

  return (
    <div className="employers-page">

      {/* HEADING */}

      <div className="employers-heading">
        <div>
          <p>EMPLOYER MANAGEMENT</p>

          <h2>Employers</h2>

          <span>
            Verify companies, manage employer profiles and
            monitor their recruitment activity.
          </span>
        </div>

        <button
          className="add-employer-btn"
          type="button"
        >
          + Add Employer
        </button>
      </div>

      {/* ERROR */}

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

      {/* STATS */}

      <div className="employer-stats">

        <div className="employer-stat">
          <span>Total Employers</span>

          <strong>
            {loading ? "..." : employers.length}
          </strong>

          <small>
            Registered companies
          </small>
        </div>

        <div className="employer-stat">
          <span>New This Month</span>

          <strong>
            {loading
              ? "..."
              : employers.filter((employer) => {
                  if (!employer.createdAt) {
                    return false;
                  }

                  const created = new Date(
                    employer.createdAt
                  );

                  const now = new Date();

                  return (
                    created.getMonth() === now.getMonth() &&
                    created.getFullYear() ===
                      now.getFullYear()
                  );
                }).length}
          </strong>

          <small>
            Registered this month
          </small>
        </div>

        <div className="employer-stat">
          <span>Pending Verification</span>

          <strong>0</strong>

          <small>
            Verification tracking coming soon
          </small>
        </div>

        <div className="employer-stat">
          <span>Active Job Posts</span>

          <strong>
            {loading ? "..." : jobs.length}
          </strong>

          <small>
            Jobs across all employers
          </small>
        </div>

      </div>

      {/* TABLE CARD */}

      <section className="employers-card">

        {/* TOOLBAR */}

        <div className="employer-toolbar">

          <div className="employer-search">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search company, contact or email..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

          <select
            value={industryFilter}
            onChange={(e) =>
              setIndustryFilter(e.target.value)
            }
          >
            <option value="All">
              All Industries
            </option>

            {industries.map((industry) => (
              <option
                key={industry}
                value={industry}
              >
                {industry}
              </option>
            ))}
          </select>

          <button
            className="employer-filter-btn"
            type="button"
            onClick={() => {
              setSearch("");
              setIndustryFilter("All");
            }}
          >
            Reset
          </button>

        </div>

        {/* TABLE */}

        <div className="employers-table-wrapper">

          <table className="employers-table">

            <thead>
              <tr>
                <th>Company</th>
                <th>Industry</th>
                <th>Contact Person</th>
                <th>Email</th>
                <th>Jobs</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    style={{
                      textAlign: "center",
                      padding: "40px",
                    }}
                  >
                    Loading employers...
                  </td>
                </tr>
              ) : filteredEmployers.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    style={{
                      textAlign: "center",
                      padding: "40px",
                    }}
                  >
                    No employers found.
                  </td>
                </tr>
              ) : (
                filteredEmployers.map(
                  (employer, index) => {

                    const employerId =
                      getEmployerId(
                        employer,
                        index
                      );

                    const companyJobs =
                      getCompanyJobs(
                        employer.companyName
                      );

                    return (
                      <tr
                        key={
                          employer._id ||
                          employerId
                        }
                      >

                        {/* COMPANY */}

                        <td>
                          <div className="employer-company">

                            <div className="company-avatar">
                              {getInitials(
                                employer.companyName
                              )}
                            </div>

                            <div>
                              <strong>
                                {employer.companyName ||
                                  "—"}
                              </strong>

                              <small>
                                {employerId}
                              </small>
                            </div>

                          </div>
                        </td>

                        {/* INDUSTRY */}

                        <td>
                          {employer.industry || "—"}
                        </td>

                        {/* CONTACT */}

                        <td>
                          {employer.contactPerson || "—"}
                        </td>

                        {/* EMAIL */}

                        <td>
                          <span className="employer-email">
                            {employer.email || "—"}
                          </span>
                        </td>

                        {/* JOBS */}

                        <td>
                          <strong className="job-count">
                            {companyJobs}
                          </strong>
                        </td>

                        {/* STATUS */}

                        <td>
                          <span className="employer-status verified">
                            Registered
                          </span>
                        </td>

                        {/* ACTION */}

                        <td>
                          <button
                            className="employer-view-btn"
                            type="button"
                            onClick={() =>
                              handleViewEmployer(
                                employer
                              )
                            }
                          >
                            View
                          </button>
                        </td>

                      </tr>
                    );
                  }
                )
              )}

            </tbody>

          </table>

        </div>

        {/* PAGINATION */}

        <div className="employer-pagination">

          <span>
            Showing {filteredEmployers.length} of{" "}
            {employers.length} employers
          </span>

          <div>
            <button disabled>
              ‹
            </button>

            <button className="employer-page-active">
              1
            </button>

            <button disabled>
              ›
            </button>
          </div>

        </div>

      </section>

    </div>
  );
}

export default Employers;