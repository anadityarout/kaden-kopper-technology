import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import "./Videoeditor.css";

// =====================================================
// AWS API
// =====================================================

const API_URL =
  "https://66ou0fp7m1.execute-api.ap-south-1.amazonaws.com/prod/videoeditor";

// =====================================================
// COMPONENT
// =====================================================

const Videoeditor = () => {
  // =====================================================
  // FORM STATE
  // =====================================================

  const [showForm, setShowForm] = useState(false);

  // =====================================================
  // IMAGE STATE
  // =====================================================

  const [imagePreview, setImagePreview] =
    useState("");

  const [imageFile, setImageFile] =
    useState(null);

  // =====================================================
  // FORM DATA
  // =====================================================

  const [category, setCategory] =
    useState("Banner");

  const [name, setName] =
    useState("");

  const [description, setDescription] =
    useState("");

  // =====================================================
  // TABLE DATA
  // =====================================================

  const [items, setItems] =
    useState([]);

  // =====================================================
  // LOADING STATE
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

  // =====================================================
  // FILE INPUT
  // =====================================================

  const fileInputRef = useRef(null);

  // =====================================================
  // CATEGORY OPTIONS
  // =====================================================

  const categories = [
    "Banner",
    "Video Editing",
    "Why Choose",
  ];

  // =====================================================
  // LOAD ITEMS FROM AWS
  // =====================================================

  const loadItems = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        API_URL,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to load items. Status: ${response.status}`
        );
      }

      const data =
        await response.json();

      if (Array.isArray(data)) {
        setItems(data);
      } else {
        setItems([]);
      }

      setCurrentPage(1);
    } catch (error) {
      console.error(
        "Load Video Editor items error:",
        error
      );

      alert(
        "Failed to load Video Editor data."
      );
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
  // ADD IMAGE
  // =====================================================

  const handleAddClick = () => {
    setShowForm(true);

    setImagePreview("");
    setImageFile(null);

    setCategory("Banner");

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

    // -----------------------------------------------
    // IMAGE TYPE VALIDATION
    // -----------------------------------------------

    if (
      !file.type.startsWith("image/")
    ) {
      alert(
        "Please select an image file."
      );

      e.target.value = "";

      return;
    }

    // -----------------------------------------------
    // SAVE FILE
    // -----------------------------------------------

    setImageFile(file);

    // -----------------------------------------------
    // LOCAL PREVIEW ONLY
    // -----------------------------------------------

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
    // IMAGE REQUIRED
    // -----------------------------------------------

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
      // REQUEST PRESIGNED S3 UPLOAD URL
      // =================================================

      const uploadUrlResponse =
        await fetch(
          `${API_URL}?upload=true&fileName=${encodeURIComponent(
            imageFile.name
          )}&fileType=${encodeURIComponent(
            imageFile.type
          )}`,
          {
            method: "GET",
          }
        );

      if (!uploadUrlResponse.ok) {
        throw new Error(
          "Failed to get S3 upload URL."
        );
      }

      const uploadData =
        await uploadUrlResponse.json();

      if (
        !uploadData.uploadUrl ||
        !uploadData.key
      ) {
        throw new Error(
          "Invalid upload response from Lambda."
        );
      }

      // =================================================
      // STEP 2
      // UPLOAD IMAGE DIRECTLY TO S3
      // =================================================

      const s3Response =
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

      if (!s3Response.ok) {
        throw new Error(
          `S3 upload failed. Status: ${s3Response.status}`
        );
      }

      // =================================================
      // STEP 3
      // SAVE IMAGE METADATA TO LAMBDA
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
              key: uploadData.key,

              name: name.trim(),

              description:
                description.trim(),

              category: category,
            }),
          }
        );

      if (!saveResponse.ok) {
        let errorMessage =
          "Failed to save Video Editor data.";

        try {
          const errorData =
            await saveResponse.json();

          if (errorData?.message) {
            errorMessage =
              errorData.message;
          }
        } catch (error) {
          console.error(
            "Error reading save error:",
            error
          );
        }

        throw new Error(
          errorMessage
        );
      }

      // =================================================
      // STEP 4
      // RELOAD DATA FROM AWS
      // =================================================

      await loadItems();

      // =================================================
      // STEP 5
      // RESET FORM
      // =================================================

      resetForm();

      alert(
        "Video Editor item added successfully."
      );
    } catch (error) {
      console.error(
        "Save Video Editor item error:",
        error
      );

      alert(
        error.message ||
          "Failed to save Video Editor item."
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
      // DELETE FROM LAMBDA
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

      if (!response.ok) {
        let errorMessage =
          "Failed to delete item.";

        try {
          const errorData =
            await response.json();

          if (errorData?.message) {
            errorMessage =
              errorData.message;
          }
        } catch (error) {
          console.error(
            "Error reading delete error:",
            error
          );
        }

        throw new Error(
          errorMessage
        );
      }

      // =================================================
      // RELOAD DATA
      // =================================================

      await loadItems();

      alert(
        "Video Editor item deleted successfully."
      );
    } catch (error) {
      console.error(
        "Delete Video Editor item error:",
        error
      );

      alert(
        error.message ||
          "Failed to delete Video Editor item."
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

    setImagePreview("");
    setImageFile(null);

    setCategory("Banner");

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

  const safeTotalPages =
    Math.max(
      1,
      totalPages
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
      page > safeTotalPages
    ) {
      return;
    }

    setCurrentPage(page);
  };

  // =====================================================
  // JSX
  // =====================================================

  return (
    <div className="videoeditor-admin">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="videoeditor-header">

        <h1>
          Video Editor
        </h1>

        <button
          type="button"
          className="videoeditor-add-btn"
          onClick={
            handleAddClick
          }
          disabled={saving}
        >
          + Add Image
        </button>

      </div>

      {/* =================================================
          ADD FORM
      ================================================= */}

      {showForm && (
        <div className="videoeditor-form-card">

          {/* =================================================
              IMAGE UPLOAD
          ================================================= */}

          <div className="videoeditor-field">

            <label className="videoeditor-label">
              Image
            </label>

            <label className="videoeditor-upload-box">

              {imagePreview ? (

                <div className="videoeditor-preview-wrapper">

                  <img
                    src={
                      imagePreview
                    }
                    alt="Preview"
                    className="videoeditor-image-preview"
                  />

                  <span className="videoeditor-change-text">
                    Change Image
                  </span>

                </div>

              ) : (

                <div className="videoeditor-upload-placeholder">

                  <span className="videoeditor-upload-icon">
                    +
                  </span>

                  <span>
                    Choose Image
                  </span>

                </div>

              )}

              <input
                ref={
                  fileInputRef
                }
                type="file"
                accept="image/*"
                onChange={
                  handleImageChange
                }
              />

            </label>

          </div>

          {/* =================================================
              CATEGORY
          ================================================= */}

          <div className="videoeditor-field">

            <label className="videoeditor-label">
              Category
            </label>

            <select
              className="videoeditor-select"
              value={
                category
              }
              onChange={(e) =>
                setCategory(
                  e.target.value
                )
              }
              disabled={saving}
            >

              {categories.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                )
              )}

            </select>

          </div>

          {/* =================================================
              NAME
          ================================================= */}

          <div className="videoeditor-field">

            <label className="videoeditor-label">
              Name
            </label>

            <input
              type="text"
              className="videoeditor-input"
              placeholder="Enter name (optional)"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              disabled={saving}
            />

          </div>

          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <div className="videoeditor-field">

            <label className="videoeditor-label">
              Description
            </label>

            <textarea
              className="videoeditor-textarea"
              placeholder="Enter description (optional)"
              value={
                description
              }
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              rows="5"
              disabled={saving}
            />

          </div>

          {/* =================================================
              SAVE / CANCEL
          ================================================= */}

          <div className="videoeditor-form-actions">

            <button
              type="button"
              className="videoeditor-save-btn"
              onClick={
                handleSave
              }
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save"}
            </button>

            <button
              type="button"
              className="videoeditor-cancel-btn"
              onClick={
                handleCancel
              }
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
        <div className="videoeditor-loading">
          Loading Video Editor data...
        </div>
      )}

      {/* =================================================
          TABLE
      ================================================= */}

      {!loading &&
        items.length > 0 && (

          <div className="videoeditor-table-wrapper">

            <table className="videoeditor-table">

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
                  (
                    item,
                    index
                  ) => (

                    <tr
                      key={
                        item.id
                      }
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
                        item.imageUrl ||
                        item.fileUrl ? (

                          <img
                            src={
                              item.preview ||
                              item.image ||
                              item.imageUrl ||
                              item.fileUrl
                            }
                            alt={
                              item.name ||
                              item.category ||
                              "Video Editor"
                            }
                            className="videoeditor-table-image"
                          />

                        ) : (

                          <span>
                            No Image
                          </span>

                        )}

                      </td>

                      {/* TYPE */}

                      <td>

                        <span className="videoeditor-type">
                          {item.type ||
                            "Image"}
                        </span>

                      </td>

                      {/* NAME */}

                      <td>

                        <div className="videoeditor-name">
                          {item.name ||
                            "-"}
                        </div>

                      </td>

                      {/* DESCRIPTION */}

                      <td>

                        <div className="videoeditor-description">
                          {item.description ||
                            "-"}
                        </div>

                      </td>

                      {/* CATEGORY */}

                      <td>

                        <span className="videoeditor-category">
                          {item.category ||
                            "-"}
                        </span>

                      </td>

                      {/* CREATED */}

                      <td>
                        {item.created ||
                          "-"}
                      </td>

                      {/* DELETE */}

                      <td>

                        <button
                          type="button"
                          className="videoeditor-delete-btn"
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

            {safeTotalPages > 1 && (

              <div className="videoeditor-pagination">

                <button
                  type="button"
                  className="videoeditor-page-btn"
                  disabled={
                    currentPage ===
                      1 ||
                    loading
                  }
                  onClick={() =>
                    handlePageChange(
                      currentPage -
                        1
                    )
                  }
                >
                  Previous
                </button>

                {Array.from(
                  {
                    length:
                      safeTotalPages,
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
                      key={page}
                      className={`videoeditor-page-btn ${
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
                  className="videoeditor-page-btn"
                  disabled={
                    currentPage ===
                      safeTotalPages ||
                    loading
                  }
                  onClick={() =>
                    handlePageChange(
                      currentPage +
                        1
                    )
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
        items.length === 0 &&
        !showForm && (

          <div className="videoeditor-empty">
            No Video Editor items found.
          </div>

        )}

    </div>
  );
};

export default Videoeditor;