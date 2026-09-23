import {
  MapPin,
  Briefcase,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import "./DomesticJobs.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

const states = [
  "Maharashtra",
  "Karnataka",
  "Delhi NCR",
  "Tamil Nadu",
  "Telangana",
  "Gujarat",
];



function FeaturedDomesticJobs({ onApply, onViewJobs }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDomesticJobs = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/jobs`
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to fetch jobs"
          );
        }

        const allJobs = result.data || [];

        const domesticJobs = allJobs.filter((job) => {
          const country = String(job.country || "")
            .trim()
            .toLowerCase();

          return country === "india";
        });

        setJobs(domesticJobs.slice(0, 4));
      } catch (error) {
        console.error(
          "Domestic Jobs Error:",
          error
        );

        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDomesticJobs();
  }, []);

  return (
    <div className="domestic-openings">

      <div className="domestic-section-header">

        <div>

          <p className="openings-eyebrow">
            FEATURED OPENINGS — MNCs, Startups & Government Projects
          </p>

          <h2>
            Current Domestic Opportunities
          </h2>

        </div>

        <button
          type="button"
          className="view-all-domestic"
          onClick={onViewJobs}
        >
          View All Jobs
          <ArrowRight size={16} />
        </button>

      </div>

      <div className="domestic-job-list">

        {loading ? (

          <div className="jobs-loading">
            Loading domestic jobs...
          </div>

        ) : jobs.length === 0 ? (

          <div className="jobs-empty">
            No domestic jobs available at the moment.
          </div>

        ) : (

          jobs.map((job) => (

            <div
              className="domestic-job-card"
              key={job._id}
            >

              <div className="domestic-job-info">

                <div className="domestic-job-icon">
                  <Briefcase
                    size={16}
                    strokeWidth={1.8}
                  />
                </div>

                <div>

                  <h3>
                    {job.jobTitle}
                  </h3>

                  <p>
                    {job.category || "General"}

                    <span>
                      •
                    </span>

                    {job.location}

                    {job.country
                      ? `, ${job.country}`
                      : ""}
                  </p>

                </div>

              </div>

              <div className="domestic-job-action">

                <span>
                  {job.jobType || "Full Time"}
                </span>

                <button
                  type="button"
                  onClick={() => onApply(job._id)}
                >
                  Apply
                  <ArrowRight size={14} />
                </button>

              </div>

            </div>

          ))

        )}

      </div>

    </div>
  );
}


function DomesticJobs({ featuredOnly = false }) {
  const navigate = useNavigate();

  const [domesticJobs, setDomesticJobs] =
    useState([]);

  const [locationLoading, setLocationLoading] =
    useState(true);

 

  useEffect(() => {
    const fetchDomesticJobs = async () => {
      try {
        setLocationLoading(true);

        const response = await fetch(
          `${API_BASE_URL}/api/jobs`
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to fetch jobs"
          );
        }

        const allJobs = result.data || [];

        // Only India jobs
        const jobs = allJobs.filter((job) => {
          const country = String(job.country || "")
            .trim()
            .toLowerCase();

          return country === "india";
        });

        setDomesticJobs(jobs);
      } catch (error) {
        console.error(
          "Domestic location count error:",
          error
        );

        setDomesticJobs([]);
      } finally {
        setLocationLoading(false);
      }
    };

    fetchDomesticJobs();
  }, []);

  

  const locationCounts = {};

  domesticJobs.forEach((job) => {
    const location = String(job.location || "")
      .trim()
      .toLowerCase();

    if (location) {
      locationCounts[location] =
        (locationCounts[location] || 0) + 1;
    }
  });

  
  const handleApply = (jobId) => {
    navigate(`/apply/${jobId}`);
  };

 

  const handleViewJobs = () => {
    navigate("/current-openings");
  };


  if (featuredOnly) {
    return (
      <main className="domestic-page featured-domestic-page">

        <section className="domestic-main">

          <FeaturedDomesticJobs
            onApply={handleApply}
            onViewJobs={handleViewJobs}
          />

        </section>

      </main>
    );
  }

  

  return (
    <main className="domestic-page">


      <section className="domestic-main">


        <div className="domestic-heading">

          <p className="domestic-eyebrow">
            PAN-INDIA RECRUITMENT
          </p>

          <h1>
            Domestic Jobs
          </h1>

          <p className="domestic-description">
            Explore career opportunities with employers across India.
            RAGAS CAREER WORLD connects qualified candidates with
            organisations across multiple industries, locations and
            experience levels through professional recruitment support.
          </p>

        </div>



        <div className="domestic-intro">

          <div className="domestic-intro-card">

            <span className="intro-number">
              01
            </span>

            <div>

              <h3>
                Opportunities Across India
              </h3>

              <p>
                Discover employment opportunities across major cities,
                industrial hubs and emerging business locations throughout
                India.
              </p>

            </div>

          </div>


          <div className="domestic-intro-card">

            <span className="intro-number">
              02
            </span>

            <div>

              <h3>
                Multiple Industries
              </h3>

              <p>
                Find roles across IT, banking, manufacturing, aviation,
                healthcare, hospitality, engineering, logistics and other
                growing sectors.
              </p>

            </div>

          </div>


          <div className="domestic-intro-card">

            <span className="intro-number">
              03
            </span>

            <div>

              <h3>
                Professional Recruitment Support
              </h3>

              <p>
                Our recruitment team supports candidates through profile
                screening, employer coordination, interviews and the
                selection process.
              </p>

            </div>

          </div>

        </div>


  

        <div className="domestic-section-header">

          <div>

            <p className="openings-eyebrow">
              TOP RECRUITMENT LOCATIONS
            </p>

            <h2>
              Explore Jobs by Location
            </h2>

          </div>

        </div>


        <div className="state-grid">

          {states.map((state) => {

            const count =
              locationCounts[
                state.toLowerCase()
              ] || 0;

            return (
              <div
                className="state-card"
                key={state}
              >

                <div className="state-icon">

                  <MapPin
                    size={17}
                    strokeWidth={1.8}
                  />

                </div>

                <div>

                  <h3>
                    {state}
                  </h3>

                  <span>

                    {locationLoading
                      ? "Loading..."
                      : `${count} openings`}

                  </span>

                </div>

              </div>
            );
          })}

        </div>



        <FeaturedDomesticJobs
          onApply={handleApply}
          onViewJobs={handleViewJobs}
        />


      
        <section className="domestic-industries">

          <div className="domestic-section-header">

            <div>

              <p className="openings-eyebrow">
                CAREER SECTORS
              </p>

              <h2>
                Recruitment Across Key Industries
              </h2>

            </div>

          </div>


          <div className="domestic-industry-grid">

            <span>
              Information Technology
            </span>

            <span>
              Banking & Financial Services
            </span>

            <span>
              Manufacturing
            </span>

            <span>
              Healthcare & Hospitals
            </span>

            <span>
              Aviation & Airports
            </span>

            <span>
              Construction & Engineering
            </span>

            <span>
              Hospitality & Hotels
            </span>

            <span>
              Logistics & Transportation
            </span>

            <span>
              Retail & E-commerce
            </span>

            <span>
              Pharmaceuticals
            </span>

            <span>
              Education & Training
            </span>

            <span>
              Business Services
            </span>

          </div>

        </section>



        <section className="domestic-support">

          <div className="domestic-section-header">

            <div>

              <p className="openings-eyebrow">
                CANDIDATE SUPPORT
              </p>

              <h2>
                Support Throughout Your Job Search
              </h2>

            </div>

          </div>


          <div className="domestic-support-grid">

            <div className="support-step">

              <span>
                01
              </span>

              <h3>
                Profile Registration
              </h3>

              <p>
                Register your professional profile and share your skills,
                experience and preferred job locations.
              </p>

            </div>


            <div className="support-step">

              <span>
                02
              </span>

              <h3>
                Profile Screening
              </h3>

              <p>
                Our recruitment team reviews your profile against suitable
                opportunities and employer requirements.
              </p>

            </div>


            <div className="support-step">

              <span>
                03
              </span>

              <h3>
                Interview Coordination
              </h3>

              <p>
                Shortlisted candidates receive support with employer
                communication and interview coordination.
              </p>

            </div>


            <div className="support-step">

              <span>
                04
              </span>

              <h3>
                Selection & Placement
              </h3>

              <p>
                Successful candidates are supported through the final
                selection and joining process.
              </p>

            </div>

          </div>

        </section>


     

        <section className="domestic-cta">

          <div>

            <p className="openings-eyebrow">
              FIND YOUR NEXT OPPORTUNITY
            </p>

            <h2>
              Ready to take the next step in your career?
            </h2>

            <p>
              Upload your resume and allow our recruitment team to connect
              your profile with suitable opportunities across India.
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/upload-resume")
            }
          >
            Upload Your Resume
            <ArrowRight size={16} />
          </button>

        </section>

      </section>

    </main>
  );
}

export default DomesticJobs;