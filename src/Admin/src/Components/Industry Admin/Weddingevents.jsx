import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import "./Weddingevents.css";

// =====================================================
// API
// =====================================================

const API_URL =
  "https://66ou0fp7m1.execute-api.ap-south-1.amazonaws.com/prod/weddingevents";


// =====================================================
// COMPONENT
// =====================================================

const Weddingevents = () => {

  // ===================================================
  // FORM
  // ===================================================

  const [showForm, setShowForm] =
    useState(false);

  const [category, setCategory] =
    useState("Banner");

  const [imageFile, setImageFile] =
    useState(null);

  const [imagePreview, setImagePreview] =
    useState("");

  const [name, setName] =
    useState("");

  const [description, setDescription] =
    useState("");


  // ===================================================
  // TABLE DATA
  // ===================================================

  const [items, setItems] =
    useState([]);


  // ===================================================
  // LOADING
  // ===================================================

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState(null);


  // ===================================================
  // PAGINATION
  // ===================================================

  const [currentPage, setCurrentPage] =
    useState(1);

  const itemsPerPage = 5;


  // ===================================================
  // FILE INPUT
  // ===================================================

  const fileInputRef =
    useRef(null);


  // ===================================================
  // LOAD DATA
  // ===================================================

  useEffect(() => {
    loadWeddingEvents();
  }, []);


  // ===================================================
  // GET WEDDING EVENTS
  // ===================================================

  const loadWeddingEvents = async () => {

    try {

      setLoading(true);

      console.log(
        "Loading Wedding Events..."
      );

      const response =
        await fetch(API_URL, {
          method: "GET",
        });


      if (!response.ok) {

        const errorText =
          await response.text();

        console.error(
          "GET Error:",
          errorText
        );

        throw new Error(
          `Failed to load Wedding Events: ${response.status}`
        );
      }


      const data =
        await response.json();


      console.log(
        "Wedding Events:",
        data
      );


      if (Array.isArray(data)) {

        setItems(data);

      } else {

        setItems([]);

      }


    } catch (error) {

      console.error(
        "Wedding Events Load Error:",
        error
      );

      alert(
        "Failed to load Wedding Events."
      );

    } finally {

      setLoading(false);

    }
  };


  // ===================================================
  // OPEN FORM
  // ===================================================

  const handleAddClick = () => {

    setShowForm(true);

    setCategory("Banner");

    setImageFile(null);

    setImagePreview("");

    setName("");

    setDescription("");


    if (fileInputRef.current) {

      fileInputRef.current.value =
        "";

    }
  };


  // ===================================================
  // IMAGE CHANGE
  // ===================================================

  const handleImageChange = (e) => {

    const file =
      e.target.files?.[0];


    if (!file) {
      return;
    }


    // =================================================
    // IMAGE VALIDATION
    // =================================================

    if (
      !file.type.startsWith("image/")
    ) {

      alert(
        "Please select a valid image."
      );

      e.target.value = "";

      return;
    }


    // =================================================
    // OPTIONAL SIZE CHECK
    // =================================================

    const maxSize =
      10 * 1024 * 1024;


    if (file.size > maxSize) {

      alert(
        "Image size must be less than 10 MB."
      );

      e.target.value = "";

      return;
    }


    // =================================================
    // SAVE FILE
    // =================================================

    setImageFile(file);


    // =================================================
    // LOCAL PREVIEW
    // =================================================

    const reader =
      new FileReader();


    reader.onloadend = () => {

      setImagePreview(
        reader.result
      );

    };


    reader.readAsDataURL(file);
  };


  // ===================================================
  // SAVE
  // ===================================================

  const handleSave = async () => {

    // =================================================
    // PREVENT DOUBLE CLICK
    // =================================================

    if (saving) {
      return;
    }


    // =================================================
    // IMAGE REQUIRED
    // =================================================

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
      // REQUEST PRESIGNED S3 URL
      // =================================================

      console.log(
        "Requesting upload URL..."
      );


      const uploadParams =
        new URLSearchParams({

          upload: "true",

          fileName:
            imageFile.name,

          fileType:
            imageFile.type,

        });


      const uploadResponse =
        await fetch(
          `${API_URL}?${uploadParams.toString()}`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({}),
          }
        );


      if (!uploadResponse.ok) {

        const errorText =
          await uploadResponse.text();

        console.error(
          "Upload URL Error:",
          uploadResponse.status,
          errorText
        );

        throw new Error(
          `Upload URL request failed: ${uploadResponse.status}`
        );
      }


      const uploadData =
        await uploadResponse.json();


      console.log(
        "Upload URL Response:",
        uploadData
      );


      // =================================================
      // CHECK UPLOAD URL
      // =================================================

      if (!uploadData.uploadUrl) {

        throw new Error(
          "Upload URL was not returned by Lambda."
        );
      }


      if (!uploadData.key) {

        throw new Error(
          "S3 key was not returned by Lambda."
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

        const errorText =
          await s3Response.text();

        console.error(
          "S3 Upload Error:",
          s3Response.status,
          errorText
        );

        throw new Error(
          `Image upload failed: ${s3Response.status}`
        );
      }


      console.log(
        "Image uploaded successfully."
      );


      // =================================================
      // STEP 3
      // SAVE METADATA IN LAMBDA / S3 JSON
      // =================================================

      const metadata = {

        key:
          uploadData.key,

        name:
          name.trim(),

        description:
          description.trim(),

        category:
          category,

      };


      console.log(
        "Saving Wedding Event:",
        metadata
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

            body:
              JSON.stringify(
                metadata
              ),
          }
        );


      if (!saveResponse.ok) {

        const errorText =
          await saveResponse.text();

        console.error(
          "Metadata Save Error:",
          saveResponse.status,
          errorText
        );

        throw new Error(
          `Wedding Event save failed: ${saveResponse.status}`
        );
      }


      const savedItem =
        await saveResponse.json();


      console.log(
        "Wedding Event saved:",
        savedItem
      );


      // =================================================
      // SUCCESS
      // =================================================

      alert(
        "Wedding Event added successfully."
      );


      // =================================================
      // CLOSE FORM
      // =================================================

      resetForm();


      // =================================================
      // RELOAD DATA FROM SERVER
      // =================================================

      await loadWeddingEvents();


      // =================================================
      // GO TO FIRST PAGE
      // =================================================

      setCurrentPage(1);


    } catch (error) {

      console.error(
        "Wedding Event Save Error:",
        error
      );


      alert(
        error.message ||
        "Failed to save Wedding Event."
      );

    } finally {

      setSaving(false);

    }
  };


  // ===================================================
  // RESET FORM
  // ===================================================

  const resetForm = () => {

    setShowForm(false);

    setCategory("Banner");

    setImageFile(null);

    setImagePreview("");

    setName("");

    setDescription("");


    if (fileInputRef.current) {

      fileInputRef.current.value =
        "";

    }
  };


  // ===================================================
  // CANCEL
  // ===================================================

  const handleCancel = () => {

    if (saving) {
      return;
    }

    resetForm();
  };


  // ===================================================
  // DELETE
  // ===================================================

  const handleDelete = async (id) => {

    if (deletingId) {
      return;
    }


    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this Wedding Event?"
      );


    if (!confirmDelete) {
      return;
    }


    try {

      setDeletingId(id);


      console.log(
        "Deleting Wedding Event:",
        id
      );


      // =================================================
      // DELETE USING QUERY PARAMETER
      // =================================================

      const deleteResponse =
        await fetch(
          `${API_URL}?id=${encodeURIComponent(id)}`,
          {
            method: "DELETE",
          }
        );


      if (!deleteResponse.ok) {

        const errorText =
          await deleteResponse.text();

        console.error(
          "Delete Error:",
          deleteResponse.status,
          errorText
        );

        throw new Error(
          `Delete failed: ${deleteResponse.status}`
        );
      }


      const result =
        await deleteResponse.json();


      console.log(
        "Delete Response:",
        result
      );


      alert(
        "Wedding Event deleted successfully."
      );


      // =================================================
      // RELOAD DATA
      // =================================================

      await loadWeddingEvents();


    } catch (error) {

      console.error(
        "Wedding Event Delete Error:",
        error
      );


      alert(
        error.message ||
        "Failed to delete Wedding Event."
      );

    } finally {

      setDeletingId(null);

    }
  };


  // ===================================================
  // PAGINATION
  // ===================================================

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


  // ===================================================
  // PAGE CHANGE
  // ===================================================

  const goToPage = (page) => {

    if (
      page < 1 ||
      page > totalPages
    ) {
      return;
    }


    setCurrentPage(page);


    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="wedding-events-admin">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="wedding-events-header">

        <h1>
          Wedding &amp; Events
        </h1>


        <button
          type="button"
          className="wedding-events-add-btn"
          onClick={handleAddClick}
          disabled={saving}
        >
          + Add Image
        </button>

      </div>


      {/* =================================================
          FORM
      ================================================= */}

      {showForm && (

        <div className="wedding-events-form-card">

          {/* =============================================
              CATEGORY
          ============================================= */}

          <div className="wedding-events-field">

            <label className="wedding-events-label">
              Category
            </label>


            <select
              className="wedding-events-select"
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


              <option value="Work">
                Work
              </option>

            </select>

          </div>


          {/* =============================================
              IMAGE
          ============================================= */}

          <div className="wedding-events-field">

            <label className="wedding-events-label">
              Image
            </label>


            <label
              className={`wedding-events-upload-box ${
                saving
                  ? "disabled"
                  : ""
              }`}
            >

              {imagePreview ? (

                <div className="wedding-events-preview-wrapper">

                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="wedding-events-image-preview"
                  />


                  {!saving && (
                    <span className="wedding-events-change-text">
                      Change Image
                    </span>
                  )}

                </div>

              ) : (

                <div className="wedding-events-upload-placeholder">

                  <span className="wedding-events-upload-icon">
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
                disabled={saving}
              />

            </label>

          </div>


          {/* =============================================
              NAME
          ============================================= */}

          <div className="wedding-events-field">

            <label className="wedding-events-label">
              Name
            </label>


            <input
              type="text"
              className="wedding-events-input"
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


          {/* =============================================
              DESCRIPTION
          ============================================= */}

          <div className="wedding-events-field">

            <label className="wedding-events-label">
              Description
            </label>


            <textarea
              className="wedding-events-textarea"
              placeholder="Enter description (optional)"
              rows="5"
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              disabled={saving}
            />

          </div>


          {/* =============================================
              BUTTONS
          ============================================= */}

          <div className="wedding-events-form-actions">

            <button
              type="button"
              className="wedding-events-save-btn"
              onClick={handleSave}
              disabled={saving}
            >

              {saving
                ? "Saving..."
                : "Save"}

            </button>


            <button
              type="button"
              className="wedding-events-cancel-btn"
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

        <div className="wedding-events-loading">

          Loading Wedding Events...

        </div>

      )}


     {/* =================================================
    EMPTY STATE
================================================= */}

{!loading && items.length === 0 && (
  <div className="wedding-events-empty">
    <p>No Wedding Events added yet.</p>
  </div>
)}


      {/* =================================================
          TABLE
      ================================================= */}

      {!loading &&
        items.length > 0 && (

          <div className="wedding-events-table-wrapper">

            <table className="wedding-events-table">

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


                    return (

                      <tr
                        key={
                          item.id
                        }
                      >

                        {/* NO */}

                        <td>
                          {serialNumber}
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
                                "Wedding Event"
                              }
                              className="wedding-events-table-image"
                            />

                          ) : (

                            <div className="wedding-events-no-image">
                              No Image
                            </div>

                          )}

                        </td>


                        {/* TYPE */}

                        <td>
                          {item.type ||
                            "Image"}
                        </td>


                        {/* NAME */}

                        <td>

                          <div className="wedding-events-name">

                            {item.name ||
                              "-"}

                          </div>

                        </td>


                        {/* DESCRIPTION */}

                        <td>

                          <div className="wedding-events-description">

                            {item.description ||
                              "-"}

                          </div>

                        </td>


                        {/* CATEGORY */}

                        <td>

                          <span className="wedding-events-category">

                            {item.category ||
                              "Banner"}

                          </span>

                        </td>


                        {/* CREATED */}

                        <td>
                          {item.created ||
                            "-"}
                        </td>


                        {/* ACTION */}

                        <td>

                          <button
                            type="button"
                            className="wedding-events-delete-btn"
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


            {/* ===========================================
                PAGINATION
            =========================================== */}

            {totalPages > 1 && (

              <div className="wedding-events-pagination">

                <button
                  type="button"
                  className="wedding-events-page-btn"
                  disabled={
                    currentPage === 1
                  }
                  onClick={() =>
                    goToPage(
                      currentPage - 1
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
                  (_, index) =>
                    index + 1
                ).map((page) => (

                  <button
                    type="button"
                    key={page}
                    className={`wedding-events-page-btn ${
                      currentPage ===
                      page
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      goToPage(
                        page
                      )
                    }
                  >
                    {page}
                  </button>

                ))}


                <button
                  type="button"
                  className="wedding-events-page-btn"
                  disabled={
                    currentPage ===
                    totalPages
                  }
                  onClick={() =>
                    goToPage(
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


export default Weddingevents;