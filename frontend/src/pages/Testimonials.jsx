import "./Testimonials.css";

import testimonialClient1 from "../assets/testimonial-client-1.png";
import testimonialClient2 from "../assets/testimonial-client-2.png";
import testimonialClient3 from "../assets/testimonial-client-3.png";

const testimonials = [
  {
    rating: "★★★★★",
    quote:
      '"RAGAS handled my visa paperwork end to end. I focused on interviews, they handled the rest."',
    name: "Amit R.",
    role: "Candidate — Placed in Dubai",
    image: testimonialClient1,
  },
  {
    rating: "★★★★★",
    quote:
      '"We filled 20 IT roles in under a month through their partner network."',
    name: "TechNova Pvt Ltd",
    role: "Employer",
    image: testimonialClient2,
  },
  {
    rating: "★★★★☆",
    quote:
      '"Clear communication at every step, even outside office hours via the chatbot."',
    name: "Fatima K.",
    role: "Candidate — Placed in Doha",
    image: testimonialClient3,
  },
];

function Testimonials() {
  return (
    <main className="testimonials-page">

      <section className="testimonials-main">

        <div className="testimonials-heading">
          <p className="testimonials-eyebrow">
            SUCCESS STORIES
          </p>

          <h1>
            Testimonials
          </h1>

          <p className="testimonials-subtitle">
            Employer and candidate stories — video testimonials include
            captions &amp; transcripts.
          </p>
        </div>

        <div className="testimonials-grid">

          {testimonials.map((item) => (
            <article
              className="testimonial-card"
              key={item.name}
            >

              <div className="testimonial-rating">
                {item.rating}
              </div>

              <p className="testimonial-quote">
                {item.quote}
              </p>

              <div className="testimonial-person">

                <div className="person-avatar">
                  <img
                    src={item.image}
                    alt={`${item.name} testimonial`}
                  />
                </div>

                <div className="person-details">
                  <strong>
                    {item.name}
                  </strong>

                  <span>
                    {item.role}
                  </span>
                </div>

              </div>

            </article>
          ))}

        </div>

        <div className="video-testimonial">

          <div className="video-box">
            <span>▶</span>
          </div>

          <div className="video-info">
            <h3>
              Video testimonial — with captions
            </h3>

            <p>
              Full transcript available beneath every video for
              screen-reader users.
            </p>
          </div>

        </div>

      </section>

    </main>
  );
}

export default Testimonials;