import "./RecruitmentProcess.css";

const steps = [
  {
    number: "1",
    title: "Sourcing",
    text: "Multi-channel candidate sourcing across our professional network, recruitment database and industry connections.",
  },
  {
    number: "2",
    title: "Screening",
    text: "Skills, experience, background and document verification to understand candidate suitability.",
  },
  {
    number: "3",
    title: "Shortlisting",
    text: "A curated shortlist of qualified candidates matched with the employer's role requirements.",
  },
  {
    number: "4",
    title: "Interview",
    text: "Coordinated interviews through in-person, video or panel formats based on employer requirements.",
  },
  {
    number: "5",
    title: "Offer",
    text: "Offer communication, negotiation assistance and documentation support through the selection stage.",
  },
  {
    number: "6",
    title: "Onboarding",
    text: "Joining coordination, visa or work-permit assistance for overseas roles and post-placement follow-up.",
  },
];

function RecruitmentOverview() {
  return (
    <>
      <div className="recruitment-heading">
        <p className="recruitment-eyebrow">OUR METHODOLOGY</p>
        <h1>Recruitment Process</h1>
        <p>
          A structured and transparent recruitment journey designed to connect
          employers with qualified talent while providing candidates with
          professional support from sourcing to onboarding.
        </p>
      </div>

      <div className="recruitment-intro">
        <div className="recruitment-intro-card">
          <span>01</span>
          <div>
            <h3>Employer Requirements</h3>
            <p>
              We understand the role, required qualifications, experience,
              skills, location and hiring expectations before beginning the
              recruitment process.
            </p>
          </div>
        </div>

        <div className="recruitment-intro-card">
          <span>02</span>
          <div>
            <h3>Candidate Evaluation</h3>
            <p>
              Candidate profiles are reviewed against relevant job
              requirements to identify suitable professionals for the role.
            </p>
          </div>
        </div>

        <div className="recruitment-intro-card">
          <span>03</span>
          <div>
            <h3>Placement Support</h3>
            <p>
              Our team coordinates interviews, selection, documentation,
              joining and relevant overseas employment processes.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function RecruitmentProcess({ featuredOnly = false }) {
  if (featuredOnly) {
    return (
      <main className="recruitment-process-page">
        <section className="recruitment-process-main">
          <RecruitmentOverview />
        </section>
      </main>
    );
  }

  return (
    <main className="recruitment-process-page">

      {/* ================= MAIN ================= */}

      <section className="recruitment-process-main">

        {/* ================= HEADER ================= */}

        <RecruitmentOverview />


        {/* ================= TIMELINE HEADER ================= */}

        <div className="recruitment-section-header">

          <div>

            <p className="recruitment-eyebrow">
              SIX-STEP JOURNEY
            </p>

            <h2>
              From Sourcing to Successful Onboarding
            </h2>

          </div>

        </div>


        {/* ================= TIMELINE ================= */}

        <div className="recruitment-timeline">

          <div
            className="timeline-line"
            aria-hidden="true"
          ></div>


          {steps.map((step) => (

            <div
              className="timeline-step"
              key={step.number}
            >

              <div className="timeline-number">
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


        {/* ================= PROCESS DETAILS ================= */}

        <section className="recruitment-details">

          <div className="recruitment-section-header">

            <div>

              <p className="recruitment-eyebrow">
                WHAT WE FOCUS ON
              </p>

              <h2>
                A Consistent Recruitment Standard
              </h2>

            </div>

          </div>


          <div className="recruitment-details-grid">

            <div className="recruitment-detail-card">

              <span>
                01
              </span>

              <h3>
                Quality Matching
              </h3>

              <p>
                We focus on aligning candidate skills, experience and career
                expectations with the requirements of each opportunity.
              </p>

            </div>


            <div className="recruitment-detail-card">

              <span>
                02
              </span>

              <h3>
                Verification
              </h3>

              <p>
                Candidate information and relevant documents are reviewed as
                part of the recruitment and screening process.
              </p>

            </div>


            <div className="recruitment-detail-card">

              <span>
                03
              </span>

              <h3>
                Clear Communication
              </h3>

              <p>
                Employers and candidates receive coordinated communication
                throughout the recruitment and selection journey.
              </p>

            </div>


            <div className="recruitment-detail-card">

              <span>
                04
              </span>

              <h3>
                Post-Placement Support
              </h3>

              <p>
                Our support continues beyond selection with joining
                coordination and relevant onboarding assistance.
              </p>

            </div>

          </div>

        </section>


        {/* ================= EMPLOYER & CANDIDATE ================= */}

        <section className="recruitment-audience">

          <div className="recruitment-audience-card">

            <p className="recruitment-eyebrow">
              FOR EMPLOYERS
            </p>

            <h2>
              Streamlined Hiring Support
            </h2>

            <p>
              From understanding workforce requirements to presenting
              qualified candidates and coordinating interviews, our process
              helps employers manage recruitment through a structured hiring
              journey.
            </p>

          </div>


          <div className="recruitment-audience-card">

            <p className="recruitment-eyebrow">
              FOR JOB SEEKERS
            </p>

            <h2>
              Professional Career Support
            </h2>

            <p>
              Candidates receive guidance throughout relevant stages of the
              recruitment process, including profile screening, interviews,
              documentation and joining.
            </p>

          </div>

        </section>


        {/* ================= ACCESSIBILITY ================= */}

        <div className="screen-reader-note">

          <strong>
            Screen-reader equivalent:
          </strong>{" "}

          The same six steps are also presented as an ordered text list
          beneath the visual timeline, so the sequence is never conveyed
          by position alone.

        </div>


        <ol className="accessible-step-list">

          {steps.map((step) => (

            <li key={step.number}>

              <strong>
                {step.title}
              </strong>{" "}
              — {step.text}

            </li>

          ))}

        </ol>


        {/* ================= FINAL CTA ================= */}

        <section className="recruitment-cta">

          <div>

            <p className="recruitment-eyebrow">
              READY TO GET STARTED?
            </p>

            <h2>
              Let's build the right recruitment journey for your needs.
            </h2>

            <p>
              Whether you are an employer looking for qualified talent or a
              professional exploring new career opportunities, RAGAS CAREER
              WORLD can support you through the recruitment process.
            </p>

          </div>

        </section>

      </section>

    </main>
  );
}

export default RecruitmentProcess;