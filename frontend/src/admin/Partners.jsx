import { useEffect, useMemo, useState } from "react";
import "./Partners.css";
import AddPartnerModal from "./AddPartnerModal";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

const API_URL = `${API_BASE_URL}/api/partners`;

function Partners() {
  const [partners, setPartners] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] =
    useState("All Partner Types");
  const [statusFilter, setStatusFilter] =
    useState("All Status");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedPartner, setSelectedPartner] =
    useState(null);

  const [actionLoading, setActionLoading] =
    useState("");

  const [showAddPartner, setShowAddPartner] =
    useState(false);

  /* =========================================
     ADMIN TOKEN
  ========================================= */

  const getAdminToken = () => {
    return localStorage.getItem(
      "ragasAdminToken"
    );
  };

  /* =========================================
     STATUS CLASS
  ========================================= */

  const getStatusClass = (status) => {
    if (status === "Verified") {
      return "verified";
    }

    if (status === "Pending") {
      return "pending";
    }

    return "rejected";
  };

  /* =========================================
     FETCH PARTNERS
  ========================================= */

  const fetchPartners = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getAdminToken();

      if (!token) {
        setError(
          "Admin authentication required. Please login again."
        );
        return;
      }

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        setError(
          data.message ||
            "Admin authentication failed. Please login again."
        );
        return;
      }

      if (!response.ok) {
        setError(
          data.message ||
            "Unable to fetch partners."
        );
        return;
      }

      if (data.success) {
        setPartners(
          data.partners ||
            data.data ||
            []
        );
      } else {
        setError(
          data.message ||
            "Unable to fetch partners."
        );
      }
    } catch (err) {
      console.error(
        "Partners fetch error:",
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
    fetchPartners();
  }, []);

  /* =========================================
     ADD PARTNER
  ========================================= */

  const handleAddPartner = () => {
    setError("");
    setShowAddPartner(true);
  };

  /* =========================================
     PARTNER CREATED
  ========================================= */

  const handlePartnerCreated = (
    newPartner
  ) => {
    if (newPartner) {
      setPartners(
        (currentPartners) => [
          newPartner,
          ...currentPartners,
        ]
      );
    } else {
      fetchPartners();
    }

    setShowAddPartner(false);
  };

  /* =========================================
     APPROVE PARTNER
  ========================================= */

  const handleApprove = async (
    partner
  ) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to approve ${partner.companyName}?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(
        `approve-${partner._id}`
      );

      setError("");

      const token =
        getAdminToken();

      if (!token) {
        setError(
          "Admin authentication required. Please login again."
        );
        return;
      }

      const response =
        await fetch(
          `${API_URL}/${partner._id}/approve`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      const data =
        await response.json();

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        setError(
          data.message ||
            "Admin authentication failed. Please login again."
        );
        return;
      }

      if (
        !response.ok ||
        !data.success
      ) {
        setError(
          data.message ||
            "Unable to approve partner."
        );
        return;
      }

      setPartners(
        (currentPartners) =>
          currentPartners.map(
            (item) =>
              item._id ===
              partner._id
                ? {
                    ...item,
                    status:
                      "Verified",
                  }
                : item
          )
      );

      if (
        selectedPartner &&
        selectedPartner._id ===
          partner._id
      ) {
        setSelectedPartner(
          (current) => ({
            ...current,
            status:
              "Verified",
          })
        );
      }
    } catch (err) {
      console.error(
        "Approve partner error:",
        err
      );

      setError(
        "Unable to approve partner."
      );
    } finally {
      setActionLoading("");
    }
  };

  /* =========================================
     REJECT PARTNER
  ========================================= */

  const handleReject = async (
    partner
  ) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to reject ${partner.companyName}?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(
        `reject-${partner._id}`
      );

      setError("");

      const token =
        getAdminToken();

      if (!token) {
        setError(
          "Admin authentication required. Please login again."
        );
        return;
      }

      const response =
        await fetch(
          `${API_URL}/${partner._id}/reject`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      const data =
        await response.json();

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        setError(
          data.message ||
            "Admin authentication failed. Please login again."
        );
        return;
      }

      if (
        !response.ok ||
        !data.success
      ) {
        setError(
          data.message ||
            "Unable to reject partner."
        );
        return;
      }

      setPartners(
        (currentPartners) =>
          currentPartners.map(
            (item) =>
              item._id ===
              partner._id
                ? {
                    ...item,
                    status:
                      "Rejected",
                  }
                : item
          )
      );

      if (
        selectedPartner &&
        selectedPartner._id ===
          partner._id
      ) {
        setSelectedPartner(
          (current) => ({
            ...current,
            status:
              "Rejected",
          })
        );
      }
    } catch (err) {
      console.error(
        "Reject partner error:",
        err
      );

      setError(
        "Unable to reject partner."
      );
    } finally {
      setActionLoading("");
    }
  };

  /* =========================================
     STATS
  ========================================= */

  const totalPartners =
    partners.length;

  const verifiedPartners =
    partners.filter(
      (partner) =>
        partner.status ===
        "Verified"
    ).length;

  const pendingPartners =
    partners.filter(
      (partner) =>
        partner.status ===
        "Pending"
    ).length;

  const activeCollaborations =
    verifiedPartners;

  const verifiedPercentage =
    totalPartners > 0
      ? (
          (verifiedPartners /
            totalPartners) *
          100
        ).toFixed(1)
      : "0.0";

  /* =========================================
     FILTERED PARTNERS
  ========================================= */

  const filteredPartners =
    useMemo(() => {
      return partners.filter(
        (partner) => {
          const searchText =
            search
              .toLowerCase()
              .trim();

          const companyName =
            partner.companyName
              ?.toLowerCase() ||
            "";

          const contactPerson =
            partner.contactPerson
              ?.toLowerCase() ||
            "";

          const email =
            partner.email?.toLowerCase() ||
            "";

          const matchesSearch =
            companyName.includes(
              searchText
            ) ||
            contactPerson.includes(
              searchText
            ) ||
            email.includes(
              searchText
            );

          const matchesType =
            typeFilter ===
              "All Partner Types" ||
            partner.partnerType ===
              typeFilter;

          const matchesStatus =
            statusFilter ===
              "All Status" ||
            partner.status ===
              statusFilter;

          return (
            matchesSearch &&
            matchesType &&
            matchesStatus
          );
        }
      );
    }, [
      partners,
      search,
      typeFilter,
      statusFilter,
    ]);

  /* =========================================
     VIEW PARTNER
  ========================================= */

  const handleView = (
    partner
  ) => {
    setSelectedPartner(partner);
  };

  /* =========================================
     BACK
  ========================================= */

  const handleBack = () => {
    setSelectedPartner(null);
  };

  /* =========================================
     PARTNER DETAIL PAGE
  ========================================= */

  if (selectedPartner) {
    const company =
      selectedPartner.companyName ||
      "Unknown Company";

    const initials =
      company
        .charAt(0)
        .toUpperCase();

    const approveLoading =
      actionLoading ===
      `approve-${selectedPartner._id}`;

    const rejectLoading =
      actionLoading ===
      `reject-${selectedPartner._id}`;

    return (
      <div className="partners-page">

        {/* BACK */}

        <button
          type="button"
          className="partner-detail-back"
          onClick={handleBack}
        >
          ← Back to Partners
        </button>

        {/* HEADER */}

        <div className="partner-detail-header">

          <div className="partner-detail-identity">

            <div className="partner-detail-avatar">
              {initials}
            </div>

            <div>

              <p className="partners-eyebrow">
                PARTNER DETAILS
              </p>

              <h2>
                {company}
              </h2>

              <span>
                Partner ID: PT-
                {selectedPartner._id
                  ?.slice(-6)
                  .toUpperCase()}
              </span>

            </div>

          </div>

          <span
            className={`partner-status ${getStatusClass(
              selectedPartner.status
            )}`}
          >
            {selectedPartner.status ||
              "Pending"}
          </span>

        </div>

        {/* DETAIL CARD */}

        <div className="partner-detail-card">

          {/* COMPANY INFORMATION */}

          <section className="partner-detail-section">

            <div className="partner-detail-section-title">

              <span>01</span>

              <div>
                <h3>
                  Company Information
                </h3>

                <p>
                  Basic information
                  about the
                  recruitment
                  partner.
                </p>
              </div>

            </div>

            <div className="partner-detail-grid">

              <div>
                <span>
                  Company Name
                </span>

                <strong>
                  {selectedPartner.companyName ||
                    "N/A"}
                </strong>
              </div>

              <div>
                <span>
                  Partner Type
                </span>

                <strong>
                  {selectedPartner.partnerType ||
                    "N/A"}
                </strong>
              </div>

              <div>
                <span>
                  Specialization
                </span>

                <strong>
                  {selectedPartner.specialization ||
                    "N/A"}
                </strong>
              </div>

              <div>
                <span>
                  Geography
                </span>

                <strong>
                  {selectedPartner.geography ||
                    "N/A"}
                </strong>
              </div>

              <div>
                <span>
                  Website
                </span>

                <strong>
                  {selectedPartner.website ||
                    "N/A"}
                </strong>
              </div>

              <div>
                <span>
                  Registration Date
                </span>

                <strong>
                  {selectedPartner.createdAt
                    ? new Date(
                        selectedPartner.createdAt
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month:
                            "short",
                          year:
                            "numeric",
                        }
                      )
                    : "N/A"}
                </strong>
              </div>

            </div>

          </section>

          {/* CONTACT INFORMATION */}

          <section className="partner-detail-section">

            <div className="partner-detail-section-title">

              <span>02</span>

              <div>
                <h3>
                  Contact Information
                </h3>

                <p>
                  Primary contact
                  details for this
                  partner.
                </p>
              </div>

            </div>

            <div className="partner-detail-grid">

              <div>
                <span>
                  Contact Person
                </span>

                <strong>
                  {selectedPartner.contactPerson ||
                    "N/A"}
                </strong>
              </div>

              <div>
                <span>
                  Email
                </span>

                <strong>
                  {selectedPartner.email ||
                    "N/A"}
                </strong>
              </div>

              <div>
                <span>
                  Phone
                </span>

                <strong>
                  {selectedPartner.phone ||
                    selectedPartner.contactNumber ||
                    "N/A"}
                </strong>
              </div>

              <div>
                <span>
                  Alternate Phone
                </span>

                <strong>
                  {selectedPartner.alternatePhone ||
                    "N/A"}
                </strong>
              </div>

            </div>

          </section>

          {/* ADDRESS */}

          <section className="partner-detail-section">

            <div className="partner-detail-section-title">

              <span>03</span>

              <div>
                <h3>
                  Address & Location
                </h3>

                <p>
                  Registered office
                  and location
                  information.
                </p>
              </div>

            </div>

            <div className="partner-detail-grid">

              <div className="full-detail">

                <span>
                  Address
                </span>

                <strong>
                  {selectedPartner.address ||
                    "N/A"}
                </strong>

              </div>

              <div>
                <span>
                  City
                </span>

                <strong>
                  {selectedPartner.city ||
                    "N/A"}
                </strong>
              </div>

              <div>
                <span>
                  State
                </span>

                <strong>
                  {selectedPartner.state ||
                    "N/A"}
                </strong>
              </div>

              <div>
                <span>
                  Country
                </span>

                <strong>
                  {selectedPartner.country ||
                    "N/A"}
                </strong>
              </div>

              <div>
                <span>
                  Postal Code
                </span>

                <strong>
                  {selectedPartner.postalCode ||
                    selectedPartner.pincode ||
                    "N/A"}
                </strong>
              </div>

            </div>

          </section>

          {/* PARTNERSHIP INFORMATION */}

          <section className="partner-detail-section">

            <div className="partner-detail-section-title">

              <span>04</span>

              <div>
                <h3>
                  Partnership
                  Information
                </h3>

                <p>
                  Additional
                  information
                  submitted by the
                  partner.
                </p>
              </div>

            </div>

            <div className="partner-message-box">
              {selectedPartner.message ||
                selectedPartner.about ||
                selectedPartner.description ||
                "No additional information provided."}
            </div>

          </section>

          {/* STATUS */}

          <section className="partner-detail-section">

            <div className="partner-detail-section-title">

              <span>05</span>

              <div>
                <h3>
                  Partnership Status
                </h3>

                <p>
                  Current
                  verification
                  status.
                </p>
              </div>

            </div>

            <div className="partner-status-detail">

              <span
                className={`partner-status ${getStatusClass(
                  selectedPartner.status
                )}`}
              >
                {selectedPartner.status ||
                  "Pending"}
              </span>

            </div>

            {/* ADMIN ACTIONS */}

            {selectedPartner.status ===
              "Pending" && (
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  marginTop:
                    "20px",
                  flexWrap:
                    "wrap",
                }}
              >

                <button
                  type="button"
                  onClick={() =>
                    handleApprove(
                      selectedPartner
                    )
                  }
                  disabled={
                    approveLoading
                  }
                  style={{
                    padding:
                      "10px 18px",
                    border: "none",
                    borderRadius:
                      "8px",
                    cursor:
                      approveLoading
                        ? "not-allowed"
                        : "pointer",
                    background:
                      "#0d3029",
                    color:
                      "#ffffff",
                  }}
                >
                  {approveLoading
                    ? "Approving..."
                    : "Approve Partner"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleReject(
                      selectedPartner
                    )
                  }
                  disabled={
                    rejectLoading
                  }
                  style={{
                    padding:
                      "10px 18px",
                    border: "none",
                    borderRadius:
                      "8px",
                    cursor:
                      rejectLoading
                        ? "not-allowed"
                        : "pointer",
                    background:
                      "#8f2d2d",
                    color:
                      "#ffffff",
                  }}
                >
                  {rejectLoading
                    ? "Rejecting..."
                    : "Reject Partner"}
                </button>

              </div>
            )}

          </section>

        </div>

      </div>
    );
  }

  /* =========================================
     MAIN PARTNERS PAGE
  ========================================= */

  return (
    <div className="partners-page">

      {/* PAGE HEADING */}

      <div className="partners-heading">

        <div>

          <p className="partners-eyebrow">
            PARTNER MANAGEMENT
          </p>

          <h2>
            Partners
          </h2>

          <span>
            Manage recruitment
            partners, verification
            and collaboration
            details.
          </span>

        </div>

        <button
          type="button"
          className="partners-add-btn"
          onClick={
            handleAddPartner
          }
        >
          + Add Partner
        </button>

      </div>

      {/* ERROR */}

      {error && (
        <div
          style={{
            marginBottom:
              "16px",
            padding:
              "12px 16px",
            borderRadius:
              "8px",
            background:
              "#fff1f1",
            color:
              "#b42318",
            border:
              "1px solid #f3c2c2",
          }}
        >
          {error}
        </div>
      )}

      {/* STATS */}

      <div className="partners-stats">

        <div className="partner-stat">

          <span>
            Total Partners
          </span>

          <strong>
            {totalPartners}
          </strong>

          <small>
            Registered partners
          </small>

        </div>

        <div className="partner-stat">

          <span>
            Verified Partners
          </span>

          <strong>
            {verifiedPartners}
          </strong>

          <small>
            {verifiedPercentage}%
            verified
          </small>

        </div>

        <div className="partner-stat">

          <span>
            Pending Verification
          </span>

          <strong>
            {pendingPartners}
          </strong>

          <small>
            Requires admin
            review
          </small>

        </div>

        <div className="partner-stat">

          <span>
            Active Collaborations
          </span>

          <strong>
            {activeCollaborations}
          </strong>

          <small>
            Currently active
          </small>

        </div>

      </div>

      {/* PARTNERS CARD */}

      <section className="partners-card">

        {/* TOOLBAR */}

        <div className="partners-toolbar">

          <div className="partners-search">

            <span>
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search company, contact or email..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

          </div>

          <select
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(
                e.target.value
              )
            }
          >
            <option>
              All Partner Types
            </option>

            <option>
              Recruitment Consultancy
            </option>

            <option>
              Overseas Recruitment
            </option>

            <option>
              Staffing Partner
            </option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
          >
            <option>
              All Status
            </option>

            <option>
              Verified
            </option>

            <option>
              Pending
            </option>

            <option>
              Rejected
            </option>
          </select>

        </div>

        {/* LOADING */}

        {loading && (
          <div
            style={{
              padding:
                "40px",
              textAlign:
                "center",
              color:
                "#64748b",
            }}
          >
            Loading partners...
          </div>
        )}

        {/* EMPTY */}

        {!loading &&
          filteredPartners.length ===
            0 && (
            <div
              style={{
                padding:
                  "50px 20px",
                textAlign:
                  "center",
                color:
                  "#64748b",
              }}
            >
              <strong
                style={{
                  display:
                    "block",
                  marginBottom:
                    "6px",
                  color:
                    "#10243f",
                }}
              >
                No partners found
              </strong>

              <span>
                No partners match
                your current
                search or filter.
              </span>
            </div>
          )}

        {/* PARTNER LIST */}

        {!loading &&
          filteredPartners.length >
            0 && (
            <div
              className="partners-list"
            >

              {filteredPartners.map(
                (partner) => (
                  <div
                    className="partner-row"
                    key={
                      partner._id
                    }
                  >

                    {/* IDENTITY */}

                    <div
                      className="partner-row-identity"
                    >

                      <div className="partner-row-avatar">
                        {(
                          partner.companyName ||
                          "P"
                        )
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>

                        <strong>
                          {
                            partner.companyName ||
                            "Unknown Company"
                          }
                        </strong>

                        <span>
                          {
                            partner.contactPerson ||
                            "No contact person"
                          }
                        </span>

                      </div>

                    </div>

                    {/* CONTACT */}

                    <div className="partner-row-contact">

                      <span>
                        {
                          partner.email ||
                          "N/A"
                        }
                      </span>

                      <span>
                        {
                          partner.phone ||
                          partner.contactNumber ||
                          "N/A"
                        }
                      </span>

                    </div>

                    {/* TYPE */}

                    <div className="partner-row-type">

                      <span>
                        {
                          partner.partnerType ||
                          "N/A"
                        }
                      </span>

                    </div>

                    {/* STATUS */}

                    <div>

                      <span
                        className={`partner-status ${getStatusClass(
                          partner.status
                        )}`}
                      >
                        {
                          partner.status ||
                          "Pending"
                        }
                      </span>

                    </div>

                    {/* ACTION */}

                    <div className="partner-row-action">

                      <button
                        type="button"
                        onClick={() =>
                          handleView(
                            partner
                          )
                        }
                      >
                        View
                      </button>

                    </div>

                  </div>
                )
              )}

            </div>
          )}

      </section>

      {/* ADD PARTNER MODAL */}

      <AddPartnerModal
        isOpen={
          showAddPartner
        }
        onClose={() =>
          setShowAddPartner(
            false
          )
        }
        onPartnerCreated={
          handlePartnerCreated
        }
      />

    </div>
  );
}

export default Partners;