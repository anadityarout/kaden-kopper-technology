import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import "./Smarthealthcare.css";

// =====================================================
// API URL
// =====================================================

const API_URL =
  "https://66ou0fp7m1.execute-api.ap-south-1.amazonaws.com/prod/smarthealthcare";


// =====================================================
// SMART HEALTHCARE
// =====================================================

const Smarthealthcare = () => {

  // ===================================================
  // FORM STATE
  // ===================================================

  const [showForm, setShowForm] =
    useState(false);

  const [category, setCategory] =
    useState("");

  const [imagePreview, setImagePreview] =
    useState("");

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [name, setName] =
    useState("");

  const [description, setDescription] =
    useState("");


  // ===================================================
  // DATA STATE
  // ===================================================

  const [items, setItems] =
    useState([]);

  const [currentPage, setCurrentPage] =
    useState(1);


  // ===================================================
  // LOADING STATE
  // ===================================================

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState(null);


  // ===================================================
  // FILE INPUT
  // ===================================================

  const fileInputRef =
    useRef(null);


  // ===================================================
  // PAGINATION
  // ===================================================

  const itemsPerPage = 5;


  // =====================================================
  // LOAD DATA FROM AWS
  // =====================================================

  const loadItems = async () => {

    try {

      setLoading(true);


      const response =
        await fetch(API_URL);


      const data =
        await response.json();


      console.log(
        "Smart Healthcare GET:",
        data
      );


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to load Smart Healthcare data."
        );
      }


      if (Array.isArray(data)) {

        setItems(data);


        const totalPages =
          Math.max(
            1,
            Math.ceil(
              data.length /
              itemsPerPage
            )
          );


        setCurrentPage(
          (previousPage) =>
            Math.min(
              previousPage,
              totalPages
            )
        );

      } else {

        setItems([]);

        setCurrentPage(1);
      }

    } catch (error) {

      console.error(
        "Smart Healthcare GET error:",
        error
      );


      alert(
        error.message ||
        "Failed to load Smart Healthcare data."
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
  // OPEN ADD FORM
  // =====================================================

  const handleAddImage = () => {

    setShowForm(true);

    setCategory("");

    setImagePreview("");

    setSelectedFile(null);

    setName("");

    setDescription("");


    if (fileInputRef.current) {

      fileInputRef.current.value = "";
    }
  };


  // =====================================================
  // IMAGE CHANGE
  // =====================================================

  const handleImageChange = (event) => {

    const file =
      event.target.files?.[0];


    if (!file) {

      setSelectedFile(null);

      setImagePreview("");

      return;
    }


    // -------------------------------------------------
    // CHECK IMAGE
    // -------------------------------------------------

    if (!file.type.startsWith("image/")) {

      alert(
        "Please select an image file."
      );


      event.target.value = "";

      setSelectedFile(null);

      setImagePreview("");

      return;
    }


    // -------------------------------------------------
    // SAVE FILE
    // -------------------------------------------------

    setSelectedFile(file);


    // -------------------------------------------------
    // PREVIEW
    // -------------------------------------------------

    const reader =
      new FileReader();


    reader.onloadend = () => {

      setImagePreview(
        reader.result
      );
    };


    reader.readAsDataURL(file);
  };


  // =====================================================
  // SAVE
  // =====================================================

  const handleSave = async () => {

    try {

      setSaving(true);


      let imageKey = "";


      // =================================================
      // IMAGE IS OPTIONAL
      // =================================================

      if (selectedFile) {

        // ===============================================
        // STEP 1
        // REQUEST PRESIGNED URL
        // ===============================================

        const uploadRequestUrl =
          `${API_URL}?upload=true` +
          `&fileName=${encodeURIComponent(
            selectedFile.name
          )}` +
          `&fileType=${encodeURIComponent(
            selectedFile.type
          )}`;


        console.log(
          "Requesting S3 upload URL..."
        );


        const uploadResponse =
          await fetch(
            uploadRequestUrl,
            {
              method: "POST",
            }
          );


        const uploadData =
          await uploadResponse.json();


        console.log(
          "Upload URL response:",
          uploadData
        );


        if (!uploadResponse.ok) {

          throw new Error(
            uploadData.message ||
            "Failed to generate upload URL."
          );
        }


        if (
          !uploadData.uploadUrl ||
          !uploadData.key
        ) {

          throw new Error(
            "Upload URL or S3 key was not returned."
          );
        }


        // ===============================================
        // STEP 2
        // UPLOAD IMAGE TO S3
        // ===============================================

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
                  selectedFile.type,
              },

              body: selectedFile,
            }
          );


        if (!s3Response.ok) {

          throw new Error(
            `S3 image upload failed: ${s3Response.status}`
          );
        }


        console.log(
          "Image successfully uploaded to S3."
        );


        imageKey =
          uploadData.key;
      }


      // =================================================
      // SAVE EXACTLY WHAT ADMIN ENTERED
      // =================================================

      const metadata = {

        key:
          imageKey,

        name:
          name.trim(),

        description:
          description.trim(),

        category:
          category,
      };


      console.log(
        "Saving Smart Healthcare metadata:",
        metadata
      );


      // =================================================
      // STEP 3
      // SAVE DATA THROUGH LAMBDA
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

            body:
              JSON.stringify(
                metadata
              ),
          }
        );


      const saveData =
        await saveResponse.json();


      console.log(
        "Save response:",
        saveData
      );


      if (!saveResponse.ok) {

        throw new Error(
          saveData.message ||
          "Failed to save Smart Healthcare data."
        );
      }


      // =================================================
      // SUCCESS
      // =================================================

      alert(
        "Smart Healthcare saved successfully."
      );


      // Clear form
      resetForm();


      // Reload data from AWS
      await loadItems();

    } catch (error) {

      console.error(
        "Smart Healthcare save error:",
        error
      );


      alert(
        error.message ||
        "Failed to save Smart Healthcare."
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

    setCategory("");

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
      // DELETE FROM LAMBDA
      // =================================================

      const response =
        await fetch(
          `${API_URL}?id=${encodeURIComponent(
            id
          )}`,
          {
            method: "DELETE",
          }
        );


      const data =
        await response.json();


      console.log(
        "Delete response:",
        data
      );


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to delete Smart Healthcare item."
        );
      }


      alert(
        "Smart Healthcare item deleted successfully."
      );


      // Reload AWS data
      await loadItems();

    } catch (error) {

      console.error(
        "Delete error:",
        error
      );


      alert(
        error.message ||
        "Failed to delete Smart Healthcare item."
      );

    } finally {

      setDeletingId(null);
    }
  };


  // =====================================================
  // PAGINATION
  // =====================================================

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        items.length /
        itemsPerPage
      )
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


  // =====================================================
  // PAGE CHANGE
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

    <div className="smarthealthcare-admin">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="smarthealthcare-header">

        <h1>
          Smart Healthcare
        </h1>


        <button
          type="button"
          className="smarthealthcare-add-btn"
          onClick={handleAddImage}
          disabled={saving}
        >
          + Add Image
        </button>

      </div>


      {/* =================================================
          FORM
      ================================================= */}

      {showForm && (

        <div className="smarthealthcare-form-card">

          {/* =================================================
              CATEGORY
          ================================================= */}

          <div className="smarthealthcare-field">

            <label className="smarthealthcare-label">
              Category
            </label>


            <select
              className="smarthealthcare-select"
              value={category}
              onChange={(event) =>
                setCategory(
                  event.target.value
                )
              }
              disabled={saving}
            >

              <option value="">
                Select Category
              </option>


              <option value="Banner">
                Banner
              </option>


              <option value="Why Choose Healthcare">
                Why Choose Healthcare
              </option>


              <option value="Smart Health Care">
                Smart Health Care
              </option>


              <option value="Work">
                Work
              </option>

            </select>

          </div>


          {/* =================================================
              IMAGE
          ================================================= */}

          <div className="smarthealthcare-field">

            <label className="smarthealthcare-label">
              Image
            </label>


            <label
              className="smarthealthcare-upload-box"
            >

              {imagePreview ? (

                <div className="smarthealthcare-preview-wrapper">

                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="smarthealthcare-image-preview"
                  />


                  <span className="smarthealthcare-change-text">
                    Change Image
                  </span>

                </div>

              ) : (

                <div className="smarthealthcare-upload-placeholder">

                  <span className="smarthealthcare-upload-icon">
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
              NAME
          ================================================= */}

          <div className="smarthealthcare-field">

            <label className="smarthealthcare-label">
              Name
            </label>


            <input
              type="text"
              className="smarthealthcare-input"
              placeholder="Enter name"
              value={name}
              onChange={(event) =>
                setName(
                  event.target.value
                )
              }
              disabled={saving}
            />

          </div>


          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <div className="smarthealthcare-field">

            <label className="smarthealthcare-label">
              Description
            </label>


            <textarea
              className="smarthealthcare-textarea"
              placeholder="Enter description"
              rows="5"
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
              disabled={saving}
            />

          </div>


          {/* =================================================
              SAVE / CANCEL
          ================================================= */}

          <div className="smarthealthcare-form-actions">

            <button
              type="button"
              className="smarthealthcare-save-btn"
              onClick={handleSave}
              disabled={saving}
            >

              {saving
                ? "Saving..."
                : "Save"}

            </button>


            <button
              type="button"
              className="smarthealthcare-cancel-btn"
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

        <div
          style={{
            textAlign: "center",
            padding: "30px",
          }}
        >
          Loading Smart Healthcare...
        </div>

      )}


      {/* =================================================
          TABLE
      ================================================= */}

      {!loading &&
        items.length > 0 && (

          <div className="smarthealthcare-table-wrapper">

            <table className="smarthealthcare-table">

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

                        {item.preview ||
                        item.image ||
                        item.imageUrl ? (

                          <img
                            src={
                              item.preview ||
                              item.image ||
                              item.imageUrl
                            }
                            alt={
                              item.name ||
                              "Smart Healthcare"
                            }
                            className="smarthealthcare-table-image"
                          />

                        ) : (

                          <div className="smarthealthcare-no-image">
                            No Image
                          </div>

                        )}

                      </td>


                      {/* TYPE */}

                      <td>
                        {item.type ||
                          "-"}
                      </td>


                      {/* NAME */}

                      <td>
                        {item.name ||
                          "-"}
                      </td>


                      {/* DESCRIPTION */}

                      <td>

                        <div className="smarthealthcare-description">

                          {item.description ||
                            "-"}

                        </div>

                      </td>


                      {/* CATEGORY */}

                      <td>
                        {item.category ||
                          "-"}
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
                          className="smarthealthcare-delete-btn"
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

              <div className="smarthealthcare-pagination">

                <button
                  type="button"
                  className="smarthealthcare-page-btn"
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
                      className={`smarthealthcare-page-btn ${
                        currentPage === page
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


                <button
                  type="button"
                  className="smarthealthcare-page-btn"
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

          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: "#777",
            }}
          >
            No Smart Healthcare content found.
          </div>

        )}

    </div>
  );
};


export default Smarthealthcare;