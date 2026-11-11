import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import "./HomeAbout.css";

/* ==========================================
   API
========================================== */

const API_URL =
  "https://66ou0fp7m1.execute-api.ap-south-1.amazonaws.com/prod/homeabout";

/* ==========================================
   COMPONENT
========================================== */

const HomeAbout = () => {
  const [showForm, setShowForm] =
    useState(false);

  const [mediaType, setMediaType] =
    useState("image");

  const [mediaPreview, setMediaPreview] =
    useState("");

  const [mediaFile, setMediaFile] =
    useState(null);

  const [mediaName, setMediaName] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [mediaItems, setMediaItems] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [loadingItems, setLoadingItems] =
    useState(true);

  const fileInputRef =
    useRef(null);

  /* ==========================================
     LOAD MEDIA FROM API
  ========================================== */

  const loadMedia = async () => {
    try {
      setLoadingItems(true);

      const response =
        await fetch(API_URL);

      if (!response.ok) {
        throw new Error(
          "Failed to load Home About media."
        );
      }

      const data =
        await response.json();

      setMediaItems(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {
      console.error(
        "Load Home About error:",
        error
      );

      alert(
        "Unable to load Home About media."
      );

    } finally {
      setLoadingItems(false);
    }
  };

  /* ==========================================
     LOAD WHEN PAGE OPENS
  ========================================== */

  useEffect(() => {
    loadMedia();
  }, []);

  /* ==========================================
     OPEN ADD FORM
  ========================================== */

  const handleAddClick = () => {
    setShowForm(true);

    setMediaType("image");

    setMediaPreview("");

    setMediaFile(null);

    setMediaName("");

    setDescription("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /* ==========================================
     CHANGE MEDIA TYPE
  ========================================== */

  const handleTypeChange = (e) => {
    const type =
      e.target.value;

    setMediaType(type);

    setMediaPreview("");

    setMediaFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /* ==========================================
     IMAGE / VIDEO CHANGE
  ========================================== */

  const handleMediaChange = (e) => {
    const file =
      e.target.files[0];

    if (!file) return;

    /* ==========================================
       VALIDATE IMAGE
    ========================================== */

    if (
      mediaType === "image" &&
      !file.type.startsWith("image/")
    ) {
      alert(
        "Please select an image file."
      );

      return;
    }

    /* ==========================================
       VALIDATE VIDEO
    ========================================== */

    if (
      mediaType === "video" &&
      !file.type.startsWith("video/")
    ) {
      alert(
        "Please select a video file."
      );

      return;
    }

    setMediaFile(file);

    /* ==========================================
       CREATE LOCAL PREVIEW
    ========================================== */

    const previewUrl =
      URL.createObjectURL(file);

    setMediaPreview(previewUrl);
  };

  /* ==========================================
     SAVE
  ========================================== */

  const handleSave = async () => {

    /* ==========================================
       CHECK MEDIA
    ========================================== */

    if (!mediaFile) {
      alert(
        mediaType === "image"
          ? "Please select an image."
          : "Please select a video."
      );

      return;
    }

    /* ==========================================
       CHECK NAME
    ========================================== */

    if (!mediaName.trim()) {
      alert(
        mediaType === "image"
          ? "Please enter image name."
          : "Please enter video name."
      );

      return;
    }

    /* ==========================================
       CHECK DESCRIPTION
    ========================================== */

    if (!description.trim()) {
      alert(
        "Please enter description."
      );

      return;
    }

    try {

      setLoading(true);

      /* ==========================================
         STEP 1
         GET PRESIGNED S3 URL
      ========================================== */

      console.log(
        "===================================="
      );

      console.log(
        "STEP 1: Requesting presigned URL"
      );

      console.log(
        "File Name:",
        mediaFile.name
      );

      console.log(
        "File Type:",
        mediaFile.type
      );

      console.log(
        "File Size:",
        mediaFile.size
      );

      console.log(
        "===================================="
      );

      const uploadUrlResponse =
        await fetch(
          `${API_URL}?upload=true&fileName=${encodeURIComponent(
            mediaFile.name
          )}&fileType=${encodeURIComponent(
            mediaFile.type
          )}`
        );

      if (!uploadUrlResponse.ok) {

        const errorText =
          await uploadUrlResponse.text();

        console.error(
          "Presigned URL Error:",
          errorText
        );

        throw new Error(
          "Failed to generate upload URL."
        );
      }

      const uploadData =
        await uploadUrlResponse.json();

      console.log(
        "Presigned URL response:",
        uploadData
      );

      if (!uploadData.success) {
        throw new Error(
          uploadData.message ||
            "Failed to generate upload URL."
        );
      }

      const uploadUrl =
        uploadData.uploadUrl;

      const mediaKey =
        uploadData.key;

      /* ==========================================
         LOG PRESIGNED URL INFORMATION
      ========================================== */

      console.log(
        "===================================="
      );

      console.log(
        "PRESIGNED URL CREATED"
      );

      console.log(
        "Media Key:",
        mediaKey
      );

      console.log(
        "File Type:",
        mediaFile.type
      );

      console.log(
        "File Size:",
        mediaFile.size
      );

      console.log(
        "Upload URL:",
        uploadUrl
      );

      console.log(
        "===================================="
      );

      /* ==========================================
         STEP 2
         UPLOAD DIRECTLY TO S3
      ========================================== */

      console.log(
        "STEP 2: Uploading media to S3..."
      );

      const uploadResponse =
        await fetch(
          uploadUrl,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                mediaFile.type,
            },

            body: mediaFile,
          }
        );

      /* ==========================================
         CHECK S3 RESPONSE
      ========================================== */

      if (!uploadResponse.ok) {

        const errorText =
          await uploadResponse.text();

        console.error(
          "===================================="
        );

        console.error(
          "S3 UPLOAD ERROR"
        );

        console.error(
          "Status:",
          uploadResponse.status
        );

        console.error(
          "Status Text:",
          uploadResponse.statusText
        );

        console.error(
          "Response:",
          errorText
        );

        console.error(
          "Upload URL:",
          uploadUrl
        );

        console.error(
          "File Name:",
          mediaFile.name
        );

        console.error(
          "File Type:",
          mediaFile.type
        );

        console.error(
          "File Size:",
          mediaFile.size
        );

        console.error(
          "===================================="
        );

        throw new Error(
          `S3 upload failed (${uploadResponse.status}): ${errorText}`
        );
      }

      console.log(
        "S3 upload successful!"
      );

      /* ==========================================
         STEP 3
         SAVE MEDIA INFORMATION
      ========================================== */

      console.log(
        "STEP 3: Saving media information..."
      );

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

              type:
                mediaType,

              key:
                mediaKey,

              fileUrl:
                uploadData.fileUrl,

              image:
                uploadData.fileUrl,

              name:
                mediaName.trim(),

              description:
                description.trim(),

            }),
          }
        );

      if (!saveResponse.ok) {

        const errorText =
          await saveResponse.text();

        console.error(
          "Save API Error:",
          errorText
        );

        throw new Error(
          "Failed to save media information."
        );
      }

      const saveData =
        await saveResponse.json();

      console.log(
        "Save response:",
        saveData
      );

      if (!saveData.success) {
        throw new Error(
          saveData.message ||
            "Failed to save media."
        );
      }

      /* ==========================================
         SUCCESS
      ========================================== */

      alert(
        mediaType === "image"
          ? "Image uploaded successfully!"
          : "Video uploaded successfully!"
      );

      resetForm();

      await loadMedia();

    } catch (error) {

      console.error(
        "===================================="
      );

      console.error(
        "Save Home About Error:",
        error
      );

      console.error(
        "===================================="
      );

      alert(
        error.message ||
          "Something went wrong."
      );

    } finally {

      setLoading(false);
    }
  };

  /* ==========================================
     DELETE
  ========================================== */

  const handleDelete = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this item?"
      );

    if (!confirmDelete) {
      return;
    }

    try {

      setLoading(true);

      /* ==========================================
         DELETE FROM API
      ========================================== */

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

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to delete media."
        );
      }

      alert(
        "Media deleted successfully!"
      );

      /* ==========================================
         RELOAD MEDIA
      ========================================== */

      await loadMedia();

    } catch (error) {

      console.error(
        "Delete Home About error:",
        error
      );

      alert(
        error.message ||
          "Unable to delete media."
      );

    } finally {

      setLoading(false);
    }
  };

  /* ==========================================
     RESET FORM
  ========================================== */

  const resetForm = () => {

    setShowForm(false);

    setMediaType("image");

    setMediaPreview("");

    setMediaFile(null);

    setMediaName("");

    setDescription("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /* ==========================================
     CANCEL
  ========================================== */

  const handleCancel = () => {
    resetForm();
  };

  /* ==========================================
     RETURN
  ========================================== */

  return (
    <div className="homeabout-admin">

      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="homeabout-header">

        <h1>
          About
        </h1>

        <button
          type="button"
          className="homeabout-add-btn"
          onClick={handleAddClick}
          disabled={loading}
        >
          + Add Image
        </button>

      </div>

      {/* ==========================================
          FORM
      ========================================== */}

      {showForm && (

        <div className="homeabout-form-card">

          {/* ==========================================
              MEDIA TYPE
          ========================================== */}

          <div className="homeabout-field">

            <label className="homeabout-label">
              Media Type
            </label>

            <select
              className="homeabout-select"
              value={mediaType}
              onChange={handleTypeChange}
              disabled={loading}
            >

              <option value="image">
                Image
              </option>

              <option value="video">
                Video
              </option>

            </select>

          </div>

          {/* ==========================================
              IMAGE / VIDEO UPLOAD
          ========================================== */}

          <div className="homeabout-field">

            <label className="homeabout-upload-box">

              {mediaPreview ? (

                mediaType === "image" ? (

                  <div className="homeabout-preview-wrapper">

                    <img
                      src={mediaPreview}
                      alt="Preview"
                      className="homeabout-image-preview"
                    />

                    <span className="homeabout-change-text">
                      Change Image
                    </span>

                  </div>

                ) : (

                  <div className="homeabout-preview-wrapper">

                    <video
                      src={mediaPreview}
                      className="homeabout-video-preview"
                      controls
                    />

                    <span className="homeabout-change-text">
                      Change Video
                    </span>

                  </div>

                )

              ) : (

                <div className="homeabout-upload-placeholder">

                  <span className="homeabout-upload-icon">
                    +
                  </span>

                  <span>

                    {mediaType === "image"
                      ? "Choose Image"
                      : "Choose Video"}

                  </span>

                </div>

              )}

              <input
                ref={fileInputRef}
                type="file"
                accept={
                  mediaType === "image"
                    ? "image/*"
                    : "video/*"
                }
                onChange={
                  handleMediaChange
                }
                disabled={loading}
              />

            </label>

          </div>

          {/* ==========================================
              NAME
          ========================================== */}

          <div className="homeabout-field">

            <input
              type="text"
              className="homeabout-input"
              placeholder={
                mediaType === "image"
                  ? "Image Name"
                  : "Video Name"
              }
              value={mediaName}
              onChange={(e) =>
                setMediaName(
                  e.target.value
                )
              }
              disabled={loading}
            />

          </div>

          {/* ==========================================
              DESCRIPTION
          ========================================== */}

          <div className="homeabout-field">

            <textarea
              className="homeabout-textarea"
              placeholder={
                mediaType === "image"
                  ? "Image Description"
                  : "Video Description"
              }
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

          {/* ==========================================
              BUTTONS
          ========================================== */}

          <div className="homeabout-form-actions">

            <button
              type="button"
              className="homeabout-save-btn"
              onClick={handleSave}
              disabled={loading}
            >
              {loading
                ? "Uploading..."
                : "Save"}
            </button>

            <button
              type="button"
              className="homeabout-cancel-btn"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>

          </div>

        </div>
      )}

      {/* ==========================================
          LOADING
      ========================================== */}

      {loadingItems && (

        <div className="homeabout-loading">
          Loading media...
        </div>

      )}

      {/* ==========================================
          EMPTY
      ========================================== */}

      {!loadingItems &&
        mediaItems.length === 0 && (

          <div className="homeabout-empty">

            <p>
              No images or videos added yet.
            </p>

          </div>

        )}

      {/* ==========================================
          TABLE
      ========================================== */}

      {!loadingItems &&
        mediaItems.length > 0 && (

          <div className="homeabout-table-wrapper">

            <table className="homeabout-table">

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
                    Created
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {mediaItems.map(
                  (item, index) => (

                    <tr
                      key={item.id}
                    >

                      {/* NO */}

                      <td>
                        {index + 1}
                      </td>

                      {/* PREVIEW */}

                      <td>

                        {item.type ===
                        "image" ? (

                          <img
                            src={
                              item.preview ||
                              item.mediaUrl ||
                              item.imageUrl ||
                              item.image
                            }
                            alt={
                              item.name ||
                              "Home About"
                            }
                            className="homeabout-table-image"
                          />

                        ) : (

                          <video
                            src={
                              item.preview ||
                              item.mediaUrl ||
                              item.imageUrl ||
                              item.image
                            }
                            className="homeabout-table-video"
                            controls
                          />

                        )}

                      </td>

                      {/* TYPE */}

                      <td>

                        <span className="homeabout-type">

                          {item.type ===
                          "image"
                            ? "Image"
                            : "Video"}

                        </span>

                      </td>

                      {/* NAME */}

                      <td>

                        <div className="homeabout-name">

                          {item.name ||
                            "—"}

                        </div>

                      </td>

                      {/* DESCRIPTION */}

                      <td>

                        <div className="homeabout-description">

                          {item.description ||
                            "—"}

                        </div>

                      </td>

                      {/* CREATED */}

                      <td>

                        {item.created ||
                          "—"}

                      </td>

                      {/* ACTION */}

                      <td>

                        <button
                          type="button"
                          className="homeabout-delete-btn"
                          onClick={() =>
                            handleDelete(
                              item.id
                            )
                          }
                          disabled={
                            loading
                          }
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

export default HomeAbout;