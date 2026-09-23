import { useEffect, useState } from "react";
import {
  Search,
  MapPin,
  Briefcase,
} from "lucide-react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import "./CurrentOpenings.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

const API_URL = API_BASE_URL;

function CurrentOpenings() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  // =====================================================
  // JOB STATES
  // =====================================================

  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // =====================================================
  // APPLIED JOB IDS
  // =====================================================

  const [appliedJobIds, setAppliedJobIds] = useState([]);

  // =====================================================
  // FILTER STATES
  // =====================================================

  const [keyword, setKeyword] = useState(
    searchParams.get("keyword") || ""
  );

  const [location, setLocation] = useState(
    searchParams.get("location") || ""
  );

  const [industry, setIndustry] = useState(
    searchParams.get("industry") || ""
  );

  const [experience, setExperience] = useState(
    searchParams.get("experience") || ""
  );

  const [salary, setSalary] = useState(
    searchParams.get("salary") || ""
  );

  // =====================================================
  // GET CURRENT LOGGED-IN CANDIDATE
  // =====================================================

  const getCurrentCandidate = () => {
    let user = null;

    // -----------------------------------------------
    // LOCAL STORAGE
    // -----------------------------------------------

    const localUser = localStorage.getItem("ragasUser");

    if (localUser) {
      try {
        user = JSON.parse(localUser);
      } catch (error) {
        console.error(
          "Unable to parse local user:",
          error
        );
      }
    }

    // -----------------------------------------------
    // SESSION STORAGE
    // -----------------------------------------------

    if (!user) {
      const sessionUser =
        sessionStorage.getItem("ragasUser");

      if (sessionUser) {
        try {
          user = JSON.parse(sessionUser);
        } catch (error) {
          console.error(
            "Unable to parse session user:",
            error
          );
        }
      }
    }

    return user;
  };

  // =====================================================
  // GET CANDIDATE EMAIL
  // =====================================================

  const getCandidateEmail = () => {
    const user = getCurrentCandidate();

    if (!user) {
      return "";
    }

    return (
      user.email ||
      user.Email ||
      ""
    )
      .toString()
      .trim()
      .toLowerCase();
  };

  // =====================================================
  // FETCH JOBS
  // =====================================================

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (keyword.trim()) {
        params.set(
          "search",
          keyword.trim()
        );
      }

      if (location.trim()) {
        params.set(
          "location",
          location.trim()
        );
      }

      if (industry.trim()) {
        params.set(
          "category",
          industry.trim()
        );
      }

      const url =
        `${API_URL}/api/jobs${
          params.toString()
            ? `?${params.toString()}`
            : ""
        }`;

      console.log(
        "Fetching jobs:",
        url
      );

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Server returned ${response.status}`
        );
      }

      const result = await response.json();

      console.log(
        "Jobs response:",
        result
      );

      if (result.success) {
        setJobs(result.data || []);
      } else {
        setJobs([]);

        setError(
          result.message ||
            "Unable to load jobs."
        );
      }
    } catch (err) {
      console.error(
        "Jobs fetch error:",
        err
      );

      setJobs([]);

      setError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FETCH APPLIED JOBS FOR CURRENT CANDIDATE
  // =====================================================

  const fetchAppliedJobs = async () => {
    try {
      const userEmail = getCandidateEmail();

      console.log(
        "Current candidate email:",
        userEmail
      );

      // -----------------------------------------------
      // NO CANDIDATE LOGGED IN
      // -----------------------------------------------

      if (!userEmail) {
        console.log(
          "No candidate logged in."
        );

        setAppliedJobIds([]);

        return;
      }

      // -----------------------------------------------
      // FETCH APPLICATIONS
      // -----------------------------------------------

      const url =
        `${API_BASE_URL}/api/applications/candidate?email=${encodeURIComponent(
          userEmail
        )}`;

      console.log(
        "Fetching candidate applications:",
        url
      );

      const response = await fetch(url);

      // -----------------------------------------------
      // CHECK RESPONSE
      // -----------------------------------------------

      if (!response.ok) {
        console.error(
          "Candidate applications request failed:",
          response.status
        );

        setAppliedJobIds([]);

        return;
      }

      const result = await response.json();

      console.log(
        "Candidate applications response:",
        result
      );

      if (
        !result ||
        !result.success
      ) {
        console.error(
          "Candidate applications API returned unsuccessful response:",
          result
        );

        setAppliedJobIds([]);

        return;
      }

      // -----------------------------------------------
      // EXTRACT JOB IDS
      // -----------------------------------------------

      const ids = (result.data || [])
        .map((application) => {
          return application?.jobId;
        })
        .filter(Boolean)
        .map((id) => {
          return String(id).trim();
        });

      console.log(
        "Applied job IDs:",
        ids
      );

      setAppliedJobIds(ids);
    } catch (err) {
      console.error(
        "Fetch applied jobs error:",
        err
      );

      setAppliedJobIds([]);
    }
  };

  // =====================================================
  // URL SEARCH PARAMS STRING
  // =====================================================

  const searchParamsString =
    searchParams.toString();

  // =====================================================
  // LOAD JOBS
  // Runs when URL filters change
  // =====================================================

  useEffect(() => {
    fetchJobs();
  }, [searchParamsString]);

  // =====================================================
  // LOAD CANDIDATE APPLICATIONS
  // Runs only when page/component mounts
  // =====================================================

  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  // =====================================================
  // APPLY FILTERS
  // =====================================================

  const handleApplyFilters = () => {
    const params =
      new URLSearchParams();

    if (keyword.trim()) {
      params.set(
        "keyword",
        keyword.trim()
      );
    }

    if (location.trim()) {
      params.set(
        "location",
        location.trim()
      );
    }

    if (industry.trim()) {
      params.set(
        "industry",
        industry.trim()
      );
    }

    if (experience.trim()) {
      params.set(
        "experience",
        experience.trim()
      );
    }

    if (salary.trim()) {
      params.set(
        "salary",
        salary.trim()
      );
    }

    navigate(
      `/current-openings${
        params.toString()
          ? `?${params.toString()}`
          : ""
      }`
    );
  };

  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  const handleClearFilters = () => {
    setKeyword("");
    setLocation("");
    setIndustry("");
    setExperience("");
    setSalary("");

    navigate(
      "/current-openings"
    );
  };

  // =====================================================
  // APPLY FOR JOB
  // =====================================================

  const handleApply = (jobId) => {
    if (!jobId) {
      alert(
        "Job ID is not available."
      );

      return;
    }

    // -----------------------------------------------
    // CHECK LOGIN
    // -----------------------------------------------

    const userEmail =
      getCandidateEmail();

    if (!userEmail) {
      alert(
        "Please login as a candidate before applying."
      );

      navigate(
        "/user-login"
      );

      return;
    }

    // -----------------------------------------------
    // ALREADY APPLIED
    // -----------------------------------------------

    const normalizedJobId =
      String(jobId).trim();

    if (
      appliedJobIds.includes(
        normalizedJobId
      )
    ) {
      return;
    }

    // -----------------------------------------------
    // OPEN APPLICATION PAGE
    // -----------------------------------------------

    navigate(
      `/apply/${normalizedJobId}`
    );
  };

  // =====================================================
  // JOB HELPERS
  // =====================================================

  const getJobSalary = (job) => {
    return (
      job.salary ||
      "Salary not disclosed"
    );
  };

  const getJobLocation = (job) => {
    if (
      job.location &&
      job.country
    ) {
      return `${job.location}, ${job.country}`;
    }

    return (
      job.location ||
      job.country ||
      "Location not specified"
    );
  };

  const getJobType = (job) => {
    return (
      job.jobType ||
      job.type ||
      "Full-time"
    );
  };

  const getJobCategory = (job) => {
    return (
      job.category ||
      "General"
    );
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <main className="openings-page">

      <section className="openings-main">

        {/* =================================================
            FILTER SIDEBAR
        ================================================== */}

        <aside className="openings-filters">

          <p className="filter-eyebrow">
            FILTER RESULTS
          </p>

          <h2>
            Advanced Search
          </h2>

          {/* KEYWORD */}

          <label>
            Keyword
          </label>

          <input
            type="text"
            placeholder="Select keyword"
            value={keyword}
            onChange={(e) =>
              setKeyword(
                e.target.value
              )
            }
          />

          {/* LOCATION */}

          <label>
            Location / Country
          </label>

          <input
            type="text"
            placeholder="Select location / country"
            value={location}
            onChange={(e) =>
              setLocation(
                e.target.value
              )
            }
          />

          {/* INDUSTRY */}

          <label>
            Industry
          </label>

          <input
            type="text"
            placeholder="Select industry"
            value={industry}
            onChange={(e) =>
              setIndustry(
                e.target.value
              )
            }
          />

          {/* EXPERIENCE */}

          <label>
            Experience Level
          </label>

          <input
            type="text"
            placeholder="Select experience level"
            value={experience}
            onChange={(e) =>
              setExperience(
                e.target.value
              )
            }
          />

          {/* SALARY */}

          <label>
            Salary Range
          </label>

          <input
            type="text"
            placeholder="Select salary range"
            value={salary}
            onChange={(e) =>
              setSalary(
                e.target.value
              )
            }
          />

          {/* APPLY FILTERS */}

          <button
            type="button"
            className="apply-filters"
            onClick={
              handleApplyFilters
            }
          >
            <Search size={14} />

            Apply Filters
          </button>

          {/* CLEAR */}

          {(keyword ||
            location ||
            industry ||
            experience ||
            salary) && (
            <button
              type="button"
              className="clear-filters"
              onClick={
                handleClearFilters
              }
            >
              Clear Filters
            </button>
          )}

        </aside>

        {/* =================================================
            JOB RESULTS
        ================================================== */}

        <section className="openings-results">

          {/* HEADER */}

          <div className="results-heading">

            <h1>
              Current Openings —{" "}
              {loading
                ? "..."
                : jobs.length}{" "}
              {jobs.length === 1
                ? "role"
                : "roles"}
            </h1>

            <span className="sort-text">
              Sort: Newest first ↓
            </span>

          </div>

          {/* ERROR */}

          {error && (
            <div className="jobs-message error">
              {error}
            </div>
          )}

          {/* LOADING */}

          {loading &&
            !error && (
              <div className="jobs-message">
                Loading available jobs...
              </div>
            )}

          {/* NO JOBS */}

          {!loading &&
            !error &&
            jobs.length === 0 && (
              <div className="jobs-message no-results">

                <Briefcase
                  size={30}
                />

                <h3>
                  No jobs found
                </h3>

                <p>
                  No current openings
                  match your search
                  criteria.
                </p>

                <button
                  type="button"
                  onClick={
                    handleClearFilters
                  }
                >
                  Clear Search
                </button>

              </div>
            )}

          {/* JOB LIST */}

          {!loading &&
            !error &&
            jobs.length > 0 && (
              <div className="opening-job-list">

                {jobs.map((job) => {

                  // -----------------------------------------
                  // NORMALIZE JOB ID
                  // -----------------------------------------

                  const currentJobId =
                    String(
                      job?._id || ""
                    ).trim();

                  // -----------------------------------------
                  // CHECK WHETHER CURRENT CANDIDATE
                  // HAS APPLIED TO THIS JOB
                  // -----------------------------------------

                  const isApplied =
                    currentJobId &&
                    appliedJobIds.includes(
                      currentJobId
                    );

                  return (
                    <div
                      className="opening-job-card"
                      key={currentJobId}
                    >

                      {/* LEFT */}

                      <div className="opening-job-info">

                        <div className="opening-job-icon">
                          <Briefcase
                            size={16}
                          />
                        </div>

                        <div>

                          <h3>
                            {
                              job.jobTitle ||
                              "Untitled Job"
                            }
                          </h3>

                          <p>

                            <span>
                              {
                                getJobCategory(
                                  job
                                )
                              }
                            </span>

                            <span>
                              •
                            </span>

                            <MapPin
                              size={11}
                            />

                            <span>
                              {
                                getJobLocation(
                                  job
                                )
                              }
                            </span>

                          </p>

                          {job.companyName && (
                            <small className="opening-company">
                              {
                                job.companyName
                              }
                            </small>
                          )}

                        </div>

                      </div>

                      {/* RIGHT */}

                      <div className="opening-job-right">

                        <strong>
                          {
                            getJobSalary(
                              job
                            )
                          }
                        </strong>

                        <span className="opening-type">
                          {
                            getJobType(
                              job
                            )
                          }
                        </span>

                        {/* ==========================================
                            APPLIED / APPLY
                        =========================================== */}

                        {isApplied ? (

                          <button
                            type="button"
                            className="applied-job-button"
                            disabled
                          >
                            Applied ✓
                          </button>

                        ) : (

                          <button
                            type="button"
                            onClick={() =>
                              handleApply(
                                currentJobId
                              )
                            }
                          >
                            Apply
                          </button>

                        )}

                      </div>

                    </div>
                  );
                })}

              </div>
            )}

        </section>

      </section>

    </main>
  );
}

export default CurrentOpenings;