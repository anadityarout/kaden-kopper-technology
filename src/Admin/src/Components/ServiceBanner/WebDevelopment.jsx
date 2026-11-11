import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import "./WebDevelopment.css";

// =====================================================
// API URL
// =====================================================

const API_URL =
  "https://66ou0fp7m1.execute-api.ap-south-1.amazonaws.com/prod/webdevelopment";


// =====================================================
// COMPONENT
// =====================================================

const WebDevelopment = () => {

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

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);


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
    "Web Development Technology",
    "Project",
    "Database",
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
          `GET request failed: ${response.status}`
        );
      }

      const data = await response.json();

      if (Array.isArray(data)) {

        setItems(data);

      } else {

        console.error(
          "Unexpected API response:",
          data
        );

        setItems([]);
      }

    } catch (error) {

      console.error(
        "Error loading Web Development items:",
        error
      );

      alert(
        "Failed to load Web Development data."
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

    const file = e.target.files?.[0];

    if (!file) {
      return;
    }


    // Only image files
    if (!file.type.startsWith("image/")) {

      alert("Please select an image file.");

      e.target.value = "";

      return;
    }


    setImageFile(file);


    // Local browser preview only.
    // This is NOT stored in the backend.
    const previewUrl =
      URL.createObjectURL(file);

    setImagePreview(previewUrl);
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

      setSaving(true);


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
          `Upload URL request failed: ${uploadUrlResponse.status}`
        );
      }


      const uploadData =
        await uploadUrlResponse.json();


      if (!uploadData.uploadUrl) {

        console.error(
          "Upload URL response:",
          uploadData
        );

        throw new Error(
          "Upload URL was not returned by Lambda."
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
          `S3 upload failed: ${s3Response.status}`
        );
      }


      // =================================================
      // STEP 3
      // SAVE METADATA THROUGH POST
      // =================================================

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
              key: uploadData.key,

              category:
                category || "Banner",

              name:
                name.trim(),

              description:
                description.trim(),
            }),
          }
        );


      if (!saveResponse.ok) {

        let errorData = {};

        try {
          errorData =
            await saveResponse.json();
        } catch {
          // Ignore JSON parsing error
        }

        console.error(
          "POST error:",
          errorData
        );

        throw new Error(
          errorData.message ||
            `Save failed: ${saveResponse.status}`
        );
      }


      // =================================================
      // STEP 4
      // RELOAD DATA FROM AWS
      // =================================================

      await loadItems();


      // =================================================
      // OPEN LAST PAGE
      // =================================================

      // We reload the data above.
      // After saving, calculate based on the
      // current number of items.

      const newTotalItems =
        items.length + 1;

      const newPage =
        Math.ceil(
          newTotalItems / itemsPerPage
        );

      setCurrentPage(newPage);


      // =================================================
      // RESET FORM
      // =================================================

      resetForm();


      alert(
        "Web Development image uploaded successfully."
      );

    } catch (error) {

      console.error(
        "Save error:",
        error
      );

      alert(
        error.message ||
          "Failed to upload image."
      );

    } finally {

      setSaving(false);
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


    if (!confirmDelete) {
      return;
    }


    try {

      setDeletingId(id);


      // =================================================
      // DELETE THROUGH API
      // =================================================

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


      if (!response.ok) {

        let errorData = {};

        try {
          errorData =
            await response.json();
        } catch {
          // Ignore JSON parsing error
        }

        console.error(
          "DELETE error:",
          errorData
        );

        throw new Error(
          errorData.message ||
            `Delete failed: ${response.status}`
        );
      }


      // =================================================
      // RELOAD DATA
      // =================================================

      const updatedItems =
        items.filter(
          (item) =>
            String(item.id) !==
            String(id)
        );


      setItems(updatedItems);


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


      if (
        currentPage >
        totalPagesAfterDelete
      ) {

        setCurrentPage(
          totalPagesAfterDelete
        );
      }


      alert(
        "Web Development item deleted successfully."
      );

    } catch (error) {

      console.error(
        "Delete error:",
        error
      );

      alert(
        error.message ||
          "Failed to delete item."
      );

    } finally {

      setDeletingId(null);
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
  // PAGINATION DATA
  // =====================================================

  const totalPages = Math.ceil(
    items.length / itemsPerPage
  );


  const startIndex =
    (currentPage - 1) *
    itemsPerPage;


  const currentItems =
    items.slice(
      startIndex,
      startIndex + itemsPerPage
    );


  // =====================================================
  // CHANGE PAGE
  // =====================================================

  const handlePageChange = (page) => {

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

    <div className="webdevelopment-admin">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="webdevelopment-header">

        <h1>
          Web Development
        </h1>


        <button
          type="button"
          className="webdevelopment-add-btn"
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

        <div className="webdevelopment-form-card">


          {/* =================================================
              IMAGE
          ================================================= */}

          <div className="webdevelopment-field">

            <label className="webdevelopment-label">
              Image
            </label>


            <label className="webdevelopment-upload-box">

              {imagePreview ? (

                <div className="webdevelopment-preview-wrapper">

                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="webdevelopment-image-preview"
                  />


                  <span className="webdevelopment-change-text">
                    Change Image
                  </span>

                </div>

              ) : (

                <div className="webdevelopment-upload-placeholder">

                  <span className="webdevelopment-upload-icon">
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
                disabled={saving}
              />

            </label>

          </div>


          {/* =================================================
              CATEGORY
          ================================================= */}

          <div className="webdevelopment-field">

            <label className="webdevelopment-label">
              Category
            </label>


            <select
              className="webdevelopment-select"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              disabled={saving}
            >

              {categories.map(
                (item) => (

                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>

                )
              )}

            </select>

          </div>


          {/* =================================================
              NAME
          ================================================= */}

          <div className="webdevelopment-field">

            <label className="webdevelopment-label">
              Name
            </label>


            <input
              type="text"
              className="webdevelopment-input"
              placeholder="Enter name (optional)"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              disabled={saving}
            />

          </div>


          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <div className="webdevelopment-field">

            <label className="webdevelopment-label">
              Description
            </label>


            <textarea
              className="webdevelopment-textarea"
              placeholder="Enter description (optional)"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              rows="5"
              disabled={saving}
            />

          </div>


          {/* =================================================
              SAVE / CANCEL
          ================================================= */}

          <div className="webdevelopment-form-actions">

            <button
              type="button"
              className="webdevelopment-save-btn"
              onClick={handleSave}
              disabled={saving}
            >

              {saving
                ? "Uploading..."
                : "Save"}

            </button>


            <button
              type="button"
              className="webdevelopment-cancel-btn"
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

        <div className="webdevelopment-loading">
          Loading Web Development data...
        </div>

      )}


      {/* =================================================
          TABLE
      ================================================= */}

      {!loading &&
        items.length > 0 && (

          <div className="webdevelopment-table-wrapper">

            <table className="webdevelopment-table">

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
                  (item, index) => (

                    <tr
                      key={item.id}
                    >


                      {/* NO */}

                      <td>
                        {startIndex +
                          index +
                          1}
                      </td>


                      {/* PREVIEW */}

                      <td>

                        {(
                          item.preview ||
                          item.image ||
                          item.imageUrl ||
                          item.fileUrl
                        ) ? (

                          <img
                            src={
                              item.preview ||
                              item.image ||
                              item.imageUrl ||
                              item.fileUrl
                            }
                            alt={
                              item.name ||
                              item.category ||
                              "Web Development"
                            }
                            className="webdevelopment-table-image"
                          />

                        ) : (

                          <span>
                            No image
                          </span>

                        )}

                      </td>


                      {/* TYPE */}

                      <td>

                        <span className="webdevelopment-type">
                          {item.type ||
                            "Image"}
                        </span>

                      </td>


                      {/* NAME */}

                      <td>

                        <div className="webdevelopment-name">

                          {item.name ||
                            "-"}

                        </div>

                      </td>


                      {/* DESCRIPTION */}

                      <td>

                        <div className="webdevelopment-description">

                          {item.description ||
                            "-"}

                        </div>

                      </td>


                      {/* CATEGORY */}

                      <td>

                        <span className="webdevelopment-category">

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
                          className="webdevelopment-delete-btn"
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

              <div className="webdevelopment-pagination">


                {/* PREVIOUS */}

                <button
                  type="button"
                  className="webdevelopment-page-btn"
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


                {/* PAGE NUMBERS */}

                {Array.from(
                  {
                    length:
                      totalPages,
                  },
                  (_, index) =>
                    index + 1
                ).map(
                  (page) => (

                    <button
                      type="button"
                      key={page}
                      className={`webdevelopment-page-btn ${
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


                {/* NEXT */}

                <button
                  type="button"
                  className="webdevelopment-page-btn"
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
          EMPTY STATE
      ================================================= */}

      {!loading &&
        items.length === 0 &&
        !showForm && (

          <div className="webdevelopment-empty">

            <p>
              No Web Development images
              uploaded yet.
            </p>

          </div>

        )}

    </div>
  );
};


export default WebDevelopment;