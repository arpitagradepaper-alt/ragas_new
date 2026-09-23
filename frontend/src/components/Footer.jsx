import {
  MapPin,
  Mail,
  ArrowUpRight,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  FaLinkedinIn,
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";

import "./Footer.css";

function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    const element = document.getElementById(id);

    const standaloneRoutes = {
      "recruitment-process": "/recruitment-process",
      "visa-immigration": "/visa-support",
    };

    if (standaloneRoutes[id]) {
      navigate(standaloneRoutes[id]);
      return;
    }

    if (location.pathname === "/" && element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return;
    }

    const routeBySection = {
      home: "/",
      about: "/about",
      services: "/services",
      "international-jobs": "/international-jobs",
      "domestic-jobs": "/domestic-jobs",
      industries: "/industries",
      "current-openings": "/current-openings",
      employers: "/employers",
      "job-seekers": "/job-seekers",
      "upload-resume": "/upload-resume",
      "post-a-job": "/post-a-job",
      "partner-with-us": "/partner-with-us",
      blog: "/blog",
      testimonials: "/testimonials",
      contact: "/contact",
      careers: "/careers",
    };

    if (routeBySection[id]) {
      navigate(routeBySection[id]);
    }
  };

  return (
    <footer className="site-footer">

      {/* Main Footer */}
      <div className="footer-main">

        {/* Brand */}
        <div className="footer-brand">

          <div className="footer-logo">
            <span className="footer-logo-mark">R</span>

            <div>
              <strong>RAGAS</strong>
              <span>CAREER WORLD</span>
            </div>
          </div>

          <p className="footer-description">
            Connecting employers with qualified talent across India and
            international markets through trusted recruitment solutions.
          </p>

          {/* Social Icons */}
          <div className="footer-social">

            <a
              href="#"
              aria-label="LinkedIn"
              className="linkedin"
            >
              <FaLinkedinIn />
            </a>

            <a
              href="#"
              aria-label="Facebook"
              className="facebook"
            >
              <FaFacebookF />
            </a>

            <a
              href="#"
              aria-label="Instagram"
              className="instagram"
            >
              <FaInstagram />
            </a>

            <a
              href="#"
              aria-label="WhatsApp"
              className="whatsapp"
            >
              <FaWhatsapp />
            </a>

          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-column">
          <h3>Quick Links</h3>

          <button onClick={() => scrollToSection("home")}>
            Home
          </button>

          <button onClick={() => scrollToSection("about")}>
            About Us
          </button>

          <button onClick={() => scrollToSection("services")}>
            Services
          </button>

          <button onClick={() => scrollToSection("international-jobs")}>
            International Jobs
          </button>

          <button onClick={() => scrollToSection("domestic-jobs")}>
            Domestic Jobs
          </button>

          <button onClick={() => scrollToSection("industries")}>
            Industries
          </button>

          <button onClick={() => scrollToSection("contact")}>
            Contact Us
          </button>
        </div>

        
        {/* Employers */}
        <div className="footer-column">
          <h3>For Employers</h3>

         

          <button onClick={() => scrollToSection("post-a-job")}>
            Post a Job
          </button>

          <button onClick={() => scrollToSection("partner-with-us")}>
            Partner With Us
          </button>

          <button onClick={() => scrollToSection("recruitment-process")}>
            Recruitment Process
          </button>

          <button onClick={() => scrollToSection("contact")}>
            Request Hiring Support
          </button>
        </div>

        {/* Contact */}
        <div className="footer-column footer-contact">

          <h3>Contact Us</h3>

          <div className="footer-contact-item">
            <MapPin size={16} />

            <div>
              <strong>Corporate Address</strong>
              <span>
                1885, Ground Floor, South End C Cross Road, 28th Main Road,
                E End B Main Rd, near Kabab Magic, Jayanagara 11th Block,
                Jayanagar, Bengaluru, Karnataka 560041
              </span>
            </div>
          </div>

          <a
            href="mailto:ragascareerworld@gmail.com"
            className="footer-contact-item"
          >
          

            
          </a>

          <a
            href="mailto:hr@ragascarrerworld.com"
            className="footer-contact-item"
          >
            <Mail size={16} />

            <div>
              <strong>Corporate</strong>
              <span>hr@ragascarrerworld.com</span>
            </div>
          </a>

          <a
            href="https://wa.me/919999999999"
            target="_blank"
            rel="noreferrer"
            className="footer-whatsapp"
          >
            <FaWhatsapp size={17} />
            WhatsApp Us
            <ArrowUpRight size={14} />
          </a>

        </div>
      </div>

      {/* Bottom Footer */}
      <div className="footer-bottom">

        <div className="footer-bottom-left">
          <span>
            © {new Date().getFullYear()} RAGAS CAREER WORLD.
            All rights reserved.
          </span>
        </div>

        <div className="footer-legal">

          <button type="button">
            Privacy Policy
          </button>

          <button type="button">
            Terms & Conditions
          </button>

          <button type="button">
            Cookie Policy
          </button>

        </div>

      </div>

    </footer>
  );
}

export default Footer;
