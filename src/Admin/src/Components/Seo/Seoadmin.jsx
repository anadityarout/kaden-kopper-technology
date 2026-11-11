import React, { useState, useEffect, useCallback } from "react";
import "./Seo.css";

// =====================================================
// AWS API CONFIGURATION
// =====================================================

const API_URL =
  "https://66ou0fp7m1.execute-api.ap-south-1.amazonaws.com/prod/seo";

// =====================================================
// PAGE OPTIONS
// These names must match the pages you want to manage.
// =====================================================

const PAGE_OPTIONS = [
  "Home",
  "About",
  "Service",
  "Web Development",
  "App Development",
  "SEO",
  "Video Editor",
  "Graphic Designer",
  "Marketing",
  "Industries",
  "Project",
  "Career",
];

const EMPTY_FORM = {
  page: "",
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
  canonicalUrl: "",
  alternativeText: "",
};

// =====================================================
// API RESPONSE HELPER
// =====================================================

async function parseResponse(response) {
  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error("The server returned an invalid response.");
  }

  if (!response.ok || data.success === false) {
    throw new Error(
      data.message || `Request failed (${response.status}).`
    );
  }

  return data;
}

// =====================================================
// SEO ADMIN COMPONENT
// =====================================================

function Seoadmin() {
  const [seoList, setSeoList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  // ===================================================
  // GET SEO DATA FROM AWS
  // ===================================================

  const fetchSEO = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const data = await parseResponse(response);

      // Lambda returns records in data.seo.
      setSeoList(Array.isArray(data.seo) ? data.seo : []);
    } catch (err) {
      console.error("Unable to fetch SEO data:", err);
      setError(err.message || "Unable to load SEO data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSEO();
  }, [fetchSEO]);

  // ===================================================
  // OPEN ADD SEO FORM
  // ===================================================

  const handleAddSEO = () => {
    setFormData(EMPTY_FORM);
    setError("");
    setShowForm(true);
  };

  // ===================================================
  // HANDLE FORM INPUTS
  // ===================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ===================================================
  // SAVE SEO TO AWS S3 THROUGH LAMBDA
  // ===================================================

  const handleSave = async (event) => {
    event.preventDefault();

    if (!formData.page) {
      setError("Please select a page.");
      return;
    }

    const duplicate = seoList.some(
      (item) =>
        String(item.page || "").toLowerCase() ===
        formData.page.toLowerCase()
    );

    if (duplicate) {
      setError(
        "SEO details already exist for this page. Please select another page."
      );
      return;
    }

    setSaving(true);
    setError("");

    try {
      const payload = {
        page: formData.page,
        metaTitle: formData.metaTitle.trim(),
        metaDescription: formData.metaDescription.trim(),
        metaKeywords: formData.metaKeywords.trim(),
        canonicalUrl: formData.canonicalUrl.trim(),
        alternativeText: formData.alternativeText.trim(),
      };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await parseResponse(response);

      if (!data.seo) {
        throw new Error("The server did not return the saved SEO record.");
      }

      // Reload the authoritative records from S3.
      await fetchSEO();

      setShowForm(false);
      setFormData(EMPTY_FORM);

      alert("SEO saved successfully to AWS S3.");
    } catch (err) {
      console.error("Unable to save SEO:", err);
      setError(err.message || "Unable to save SEO data.");
    } finally {
      setSaving(false);
    }
  };

  // ===================================================
  // CANCEL FORM
  // ===================================================

  const handleCancel = () => {
    setShowForm(false);
    setFormData(EMPTY_FORM);
    setError("");
  };

  // ===================================================
  // DELETE SEO FROM AWS S3
  // ===================================================

  const handleDelete = async (id) => {
    if (!id) {
      setError("SEO record ID is missing.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this SEO record?"
    );

    if (!confirmed) return;

    setDeletingId(id);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/${encodeURIComponent(id)}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
          },
        }
      );

      await parseResponse(response);

      // Refresh the table using the backend data.
      await fetchSEO();

      alert("SEO deleted successfully.");
    } catch (err) {
      console.error("Unable to delete SEO:", err);
      setError(err.message || "Unable to delete SEO data.");
    } finally {
      setDeletingId(null);
    }
  };

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="seo-page">
      {/* PAGE HEADER */}

      <header className="seo-header">
        <h1>SEO Management</h1>

        <button
          type="button"
          className="seo-add-btn"
          onClick={handleAddSEO}
          disabled={saving}
        >
          + Add SEO
        </button>
      </header>

      {/* ERROR MESSAGE */}

      {error && (
        <div className="seo-error" role="alert">
          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      {/* ADD SEO FORM */}

      {showForm && (
        <section className="seo-form-card">
          <div className="seo-form-header">
            <div>
              <h2>Add SEO</h2>
              <p>
                Select a page and enter the SEO information you need.
              </p>
            </div>
          </div>

          <form className="seo-form" onSubmit={handleSave}>
            <div className="seo-field">
              <label htmlFor="seo-page">Select Page</label>

              <select
                id="seo-page"
                name="page"
                value={formData.page}
                onChange={handleChange}
                required
                disabled={saving}
              >
                <option value="">Select Page</option>

                {PAGE_OPTIONS.map((page) => (
                  <option key={page} value={page}>
                    {page}
                  </option>
                ))}
              </select>
            </div>

            <div className="seo-field">
              <label htmlFor="seo-title">Meta Title</label>

              <input
                id="seo-title"
                type="text"
                name="metaTitle"
                placeholder="Meta Title"
                value={formData.metaTitle}
                onChange={handleChange}
                maxLength={300}
                disabled={saving}
              />
            </div>

            <div className="seo-field">
              <label htmlFor="seo-description">
                Meta Description
              </label>

              <textarea
                id="seo-description"
                name="metaDescription"
                placeholder="Meta Description"
                value={formData.metaDescription}
                onChange={handleChange}
                rows={5}
                maxLength={10000}
                disabled={saving}
              />
            </div>

            <div className="seo-field">
              <label htmlFor="seo-keywords">Meta Keywords</label>

              <input
                id="seo-keywords"
                type="text"
                name="metaKeywords"
                placeholder="Meta Keywords"
                value={formData.metaKeywords}
                onChange={handleChange}
                maxLength={10000}
                disabled={saving}
              />
            </div>

            <div className="seo-field">
              <label htmlFor="seo-canonical">Canonical URL</label>

              <input
                id="seo-canonical"
                type="url"
                name="canonicalUrl"
                placeholder="https://yourwebsite.com/"
                value={formData.canonicalUrl}
                onChange={handleChange}
                maxLength={10000}
                disabled={saving}
              />
            </div>

            <div className="seo-field">
              <label htmlFor="seo-alt">Alternative Text</label>

              <input
                id="seo-alt"
                type="text"
                name="alternativeText"
                placeholder="Alternative Text"
                value={formData.alternativeText}
                onChange={handleChange}
                maxLength={10000}
                disabled={saving}
              />
            </div>

            {/* FORM BUTTONS */}

            <div className="seo-form-actions">
              <button
                type="submit"
                className="seo-save-btn"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save SEO"}
              </button>

              <button
                type="button"
                className="seo-cancel-btn"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {/* SEO RECORDS TABLE */}

      {!showForm && (
        <section className="seo-list-card">
          <div className="seo-table-wrapper">
            <table className="seo-table">
              <thead>
                <tr>
                  <th>Page</th>
                  <th>Meta Title</th>
                  <th>Description</th>
                  <th>Keywords</th>
                  <th>Canonical URL</th>
                  <th>Alt Text</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="seo-empty">
                      Loading SEO records...
                    </td>
                  </tr>
                ) : seoList.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="seo-empty">
                      No SEO data available. Click Add SEO to begin.
                    </td>
                  </tr>
                ) : (
                  seoList.map((item) => (
                    <tr key={item.id}>
                      <td>{item.page || "—"}</td>

                      <td>{item.metaTitle || "—"}</td>

                      <td>{item.metaDescription || "—"}</td>

                      <td>{item.metaKeywords || "—"}</td>

                      <td>
                        {item.canonicalUrl ? (
                          <a
                            href={item.canonicalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {item.canonicalUrl}
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>

                      <td>{item.alternativeText || "—"}</td>

                      {/* DELETE ONLY — NO EDIT BUTTON */}

                      <td>
                        <div className="seo-actions">
                          <button
                            type="button"
                            className="seo-delete-btn"
                            onClick={() => handleDelete(item.id)}
                            disabled={deletingId === item.id}
                          >
                            {deletingId === item.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

export default Seoadmin;