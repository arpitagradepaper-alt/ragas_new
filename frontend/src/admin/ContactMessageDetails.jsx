import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Mail, Phone, Building2, User, Calendar, MessageSquare } from "lucide-react";
import "./ContactMessageDetails.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const API_URL = API_BASE_URL;

const ContactMessageDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${API_URL}/api/contact/${id}`, {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("ragasAdminToken") || ""
            }`,
          },
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to fetch contact details."
          );
        }

        setMessage(data.data);
      } catch (err) {
        console.error("Contact details error:", err);
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchMessage();
  }, [id]);

  if (loading) {
    return (
      <div className="contact-details-page">
        <div className="details-loading">
          Loading contact details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="contact-details-page">
        <div className="details-error">
          <h2>Unable to load contact</h2>
          <p>{error}</p>

          <button onClick={() => navigate("/admin/contact-messages")}>
            <ArrowLeft size={18} />
            Back to Contact Messages
          </button>
        </div>
      </div>
    );
  }

  if (!message) return null;

  return (
    <div className="contact-details-page">

      <div className="contact-details-header">
        <button
          className="back-button"
          onClick={() => navigate("/admin/contact-messages")}
        >
          <ArrowLeft size={18} />
          Back to Contact Messages
        </button>

        <div>
          <h1>Contact Details</h1>
          <p>View complete information submitted through the contact form.</p>
        </div>
      </div>

      <div className="contact-details-card">

        <div className="contact-profile">
          <div className="contact-avatar">
            <User size={30} />
          </div>

          <div>
            <h2>{message.name || "N/A"}</h2>
            <span>Contact Enquiry</span>
          </div>
        </div>

        <div className="contact-info-grid">

          <div className="contact-info-item">
            <div className="info-icon">
              <Mail size={20} />
            </div>

            <div>
              <label>Email</label>
              <p>{message.email || "N/A"}</p>
            </div>
          </div>

          <div className="contact-info-item">
            <div className="info-icon">
              <Phone size={20} />
            </div>

            <div>
              <label>Phone</label>
              <p>{message.phone || "N/A"}</p>
            </div>
          </div>

          <div className="contact-info-item">
            <div className="info-icon">
              <Building2 size={20} />
            </div>

            <div>
              <label>Company</label>
              <p>{message.company || "N/A"}</p>
            </div>
          </div>

          <div className="contact-info-item">
            <div className="info-icon">
              <Calendar size={20} />
            </div>

            <div>
              <label>Submitted</label>
              <p>
                {message.createdAt
                  ? new Date(message.createdAt).toLocaleString()
                  : "N/A"}
              </p>
            </div>
          </div>

        </div>

        <div className="message-section">

          <div className="message-title">
            <MessageSquare size={20} />
            <h3>Message</h3>
          </div>

          <div className="message-box">
            {message.message || "No message provided."}
          </div>

        </div>

      </div>

    </div>
  );
};

export default ContactMessageDetails;