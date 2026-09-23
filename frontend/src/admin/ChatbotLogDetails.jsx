import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MessageCircle,
  User,
  Clock,
  Tag,
  Activity,
  Bot,
  UserRound,
} from "lucide-react";
import "./ChatbotLogDetails.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://rosybrown-snake-826018.hostingersite.com";

const API_URL = `${API_BASE_URL}/api/chatbot-logs`;

function ChatbotLogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        setLoading(true);
        setError("");

      const response = await fetch(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${
            localStorage.getItem("ragasAdminToken") || ""
          }`,
        },
      });

const contentType =
  response.headers.get("content-type") || "";

if (!contentType.includes("application/json")) {
  throw new Error(
    `Server returned an unexpected response (${response.status}).`
  );
}

const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "Unable to fetch conversation details."
          );
        }

        setConversation(data.data);
      } catch (err) {
        console.error(
          "Conversation details error:",
          err
        );

        setError(
          err.message ||
            "Unable to fetch conversation details."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchConversation();
    }
  }, [id]);

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="chat-log-details-page">
        <div className="chat-log-loading">
          Loading conversation...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chat-log-details-page">
        <button
          className="chat-log-back-button"
          type="button"
          onClick={() =>
            navigate("/admin/chatbot-logs")
          }
        >
          <ArrowLeft size={18} />
          Back to Chatbot Logs
        </button>

        <div className="chat-log-error">
          {error}
        </div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="chat-log-details-page">
        <div className="chat-log-error">
          Conversation not found.
        </div>
      </div>
    );
  }

  return (
    <div className="chat-log-details-page">

      {/* HEADER */}

      <div className="chat-log-details-header">

        <button
          className="chat-log-back-button"
          type="button"
          onClick={() =>
            navigate("/admin/chatbot-logs")
          }
        >
          <ArrowLeft size={18} />
          Back to Chatbot Logs
        </button>

        <div className="chat-log-title-area">

          <div className="chat-log-icon">
            <MessageCircle size={28} />
          </div>

          <div>
            <p className="chat-log-eyebrow">
              CHATBOT CONVERSATION
            </p>

            <h1>
              #{conversation.conversationId}
            </h1>

            <p className="chat-log-subtitle">
              Conversation details and message history
            </p>
          </div>

        </div>

      </div>

      {/* MAIN GRID */}

      <div className="chat-log-details-grid">

        {/* CONVERSATION */}

        <div className="chat-log-main-card">

          <div className="chat-log-section-heading">
            <MessageCircle size={20} />
            <span>
              Conversation
            </span>
          </div>

          <div className="chat-log-messages">

            {conversation.messages &&
            conversation.messages.length > 0 ? (
              conversation.messages.map(
                (message, index) => {

                  const isUser =
                    message.sender === "User";

                  return (
                    <div
                      key={index}
                      className={`chat-log-message-row ${
                        isUser
                          ? "chat-log-user-row"
                          : "chat-log-ai-row"
                      }`}
                    >

                      <div
                        className={`chat-log-message-avatar ${
                          isUser
                            ? "user-avatar"
                            : "ai-avatar"
                        }`}
                      >
                        {isUser ? (
                          <UserRound size={17} />
                        ) : (
                          <Bot size={17} />
                        )}
                      </div>

                      <div className="chat-log-message-content">

                        <div className="chat-log-message-top">

                          <strong>
                            {isUser
                              ? "User"
                              : "AI Assistant"}
                          </strong>

                        </div>

                        <div
                          className={`chat-log-message-bubble ${
                            isUser
                              ? "user-bubble"
                              : "ai-bubble"
                          }`}
                        >
                          {message.message ||
                            "No message available."}
                        </div>

                      </div>

                    </div>
                  );
                }
              )
            ) : (
              <div className="chat-log-no-messages">
                No messages available for this
                conversation.
              </div>
            )}

          </div>

        </div>

        {/* SIDEBAR */}

        <aside className="chat-log-sidebar">

          {/* STATUS */}

          <div className="chat-log-info-card">

            <div className="chat-log-info-card-heading">
              <Activity size={19} />
              Conversation Status
            </div>

            <div className="chat-log-status-box">

              <span
                className={
                  conversation.status ===
                  "Live Agent"
                    ? "chat-log-status live"
                    : "chat-log-status resolved"
                }
              >
                {conversation.status ||
                  "N/A"}
              </span>

            </div>

          </div>

          {/* USER DETAILS */}

          <div className="chat-log-info-card">

            <div className="chat-log-info-card-heading">
              <User size={19} />
              User Information
            </div>

            <div className="chat-log-info-list">

              <div className="chat-log-info-item">
                <span>User</span>

                <strong>
                  {conversation.user ||
                    "Website Visitor"}
                </strong>
              </div>

              <div className="chat-log-info-item">
                <span>User Type</span>

                <strong>
                  {conversation.userType ||
                    "Guest"}
                </strong>
              </div>

            </div>

          </div>

          {/* TOPIC */}

          <div className="chat-log-info-card">

            <div className="chat-log-info-card-heading">
              <Tag size={19} />
              Conversation Information
            </div>

            <div className="chat-log-info-list">

              <div className="chat-log-info-item">
                <span>Topic</span>

                <strong>
                  {conversation.topic ||
                    "General Enquiry"}
                </strong>
              </div>

              <div className="chat-log-info-item">
                <span>Conversation ID</span>

                <strong>
                  {conversation.conversationId ||
                    "N/A"}
                </strong>
              </div>

            </div>

          </div>

          {/* ACTIVITY */}

          <div className="chat-log-info-card">

            <div className="chat-log-info-card-heading">
              <Clock size={19} />
              Activity
            </div>

            <div className="chat-log-info-list">

              <div className="chat-log-info-item">
                <span>Created</span>

                <strong>
                  {formatDate(
                    conversation.createdAt
                  )}
                </strong>
              </div>

              <div className="chat-log-info-item">
                <span>Last Activity</span>

                <strong>
                  {formatDate(
                    conversation.updatedAt
                  )}
                </strong>
              </div>

            </div>

          </div>

        </aside>

      </div>

    </div>
  );
}

export default ChatbotLogDetails;