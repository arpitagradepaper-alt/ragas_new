import {
  Briefcase,
  Settings,
  BarChart3,
  Plane,
  Shield,
  Search,
} from "lucide-react";
import "./HomeServices.css";

const services = [
  {
    icon: Briefcase,
    title: "Permanent Staffing",
    description: "End-to-end recruitment support for full-time positions.",
  },
  {
    icon: Settings,
    title: "Contract Staffing",
    description: "Flexible workforce solutions for temporary and project roles.",
  },
  {
    icon: BarChart3,
    title: "Executive Search",
    description: "Confidential recruitment for leadership and senior positions.",
  },
  {
    icon: Plane,
    title: "Overseas Placement",
    description: "Connecting qualified professionals with global opportunities.",
  },
  {
    icon: Shield,
    title: "Visa Assistance",
    description: "Documentation and work-permit guidance for overseas employment.",
  },
  {
    icon: Search,
    title: "Candidate Sourcing",
    description: "Targeted talent sourcing and screening for defined requirements.",
  },
];

function HomeServices() {
  return (
    <div className="home-services">
      <div className="home-services-heading">
        <p className="home-services-eyebrow">WHAT WE OFFER</p>
        <h2>Our Recruitment Services</h2>
        <p>
          Professional recruitment solutions for employers and job seekers
          across domestic and international markets.
        </p>
      </div>

      <div className="home-services-grid">
        {services.map(({ icon: Icon, title, description }) => (
          <article className="home-service-card" key={title}>
            <div className="home-service-icon">
              <Icon size={19} strokeWidth={1.8} />
            </div>
            <div>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default HomeServices;
