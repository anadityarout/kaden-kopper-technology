import React, { useEffect, useRef, useState } from "react";
import "./Aboutslider.css";

const API_URL =
  "https://66ou0fp7m1.execute-api.ap-south-1.amazonaws.com/prod/aboutslider";

const AboutSlider = () => {
  const [showForm, setShowForm] = useState(false);

  const [category, setCategory] = useState("Banner");
  const [imagePreview, setImagePreview] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef(null);

  const itemsPerPage = 5;

  // =====================================================
  // LOAD ITEMS FROM AWS
  // =====================================================

  const loadItems = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to load About Slider items.");
      }

      const data = await response.json();

      setItems(Array.isArray(data) ? data : []);

      // Keep current page valid
      const total = Array.isArray(data)
        ? Math.ceil(data.length / itemsPerPage)
        : 0;

      setCurrentPage((prevPage) => {
        if (total === 0) return 1;
        return Math.min(prevPage, total);
      });
    } catch (error) {
      console.error("Load About Slider Error:", error);
      alert("Failed to load About Slider data.");
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

  const handleAddImage = () => {
    setShowForm(true);

    setCategory("Banner");
    setImagePreview("");
    setSelectedFile(null);
    setName("");
    setDescription("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // =====================================================
  // IMAGE UPLOAD / PREVIEW
  // =====================================================

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image.");
      return;
    }

    // Save actual file for S3 upload
    setSelectedFile(file);

    // Create local preview
    const previewUrl = URL.createObjectURL(file);

    setImagePreview(previewUrl);
  };

  // =====================================================
  // SAVE
  // =====================================================

  const handleSave = async () => {
    if (!selectedFile) {
      alert("Please select an image.");
      return;
    }

    try {
      setSaving(true);

      // =================================================
      // STEP 1: GET PRESIGNED S3 UPLOAD URL
      // =================================================

      const uploadUrlRequest =
        `${API_URL}?upload=true` +
        `&fileName=${encodeURIComponent(selectedFile.name)}` +
        `&fileType=${encodeURIComponent(selectedFile.type)}`;

      const uploadResponse = await fetch(uploadUrlRequest);

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error("Upload URL Error:", errorText);

        throw new Error("Failed to get S3 upload URL.");
      }

      const uploadData = await uploadResponse.json();

      if (!uploadData.uploadUrl || !uploadData.key) {
        console.error("Invalid upload response:", uploadData);

        throw new Error("Invalid S3 upload response.");
      }

      // =================================================
      // STEP 2: UPLOAD IMAGE DIRECTLY TO S3
      // =================================================

      const s3Response = await fetch(uploadData.uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": selectedFile.type,
        },
        body: selectedFile,
      });

      if (!s3Response.ok) {
        throw new Error("Failed to upload image to S3.");
      }

      // =================================================
      // STEP 3: SAVE METADATA THROUGH API
      // =================================================

      const metadata = {
        key: uploadData.key,
        name: name.trim(),
        description: description.trim(),
        category: category,
      };

      const saveResponse = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(metadata),
      });

      if (!saveResponse.ok) {
        const errorText = await saveResponse.text();
        console.error("Save Metadata Error:", errorText);

        throw new Error("Failed to save About Slider data.");
      }

      // =================================================
      // SUCCESS
      // =================================================

      alert("About Slider image uploaded successfully.");

      resetForm();

      // Reload from AWS
      await loadItems();

      // Go to last page
      setItems((currentItems) => {
        const lastPage = Math.max(
          1,
          Math.ceil(currentItems.length / itemsPerPage)
        );

        setCurrentPage(lastPage);

        return currentItems;
      });
    } catch (error) {
      console.error("Save About Slider Error:", error);
      alert(error.message || "Failed to save About Slider image.");
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
    setSelectedFile(null);
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
  // DELETE
  // =====================================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );

    if (!confirmDelete) return;

    try {
      setLoading(true);

      const response = await fetch(API_URL, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Delete Error:", data);

        throw new Error(
          data.message || "Failed to delete About Slider item."
        );
      }

      alert("About Slider item deleted successfully.");

      await loadItems();
    } catch (error) {
      console.error("Delete About Slider Error:", error);

      alert(
        error.message ||
          "Failed to delete About Slider item."
      );
    } finally {
      setLoading(false);
    }
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

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);
  };

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div className="aboutslider-admin">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="aboutslider-header">

        <h1>About Banner</h1>

        <button
          type="button"
          className="aboutslider-add-btn"
          onClick={handleAddImage}
        >
          + Add Image
        </button>

      </div>

      {/* =================================================
          FORM
      ================================================= */}

      {showForm && (
        <div className="aboutslider-form-card">

          {/* =================================================
              CATEGORY
          ================================================= */}

          <div className="aboutslider-field">

            <label className="aboutslider-label">
              Category
            </label>

            <select
              className="aboutslider-select"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
            >

              <option value="Banner">
                Banner
              </option>

              <option value="Our Story">
                Our Story
              </option>

              <option value="Founder">
                Founder
              </option>

              <option value="Life at Kaden Kopper">
                Life at Kaden Kopper
              </option>

              <option value="Our Team">
                Our Team
              </option>

            </select>

          </div>

          {/* =================================================
              IMAGE UPLOAD
          ================================================= */}

          <div className="aboutslider-field">

            <label className="aboutslider-label">
              Image
            </label>

            <label className="aboutslider-upload-box">

              {imagePreview ? (

                <div className="aboutslider-preview-wrapper">

                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="aboutslider-image-preview"
                  />

                  <span className="aboutslider-change-text">
                    Change Image
                  </span>

                </div>

              ) : (

                <div className="aboutslider-upload-placeholder">

                  <span className="aboutslider-upload-icon">
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
              NAME
          ================================================= */}

          <div className="aboutslider-field">

            <label className="aboutslider-label">
              Name
            </label>

            <input
              type="text"
              className="aboutslider-input"
              placeholder="Enter name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />

          </div>

          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <div className="aboutslider-field">

            <label className="aboutslider-label">
              Description
            </label>

            <textarea
              className="aboutslider-textarea"
              placeholder="Enter description"
              rows="5"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
            />

          </div>

          {/* =================================================
              SAVE / CANCEL
          ================================================= */}

          <div className="aboutslider-form-actions">

            <button
              type="button"
              className="aboutslider-save-btn"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>

            <button
              type="button"
              className="aboutslider-cancel-btn"
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
        <div style={{ padding: "15px", textAlign: "center" }}>
          Loading...
        </div>
      )}

      {/* =================================================
          TABLE
      ================================================= */}

      {!loading && items.length > 0 && (
        <div className="aboutslider-table-wrapper">

          <table className="aboutslider-table">

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

              {currentItems.map((item, index) => (

                <tr key={item.id}>

                  {/* NO */}

                  <td>
                    {startIndex + index + 1}
                  </td>

                  {/* PREVIEW */}

                  <td>

                    {item.preview ? (

                      <img
                        src={item.preview}
                        alt={item.name || "Image"}
                        className="aboutslider-table-image"
                      />

                    ) : (

                      <div className="aboutslider-no-image">
                        No Image
                      </div>

                    )}

                  </td>

                  {/* TYPE */}

                  <td>
                    {item.type || "Image"}
                  </td>

                  {/* NAME */}

                  <td>
                    {item.name || "-"}
                  </td>

                  {/* DESCRIPTION */}

                  <td>

                    <div className="aboutslider-description">
                      {item.description || "-"}
                    </div>

                  </td>

                  {/* CATEGORY */}

                  <td>
                    {item.category || "-"}
                  </td>

                  {/* CREATED */}

                  <td>
                    {item.created || "-"}
                  </td>

                  {/* ACTION */}

                  <td>

                    <button
                      type="button"
                      className="aboutslider-delete-btn"
                      onClick={() =>
                        handleDelete(item.id)
                      }
                      disabled={loading}
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          {/* =================================================
              PAGINATION
          ================================================= */}

          {totalPages > 1 && (

            <div className="aboutslider-pagination">

              {/* PREVIOUS */}

              <button
                type="button"
                className="aboutslider-page-btn"
                disabled={currentPage === 1}
                onClick={() =>
                  handlePageChange(currentPage - 1)
                }
              >
                Previous
              </button>

              {/* PAGE NUMBERS */}

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (

                <button
                  type="button"
                  key={page}
                  className={`aboutslider-page-btn ${
                    currentPage === page
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    handlePageChange(page)
                  }
                >
                  {page}
                </button>

              ))}

              {/* NEXT */}

              <button
                type="button"
                className="aboutslider-page-btn"
                disabled={
                  currentPage === totalPages
                }
                onClick={() =>
                  handlePageChange(currentPage + 1)
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

      {!loading && items.length === 0 && !showForm && (
        <div
          style={{
            padding: "30px",
            textAlign: "center",
          }}
        >
          No About Slider images added yet.
        </div>
      )}

    </div>
  );
};

export default AboutSlider;