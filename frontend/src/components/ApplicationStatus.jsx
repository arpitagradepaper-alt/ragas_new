import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  CheckCircle2,
  Eye,
  Award,
  Calendar,
  XCircle,
  CheckCircle,
  ArrowLeft,
  Briefcase,
  Loader2,
} from "lucide-react";

import "./ApplicationStatus.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export function ApplicationStatus() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        
        const savedUser =
          localStorage.getItem("ragasUser") ||
          sessionStorage.getItem("ragasUser");

        

        const token =
          localStorage.getItem("ragasUserToken") ||
          sessionStorage.getItem("ragasUserToken");

        

        if (!savedUser || !token) {
          setLoading(false);
          setError("Authentication required.");

          setTimeout(() => {
            navigate("/user-login");
          }, 1200);

          return;
        }

        

        let user;

        try {
          user = JSON.parse(savedUser);
        } catch (parseError) {
          console.error(
            "Invalid saved user data:",
            parseError
          );

          localStorage.removeItem("ragasUser");
          sessionStorage.removeItem("ragasUser");

          setLoading(false);
          setError(
            "Your login session is invalid. Please log in again."
          );

          setTimeout(() => {
            navigate("/user-login");
          }, 1200);

          return;
        }

        const userEmail = String(user?.email || "")
          .trim()
          .toLowerCase();

        if (!userEmail) {
          setLoading(false);
          setError(
            "User email not found. Please log in again."
          );

          setTimeout(() => {
            navigate("/user-login");
          }, 1200);

          return;
        }

      

        const response = await fetch(
          `${API_BASE_URL}/api/applications/candidate?email=${encodeURIComponent(
            userEmail
          )}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

      
        const contentType =
          response.headers.get("content-type") || "";

        if (!contentType.includes("application/json")) {
          throw new Error(
            "Invalid server response. Please check the API connection."
          );
        }

        const data = await response.json();

      

        console.log(
          "===================================="
        );

        console.log(
          "APPLICATION STATUS API RESPONSE"
        );

        console.log(
          "Candidate:",
          userEmail
        );

        console.log(
          "API URL:",
          `${API_BASE_URL}/api/applications/candidate`
        );

        console.log(
          "Response:",
          data
        );

        if (Array.isArray(data?.data)) {
          data.data.forEach((app) => {
            console.log(
  "APPLICATION DETAILS:",
  "ID =", String(app._id),
  "| JOB =", app.jobTitle,
  "| STATUS =", app.status,
  "| EMAIL =", app.email
);
          });
        }

        console.log(
          "===================================="
        );

  

        if (
          response.status === 401 ||
          response.status === 403
        ) {
          localStorage.removeItem(
            "ragasUserToken"
          );

          sessionStorage.removeItem(
            "ragasUserToken"
          );

          setError(
            "Your login session has expired. Please log in again."
          );

          setTimeout(() => {
            navigate("/user-login");
          }, 1200);

          return;
        }

  

        if (!response.ok || !data.success) {
          setError(
            data.message ||
              "Failed to load application status."
          );

          return;
        }


        const applicationData =
          Array.isArray(data.data)
            ? data.data
            : [];

        setApplications(applicationData);
      } catch (err) {
        console.error(
          "Application status fetch error:",
          err
        );

        setError(
          err?.message ||
            "Something went wrong connecting to the server."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [navigate]);


  const normalizeStatus = (status) => {
    return String(status || "Applied")
      .trim()
      .toLowerCase();
  };

 

  const getStageFlags = (status) => {
    const s = normalizeStatus(status);

    const isRejected = s === "rejected";
    const isSelected = s === "selected";

    const isShortlisted =
      s === "shortlisted" ||
      s === "interview" ||
      s === "selected";

    const isInterview =
      s === "interview" ||
      s === "selected";

    const isUnderReview =
      [
        "under review",
        "shortlisted",
        "interview",
        "selected",
        "rejected",
      ].includes(s);

    return {
      applied: true,

      viewed: isUnderReview,

      shortlisted: isShortlisted,

      interview: isInterview,

      selected: isSelected,

      rejected: isRejected,
    };
  };

  

  if (loading) {
    return (
      <div className="application-status-page">
        <div className="status-container">
          <div
            className="status-loading"
            style={{
              textAlign: "center",
              padding: "40px",
            }}
          >
            <Loader2
              className="spinner"
              size={32}
              style={{
                animation:
                  "spin 1s linear infinite",
              }}
            />

            <p
              style={{
                marginTop: "10px",
              }}
            >
              Loading your application statuses...
            </p>
          </div>
        </div>
      </div>
    );
  }



  return (
    <div className="application-status-page">
      <div className="status-container">

     

        <button
          className="back-home-btn"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={16} />
          Back to Home
        </button>

        

        <div className="status-header">
          <h1>
            My Job Application Status
          </h1>

          <p>
            Track the live progress of your job
            applications submitted through RAGAS.
          </p>
        </div>

      

        {error ? (
          <div
            className="status-error-box"
            style={{
              padding: "20px",
              color: "red",
              textAlign: "center",
            }}
          >
            <p>{error}</p>
          </div>
        ) : applications.length === 0 ? (

       

          <div
            className="no-applications-box"
            style={{
              textAlign: "center",
              padding: "40px",
            }}
          >
            <Briefcase
              size={48}
              style={{
                opacity: 0.5,
                marginBottom: "15px",
              }}
            />

            <h3>
              No Applications Found
            </h3>

            <p>
              You haven't applied to any jobs yet.
              Check out current openings to apply!
            </p>

            <button
              className="browse-jobs-btn"
              onClick={() =>
                navigate("/current-openings")
              }
              style={{
                marginTop: "15px",
                padding: "10px 20px",
                cursor: "pointer",
              }}
            >
              Browse Openings
            </button>
          </div>

        ) : (

         

          <div className="applications-list">

            {applications.map((app) => {
              const stages =
                getStageFlags(app.status);

              const rawStatus =
                String(app.status || "Applied").trim();

              const normalizedStatus =
                normalizeStatus(app.status);

              const isRejected =
                normalizedStatus === "rejected";

              const isShortlisted =
                normalizedStatus === "shortlisted";

              const isInterview =
                normalizedStatus === "interview";

              const isSelected =
                normalizedStatus === "selected";

    
              console.log(
  "RENDERING APPLICATION:",
  "ID =", String(app._id),
  "| JOB =", app.jobTitle,
  "| RAW STATUS =", rawStatus,
  "| NORMALIZED =", normalizedStatus,
  "| REJECTED =", isRejected,
  "| SHORTLISTED =", isShortlisted
);

              return (
                <div
                  key={app._id}
                  className="application-card"
                >

             

                  <div className="app-card-top">

                    <div className="job-meta">

                      <span className="job-icon-box">
                        <Briefcase size={20} />
                      </span>

                      <div>
                        <h2>
                          {app.jobTitle ||
                            "Job Application"}
                        </h2>

                        <p className="app-company">
                          {app.currentCompany ||
                            "RAGAS Career World"}

                          {app.currentLocation
                            ? ` • ${app.currentLocation}`
                            : ""}
                        </p>

                        <span className="app-date">
                          Applied on:{" "}
                          {app.createdAt
                            ? new Date(
                                app.createdAt
                              ).toLocaleDateString()
                            : "Date unavailable"}
                        </span>
                      </div>

                    </div>

                  

                    <span
                      className={`status-pill ${normalizedStatus.replace(
                        /\s+/g,
                        "-"
                      )}`}
                    >
                      {rawStatus}
                    </span>

                  </div>

                 

                  <div className="tracker-steps">

                    {/* APPLIED */}

                    <div
                      className={`tracker-step ${
                        stages.applied
                          ? "completed"
                          : ""
                      }`}
                    >
                      <div className="step-circle">
                        <CheckCircle2 size={16} />
                      </div>

                      <span>
                        Applied
                      </span>
                    </div>

                    {/* LINE */}

                    <div
                      className={`tracker-line ${
                        stages.viewed
                          ? "completed"
                          : ""
                      }`}
                    />

                    {/* UNDER REVIEW */}

                    <div
                      className={`tracker-step ${
                        stages.viewed
                          ? "completed"
                          : "pending"
                      }`}
                    >
                      <div className="step-circle">
                        <Eye size={16} />
                      </div>

                      <span>
                        Under Review
                      </span>
                    </div>

                    {/* LINE */}

                    <div
                      className={`tracker-line ${
                        stages.shortlisted
                          ? "completed"
                          : ""
                      }`}
                    />

                    {/* SHORTLISTED */}

                    <div
                      className={`tracker-step ${
                        stages.shortlisted
                          ? "completed"
                          : "pending"
                      }`}
                    >
                      <div className="step-circle">
                        <Award size={16} />
                      </div>

                      <span>
                        Shortlisted
                      </span>
                    </div>

                    {/* LINE */}

                    <div
                      className={`tracker-line ${
                        stages.interview
                          ? "completed"
                          : ""
                      }`}
                    />

                    {/* INTERVIEW */}

                    <div
                      className={`tracker-step ${
                        stages.interview
                          ? "completed"
                          : "pending"
                      }`}
                    >
                      <div className="step-circle">
                        <Calendar size={16} />
                      </div>

                      <span>
                        Interview
                      </span>
                    </div>

                    {/* LINE */}

                    <div
                      className={`tracker-line ${
                        stages.selected ||
                        stages.rejected
                          ? "completed"
                          : ""
                      }`}
                    />

                    {/* FINAL STATUS */}

                    <div
                      className={`tracker-step ${
                        stages.selected
                          ? "completed"
                          : stages.rejected
                          ? "rejected"
                          : "pending"
                      }`}
                    >
                      <div className="step-circle">

                        {stages.selected ? (
                          <CheckCircle size={16} />
                        ) : stages.rejected ? (
                          <XCircle size={16} />
                        ) : (
                          <Calendar size={16} />
                        )}

                      </div>

                      <span>
                        {isRejected
                          ? "Rejected"
                          : "Selected"}
                      </span>
                    </div>

                  </div>

                </div>
              );
            })}

          </div>
        )}
      </div>
    </div>
  );
}

export default ApplicationStatus;