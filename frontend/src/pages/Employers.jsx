import { useNavigate } from "react-router-dom";
import "./Employers.css";

const hiringSteps = [
  {
    number: "1",
    title: "Register & verify",
    text: "Submit company details for admin verification",
  },
  {
    number: "2",
    title: "Post a job",
    text: "Self-service form, published after approval",
  },
  {
    number: "3",
    title: "Review applicants",
    text: "Manage candidates from your dashboard",
  },
  {
    number: "4",
    title: "Hire",
    text: "Request executive search or RPO for bulk hiring",
  },
];

const features = [
  "Company verification workflow",
  "Applicant dashboard with status tracking",
  "Downloadable hiring-requirement submission",
];

function Employers() {
  const navigate = useNavigate();

  return (
    <main className="employers-page">
      <section className="employers-section">

        {/* HERO */}
        <div className="employers-hero">
          <p className="employers-eyebrow">
            FOR EMPLOYERS
          </p>

          <h1>
            Hire verified talent, faster.
          </h1>

          <p className="employers-description">
            Post roles, manage applicants, and request executive search or
            bulk hiring support — all from one employer dashboard.
          </p>

          <div className="employers-buttons">

            {/* REGISTER AS EMPLOYER */}
            <button
              type="button"
              className="employer-btn gold"
              onClick={() => navigate("/employer-registration")}
            >
              Register as Employer
            </button>

            {/* POST A JOB */}
            <a
              href="/post-a-job"
              className="employer-btn outline"
              onClick={(event) => {
                event.preventDefault();
                navigate("/post-a-job");
              }}
            >
              Post a Job
            </a>

          </div>
        </div>

        {/* HIRING PROCESS */}
        <div className="hiring-process">

          <p className="process-eyebrow">
            HIRING PROCESS
          </p>

          <h2>
            How It Works for Companies
          </h2>

          <div className="steps-grid">

            {hiringSteps.map((step) => (
              <div
                className="step"
                key={step.number}
              >
                <div className="step-number">
                  {step.number}
                </div>

                <h3>
                  {step.title}
                </h3>

                <p>
                  {step.text}
                </p>
              </div>
            ))}

          </div>
        </div>

        {/* FEATURES */}
        <div className="employer-features">

          {features.map((feature, index) => (
            <div
              className="employer-feature"
              key={index}
            >
              <span>✓</span>

              <p>
                {feature}
              </p>
            </div>
          ))}

        </div>

      </section>
    </main>
  );
}

export default Employers;
