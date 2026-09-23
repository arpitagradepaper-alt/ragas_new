import hiringTrends from "../assets/hiring-trends-2026.png";
import resumeNotice from "../assets/resume-recruiters-notice.png";
import visaRules from "../assets/visa-work-permit-rules.png";
import itHiring from "../assets/it-hiring-pan-india.png";
import videoInterview from "../assets/video-interview-checklist.png";
import canadaExpress from "../assets/canada-express-entry-2026.png";

import "./Blog.css";

const blogs = [
  {
    category: "Recruitment Trends",
    title: "5 Hiring Trends Shaping 2026",
    image: hiringTrends,
  },
  {
    category: "Career Tips",
    title: "How to Write a Resume Recruiters Notice",
    image: resumeNotice,
  },
  {
    category: "Visa Updates",
    title: "Gulf Work-Permit Rules — What’s Changed",
    image: visaRules,
  },
  {
    category: "Industry News",
    title: "IT Hiring Rebounds Across PAN India",
    image: itHiring,
  },
  {
    category: "Career Tips",
    title: "Acing a Video Interview — A Checklist",
    image: videoInterview,
  },
  {
    category: "Visa Updates",
    title: "Canada Express Entry: 2026 Overview",
    image: canadaExpress,
  },
];

function Blog() {
  return (
    <main className="blog-page">
      <section className="blog-main">

        <div className="blog-heading">
          <h1>Blog</h1>
        </div>

        <div className="blog-grid">

          {blogs.map((blog) => (
            <article
              className="blog-card"
              key={blog.title}
            >

              <div className="blog-image">
                <img
                  src={blog.image}
                  alt={blog.title}
                />
              </div>

              <div className="blog-card-content">
                <p>{blog.category}</p>

                <h3>{blog.title}</h3>
              </div>

            </article>
          ))}

        </div>

      </section>
    </main>
  );
}

export default Blog;