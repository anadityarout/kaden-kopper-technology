import React, { useRef, useState } from "react";
import "./Founder.css";

const Founder = () => {
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
  const [secondName, setSecondName] = useState("");
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
    setSecondName("");
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

    if (!secondName.trim()) {
      alert("Please enter second name.");
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
      secondName: secondName.trim(),
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
    setSecondName("");
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
    <div className="founder-admin">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="founder-header">

        <h1>Founder</h1>

        <button
          type="button"
          className="founder-add-btn"
          onClick={handleAddClick}
        >
          + Add Image
        </button>

      </div>


      {/* =================================================
          ADD IMAGE FORM
      ================================================= */}

      {showForm && (
        <div className="founder-form-card">

          {/* =================================================
              IMAGE UPLOAD
          ================================================= */}

          <div className="founder-field">

            <label className="founder-label">
              Image
            </label>

            <label className="founder-upload-box">

              {imagePreview ? (
                <div className="founder-preview-wrapper">

                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="founder-image-preview"
                  />

                  <span className="founder-change-text">
                    Change Image
                  </span>

                </div>
              ) : (
                <div className="founder-upload-placeholder">

                  <span className="founder-upload-icon">
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

          <div className="founder-field">

            <label className="founder-label">
              Image Name
            </label>

            <input
              type="text"
              className="founder-input"
              placeholder="Enter image name"
              value={imageName}
              onChange={(e) =>
                setImageName(e.target.value)
              }
            />

          </div>


          {/* =================================================
              SECOND NAME
          ================================================= */}

          <div className="founder-field">

            <label className="founder-label">
              Second Name
            </label>

            <input
              type="text"
              className="founder-input"
              placeholder="Enter second name"
              value={secondName}
              onChange={(e) =>
                setSecondName(e.target.value)
              }
            />

          </div>


          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <div className="founder-field">

            <label className="founder-label">
              Image Description
            </label>

            <textarea
              className="founder-textarea"
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

          <div className="founder-form-actions">

            <button
              type="button"
              className="founder-save-btn"
              onClick={handleSave}
            >
              Save
            </button>

            <button
              type="button"
              className="founder-cancel-btn"
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
        <div className="founder-table-wrapper">

          <table className="founder-table">

            <thead>

              <tr>
                <th>No</th>
                <th>Preview</th>
                <th>Type</th>
                <th>Name</th>
                <th>Second Name</th>
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
                      className="founder-table-image"
                    />

                  </td>


                  {/* TYPE */}

                  <td>
                    <span className="founder-type">
                      {item.type}
                    </span>
                  </td>


                  {/* NAME */}

                  <td>

                    <div className="founder-name">
                      {item.name}
                    </div>

                  </td>


                  {/* SECOND NAME */}

                  <td>

                    <div className="founder-second-name">
                      {item.secondName}
                    </div>

                  </td>


                  {/* DESCRIPTION */}

                  <td>

                    <div className="founder-description">
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
                      className="founder-delete-btn"
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

export default Founder;