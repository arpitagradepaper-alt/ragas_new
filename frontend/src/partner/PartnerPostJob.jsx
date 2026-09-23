import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  MapPin,
  Building2,
  Clock3,
  DollarSign,
  FileText,
  ArrowLeft,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import "./PartnerPostJob.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const PARTNER_JOBS_API = `${API_BASE_URL}/api/jobs`;

function PartnerPostJob() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    company: "",
    location: "",
    jobType: "Full-time",
    industry: "",
    salary: "",
    experience: "",
    skills: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /* -----------------------------------------
     PARTNER DATA
  ----------------------------------------- */

  let partner = null;

  try {
    partner = JSON.parse(
      localStorage.getItem("ragasPartner") || "null"
    );
  } catch (parseError) {
    console.error("Invalid partner data:", parseError);
    partner = null;
  }

  /*
    Handle status case safely:
    Verified / verified / VERIFIED
  */
  const isVerified =
    String(partner?.status || "").toLowerCase() === "verified";

  /* -----------------------------------------
     INPUT CHANGE
  ----------------------------------------- */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* -----------------------------------------
     SUBMIT JOB
  ----------------------------------------- */

  const submitJob = async ({ publish }) => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      /*
        Check both localStorage and sessionStorage
      */
      const token =
        localStorage.getItem("ragasPartnerToken") ||
        sessionStorage.getItem("ragasPartnerToken");

      if (!token) {
        setError("Partner authentication required.");
        setLoading(false);
        return;
      }

      const response = await fetch(PARTNER_JOBS_API, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          jobTitle: formData.title.trim(),
          description: formData.description.trim(),

          // FIXED: company was missing
          company: formData.company.trim(),

          jobType: formData.jobType,
          category: formData.industry.trim(),
          location: formData.location.trim(),
          salary: formData.salary.trim(),
          experience: formData.experience.trim(),
          skills: formData.skills.trim(),

          publish,
        }),
      });

      /*
        Safely handle JSON / HTML responses
      */
      const contentType =
        response.headers.get("content-type") || "";

      let data;

      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();

        console.error(
          "Non-JSON response from server:",
          text
        );

        throw new Error(
          text.startsWith("<")
            ? "Server returned an HTML response instead of JSON. Please check the API URL and backend."
            : "Invalid server response."
        );
      }

      /*
        Backend returned an error
      */
      if (!response.ok) {
        throw new Error(
          data?.message || "Unable to save the job."
        );
      }

      /*
        Success
      */
      setMessage(
        publish
          ? "Job published successfully and sent for admin approval."
          : "Job saved as a draft. You can publish it once your partner account is verified."
      );

      /*
        Reset form
      */
      setFormData({
        title: "",
        description: "",
        company: "",
        location: "",
        jobType: "Full-time",
        industry: "",
        salary: "",
        experience: "",
        skills: "",
      });
    } catch (err) {
      console.error(
        "Partner job submission error:",
        err
      );

      setError(
        err?.message ||
          "Something went wrong while saving the job."
      );
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------------------
     NORMAL SUBMIT
  ----------------------------------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();

    /*
      Verified partner:
      publish = true

      Unverified partner:
      submit button is disabled,
      so this normally won't run.
    */
    await submitJob({
      publish: isVerified,
    });
  };

  /* -----------------------------------------
     SAVE DRAFT
  ----------------------------------------- */

  const handleSaveDraft = async () => {
    await submitJob({
      publish: false,
    });
  };

  /* -----------------------------------------
     RENDER
  ----------------------------------------- */

  return (
    <div className="partner-post-job">

      {/* -----------------------------------------
          PAGE HEADING
      ----------------------------------------- */}

      <div className="partner-post-job-heading">

        <div>

          <button
            type="button"
            className="partner-back-btn"
            onClick={() =>
              navigate("/partner-dashboard")
            }
          >
            <ArrowLeft size={15} />

            Back to Dashboard
          </button>

          <p className="partner-post-job-eyebrow">
            JOB MANAGEMENT
          </p>

          <h2>Post New Job</h2>

          <p className="partner-post-job-description">
            Create a new job vacancy for your recruitment
            requirements.
          </p>

        </div>

      </div>

      {/* -----------------------------------------
          VERIFICATION NOTICE
      ----------------------------------------- */}

      {isVerified ? (
        <div className="partner-form-success">

          <ShieldCheck size={16} />

          <span>
            Your partner account is verified.
            You can publish jobs directly for admin approval.
          </span>

        </div>
      ) : (
        <div className="partner-form-warning">

          <ShieldAlert size={16} />

          <span>
            Your partner account is awaiting admin
            verification. You can save this job as a draft
            now and publish it once your account is verified.
          </span>

        </div>
      )}

      {/* -----------------------------------------
          FORM
      ----------------------------------------- */}

      <form
        className="partner-job-form"
        onSubmit={handleSubmit}
      >

        {/* -----------------------------------------
            JOB INFORMATION
        ----------------------------------------- */}

        <div className="partner-form-section">

          <div className="partner-form-section-title">

            <BriefcaseBusiness size={18} />

            <div>

              <h3>Job Information</h3>

              <p>
                Enter the basic details of the job vacancy.
              </p>

            </div>

          </div>

          <div className="partner-form-grid">

            {/* JOB TITLE */}

            <div className="partner-form-group partner-full-width">

              <label htmlFor="title">
                Job Title *
              </label>

              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Senior Software Engineer"
                required
              />

            </div>

            {/* COMPANY */}

            <div className="partner-form-group">

              <label htmlFor="company">
                Company Name *
              </label>

              <div className="partner-input-icon">

                <Building2 size={16} />

                <input
                  id="company"
                  name="company"
                  type="text"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Company name"
                  required
                />

              </div>

            </div>

            {/* LOCATION */}

            <div className="partner-form-group">

              <label htmlFor="location">
                Location *
              </label>

              <div className="partner-input-icon">

                <MapPin size={16} />

                <input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="City, Country"
                  required
                />

              </div>

            </div>

            {/* JOB TYPE */}

            <div className="partner-form-group">

              <label htmlFor="jobType">
                Job Type *
              </label>

              <div className="partner-input-icon">

                <Clock3 size={16} />

                <select
                  id="jobType"
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  required
                >

                  <option value="Full-time">
                    Full-time
                  </option>

                  <option value="Part-time">
                    Part-time
                  </option>

                  <option value="Contract">
                    Contract
                  </option>

                  <option value="Temporary">
                    Temporary
                  </option>

                  <option value="Internship">
                    Internship
                  </option>

                </select>

              </div>

            </div>

            {/* INDUSTRY */}

            <div className="partner-form-group">

              <label htmlFor="industry">
                Industry
              </label>

              <input
                id="industry"
                name="industry"
                type="text"
                value={formData.industry}
                onChange={handleChange}
                placeholder="e.g. IT & Software"
              />

            </div>

            {/* SALARY */}

            <div className="partner-form-group">

              <label htmlFor="salary">
                Salary
              </label>

              <div className="partner-input-icon">

                <DollarSign size={16} />

                <input
                  id="salary"
                  name="salary"
                  type="text"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="e.g. ₹8-12 LPA"
                />

              </div>

            </div>

            {/* EXPERIENCE */}

            <div className="partner-form-group">

              <label htmlFor="experience">
                Experience
              </label>

              <input
                id="experience"
                name="experience"
                type="text"
                value={formData.experience}
                onChange={handleChange}
                placeholder="e.g. 3-5 years"
              />

            </div>

          </div>

        </div>

        {/* -----------------------------------------
            JOB DESCRIPTION
        ----------------------------------------- */}

        <div className="partner-form-section">

          <div className="partner-form-section-title">

            <FileText size={18} />

            <div>

              <h3>Job Description</h3>

              <p>
                Provide complete information about the role.
              </p>

            </div>

          </div>

          {/* DESCRIPTION */}

          <div className="partner-form-group">

            <label htmlFor="description">
              Description *
            </label>

            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Write the job description..."
              rows="7"
              required
            />

          </div>

          {/* SKILLS */}

          <div className="partner-form-group">

            <label htmlFor="skills">
              Required Skills
            </label>

            <textarea
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g. React, Node.js, MongoDB, JavaScript"
              rows="4"
            />

          </div>

        </div>

        {/* -----------------------------------------
            SUCCESS MESSAGE
        ----------------------------------------- */}

        {message && (
          <div className="partner-form-success">

            {message}

          </div>
        )}

        {/* -----------------------------------------
            ERROR MESSAGE
        ----------------------------------------- */}

        {error && (
          <div className="partner-form-error">

            {error}

          </div>
        )}

        {/* -----------------------------------------
            ACTION BUTTONS
        ----------------------------------------- */}

        <div className="partner-form-actions">

          {/* CANCEL */}

          <button
            type="button"
            className="partner-cancel-btn"
            onClick={() =>
              navigate("/partner-dashboard")
            }
            disabled={loading}
          >
            Cancel
          </button>

          {/* SAVE DRAFT */}

          <button
            type="button"
            className="partner-cancel-btn"
            onClick={handleSaveDraft}
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : "Save as Draft"}
          </button>

          {/* PUBLISH */}

          <button
            type="submit"
            className="partner-submit-job-btn"
            disabled={loading || !isVerified}
            title={
              isVerified
                ? "Publish this job for admin approval"
                : "Publishing is enabled once the admin verifies your account"
            }
          >
            {loading
              ? "Submitting..."
              : isVerified
                ? "Publish Job"
                : "Publish (Verification Pending)"}
          </button>

        </div>

      </form>

    </div>
  );
}

export default PartnerPostJob;