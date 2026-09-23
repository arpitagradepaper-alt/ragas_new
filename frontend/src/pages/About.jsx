import { Link } from "react-router-dom";

import "./About.css";

import {
  ArrowRight,
  Check,
  Globe2,
  Target,
  Users,
  ShieldCheck,
} from "lucide-react";

import founderCeo from "../assets/founder-ceo.png";
import headRecruitment from "../assets/head-of-recruitment.png";
import headCompliance from "../assets/head-of-compliance.png";

/* =========================================================
   DATA
========================================================= */

const industries = [
  "IT & Software",
  "Banking & Financial Services",
  "Aviation & Airports",
  "Hospitality & Hotels",
  "Healthcare & Hospitals",
  "Manufacturing",
  "Education & Training",
  "Automotive",
  "Food & Beverage",
  "Retail & E-commerce",
  "Logistics & Transportation",
  "Engineering Services",
];

const approach = [
  {
    number: "01",
    title: "Understand",
    text: "We understand the requirement, profile and career objective before beginning the recruitment process.",
    icon: Target,
  },
  {
    number: "02",
    title: "Identify",
    text: "We identify suitable professionals and opportunities based on defined requirements.",
    icon: Users,
  },
  {
    number: "03",
    title: "Connect",
    text: "We create a clear connection between qualified talent and employers.",
    icon: Globe2,
  },
  {
    number: "04",
    title: "Support",
    text: "We maintain communication and coordination throughout the recruitment journey.",
    icon: ShieldCheck,
  },
];

const journey = [
  {
    year: "2010",
    tag: "RCW / EST",
    title: "Foundation",
    text: "RAGAS CAREER WORLD begins its journey with a focus on professional recruitment services.",
  },
  {
    year: "GROWTH",
    tag: "CAPABILITY",
    title: "Expanding Recruitment",
    text: "Recruitment capabilities grow across multiple industries and professional hiring requirements.",
  },
  {
    year: "GLOBAL",
    tag: "CROSS-BORDER",
    title: "International Opportunities",
    text: "The recruitment network develops to support international career and workforce opportunities.",
  },
  {
    year: "TODAY",
    tag: "NETWORK",
    title: "40+ Industries",
    text: "Continuing to connect employers and talent across domestic and international markets.",
  },
];

/* =========================================================
   ABOUT PAGE
========================================================= */

function About() {
  return (
    <main className="about-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="about-hero">

        <div className="about-hero-grid"></div>
        <div className="about-hero-glow"></div>

        <div className="about-container about-hero-inner">

          <div className="about-hero-content">

            <div className="about-eyebrow">
              <span className="eyebrow-dot"></span>
              ABOUT RAGAS CAREER WORLD
            </div>

            <h1>
              Connecting Talent
              <span> With Opportunity.</span>
            </h1>

            <p className="about-hero-description">
              RAGAS CAREER WORLD is a professional recruitment and talent
              solutions organisation connecting qualified professionals with
              employers and genuine career opportunities across domestic and
              international markets.
            </p>

            <div className="about-hero-actions">

              <Link
                to="/current-openings"
                className="about-btn about-btn-primary"
              >
                <span>Explore Opportunities</span>
                <span className="about-btn-icon">
                  <ArrowRight size={16} />
                </span>
              </Link>

              <Link
                to="/contact"
                className="about-btn about-btn-secondary"
              >
                Contact Us
              </Link>

            </div>

          </div>

          {/* HERO VISUAL */}

          <div className="about-hero-visual">

            <div className="hero-orbit hero-orbit-one"></div>
            <div className="hero-orbit hero-orbit-two"></div>

            <div className="hero-main-card">

              <div className="hero-card-top">
                <span className="hero-status">
                  <span></span>
                  GLOBAL RECRUITMENT
                </span>

                <span className="hero-code">
                  RCW / 2026
                </span>
              </div>

              <div className="hero-card-center">

                <span className="hero-card-label">
                  CONNECTING
                </span>

                <div className="hero-card-number">
                  20<span>+</span>
                </div>

                <p>
                  Countries connected through our recruitment network.
                </p>

              </div>

              <div className="hero-card-bottom">

                <span>INDIA</span>

                <div className="hero-connection">
                  <span></span>
                  <div></div>
                  <span></span>
                </div>

                <span>GLOBAL</span>

              </div>

            </div>

            <div className="hero-floating-card">

              <div className="floating-icon">
                <Globe2 size={21} />
              </div>

              <div>
                <strong>People First</strong>
                <p>Meaningful connections.</p>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          WHO WE ARE
      ===================================================== */}

      <section className="about-section who-section">

        <div className="about-container">

          <div className="who-layout">

            <div className="who-intro">

              <div className="about-eyebrow">
                <span className="eyebrow-dot"></span>
                WHO WE ARE
              </div>

              <h2>
                Recruitment Built
                <span> Around People.</span>
              </h2>

              <div className="who-highlight">

                <span className="highlight-line"></span>

                <p>
                  Successful recruitment starts with understanding people,
                  organisations, skills and career goals.
                </p>

              </div>

            </div>

            <div className="who-content">

              <div className="who-content-number">
                01
              </div>

              <p>
                We support job seekers and employers with professional
                recruitment services, clear communication and structured
                coordination throughout the hiring journey.
              </p>

              <div className="who-divider"></div>

              <p>
                Our focus is not simply on filling positions. We aim to create
                meaningful connections between qualified talent and
                organisations looking for the right people.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          PURPOSE
      ===================================================== */}

      <section className="purpose-section">

        <div className="about-container">

          <div className="purpose-header">

            <div className="about-eyebrow">
              <span className="eyebrow-dot"></span>
              OUR PURPOSE
            </div>

            <h2>
              Creating connections
              <span> that matter.</span>
            </h2>

          </div>


          <div className="purpose-grid">

            {/* MISSION */}

            <article className="purpose-card">

              <div className="purpose-card-number">
                01
              </div>

              <div className="purpose-card-top">
                <span>OUR MISSION</span>
                <small>PHASE / 01</small>
              </div>

              <div className="purpose-card-content">

                <h3>
                  Connecting Employers With Qualified Talent
                </h3>

                <p>
                  Our mission is to connect employers with qualified talent
                  and job seekers with genuine career opportunities through
                  professional, transparent and structured recruitment
                  services.
                </p>

              </div>

              <div className="purpose-card-line"></div>

            </article>


            {/* VISION */}

            <article className="purpose-card">

              <div className="purpose-card-number">
                02
              </div>

              <div className="purpose-card-top">
                <span>OUR VISION</span>
                <small>PHASE / 02</small>
              </div>

              <div className="purpose-card-content">

                <h3>
                  Building Trusted Recruitment Connections
                </h3>

                <p>
                  Our vision is to become a trusted recruitment partner across
                  international and domestic markets by creating reliable
                  connections between organisations and talented professionals.
                </p>

              </div>

              <div className="purpose-card-line"></div>

            </article>

          </div>

        </div>

      </section>


      {/* =====================================================
          APPROACH
      ===================================================== */}

      <section className="about-section approach-section">

        <div className="about-container">

          <div className="approach-header">

            <div>

              <div className="about-eyebrow">
                <span className="eyebrow-dot"></span>
                OUR APPROACH
              </div>

              <h2>
                Simple process.
                <span> Professional results.</span>
              </h2>

            </div>

            <p>
              Our recruitment approach is designed to keep the journey clear,
              structured and focused from the initial requirement through
              successful joining.
            </p>

          </div>


          <div className="approach-line"></div>


          <div className="approach-grid">

            {approach.map((item) => {

              const Icon = item.icon;

              return (
                <article
                  className="approach-card"
                  key={item.number}
                >

                  <div className="approach-card-top">

                    <span className="approach-number">
                      {item.number}
                    </span>

                    <div className="approach-icon">
                      <Icon size={19} />
                    </div>

                  </div>

                  <div className="approach-card-content">

                    <h3>
                      {item.title}
                    </h3>

                    <p>
                      {item.text}
                    </p>

                  </div>

                  <div className="approach-card-footer">

                    <span>
                      EXECUTION
                    </span>

                    <ArrowRight size={15} />

                  </div>

                </article>
              );

            })}

          </div>

        </div>

      </section>


      {/* =====================================================
          GLOBAL REACH
      ===================================================== */}

      <section className="reach-section">

        <div className="reach-background"></div>

        <div className="about-container reach-inner">

          <div className="reach-content">

            <div className="about-eyebrow reach-eyebrow">
              <span className="eyebrow-dot"></span>
              OUR REACH
            </div>

            <h2>
              Across industries.
              <span> Across markets.</span>
            </h2>

            <p>
              RAGAS CAREER WORLD supports recruitment requirements across
              diverse industries, helping employers and professionals connect
              across domestic and international markets.
            </p>

            <div className="reach-metric">

              <div className="reach-metric-number">
                40<span>+</span>
              </div>

              <div>
                <strong>Industries Covered</strong>
                <span>Domestic & International</span>
              </div>

            </div>

          </div>


          <div className="industries-panel">

            <div className="industries-header">

              <span>SECTORS & DOMAINS</span>

              <small>
                INDEX: 01 — 12
              </small>

            </div>

            <div className="industries-grid">

              {industries.map((industry, index) => (

                <div
                  className="industry-item"
                  key={industry}
                >

                  <span className="industry-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="industry-name">
                    {industry}
                  </span>

                  <span className="industry-check">
                    <Check size={11} />
                  </span>

                </div>

              ))}

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          JOURNEY
      ===================================================== */}

      <section className="about-section journey-section">

        <div className="about-container">

          <div className="journey-header">

            <div className="about-eyebrow">
              <span className="eyebrow-dot"></span>
              OUR JOURNEY
            </div>

            <h2>
              Growing with employers
              <span> & job seekers.</span>
            </h2>

          </div>


          <div className="journey-track">

            <div className="journey-line"></div>

            {journey.map((item, index) => (

              <div
                className="journey-item"
                key={item.year}
              >

                <div className="journey-marker">

                  <span className="journey-dot"></span>

                  <span className="journey-year">
                    {item.year}
                  </span>

                </div>

                <div className="journey-card">

                  <div className="journey-card-header">

                    <h3>
                      {item.title}
                    </h3>

                    <span>
                      {item.tag}
                    </span>

                  </div>

                  <p>
                    {item.text}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="about-cta">

        <div className="cta-grid"></div>

        <div className="about-container cta-inner">

          <div className="cta-content">

            <div className="about-eyebrow cta-eyebrow">
              <span className="eyebrow-dot"></span>
              LET'S CONNECT
            </div>

            <h2>
              Ready to build the
              <span> right connection?</span>
            </h2>

            <p>
              Whether you are an employer looking for qualified talent or a
              professional exploring your next opportunity, we are here to
              support your recruitment journey.
            </p>

          </div>


          <div className="cta-actions">

            <Link
              to="/current-openings"
              className="cta-primary"
            >
              <span>Explore Opportunities</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              to="/contact"
              className="cta-secondary"
            >
              Contact Us
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}

export default About;