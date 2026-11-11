import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import "./Realestate.css";

// =====================================================
// API CONFIGURATION
// =====================================================

const API_URL =
  "https://66ou0fp7m1.execute-api.ap-south-1.amazonaws.com/prod";

// =====================================================
// COMPONENT
// =====================================================

const Realestate = () => {
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
  // TABLE DATA
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

  const fileInputRef =
    useRef(null);

  // =====================================================
  // LOAD DATA WHEN PAGE OPENS
  // =====================================================

  useEffect(() => {
    loadItems();
  }, []);

  // =====================================================
  // LOAD ITEMS FROM API
  // =====================================================

  const loadItems = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/realestate`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to load data. Status: ${response.status}`
        );
      }

      const data =
        await response.json();

      console.log(
        "Real Estate API Data:",
        data
      );

      // Your Lambda GET returns an array directly
      if (Array.isArray(data)) {
        setItems(data);

        // Keep current page valid
        const totalPages = Math.max(
          1,
          Math.ceil(
            data.length / itemsPerPage
          )
        );

        setCurrentPage((page) =>
          Math.min(page, totalPages)
        );
      } else {
        setItems([]);
      }

    } catch (error) {
      console.error(
        "Load Real Estate Error:",
        error
      );

      alert(
        "Failed to load Real Estate data."
      );

    } finally {
      setLoading(false);
    }
  };

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

    // Only image files
    if (!file.type.startsWith("image/")) {
      alert(
        "Please select an image file."
      );

      e.target.value = "";

      return;
    }

    setImageFile(file);

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
    // ---------------------------------------------------
    // VALIDATION
    // ---------------------------------------------------

    if (!imageFile) {
      alert(
        "Please select an image."
      );

      return;
    }

    if (!name.trim()) {
      alert(
        "Please enter image name."
      );

      return;
    }

    if (saving) return;

    try {
      setSaving(true);

      // =================================================
      // STEP 1
      // GET S3 PRESIGNED UPLOAD URL
      // =================================================

      console.log(
        "Requesting S3 upload URL..."
      );

      const uploadUrlRequest =
        `${API_URL}/realestate` +
        `?upload=true` +
        `&fileName=${encodeURIComponent(
          imageFile.name
        )}` +
        `&fileType=${encodeURIComponent(
          imageFile.type
        )}`;

      const uploadResponse =
        await fetch(
          uploadUrlRequest,
          {
            method: "POST",
          }
        );

      if (!uploadResponse.ok) {
        throw new Error(
          `Failed to generate upload URL. Status: ${uploadResponse.status}`
        );
      }

      const uploadData =
        await uploadResponse.json();

      console.log(
        "Upload URL response:",
        uploadData
      );

      if (
        !uploadData.uploadUrl ||
        !uploadData.key
      ) {
        throw new Error(
          "Upload URL or S3 key was not returned by Lambda."
        );
      }

      // =================================================
      // STEP 2
      // UPLOAD IMAGE DIRECTLY TO S3
      // =================================================

      console.log(
        "Uploading image to S3..."
      );

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
          `S3 image upload failed. Status: ${s3Response.status}`
        );
      }

      console.log(
        "Image uploaded successfully."
      );

      // =================================================
      // STEP 3
      // SAVE METADATA THROUGH LAMBDA
      // =================================================

      const metadata = {
        key: uploadData.key,

        name:
          name.trim() || "-",

        description:
          description.trim() || "-",

        category:
          category || "Banner",
      };

      console.log(
        "Saving metadata:",
        metadata
      );

      const saveResponse =
        await fetch(
          `${API_URL}/realestate`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              metadata
            ),
          }
        );

      if (!saveResponse.ok) {
        throw new Error(
          `Failed to save metadata. Status: ${saveResponse.status}`
        );
      }

      const savedItem =
        await saveResponse.json();

      console.log(
        "Saved Real Estate item:",
        savedItem
      );

      // =================================================
      // STEP 4
      // LOAD FRESH DATA
      // =================================================

      const getResponse =
        await fetch(
          `${API_URL}/realestate`,
          {
            method: "GET",
          }
        );

      if (!getResponse.ok) {
        throw new Error(
          "Item saved, but failed to reload the list."
        );
      }

      const freshItems =
        await getResponse.json();

      if (!Array.isArray(freshItems)) {
        throw new Error(
          "Invalid data returned from GET API."
        );
      }

      setItems(freshItems);

      // =================================================
      // GO TO LAST PAGE
      // =================================================

      const newLastPage =
        Math.max(
          1,
          Math.ceil(
            freshItems.length /
              itemsPerPage
          )
        );

      setCurrentPage(
        newLastPage
      );

      // =================================================
      // RESET FORM
      // =================================================

      resetForm();

      alert(
        "Real Estate image saved successfully."
      );

    } catch (error) {
      console.error(
        "Save Real Estate Error:",
        error
      );

      alert(
        error.message ||
          "Failed to save Real Estate item."
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

    if (fileInputRef.current) {
      fileInputRef.current.value =
        "";
    }
  };

  // =====================================================
  // CANCEL
  // =====================================================

  const handleCancel = () => {
    if (saving) return;

    resetForm();
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

    if (deletingId) {
      return;
    }

    try {
      setDeletingId(id);

      console.log(
        "Deleting Real Estate item:",
        id
      );

      const response =
        await fetch(
          `${API_URL}/realestate?id=${encodeURIComponent(
            id
          )}`,
          {
            method: "DELETE",
          }
        );

      if (!response.ok) {
        throw new Error(
          `Failed to delete item. Status: ${response.status}`
        );
      }

      const data =
        await response.json();

      console.log(
        "Delete response:",
        data
      );

      // =================================================
      // UPDATE LOCAL LIST
      // =================================================

      const updatedItems =
        items.filter(
          (item) =>
            String(item.id) !==
            String(id)
        );

      setItems(
        updatedItems
      );

      // =================================================
      // FIX PAGINATION
      // =================================================

      const totalPagesAfterDelete =
        Math.max(
          1,
          Math.ceil(
            updatedItems.length /
              itemsPerPage
          )
        );

      setCurrentPage(
        (page) =>
          Math.min(
            page,
            totalPagesAfterDelete
          )
      );

      alert(
        "Real Estate item deleted successfully."
      );

    } catch (error) {
      console.error(
        "Delete Real Estate Error:",
        error
      );

      alert(
        error.message ||
          "Failed to delete Real Estate item."
      );

    } finally {
      setDeletingId(null);
    }
  };

  // =====================================================
  // PAGINATION CALCULATION
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
  // RENDER
  // =====================================================

  return (
    <div className="realestate-admin">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="realestate-header">

        <h1>
          Real Estate
        </h1>

        <button
          type="button"
          className="realestate-add-btn"
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

        <div className="realestate-form-card">

          {/* =================================================
              CATEGORY
          ================================================= */}

          <div className="realestate-field">

            <label className="realestate-label">
              Category
            </label>

            <select
              className="realestate-select"
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

              <option value="Smarter Solutions">
                Smarter Solutions
              </option>

              <option value="Real Estate Segments">
                Real Estate Segments
              </option>

              <option value="Work">
                Work
              </option>

            </select>

          </div>

          {/* =================================================
              IMAGE UPLOADER
          ================================================= */}

          <div className="realestate-field">

            <label className="realestate-label">
              Image
            </label>

            <label className="realestate-upload-box">

              {imagePreview ? (

                <div className="realestate-preview-wrapper">

                  <img
                    src={
                      imagePreview
                    }
                    alt="Preview"
                    className="realestate-image-preview"
                  />

                  <span className="realestate-change-text">
                    Change Image
                  </span>

                </div>

              ) : (

                <div className="realestate-upload-placeholder">

                  <span className="realestate-upload-icon">
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
                disabled={saving}
              />

            </label>

          </div>

          {/* =================================================
              NAME
          ================================================= */}

          <div className="realestate-field">

            <label className="realestate-label">
              Name
            </label>

            <input
              type="text"
              className="realestate-input"
              placeholder="Enter image name"
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

          <div className="realestate-field">

            <label className="realestate-label">
              Description
            </label>

            <textarea
              className="realestate-textarea"
              placeholder="Enter image description"
              rows="5"
              value={
                description
              }
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              disabled={saving}
            />

          </div>

          {/* =================================================
              BUTTONS
          ================================================= */}

          <div className="realestate-form-actions">

            <button
              type="button"
              className="realestate-save-btn"
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
              className="realestate-cancel-btn"
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

        <div
          style={{
            textAlign: "center",
            padding: "30px",
          }}
        >
          Loading Real Estate data...
        </div>

      )}

      {/* =================================================
          TABLE
      ================================================= */}

      {!loading &&
        items.length > 0 && (

          <div className="realestate-table-wrapper">

            <table className="realestate-table">

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

                      {/* NO */}

                      <td>
                        {startIndex +
                          index +
                          1}
                      </td>

                      {/* PREVIEW */}

                      <td>

                        {item.preview ? (

                          <img
                            src={
                              item.preview
                            }
                            alt={
                              item.name ||
                              "Real Estate"
                            }
                            className="realestate-table-image"
                          />

                        ) : (

                          <span className="realestate-no-preview">
                            -
                          </span>

                        )}

                      </td>

                      {/* TYPE */}

                      <td>
                        {item.preview
                          ? "Image"
                          : "-"}
                      </td>

                      {/* NAME */}

                      <td>

                        <div className="realestate-name">

                          {item.name ||
                            "-"}

                        </div>

                      </td>

                      {/* DESCRIPTION */}

                      <td>

                        <div className="realestate-description">

                          {item.description ||
                            "-"}

                        </div>

                      </td>

                      {/* CATEGORY */}

                      <td>

                        <span className="realestate-category">

                          {item.category ||
                            "Banner"}

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
                          className="realestate-delete-btn"
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

              <div className="realestate-pagination">

                <button
                  type="button"
                  className="realestate-page-btn previous"
                  disabled={
                    currentPage ===
                    1
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
                      className={`realestate-page-btn ${
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
                  className="realestate-page-btn"
                  disabled={
                    currentPage ===
                    totalPages
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
          EMPTY STATE
      ================================================= */}

      {!loading &&
        items.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "40px 20px",
              color: "#777",
            }}
          >
            No Real Estate images found.
          </div>
        )}

    </div>
  );
};

export default Realestate;