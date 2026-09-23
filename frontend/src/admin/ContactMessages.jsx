import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ContactMessages.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const API_URL = API_BASE_URL;

function ContactMessages() {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ==========================================
     FETCH CONTACT MESSAGES
  ========================================== */

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/api/contact`, {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("ragasAdminToken") || ""
            }`,
          },
        });

        if (!response.ok) {
          throw new Error(
            "Unable to fetch contact messages."
          );
        }

        const data = await response.json();

        setMessages(data.data || []);
      } catch (err) {
        console.error(
          "Contact messages error:",
          err
        );

        setError(
          "Unable to load contact messages."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  /* ==========================================
     FILTER
  ========================================== */

  const filteredMessages = useMemo(() => {
    const searchValue = search
      .toLowerCase()
      .trim();

    return messages.filter((message) => {
      return (
        message.name
          ?.toLowerCase()
          .includes(searchValue) ||
        message.email
          ?.toLowerCase()
          .includes(searchValue) ||
        message.phone
          ?.toLowerCase()
          .includes(searchValue) ||
        message.company
          ?.toLowerCase()
          .includes(searchValue) ||
        message.message
          ?.toLowerCase()
          .includes(searchValue)
      );
    });
  }, [messages, search]);

  /* ==========================================
     DATE
  ========================================== */

  const formatDate = (date) => {
    if (!date) return "—";

    const created = new Date(date);
    const now = new Date();

    const difference =
      now.getTime() - created.getTime();

    const days = Math.floor(
      difference / (1000 * 60 * 60 * 24)
    );

    if (days <= 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 30) return `${days} days ago`;

    return created.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /* ==========================================
     ID
  ========================================== */

  const getMessageId = (message, index) => {
    if (message._id) {
      return `MSG-${message._id
        .slice(-4)
        .toUpperCase()}`;
    }

    return `MSG-${String(index + 1).padStart(
      4,
      "0"
    )}`;
  };

  /* ==========================================
     INITIALS
  ========================================== */

  const getInitials = (name = "Visitor") => {
    return name
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  /* ==========================================
     VIEW MESSAGE
  ========================================== */

  const handleView = (message) => {
    if (!message?._id) return;

    navigate(
      `/admin/contact-messages/${message._id}`
    );
  };

  return (
    <div className="contact-messages-page">

      {/* ========================================
          HEADING
      ======================================== */}

      <div className="contact-messages-heading">

        <div>
          <p>CONTACT MANAGEMENT</p>

          <h2>Contact Messages</h2>

          <span>
            Review and manage enquiries submitted
            through the RAGAS CAREER WORLD website.
          </span>
        </div>

        <button
          type="button"
          className="contact-refresh-btn"
          onClick={() =>
            window.location.reload()
          }
        >
          ↻ Refresh
        </button>

      </div>

      {/* ========================================
          ERROR
      ======================================== */}

      {error && (
        <div className="contact-error">
          {error}
        </div>
      )}

      {/* ========================================
          STATS
      ======================================== */}

      <div className="contact-stats">

        <div className="contact-stat">
          <span>Total Messages</span>

          <strong>
            {loading ? "..." : messages.length}
          </strong>

          <small>
            All contact enquiries
          </small>
        </div>

        <div className="contact-stat">
          <span>New This Month</span>

          <strong>
            {loading
              ? "..."
              : messages.filter((message) => {
                  if (!message.createdAt)
                    return false;

                  const created =
                    new Date(
                      message.createdAt
                    );

                  const now = new Date();

                  return (
                    created.getMonth() ===
                      now.getMonth() &&
                    created.getFullYear() ===
                      now.getFullYear()
                  );
                }).length}
          </strong>

          <small>
            Received this month
          </small>
        </div>

        <div className="contact-stat">
          <span>Recent Enquiries</span>

          <strong>
            {loading
              ? "..."
              : messages.filter((message) => {
                  if (!message.createdAt)
                    return false;

                  const created =
                    new Date(
                      message.createdAt
                    );

                  const now = new Date();

                  const difference =
                    now.getTime() -
                    created.getTime();

                  return (
                    difference <=
                    7 *
                      24 *
                      60 *
                      60 *
                      1000
                  );
                }).length}
          </strong>

          <small>
            Last 7 days
          </small>
        </div>

        <div className="contact-stat">
          <span>Available</span>

          <strong>
            {loading ? "..." : messages.length}
          </strong>

          <small>
            Messages available
          </small>
        </div>

      </div>

      {/* ========================================
          MAIN CARD
      ======================================== */}

      <section className="contact-messages-card">

        {/* TOOLBAR */}

        <div className="contact-toolbar">

          <div className="contact-search">

            <span>⌕</span>

            <input
              type="text"
              placeholder="Search name, email, company or message..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          <button
            type="button"
            className="contact-reset-btn"
            onClick={() => setSearch("")}
          >
            Reset
          </button>

        </div>

        {/* TABLE */}

        <div className="contact-table-wrapper">

          <table className="contact-table">

            <thead>
              <tr>
                <th>CONTACT</th>
                <th>EMAIL</th>
                <th>PHONE</th>
                <th>COMPANY</th>
                <th>MESSAGE</th>
                <th>RECEIVED</th>
                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>

              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="contact-empty"
                  >
                    Loading contact messages...
                  </td>
                </tr>
              ) : filteredMessages.length ===
                0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="contact-empty"
                  >
                    No contact messages found.
                  </td>
                </tr>
              ) : (
                filteredMessages.map(
                  (message, index) => {

                    const messageId =
                      getMessageId(
                        message,
                        index
                      );

                    return (
                      <tr
                        key={
                          message._id ||
                          messageId
                        }
                      >

                        {/* CONTACT */}

                        <td>

                          <div className="contact-person">

                            <div className="contact-avatar">
                              {getInitials(
                                message.name
                              )}
                            </div>

                            <div>
                              <strong>
                                {message.name ||
                                  "Visitor"}
                              </strong>

                              <small>
                                {messageId}
                              </small>
                            </div>

                          </div>

                        </td>

                        {/* EMAIL */}

                        <td>
                          <span className="contact-email">
                            {message.email ||
                              "—"}
                          </span>
                        </td>

                        {/* PHONE */}

                        <td>
                          {message.phone ||
                            "—"}
                        </td>

                        {/* COMPANY */}

                        <td>
                          {message.company ||
                            "—"}
                        </td>

                        {/* MESSAGE */}

                        <td>
                          <div className="contact-message-preview">
                            {message.message ||
                              "No message"}
                          </div>
                        </td>

                        {/* DATE */}

                        <td>
                          {formatDate(
                            message.createdAt ||
                              message.updatedAt
                          )}
                        </td>

                        {/* ACTION */}

                        <td>

                          <button
                            type="button"
                            className="contact-view-btn"
                            onClick={() =>
                              handleView(
                                message
                              )
                            }
                          >
                            View →
                          </button>

                        </td>

                      </tr>
                    );
                  }
                )
              )}

            </tbody>

          </table>

        </div>

        {/* FOOTER */}

        <div className="contact-pagination">

          <span>
            Showing{" "}
            {filteredMessages.length} of{" "}
            {messages.length} messages
          </span>

          <div>
            <button disabled>
              ‹
            </button>

            <button className="contact-page-active">
              1
            </button>

            <button disabled>
              ›
            </button>
          </div>

        </div>

      </section>

    </div>
  );
}

export default ContactMessages;
