import { useNavigate } from "react-router-dom";
import "./Careers.css";

const careers = [
  {
    id: "recruitment-consultant-bengaluru",
    title: "Recruitment Consultant",
    location: "Bengaluru, India",
  },
  {
    id: "partner-manager-mumbai",
    title: "Partner Manager",
    location: "Mumbai, India",
  },
  {
    id: "content-editor-remote",
    title: "Content Editor — Blog & SEO",
    location: "Remote, India",
  },
  {
    id: "visa-compliance-associate-delhi",
    title: "Visa & Compliance Associate",
    location: "Delhi NCR, India",
  },
];

function Careers() {
  const navigate = useNavigate();

  const handleApply = (jobId) => {
    navigate(`/apply/${jobId}`);
  };

  return (
    <main className="careers-page">

      <section className="careers-main">

        <div className="careers-heading">
          <p className="careers-eyebrow">
            WORK AT RAGAS
          </p>

          <h1>Careers</h1>

          <p>
            Internal openings at RAGAS CAREER WORLD itself.
          </p>
        </div>


        <div className="career-list">

          {careers.map((job) => (
            <div
              className="career-row"
              key={job.id}
            >

              <div className="career-info">
                <strong>{job.title}</strong>

                <span>
                  {job.location}
                </span>
              </div>


              <div className="career-actions">

                <span className="full-time-badge">
                  Full-time
                </span>

                <button
                  type="button"
                  className="career-apply"
                  onClick={() => handleApply(job.id)}
                >
                  Apply
                </button>

              </div>

            </div>
          ))}

        </div>

      </section>

    </main>
  );
}

export default Careers;