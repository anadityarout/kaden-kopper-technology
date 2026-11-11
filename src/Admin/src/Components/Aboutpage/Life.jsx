import React, { useRef, useState } from "react";
import "./Life.css";

const Life = () => {
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
  // INPUT STATE
  // =====================================================

  const [imageName, setImageName] = useState("");
  const [description, setDescription] = useState("");

  // =====================================================
  // TABLE DATA
  // =====================================================

  const [items, setItems] = useState([]);

  // =====================================================
  // FILE INPUT REF
  // =====================================================

  const fileInputRef = useRef(null);

  // =====================================================
  // ADD IMAGE BUTTON
  // =====================================================

  const handleAddClick = () => {
    setShowForm(true);

    setImagePreview("");
    setImageFile(null);
    setImageName("");
    setDescription("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // =====================================================
  // IMAGE UPLOAD
  // =====================================================

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImageFile(file);

    const reader = new FileReader();

    reader.onloadend = () => {
      setImagePreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  // =====================================================
  // SAVE
  // =====================================================

  const handleSave = () => {
    if (!imageFile) {
      alert("Please select an image.");
      return;
    }

    if (!imageName.trim()) {
      alert("Please enter image name.");
      return;
    }

    if (!description.trim()) {
      alert("Please enter description.");
      return;
    }

    const newItem = {
      id: Date.now(),
      type: "Image",
      preview: imagePreview,
      name: imageName.trim(),
      description: description.trim(),
      created: new Date().toLocaleDateString("en-GB"),
    };

    setItems((prev) => [...prev, newItem]);

    resetForm();
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );

    if (!confirmDelete) return;

    setItems((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {
    setShowForm(false);

    setImagePreview("");
    setImageFile(null);
    setImageName("");
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

  return (
    <div className="life-admin">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="life-header">

        <h1>Life at Kaden Kopper</h1>

        <button
          type="button"
          className="life-add-btn"
          onClick={handleAddClick}
        >
          + Add Image
        </button>

      </div>


      {/* =================================================
          ADD IMAGE FORM
      ================================================= */}

      {showForm && (
        <div className="life-form-card">

          {/* =================================================
              IMAGE UPLOAD
          ================================================= */}

          <div className="life-field">

            <label className="life-label">
              Image
            </label>

            <label className="life-upload-box">

              {imagePreview ? (
                <div className="life-preview-wrapper">

                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="life-image-preview"
                  />

                  <span className="life-change-text">
                    Change Image
                  </span>

                </div>
              ) : (
                <div className="life-upload-placeholder">

                  <span className="life-upload-icon">
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
              IMAGE NAME
          ================================================= */}

          <div className="life-field">

            <label className="life-label">
              Image Name
            </label>

            <input
              type="text"
              className="life-input"
              placeholder="Enter image name"
              value={imageName}
              onChange={(e) =>
                setImageName(e.target.value)
              }
            />

          </div>


          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <div className="life-field">

            <label className="life-label">
              Image Description
            </label>

            <textarea
              className="life-textarea"
              placeholder="Enter image description"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              rows="5"
            />

          </div>


          {/* =================================================
              SAVE / CANCEL
          ================================================= */}

          <div className="life-form-actions">

            <button
              type="button"
              className="life-save-btn"
              onClick={handleSave}
            >
              Save
            </button>

            <button
              type="button"
              className="life-cancel-btn"
              onClick={handleCancel}
            >
              Cancel
            </button>

          </div>

        </div>
      )}


      {/* =================================================
          TABLE
      ================================================= */}

      {items.length > 0 && (
        <div className="life-table-wrapper">

          <table className="life-table">

            <thead>

              <tr>
                <th>No</th>
                <th>Preview</th>
                <th>Type</th>
                <th>Name</th>
                <th>Description</th>
                <th>Created</th>
                <th>Action</th>
              </tr>

            </thead>


            <tbody>

              {items.map((item, index) => (
                <tr key={item.id}>

                  {/* NO */}

                  <td>
                    {index + 1}
                  </td>


                  {/* PREVIEW */}

                  <td>

                    <img
                      src={item.preview}
                      alt={item.name}
                      className="life-table-image"
                    />

                  </td>


                  {/* TYPE */}

                  <td>

                    <span className="life-type">
                      {item.type}
                    </span>

                  </td>


                  {/* NAME */}

                  <td>

                    <div className="life-name">
                      {item.name}
                    </div>

                  </td>


                  {/* DESCRIPTION */}

                  <td>

                    <div className="life-description">
                      {item.description}
                    </div>

                  </td>


                  {/* CREATED */}

                  <td>
                    {item.created}
                  </td>


                  {/* ACTION */}

                  <td>

                    <button
                      type="button"
                      className="life-delete-btn"
                      onClick={() =>
                        handleDelete(item.id)
                      }
                    >
                      Delete
                    </button>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
};

export default Life;