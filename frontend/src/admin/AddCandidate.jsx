import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddCandidate.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const API_URL = API_BASE_URL;

function AddCandidate() {
  const navigate = useNavigate();

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
    status: "Active",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================================
  // HANDLE INPUT CHANGE
  // =========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================
  // SUBMIT CANDIDATE
  // =========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // =========================================
    // FRONTEND VALIDATION
    // =========================================

    if (!formData.fullName.trim()) {
      setError("Full name is required.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!formData.phone.trim()) {
      setError("Phone number is required.");
      return;
    }

    try {
      setLoading(true);

      // =========================================
      // MAP FRONTEND FIELDS TO BACKEND FIELDS
      // =========================================

      const candidateData = {
        // IMPORTANT MAPPING
        name: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),

        // Other candidate information
        dateOfBirth: formData.dateOfBirth,
        location: formData.currentLocation,
        currentJobTitle: formData.currentJobTitle,
        experience: formData.totalExperience,

        // IMPORTANT MAPPING
        qualification:
          formData.highestQualification,

        currentCompany:
          formData.currentCompany,

        keySkills:
          formData.keySkills,

        preferredLocation:
          formData.preferredLocation,

        preferredCountry:
          formData.preferredCountry,

        expectedSalary:
          formData.expectedSalary,

        noticePeriod:
          formData.noticePeriod,

        status:
          formData.status,
      };

      console.log(
        "Candidate data being submitted:",
        candidateData
      );

      // =========================================
      // API REQUEST
      // =========================================

      const response = await fetch(
        `${API_URL}/api/candidates`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(candidateData),
        }
      );

      // =========================================
      // RESPONSE
      // =========================================

      const result = await response.json();

      console.log(
        "Candidate API response:",
        result
      );

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to add candidate."
        );
      }

      // =========================================
      // SUCCESS
      // =========================================

      setSuccess(
        "Candidate added successfully."
      );

      // =========================================
      // GO BACK TO CANDIDATES
      // =========================================

      setTimeout(() => {
        navigate("/admin/candidates");
      }, 800);

    } catch (err) {
      console.error(
        "Add candidate error:",
        err
      );

      setError(
        err.message ||
          "Unable to add candidate."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-candidate-page">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="add-candidate-header">

        <div>
          <p>CANDIDATE MANAGEMENT</p>

          <h2>Add Candidate</h2>

          <span>
            Create a candidate profile directly from
            the admin panel.
          </span>
        </div>

        <button
          type="button"
          className="back-candidates-btn"
          onClick={() =>
            navigate("/admin/candidates")
          }
        >
          ← Back to Candidates
        </button>

      </div>


      {/* =====================================
          ALERTS
      ===================================== */}

      {error && (
        <div className="candidate-form-error">
          {error}
        </div>
      )}

      {success && (
        <div className="candidate-form-success">
          {success}
        </div>
      )}


      {/* =====================================
          FORM
      ===================================== */}

      <form
        className="add-candidate-card"
        onSubmit={handleSubmit}
      >

        {/* ===================================
            PERSONAL INFORMATION
        =================================== */}

        <div className="candidate-form-section">

          <div className="candidate-form-section-heading">

            <h3>
              Personal Information
            </h3>

            <span>
              Basic candidate contact details
            </span>

          </div>


          <div className="candidate-form-grid">

            {/* FULL NAME */}

            <div className="candidate-form-field">

              <label>
                Full Name <b>*</b>
              </label>

              <input
                type="text"
                name="fullName"
                placeholder="Enter full name"
                value={formData.fullName}
                onChange={handleChange}
              />

            </div>


            {/* EMAIL */}

            <div className="candidate-form-field">

              <label>
                Email <b>*</b>
              </label>

              <input
                type="email"
                name="email"
                placeholder="candidate@example.com"
                value={formData.email}
                onChange={handleChange}
              />

            </div>


            {/* PHONE */}

            <div className="candidate-form-field">

              <label>
                Phone <b>*</b>
              </label>

              <input
                type="tel"
                name="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
              />

            </div>


            {/* DATE OF BIRTH */}

            <div className="candidate-form-field">

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


            {/* CURRENT LOCATION */}

            <div className="candidate-form-field full">

              <label>
                Current Location
              </label>

              <input
                type="text"
                name="currentLocation"
                placeholder="e.g. Mumbai, India"
                value={
                  formData.currentLocation
                }
                onChange={handleChange}
              />

            </div>

          </div>

        </div>


        {/* ===================================
            PROFESSIONAL INFORMATION
        =================================== */}

        <div className="candidate-form-section">

          <div className="candidate-form-section-heading">

            <h3>
              Professional Information
            </h3>

            <span>
              Candidate's professional background
            </span>

          </div>


          <div className="candidate-form-grid">

            {/* CURRENT JOB */}

            <div className="candidate-form-field">

              <label>
                Current Job Title
              </label>

              <input
                type="text"
                name="currentJobTitle"
                placeholder="e.g. Software Developer"
                value={
                  formData.currentJobTitle
                }
                onChange={handleChange}
              />

            </div>


            {/* EXPERIENCE */}

            <div className="candidate-form-field">

              <label>
                Total Experience
              </label>

              <input
                type="text"
                name="totalExperience"
                placeholder="e.g. 3 years"
                value={
                  formData.totalExperience
                }
                onChange={handleChange}
              />

            </div>


            {/* QUALIFICATION */}

            <div className="candidate-form-field">

              <label>
                Highest Qualification
              </label>

              <select
                name="highestQualification"
                value={
                  formData.highestQualification
                }
                onChange={handleChange}
              >

                <option value="">
                  Select qualification
                </option>

                <option value="10th">
                  10th
                </option>

                <option value="12th">
                  12th
                </option>

                <option value="Diploma">
                  Diploma
                </option>

                <option value="B.A.">
                  B.A.
                </option>

                <option value="B.Com">
                  B.Com
                </option>

                <option value="B.Tech">
                  B.Tech
                </option>

                <option value="B.Sc">
                  B.Sc
                </option>

                <option value="M.A.">
                  M.A.
                </option>

                <option value="M.Com">
                  M.Com
                </option>

                <option value="M.Tech">
                  M.Tech
                </option>

                <option value="MBA">
                  MBA
                </option>

                <option value="MCA">
                  MCA
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

            </div>


            {/* CURRENT COMPANY */}

            <div className="candidate-form-field">

              <label>
                Current Company
              </label>

              <input
                type="text"
                name="currentCompany"
                placeholder="Enter company name"
                value={
                  formData.currentCompany
                }
                onChange={handleChange}
              />

            </div>


            {/* KEY SKILLS */}

            <div className="candidate-form-field full">

              <label>
                Key Skills
              </label>

              <textarea
                name="keySkills"
                placeholder="e.g. React, Node.js, MongoDB, JavaScript"
                value={
                  formData.keySkills
                }
                onChange={handleChange}
                rows="4"
              />

            </div>

          </div>

        </div>


        {/* ===================================
            JOB PREFERENCES
        =================================== */}

        <div className="candidate-form-section">

          <div className="candidate-form-section-heading">

            <h3>
              Job Preferences
            </h3>

            <span>
              Candidate's preferred opportunities
            </span>

          </div>


          <div className="candidate-form-grid">

            {/* PREFERRED LOCATION */}

            <div className="candidate-form-field">

              <label>
                Preferred Location
              </label>

              <input
                type="text"
                name="preferredLocation"
                placeholder="e.g. Bengaluru"
                value={
                  formData.preferredLocation
                }
                onChange={handleChange}
              />

            </div>


            {/* PREFERRED COUNTRY */}

            <div className="candidate-form-field">

              <label>
                Preferred Country
              </label>

              <input
                type="text"
                name="preferredCountry"
                placeholder="e.g. India, UAE, Canada"
                value={
                  formData.preferredCountry
                }
                onChange={handleChange}
              />

            </div>


            {/* EXPECTED SALARY */}

            <div className="candidate-form-field">

              <label>
                Expected Salary
              </label>

              <input
                type="text"
                name="expectedSalary"
                placeholder="e.g. ₹8 LPA"
                value={
                  formData.expectedSalary
                }
                onChange={handleChange}
              />

            </div>


            {/* NOTICE PERIOD */}

            <div className="candidate-form-field">

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

                <option value="Immediate">
                  Immediate
                </option>

                <option value="15 Days">
                  15 Days
                </option>

                <option value="30 Days">
                  30 Days
                </option>

                <option value="60 Days">
                  60 Days
                </option>

                <option value="90 Days">
                  90 Days
                </option>

              </select>

            </div>

          </div>

        </div>


        {/* ===================================
            STATUS
        =================================== */}

        <div className="candidate-form-section">

          <div className="candidate-form-section-heading">

            <h3>
              Candidate Status
            </h3>

          </div>


          <div className="candidate-form-grid">

            <div className="candidate-form-field">

              <label>
                Status
              </label>

              <select
                name="status"
                value={
                  formData.status
                }
                onChange={handleChange}
              >

                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>

                <option value="Shortlisted">
                  Shortlisted
                </option>

                <option value="Placed">
                  Placed
                </option>

              </select>

            </div>

          </div>

        </div>


        {/* ===================================
            ACTIONS
        =================================== */}

        <div className="candidate-form-actions">

          {/* CANCEL */}

          <button
            type="button"
            className="candidate-cancel-btn"
            onClick={() =>
              navigate("/admin/candidates")
            }
            disabled={loading}
          >
            Cancel
          </button>


          {/* SAVE */}

          <button
            type="submit"
            className="candidate-save-btn"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : "Save Candidate"}
          </button>

        </div>

      </form>

    </div>
  );
}

export default AddCandidate;