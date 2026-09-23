import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Candidates.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const API_URL = API_BASE_URL;
const ITEMS_PER_PAGE = 10;

function Candidates() {
  const navigate = useNavigate();

  const [candidates, setCandidates] = useState([]);
  const [applications, setApplications] = useState([]);

  const [search, setSearch] = useState("");
  const [qualificationFilter, setQualificationFilter] =
    useState("All");

  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================
  // FETCH CANDIDATES
  // =========================================

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("ragasAdminToken");

      const authHeaders = {
        Authorization: `Bearer ${token || ""}`,
      };

      const response = await fetch(`${API_URL}/api/candidates`, {
        headers: authHeaders,
      });

      if (!response.ok) {
        throw new Error("Unable to fetch candidates.");
      }

      const data = await response.json();

      setCandidates(data.data || []);
      setCurrentPage(1);
    } catch (err) {
      console.error("Candidates error:", err);
      setError("Unable to load candidates.");
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // FETCH APPLICATIONS
  // =========================================

  const fetchApplications = async () => {
    try {
      const response = await fetch(`${API_URL}/api/applications`, {
        headers: {
          Authorization: `Bearer ${
            localStorage.getItem("ragasAdminToken") || ""
          }`,
        },
      });

      if (!response.ok) {
        throw new Error(
          "Unable to fetch applications."
        );
      }

      const data = await response.json();

      setApplications(data.data || []);
    } catch (err) {
      console.error(
        "Applications error:",
        err
      );
    }
  };

  // =========================================
  // INITIAL FETCH
  // =========================================

  useEffect(() => {
    fetchCandidates();
    fetchApplications();
  }, []);

  // =========================================
  // QUALIFICATIONS
  // =========================================

  const qualifications = useMemo(() => {
    const values = candidates
      .map(
        (candidate) =>
          candidate.qualification
      )
      .filter(Boolean);

    return [...new Set(values)];
  }, [candidates]);

  // =========================================
  // FILTER CANDIDATES
  // =========================================

  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      const searchValue = search
        .toLowerCase()
        .trim();

      const matchesSearch =
        searchValue === "" ||
        candidate.name
          ?.toLowerCase()
          .includes(searchValue) ||
        candidate.email
          ?.toLowerCase()
          .includes(searchValue) ||
        candidate.phone
          ?.toLowerCase()
          .includes(searchValue) ||
        candidate.location
          ?.toLowerCase()
          .includes(searchValue) ||
        candidate.qualification
          ?.toLowerCase()
          .includes(searchValue) ||
        candidate.experience
          ?.toLowerCase()
          .includes(searchValue);

      const matchesQualification =
        qualificationFilter === "All" ||
        candidate.qualification ===
          qualificationFilter;

      return (
        matchesSearch &&
        matchesQualification
      );
    });
  }, [
    candidates,
    search,
    qualificationFilter,
  ]);

  // =========================================
  // PAGINATION
  // =========================================

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredCandidates.length /
        ITEMS_PER_PAGE
    )
  );

  const paginatedCandidates = useMemo(() => {
    const start =
      (currentPage - 1) *
      ITEMS_PER_PAGE;

    const end =
      start + ITEMS_PER_PAGE;

    return filteredCandidates.slice(
      start,
      end
    );
  }, [
    filteredCandidates,
    currentPage,
  ]);

  // =========================================
  // KEEP PAGE VALID
  // =========================================

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [
    currentPage,
    totalPages,
  ]);

  // =========================================
  // CANDIDATE ID
  // =========================================

  const getCandidateId = (
    candidate,
    index
  ) => {
    if (candidate._id) {
      return `CAN-${candidate._id
        .slice(-5)
        .toUpperCase()}`;
    }

    return `CAN-${String(
      index + 1
    ).padStart(5, "0")}`;
  };

  // =========================================
  // INITIALS
  // =========================================

  const getInitials = (
    name = "Candidate"
  ) => {
    return name
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  // =========================================
  // NEW THIS MONTH
  // =========================================

  const newThisMonth =
    candidates.filter((candidate) => {
      if (!candidate.createdAt) {
        return false;
      }

      const created = new Date(
        candidate.createdAt
      );

      const now = new Date();

      return (
        created.getMonth() ===
          now.getMonth() &&
        created.getFullYear() ===
          now.getFullYear()
      );
    }).length;

  // =========================================
  // SHORTLISTED CANDIDATES
  // =========================================
  // Unique candidates only
  // Same candidate shortlisted for
  // multiple jobs = count once
  // =========================================

  const shortlistedCount = useMemo(() => {
    const uniqueCandidates = new Set();

    applications.forEach((application) => {
      if (
        application.status ===
        "Shortlisted"
      ) {
        const email = String(
          application.email || ""
        )
          .trim()
          .toLowerCase();

        if (email) {
          uniqueCandidates.add(email);
        }
      }
    });

    return uniqueCandidates.size;
  }, [applications]);

  // =========================================
  // PLACED CANDIDATES
  // =========================================
  // "Selected" application status
  // is counted as Placed
  // =========================================

  const placedCount = useMemo(() => {
    const uniqueCandidates = new Set();

    applications.forEach((application) => {
      if (
        application.status ===
        "Selected"
      ) {
        const email = String(
          application.email || ""
        )
          .trim()
          .toLowerCase();

        if (email) {
          uniqueCandidates.add(email);
        }
      }
    });

    return uniqueCandidates.size;
  }, [applications]);

  // =========================================
  // VIEW CANDIDATE
  // =========================================

  const handleViewCandidate = (
    candidate
  ) => {
    if (!candidate?._id) {
      alert(
        "Candidate ID is not available."
      );
      return;
    }

    navigate(
      `/admin/candidates/${candidate._id}`
    );
  };

  // =========================================
  // RESET FILTERS
  // =========================================

  const handleReset = () => {
    setSearch("");
    setQualificationFilter("All");
    setCurrentPage(1);
  };

  // =========================================
  // SEARCH CHANGE
  // =========================================

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  // =========================================
  // QUALIFICATION CHANGE
  // =========================================

  const handleQualificationChange = (
    e
  ) => {
    setQualificationFilter(
      e.target.value
    );

    setCurrentPage(1);
  };

  // =========================================
  // PAGINATION
  // =========================================

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(
        (page) => page - 1
      );
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(
        (page) => page + 1
      );
    }
  };

  const handlePageChange = (page) => {
    if (
      page >= 1 &&
      page <= totalPages
    ) {
      setCurrentPage(page);
    }
  };

  // =========================================
  // PAGE NUMBERS
  // =========================================

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  // =========================================
  // SHOWING RANGE
  // =========================================

  const showingStart =
    filteredCandidates.length === 0
      ? 0
      : (currentPage - 1) *
          ITEMS_PER_PAGE +
        1;

  const showingEnd = Math.min(
    currentPage * ITEMS_PER_PAGE,
    filteredCandidates.length
  );

  // =========================================
  // PAGE
  // =========================================

  return (
    <div className="candidates-page">

      {/* =====================================
          PAGE HEADING
      ===================================== */}

      <div className="candidates-heading">

        <div>
          <p>
            CANDIDATE MANAGEMENT
          </p>

          <h2>
            Candidates
          </h2>

          <span>
            Manage candidate profiles,
            applications, resumes and
            recruitment status.
          </span>
        </div>

      </div>

      {/* =====================================
          ERROR
      ===================================== */}

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

      {/* =====================================
          STATS
      ===================================== */}

      <div className="candidate-stats">

        {/* TOTAL CANDIDATES */}

        <div className="candidate-stat">
          <span>
            Total Candidates
          </span>

          <strong>
            {loading
              ? "..."
              : candidates.length}
          </strong>

          <small>
            All registered profiles
          </small>
        </div>

        {/* NEW THIS MONTH */}

        <div className="candidate-stat">
          <span>
            New This Month
          </span>

          <strong>
            {loading
              ? "..."
              : newThisMonth}
          </strong>

          <small>
            Registered this month
          </small>
        </div>

        {/* SHORTLISTED */}

        <div className="candidate-stat">
          <span>
            Shortlisted
          </span>

          <strong>
            {loading
              ? "..."
              : shortlistedCount}
          </strong>

          <small>
            Candidates shortlisted
          </small>
        </div>

        {/* PLACED */}

        <div className="candidate-stat">
          <span>
            Placed
          </span>

          <strong>
            {loading
              ? "..."
              : placedCount}
          </strong>

          <small>
            Candidates selected
          </small>
        </div>

      </div>

      {/* =====================================
          MAIN CARD
      ===================================== */}

      <section className="candidates-card">

        {/* ===================================
            TOOLBAR
        =================================== */}

        <div className="candidate-toolbar">

          {/* SEARCH */}

          <div className="candidate-search">

            <span>
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search candidate, email or phone..."
              value={search}
              onChange={
                handleSearchChange
              }
            />

          </div>

          {/* QUALIFICATION */}

          <select
            value={
              qualificationFilter
            }
            onChange={
              handleQualificationChange
            }
          >

            <option value="All">
              All Qualifications
            </option>

            {qualifications.map(
              (qualification) => (
                <option
                  key={qualification}
                  value={qualification}
                >
                  {qualification}
                </option>
              )
            )}

          </select>

          {/* RESET */}

          <button
            className="candidate-filter-btn"
            type="button"
            onClick={
              handleReset
            }
          >
            Reset
          </button>

        </div>

        {/* ===================================
            TABLE
        =================================== */}

        <div className="candidates-table-wrapper">

          <table className="candidates-table">

            <thead>

              <tr>

                <th>
                  Candidate
                </th>

                <th>
                  Contact
                </th>

                <th>
                  Qualification
                </th>

                <th>
                  Experience
                </th>

                <th>
                  Location
                </th>

                <th>
                  Status
                </th>

                <th>
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {/* LOADING */}

              {loading ? (

                <tr>

                  <td
                    colSpan="7"
                    style={{
                      textAlign:
                        "center",
                      padding: "40px",
                    }}
                  >
                    Loading candidates...
                  </td>

                </tr>

              ) : filteredCandidates.length ===
                0 ? (

                /* EMPTY */

                <tr>

                  <td
                    colSpan="7"
                    style={{
                      textAlign:
                        "center",
                      padding: "40px",
                    }}
                  >
                    No candidates found.
                  </td>

                </tr>

              ) : (

                /* CANDIDATES */

                paginatedCandidates.map(
                  (
                    candidate,
                    index
                  ) => {

                    const absoluteIndex =
                      (currentPage - 1) *
                        ITEMS_PER_PAGE +
                      index;

                    const candidateId =
                      getCandidateId(
                        candidate,
                        absoluteIndex
                      );

                    return (
                      <tr
                        key={
                          candidate._id ||
                          candidateId
                        }
                      >

                        {/* CANDIDATE */}

                        <td>

                          <div className="candidate-name">

                            <div className="candidate-avatar">
                              {getInitials(
                                candidate.name
                              )}
                            </div>

                            <div>

                              <strong>
                                {candidate.name ||
                                  "Candidate"}
                              </strong>

                              <small>
                                {candidateId}
                              </small>

                            </div>

                          </div>

                        </td>

                        {/* CONTACT */}

                        <td>

                          <div className="candidate-contact">

                            <span>
                              {candidate.email ||
                                "—"}
                            </span>

                            <small>
                              {candidate.phone ||
                                "—"}
                            </small>

                          </div>

                        </td>

                        {/* QUALIFICATION */}

                        <td>
                          {candidate.qualification ||
                            "—"}
                        </td>

                        {/* EXPERIENCE */}

                        <td>
                          {candidate.experience ||
                            "—"}
                        </td>

                        {/* LOCATION */}

                        <td>
                          {candidate.location ||
                            "—"}
                        </td>

                        {/* STATUS */}

                        <td>

                          <span className="candidate-status active">
                            {candidate.status ||
                              "Active"}
                          </span>

                        </td>

                        {/* VIEW */}

                        <td>

                          <button
                            className="candidate-view-btn"
                            type="button"
                            onClick={() =>
                              handleViewCandidate(
                                candidate
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

        {/* =====================================
            PAGINATION
        ===================================== */}

        <div className="candidate-pagination">

          <span>
            Showing{" "}
            {showingStart}
            {"–"}
            {showingEnd}
            {" "}
            of{" "}
            {filteredCandidates.length}
            {" "}
            candidates
          </span>

          <div>

            {/* PREVIOUS */}

            <button
              type="button"
              onClick={
                handlePreviousPage
              }
              disabled={
                currentPage === 1
              }
              aria-label="Previous page"
            >
              ‹
            </button>

            {/* PAGE NUMBERS */}

            {pageNumbers.map(
              (page) => (

                <button
                  key={page}
                  type="button"
                  className={
                    currentPage === page
                      ? "candidate-page-active"
                      : ""
                  }
                  onClick={() =>
                    handlePageChange(
                      page
                    )
                  }
                >
                  {page}
                </button>

              )
            )}

            {/* NEXT */}

            <button
              type="button"
              onClick={
                handleNextPage
              }
              disabled={
                currentPage ===
                totalPages
              }
              aria-label="Next page"
            >
              ›
            </button>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Candidates;