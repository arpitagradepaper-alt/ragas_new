import founderCeo from "../assets/founder-ceo.png";
import headRecruitment from "../assets/head-of-recruitment.png";
import headCompliance from "../assets/head-of-compliance.png";
import "./HomeAbout.css";

const stats = [
  ["2010", "Founded"],
  ["40+", "Industries Served"],
  ["18", "Countries"],
  ["1000+", "Placements"],
];

const leaders = [
  {
    role: "Founder & CEO",
    text: "Overall strategy, business growth and global partnerships",
    image: founderCeo,
  },
  {
    role: "Head of Recruitment",
    text: "International and domestic recruitment delivery",
    image: headRecruitment,
  },
  {
    role: "Head of Compliance",
    text: "Documentation, compliance and partner verification",
    image: headCompliance,
  },
];

function HomeAbout() {
  return (
    <div className="home-about">
      <section className="home-about-intro">
        <p className="home-about-eyebrow">ABOUT RAGAS CAREER WORLD</p>
        <h2>Connecting Talent With Opportunity</h2>
        <p>
          RAGAS CAREER WORLD is a professional recruitment and talent
          solutions organisation specialising in international and domestic
          recruitment. We connect qualified professionals with employers and
          genuine career opportunities across diverse industries and markets.
        </p>
        <p>
          Our approach combines structured recruitment, professional candidate
          support, employer coordination and reliable hiring processes to
          create meaningful connections between talent and organisations.
        </p>
      </section>

      <div className="home-about-stats">
        {stats.map(([number, label]) => (
          <div className="home-about-stat" key={label}>
            <strong>{number}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>

      <section className="home-about-leadership">
        <p className="home-about-eyebrow">LEADERSHIP</p>
        <h2>Experienced Leadership</h2>
        <p className="home-about-leadership-intro">
          Our leadership team brings together strategic direction, recruitment
          expertise and compliance-focused support to deliver professional
          recruitment services.
        </p>

        <div className="home-about-leaders">
          {leaders.map((leader) => (
            <article className="home-about-leader" key={leader.role}>
              <div className="home-about-leader-avatar">
                <img src={leader.image} alt={leader.role} />
              </div>
              <div>
                <h3>{leader.role}</h3>
                <p>{leader.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomeAbout;
