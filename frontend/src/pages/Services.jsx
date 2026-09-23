import {
  Briefcase,
  Settings,
  BarChart3,
  Plane,
  Shield,
  FileCheck,
  Users,
  Search,
  UserCheck,
  Globe2,
  Building2,
  Headphones,
} from "lucide-react";

import { Link } from "react-router-dom";

import "./Services.css";

const services = [
  {
    icon: Briefcase,
    title: "Permanent Staffing",
    description:
      "End-to-end recruitment support for full-time positions, including candidate sourcing, screening, interview coordination and placement.",
  },
  {
    icon: Settings,
    title: "Contract Staffing",
    description:
      "Flexible workforce solutions for temporary, project-based and contract roles across different industries and business requirements.",
  },
  {
    icon: BarChart3,
    title: "Executive Search",
    description:
      "Confidential executive recruitment for leadership, management and senior-level positions requiring specialised skills and experience.",
  },
  {
    icon: Plane,
    title: "Overseas Placement",
    description:
      "International recruitment services connecting qualified professionals with genuine employment opportunities across global markets.",
  },
  {
    icon: Settings,
    title: "RPO – Recruitment Process Outsourcing",
    description:
      "Managed recruitment support for organisations that require scalable hiring solutions, high-volume recruitment and dedicated talent acquisition assistance.",
  },
  {
    icon: Shield,
    title: "Visa & Immigration Assistance",
    description:
      "Recruitment-related documentation and work-permit guidance to help candidates understand the requirements for overseas employment.",
  },
  {
    icon: Users,
    title: "Bulk Recruitment",
    description:
      "High-volume recruitment solutions for organisations hiring multiple candidates across locations, departments and operational roles.",
  },
  {
    icon: Search,
    title: "Candidate Sourcing & Screening",
    description:
      "Targeted talent sourcing, profile evaluation and initial screening to identify candidates aligned with defined job requirements.",
  },
  {
    icon: UserCheck,
    title: "Candidate Assessment",
    description:
      "Structured candidate evaluation based on qualifications, experience, technical capabilities, role requirements and employer expectations.",
  },
  {
    icon: Globe2,
    title: "International Recruitment",
    description:
      "Cross-border recruitment support for employers and professionals seeking talent and career opportunities across international markets.",
  },
  {
    icon: Building2,
    title: "Employer Recruitment Solutions",
    description:
      "Customised hiring support designed around organisational requirements, workforce planning, job profiles and recruitment objectives.",
  },
  {
    icon: Headphones,
    title: "Recruitment Support & Coordination",
    description:
      "Professional coordination throughout the recruitment journey, including communication, interview scheduling and candidate-employer support.",
  },
];

function Services() {
  return (
    <main className="services-page">

      {/* SERVICES INTRO */}

      <section className="services-main">

        <div className="services-heading">

          <p className="services-eyebrow">
            WHAT WE OFFER
          </p>

          <h1>
            Our Recruitment Services
          </h1>

          <p className="services-intro">
            RAGAS CAREER WORLD provides professional recruitment
            solutions for employers and job seekers across domestic
            and international markets. Our services are designed to
            support organisations at different stages of their
            hiring journey while helping qualified professionals
            discover relevant career opportunities.
          </p>

        </div>


        {/* SERVICES GRID */}

        <div className="services-grid">

          {services.map((service, index) => {

            const Icon = service.icon;

            return (
              <article
                className="service-card"
                key={index}
              >

                <div className="service-icon">
                  <Icon
                    size={20}
                    strokeWidth={1.8}
                  />
                </div>

                <div className="service-content">

                  <h3>
                    {service.title}
                  </h3>

                  <p>
                    {service.description}
                  </p>

                </div>

              </article>
            );

          })}

        </div>


        {/* RECRUITMENT SUPPORT */}

        <section className="services-support">

          <div className="services-support-content">

            <p className="services-eyebrow">
              RECRUITMENT SUPPORT
            </p>

            <h2>
              Supporting Employers & Job Seekers
            </h2>

            <p>
              Our recruitment services are built to create a
              structured connection between employers and qualified
              professionals. We focus on understanding requirements,
              identifying suitable profiles and supporting the
              recruitment process from initial sourcing through
              candidate coordination.
            </p>

            <p>
              For international opportunities, recruitment support
              can also include documentation coordination and
              guidance related to overseas employment requirements.
            </p>

          </div>

        </section>


        {/* EMPLOYER / JOB SEEKER */}

        <section className="services-audience">

          <div className="services-audience-card">

            <div className="service-icon">
              <Building2
                size={20}
                strokeWidth={1.8}
              />
            </div>

            <h3>
              For Employers
            </h3>

            <p>
              Access structured recruitment support to identify,
              screen and connect with qualified professionals for
              your workforce requirements.
            </p>

            <ul>
              <li>Talent sourcing and screening</li>
              <li>Permanent and contract staffing</li>
              <li>Executive and specialised recruitment</li>
              <li>Bulk hiring support</li>
              <li>International recruitment assistance</li>
            </ul>

          </div>


          <div className="services-audience-card">

            <div className="service-icon">
              <UserCheck
                size={20}
                strokeWidth={1.8}
              />
            </div>

            <h3>
              For Job Seekers
            </h3>

            <p>
              Explore relevant career opportunities and receive
              professional support throughout the recruitment
              journey.
            </p>

            <ul>
              <li>Access to domestic opportunities</li>
              <li>International job opportunities</li>
              <li>Candidate profile support</li>
              <li>Recruitment process guidance</li>
              <li>Visa and documentation guidance</li>
            </ul>

          </div>

        </section>


        {/* PROCESS */}

        <section className="services-process">

          <div className="services-process-heading">

            <p className="services-eyebrow">
              HOW WE WORK
            </p>

            <h2>
              A Structured Recruitment Process
            </h2>

          </div>


          <div className="services-process-grid">

            <div className="services-process-item">
              <strong>01</strong>
              <h3>Understand</h3>
              <p>
                We understand the employer's workforce
                requirements or the candidate's career objectives.
              </p>
            </div>

            <div className="services-process-item">
              <strong>02</strong>
              <h3>Source</h3>
              <p>
                Suitable candidates and opportunities are
                identified according to defined requirements.
              </p>
            </div>

            <div className="services-process-item">
              <strong>03</strong>
              <h3>Screen</h3>
              <p>
                Profiles are reviewed against relevant
                qualifications, skills and experience.
              </p>
            </div>

            <div className="services-process-item">
              <strong>04</strong>
              <h3>Connect</h3>
              <p>
                Employers and suitable candidates are connected
                for the next stage of the recruitment process.
              </p>
            </div>

            <div className="services-process-item">
              <strong>05</strong>
              <h3>Coordinate</h3>
              <p>
                Interviews, communication and recruitment
                requirements are coordinated professionally.
              </p>
            </div>

            <div className="services-process-item">
              <strong>06</strong>
              <h3>Support</h3>
              <p>
                Ongoing recruitment support is provided through
                the hiring journey.
              </p>
            </div>

          </div>

        </section>


        {/* FINAL CTA */}

        <section className="services-cta">

          <p className="services-eyebrow">
            WORK WITH US
          </p>

          <h2>
            Looking for the Right Talent or Opportunity?
          </h2>

          <p>
            Connect with RAGAS CAREER WORLD for professional
            recruitment support across domestic and international
            markets.
          </p>

          <div className="services-cta-actions">

            <Link
              to="/current-openings"
              className="services-cta-primary"
            >
              Explore Jobs
            </Link>

            <Link
              to="/contact"
              className="services-cta-secondary"
            >
              Contact Us
            </Link>

          </div>

        </section>

      </section>

    </main>
  );
}

export default Services;