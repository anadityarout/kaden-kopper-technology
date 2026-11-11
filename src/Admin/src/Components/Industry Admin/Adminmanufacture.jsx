import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import "./Adminmanufacture.css";

// =====================================================
// API URL
// =====================================================

const API_URL =
  "https://66ou0fp7m1.execute-api.ap-south-1.amazonaws.com/prod/manufacturing";

// =====================================================
// COMPONENT
// =====================================================

const Adminmanufacture = () => {

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
  // SAVED ITEMS
  // =====================================================

  const [items, setItems] =
    useState([]);

  // =====================================================
  // LOADING
  // =====================================================

  const [loading, setLoading] =
    useState(false);

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

  // =====================================================
  // FILE INPUT
  // =====================================================

  const fileInputRef =
    useRef(null);

  // =====================================================
  // LOAD ITEMS FROM AWS
  // =====================================================

  const loadItems = async () => {
    try {

      setLoading(true);

      const response =
        await fetch(API_URL, {
          method: "GET",
        });

      if (!response.ok) {

        let errorMessage =
          "Failed to load Manufacturing items.";

        try {

          const errorData =
            await response.json();

          if (errorData?.message) {
            errorMessage =
              errorData.message;
          }

        } catch {
          // Ignore JSON parsing error
        }

        throw new Error(
          errorMessage
        );
      }

      const data =
        await response.json();

      // =================================================
      // MAKE SURE DATA IS ARRAY
      // =================================================

      if (Array.isArray(data)) {

        setItems(data);

      } else {

        setItems([]);
      }

    } catch (error) {

      console.error(
        "Manufacturing GET error:",
        error
      );

      alert(
        error.message ||
          "Failed to load Manufacturing images."
      );

      setItems([]);

    } finally {

      setLoading(false);
    }
  };

  // =====================================================
  // LOAD DATA WHEN PAGE OPENS
  // =====================================================

  useEffect(() => {

    loadItems();

  }, []);

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

    if (!file) {
      return;
    }

    // =================================================
    // IMAGE TYPE VALIDATION
    // =================================================

    if (!file.type.startsWith("image/")) {

      alert(
        "Please select an image file."
      );

      e.target.value = "";

      return;
    }

    // =================================================
    // STORE FILE
    // =================================================

    setImageFile(file);

    // =================================================
    // CREATE LOCAL PREVIEW
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
    // VALIDATE IMAGE
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
      // CHECK RESPONSE
      // =================================================

      if (!uploadResponse.ok) {

        let errorMessage =
          "Failed to generate S3 upload URL.";

        try {

          const errorData =
            await uploadResponse.json();

          if (errorData?.message) {

            errorMessage =
              errorData.message;
          }

        } catch {
          // Ignore JSON parsing error
        }

        throw new Error(
          errorMessage
        );
      }

      // =================================================
      // GET UPLOAD URL + KEY
      // =================================================

      const uploadData =
        await uploadResponse.json();

      const uploadUrl =
        uploadData?.uploadUrl;

      const key =
        uploadData?.key;

      if (!uploadUrl || !key) {

        throw new Error(
          "Upload URL or S3 key was not returned."
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

      if (!s3Response.ok) {

        throw new Error(
          "Failed to upload image to S3."
        );
      }

      // =================================================
      // STEP 3
      // SAVE METADATA
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

              key,

              name:
                name.trim() || "-",

              description:
                description.trim() || "-",

              category:
                category || "Banner",
            }),
          }
        );

      // =================================================
      // CHECK METADATA RESPONSE
      // =================================================

      if (!saveResponse.ok) {

        let errorMessage =
          "Failed to save Manufacturing information.";

        try {

          const errorData =
            await saveResponse.json();

          if (errorData?.message) {

            errorMessage =
              errorData.message;
          }

        } catch {
          // Ignore JSON parsing error
        }

        throw new Error(
          errorMessage
        );
      }

      // =================================================
      // REFRESH ITEMS
      // =================================================

      await loadItems();

      // =================================================
      // RESET PAGE
      // =================================================

      setCurrentPage(1);

      // =================================================
      // RESET FORM
      // =================================================

      resetForm();

      // =================================================
      // SUCCESS MESSAGE
      // =================================================

      alert(
        "Manufacturing image uploaded successfully."
      );

    } catch (error) {

      console.error(
        "Manufacturing upload error:",
        error
      );

      alert(
        error.message ||
          "Failed to upload Manufacturing image."
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

      // =================================================
      // DELETE REQUEST
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
              id,
            }),
          }
        );

      // =================================================
      // RESPONSE DATA
      // =================================================

      let data = {};

      try {

        data =
          await response.json();

      } catch {
        data = {};
      }

      // =================================================
      // CHECK RESPONSE
      // =================================================

      if (!response.ok) {

        throw new Error(
          data?.message ||
            "Failed to delete Manufacturing item."
        );
      }

      // =================================================
      // UPDATE LOCAL STATE
      // =================================================

      setItems((prevItems) => {

        const updatedItems =
          prevItems.filter(
            (item) =>
              String(item.id) !==
              String(id)
          );

        // ===============================================
        // CALCULATE NEW PAGE COUNT
        // ===============================================

        const newTotalPages =
          Math.max(
            1,
            Math.ceil(
              updatedItems.length /
                itemsPerPage
            )
          );

        // ===============================================
        // KEEP CURRENT PAGE VALID
        // ===============================================

        setCurrentPage(
          (page) =>
            Math.min(
              page,
              newTotalPages
            )
        );

        return updatedItems;
      });

      alert(
        "Manufacturing item deleted successfully."
      );

    } catch (error) {

      console.error(
        "Manufacturing delete error:",
        error
      );

      alert(
        error.message ||
          "Failed to delete Manufacturing item."
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

  const handlePageChange = (page) => {

    if (
      page < 1 ||
      page > totalPages
    ) {
      return;
    }

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

    if (currentPage > 1) {

      setCurrentPage(
        (prev) => prev - 1
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
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

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
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
    <div className="manufacture-admin">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="manufacture-header">

        <h1>
          Manufacturing
        </h1>

        <button
          type="button"
          className="manufacture-add-btn"
          onClick={handleAddClick}
          disabled={saving}
        >
          + Add Image
        </button>

      </div>

      {/* =================================================
          ADD FORM
      ================================================= */}

      {showForm && (

        <div className="manufacture-form-card">

          {/* =============================================
              CATEGORY
          ============================================= */}

          <div className="manufacture-field">

            <label className="manufacture-label">
              Category
            </label>

            <select
              className="manufacture-select"
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

            </select>

          </div>

          {/* =============================================
              IMAGE
          ============================================= */}

          <div className="manufacture-field">

            <label className="manufacture-label">
              Image
            </label>

            <label className="manufacture-upload-box">

              {imagePreview ? (

                <div className="manufacture-preview-wrapper">

                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="manufacture-image-preview"
                  />

                  <span className="manufacture-change-text">
                    Change Image
                  </span>

                </div>

              ) : (

                <div className="manufacture-upload-placeholder">

                  <span className="manufacture-upload-icon">
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
                onChange={handleImageChange}
                disabled={saving}
              />

            </label>

          </div>

          {/* =============================================
              NAME
          ============================================= */}

          <div className="manufacture-field">

            <label className="manufacture-label">
              Name
            </label>

            <input
              type="text"
              className="manufacture-input"
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

          <div className="manufacture-field">

            <label className="manufacture-label">
              Description
            </label>

            <textarea
              className="manufacture-textarea"
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
              ACTIONS
          ============================================= */}

          <div className="manufacture-form-actions">

            <button
              type="button"
              className="manufacture-save-btn"
              onClick={handleSave}
              disabled={saving}
            >

              {saving
                ? "Uploading..."
                : "Save"}

            </button>

            <button
              type="button"
              className="manufacture-cancel-btn"
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
            padding: "30px",
            textAlign: "center",
          }}
        >
          Loading Manufacturing images...
        </div>

      )}

      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {!loading &&
        items.length === 0 && (
          <div
            style={{
              padding: "40px 20px",
              textAlign: "center",
            }}
          >
            No Manufacturing images found.
          </div>
        )}

      {/* =================================================
          TABLE
      ================================================= */}

      {!loading &&
        items.length > 0 && (

          <div className="manufacture-table-wrapper">

            <table className="manufacture-table">

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
                  (item, index) => (

                    <tr
                      key={item.id}
                    >

                      {/* =================================
                          NO
                      ================================= */}

                      <td>
                        {startIndex +
                          index +
                          1}
                      </td>

                      {/* =================================
                          PREVIEW
                      ================================= */}

                      <td>

                        {item.preview ? (

                          <img
                            src={item.preview}
                            alt={
                              item.name ||
                              "Manufacturing"
                            }
                            className="manufacture-table-image"
                          />

                        ) : (

                          <div className="manufacture-no-image">
                            -
                          </div>

                        )}

                      </td>

                      {/* =================================
                          TYPE
                      ================================= */}

                      <td>
                        {item.preview
                          ? "Image"
                          : "-"}
                      </td>

                      {/* =================================
                          NAME
                      ================================= */}

                      <td>

                        <div className="manufacture-name">

                          {item.name ||
                            "-"}

                        </div>

                      </td>

                      {/* =================================
                          DESCRIPTION
                      ================================= */}

                      <td>

                        <div className="manufacture-description">

                          {item.description ||
                            "-"}

                        </div>

                      </td>

                      {/* =================================
                          CATEGORY
                      ================================= */}

                      <td>
                        {item.category ||
                          "-"}
                      </td>

                      {/* =================================
                          CREATED
                      ================================= */}

                      <td>
                        {item.created ||
                          "-"}
                      </td>

                      {/* =================================
                          ACTION
                      ================================= */}

                      <td>

                        <button
                          type="button"
                          className="manufacture-delete-btn"
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

            {/* ===========================================
                PAGINATION
            =========================================== */}

            {totalPages > 1 && (

              <div className="manufacture-pagination">

                <button
                  type="button"
                  className="manufacture-page-btn manufacture-prev-next"
                  disabled={
                    currentPage === 1
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
                      className={`manufacture-page-btn ${
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
                  className="manufacture-page-btn manufacture-prev-next"
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

    </div>
  );
};

export default Adminmanufacture;