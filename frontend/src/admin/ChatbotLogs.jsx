import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ChatbotLogs.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const API_URL = `${API_BASE_URL}/api/chatbot-logs`;

const ITEMS_PER_PAGE = 10;

function ChatbotLogs() {
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);

  // Applied filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All Status");
  const [userFilter, setUserFilter] =
    useState("All Users");

  // Temporary filter values
  const [draftSearch, setDraftSearch] = useState("");
  const [draftStatusFilter, setDraftStatusFilter] =
    useState("All Status");
  const [draftUserFilter, setDraftUserFilter] =
    useState("All Users");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  // =========================================
  // FETCH CONVERSATIONS
  // =========================================

  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${
            localStorage.getItem("ragasAdminToken") || ""
          }`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Server returned ${response.status}`
        );
      }

      const data = await response.json();

      if (data.success) {
        setConversations(data.data || []);
      } else {
        setError(
          data.message ||
            "Unable to fetch conversations."
        );
      }
    } catch (err) {
      console.error(
        "Chatbot logs fetch error:",
        err
      );

      setError(
        "Unable to connect to server."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  // =========================================
  // APPLY FILTERS
  // =========================================

  const handleFilter = () => {
    setSearch(draftSearch);
    setStatusFilter(draftStatusFilter);
    setUserFilter(draftUserFilter);
    setCurrentPage(1);
  };

  // =========================================
  // FILTERED CONVERSATIONS
  // =========================================

  const filteredConversations = useMemo(() => {
    return conversations.filter((item) => {
      const text = search
        .trim()
        .toLowerCase();

      const matchesSearch =
        !text ||
        item.conversationId
          ?.toLowerCase()
          .includes(text) ||
        item.user
          ?.toLowerCase()
          .includes(text) ||
        item.topic
          ?.toLowerCase()
          .includes(text);

      const matchesStatus =
        statusFilter === "All Status" ||
        item.status === statusFilter;

      const matchesUser =
        userFilter === "All Users" ||
        item.userType === userFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesUser
      );
    });
  }, [
    conversations,
    search,
    statusFilter,
    userFilter,
  ]);

  // =========================================
  // RESET PAGE WHEN DATA CHANGES
  // =========================================

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    statusFilter,
    userFilter,
  ]);

  // =========================================
  // STATS
  // =========================================

  const totalConversations =
    conversations.length;

  const aiResolved =
    conversations.filter(
      (item) =>
        item.status === "AI Resolved"
    ).length;

  const liveAgent =
    conversations.filter(
      (item) =>
        item.status === "Live Agent"
    ).length;

  const profileLinked =
    totalConversations > 0
      ? Math.round(
          (conversations.filter(
            (item) =>
              item.userType === "Candidate" ||
              item.userType === "Employer"
          ).length /
            totalConversations) *
            100
        )
      : 0;

  // =========================================
  // PAGINATION
  // =========================================

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredConversations.length /
        ITEMS_PER_PAGE
    )
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const startIndex =
    (safeCurrentPage - 1) *
    ITEMS_PER_PAGE;

  const endIndex =
    startIndex + ITEMS_PER_PAGE;

  const paginatedConversations =
    filteredConversations.slice(
      startIndex,
      endIndex
    );

  const handlePageChange = (page) => {
    if (
      page < 1 ||
      page > totalPages
    ) {
      return;
    }

    setCurrentPage(page);
  };

  // =========================================
  // PAGE BUTTONS
  // =========================================

  const pageButtons = [];

  if (totalPages <= 5) {
    for (
      let page = 1;
      page <= totalPages;
      page++
    ) {
      pageButtons.push(page);
    }
  } else {
    pageButtons.push(1);

    if (safeCurrentPage > 3) {
      pageButtons.push("...");
    }

    const startPage = Math.max(
      2,
      safeCurrentPage - 1
    );

    const endPage = Math.min(
      totalPages - 1,
      safeCurrentPage + 1
    );

    for (
      let page = startPage;
      page <= endPage;
      page++
    ) {
      pageButtons.push(page);
    }

    if (
      safeCurrentPage <
      totalPages - 2
    ) {
      pageButtons.push("...");
    }

    pageButtons.push(totalPages);
  }

  // =========================================
  // TIME FORMAT
  // =========================================

  const formatTime = (date) => {
    if (!date) {
      return "N/A";
    }

    const timestamp =
      new Date(date).getTime();

    if (Number.isNaN(timestamp)) {
      return "N/A";
    }

    const diff =
      Date.now() - timestamp;

    const minutes = Math.floor(
      diff / 60000
    );

    if (minutes < 1) {
      return "Just now";
    }

    if (minutes < 60) {
      return `${minutes} min ago`;
    }

    const hours = Math.floor(
      minutes / 60
    );

    if (hours < 24) {
      return `${hours} hr ago`;
    }

    const days = Math.floor(
      hours / 24
    );

    return `${days} day${
      days > 1 ? "s" : ""
    } ago`;
  };

  // =========================================
  // VIEW CONVERSATION
  // =========================================

  const handleView = (conversation) => {
    if (!conversation?._id) {
      alert(
        "Conversation ID is not available."
      );
      return;
    }

    navigate(
      `/admin/chatbot-logs/${conversation._id}`
    );
  };

  // =========================================
  // EXPORT CSV
  // =========================================

  const handleExport = () => {
    if (
      filteredConversations.length === 0
    ) {
      alert(
        "No conversations available to export."
      );
      return;
    }

    const headers = [
      "Conversation ID",
      "User",
      "User Type",
      "Topic",
      "Status",
      "Last Activity",
    ];

    const rows =
      filteredConversations.map(
        (item) => [
          item.conversationId || "",
          item.user || "Guest",
          item.userType || "Guest",
          item.topic || "General",
          item.status || "",
          item.updatedAt || "",
        ]
      );

    const csv = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map(
            (value) =>
              `"${String(value).replace(
                /"/g,
                '""'
              )}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob(
      [csv],
      {
        type:
          "text/csv;charset=utf-8;",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      "chatbot-conversations.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // =========================================
  // RENDER
  // =========================================

  return (
    <div className="chatbot-logs-page">

      {/* =====================================
          HEADING
      ===================================== */}

      <div className="logs-heading">

        <div>

          <p>
            AI CHATBOT
          </p>

          <h2>
            Chatbot Conversation Log
          </h2>

          <span>
            Review conversations, monitor AI
            responses and manage live-agent
            handoffs.
          </span>

        </div>

        <button
          className="export-btn"
          onClick={handleExport}
          type="button"
        >
          ↓ Export
        </button>

      </div>


      {/* =====================================
          STATS
      ===================================== */}

      <div className="logs-stats">

        <button
          type="button"
          className="logs-stat logs-stat-button"
          onClick={() => {
            setDraftSearch("");
            setDraftStatusFilter(
              "All Status"
            );
            setDraftUserFilter(
              "All Users"
            );

            setSearch("");
            setStatusFilter(
              "All Status"
            );
            setUserFilter(
              "All Users"
            );

            setCurrentPage(1);
          }}
        >
          <span>
            Total Conversations
          </span>

          <strong>
            {totalConversations}
          </strong>

          <small>
            This month
          </small>
        </button>


        <button
          type="button"
          className="logs-stat logs-stat-button"
          onClick={() => {
            setDraftStatusFilter(
              "AI Resolved"
            );
            setStatusFilter(
              "AI Resolved"
            );
            setCurrentPage(1);
          }}
        >
          <span>
            AI Resolved
          </span>

          <strong>
            {aiResolved}
          </strong>

          <small>
            {totalConversations > 0
              ? `${Math.round(
                  (aiResolved /
                    totalConversations) *
                    100
                )}% resolution rate`
              : "0% resolution rate"}
          </small>
        </button>


        <button
          type="button"
          className="logs-stat logs-stat-button"
          onClick={() => {
            setDraftStatusFilter(
              "Live Agent"
            );
            setStatusFilter(
              "Live Agent"
            );
            setCurrentPage(1);
          }}
        >
          <span>
            Live Agent
          </span>

          <strong>
            {liveAgent}
          </strong>

          <small>
            Requires human support
          </small>
        </button>


        <button
          type="button"
          className="logs-stat logs-stat-button"
          onClick={() => {
            setDraftUserFilter(
              "Candidate"
            );
            setUserFilter(
              "Candidate"
            );
            setCurrentPage(1);
          }}
        >
          <span>
            Profile Linked
          </span>

          <strong>
            {profileLinked}%
          </strong>

          <small>
            Candidate / employer
          </small>
        </button>

      </div>


      {/* =====================================
          TABLE CARD
      ===================================== */}

      <section className="logs-card">

        {/* TOOLBAR */}

        <div className="logs-toolbar">

          <div className="logs-search">

            <span>
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search conversation, user or topic..."
              value={draftSearch}
              onChange={(e) =>
                setDraftSearch(
                  e.target.value
                )
              }
              onKeyDown={(e) => {
                if (
                  e.key === "Enter"
                ) {
                  handleFilter();
                }
              }}
            />

          </div>


          <select
            value={draftStatusFilter}
            onChange={(e) =>
              setDraftStatusFilter(
                e.target.value
              )
            }
          >
            <option>
              All Status
            </option>

            <option>
              AI Resolved
            </option>

            <option>
              Live Agent
            </option>
          </select>


          <select
            value={draftUserFilter}
            onChange={(e) =>
              setDraftUserFilter(
                e.target.value
              )
            }
          >
            <option>
              All Users
            </option>

            <option>
              Candidate
            </option>

            <option>
              Employer
            </option>

            <option>
              Guest
            </option>
          </select>


          <button
            className="filter-btn"
            onClick={handleFilter}
            type="button"
          >
            Filter
          </button>

        </div>


        {/* TABLE */}

        <div className="logs-table-wrapper">

          <table className="logs-table">

            <thead>

              <tr>

                <th>
                  Conversation
                </th>

                <th>
                  User
                </th>

                <th>
                  Type
                </th>

                <th>
                  Topic
                </th>

                <th>
                  Status
                </th>

                <th>
                  Last Activity
                </th>

                <th></th>

              </tr>

            </thead>


            <tbody>

              {loading ? (

                <tr>

                  <td
                    colSpan="7"
                    style={{
                      textAlign:
                        "center",
                    }}
                  >
                    Loading conversations...
                  </td>

                </tr>

              ) : error ? (

                <tr>

                  <td
                    colSpan="7"
                    style={{
                      textAlign:
                        "center",
                      color:
                        "#c0392b",
                    }}
                  >
                    {error}
                  </td>

                </tr>

              ) : paginatedConversations.length ===
                0 ? (

                <tr>

                  <td
                    colSpan="7"
                    style={{
                      textAlign:
                        "center",
                    }}
                  >
                    No conversations found.
                  </td>

                </tr>

              ) : (

                paginatedConversations.map(
                  (item) => (

                    <tr
                      key={item._id}
                    >

                      <td>

                        <strong>
                          #
                          {item.conversationId}
                        </strong>

                      </td>


                      <td>
                        {item.user ||
                          "Guest"}
                      </td>


                      <td>

                        <span className="user-type">
                          {item.userType ||
                            "Guest"}
                        </span>

                      </td>


                      <td>
                        {item.topic ||
                          "General"}
                      </td>


                      <td>

                        <span
                          className={
                            item.status ===
                            "Live Agent"
                              ? "log-status live"
                              : "log-status resolved"
                          }
                        >
                          {item.status}
                        </span>

                      </td>


                      <td>
                        {formatTime(
                          item.updatedAt
                        )}
                      </td>


                      <td>

                        <button
                          className="view-log-btn"
                          type="button"
                          onClick={() =>
                            handleView(item)
                          }
                        >
                          View
                        </button>

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>


        {/* =================================
            PAGINATION
        ================================= */}

        <div className="logs-pagination">

          <span>
            Showing{" "}
            {filteredConversations.length >
            0
              ? `${startIndex + 1}–${Math.min(
                  endIndex,
                  filteredConversations.length
                )}`
              : "0"}{" "}
            of{" "}
            {filteredConversations.length}{" "}
            conversations
          </span>


          <div>

            {/* PREVIOUS */}

            <button
              type="button"
              disabled={
                safeCurrentPage === 1
              }
              onClick={() =>
                handlePageChange(
                  safeCurrentPage - 1
                )
              }
              aria-label="Previous page"
            >
              ‹
            </button>


            {/* PAGE NUMBERS */}

            {pageButtons.map(
              (page, index) =>
                page === "..." ? (

                  <button
                    key={`dots-${index}`}
                    type="button"
                    disabled
                    className="pagination-dots"
                  >
                    ...
                  </button>

                ) : (

                  <button
                    key={page}
                    type="button"
                    className={
                      safeCurrentPage ===
                      page
                        ? "active-page"
                        : ""
                    }
                    onClick={() =>
                      handlePageChange(
                        page
                      )
                    }
                  >
                    {page}
                  </button>

                )
            )}


            {/* NEXT */}

            <button
              type="button"
              disabled={
                safeCurrentPage ===
                totalPages
              }
              onClick={() =>
                handlePageChange(
                  safeCurrentPage + 1
                )
              }
              aria-label="Next page"
            >
              ›
            </button>

          </div>

        </div>

      </section>

    </div>
  );
}

export default ChatbotLogs;