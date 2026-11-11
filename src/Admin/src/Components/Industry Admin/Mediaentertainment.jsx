import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import "./Mediaentertainment.css";

// =====================================================
// API CONFIGURATION
// =====================================================

const API_URL =
  "https://66Ou0fp7m1.execute-api.ap-south-1.amazonaws.com/prod/mediaentertainment";

// =====================================================
// COMPONENT
// =====================================================

const Mediaentertainment = () => {

  // =====================================================
  // FORM
  // =====================================================

  const [showForm, setShowForm] =
    useState(false);

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
  // DATA
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
  // PAGINATION
  // =====================================================

  const [currentPage, setCurrentPage] =
    useState(1);

  const itemsPerPage = 5;

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
      startIndex + itemsPerPage
    );

  // =====================================================
  // FILE INPUT
  // =====================================================

  const fileInputRef =
    useRef(null);

  // =====================================================
  // LOAD DATA FROM AWS
  // =====================================================

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {

    try {

      setLoading(true);

      const response =
        await fetch(API_URL);

      if (!response.ok) {

        throw new Error(
          "Failed to load Media & Entertainment data."
        );
      }

      const data =
        await response.json();

      const loadedItems =
        Array.isArray(data)
          ? data
          : [];

      setItems(
        loadedItems
      );

      return loadedItems;

    } catch (error) {

      console.error(
        "Media & Entertainment GET error:",
        error
      );

      alert(
        error.message ||
          "Failed to load Media & Entertainment data."
      );

      setItems([]);

      return [];

    } finally {

      setLoading(false);
    }
  };

  // =====================================================
  // OPEN FORM
  // =====================================================

  const handleAddClick = () => {

    setShowForm(true);

    setCategory("Banner");

    setImagePreview("");

    setImageFile(null);

    setName("");

    setDescription("");

    if (
      fileInputRef.current
    ) {

      fileInputRef.current.value =
        "";
    }
  };

  // =====================================================
  // CATEGORY CHANGE
  // =====================================================

  const handleCategoryChange = (
    e
  ) => {

    setCategory(
      e.target.value
    );
  };

  // =====================================================
  // IMAGE CHANGE
  // =====================================================

  const handleImageChange = (
    e
  ) => {

    const file =
      e.target.files?.[0];

    if (!file) {
      return;
    }

    // =================================================
    // IMAGE TYPE VALIDATION
    // =================================================

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {

      alert(
        "Please select a valid image file."
      );

      e.target.value = "";

      return;
    }

    // =================================================
    // OPTIONAL SIZE VALIDATION
    // =================================================

    const maxSize =
      10 * 1024 * 1024;

    if (
      file.size >
      maxSize
    ) {

      alert(
        "Image size must be less than 10 MB."
      );

      e.target.value = "";

      return;
    }

    // =================================================
    // SAVE FILE
    // =================================================

    setImageFile(file);

    // =================================================
    // LOCAL PREVIEW
    // =================================================

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

    // =================================================
    // IMAGE VALIDATION
    // =================================================

    if (!imageFile) {

      alert(
        "Please select an image."
      );

      return;
    }

    try {

      setSaving(true);

      // =================================================
      // STEP 1
      // REQUEST PRESIGNED S3 URL
      // =================================================

      const uploadResponse =
        await fetch(

          `${API_URL}?upload=true&fileName=${encodeURIComponent(
            imageFile.name
          )}&fileType=${encodeURIComponent(
            imageFile.type
          )}`,

          {
            method: "POST",
          }
        );

      // =================================================
      // READ RESPONSE
      // =================================================

      const uploadData =
        await uploadResponse.json();

      if (
        !uploadResponse.ok
      ) {

        throw new Error(
          uploadData.message ||
            "Could not create S3 upload URL."
        );
      }

      const uploadUrl =
        uploadData.uploadUrl;

      const key =
        uploadData.key;

      if (
        !uploadUrl ||
        !key
      ) {

        throw new Error(
          "Invalid upload response from server."
        );
      }

      // =================================================
      // STEP 2
      // UPLOAD IMAGE DIRECTLY TO S3
      // =================================================

      const s3Response =
        await fetch(
          uploadUrl,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                imageFile.type,
            },

            body: imageFile,
          }
        );

      if (
        !s3Response.ok
      ) {

        throw new Error(
          "Image upload to S3 failed."
        );
      }

      // =================================================
      // STEP 3
      // SAVE IMAGE METADATA
      // =================================================

      const saveResponse =
        await fetch(
          API_URL,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              key: key,

              name:
                name.trim() ||
                "-",

              description:
                description.trim() ||
                "-",

              category:
                category ||
                "Banner",
            }),
          }
        );

      const saveData =
        await saveResponse.json();

      if (
        !saveResponse.ok
      ) {

        throw new Error(
          saveData.message ||
            "Failed to save image information."
        );
      }

      // =================================================
      // STEP 4
      // RELOAD DATA FROM AWS
      // =================================================

      const updatedItems =
        await loadItems();

      // =================================================
      // GO TO LAST PAGE
      // =================================================

      const newTotalPages =
        Math.max(
          1,
          Math.ceil(
            updatedItems.length /
              itemsPerPage
          )
        );

      setCurrentPage(
        newTotalPages
      );

      // =================================================
      // RESET FORM
      // =================================================

      resetForm();

      alert(
        "Image uploaded successfully."
      );

    } catch (error) {

      console.error(
        "Media & Entertainment save error:",
        error
      );

      alert(
        error.message ||
          "Failed to upload image."
      );

    } finally {

      setSaving(false);
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

    if (
      fileInputRef.current
    ) {

      fileInputRef.current.value =
        "";
    }
  };

  // =====================================================
  // CANCEL
  // =====================================================

  const handleCancel = () => {

    if (saving) {
      return;
    }

    resetForm();
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (
    id
  ) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this item?"
      );

    if (!confirmDelete) {
      return;
    }

    try {

      setDeletingId(id);

      // =================================================
      // DELETE FROM AWS
      // =================================================

      const response =
        await fetch(
          API_URL,
          {
            method: "DELETE",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              id: id,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {

        throw new Error(
          data.message ||
            "Failed to delete item."
        );
      }

      // =================================================
      // RELOAD DATA
      // =================================================

      const updatedItems =
        await loadItems();

      // =================================================
      // UPDATE PAGINATION
      // =================================================

      const newTotalPages =
        Math.max(
          1,
          Math.ceil(
            updatedItems.length /
              itemsPerPage
          )
        );

      if (
        currentPage >
        newTotalPages
      ) {

        setCurrentPage(
          newTotalPages
        );
      }

      alert(
        "Image deleted successfully."
      );

    } catch (error) {

      console.error(
        "Media & Entertainment delete error:",
        error
      );

      alert(
        error.message ||
          "Failed to delete image."
      );

    } finally {

      setDeletingId(null);
    }
  };

  // =====================================================
  // PAGE CHANGE
  // =====================================================

  const handlePageChange = (
    page
  ) => {

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // PREVIOUS
  // =====================================================

  const handlePrevious = () => {

    if (
      currentPage > 1
    ) {

      handlePageChange(
        currentPage - 1
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

      handlePageChange(
        currentPage + 1
      );
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="mediaentertainment-admin">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mediaentertainment-header">

        <h1>
          Media & Entertainment
        </h1>

        <button
          type="button"
          className="mediaentertainment-add-btn"
          onClick={handleAddClick}
          disabled={saving}
        >
          + Add Image
        </button>

      </div>

      {/* =================================================
          FORM
      ================================================= */}

      {showForm && (

        <div className="mediaentertainment-form-card">

          {/* =============================================
              CATEGORY
          ============================================= */}

          <div className="mediaentertainment-field">

            <label>
              Category
            </label>

            <select
              value={category}
              onChange={
                handleCategoryChange
              }
              disabled={saving}
            >

              <option value="Banner">
                Banner
              </option>

              <option value="Why Choose Us">
                Why Choose Us
              </option>

              <option value="Projects">
                Projects
              </option>

              <option value="Latest Image">
                Latest Image
              </option>

            </select>

          </div>

          {/* =============================================
              IMAGE UPLOAD
          ============================================= */}

          <div className="mediaentertainment-field">

            <label className="mediaentertainment-upload-box">

              {imagePreview ? (

                <div className="mediaentertainment-preview-wrapper">

                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mediaentertainment-image-preview"
                  />

                  <span className="mediaentertainment-change-text">
                    Change Image
                  </span>

                </div>

              ) : (

                <div className="mediaentertainment-upload-placeholder">

                  <span className="mediaentertainment-upload-icon">
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

          {/* =============================================
              NAME
          ============================================= */}

          <div className="mediaentertainment-field">

            <input
              type="text"
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

          {/* =============================================
              DESCRIPTION
          ============================================= */}

          <div className="mediaentertainment-field">

            <textarea
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

          {/* =============================================
              ACTION BUTTONS
          ============================================= */}

          <div className="mediaentertainment-form-actions">

            <button
              type="button"
              className="mediaentertainment-save-btn"
              onClick={handleSave}
              disabled={saving}
            >

              {saving
                ? "Uploading..."
                : "Save"}

            </button>

            <button
              type="button"
              className="mediaentertainment-cancel-btn"
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

      {loading && (

        <div
          style={{
            textAlign: "center",
            padding: "30px",
          }}
        >
          Loading Media & Entertainment...
        </div>

      )}

      {/* =================================================
          TABLE
      ================================================= */}

      {!loading &&
        items.length > 0 && (

          <div className="mediaentertainment-table-wrapper">

            <table className="mediaentertainment-table">

              <thead>

                <tr>

                  <th>
                    No
                  </th>

                  <th>
                    Preview
                  </th>

                  <th>
                    Type
                  </th>

                  <th>
                    Name
                  </th>

                  <th>
                    Description
                  </th>

                  <th>
                    Category
                  </th>

                  <th>
                    Created
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {currentItems.map(
                  (
                    item,
                    index
                  ) => (

                    <tr
                      key={
                        item.id
                      }
                    >

                      {/* =================================
                          NUMBER
                      ================================= */}

                      <td>
                        {
                          startIndex +
                          index +
                          1
                        }
                      </td>

                      {/* =================================
                          IMAGE
                      ================================= */}

                      <td>

                        <img
                          src={
                            item.preview ||
                            item.image ||
                            item.imageUrl ||
                            item.fileUrl
                          }
                          alt={
                            item.name ||
                            "Media & Entertainment"
                          }
                          className="mediaentertainment-table-image"
                        />

                      </td>

                      {/* =================================
                          TYPE
                      ================================= */}

                      <td>
                        {
                          item.type ||
                          "Image"
                        }
                      </td>

                      {/* =================================
                          NAME
                      ================================= */}

                      <td>

                        <div className="mediaentertainment-name">

                          {
                            item.name ||
                            "-"
                          }

                        </div>

                      </td>

                      {/* =================================
                          DESCRIPTION
                      ================================= */}

                      <td>

                        <div className="mediaentertainment-description">

                          {
                            item.description ||
                            "-"
                          }

                        </div>

                      </td>

                      {/* =================================
                          CATEGORY
                      ================================= */}

                      <td>
                        {
                          item.category ||
                          "-"
                        }
                      </td>

                      {/* =================================
                          CREATED
                      ================================= */}

                      <td>
                        {
                          item.created ||
                          "-"
                        }
                      </td>

                      {/* =================================
                          ACTION
                      ================================= */}

                      <td>

                        <button
                          type="button"
                          className="mediaentertainment-delete-btn"
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

            {/* =============================================
                PAGINATION
            ============================================= */}

            {totalPages > 1 && (

              <div className="mediaentertainment-pagination">

                {/* =========================================
                    PREVIOUS
                ========================================= */}

                <button
                  type="button"
                  className="mediaentertainment-page-btn"
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

                {/* =========================================
                    PAGE NUMBERS
                ========================================= */}

                {Array.from(
                  {
                    length:
                      totalPages,
                  },
                  (
                    _,
                    index
                  ) =>
                    index + 1
                ).map(
                  (page) => (

                    <button
                      type="button"
                      key={
                        page
                      }
                      className={`mediaentertainment-page-btn ${
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

                {/* =========================================
                    NEXT
                ========================================= */}

                <button
                  type="button"
                  className="mediaentertainment-page-btn"
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
          NO DATA
      ================================================= */}

      {!loading &&
        items.length === 0 && (
          <div
            style={{
              textAlign:
                "center",
              padding:
                "40px 20px",
            }}
          >
            No Media & Entertainment
            images found.
          </div>
        )}

    </div>
  );
};

export default Mediaentertainment;