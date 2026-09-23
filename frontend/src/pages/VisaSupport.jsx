import "./VisaSupport.css";

const supportCards = [
  {
    icon: "♢",
    title: "Work-Permit Assistance",
    text: "Step-by-step guidance on employer sponsorship, work-permit requirements and relevant permit categories by country.",
  },
  {
    icon: "▣",
    title: "Documentation Support",
    text: "Checklist-driven assistance for the documents, forms and employment paperwork required for overseas placements.",
  },
  {
    icon: "◎",
    title: "Country-Specific Guidance",
    text: "Clear guidance for Gulf, Europe, Canada and Australia visa and employment pathways in practical language.",
  },
];

const destinations = [
  {
    number: "01",
    title: "Gulf Countries",
    text: "Guidance for employment documentation, employer sponsorship, work permits and visa-related processes for Gulf opportunities.",
  },
  {
    number: "02",
    title: "Europe",
    text: "Support with understanding employment documentation and relevant visa requirements for selected European opportunities.",
  },
  {
    number: "03",
    title: "Canada",
    text: "Practical guidance around employment documentation and immigration-related requirements for eligible Canadian opportunities.",
  },
  {
    number: "04",
    title: "Australia",
    text: "Assistance with understanding documentation and employment-related visa processes for suitable Australian opportunities.",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Understand Requirements",
    text: "We help candidates understand the documentation and immigration requirements relevant to their destination and role.",
  },
  {
    number: "02",
    title: "Prepare Documents",
    text: "Candidates receive a structured checklist to organise the required employment and supporting documents.",
  },
  {
    number: "03",
    title: "Employer Coordination",
    text: "Where applicable, our team coordinates with the employer regarding sponsorship, documentation and recruitment timelines.",
  },
  {
    number: "04",
    title: "Application Support",
    text: "Candidates receive guidance throughout the relevant visa, work-permit and employment documentation process.",
  },
];

function VisaOverview() {
  return (
    <>
      <div className="visa-heading">
        <p className="visa-eyebrow">SUPPORTING YOUR MOVE</p>
        <h1>Visa &amp; Immigration Support</h1>
        <p>
          Practical guidance for candidates moving abroad for employment,
          from documentation and work permits to employer coordination and
          visa-related processes.
        </p>
      </div>

      <div className="visa-intro">
        <div className="visa-intro-card">
          <span>01</span>
          <div>
            <h3>Clear Guidance</h3>
            <p>
              Understand the key documentation, employment and
              immigration-related requirements before starting your overseas
              journey.
            </p>
          </div>
        </div>

        <div className="visa-intro-card">
          <span>02</span>
          <div>
            <h3>Structured Documentation</h3>
            <p>
              Follow practical checklists to organise employment, identity
              and supporting documents required for your role and destination.
            </p>
          </div>
        </div>

        <div className="visa-intro-card">
          <span>03</span>
          <div>
            <h3>Recruitment Coordination</h3>
            <p>
              Receive support in coordinating relevant documentation, employer
              communication and recruitment timelines.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function VisaSupport({ featuredOnly = false }) {
  if (featuredOnly) {
    return (
      <main className="visa-page">
        <section className="visa-main">
          <VisaOverview />
        </section>
      </main>
    );
  }

  return (
    <main className="visa-page">

      <section className="visa-main">

        {/* ================= HEADER ================= */}

        <VisaOverview />


        {/* ================= SUPPORT SERVICES ================= */}

        <div className="visa-section-header">

          <div>

            <p className="visa-eyebrow">
              OUR SUPPORT
            </p>

            <h2>
              Support Throughout Your Overseas Journey
            </h2>

          </div>

        </div>


        <div className="visa-cards">

          {supportCards.map((card) => (

            <div
              className="visa-card"
              key={card.title}
            >

              <div className="visa-icon">
                {card.icon}
              </div>

              <h3>
                {card.title}
              </h3>

              <p>
                {card.text}
              </p>

            </div>

          ))}

        </div>


        {/* ================= DESTINATIONS ================= */}

        <section className="visa-destinations">

          <div className="visa-section-header">

            <div>

              <p className="visa-eyebrow">
                DESTINATIONS
              </p>

              <h2>
                Country-Specific Employment Guidance
              </h2>

            </div>

          </div>


          <div className="visa-destination-grid">

            {destinations.map((destination) => (

              <div
                className="visa-destination-card"
                key={destination.number}
              >

                <span>
                  {destination.number}
                </span>

                <h3>
                  {destination.title}
                </h3>

                <p>
                  {destination.text}
                </p>

              </div>

            ))}

          </div>

        </section>


        {/* ================= PROCESS ================= */}

        <section className="visa-process">

          <div className="visa-section-header">

            <div>

              <p className="visa-eyebrow">
                HOW WE SUPPORT
              </p>

              <h2>
                Your Visa &amp; Immigration Support Journey
              </h2>

            </div>

          </div>


          <div className="visa-process-grid">

            {processSteps.map((step) => (

              <div
                className="visa-process-step"
                key={step.number}
              >

                <span>
                  {step.number}
                </span>

                <h3>
                  {step.title}
                </h3>

                <p>
                  {step.text}
                </p>

              </div>

            ))}

          </div>

        </section>


        {/* ================= IMPORTANT NOTE ================= */}

        <section className="visa-important">

          <div>

            <p className="visa-eyebrow">
              IMPORTANT INFORMATION
            </p>

            <h2>
              Immigration requirements vary by country and employment role.
            </h2>

            <p>
              Visa eligibility, sponsorship requirements, processing
              timelines and documentation can vary depending on the
              destination, employer and role. Candidates should follow
              the applicable official requirements and instructions.
            </p>

          </div>

        </section>


        {/* ================= FAQ ================= */}

        <div className="visa-faq-section">

          <div className="visa-section-header">

            <div>

              <p className="visa-faq-eyebrow">
                FREQUENTLY ASKED
              </p>

              <h2>
                Visa &amp; Immigration FAQs
              </h2>

            </div>

          </div>


          <div className="visa-faq-box">

            <div className="visa-faq-item">

              <h4>
                Who arranges the visa — RAGAS or the employer?
              </h4>

              <p>
                Visa sponsorship is generally handled by the relevant
                employer where sponsorship is required. RAGAS supports
                candidates with recruitment coordination and relevant
                documentation guidance.
              </p>

            </div>


            <div className="visa-faq-item">

              <h4>
                How long does the process usually take?
              </h4>

              <p>
                Processing timelines vary by destination country,
                employer, role category and applicable government
                procedures. Candidates should follow the current
                requirements for their specific application.
              </p>

            </div>


            <div className="visa-faq-item">

              <h4>
                Does every overseas job require the same documents?
              </h4>

              <p>
                No. Documentation requirements can differ depending on
                the destination, employer, occupation and visa or work
                permit category.
              </p>

            </div>


            <div className="visa-faq-item">

              <h4>
                Does RAGAS provide immigration guidance?
              </h4>

              <p>
                RAGAS provides recruitment-related documentation and
                process guidance. Candidates should rely on the relevant
                government authorities or authorised immigration
                professionals for official legal or immigration advice.
              </p>

            </div>

          </div>

        </div>


        {/* ================= CTA ================= */}

        <section className="visa-cta">

          <div>

            <p className="visa-eyebrow">
              PLAN YOUR NEXT MOVE
            </p>

            <h2>
              Preparing for an overseas career opportunity?
            </h2>

            <p>
              Explore international opportunities and upload your resume
              to connect with suitable overseas roles.
            </p>

          </div>

        </section>

      </section>

    </main>
  );
}

export default VisaSupport;