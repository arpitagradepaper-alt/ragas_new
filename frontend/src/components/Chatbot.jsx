import { useState } from "react";
import "./Chatbot.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const CHATBOT_LOG_API = `${API_BASE_URL}/api/chatbot-logs`;
const CANDIDATE_API = `${API_BASE_URL}/api/candidates`;

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const [conversationId] = useState(
    () =>
      `RC-${Math.floor(
        10000 + Math.random() * 90000
      )}`
  );

  const [messages, setMessages] = useState([
    {
      type: "bot",
      text:
        "Hi! I'm here to help — are you looking for a job, or hiring talent?",
    },
  ]);

  /* =========================================
     CANDIDATE FORM
  ========================================= */

  const [showCandidateForm, setShowCandidateForm] =
    useState(false);

  const [candidateForm, setCandidateForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    qualification: "",
    experience: "",
    skills: "",
  });

  const [candidateSubmitting, setCandidateSubmitting] =
    useState(false);

  const [candidateSuccess, setCandidateSuccess] =
    useState(false);

  const [candidateError, setCandidateError] =
    useState("");


  /* =========================================
     SAVE CHATBOT CONVERSATION
  ========================================= */

  const saveConversation = async (updatedMessages) => {
    try {
      await fetch(CHATBOT_LOG_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId,
          user: candidateForm.name || "Website Visitor",
          userType: candidateForm.name
            ? "Candidate"
            : "Guest",
          topic: candidateForm.name
            ? "Candidate Registration"
            : "General Enquiry",
          status: "AI Resolved",

          messages: updatedMessages.map((item) => ({
            sender:
              item.type === "user"
                ? "User"
                : "AI",
            message: item.text,
          })),
        }),
      });
    } catch (error) {
      console.error(
        "Unable to save chatbot conversation:",
        error
      );
    }
  };


  /* =========================================
     ADD MESSAGE
  ========================================= */

  const addMessage = async (newMessage) => {
    const updatedMessages = [
      ...messages,
      newMessage,
    ];

    setMessages(updatedMessages);

    await saveConversation(updatedMessages);
  };


  /* =========================================
     SEND MESSAGE
  ========================================= */

  const sendMessage = async (text = message) => {
    const value = text.trim();

    if (!value) return;

    const userMessage = {
      type: "user",
      text: value,
    };

    const botMessage = {
      type: "bot",
      text:
        "Sure — I can help with that. Please share a few more details and I'll guide you.",
    };

    const updatedMessages = [
      ...messages,
      userMessage,
      botMessage,
    ];

    setMessages(updatedMessages);
    setMessage("");

    await saveConversation(updatedMessages);
  };


  /* =========================================
     START CANDIDATE REGISTRATION
  ========================================= */

  const startCandidateRegistration = async () => {
    const userMessage = {
      type: "user",
      text: "I'm looking for a job",
    };

    const botMessage = {
      type: "bot",
      text:
        "Great! Please share your details below so our recruitment team can help you find suitable opportunities.",
    };

    const updatedMessages = [
      ...messages,
      userMessage,
      botMessage,
    ];

    setMessages(updatedMessages);
    setShowCandidateForm(true);
    setCandidateSuccess(false);
    setCandidateError("");

    await saveConversation(updatedMessages);
  };


  /* =========================================
     EMPLOYER ACTION
  ========================================= */

  const startEmployerEnquiry = async () => {
    const userMessage = {
      type: "user",
      text: "I'm hiring talent",
    };

    const botMessage = {
      type: "bot",
      text:
        "Absolutely! Please contact our recruitment team for employer hiring support and verified talent solutions.",
    };

    const updatedMessages = [
      ...messages,
      userMessage,
      botMessage,
    ];

    setMessages(updatedMessages);

    await saveConversation(updatedMessages);
  };


  /* =========================================
     HANDLE CANDIDATE INPUT
  ========================================= */

  const handleCandidateChange = (e) => {
    const { name, value } = e.target;

    setCandidateForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  /* =========================================
     SUBMIT CANDIDATE
  ========================================= */

  const submitCandidate = async (e) => {
    e.preventDefault();

    setCandidateError("");
    setCandidateSuccess(false);

    if (
      !candidateForm.name.trim() ||
      !candidateForm.email.trim() ||
      !candidateForm.phone.trim()
    ) {
      setCandidateError(
        "Name, email and phone are required."
      );

      return;
    }

    try {
      setCandidateSubmitting(true);

      const response = await fetch(
        CANDIDATE_API,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: candidateForm.name.trim(),
            email: candidateForm.email.trim(),
            phone: candidateForm.phone.trim(),
            location:
              candidateForm.location.trim(),
            qualification:
              candidateForm.qualification.trim(),
            experience:
              candidateForm.experience.trim(),
            skills:
              candidateForm.skills.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to register candidate."
        );
      }


      /* -----------------------------------------
         SUCCESS MESSAGE
      ----------------------------------------- */

      const successMessage = {
        type: "bot",
        text:
          "Thank you! Your candidate profile has been successfully registered. Our recruitment team will review your profile and contact you regarding suitable opportunities.",
      };

      const updatedMessages = [
        ...messages,
        successMessage,
      ];

      setMessages(updatedMessages);

      setCandidateSuccess(true);

      setCandidateForm({
        name: "",
        email: "",
        phone: "",
        location: "",
        qualification: "",
        experience: "",
        skills: "",
      });

      await saveConversation(updatedMessages);

    } catch (error) {
      console.error(
        "Candidate registration error:",
        error
      );

      setCandidateError(
        error.message ||
          "Unable to register candidate. Please try again."
      );

    } finally {
      setCandidateSubmitting(false);
    }
  };


  return (
    <>
      {/* =====================================
          FLOATING CHAT BUTTON
      ===================================== */}

      {!isOpen && (
        <button
          className="chatbot-floating-button"
          onClick={() => setIsOpen(true)}
          aria-label="Open RAGAS Assistant"
        >
          <span className="chatbot-icon">
            ✦
          </span>

          <span>
            Chat with us
          </span>
        </button>
      )}


      {/* =====================================
          CHAT WINDOW
      ===================================== */}

      {isOpen && (
        <div className="chatbot-window">

          {/* =================================
              HEADER
          ================================= */}

          <div className="chatbot-header">

            <div>

              <strong>
                RAGAS Assistant
              </strong>

              <span className="chatbot-status">
                <i></i>
                Online
              </span>

            </div>

            <button
              className="chatbot-close"
              onClick={() =>
                setIsOpen(false)
              }
              aria-label="Close chatbot"
            >
              ×
            </button>

          </div>


          {/* =================================
              MESSAGES
          ================================= */}

          <div className="chatbot-messages">

            {messages.map(
              (item, index) => (
                <div
                  key={index}
                  className={`chat-message ${
                    item.type === "user"
                      ? "user-message"
                      : "bot-message"
                  }`}
                >
                  {item.text}
                </div>
              )
            )}


            {/* =================================
                INITIAL QUICK ACTIONS
            ================================= */}

            {messages.length === 1 &&
              !showCandidateForm && (
                <div className="chatbot-quick-actions">

                  <button
                    className="chatbot-quick-action"
                    onClick={
                      startCandidateRegistration
                    }
                  >
                    I'm looking for a job
                  </button>

                  <button
                    className="chatbot-quick-action"
                    onClick={
                      startEmployerEnquiry
                    }
                  >
                    I'm hiring talent
                  </button>

                </div>
              )}


            {/* =================================
                CANDIDATE FORM
            ================================= */}

            {showCandidateForm && (
              <div className="chatbot-candidate-form">

                <div className="chatbot-form-title">
                  Candidate Registration
                </div>

                <p className="chatbot-form-subtitle">
                  Please enter your details.
                </p>


                <form
                  onSubmit={submitCandidate}
                >

                  {/* NAME */}

                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name *"
                    value={
                      candidateForm.name
                    }
                    onChange={
                      handleCandidateChange
                    }
                    required
                  />


                  {/* EMAIL */}

                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address *"
                    value={
                      candidateForm.email
                    }
                    onChange={
                      handleCandidateChange
                    }
                    required
                  />


                  {/* PHONE */}

                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number *"
                    value={
                      candidateForm.phone
                    }
                    onChange={
                      handleCandidateChange
                    }
                    required
                  />


                  {/* LOCATION */}

                  <input
                    type="text"
                    name="location"
                    placeholder="Current Location"
                    value={
                      candidateForm.location
                    }
                    onChange={
                      handleCandidateChange
                    }
                  />


                  {/* QUALIFICATION */}

                  <input
                    type="text"
                    name="qualification"
                    placeholder="Highest Qualification"
                    value={
                      candidateForm.qualification
                    }
                    onChange={
                      handleCandidateChange
                    }
                  />


                  {/* EXPERIENCE */}

                  <input
                    type="text"
                    name="experience"
                    placeholder="Experience"
                    value={
                      candidateForm.experience
                    }
                    onChange={
                      handleCandidateChange
                    }
                  />


                  {/* SKILLS */}

                  <textarea
                    name="skills"
                    placeholder="Key Skills"
                    rows="3"
                    value={
                      candidateForm.skills
                    }
                    onChange={
                      handleCandidateChange
                    }
                  />


                  {/* ERROR */}

                  {candidateError && (
                    <div className="chatbot-form-error">
                      {candidateError}
                    </div>
                  )}


                  {/* SUCCESS */}

                  {candidateSuccess && (
                    <div className="chatbot-form-success">
                      Profile registered successfully.
                    </div>
                  )}


                  {/* SUBMIT */}

                  <button
                    type="submit"
                    className="chatbot-form-submit"
                    disabled={
                      candidateSubmitting
                    }
                  >
                    {candidateSubmitting
                      ? "Submitting..."
                      : "Register Profile"}
                  </button>

                </form>

              </div>
            )}

          </div>


          {/* =================================
              INPUT
          ================================= */}

          <form
            className="chatbot-input-area"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
          >

            <input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              aria-label="Type your message"
            />

            <button
              type="submit"
              aria-label="Send message"
            >
              ↑
            </button>

          </form>

        </div>
      )}
    </>
  );
}

export default Chatbot;