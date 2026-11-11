import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import "./Retailecommerce.css";


// =====================================================
// API CONFIGURATION
// =====================================================

const API_URL =
  "https://66ou0fp7m1.execute-api.ap-south-1.amazonaws.com/prod/retailcommerce";


// =====================================================
// COMPONENT
// =====================================================

const Retailecommerce = () => {

  // =====================================================
  // FORM STATE
  // =====================================================

  const [showForm, setShowForm] = useState(false);

  const [category, setCategory] = useState("Banner");

  const [imagePreview, setImagePreview] = useState("");

  const [imageFile, setImageFile] = useState(null);

  const [name, setName] = useState("");

  const [description, setDescription] = useState("");


  // =====================================================
  // TABLE DATA
  // =====================================================

  const [items, setItems] = useState([]);


  // =====================================================
  // LOADING / SAVING STATE
  // =====================================================

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] = useState(null);


  // =====================================================
  // ERROR
  // =====================================================

  const [error, setError] = useState("");


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
  // LOAD DATA FROM AWS
  // =====================================================

  useEffect(() => {
    loadItems();
  }, []);


  // =====================================================
  // GET ITEMS
  // =====================================================

  const loadItems = async () => {

    try {

      setLoading(true);

      setError("");


      const response = await fetch(API_URL, {
        method: "GET",
      });


      if (!response.ok) {
        throw new Error(
          `Failed to load data. Status: ${response.status}`
        );
      }


      const data = await response.json();


      console.log(
        "Retail Commerce API Response:",
        data
      );


      // Lambda returns an array directly
      if (Array.isArray(data)) {

        setItems(data);

      } else {

        setItems([]);

      }


    } catch (error) {

      console.error(
        "Load Retail Commerce error:",
        error
      );

      setError(
        error.message ||
        "Failed to load Retail & E-Commerce data."
      );

    } finally {

      setLoading(false);

    }
  };


  // =====================================================
  // OPEN ADD FORM
  // =====================================================

  const handleAddClick = () => {

    setShowForm(true);

    setCategory("Banner");

    setImagePreview("");

    setImageFile(null);

    setName("");

    setDescription("");

    setError("");


    if (fileInputRef.current) {

      fileInputRef.current.value = "";

    }
  };


  // =====================================================
  // IMAGE SELECT
  // =====================================================

  const handleImageChange = (e) => {

    const file = e.target.files?.[0];


    if (!file) {
      return;
    }


    // Only images
    if (!file.type.startsWith("image/")) {

      alert("Please select an image file.");

      e.target.value = "";

      return;
    }


    setImageFile(file);


    // Local preview
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

    try {

      setError("");


      // =================================================
      // VALIDATE IMAGE
      // =================================================

      if (!imageFile) {

        alert("Please choose an image.");

        return;

      }


      setSaving(true);


      // =================================================
      // STEP 1
      // GET PRESIGNED S3 UPLOAD URL
      // =================================================

      const uploadUrlRequest =
        `${API_URL}?upload=true` +
        `&fileName=${encodeURIComponent(imageFile.name)}` +
        `&fileType=${encodeURIComponent(imageFile.type)}`;


      console.log(
        "Requesting S3 upload URL..."
      );


      const uploadResponse = await fetch(
        uploadUrlRequest,
        {
          method: "POST",
        }
      );


      if (!uploadResponse.ok) {

        const errorText =
          await uploadResponse.text();

        console.error(
          "Upload URL error:",
          errorText
        );

        throw new Error(
          "Failed to generate S3 upload URL."
        );

      }


      const uploadData =
        await uploadResponse.json();


      console.log(
        "Upload URL response:",
        uploadData
      );


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


      // =================================================
      // STEP 2
      // UPLOAD IMAGE DIRECTLY TO S3
      // =================================================

      console.log(
        "Uploading image to S3..."
      );


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

        console.error(
          "S3 upload failed:",
          s3Response.status,
          s3Response.statusText
        );

        throw new Error(
          "Image upload to S3 failed."
        );

      }


      console.log(
        "Image uploaded successfully to S3."
      );


      // =================================================
      // STEP 3
      // SAVE METADATA THROUGH LAMBDA
      // =================================================

      const metadata = {

        key: uploadData.key,

        name:
          name.trim() || "-",

        description:
          description.trim() || "-",

        category:
          category || "Banner",
      };


      console.log(
        "Saving metadata:",
        metadata
      );


      const saveResponse = await fetch(
        API_URL,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(metadata),
        }
      );


      if (!saveResponse.ok) {

        const errorText =
          await saveResponse.text();

        console.error(
          "Save metadata error:",
          errorText
        );

        throw new Error(
          "Failed to save image information."
        );

      }


      const savedItem =
        await saveResponse.json();


      console.log(
        "Saved item:",
        savedItem
      );


      // =================================================
      // STEP 4
      // RELOAD DATA FROM AWS
      // =================================================

      await loadItems();


      // =================================================
      // RESET FORM
      // =================================================

      resetForm();


      // =================================================
      // SHOW SUCCESS
      // =================================================

      alert(
        "Retail & E-Commerce image added successfully."
      );


    } catch (error) {

      console.error(
        "Retail Commerce Save Error:",
        error
      );


      setError(
        error.message ||
        "Failed to save image."
      );


      alert(
        error.message ||
        "Failed to save image."
      );

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

    setImageFile(null);

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

    setError("");

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

      setError("");

      setDeletingId(id);


      // =================================================
      // DELETE THROUGH API
      // =================================================

      const response = await fetch(
        `${API_URL}?id=${encodeURIComponent(id)}`,
        {
          method: "DELETE",
        }
      );


      if (!response.ok) {

        const errorText =
          await response.text();

        console.error(
          "Delete error:",
          errorText
        );

        throw new Error(
          "Failed to delete item."
        );

      }


      const result =
        await response.json();


      console.log(
        "Delete response:",
        result
      );


      // =================================================
      // RELOAD FROM AWS
      // =================================================

      await loadItems();


      // =================================================
      // PAGINATION CHECK
      // =================================================

      const remainingItems =
        items.length - 1;

      const newTotalPages =
        Math.max(
          1,
          Math.ceil(
            remainingItems / itemsPerPage
          )
        );


      if (
        currentPage > newTotalPages
      ) {

        setCurrentPage(
          newTotalPages
        );

      }


      alert(
        "Item deleted successfully."
      );


    } catch (error) {

      console.error(
        "Retail Commerce Delete Error:",
        error
      );


      setError(
        error.message ||
        "Failed to delete item."
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
  // PAGINATION
  // =====================================================

  const totalPages =
    Math.ceil(
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
  // PAGE CHANGE
  // =====================================================

  const goToPage = (page) => {

    if (
      page < 1 ||
      page > totalPages
    ) {
      return;
    }


    setCurrentPage(page);

  };


  const goToPrevious = () => {

    if (currentPage > 1) {

      setCurrentPage(
        (prev) => prev - 1
      );

    }

  };


  const goToNext = () => {

    if (
      currentPage < totalPages
    ) {

      setCurrentPage(
        (prev) => prev + 1
      );

    }

  };


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div className="retailecommerce-admin">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="retailecommerce-header">

        <h1>
          Retail &amp; E-Commerce
        </h1>


        <button
          type="button"
          className="retailecommerce-add-btn"
          onClick={handleAddClick}
        >
          + Add Image
        </button>

      </div>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <div
          className="retailecommerce-error"
        >
          {error}
        </div>

      )}


      {/* =================================================
          ADD FORM
      ================================================= */}

      {showForm && (

        <div className="retailecommerce-form-card">

          {/* =================================================
              CATEGORY
          ================================================= */}

          <div className="retailecommerce-field">

            <label className="retailecommerce-label">
              Category
            </label>


            <select
              className="retailecommerce-select"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
            >

              <option value="Banner">
                Banner
              </option>

              <option value="Why Choose Us">
                Why Choose Us
              </option>

              <option value="Case Studies">
                Case Studies
              </option>

              <option value="Industries We Serve">
                Industries We Serve
              </option>

            </select>

          </div>


          {/* =================================================
              IMAGE UPLOAD
          ================================================= */}

          <div className="retailecommerce-field">

            <label className="retailecommerce-upload-box">

              {imagePreview ? (

                <div className="retailecommerce-preview-wrapper">

                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="retailecommerce-image-preview"
                  />

                  <span className="retailecommerce-change-text">
                    Change Image
                  </span>

                </div>

              ) : (

                <div className="retailecommerce-upload-placeholder">

                  <span className="retailecommerce-upload-icon">
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

          <div className="retailecommerce-field">

            <input
              type="text"
              className="retailecommerce-input"
              placeholder="Image Name (Optional)"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />

          </div>


          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <div className="retailecommerce-field">

            <textarea
              className="retailecommerce-textarea"
              placeholder="Image Description (Optional)"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              rows="5"
            />

          </div>


          {/* =================================================
              ACTIONS
          ================================================= */}

          <div className="retailecommerce-form-actions">

            <button
              type="button"
              className="retailecommerce-save-btn"
              onClick={handleSave}
              disabled={saving}
            >

              {saving
                ? "Saving..."
                : "Save"}

            </button>


            <button
              type="button"
              className="retailecommerce-cancel-btn"
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

        <div className="retailecommerce-loading">
          Loading...
        </div>

      )}


      {/* =================================================
          TABLE
      ================================================= */}

      {!loading &&
        items.length > 0 && (

          <div className="retailecommerce-table-wrapper">

            <table className="retailecommerce-table">

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
                        {startIndex + index + 1}
                      </td>


                      {/* PREVIEW */}

                      <td>

                        {item.preview ? (

                          <img
                            src={item.preview}
                            alt={
                              item.name ||
                              "Retail Commerce"
                            }
                            className="retailecommerce-table-image"
                          />

                        ) : (

                          <div className="retailecommerce-no-image">
                            -
                          </div>

                        )}

                      </td>


                      {/* TYPE */}

                      <td>
                        {item.type || "Image"}
                      </td>


                      {/* NAME */}

                      <td>

                        <div className="retailecommerce-name">
                          {item.name || "-"}
                        </div>

                      </td>


                      {/* DESCRIPTION */}

                      <td>

                        <div className="retailecommerce-description">
                          {item.description || "-"}
                        </div>

                      </td>


                      {/* CATEGORY */}

                      <td>

                        <span className="retailecommerce-category">
                          {item.category || "-"}
                        </span>

                      </td>


                      {/* CREATED */}

                      <td>
                        {item.created || "-"}
                      </td>


                      {/* ACTION */}

                      <td>

                        <button
                          type="button"
                          className="retailecommerce-delete-btn"
                          onClick={() =>
                            handleDelete(
                              item.id
                            )
                          }
                          disabled={
                            deletingId === item.id
                          }
                        >

                          {deletingId === item.id
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

              <div className="retailecommerce-pagination">

                <button
                  type="button"
                  className="retailecommerce-page-btn"
                  disabled={
                    currentPage === 1
                  }
                  onClick={
                    goToPrevious
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
                    className={`retailecommerce-page-btn ${
                      currentPage === page
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      goToPage(page)
                    }
                  >
                    {page}
                  </button>

                ))}


                <button
                  type="button"
                  className="retailecommerce-page-btn"
                  disabled={
                    currentPage ===
                    totalPages
                  }
                  onClick={
                    goToNext
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

          <div className="retailecommerce-empty">

            No Retail &amp; E-Commerce images found.

          </div>

        )}

    </div>

  );

};


export default Retailecommerce;