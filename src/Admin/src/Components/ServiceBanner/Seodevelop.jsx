import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import "./Seodevelop.css";

// =====================================================
// API URL
// =====================================================

const API_URL =
  "https://66ou0fp7m1.execute-api.ap-south-1.amazonaws.com/prod/seodevelop";

const Seodevelop = () => {
  // =====================================================
  // FORM STATE
  // =====================================================

  const [showForm, setShowForm] = useState(false);

  // =====================================================
  // IMAGE STATE
  // =====================================================

  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);

  // =====================================================
  // FORM DATA
  // =====================================================

  const [category, setCategory] = useState("Banner");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // =====================================================
  // TABLE DATA
  // =====================================================

  const [items, setItems] = useState([]);

  // =====================================================
  // LOADING STATE
  // =====================================================

  const [loading, setLoading] = useState(false);

  // =====================================================
  // PAGINATION
  // =====================================================

  const [currentPage, setCurrentPage] = useState(1);

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
    "SEO Development",
    "Why Choose",
  ];

  // =====================================================
  // LOAD DATA FROM AWS
  // =====================================================

  const loadItems = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(
          "Failed to load SEO data."
        );
      }

      const data = await response.json();

      const seoItems = Array.isArray(data)
        ? data
        : [];

      setItems(seoItems);

      // Keep current page valid
      const totalPages = Math.max(
        1,
        Math.ceil(
          seoItems.length / itemsPerPage
        )
      );

      setCurrentPage((previousPage) =>
        previousPage > totalPages
          ? totalPages
          : previousPage
      );

    } catch (error) {
      console.error(
        "Load SEO items error:",
        error
      );

      alert(
        error.message ||
          "Failed to load SEO data."
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
    const file = e.target.files[0];

    if (!file) return;

    // Check image
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    setImageFile(file);

    // This is ONLY for local preview.
    // The actual file will be uploaded directly
    // to S3 using the presigned URL.
    const reader = new FileReader();

    reader.onloadend = () => {
      setImagePreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  // =====================================================
  // SAVE
  // =====================================================

  const handleSave = async () => {
    if (!imageFile) {
      alert("Please select an image.");
      return;
    }

    try {
      setLoading(true);

      // =================================================
      // STEP 1
      // GET PRESIGNED S3 UPLOAD URL
      // =================================================

      const uploadUrlResponse =
        await fetch(
          `${API_URL}?upload=true&fileName=${encodeURIComponent(
            imageFile.name
          )}&fileType=${encodeURIComponent(
            imageFile.type
          )}`
        );

      if (!uploadUrlResponse.ok) {
        throw new Error(
          "Failed to get S3 upload URL."
        );
      }

      const uploadData =
        await uploadUrlResponse.json();

      if (!uploadData.uploadUrl) {
        throw new Error(
          "Upload URL was not returned by Lambda."
        );
      }

      if (!uploadData.key) {
        throw new Error(
          "S3 image key was not returned."
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
          "Image upload to S3 failed."
        );
      }

      // =================================================
      // STEP 3
      // SAVE SEO INFORMATION
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

            category: category,
          }),
        });

      if (!saveResponse.ok) {
        let errorMessage =
          "Failed to save SEO information.";

        try {
          const errorData =
            await saveResponse.json();

          if (errorData.message) {
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
        "SEO image uploaded successfully."
      );

    } catch (error) {
      console.error(
        "SEO upload error:",
        error
      );

      alert(
        error.message ||
          "Failed to upload SEO image."
      );

    } finally {
      setLoading(false);
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

    if (!confirmDelete) return;

    try {
      setLoading(true);

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

      if (!response.ok) {
        let errorMessage =
          "Failed to delete SEO item.";

        try {
          const errorData =
            await response.json();

          if (errorData.message) {
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
      // RELOAD DATA
      // =================================================

      await loadItems();

      alert(
        "SEO item deleted successfully."
      );

    } catch (error) {
      console.error(
        "Delete SEO item error:",
        error
      );

      alert(
        error.message ||
          "Failed to delete SEO item."
      );

    } finally {
      setLoading(false);
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

  const totalPages = Math.ceil(
    items.length / itemsPerPage
  );

  const startIndex =
    (currentPage - 1) * itemsPerPage;

  const currentItems = items.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // =====================================================
  // PAGE CHANGE
  // =====================================================

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // =====================================================
  // IMAGE URL
  // =====================================================

  const getImageUrl = (item) => {
    return (
      item.preview ||
      item.image ||
      item.imageUrl ||
      item.fileUrl ||
      ""
    );
  };

  // =====================================================
  // JSX
  // =====================================================

  return (
    <div className="seodevelop-admin">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="seodevelop-header">

        <h1>
          SEO Development
        </h1>

        <button
          type="button"
          className="seodevelop-add-btn"
          onClick={handleAddClick}
          disabled={loading}
        >
          + Add Image
        </button>

      </div>


      {/* =================================================
          FORM
      ================================================= */}

      {showForm && (
        <div className="seodevelop-form-card">

          {/* =================================================
              IMAGE UPLOAD
          ================================================= */}

          <div className="seodevelop-field">

            <label className="seodevelop-label">
              Image
            </label>

            <label className="seodevelop-upload-box">

              {imagePreview ? (

                <div className="seodevelop-preview-wrapper">

                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="seodevelop-image-preview"
                  />

                  <span className="seodevelop-change-text">
                    Change Image
                  </span>

                </div>

              ) : (

                <div className="seodevelop-upload-placeholder">

                  <span className="seodevelop-upload-icon">
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
              />

            </label>

          </div>


          {/* =================================================
              CATEGORY
          ================================================= */}

          <div className="seodevelop-field">

            <label className="seodevelop-label">
              Category
            </label>

            <select
              className="seodevelop-select"
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value
                )
              }
              disabled={loading}
            >

              {categories.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}

            </select>

          </div>


          {/* =================================================
              NAME
          ================================================= */}

          <div className="seodevelop-field">

            <label className="seodevelop-label">
              Name
            </label>

            <input
              type="text"
              className="seodevelop-input"
              placeholder="Enter name (optional)"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              disabled={loading}
            />

          </div>


          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <div className="seodevelop-field">

            <label className="seodevelop-label">
              Description
            </label>

            <textarea
              className="seodevelop-textarea"
              placeholder="Enter description (optional)"
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              rows="5"
              disabled={loading}
            />

          </div>


          {/* =================================================
              SAVE / CANCEL
          ================================================= */}

          <div className="seodevelop-form-actions">

            <button
              type="button"
              className="seodevelop-save-btn"
              onClick={handleSave}
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : "Save"}
            </button>

            <button
              type="button"
              className="seodevelop-cancel-btn"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>

          </div>

        </div>
      )}


      {/* =================================================
          LOADING MESSAGE
      ================================================= */}

      {loading && !showForm && (
        <div
          style={{
            textAlign: "center",
            padding: "20px",
          }}
        >
          Loading...
        </div>
      )}


      {/* =================================================
          TABLE
      ================================================= */}

      {items.length > 0 && (

        <div className="seodevelop-table-wrapper">

          <table className="seodevelop-table">

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

                  <tr key={item.id}>

                    <td>
                      {startIndex + index + 1}
                    </td>

                    <td>

                      <img
                        src={getImageUrl(item)}
                        alt={
                          item.name ||
                          item.category ||
                          "SEO"
                        }
                        className="seodevelop-table-image"
                      />

                    </td>

                    <td>

                      <span className="seodevelop-type">
                        {item.type ||
                          "Image"}
                      </span>

                    </td>

                    <td>

                      <div className="seodevelop-name">
                        {item.name || "-"}
                      </div>

                    </td>

                    <td>

                      <div className="seodevelop-description">
                        {item.description ||
                          "-"}
                      </div>

                    </td>

                    <td>

                      <span className="seodevelop-category">
                        {item.category}
                      </span>

                    </td>

                    <td>
                      {item.created}
                    </td>

                    <td>

                      <button
                        type="button"
                        className="seodevelop-delete-btn"
                        onClick={() =>
                          handleDelete(
                            item.id
                          )
                        }
                        disabled={loading}
                      >
                        Delete
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

            <div className="seodevelop-pagination">

              <button
                type="button"
                className="seodevelop-page-btn"
                disabled={
                  currentPage === 1 ||
                  loading
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
                  className={`seodevelop-page-btn ${
                    currentPage === page
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    handlePageChange(page)
                  }
                  disabled={loading}
                >
                  {page}
                </button>

              ))}


              <button
                type="button"
                className="seodevelop-page-btn"
                disabled={
                  currentPage ===
                    totalPages ||
                  loading
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

    </div>
  );
};

export default Seodevelop;