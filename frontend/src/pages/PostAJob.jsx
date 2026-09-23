import { useState } from "react";
import "./PostAJob.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const API_URL = API_BASE_URL;

function PostAJob() {
  const [formData, setFormData] = useState({
    jobTitle: "",
    category: "",
    location: "",
    employmentType: "",
    experienceRequired: "",
    salaryRange: "",
    openings: "",
    jobDescription: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSubmitted(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSubmitted(false);

    try {
      const response = await fetch(`${API_URL}/api/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("ragasPartnerToken") || ""}`,
        },
        body: JSON.stringify({
          // Real partner company name; "Employer" only as a
          // last resort if the profile object is missing.
          companyName:
            JSON.parse(
              localStorage.getItem("ragasPartner") || "null"
            )?.companyName || "Employer",
          jobTitle: formData.jobTitle,
          jobType: formData.employmentType,
          category: formData.category,
          experience: formData.experienceRequired,
          location: formData.location,
          salary: formData.salaryRange,
          description: formData.jobDescription,
          openings: Number(formData.openings),
          publish: true,
        }),
      });

      const data = await response.json();

      console.log("Job Post Response:", data);

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to submit job posting."
        );
      }

      setSubmitted(true);

      setFormData({
        jobTitle: "",
        category: "",
        location: "",
        employmentType: "",
        experienceRequired: "",
        salaryRange: "",
        openings: "",
        jobDescription: "",
      });
    } catch (err) {
      console.error("Job posting error:", err);

      setError(
        err.message ||
          "Unable to submit job posting. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="post-job-page">
      <section className="post-job-main">

        {/* LEFT SIDE */}
        <div className="post-job-info">
          <p className="post-job-eyebrow">
            EMPLOYER TOOLS
          </p>

          <h1>Post a Job</h1>

          <p className="post-job-description">
            Submitted roles enter an admin approval queue before going live,
            the same verification standard applied to every employer.
          </p>

          <div className="verification-note">
            Company verification required before your first posting is approved.
          </div>
        </div>


        {/* RIGHT SIDE */}
        <div className="post-job-card">

          <form
            className="post-job-form"
            onSubmit={handleSubmit}
          >

            {/* JOB TITLE */}
            <div className="post-field">
              <label>Job Title</label>

              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                placeholder="Enter job title"
                required
              />
            </div>


            {/* INDUSTRY */}
            <div className="post-field">
              <label>Industry</label>

              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Enter industry"
                required
              />
            </div>


            {/* LOCATION */}
            <div className="post-field">
              <label>Location / Country</label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Dubai, UAE"
                required
              />
            </div>


            {/* EMPLOYMENT TYPE */}
            <div className="post-field">
              <label>Employment Type</label>

              <input
                type="text"
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
                placeholder="e.g. Full-time"
                required
              />
            </div>


            {/* EXPERIENCE */}
            <div className="post-field">
              <label>Experience Required</label>

              <input
                type="text"
                name="experienceRequired"
                value={formData.experienceRequired}
                onChange={handleChange}
                placeholder="e.g. 2-5 years"
                required
              />
            </div>


            {/* SALARY */}
            <div className="post-field">
              <label>Salary Range</label>

              <input
                type="text"
                name="salaryRange"
                value={formData.salaryRange}
                onChange={handleChange}
                placeholder="e.g. ₹8-12 LPA"
              />
            </div>


            {/* OPENINGS */}
            <div className="post-field">
              <label>Number of Openings</label>

              <input
                type="number"
                name="openings"
                value={formData.openings}
                onChange={handleChange}
                placeholder="e.g. 5"
                min="1"
                required
              />
            </div>


            {/* JOB DESCRIPTION */}
            <div className="post-field">
              <label>Job Description</label>

              <textarea
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleChange}
                placeholder="Enter job description"
                rows="6"
                required
              />
            </div>


            {/* ERROR MESSAGE */}
            {error && (
              <div
                style={{
                  padding: "12px 14px",
                  marginBottom: "15px",
                  borderRadius: "8px",
                  background: "#fff1f1",
                  color: "#b42318",
                  fontSize: "14px",
                }}
              >
                {error}
              </div>
            )}


            {/* SUCCESS MESSAGE */}
            {submitted && (
              <div
                style={{
                  padding: "12px 14px",
                  marginBottom: "15px",
                  borderRadius: "8px",
                  background: "#edf8f2",
                  color: "#16704a",
                  fontSize: "14px",
                }}
              >
                Job submitted successfully! It is now pending admin approval.
              </div>
            )}


            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="post-job-submit"
              disabled={loading}
            >
              {loading
                ? "Submitting..."
                : "Submit for Approval"}
            </button>

          </form>

        </div>

      </section>
    </main>
  );
}

export default PostAJob;