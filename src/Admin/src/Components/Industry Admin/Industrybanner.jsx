import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import "./Industrybanner.css";

// =====================================================
// API URL
// =====================================================

const API_URL =
  "https://66ou0fp7m1.execute-api.ap-south-1.amazonaws.com/prod/industrybanner";


// =====================================================
// COMPONENT
// =====================================================

const Industrybanner = () => {

  // ===================================================
  // FORM STATE
  // ===================================================

  const [showForm, setShowForm] = useState(false);

  const [category, setCategory] =
    useState("Banner");

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
    useState(false);

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


  // ===================================================
  // LOAD DATA WHEN PAGE OPENS
  // ===================================================

  useEffect(() => {
    fetchItems();
  }, []);


  // ===================================================
  // GET ITEMS FROM API
  // ===================================================

  const fetchItems = async () => {

    try {

      setLoading(true);

      const response =
        await fetch(API_URL);

      if (!response.ok) {
        throw new Error(
          `Failed to load data. Status: ${response.status}`
        );
      }

      const data =
        await response.json();

      console.log(
        "Industry Banner API response:",
        data
      );


      /*
        Your Lambda GET returns an array:

        [
          {
            id,
            type,
            key,
            name,
            description,
            category,
            created,
            image,
            imageUrl,
            preview
          }
        ]
      */

      if (Array.isArray(data)) {

        setItems(data);

      } else if (
        Array.isArray(data.items)
      ) {

        setItems(data.items);

      } else {

        setItems([]);
      }


      setCurrentPage(1);

    } catch (error) {

      console.error(
        "Fetch Industry Banner error:",
        error
      );

      alert(
        "Failed to load Industry Banner data."
      );

    } finally {

      setLoading(false);
    }
  };


  // ===================================================
  // ADD IMAGE BUTTON
  // ===================================================

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


  // ===================================================
  // IMAGE CHANGE
  // ===================================================

  const handleImageChange = (e) => {

    const file =
      e.target.files?.[0];

    if (!file) {
      return;
    }


    // -----------------------------------------------
    // CHECK IMAGE
    // -----------------------------------------------

    if (
      !file.type.startsWith("image/")
    ) {

      alert(
        "Please select an image."
      );

      e.target.value = "";

      return;
    }


    // -----------------------------------------------
    // STORE ACTUAL FILE
    // -----------------------------------------------

    setSelectedFile(file);


    // -----------------------------------------------
    // CREATE LOCAL PREVIEW
    // -----------------------------------------------

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

    // -----------------------------------------------
    // VALIDATION
    // -----------------------------------------------

    if (!selectedFile) {

      alert(
        "Please select an image."
      );

      return;
    }


    if (!name.trim()) {

      alert(
        "Please enter a name."
      );

      return;
    }


    if (!description.trim()) {

      alert(
        "Please enter a description."
      );

      return;
    }


    try {

      setSaving(true);


      // =================================================
      // STEP 1
      // GET S3 PRESIGNED URL
      // =================================================

      const uploadUrlRequest =
        `${API_URL}?upload=true` +
        `&fileName=${encodeURIComponent(
          selectedFile.name
        )}` +
        `&fileType=${encodeURIComponent(
          selectedFile.type
        )}`;


      console.log(
        "Requesting upload URL..."
      );


      const uploadResponse =
        await fetch(
          uploadUrlRequest,
          {
            method: "GET",
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
          "Failed to get S3 upload URL."
        );
      }


      const uploadData =
        await uploadResponse.json();


      console.log(
        "Upload URL response:",
        uploadData
      );


      if (
        !uploadData.uploadUrl ||
        !uploadData.key
      ) {

        throw new Error(
          "Upload URL or image key was not returned."
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
                selectedFile.type,
            },

            body: selectedFile,
          }
        );


      if (!s3Response.ok) {

        const errorText =
          await s3Response.text();

        console.error(
          "S3 upload error:",
          errorText
        );

        throw new Error(
          "Image upload to S3 failed."
        );
      }


      console.log(
        "Image uploaded successfully."
      );


      // =================================================
      // STEP 3
      // SAVE METADATA THROUGH LAMBDA
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

              key:
                uploadData.key,

              name:
                name.trim(),

              description:
                description.trim(),

              category:
                category,
            }),
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
          "Failed to save Industry Banner data."
        );
      }


      const savedItem =
        await saveResponse.json();


      console.log(
        "Saved Industry Banner:",
        savedItem
      );


      // =================================================
      // STEP 4
      // RESET FORM
      // =================================================

      resetForm();


      // =================================================
      // STEP 5
      // LOAD FRESH DATA
      // =================================================

      await fetchItems();


      alert(
        "Industry Banner saved successfully."
      );

    } catch (error) {

      console.error(
        "Save Industry Banner error:",
        error
      );

      alert(
        error.message ||
        "Failed to save Industry Banner."
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

    setImagePreview("");

    setSelectedFile(null);

    setName("");

    setDescription("");


    if (fileInputRef.current) {

      fileInputRef.current.value = "";
    }
  };


  // ===================================================
  // CANCEL
  // ===================================================

  const handleCancel = () => {

    resetForm();
  };


  // ===================================================
  // DELETE
  // ===================================================

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
      // DELETE FROM API
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


      if (!response.ok) {

        const errorText =
          await response.text();

        console.error(
          "Delete error:",
          errorText
        );

        throw new Error(
          "Failed to delete Industry Banner."
        );
      }


      const result =
        await response.json();


      console.log(
        "Delete response:",
        result
      );


      // =================================================
      // RELOAD DATA
      // =================================================

      await fetchItems();


      alert(
        "Industry Banner deleted successfully."
      );

    } catch (error) {

      console.error(
        "Delete Industry Banner error:",
        error
      );

      alert(
        error.message ||
        "Failed to delete Industry Banner."
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
      startIndex + itemsPerPage
    );


  // ===================================================
  // PAGE CHANGE
  // ===================================================

  const handlePageChange = (page) => {

    if (
      page < 1 ||
      page > totalPages
    ) {
      return;
    }

    setCurrentPage(page);
  };


  // ===================================================
  // RENDER
  // ===================================================

  return (

    <div className="industrybanner-admin">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="industrybanner-header">

        <h1>
          Industry Banner
        </h1>


        <button
          type="button"
          className="industrybanner-add-btn"
          onClick={handleAddImage}
          disabled={saving}
        >
          + Add Image
        </button>

      </div>


      {/* =================================================
          LOADING
      ================================================= */}

      {loading && (

        <div className="industrybanner-loading">

          Loading Industry Banner...

        </div>
      )}


      {/* =================================================
          FORM
      ================================================= */}

      {showForm && (

        <div className="industrybanner-form-card">

          {/* =============================================
              CATEGORY
          ============================================= */}

          <div className="industrybanner-field">

            <label className="industrybanner-label">
              Category
            </label>


            <select
              className="industrybanner-select"
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

            </select>

          </div>


          {/* =============================================
              IMAGE
          ============================================= */}

          <div className="industrybanner-field">

            <label className="industrybanner-label">
              Image
            </label>


            <label className="industrybanner-upload-box">

              {imagePreview ? (

                <div className="industrybanner-preview-wrapper">

                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="industrybanner-image-preview"
                  />


                  <span className="industrybanner-change-text">
                    Change Image
                  </span>

                </div>

              ) : (

                <div className="industrybanner-upload-placeholder">

                  <span className="industrybanner-upload-icon">
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

          <div className="industrybanner-field">

            <label className="industrybanner-label">
              Name
            </label>


            <input
              type="text"
              className="industrybanner-input"
              placeholder="Enter name"
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

          <div className="industrybanner-field">

            <label className="industrybanner-label">
              Description
            </label>


            <textarea
              className="industrybanner-textarea"
              placeholder="Enter description"
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
              SAVE / CANCEL
          ============================================= */}

          <div className="industrybanner-form-actions">

            <button
              type="button"
              className="industrybanner-save-btn"
              onClick={handleSave}
              disabled={saving}
            >

              {saving
                ? "Saving..."
                : "Save"}

            </button>


            <button
              type="button"
              className="industrybanner-cancel-btn"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </button>

          </div>

        </div>
      )}


      {/* =================================================
          TABLE
      ================================================= */}

      {!loading &&
        items.length > 0 && (

          <div className="industrybanner-table-wrapper">

            <table className="industrybanner-table">

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
                              "Image"
                            }
                            className="industrybanner-table-image"
                          />

                        ) : (

                          <div className="industrybanner-no-image">
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
                        {item.name ||
                          "-"}
                      </td>


                      {/* DESCRIPTION */}

                      <td>

                        <div className="industrybanner-description">

                          {item.description ||
                            "-"}

                        </div>

                      </td>


                      {/* CATEGORY */}

                      <td>
                        {item.category ||
                          "Banner"}
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
                          className="industrybanner-delete-btn"
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

              <div className="industrybanner-pagination">

                <button
                  type="button"
                  className="industrybanner-page-btn"
                  disabled={
                    currentPage ===
                    1
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
                      className={`industrybanner-page-btn ${
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


                <button
                  type="button"
                  className="industrybanner-page-btn"
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

          <div className="industrybanner-empty">

            No Industry Banner images found.

          </div>
        )}

    </div>
  );
};


export default Industrybanner;