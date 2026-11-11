
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  RefreshCw,
  Search,
  Users,
  CalendarCheck,
  Mail,
  Eye,
  Trash2,
  X,
} from "lucide-react";

import "./Leads.css";

// =====================================================
// AWS API CONFIGURATION
// =====================================================

const LEADS_API_URL =
  "https://66ou0fp7m1.execute-api.ap-south-1.amazonaws.com/prod/consultations";

const STORAGE_KEYS = {
  customers: "customerLeads",
};

const FILTER_OPTIONS = [
  { value: "all", label: "All Leads" },
  { value: "customers", label: "Customer Leads" },
  { value: "consultations", label: "Book Consultants" },
  { value: "contacts", label: "Contact Leads" },
];

const TYPE_LABELS = {
  customers: "Customer",
  consultations: "Book Consultant",
  contacts: "Contact",
};

// =====================================================
// HELPER FUNCTIONS
// =====================================================

function readLocalLeads(key) {
  try {
    const stored = localStorage.getItem(key);

    if (!stored) return [];

    const parsed = JSON.parse(stored);

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Unable to read local leads:", error);
    return [];
  }
}

function firstValue(record, keys, fallback = "—") {
  for (const key of keys) {
    const value = record?.[key];

    if (
      value !== undefined &&
      value !== null &&
      String(value).trim() !== ""
    ) {
      return String(value);
    }
  }

  return fallback;
}

function formatTopic(value) {
  if (!value || value === "—") return "—";

  return String(value)
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatDateTime(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

function normalizeLead(record, type, index) {
  return {
    ...record,

    _leadId: String(
      record?.id ??
      record?.leadId ??
      record?.key ??
      `${type}-${index}`
    ),

    _type: type,

    _name: firstValue(record, [
      "fullName",
      "name",
      "customerName",
      "contactName",
      "full_name",
    ]),

    _email: firstValue(record, [
      "email",
      "emailAddress",
      "email_address",
    ]),

    _phone: firstValue(record, [
      "phone",
      "phoneNumber",
      "mobile",
      "mobileNumber",
      "phone_number",
    ]),

    _topic: firstValue(record, [
      "topic",
      "inquiryTopic",
      "service",
      "projectType",
      "product",
      "productService",
    ]),

    _subject: firstValue(record, ["subject"]),

    _requirements: firstValue(record, [
      "requirements",
      "message",
      "description",
      "details",
      "comments",
    ]),

    _status: firstValue(record, ["status"], "New"),

    _createdAt: firstValue(
      record,
      [
        "createdAt",
        "created_at",
        "submittedAt",
        "timestamp",
        "date",
      ],
      ""
    ),
  };
}

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function Leads() {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [leads, setLeads] = useState({
    customers: [],
    consultations: [],
    contacts: [],
  });

  const [selectedLead, setSelectedLead] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [apiError, setApiError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // ===================================================
  // FETCH LEADS
  // ===================================================

  const loadLeads = useCallback(async () => {
    setRefreshing(true);
    setApiError("");

    try {
      const response = await fetch(LEADS_API_URL, {
        method: "GET",
      });

      const result = await response.json();

      if (!response.ok || result.success !== true) {
        throw new Error(
          result.message || "Unable to load leads."
        );
      }

      const apiLeads = Array.isArray(result.leads)
        ? result.leads
        : [];

      const customers = readLocalLeads(
        STORAGE_KEYS.customers
      ).map((item, index) =>
        normalizeLead(item, "customers", index)
      );

      const consultations = apiLeads
        .filter((item) => item.source !== "contact")
        .map((item, index) =>
          normalizeLead(item, "consultations", index)
        );

      const contacts = apiLeads
        .filter((item) => item.source === "contact")
        .map((item, index) =>
          normalizeLead(item, "contacts", index)
        );

      setLeads({
        customers,
        consultations,
        contacts,
      });
    } catch (error) {
      console.error("Unable to fetch leads:", error);

      setApiError(
        "Unable to load leads from AWS. Check your API URL, CORS settings, and connection."
      );
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  // ===================================================
  // COMBINE AND FILTER
  // ===================================================

  const allLeads = useMemo(
    () => [
      ...leads.customers,
      ...leads.consultations,
      ...leads.contacts,
    ],
    [leads]
  );

  const filteredLeads = useMemo(() => {
    const source =
      filter === "all"
        ? allLeads
        : leads[filter] || [];

    const query = searchTerm.trim().toLowerCase();

    if (!query) return source;

    return source.filter((lead) =>
      [
        lead._name,
        lead._email,
        lead._phone,
        lead._topic,
        lead._subject,
        lead._requirements,
        lead._status,
        TYPE_LABELS[lead._type],
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [filter, allLeads, leads, searchTerm]);

  const title =
    FILTER_OPTIONS.find((option) => option.value === filter)
      ?.label || "All Leads";

  // ===================================================
  // DELETE LEAD
  // ===================================================

  const handleDelete = async (lead) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the lead from ${lead._name}?`
    );

    if (!confirmed) return;

    setDeletingId(lead._leadId);
    setDeleteError("");

    try {
      if (lead._type === "customers") {
        const original = readLocalLeads(
          STORAGE_KEYS.customers
        );

        const updated = original.filter((item, index) => {
          const id = String(
            item?.id ??
            item?.leadId ??
            item?.key ??
            `customers-${index}`
          );

          return id !== lead._leadId;
        });

        localStorage.setItem(
          STORAGE_KEYS.customers,
          JSON.stringify(updated)
        );
      } else {
        const response = await fetch(LEADS_API_URL, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: lead._leadId,
          }),
        });

        const result = await response.json();

        if (!response.ok || result.success !== true) {
          throw new Error(
            result.message || "Unable to delete lead."
          );
        }
      }

      if (
        selectedLead?._leadId === lead._leadId &&
        selectedLead?._type === lead._type
      ) {
        setSelectedLead(null);
      }

      await loadLeads();
    } catch (error) {
      console.error("Unable to delete lead:", error);

      setDeleteError(
        error.message || "Unable to delete this lead."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <section className="leads-page">
      {/* HEADER */}

      <header className="leads-page-header">
        <div>
          <p className="leads-eyebrow">ADMIN DASHBOARD</p>

          <h1>Customer Leads</h1>

          <p className="leads-subtitle">
            Manage customer enquiries and consultation requests.
          </p>
        </div>

        <button
          type="button"
          className="leads-refresh-button"
          onClick={loadLeads}
          disabled={refreshing}
        >
          <RefreshCw
            size={16}
            className={refreshing ? "leads-spin" : ""}
          />

          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </header>

      {/* ERRORS */}

      {apiError && (
        <div className="leads-api-error" role="alert">
          {apiError}
        </div>
      )}

      {deleteError && (
        <div className="leads-api-error" role="alert">
          {deleteError}
        </div>
      )}

      {/* STATISTICS */}

      <div className="leads-stats-grid">
        <article className="leads-stat-card">
          <span className="leads-stat-icon leads-icon-consult">
            <CalendarCheck size={20} />
          </span>

          <div className="leads-stat-label">
            Book Consultants
          </div>

          <strong>{leads.consultations.length}</strong>
        </article>

        <article className="leads-stat-card">
          <span className="leads-stat-icon leads-icon-contact">
            <Mail size={20} />
          </span>

          <div className="leads-stat-label">
            Contact Enquiries
          </div>

          <strong>{leads.contacts.length}</strong>
        </article>

        <article className="leads-stat-card">
          <span className="leads-stat-icon leads-icon-total">
            <Users size={20} />
          </span>

          <div className="leads-stat-label">
            Total Leads
          </div>

          <strong>{allLeads.length}</strong>
        </article>
      </div>

      {/* FILTER AND SEARCH */}

      <div className="leads-toolbar">
        <label
          className="leads-filter-wrap"
          htmlFor="leads-filter"
        >
          <span>Filter leads</span>

          <select
            id="leads-filter"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            {FILTER_OPTIONS.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label
          className="leads-search"
          htmlFor="leads-search"
        >
          <Search size={17} />

          <input
            id="leads-search"
            type="search"
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            placeholder="Search name, email, phone..."
          />
        </label>
      </div>

      {/* LEADS TABLE */}

      <div className="leads-table-card">
        <div className="leads-table-heading">
          <div>
            <h2>{filter === "all" ? "All Leads" : title}</h2>

            <p>
              Review each enquiry and open a record for full details.
            </p>
          </div>

          <span className="leads-count-pill">
            {filteredLeads.length} total
          </span>
        </div>

        {refreshing && allLeads.length === 0 ? (
          <div className="leads-empty-state">
            <RefreshCw size={24} className="leads-spin" />
            <h3>Loading leads...</h3>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="leads-empty-state">
            <Users size={28} />
            <h3>No leads found</h3>
            <p>
              {apiError
                ? "Check the API error above and try refreshing."
                : "No records match your current filter."}
            </p>
          </div>
        ) : (
          <div className="leads-table-scroll">
            <table className="leads-table">
              <thead>
                <tr>
                  <th>Sl. No.</th>
                  <th>Type</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Product / Service</th>
                  <th>Requirements</th>
                  <th>Status</th>
                  <th>Date &amp; Time</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredLeads.map((lead, index) => (
                  <tr
                    key={`${lead._type}-${lead._leadId}`}
                  >
                    <td>{index + 1}</td>

                    <td>
                      <span
                        className={`leads-type-badge leads-type-${lead._type}`}
                      >
                        {TYPE_LABELS[lead._type]}
                      </span>
                    </td>

                    <td className="leads-name-cell">
                      <span className="leads-avatar">
                        {lead._name !== "—"
                          ? lead._name.charAt(0).toUpperCase()
                          : "?"}
                      </span>

                      <strong>{lead._name}</strong>
                    </td>

                    <td>{lead._email}</td>

                    <td>{lead._phone}</td>

                    <td>
                      {formatTopic(lead._topic)}

                      {lead._subject !== "—" && (
                        <div className="leads-secondary-text">
                          <strong>Subject:</strong>{" "}
                          {lead._subject}
                        </div>
                      )}
                    </td>

                    <td className="leads-requirements">
                      {lead._requirements}
                    </td>

                    <td>
                      <span className="leads-status-badge">
                        {lead._status}
                      </span>
                    </td>

                    <td className="leads-date-time">
                      {formatDateTime(lead._createdAt)}
                    </td>

                    <td>
                      <div className="leads-row-actions">
                        <button
                          type="button"
                          className="leads-view-button"
                          onClick={() => setSelectedLead(lead)}
                          aria-label={`View ${lead._name}`}
                        >
                          <Eye size={15} />
                          View
                        </button>

                        <button
                          type="button"
                          className="leads-delete-text-button"
                          disabled={deletingId === lead._leadId}
                          onClick={() => handleDelete(lead)}
                          aria-label={`Delete ${lead._name}`}
                        >
                          <Trash2 size={15} />

                          {deletingId === lead._leadId
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DETAILS MODAL */}

      {selectedLead && (
        <div
          className="leads-detail-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedLead(null);
            }
          }}
        >
          <section
            className="leads-detail-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="leads-detail-title"
          >
            <div className="leads-detail-header">
              <div>
                <p>LEAD DETAILS</p>

                <h2 id="leads-detail-title">
                  {selectedLead._name}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                aria-label="Close details"
              >
                <X size={20} />
              </button>
            </div>

            <dl className="leads-detail-grid">
              <div>
                <dt>Serial Number</dt>
                <dd>
                  {filteredLeads.findIndex(
                    (lead) =>
                      lead._leadId === selectedLead._leadId &&
                      lead._type === selectedLead._type
                  ) + 1}
                </dd>
              </div>

              <div>
                <dt>Type</dt>
                <dd>{TYPE_LABELS[selectedLead._type]}</dd>
              </div>

              <div>
                <dt>Full Name</dt>
                <dd>{selectedLead._name}</dd>
              </div>

              <div>
                <dt>Email</dt>
                <dd>{selectedLead._email}</dd>
              </div>

              <div>
                <dt>Phone Number</dt>
                <dd>{selectedLead._phone}</dd>
              </div>

              <div>
                <dt>Product / Service</dt>
                <dd>{formatTopic(selectedLead._topic)}</dd>
              </div>

              <div>
                <dt>Subject</dt>
                <dd>{selectedLead._subject}</dd>
              </div>

              <div>
                <dt>Status</dt>
                <dd>{selectedLead._status}</dd>
              </div>

              <div>
                <dt>Submitted</dt>
                <dd>{formatDateTime(selectedLead._createdAt)}</dd>
              </div>

              <div className="leads-detail-message">
                <dt>Requirements / Message</dt>
                <dd>{selectedLead._requirements}</dd>
              </div>
            </dl>

            <div className="leads-detail-footer">
              <button
                type="button"
                className="leads-modal-close"
                onClick={() => setSelectedLead(null)}
              >
                Close
              </button>

              <button
                type="button"
                className="leads-delete-text-button"
                disabled={deletingId === selectedLead._leadId}
                onClick={() => handleDelete(selectedLead)}
              >
                <Trash2 size={15} />
                Delete
              </button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}
