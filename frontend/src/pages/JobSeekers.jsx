import { useNavigate } from "react-router-dom";
import "./JobSeekers.css";

function JobSeekersOverview({ onRegisterResume, onBrowseOpenings }) {
  return (
    <>
      <div className="job-seekers-hero">
        <p className="job-seekers-eyebrow">FOR JOB SEEKERS</p>
        <h1>Build your career, globally.</h1>
        <p className="job-seekers-description">
          Search domestic and overseas roles, upload your resume once, and
          track every application from your personal dashboard.
        </p>

        <div className="job-seekers-actions">
          <button
            type="button"
            className="job-seekers-btn primary"
            onClick={onRegisterResume}
          >
            Register / Upload Resume
          </button>
          <button
            type="button"
            className="job-seekers-btn secondary"
            onClick={onBrowseOpenings}
          >
            Browse Openings
          </button>
        </div>
      </div>

      <div className="job-seekers-features">
        <div className="job-seekers-feature">
          <span>✓</span>
          <p>One-click Apply Online + application tracking</p>
        </div>
        <div className="job-seekers-feature">
          <span>✓</span>
          <p>Secure resume/CV upload &amp; profile builder</p>
        </div>
        <div className="job-seekers-feature">
          <span>✓</span>
          <p>Job alerts via email / WhatsApp</p>
        </div>
      </div>

      <section className="career-resources">
        <p className="resources-eyebrow">CAREER RESOURCES</p>
        <div className="resources-grid">
          <div className="resource-card">
            <span className="resource-number">01</span>
            <h3>Resume Tips</h3>
            <p>
              Craft a professional resume that highlights your skills,
              experience and career strengths.
            </p>
          </div>
          <div className="resource-card">
            <span className="resource-number">02</span>
            <h3>Interview Prep</h3>
            <p>
              Prepare for interviews with common questions, practical
              guidance and country-specific etiquette.
            </p>
          </div>
          <div className="resource-card">
            <span className="resource-number">03</span>
            <h3>Visa Guidance</h3>
            <p>
              Understand important employment documents and visa-related
              requirements for overseas opportunities.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

function JobSeekers({ featuredOnly = false }) {
  const navigate = useNavigate();

  // Check whether the user is already registered/logged in
  const isUserLoggedIn =
    localStorage.getItem("ragasUserLoggedIn") === "true" ||
    sessionStorage.getItem("ragasUserLoggedIn") === "true";

  // Register / Upload Resume button
  const handleRegisterResume = () => {
    if (isUserLoggedIn) {
      // Already registered → directly upload resume
      navigate("/upload-resume");
    } else {
      // Not registered → first register
      navigate("/user-registration");
    }
  };

  // Browse Openings button
  const handleBrowseOpenings = () => {
    if (isUserLoggedIn) {
      // Already registered → show job openings
      navigate("/current-openings");
    } else {
      // Not registered → first register
      navigate("/user-registration");
    }
  };

  if (featuredOnly) {
    return (
      <main className="job-seekers-page">
        <section className="job-seekers-main">
          <JobSeekersOverview
            onRegisterResume={handleRegisterResume}
            onBrowseOpenings={handleBrowseOpenings}
          />
        </section>
      </main>
    );
  }

  return (
    <main className="job-seekers-page">
      <section className="job-seekers-main">

        {/* ================= HERO ================= */}
        <div className="job-seekers-hero">

          <p className="job-seekers-eyebrow">
            FOR JOB SEEKERS
          </p>

          <h1>
            Build your career, globally.
          </h1>

          <p className="job-seekers-description">
            Search domestic and overseas roles, upload your resume once,
            and track every application from your personal dashboard.
          </p>

          <div className="job-seekers-actions">

            {/* REGISTER / UPLOAD RESUME */}
            <button
              type="button"
              className="job-seekers-btn primary"
              onClick={handleRegisterResume}
            >
              Register / Upload Resume
            </button>

            {/* BROWSE OPENINGS */}
            <button
              type="button"
              className="job-seekers-btn secondary"
              onClick={handleBrowseOpenings}
            >
              Browse Openings
            </button>

          </div>

        </div>

        {/* ================= FEATURES ================= */}
        <div className="job-seekers-features">

          <div className="job-seekers-feature">
            <span>✓</span>
            <p>
              One-click Apply Online + application tracking
            </p>
          </div>

          <div className="job-seekers-feature">
            <span>✓</span>
            <p>
              Secure resume/CV upload &amp; profile builder
            </p>
          </div>

          <div className="job-seekers-feature">
            <span>✓</span>
            <p>
              Job alerts via email / WhatsApp
            </p>
          </div>

        </div>

        {/* ================= CAREER RESOURCES ================= */}
        <section className="career-resources">

          <p className="resources-eyebrow">
            CAREER RESOURCES
          </p>

          <div className="resources-grid">

            <div className="resource-card">
              <span className="resource-number">01</span>

              <h3>
                Resume Tips
              </h3>

              <p>
                Craft a professional resume that highlights your
                skills, experience and career strengths.
              </p>
            </div>

            <div className="resource-card">
              <span className="resource-number">02</span>

              <h3>
                Interview Prep
              </h3>

              <p>
                Prepare for interviews with common questions,
                practical guidance and country-specific etiquette.
              </p>
            </div>

            <div className="resource-card">
              <span className="resource-number">03</span>

              <h3>
                Visa Guidance
              </h3>

              <p>
                Understand important employment documents and
                visa-related requirements for overseas opportunities.
              </p>
            </div>

          </div>

        </section>

        {/* ================= HOW IT WORKS ================= */}
        <section className="job-seekers-process">

          <div className="job-seekers-section-heading">

            <p className="job-seekers-eyebrow">
              HOW IT WORKS
            </p>

            <h2>
              Your career journey, made simpler.
            </h2>

            <p>
              From creating your profile to applying for opportunities,
              RAGAS CAREER WORLD helps you move through the recruitment
              journey with clear and structured support.
            </p>

          </div>

          <div className="job-seekers-process-grid">

            <div className="process-card">
              <span>01</span>

              <h3>
                Create Your Profile
              </h3>

              <p>
                Register with your basic details and create your
                professional candidate profile.
              </p>
            </div>

            <div className="process-card">
              <span>02</span>

              <h3>
                Upload Your Resume
              </h3>

              <p>
                Upload your latest resume and keep your professional
                information ready for suitable opportunities.
              </p>
            </div>

            <div className="process-card">
              <span>03</span>

              <h3>
                Explore Opportunities
              </h3>

              <p>
                Browse domestic and international openings based on
                your skills, experience and preferred location.
              </p>
            </div>

            <div className="process-card">
              <span>04</span>

              <h3>
                Apply &amp; Track
              </h3>

              <p>
                Apply for suitable roles and track your application
                progress through the recruitment journey.
              </p>
            </div>

          </div>

        </section>

        {/* ================= OPPORTUNITIES ================= */}
        <section className="job-seekers-opportunities">

          <div className="job-seekers-section-heading">

            <p className="job-seekers-eyebrow">
              CAREER OPPORTUNITIES
            </p>

            <h2>
              Opportunities across India and the world.
            </h2>

            <p>
              Discover career opportunities across multiple industries,
              locations and experience levels through our domestic and
              international recruitment network.
            </p>

          </div>

          <div className="opportunities-grid">

            <div className="opportunity-card">

              <span className="opportunity-number">
                01
              </span>

              <h3>
                International Jobs
              </h3>

              <p>
                Explore overseas opportunities across the Gulf,
                Europe, Canada, Australia and Asia.
              </p>

              <button
                type="button"
                onClick={handleBrowseOpenings}
                className="opportunity-link"
              >
                Explore Opportunities →
              </button>

            </div>

            <div className="opportunity-card">

              <span className="opportunity-number">
                02
              </span>

              <h3>
                Domestic Jobs
              </h3>

              <p>
                Find career opportunities across major Indian cities,
                states and growing industries.
              </p>

              <button
                type="button"
                onClick={handleBrowseOpenings}
                className="opportunity-link"
              >
                Explore Opportunities →
              </button>

            </div>

            <div className="opportunity-card">

              <span className="opportunity-number">
                03
              </span>

              <h3>
                Multiple Industries
              </h3>

              <p>
                Access roles across IT, healthcare, banking, aviation,
                hospitality, engineering and many more sectors.
              </p>

              <button
                type="button"
                onClick={handleBrowseOpenings}
                className="opportunity-link"
              >
                Explore Opportunities →
              </button>

            </div>

          </div>

        </section>

        {/* ================= CANDIDATE SUPPORT ================= */}
        <section className="job-seekers-support">

          <div className="job-seekers-section-heading">

            <p className="job-seekers-eyebrow">
              CANDIDATE SUPPORT
            </p>

            <h2>
              Support beyond the job application.
            </h2>

            <p>
              Our recruitment team supports candidates throughout
              relevant stages of the hiring process.
            </p>

          </div>

          <div className="support-grid">

            <div className="support-card">
              <h3>
                Profile Guidance
              </h3>

              <p>
                Build a clear professional profile that helps employers
                understand your experience and career goals.
              </p>
            </div>

            <div className="support-card">
              <h3>
                Interview Coordination
              </h3>

              <p>
                Receive relevant information and coordination support
                during interview and selection stages.
              </p>
            </div>

            <div className="support-card">
              <h3>
                Documentation Support
              </h3>

              <p>
                Get guidance on relevant employment documentation,
                particularly for overseas opportunities.
              </p>
            </div>

            <div className="support-card">
              <h3>
                Application Tracking
              </h3>

              <p>
                Keep track of your applications and recruitment
                progress through the candidate journey.
              </p>
            </div>

          </div>

        </section>

        {/* ================= FINAL CTA ================= */}
        <section className="job-seekers-cta">

          <div>

            <p className="job-seekers-eyebrow">
              START YOUR JOURNEY
            </p>

            <h2>
              Your next career opportunity could be closer than you think.
            </h2>

            <p>
              Create your profile, upload your resume and explore
              suitable domestic and international opportunities.
            </p>

            <div className="job-seekers-cta-actions">

              <button
                type="button"
                className="job-seekers-btn primary"
                onClick={handleRegisterResume}
              >
                Register / Upload Resume
              </button>

              <button
                type="button"
                className="job-seekers-btn secondary"
                onClick={handleBrowseOpenings}
              >
                Browse Openings
              </button>

            </div>

          </div>

        </section>

      </section>
    </main>
  );
}

export default JobSeekers;