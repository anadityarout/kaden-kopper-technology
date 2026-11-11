import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import "./Digitalmarketing.css";

/* =====================================================
   API
===================================================== */

const API_URL =
  "https://66ou0fp7m1.execute-api.ap-south-1.amazonaws.com/prod/digitalmarketing";

/* =====================================================
   COMPONENT
===================================================== */

const Digitalmarketing = () => {
  /* =====================================================
     FORM STATE
  ===================================================== */

  const [showForm, setShowForm] = useState(false);

  const [category, setCategory] = useState("Banner");

  const [imagePreview, setImagePreview] =
    useState("");

  const [imageFile, setImageFile] =
    useState(null);

  const [name, setName] = useState("");

  const [description, setDescription] =
    useState("");

  /* =====================================================
     SAVED ITEMS
  ===================================================== */

  const [items, setItems] = useState([]);

  /* =====================================================
     LOADING STATE
  ===================================================== */

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] =
    useState(null);

  /* =====================================================
     PAGINATION
  ===================================================== */

  const [currentPage, setCurrentPage] =
    useState(1);

  const itemsPerPage = 5;

  const fileInputRef = useRef(null);

  /* =====================================================
     LOAD DATA FROM AWS
  ===================================================== */

  const loadItems = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(
          `GET request failed: ${response.status}`
        );
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setItems(data);

        /* Keep current page valid */

        const totalPages = Math.max(
          1,
          Math.ceil(
            data.length / itemsPerPage
          )
        );

        setCurrentPage((prevPage) =>
          Math.min(prevPage, totalPages)
        );
      } else {
        setItems([]);
      }
    } catch (error) {
      console.error(
        "Error loading Digital Marketing data:",
        error
      );

      alert(
        "Unable to load Digital Marketing data."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     LOAD DATA WHEN PAGE OPENS
  ===================================================== */

  useEffect(() => {
    loadItems();
  }, []);

  /* =====================================================
     ADD IMAGE
  ===================================================== */

  const handleAddImage = () => {
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

  /* =====================================================
     IMAGE CHANGE
  ===================================================== */

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    /* Only images */

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");

      e.target.value = "";

      return;
    }

    setImageFile(file);

    /* Local preview only */

    const reader = new FileReader();

    reader.onloadend = () => {
      setImagePreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  /* =====================================================
     SAVE
  ===================================================== */

  const handleSave = async () => {
    if (!imageFile) {
      alert("Please select an image.");

      return;
    }

    if (!name.trim()) {
      alert("Please enter name.");

      return;
    }

    if (!description.trim()) {
      alert("Please enter description.");

      return;
    }

    try {
      setSaving(true);

      /* =================================================
         STEP 1
         GET PRESIGNED S3 UPLOAD URL
      ================================================= */

      const uploadUrlRequest =
        `${API_URL}?upload=true` +
        `&fileName=${encodeURIComponent(
          imageFile.name
        )}` +
        `&fileType=${encodeURIComponent(
          imageFile.type
        )}`;

      const uploadResponse =
        await fetch(uploadUrlRequest);

      if (!uploadResponse.ok) {
        throw new Error(
          `Upload URL request failed: ${uploadResponse.status}`
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

      /* =================================================
         STEP 2
         UPLOAD IMAGE DIRECTLY TO S3
      ================================================= */

      const s3Response = await fetch(
        uploadData.uploadUrl,
        {
          method: "PUT",

          headers: {
            "Content-Type": imageFile.type,
          },

          body: imageFile,
        }
      );

      if (!s3Response.ok) {
        throw new Error(
          `S3 upload failed: ${s3Response.status}`
        );
      }

      /* =================================================
         STEP 3
         SAVE METADATA TO LAMBDA
      ================================================= */

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

            category: category,
          }),
        });

      if (!saveResponse.ok) {
        let errorMessage =
          "Failed to save Digital Marketing data.";

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

        throw new Error(errorMessage);
      }

      /* =================================================
         STEP 4
         RELOAD DATA FROM AWS
      ================================================= */

      await loadItems();

      /* =================================================
         OPEN LAST PAGE
      ================================================= */

      const nextTotalItems =
        items.length + 1;

      const newPage = Math.ceil(
        nextTotalItems / itemsPerPage
      );

      setCurrentPage(newPage);

      /* =================================================
         RESET FORM
      ================================================= */

      resetForm();

      alert(
        "Digital Marketing image saved successfully."
      );
    } catch (error) {
      console.error(
        "Save error:",
        error
      );

      alert(
        error.message ||
          "Failed to save Digital Marketing image."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     RESET FORM
  ===================================================== */

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

  /* =====================================================
     CANCEL
  ===================================================== */

  const handleCancel = () => {
    resetForm();
  };

  /* =====================================================
     DELETE
  ===================================================== */

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this image?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeletingId(id);

      /* =================================================
         DELETE FROM LAMBDA
      ================================================= */

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

      if (!response.ok) {
        let errorMessage =
          "Failed to delete image.";

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

        throw new Error(errorMessage);
      }

      /* =================================================
         RELOAD FROM AWS
      ================================================= */

      await loadItems();

      alert(
        "Digital Marketing image deleted successfully."
      );
    } catch (error) {
      console.error(
        "Delete error:",
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

  /* =====================================================
     PAGINATION DATA
  ===================================================== */

  const totalPages = Math.ceil(
    items.length / itemsPerPage
  );

  const startIndex =
    (currentPage - 1) * itemsPerPage;

  const currentItems = items.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  /* =====================================================
     PAGE CHANGE
  ===================================================== */

  const handlePageChange = (page) => {
    if (
      page < 1 ||
      page > totalPages
    ) {
      return;
    }

    setCurrentPage(page);
  };

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="digitalmarketing-admin">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="digitalmarketing-header">

        <h1>
          Digital Marketing
        </h1>

        <button
          type="button"
          className="digitalmarketing-add-btn"
          onClick={handleAddImage}
        >
          + Add Image
        </button>

      </div>

      {/* =================================================
          ADD FORM
      ================================================= */}

      {showForm && (
        <div className="digitalmarketing-form-card">

          {/* =================================================
              CATEGORY
          ================================================= */}

          <div className="digitalmarketing-field">

            <label className="digitalmarketing-label">
              Category
            </label>

            <select
              className="digitalmarketing-select"
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value
                )
              }
            >

              <option value="Banner">
                Banner
              </option>

              <option value="Digital Marketing">
                Digital Marketing
              </option>

            </select>

          </div>

          {/* =================================================
              IMAGE UPLOADER
          ================================================= */}

          <div className="digitalmarketing-field">

            <label className="digitalmarketing-label">
              Upload Image
            </label>

            <label className="digitalmarketing-upload-box">

              {imagePreview ? (
                <div className="digitalmarketing-preview-wrapper">

                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="digitalmarketing-image-preview"
                  />

                  <span className="digitalmarketing-change-text">
                    Change Image
                  </span>

                </div>
              ) : (
                <div className="digitalmarketing-upload-placeholder">

                  <span className="digitalmarketing-upload-icon">
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
              />

            </label>

          </div>

          {/* =================================================
              NAME
          ================================================= */}

          <div className="digitalmarketing-field">

            <label className="digitalmarketing-label">
              Name
            </label>

            <input
              type="text"
              className="digitalmarketing-input"
              placeholder="Enter name"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
            />

          </div>

          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <div className="digitalmarketing-field">

            <label className="digitalmarketing-label">
              Description
            </label>

            <textarea
              className="digitalmarketing-textarea"
              placeholder="Enter description"
              rows="5"
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
            />

          </div>

          {/* =================================================
              BUTTONS
          ================================================= */}

          <div className="digitalmarketing-form-actions">

            <button
              type="button"
              className="digitalmarketing-save-btn"
              onClick={handleSave}
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save"}
            </button>

            <button
              type="button"
              className="digitalmarketing-cancel-btn"
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
            padding: "20px",
            textAlign: "center",
          }}
        >
          Loading Digital Marketing data...
        </div>
      )}

      {/* =================================================
          TABLE
      ================================================= */}

      {!loading && items.length > 0 && (
        <div className="digitalmarketing-table-wrapper">

          <table className="digitalmarketing-table">

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
                (item, index) => {

                  const serialNumber =
                    startIndex +
                    index +
                    1;

                  const imageUrl =
                    item.preview ||
                    item.image ||
                    item.imageUrl ||
                    item.fileUrl ||
                    "";

                  return (
                    <tr
                      key={item.id}
                    >

                      {/* =================================================
                          NUMBER
                      ================================================= */}

                      <td>
                        {serialNumber}
                      </td>

                      {/* =================================================
                          PREVIEW
                      ================================================= */}

                      <td>

                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={
                              item.name ||
                              "Digital Marketing"
                            }
                            className="digitalmarketing-table-image"
                          />
                        ) : (
                          <span>
                            No Image
                          </span>
                        )}

                      </td>

                      {/* =================================================
                          TYPE
                      ================================================= */}

                      <td>
                        {item.type ||
                          "Image"}
                      </td>

                      {/* =================================================
                          NAME
                      ================================================= */}

                      <td>

                        <div className="digitalmarketing-name">
                          {item.name}
                        </div>

                      </td>

                      {/* =================================================
                          DESCRIPTION
                      ================================================= */}

                      <td>

                        <div className="digitalmarketing-description">
                          {item.description}
                        </div>

                      </td>

                      {/* =================================================
                          CATEGORY
                      ================================================= */}

                      <td>
                        {item.category}
                      </td>

                      {/* =================================================
                          CREATED
                      ================================================= */}

                      <td>
                        {item.created}
                      </td>

                      {/* =================================================
                          ACTION
                      ================================================= */}

                      <td>

                        <button
                          type="button"
                          className="digitalmarketing-delete-btn"
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
                  );
                }
              )}

            </tbody>

          </table>

          {/* =================================================
              PAGINATION
          ================================================= */}

          {totalPages > 1 && (
            <div className="digitalmarketing-pagination">

              <button
                type="button"
                className="digitalmarketing-page-btn previous"
                disabled={
                  currentPage === 1
                }
                onClick={() =>
                  handlePageChange(
                    currentPage - 1
                  )
                }
              >
                Previous
              </button>

              {Array.from(
                {
                  length: totalPages,
                },
                (_, index) =>
                  index + 1
              ).map((page) => (

                <button
                  type="button"
                  key={page}
                  className={`digitalmarketing-page-btn ${
                    currentPage === page
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

              ))}

              <button
                type="button"
                className="digitalmarketing-page-btn"
                disabled={
                  currentPage ===
                  totalPages
                }
                onClick={() =>
                  handlePageChange(
                    currentPage + 1
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
        items.length === 0 && (
          <div
            style={{
              padding: "30px",
              textAlign: "center",
              color: "#777",
            }}
          >
            No Digital Marketing images
            uploaded yet.
          </div>
        )}

    </div>
  );
};

export default Digitalmarketing;