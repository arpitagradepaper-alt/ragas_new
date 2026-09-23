import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  Search,
  MapPin,
  BriefcaseBusiness,
  Building2,
  ArrowRight,
} from "lucide-react";

import HomeServices from "./HomeServices";
import InternationalJobs from "./InternationalJobs";
import DomesticJobs from "./DomesticJobs";
import CurrentOpenings from "./CurrentOpenings";
import Employers from "./Employers";
import JobSeekers from "./JobSeekers";
import PostAJob from "./PostAJob";
import PartnerWithUs from "./PartnerWithUs";
import Contact from "./Contact";

import homeRecruitment from "../assets/home-recruitment.png";

import "./Home.css";

export function Home() {
  const navigate = useNavigate();

  const isUserLoggedIn =
    localStorage.getItem("ragasUserLoggedIn") === "true" ||
    sessionStorage.getItem("ragasUserLoggedIn") === "true";

  /* =========================================================
      HASH / SECTION SCROLL
  ========================================================= */

  useEffect(() => {
    const sectionId = window.location.hash.slice(1);

    if (!sectionId) return undefined;

    const timer = window.setTimeout(() => {
      const section = document.getElementById(sectionId);
      const navbar = document.querySelector(".navbar");

      if (!section) return;

      const navbarHeight = navbar
        ? navbar.getBoundingClientRect().height
        : 0;

      window.scrollTo({
        top: Math.max(
          0,
          section.getBoundingClientRect().top +
            window.scrollY -
            navbarHeight
        ),
        behavior: "smooth",
      });
    }, 150);

    return () => window.clearTimeout(timer);
  }, []);

  /* =========================================================
      ACTIVE HOME SECTION TRACKING
  ========================================================= */

  useEffect(() => {
    const sections = document.querySelectorAll(
      ".home-page > .page-slide"
    );

    if (!sections.length) return undefined;

    const handleScroll = () => {
      let closestSection = null;
      let closestDistance = Infinity;

      sections.forEach((section) => {
        const distance = Math.abs(
          section.getBoundingClientRect().top - 80
        );

        if (distance < closestDistance) {
          closestDistance = distance;
          closestSection = section;
        }
      });

      if (closestSection) {
        window.dispatchEvent(
          new CustomEvent("homeSectionChange", {
            detail: closestSection.id,
          })
        );
      }
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /* =========================================================
      SEARCH
  ========================================================= */

  const handleSearch = () => {
    navigate("/current-openings");
  };

  /* =========================================================
      LOGIN REQUIRED ACTION
  ========================================================= */

  const handleProtectedAction = (path) => {
    if (isUserLoggedIn) {
      navigate(path);
    } else {
      navigate("/user-login");
    }
  };

  return (
    <main className="home-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section
        id="home"
        className="page-slide home-home-slide"
      >
        <div className="home-hero">

          <div className="hero-background-glow"></div>

          <div className="hero-layout">

            {/* HERO CONTENT */}

            <div className="home-hero-content">

              <div className="hero-eyebrow-wrap">
                <span className="hero-eyebrow-line"></span>

                <p className="hero-eyebrow">
                  GLOBAL & PAN-INDIA RECRUITMENT
                </p>
              </div>

              <h1>
                Connecting employers with{" "}
                <span>qualified talent, worldwide.</span>
              </h1>

              <p className="hero-text">
                International and domestic recruitment across
                40+ industries — for job seekers building careers
                and employers hiring verified talent.
              </p>

              <div className="hero-actions">
                <button
                  type="button"
                  className="hero-primary-action"
                  onClick={handleSearch}
                >
                  Explore open roles
                  <ArrowRight size={16} />
                </button>
                <button
                  type="button"
                  className="hero-secondary-action"
                  onClick={() => navigate("/employers")}
                >
                  Hire with RAGAS
                </button>
              </div>

              {/* SEARCH */}

              <div className="job-search">

                <div className="search-field">
                  <BriefcaseBusiness size={17} />

                  <input
                    type="text"
                    placeholder="Job title or keyword"
                  />
                </div>

                <div className="search-field">
                  <MapPin size={17} />

                  <input
                    type="text"
                    placeholder="Country or Location"
                  />
                </div>

                <div className="search-field">
                  <Building2 size={17} />

                  <input
                    type="text"
                    placeholder="Industry"
                  />
                </div>

                <button
                  type="button"
                  className="search-button"
                  onClick={handleSearch}
                >
                  <Search size={16} />
                  <span>Search Jobs</span>
                </button>

              </div>

              {/* TRUST STATS */}

              <div className="hero-stats">

                <div className="hero-stat">
                  <strong>40+</strong>
                  <span>Industries</span>
                </div>

                <div className="hero-stat-divider"></div>

                <div className="hero-stat">
                  <strong>18</strong>
                  <span>Countries Served</span>
                </div>

                <div className="hero-stat-divider"></div>

                <div className="hero-stat">
                  <strong>1000+</strong>
                  <span>Successful Placements</span>
                </div>

              </div>

            </div>

            {/* HERO VISUAL */}

            <div className="hero-visual">

              <div className="hero-decoration"></div>

              <div className="hero-image-frame">

                <div className="hero-image-inner">

                  <img
                    src={homeRecruitment}
                    alt="Global and Pan-India Recruitment"
                  />

                  <div className="hero-image-overlay"></div>

                </div>

                {/* IMAGE LABEL */}

                <div className="hero-image-label">
                  <span className="hero-label-dot"></span>

                  <span>
                    Global Recruitment
                  </span>
                </div>

              </div>

              {/* PLACEMENT BADGE */}

              <div className="hero-image-badge">

                <div className="badge-icon">
                  <ArrowRight size={17} />
                </div>

                <div>
                  <strong>1000+</strong>

                  <span>
                    Successful Placements
                  </span>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          CURRENT OPENINGS
          LOGIN USERS ONLY
      ===================================================== */}

      {isUserLoggedIn && (
        <section
          id="current-openings"
          className="page-slide home-existing-section"
        >
          <CurrentOpenings />
        </section>
      )}


      {/* =====================================================
          SERVICES
      ===================================================== */}

      <section
        id="services"
        className="page-slide home-existing-section"
      >
        <HomeServices />
      </section>


      {/* =====================================================
          INTERNATIONAL JOBS
      ===================================================== */}

      <section
        id="international-jobs"
        className="page-slide home-existing-section"
      >
        <InternationalJobs featuredOnly />
      </section>


      {/* =====================================================
          DOMESTIC JOBS
      ===================================================== */}

      <section
        id="domestic-jobs"
        className="page-slide home-existing-section"
      >
        <DomesticJobs featuredOnly />
      </section>


      {/* =====================================================
          EMPLOYERS
      ===================================================== */}

      <section
        id="employers"
        className="page-slide home-existing-section"
      >
        <Employers />
      </section>


      {/* =====================================================
          JOB SEEKERS
      ===================================================== */}

      <section
        id="job-seekers"
        className="page-slide home-existing-section"
      >
        <JobSeekers featuredOnly />
      </section>


      {/* =====================================================
          POST A JOB
          LOGIN USERS ONLY
      ===================================================== */}

      {isUserLoggedIn && (
        <section
          id="post-a-job"
          className="page-slide home-existing-section"
        >
          <PostAJob />
        </section>
      )}


      {/* =====================================================
          PARTNER WITH US
      ===================================================== */}

      <section
        id="partner-with-us"
        className="page-slide home-existing-section"
      >
        <PartnerWithUs />
      </section>


      {/* =====================================================
          CONTACT
      ===================================================== */}

      <section
        id="contact"
        className="page-slide home-existing-section"
      >
        <Contact />
      </section>

    </main>
  );
}

export default Home;