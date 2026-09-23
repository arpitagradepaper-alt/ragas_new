import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Resumes.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const API_URL = API_BASE_URL;

function Resumes() {
  const navigate = useNavigate();

  const [resumes, setResumes] = useState([]);
  const [search, setSearch] = useState("");
  const [industryFilter, setIndustryFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ==========================================
     FETCH RESUMES
  ========================================== */

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/api/resume`, {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("ragasAdminToken") || ""
            }`,
          },
        });

        if (!response.ok) {
          throw new Error("Unable to fetch resumes.");
        }

        const data = await response.json();

        setResumes(data.data || []);
      } catch (err) {
        console.error("Resume error:", err);
        setError("Unable to load resumes.");
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, []);

  /* ==========================================
     INDUSTRIES
  ========================================== */

  const industries = useMemo(() => {
    const values = resumes
      .map((resume) => resume.preferredIndustry)
      .filter(Boolean);

    return [...new Set(values)];
  }, [resumes]);

  /* ==========================================
     FILTER
  ========================================== */

  const filteredResumes = useMemo(() => {
    return resumes.filter((resume) => {
      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        resume.name
          ?.toLowerCase()
          .includes(searchValue) ||
        resume.email
          ?.toLowerCase()
          .includes(searchValue) ||
        resume.skills
          ?.toLowerCase()
          .includes(searchValue) ||
        resume.originalFileName
          ?.toLowerCase()
          .includes(searchValue) ||
        resume._id
          ?.toLowerCase()
          .includes(searchValue);

      const matchesIndustry =
        industryFilter === "All" ||
        resume.preferredIndustry === industryFilter;

      return matchesSearch && matchesIndustry;
    });
  }, [resumes, search, industryFilter]);

  /* ==========================================
     UPLOADED THIS MONTH
  ========================================== */

  const uploadedThisMonth = resumes.filter((resume) => {
    if (!resume.createdAt) return false;

    const created = new Date(resume.createdAt);
    const now = new Date();

    return (
      created.getMonth() === now.getMonth() &&
      created.getFullYear() === now.getFullYear()
    );
  }).length;

  /* ==========================================
     RECENTLY UPDATED
  ========================================== */

  const recentlyUpdated = resumes.filter((resume) => {
    if (!resume.updatedAt) return false;

    const updated = new Date(resume.updatedAt);
    const now = new Date();

    const difference =
      now.getTime() - updated.getTime();

    return (
      difference >= 0 &&
      difference <= 30 * 24 * 60 * 60 * 1000
    );
  }).length;

  /* ==========================================
     RESUME ID
  ========================================== */

  const getResumeId = (resume, index) => {
    if (resume._id) {
      return `RES-${resume._id
        .slice(-4)
        .toUpperCase()}`;
    }

    return `RES-${String(index + 1).padStart(4, "0")}`;
  };

  /* ==========================================
     INITIALS
  ========================================== */

  const getInitials = (name = "Candidate") => {
    return name
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  /* ==========================================
     DATE
  ========================================== */

  const formatDate = (date) => {
    if (!date) return "—";

    const updated = new Date(date);
    const now = new Date();

    const difference =
      now.getTime() - updated.getTime();

    const days = Math.floor(
      difference / (1000 * 60 * 60 * 24)
    );

    if (days <= 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 30) return `${days} days ago`;

    return updated.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /* ==========================================
     VIEW RESUME DETAILS
  ========================================== */

  const handleView = (resume) => {
    if (!resume?._id) {
      console.error("Resume ID missing:", resume);
      return;
    }

    navigate(`/admin/resumes/${resume._id}`);
  };

  /* ==========================================
     OPEN RESUME FILE
  ========================================== */

  const handleOpenResume = (resume) => {
    if (!resume?.resumeFile) {
      alert("Resume file is not available.");
      return;
    }

    const fileUrl =
      `${API_URL}/api/resume/file/${encodeURIComponent(
        resume.resumeFile
      )}`;

    window.open(
      fileUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="resumes-page">

      {/* ==========================================
          HEADING
      ========================================== */}

      <div className="resumes-heading">

        <div>
          <p>RESUME MANAGEMENT</p>

          <h2>Resume Database</h2>

          <span>
            Search, review and manage candidate resumes
            submitted through the RAGAS platform.
          </span>
        </div>

        <button
          type="button"
          className="resume-export-btn"
        >
          ↓ Export Database
        </button>

      </div>

      {/* ==========================================
          ERROR
      ========================================== */}

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

      {/* ==========================================
          STATS
      ========================================== */}

      <div className="resume-stats">

        <div className="resume-stat">
          <span>Total Resumes</span>

          <strong>
            {loading ? "..." : resumes.length}
          </strong>

          <small>
            All uploaded resumes
          </small>
        </div>

        <div className="resume-stat">
          <span>Uploaded This Month</span>

          <strong>
            {loading ? "..." : uploadedThisMonth}
          </strong>

          <small>
            Uploaded this month
          </small>
        </div>

        <div className="resume-stat">
          <span>Recently Updated</span>

          <strong>
            {loading ? "..." : recentlyUpdated}
          </strong>

          <small>
            Updated in last 30 days
          </small>
        </div>

        <div className="resume-stat">
          <span>Available</span>

          <strong>
            {loading ? "..." : resumes.length}
          </strong>

          <small>
            Resumes available for matching
          </small>
        </div>

      </div>

      {/* ==========================================
          MAIN CARD
      ========================================== */}

      <section className="resumes-card">

        {/* ========================================
            TOOLBAR
        ======================================== */}

        <div className="resume-toolbar">

          <div className="resume-search">

            <span>⌕</span>

            <input
              type="text"
              placeholder="Search candidate, skill, email or resume ID..."
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
            className="resume-filter-btn"
            type="button"
            onClick={() => {
              setSearch("");
              setIndustryFilter("All");
            }}
          >
            Reset
          </button>

        </div>

        {/* ========================================
            TABLE
        ======================================== */}

        <div className="resumes-table-wrapper">

          <table className="resumes-table">

            <thead>
              <tr>
                <th>Candidate</th>
                <th>Skills</th>
                <th>Experience</th>
                <th>Location</th>
                <th>Updated</th>
                <th>Status</th>
                <th>Actions</th>
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
                    Loading resumes...
                  </td>
                </tr>
              ) : filteredResumes.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    style={{
                      textAlign: "center",
                      padding: "40px",
                    }}
                  >
                    No resumes found.
                  </td>
                </tr>
              ) : (
                filteredResumes.map(
                  (resume, index) => {

                    const resumeId =
                      getResumeId(
                        resume,
                        index
                      );

                    return (
                      <tr
                        key={
                          resume._id ||
                          resumeId
                        }
                      >

                        {/* CANDIDATE */}

                        <td>

                          <div className="resume-candidate">

                            <div className="resume-avatar">
                              {getInitials(
                                resume.name
                              )}
                            </div>

                            <div>

                              <strong>
                                {resume.name ||
                                  "Candidate"}
                              </strong>

                              <small>
                                {resumeId}
                              </small>

                              <em>
                                {resume.email ||
                                  "—"}
                              </em>

                            </div>

                          </div>

                        </td>

                        {/* SKILLS */}

                        <td>
                          <div className="resume-skills">
                            {resume.skills || "—"}
                          </div>
                        </td>

                        {/* EXPERIENCE */}

                        <td>
                          {resume.experience !==
                            undefined &&
                          resume.experience !==
                            null &&
                          resume.experience !== ""
                            ? `${resume.experience} Years`
                            : "—"}
                        </td>

                        {/* LOCATION */}

                        <td>
                          {resume.currentLocation ||
                            "—"}
                        </td>

                        {/* UPDATED */}

                        <td>
                          {formatDate(
                            resume.updatedAt ||
                              resume.createdAt
                          )}
                        </td>

                        {/* STATUS */}

                        <td>
                          <span className="resume-status active">
                            Active
                          </span>
                        </td>

                        {/* ACTIONS */}

                        <td>

                          <div className="resume-actions">

                            {/* VIEW DETAILS */}

                            <button
                              type="button"
                              onClick={() =>
                                handleView(resume)
                              }
                            >
                              View 
                            </button>

                            {/* OPEN FILE */}

                            <button
                              type="button"
                              title={
                                resume.originalFileName ||
                                "Open Resume"
                              }
                              onClick={() =>
                                handleOpenResume(
                                  resume
                                )
                              }
                            >
                              ↗
                            </button>

                          </div>

                        </td>

                      </tr>
                    );
                  }
                )
              )}

            </tbody>

          </table>

        </div>

        {/* ========================================
            PAGINATION
        ======================================== */}

        <div className="resume-pagination">

          <span>
            Showing {filteredResumes.length} of{" "}
            {resumes.length} resumes
          </span>

          <div>

            <button
              type="button"
              disabled
            >
              ‹
            </button>

            <button
              type="button"
              className="resume-page-active"
            >
              1
            </button>

            <button
              type="button"
              disabled
            >
              ›
            </button>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Resumes;