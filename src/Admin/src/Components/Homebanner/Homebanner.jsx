import React, { useEffect, useRef, useState } from "react";
import "./Homebanner.css";

const API_URL =
  "https://66ou0fp7m1.execute-api.ap-south-1.amazonaws.com/prod/banner";

const HomeBanner = () => {
  const [showForm, setShowForm] = useState(false);

  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [imageName, setImageName] = useState("");
  const [description, setDescription] = useState("");

  const [slides, setSlides] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingSlides, setLoadingSlides] = useState(true);

  const fileInputRef = useRef(null);

  // =====================================================
  // LOAD BANNERS
  // =====================================================

  const loadBanners = async () => {
    try {
      setLoadingSlides(true);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to load banners");
      }

      const data = await response.json();

      setSlides(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Load banners error:", error);

      alert("Unable to load banners.");
    } finally {
      setLoadingSlides(false);
    }
  };

  // =====================================================
  // LOAD DATA WHEN PAGE OPENS
  // =====================================================

  useEffect(() => {
    loadBanners();
  }, []);

  // =====================================================
  // IMAGE CHANGE
  // =====================================================

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Image validation
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    setImageFile(file);

    const reader = new FileReader();

    reader.onloadend = () => {
      setImagePreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  // =====================================================
  // OPEN ADD FORM
  // =====================================================

  const handleAddImage = () => {
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
  // SAVE IMAGE
  // =====================================================

  const handleSave = async () => {
    if (!imageFile) {
      alert("Please select an image.");
      return;
    }

    if (!imageName.trim()) {
      alert("Please enter image name.");
      return;
    }

    if (!description.trim()) {
      alert("Please enter image description.");
      return;
    }

    try {
      setLoading(true);

      // =================================================
      // STEP 1
      // GET PRESIGNED URL
      // =================================================

      const uploadUrlResponse = await fetch(
        `${API_URL}?upload=true&fileName=${encodeURIComponent(
          imageFile.name
        )}&fileType=${encodeURIComponent(imageFile.type)}`
      );

      if (!uploadUrlResponse.ok) {
        throw new Error(
          "Failed to generate upload URL"
        );
      }

      const uploadData =
        await uploadUrlResponse.json();

      if (!uploadData.success) {
        throw new Error(
          uploadData.message ||
            "Failed to generate upload URL"
        );
      }

      const uploadUrl =
        uploadData.uploadUrl;

      const imageKey =
        uploadData.key;

      // =================================================
      // STEP 2
      // UPLOAD IMAGE TO S3
      // =================================================

      const uploadResponse = await fetch(
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

      if (!uploadResponse.ok) {
        throw new Error(
          "Image upload to S3 failed"
        );
      }

      // =================================================
      // STEP 3
      // SAVE BANNER DATA
      // =================================================

      const saveResponse = await fetch(
        API_URL,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            image: uploadData.fileUrl,

            key: imageKey,

            imageName:
              imageName.trim(),

            description:
              description.trim(),
          }),
        }
      );

      if (!saveResponse.ok) {
        throw new Error(
          "Failed to save banner"
        );
      }

      const saveData =
        await saveResponse.json();

      if (!saveData.success) {
        throw new Error(
          saveData.message ||
            "Failed to save banner"
        );
      }

      // =================================================
      // SUCCESS
      // =================================================

      alert(
        "Banner uploaded successfully!"
      );

      resetForm();

      // Reload banners
      await loadBanners();

    } catch (error) {

      console.error(
        "Save banner error:",
        error
      );

      alert(
        error.message ||
          "Something went wrong."
      );

    } finally {

      setLoading(false);

    }
  };

  // =====================================================
  // DELETE IMAGE
  // =====================================================

  const handleDelete = async (id) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this image?"
      );

    if (!confirmDelete) return;

    try {

      setLoading(true);

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

      const data =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to delete banner"
        );
      }

      alert(
        "Banner deleted successfully!"
      );

      // Reload banners
      await loadBanners();

    } catch (error) {

      console.error(
        "Delete banner error:",
        error
      );

      alert(
        error.message ||
          "Unable to delete banner."
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

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div className="homebanner-admin">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="homebanner-header">

        <h1>Homepage</h1>

        <button
          className="homebanner-add-btn"
          onClick={handleAddImage}
          disabled={loading}
        >
          + Add Image
        </button>

      </div>


      {/* =================================================
          ADD IMAGE FORM
      ================================================= */}

      {showForm && (
        <div className="homebanner-form-card">

          {/* IMAGE UPLOADER */}

          <div className="homebanner-field">

            <label className="homebanner-upload-box">

              {imagePreview ? (

                <div className="homebanner-preview-wrapper">

                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="homebanner-upload-preview"
                  />

                  <span className="homebanner-change-text">
                    Change Image
                  </span>

                </div>

              ) : (

                <div className="homebanner-upload-placeholder">

                  <span className="upload-icon">
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


          {/* IMAGE NAME */}

          <div className="homebanner-field">

            <input
              type="text"
              className="homebanner-input"
              placeholder="Image Name"
              value={imageName}
              onChange={(e) =>
                setImageName(
                  e.target.value
                )
              }
            />

          </div>


          {/* IMAGE DESCRIPTION */}

          <div className="homebanner-field">

            <textarea
              className="homebanner-textarea"
              placeholder="Image Description"
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              rows="5"
            />

          </div>


          {/* FORM BUTTONS */}

          <div className="homebanner-form-actions">

            <button
              className="homebanner-save-btn"
              onClick={handleSave}
              disabled={loading}
            >

              {loading
                ? "Uploading..."
                : "Save"}

            </button>


            <button
              className="homebanner-cancel-btn"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>

          </div>

        </div>
      )}


      {/* =================================================
          LOADING
      ================================================= */}

      {loadingSlides && (
        <div className="homebanner-loading">
          Loading banners...
        </div>
      )}


      {/* =================================================
          NO BANNERS
      ================================================= */}

      {!loadingSlides &&
        slides.length === 0 && (
          <div className="homebanner-empty">

            <p>
              No banner images added yet.
            </p>

          </div>
        )}


      {/* =================================================
          SLIDES TABLE
      ================================================= */}

      {!loadingSlides &&
        slides.length > 0 && (

          <div className="homebanner-table-wrapper">

            <table className="homebanner-table">

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

                {slides.map(
                  (slide, index) => (

                    <tr
                      key={slide.id}
                    >

                      {/* NUMBER */}

                      <td>
                        {index + 1}
                      </td>


                      {/* PREVIEW */}

                      <td>

                        {slide.imageUrl ||
                        slide.image ? (

                          <img
                            src={
                              slide.imageUrl ||
                              slide.image
                            }
                            alt={
                              slide.imageName ||
                              "Banner"
                            }
                            className="homebanner-table-image"
                          />

                        ) : (

                          <span>
                            No Image
                          </span>

                        )}

                      </td>


                      {/* TYPE */}

                      <td>
                        Image
                      </td>


                      {/* NAME */}

                      <td>

                        <div className="homebanner-name">

                          {slide.imageName ||
                            "—"}

                        </div>

                      </td>


                      {/* DESCRIPTION */}

                      <td>

                        <div className="homebanner-description">

                          {slide.description ||
                            "—"}

                        </div>

                      </td>


                      {/* CREATED */}

                      <td>

                        {slide.created
                          ? new Date(
                              slide.created
                            ).toLocaleDateString(
                              "en-GB"
                            )
                          : "—"}

                      </td>


                      {/* ACTION */}

                      <td>

                        <button
                          className="homebanner-delete-btn"
                          onClick={() =>
                            handleDelete(
                              slide.id
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

          </div>

        )}

    </div>
  );
};

export default HomeBanner;