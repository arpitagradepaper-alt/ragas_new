import { useState } from "react";
import "./UploadResume.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function UploadResume() {
  const [resume, setResume] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    preferredIndustry: "",
    preferredCountry: "",
    experience: "",
    currentLocation: "",
    skills: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setResume(file);
      setStatus("");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();

    const file = e.dataTransfer.files[0];

    if (file) {
      setResume(file);
      setStatus("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resume) {
      setStatus("Please upload your resume.");
      return;
    }

    if (!formData.name || !formData.email) {
      setStatus("Name and email are required.");
      return;
    }

    setStatus("Uploading...");

    const data = new FormData();

    data.append("resume", resume);

    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append(
      "preferredIndustry",
      formData.preferredIndustry
    );
    data.append(
      "preferredCountry",
      formData.preferredCountry
    );
    data.append("experience", formData.experience);
    data.append(
      "currentLocation",
      formData.currentLocation
    );
    data.append("skills", formData.skills);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/resume`,
        {
          method: "POST",
          body: data,
        }
      );

      // JSON ke instead pehle text read karenge
      const text = await response.text();

      console.log("Response status:", response.status);
      console.log("Response:", text);

      let result;

      try {
        result = JSON.parse(text);
      } catch {
        throw new Error(
          text || "Server returned an invalid response."
        );
      }

      if (!response.ok) {
        throw new Error(
          result.message || "Resume upload failed."
        );
      }

      if (result.success) {
        setStatus(
          "Resume uploaded successfully!"
        );

        setFormData({
          name: "",
          email: "",
          phone: "",
          preferredIndustry: "",
          preferredCountry: "",
          experience: "",
          currentLocation: "",
          skills: "",
        });

        setResume(null);

        // File input reset ke liye page reload nahi karna
        const fileInput =
          document.getElementById("resume-file-input");

        if (fileInput) {
          fileInput.value = "";
        }
      } else {
        setStatus(
          result.message || "Upload failed."
        );
      }
    } catch (error) {
      console.error(
        "Resume upload error:",
        error
      );

      setStatus(
        error.message ||
          "Unable to connect to server."
      );
    }
  };

  return (
    <main className="upload-resume-page">
      <section className="upload-resume-main">

        <div className="upload-resume-info">
          <p className="upload-eyebrow">
            CANDIDATE PROFILE
          </p>

          <h1>Upload Your Resume</h1>

          <p className="upload-description">
            One profile, every relevant opening. Your
            resume and profile feeds power job-match
            alerts sent by email or WhatsApp.
          </p>
        </div>

        <div className="upload-resume-card">

          {/* Resume Upload */}

          <label
            className="resume-dropzone"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <span>↥</span>

            <strong>
              {resume
                ? resume.name
                : "Drag & drop your resume (PDF/DOC), or browse"}
            </strong>

            <input
              id="resume-file-input"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              hidden
            />
          </label>

          {/* Resume Form */}

          <form
            className="resume-form"
            onSubmit={handleSubmit}
          >

            <div className="form-field">
              <label>Full Name</label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label>Email Address</label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label>Phone Number</label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label>Preferred Industry</label>

              <input
                type="text"
                name="preferredIndustry"
                value={formData.preferredIndustry}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label>Preferred Country</label>

              <input
                type="text"
                name="preferredCountry"
                value={formData.preferredCountry}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label>Total Experience (Years)</label>

              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                min="0"
              />
            </div>

            <div className="form-field">
              <label>Current Location</label>

              <input
                type="text"
                name="currentLocation"
                value={formData.currentLocation}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label>Skills (comma separated)</label>

              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="submit-resume-btn"
            >
              Submit Profile
            </button>

            {status && (
              <p className="resume-status">
                {status}
              </p>
            )}

          </form>
        </div>
      </section>
    </main>
  );
}

export default UploadResume;