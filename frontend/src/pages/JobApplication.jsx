import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Upload,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import "./JobApplication.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const API_URL = `${API_BASE_URL}/api/applications`;
const JOB_API_URL = `${API_BASE_URL}/api/jobs`;

/* =========================================
   STATIC WEBSITE JOBS
========================================= */

const JOBS = {
  "senior-software-engineer": {
    title: "Senior Software Engineer",
    location: "Bengaluru, India",
    industry: "IT & Software",
  },

  "registered-nurse-gulf": {
    title: "Registered Nurse — Gulf",
    location: "Dubai, UAE",
    industry: "Healthcare",
  },

  "financial-analyst": {
    title: "Financial Analyst",
    location: "Mumbai, India",
    industry: "Banking & Finance",
  },

  "airport-ground-staff-doha": {
    title: "Airport Ground Staff",
    location: "Doha, Qatar",
    industry: "Aviation & Airports",
  },

  "hotel-operations-manager-riyadh": {
    title: "Hotel Operations Manager",
    location: "Riyadh, Saudi Arabia",
    industry: "Hospitality & Hotels",
  },

  "production-supervisor-pune": {
    title: "Production Supervisor",
    location: "Pune, India",
    industry: "Manufacturing",
  },

  "civil-site-engineer-riyadh": {
    title: "Civil Site Engineer",
    location: "Riyadh, Saudi Arabia",
    industry: "Engineering & Construction",
  },

  "hotel-fnb-manager-doha": {
    title: "Hotel F&B Manager",
    location: "Doha, Qatar",
    industry: "Hospitality & Hotels",
  },

  "warehouse-supervisor-toronto": {
    title: "Warehouse Supervisor",
    location: "Toronto, Canada",
    industry: "Logistics & Transportation",
  },

  "software-developer-bengaluru": {
    title: "Software Developer",
    location: "Bengaluru, India",
    industry: "IT & Software",
  },

  "bank-relationship-manager-mumbai": {
    title: "Bank Relationship Manager",
    location: "Mumbai, India",
    industry: "Banking & Finance",
  },

  "plant-operations-head-pune": {
    title: "Plant Operations Head",
    location: "Pune, India",
    industry: "Manufacturing",
  },

  "airport-customer-service-hyderabad": {
    title: "Airport Customer Service Executive",
    location: "Hyderabad, India",
    industry: "Aviation & Airports",
  },

  "1": {
    title: "Senior Software Engineer",
    location: "Bengaluru, India",
    industry: "IT & Software",
  },

  "2": {
    title: "HR Manager",
    location: "Mumbai, India",
    industry: "Human Resources",
  },

  "3": {
    title: "Digital Marketing Executive",
    location: "Delhi NCR, India",
    industry: "Digital Marketing",
  },

  "4": {
    title: "Sales Manager",
    location: "Dubai, UAE",
    industry: "Sales & Business Development",
  },
};

/* =========================================
   FALLBACK
========================================= */

const createFallbackJob = (id) => {
  const formattedTitle = String(id || "")
    .split("-")
    .filter(Boolean)
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");

  return {
    id,
    title: formattedTitle || "Job Position",
    location: "Multiple Locations",
    industry: "General",
  };
};

/* =========================================
   GET LOGGED-IN CANDIDATE
========================================= */

const getLoggedInCandidate = () => {
  try {
    const localUser = localStorage.getItem("ragasUser");

    if (localUser) {
      return JSON.parse(localUser);
    }

    const sessionUser =
      sessionStorage.getItem("ragasUser");

    if (sessionUser) {
      return JSON.parse(sessionUser);
    }
  } catch (error) {
    console.error(
      "Unable to read logged-in candidate:",
      error
    );
  }

  return null;
};

/* =========================================
   COMPONENT
========================================= */

function JobApplication() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  /* =========================================
     JOB STATE
  ========================================= */

  const [job, setJob] = useState(
    JOBS[jobId] || createFallbackJob(jobId)
  );

  const [jobLoading, setJobLoading] = useState(false);
  const [jobError, setJobError] = useState("");

  /* =========================================
     FORM STATES
  ========================================= */

  const [resume, setResume] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* =========================================
     FORM DATA
  ========================================= */

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    currentLocation: "",
    currentJobTitle: "",
    totalExperience: "",
    highestQualification: "",
    currentCompany: "",
    keySkills: "",
    preferredLocation: "",
    preferredCountry: "",
    expectedSalary: "",
    noticePeriod: "",
    coverLetter: "",
  });

  /* =========================================
     LOAD LOGGED-IN CANDIDATE
  ========================================= */

  useEffect(() => {
    const candidate = getLoggedInCandidate();

    if (!candidate) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      fullName:
        candidate.fullName ||
        candidate.name ||
        candidate.fullName ||
        "",
      email:
        candidate.email ||
        candidate.Email ||
        "",
      phone:
        candidate.phone ||
        candidate.mobile ||
        candidate.phoneNumber ||
        "",
    }));
  }, []);

  /* =========================================
     FETCH MONGODB JOB
  ========================================= */

  useEffect(() => {
    const fetchJob = async () => {
      /*
        Old/static jobs don't need MongoDB.
      */

      if (JOBS[jobId]) {
        setJob({
          ...JOBS[jobId],
          id: jobId,
        });

        return;
      }

      /*
        Dynamic jobs come from MongoDB.
      */

      setJobLoading(true);
      setJobError("");

      try {
        const response = await fetch(
          `${JOB_API_URL}/${jobId}`
        );

        const result = await response.json();

        console.log(
          "Job details response:",
          result
        );

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Unable to load job details."
          );
        }

        if (!result.data) {
          throw new Error(
            "Job details not found."
          );
        }

        const mongoJob = result.data;

        setJob({
          id: mongoJob._id,

          title:
            mongoJob.jobTitle ||
            mongoJob.title ||
            "Job Position",

          location:
            mongoJob.location ||
            "Multiple Locations",

          industry:
            mongoJob.category ||
            mongoJob.industry ||
            "General",
        });
      } catch (error) {
        console.error(
          "Fetch job error:",
          error
        );

        setJobError(
          error.message ||
            "Unable to load job details."
        );

        setJob(
          JOBS[jobId] ||
            createFallbackJob(jobId)
        );
      } finally {
        setJobLoading(false);
      }
    };

    if (jobId) {
      fetchJob();
    }
  }, [jobId]);

  /* =========================================
     HANDLE INPUT
  ========================================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================================
     HANDLE RESUME
  ========================================= */

  const handleResumeChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Only PDF, DOC and DOCX files are allowed."
      );

      setResume(null);
      e.target.value = "";
      return;
    }

    if (file.size > maxSize) {
      setError(
        "Resume size must be less than 5 MB."
      );

      setResume(null);
      e.target.value = "";
      return;
    }

    setError("");
    setResume(file);
  };

  /* =========================================
     SUBMIT APPLICATION
  ========================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    /*
      Candidate must be logged in.
    */

    const candidate = getLoggedInCandidate();

    if (!candidate) {
      setError(
        "Please login as a candidate before applying."
      );

      setTimeout(() => {
        navigate("/user-login");
      }, 1000);

      return;
    }

    /*
      Make sure job exists.
    */

    const actualJobId = job.id || jobId;

    if (!actualJobId) {
      setError(
        "Job information is missing. Please go back and try again."
      );

      return;
    }

    /*
      Resume required.
    */

    if (!resume) {
      setError("Please upload your resume.");
      return;
    }

    /*
      Make sure email exists.
    */

    if (!formData.email.trim()) {
      setError(
        "Candidate email is required."
      );

      return;
    }

    setLoading(true);

    try {
      const data = new FormData();

      /*
        MongoDB Job _id
      */

      data.append(
        "jobId",
        actualJobId
      );

      /*
        Actual job title
      */

      data.append(
        "jobTitle",
        job.title || "Job Position"
      );

      /*
        Candidate fields
      */

      Object.entries(formData).forEach(
        ([key, value]) => {
          data.append(
            key,
            value ?? ""
          );
        }
      );

      /*
        Resume file
      */

      data.append(
        "resume",
        resume
      );

      console.log(
        "Submitting application:",
        {
          jobId: actualJobId,
          jobTitle: job.title,
          email: formData.email,
        }
      );

      const response = await fetch(
        API_URL,
        {
          method: "POST",
          body: data,
        }
      );

      const result =
        await response.json();

      console.log(
        "Application API response:",
        result
      );

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Application submission failed."
        );
      }

      setSubmitted(true);

      setFormData((prev) => ({
        ...prev,
        phone: "",
        dateOfBirth: "",
        currentLocation: "",
        currentJobTitle: "",
        totalExperience: "",
        highestQualification: "",
        currentCompany: "",
        keySkills: "",
        preferredLocation: "",
        preferredCountry: "",
        expectedSalary: "",
        noticePeriod: "",
        coverLetter: "",
      }));

      setResume(null);

      const fileInput =
        document.querySelector(
          'input[type="file"]'
        );

      if (fileInput) {
        fileInput.value = "";
      }

      /*
        After successful submission,
        return to Current Openings after 2 seconds.
      */

      setTimeout(() => {
        navigate("/current-openings");
      }, 2000);
    } catch (error) {
      console.error(
        "Application submission error:",
        error
      );

      setError(
        error.message ||
          "Unable to submit application. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================
     BACK
  ========================================= */

  const handleBack = () => {
    navigate("/current-openings");
  };

  /* =========================================
     UI
  ========================================= */

  return (
    <div className="application-page">

      {/* HEADER */}

      <div className="application-header">

        <button
          type="button"
          className="back-button"
          onClick={handleBack}
        >
          <ArrowLeft size={17} />
          Back to Jobs
        </button>

        <div className="application-title">

          <span>
            CAREER OPPORTUNITY
          </span>

          <h1>
            Apply for this Position
          </h1>

          <p>
            Complete the form below and our
            recruitment team will review your
            application.
          </p>

        </div>

      </div>

      {/* JOB SUMMARY */}

      <div className="job-summary">

        <div>

          <span>
            APPLYING FOR
          </span>

          <h2>
            {jobLoading
              ? "Loading job..."
              : job.title}
          </h2>

        </div>

        <div className="job-summary-details">

          <div>

            <small>
              Location
            </small>

            <strong>
              {job.location}
            </strong>

          </div>

          <div>

            <small>
              Industry
            </small>

            <strong>
              {job.industry}
            </strong>

          </div>

        </div>

      </div>

      {/* JOB ERROR */}

      {jobError && (
        <div className="application-error">
          {jobError}
        </div>
      )}

      {/* APPLICATION FORM */}

      <form
        className="application-form"
        onSubmit={handleSubmit}
      >

        {/* 01 */}

        <section className="form-section">

          <div className="section-heading">

            <span>01</span>

            <div>
              <h3>
                Personal Information
              </h3>

              <p>
                Tell us a little about yourself.
              </p>
            </div>

          </div>

          <div className="form-grid">

            <div className="form-group">
              <label>
                Full Name *
              </label>

              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label>
                Email Address *
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label>
                Phone Number *
              </label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                required
              />
            </div>

            <div className="form-group">
              <label>
                Date of Birth
              </label>

              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </div>

            <div className="form-group full-width">
              <label>
                Current Location *
              </label>

              <input
                type="text"
                name="currentLocation"
                value={formData.currentLocation}
                onChange={handleChange}
                placeholder="City, State, Country"
                required
              />
            </div>

          </div>

        </section>

        {/* 02 */}

        <section className="form-section">

          <div className="section-heading">

            <span>02</span>

            <div>
              <h3>
                Professional Information
              </h3>

              <p>
                Share your professional background.
              </p>
            </div>

          </div>

          <div className="form-grid">

            <div className="form-group">
              <label>
                Current Job Title
              </label>

              <input
                type="text"
                name="currentJobTitle"
                value={formData.currentJobTitle}
                onChange={handleChange}
                placeholder="e.g. Software Engineer"
              />
            </div>

            <div className="form-group">
              <label>
                Total Experience *
              </label>

              <select
                name="totalExperience"
                value={formData.totalExperience}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select experience
                </option>
                <option>Fresher</option>
                <option>0–2 Years</option>
                <option>2–5 Years</option>
                <option>5–8 Years</option>
                <option>8–12 Years</option>
                <option>12+ Years</option>
              </select>
            </div>

            <div className="form-group">
              <label>
                Highest Qualification *
              </label>

              <select
                name="highestQualification"
                value={
                  formData.highestQualification
                }
                onChange={handleChange}
                required
              >
                <option value="">
                  Select qualification
                </option>
                <option>High School</option>
                <option>Diploma</option>
                <option>Bachelor's Degree</option>
                <option>Master's Degree</option>
                <option>Doctorate</option>
                <option>Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>
                Current / Previous Company
              </label>

              <input
                type="text"
                name="currentCompany"
                value={formData.currentCompany}
                onChange={handleChange}
                placeholder="Company name"
              />
            </div>

            <div className="form-group full-width">
              <label>
                Key Skills *
              </label>

              <input
                type="text"
                name="keySkills"
                value={formData.keySkills}
                onChange={handleChange}
                placeholder="e.g. React, JavaScript, Communication"
                required
              />
            </div>

          </div>

        </section>

        {/* 03 */}

        <section className="form-section">

          <div className="section-heading">

            <span>03</span>

            <div>
              <h3>
                Job Preferences
              </h3>

              <p>
                Tell us about your preferred
                opportunity.
              </p>
            </div>

          </div>

          <div className="form-grid">

            <div className="form-group">
              <label>
                Preferred Location
              </label>

              <input
                type="text"
                name="preferredLocation"
                value={
                  formData.preferredLocation
                }
                onChange={handleChange}
                placeholder="Preferred city / location"
              />
            </div>

            <div className="form-group">
              <label>
                Preferred Country
              </label>

              <select
                name="preferredCountry"
                value={
                  formData.preferredCountry
                }
                onChange={handleChange}
              >
                <option value="">
                  Select country
                </option>
                <option>India</option>
                <option>UAE</option>
                <option>Qatar</option>
                <option>Saudi Arabia</option>
                <option>United Kingdom</option>
                <option>Canada</option>
                <option>Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>
                Expected Salary
              </label>

              <input
                type="text"
                name="expectedSalary"
                value={
                  formData.expectedSalary
                }
                onChange={handleChange}
                placeholder="e.g. ₹8,00,000 per annum"
              />
            </div>

            <div className="form-group">
              <label>
                Notice Period
              </label>

              <select
                name="noticePeriod"
                value={
                  formData.noticePeriod
                }
                onChange={handleChange}
              >
                <option value="">
                  Select notice period
                </option>
                <option>Immediate</option>
                <option>15 Days</option>
                <option>30 Days</option>
                <option>60 Days</option>
                <option>90 Days</option>
                <option>More than 90 Days</option>
              </select>
            </div>

          </div>

        </section>

        {/* 04 */}

        <section className="form-section">

          <div className="section-heading">

            <span>04</span>

            <div>
              <h3>
                Resume & Cover Letter
              </h3>

              <p>
                Upload your latest resume and
                introduce yourself.
              </p>
            </div>

          </div>

          <div className="resume-upload">

            <Upload size={25} />

            <h4>
              {resume
                ? resume.name
                : "Upload your resume"}
            </h4>

            <p>
              PDF, DOC or DOCX • Maximum file
              size 5 MB
            </p>

            <label className="upload-button">

              Choose File

              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={
                  handleResumeChange
                }
              />

            </label>

          </div>

          <div className="form-group cover-letter">

            <label>
              Cover Letter
            </label>

            <textarea
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleChange}
              rows="6"
              placeholder="Tell us why you are a good fit for this position..."
            />

          </div>

        </section>

        {/* ERROR */}

        {error && (
          <div className="application-error">
            {error}
          </div>
        )}

        {/* CONSENT */}

        <section className="form-section consent-section">

          <label className="checkbox-row">

            <input
              type="checkbox"
              required
            />

            <span>
              I agree that RAGAS CAREER WORLD may
              use the information provided above to
              process my job application and contact
              me regarding suitable career
              opportunities.
            </span>

          </label>

          <button
            type="submit"
            className="submit-application"
            disabled={
              loading || jobLoading
            }
          >
            {loading
              ? "Submitting Application..."
              : "Submit Application"}
          </button>

        </section>

      </form>

      {/* SUCCESS */}

      {submitted && (
        <div className="success-message">

          <CheckCircle2 size={22} />

          <div>

            <strong>
              Application Submitted Successfully
            </strong>

            <p>
              Thank you for applying. Our recruitment
              team will review your profile and contact
              you if your application matches the
              opportunity.
            </p>

          </div>

        </div>
      )}

    </div>
  );
}

export default JobApplication;