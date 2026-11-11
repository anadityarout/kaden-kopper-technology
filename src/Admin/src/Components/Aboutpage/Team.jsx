import React, { useRef, useState } from "react";
import "./Team.css";

const Team = () => {
  const [showForm, setShowForm] = useState(false);

  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");

  const [items, setItems] = useState([]);

  const fileInputRef = useRef(null);

  // =====================================================
  // ADD IMAGE
  // =====================================================

  const handleAddClick = () => {
    setShowForm(true);

    setImagePreview("");
    setImageFile(null);
    setName("");
    setDesignation("");

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

    if (!name.trim()) {
      alert("Please enter name.");
      return;
    }

    if (!designation.trim()) {
      alert("Please enter designation.");
      return;
    }

    const newItem = {
      id: Date.now(),
      type: "Image",
      preview: imagePreview,
      name: name.trim(),
      designation: designation.trim(),
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
      "Are you sure you want to delete this team member?"
    );

    if (!confirmDelete) return;

    setItems((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  // =====================================================
  // RESET
  // =====================================================

  const resetForm = () => {
    setShowForm(false);

    setImagePreview("");
    setImageFile(null);
    setName("");
    setDesignation("");

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
    <div className="team-admin">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="team-header">

        <h1>Our Team</h1>

        <button
          type="button"
          className="team-add-btn"
          onClick={handleAddClick}
        >
          + Add Image
        </button>

      </div>


      {/* =================================================
          FORM
      ================================================= */}

      {showForm && (
        <div className="team-form-card">

          {/* IMAGE */}

          <div className="team-field">

            <label className="team-label">
              Image
            </label>

            <label className="team-upload-box">

              {imagePreview ? (
                <div className="team-preview-wrapper">

                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="team-image-preview"
                  />

                  <span className="team-change-text">
                    Change Image
                  </span>

                </div>
              ) : (
                <div className="team-upload-placeholder">

                  <span className="team-upload-icon">
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


          {/* NAME */}

          <div className="team-field">

            <label className="team-label">
              Name
            </label>

            <input
              type="text"
              className="team-input"
              placeholder="Enter name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />

          </div>


          {/* DESIGNATION */}

          <div className="team-field">

            <label className="team-label">
              Designation
            </label>

            <input
              type="text"
              className="team-input"
              placeholder="Enter designation"
              value={designation}
              onChange={(e) =>
                setDesignation(e.target.value)
              }
            />

          </div>


          {/* SAVE / CANCEL */}

          <div className="team-form-actions">

            <button
              type="button"
              className="team-save-btn"
              onClick={handleSave}
            >
              Save
            </button>

            <button
              type="button"
              className="team-cancel-btn"
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
        <div className="team-table-wrapper">

          <table className="team-table">

            <thead>

              <tr>
                <th>No</th>
                <th>Preview</th>
                <th>Type</th>
                <th>Name</th>
                <th>Designation</th>
                <th>Created</th>
                <th>Action</th>
              </tr>

            </thead>

            <tbody>

              {items.map((item, index) => (
                <tr key={item.id}>

                  <td>
                    {index + 1}
                  </td>

                  <td>
                    <img
                      src={item.preview}
                      alt={item.name}
                      className="team-table-image"
                    />
                  </td>

                  <td>
                    <span className="team-type">
                      {item.type}
                    </span>
                  </td>

                  <td>
                    <div className="team-name">
                      {item.name}
                    </div>
                  </td>

                  <td>
                    <div className="team-designation">
                      {item.designation}
                    </div>
                  </td>

                  <td>
                    {item.created}
                  </td>

                  <td>
                    <button
                      type="button"
                      className="team-delete-btn"
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

export default Team;