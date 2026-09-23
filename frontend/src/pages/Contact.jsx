import { useState } from "react";
import "./Contact.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setStatus("Sending...");

    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setStatus("Message sent successfully!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
        });
      } else {
        setStatus(data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error(error);
      setStatus("Unable to connect to server.");
    }
  };

  return (
    <main className="contact-page">
      <section className="contact-main">

        <div className="contact-left">
          <p className="contact-eyebrow">GET IN TOUCH</p>
          <h1>Contact Us</h1>

          <form className="contact-form" onSubmit={handleSubmit}>

            <div className="contact-field">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="contact-field">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="contact-field">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="contact-field">
              <label>Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="contact-submit">
              Send Message
            </button>

            {status && <p className="contact-status">{status}</p>}

          </form>
        </div>

        <div className="contact-right">
          <div className="contact-map">
            <iframe
              src="https://www.google.com/maps?q=India&output=embed"
              title="RAGAS CAREER WORLD Office Location"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="head-office">
            <strong>1885, Ground Floor, South End C Cross Road, 28th Main Road, E End B Main Rd, near Kabab Magic, Jayanagara 11th Block, Jayanagar, Bengaluru, Karnataka 56004</strong>
            <span>RAGAS CAREER WORLD</span>
          </div>

          <div className="contact-actions">
            <button type="button" className="phone-email-btn">
              Phone / Email
            </button>

            <button type="button" className="whatsapp-btn">
              WhatsApp Chat
            </button>
          </div>
        </div>

      </section>
    </main>
  );
}

export default Contact;