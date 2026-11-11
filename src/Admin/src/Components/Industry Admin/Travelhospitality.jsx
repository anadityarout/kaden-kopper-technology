import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import "./Travelhospitality.css";

// =====================================================
// API
// =====================================================

const API_URL =
  "https://66ou0fp7m1.execute-api.ap-south-1.amazonaws.com/prod/travelhospitality";

// =====================================================
// COMPONENT
// =====================================================

const Travelhospitality = () => {
  // =====================================================
  // FORM STATE
  // =====================================================

  const [showForm, setShowForm] = useState(false);

  const [category, setCategory] =
    useState("Banner");

  const [imagePreview, setImagePreview] =
    useState("");

  const [imageFile, setImageFile] =
    useState(null);

  const [name, setName] =
    useState("");

  const [description, setDescription] =
    useState("");

  // =====================================================
  // ITEMS
  // =====================================================

  const [items, setItems] =
    useState([]);

  // =====================================================
  // LOADING STATES
  // =====================================================

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState(null);

  // =====================================================
  // ERROR / MESSAGE
  // =====================================================

  const [error, setError] =
    useState("");

  // =====================================================
  // PAGINATION
  // =====================================================

  const [currentPage, setCurrentPage] =
    useState(1);

  const itemsPerPage = 5;

  const fileInputRef =
    useRef(null);

  // =====================================================
  // LOAD DATA
  // =====================================================

  const loadItems = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await fetch(API_URL);

      if (!response.ok) {
        throw new Error(
          `Failed to load data. Status: ${response.status}`
        );
      }

      const data =
        await response.json();

      if (Array.isArray(data)) {
        setItems(data);
      } else {
        console.error(
          "Unexpected API response:",
          data
        );

        setItems([]);
      }
    } catch (err) {
      console.error(
        "Load Travel Hospitality Error:",
        err
      );

      setError(
        "Unable to load Travel & Hospitality data."
      );

      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD WHEN PAGE OPENS
  // =====================================================

  useEffect(() => {
    loadItems();
  }, []);

  // =====================================================
  // OPEN ADD FORM
  // =====================================================

  const handleAddClick = () => {
    setShowForm(true);

    setCategory("Banner");

    setImagePreview("");

    setImageFile(null);

    setName("");

    setDescription("");

    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // =====================================================
  // IMAGE CHANGE
  // =====================================================

  const handleImageChange = (e) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    // Only images
    if (!file.type.startsWith("image/")) {
      alert(
        "Please select an image file."
      );

      e.target.value = "";

      return;
    }

    setImageFile(file);

    // Local preview
    const reader =
      new FileReader();

    reader.onloadend = () => {
      setImagePreview(
        reader.result
      );
    };

    reader.readAsDataURL(file);
  };

  // =====================================================
  // SAVE
  // =====================================================

  const handleSave = async () => {
    // -----------------------------------------------
    // Validation
    // -----------------------------------------------

    if (!imageFile) {
      alert("Please choose an image.");

      return;
    }

    

    try {
      setSaving(true);
      setError("");

      // =================================================
      // STEP 1
      // GET PRESIGNED S3 URL
      // =================================================

      const uploadUrlRequest =
        `${API_URL}?upload=true` +
        `&fileName=${encodeURIComponent(
          imageFile.name
        )}` +
        `&fileType=${encodeURIComponent(
          imageFile.type
        )}`;

      const uploadResponse =
        await fetch(
          uploadUrlRequest
        );

      if (!uploadResponse.ok) {
        throw new Error(
          `Unable to generate upload URL. Status: ${uploadResponse.status}`
        );
      }

      const uploadData =
        await uploadResponse.json();

      if (!uploadData.uploadUrl) {
        throw new Error(
          "Upload URL was not returned by Lambda."
        );
      }

      if (!uploadData.key) {
        throw new Error(
          "S3 image key was not returned by Lambda."
        );
      }

      // =================================================
      // STEP 2
      // UPLOAD IMAGE DIRECTLY TO S3
      // =================================================

      const s3UploadResponse =
        await fetch(
          uploadData.uploadUrl,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                imageFile.type,
            },

            body: imageFile,
          }
        );

      if (!s3UploadResponse.ok) {
        throw new Error(
          `Image upload failed. Status: ${s3UploadResponse.status}`
        );
      }

      // =================================================
      // STEP 3
      // SAVE METADATA IN LAMBDA / JSON
      // =================================================

      const saveResponse =
        await fetch(API_URL, {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            key: uploadData.key,

            name: name.trim(),

            description:
              description.trim(),

            category:
              category,
          }),
        });

      if (!saveResponse.ok) {
        const errorData =
          await saveResponse
            .json()
            .catch(() => null);

        throw new Error(
          errorData?.message ||
            `Unable to save item. Status: ${saveResponse.status}`
        );
      }

      // =================================================
      // STEP 4
      // RELOAD DATA
      // =================================================

      await loadItems();

      // =================================================
      // STEP 5
      // RESET FORM
      // =================================================

      resetForm();

    } catch (err) {
      console.error(
        "Save Travel Hospitality Error:",
        err
      );

      setError(
        err.message ||
          "Unable to save Travel & Hospitality item."
      );

      alert(
        err.message ||
          "Unable to save Travel & Hospitality item."
      );

    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (id) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this item?"
      );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");

      // =================================================
      // DELETE FROM LAMBDA
      // =================================================

      const response =
        await fetch(API_URL, {
          method: "DELETE",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            id: id,
          }),
        });

      const data =
        await response
          .json()
          .catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            `Delete failed. Status: ${response.status}`
        );
      }

      // =================================================
      // RELOAD DATA
      // =================================================

      await loadItems();

      // =================================================
      // PAGINATION FIX
      // =================================================

      setCurrentPage((page) => {
        const remainingItems =
          items.length - 1;

        const totalPagesAfterDelete =
          Math.max(
            1,
            Math.ceil(
              remainingItems /
                itemsPerPage
            )
          );

        return Math.min(
          page,
          totalPagesAfterDelete
        );
      });

    } catch (err) {
      console.error(
        "Delete Travel Hospitality Error:",
        err
      );

      setError(
        err.message ||
          "Unable to delete item."
      );

      alert(
        err.message ||
          "Unable to delete item."
      );

    } finally {
      setDeletingId(null);
    }
  };

  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {
    setShowForm(false);

    setCategory("Banner");

    setImagePreview("");

    setImageFile(null);

    setName("");

    setDescription("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // =====================================================
  // CANCEL
  // =====================================================

  const handleCancel = () => {
    resetForm();
  };

  // =====================================================
  // PAGINATION
  // =====================================================

  const totalPages =
    Math.ceil(
      items.length /
        itemsPerPage
    );

  const startIndex =
    (currentPage - 1) *
    itemsPerPage;

  const currentItems =
    items.slice(
      startIndex,
      startIndex +
        itemsPerPage
    );

  // =====================================================
  // PAGE CHANGE
  // =====================================================

  const handlePageChange = (
    page
  ) => {
    if (
      page < 1 ||
      page > totalPages
    ) {
      return;
    }

    setCurrentPage(page);
  };

  // =====================================================
  // PREVIOUS
  // =====================================================

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(
        (prev) => prev - 1
      );
    }
  };

  // =====================================================
  // NEXT
  // =====================================================

  const handleNext = () => {
    if (
      currentPage <
      totalPages
    ) {
      setCurrentPage(
        (prev) => prev + 1
      );
    }
  };

  // =====================================================
  // PAGE NUMBERS
  // =====================================================

  const pageNumbers = [];

  for (
    let page = 1;
    page <= totalPages;
    page++
  ) {
    pageNumbers.push(page);
  }

  // =====================================================
  // JSX
  // =====================================================

  return (
    <div className="travel-admin">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="travel-header">

        <h1>
          Travel &amp; Hospitality
        </h1>

        <button
          type="button"
          className="travel-add-btn"
          onClick={handleAddClick}
          disabled={saving}
        >
          + Add Image
        </button>

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="travel-error">
          {error}
        </div>
      )}

      {/* =================================================
          ADD FORM
      ================================================= */}

      {showForm && (
        <div className="travel-form-card">

          {/* CATEGORY */}

          <div className="travel-field">

            <label className="travel-label">
              Category
            </label>

            <select
              className="travel-select"
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value
                )
              }
              disabled={saving}
            >

              <option value="Banner">
                Banner
              </option>

              <option value="Why Choose Us">
                Why Choose Us
              </option>

              <option value="Success Story">
                Success Story
              </option>

              <option value="Real Experiences">
                Real Experiences
              </option>

              <option value="Travel Business">
                Travel Business
              </option>

              <option value="Latest Innovations">
                Latest Innovations
              </option>

            </select>

          </div>

          {/* IMAGE UPLOAD */}

          <div className="travel-field">

            <label className="travel-label">
              Image
            </label>

            <label className="travel-upload-box">

              {imagePreview ? (
                <div className="travel-preview-wrapper">

                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="travel-image-preview"
                  />

                  <span className="travel-change-text">
                    Change Image
                  </span>

                </div>
              ) : (
                <div className="travel-upload-placeholder">

                  <span className="travel-upload-icon">
                    +
                  </span>

                  <span>
                    Choose Image
                  </span>

                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={
                  handleImageChange
                }
                disabled={saving}
              />

            </label>

          </div>

          {/* NAME */}

          <div className="travel-field">

            <label className="travel-label">
              Name
            </label>

            <input
              type="text"
              className="travel-input"
              placeholder="Image Name"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              disabled={saving}
            />

          </div>

          {/* DESCRIPTION */}

          <div className="travel-field">

            <label className="travel-label">
              Description
            </label>

            <textarea
              className="travel-textarea"
              placeholder="Image Description"
              rows="5"
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              disabled={saving}
            />

          </div>

          {/* SAVE / CANCEL */}

          <div className="travel-form-actions">

            <button
              type="button"
              className="travel-save-btn"
              onClick={handleSave}
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save"}
            </button>

            <button
              type="button"
              className="travel-cancel-btn"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </button>

          </div>

        </div>
      )}

      {/* =================================================
          LOADING
      ================================================= */}

      {loading ? (
        <div className="travel-loading">
          Loading Travel &amp;
          Hospitality data...
        </div>
      ) : (
        <>
          {/* =================================================
              TABLE
          ================================================= */}

          {items.length > 0 && (
            <div className="travel-table-wrapper">

              <table className="travel-table">

                <thead>

                  <tr>
                    <th>No</th>
                    <th>Preview</th>
                    <th>Type</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Created</th>
                    <th>Action</th>
                  </tr>

                </thead>

                <tbody>

                  {currentItems.map(
                    (item, index) => (

                      <tr
                        key={item.id}
                      >

                        {/* NO */}

                        <td>
                          {startIndex +
                            index +
                            1}
                        </td>

                        {/* PREVIEW */}

                        <td>

                          {item.preview ||
                          item.image ||
                          item.imageUrl ? (
                            <img
                              src={
                                item.preview ||
                                item.image ||
                                item.imageUrl
                              }
                              alt={
                                item.name ||
                                "Travel Hospitality"
                              }
                              className="travel-table-image"
                            />
                          ) : (
                            <div className="travel-no-image">
                              -
                            </div>
                          )}

                        </td>

                        {/* TYPE */}

                        <td>
                          {item.type ||
                            "Image"}
                        </td>

                        {/* NAME */}

                        <td>
                          <div className="travel-name">
                            {item.name ||
                              "-"}
                          </div>
                        </td>

                        {/* DESCRIPTION */}

                        <td>

                          <div className="travel-description">
                            {item.description ||
                              "-"}
                          </div>

                        </td>

                        {/* CATEGORY */}

                        <td>
                          {item.category ||
                            "-"}
                        </td>

                        {/* CREATED */}

                        <td>
                          {item.created ||
                            "-"}
                        </td>

                        {/* ACTION */}

                        <td>

                          <button
                            type="button"
                            className="travel-delete-btn"
                            onClick={() =>
                              handleDelete(
                                item.id
                              )
                            }
                            disabled={
                              deletingId ===
                              item.id
                            }
                          >
                            {deletingId ===
                            item.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

              {/* =================================================
                  PAGINATION
              ================================================= */}

              {totalPages > 1 && (
                <div className="travel-pagination">

                  <button
                    type="button"
                    className="travel-page-btn travel-prev-next"
                    disabled={
                      currentPage ===
                      1
                    }
                    onClick={
                      handlePrevious
                    }
                  >
                    Previous
                  </button>

                  {pageNumbers.map(
                    (page) => (

                      <button
                        type="button"
                        key={page}
                        className={`travel-page-btn ${
                          currentPage ===
                          page
                            ? "active"
                            : ""
                        }`}
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

                  <button
                    type="button"
                    className="travel-page-btn travel-prev-next"
                    disabled={
                      currentPage ===
                      totalPages
                    }
                    onClick={
                      handleNext
                    }
                  >
                    Next
                  </button>

                </div>
              )}

            </div>
          )}

          {/* =================================================
              EMPTY STATE
          ================================================= */}

          {items.length === 0 && !showForm && (
  <div className="travel-empty">
    <p>
      No Travel &amp; Hospitality images added yet.
    </p>
  </div>
)}

        </>
      )}

    </div>
  );
};

export default Travelhospitality;