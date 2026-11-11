import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import "./Careerbanner.css";

/* =========================================================
   API
========================================================= */

const API_URL =
  "https://66ou0fp7m1.execute-api.ap-south-1.amazonaws.com/prod/careerbanner";


/* =========================================================
   COMPONENT
========================================================= */

const Careerbanner = () => {

  /* =======================================================
     FORM
  ======================================================= */

  const [showForm, setShowForm] =
    useState(false);

  const [category, setCategory] =
    useState("Banner");

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [imagePreview, setImagePreview] =
    useState("");

  const [name, setName] =
    useState("");

  const [description, setDescription] =
    useState("");


  /* =======================================================
     DATA
  ======================================================= */

  const [items, setItems] =
    useState([]);


  /* =======================================================
     LOADING
  ======================================================= */

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState(null);


  /* =======================================================
     ERROR
  ======================================================= */

  const [error, setError] =
    useState("");


  /* =======================================================
     PAGINATION
  ======================================================= */

  const [currentPage, setCurrentPage] =
    useState(1);

  const itemsPerPage = 5;


  /* =======================================================
     FILE INPUT
  ======================================================= */

  const fileInputRef =
    useRef(null);


  /* =========================================================
     LOAD CAREER BANNER DATA
  ========================================================= */

  useEffect(() => {

    loadItems();

  }, []);


  /* =========================================================
     GET DATA FROM API
  ========================================================= */

  const loadItems = async () => {

    try {

      setLoading(true);

      setError("");


      const response =
        await fetch(API_URL);


      if (!response.ok) {

        throw new Error(
          "Failed to load Career Banner data."
        );
      }


      const data =
        await response.json();


      /*
        Lambda normally returns an array.

        This also supports:
        {
          items: [...]
        }

        or:
        {
          data: [...]
        }
      */

      let loadedItems = [];


      if (Array.isArray(data)) {

        loadedItems = data;

      } else if (
        Array.isArray(data.items)
      ) {

        loadedItems = data.items;

      } else if (
        Array.isArray(data.data)
      ) {

        loadedItems = data.data;
      }


      setItems(loadedItems);


      /*
        Make sure current page
        is still valid.
      */

      const total =
        Math.max(
          1,
          Math.ceil(
            loadedItems.length /
              itemsPerPage
          )
        );


      setCurrentPage((page) =>
        Math.min(page, total)
      );


    } catch (err) {

      console.error(
        "Career Banner GET error:",
        err
      );


      setError(
        "Unable to load Career Banner data."
      );


      setItems([]);


    } finally {

      setLoading(false);

    }
  };


  /* =========================================================
     ADD IMAGE
  ========================================================= */

  const handleAddImage = () => {

    setShowForm(true);

    setCategory("Banner");

    setSelectedFile(null);

    setImagePreview("");

    setName("");

    setDescription("");

    setError("");


    if (fileInputRef.current) {

      fileInputRef.current.value = "";

    }
  };


  /* =========================================================
     IMAGE SELECT
  ========================================================= */

  const handleImageChange = (e) => {

    const file =
      e.target.files?.[0];


    if (!file) {
      return;
    }


    /* =====================================================
       CHECK FILE TYPE
    ===================================================== */

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {

      alert(
        "Please select an image file."
      );

      e.target.value = "";

      return;
    }


    /* =====================================================
       SAVE FILE
    ===================================================== */

    setSelectedFile(file);


    /* =====================================================
       CREATE LOCAL PREVIEW
    ===================================================== */

    const previewUrl =
      URL.createObjectURL(file);


    setImagePreview(previewUrl);
  };


  /* =========================================================
     SAVE
  ========================================================= */

  const handleSave = async () => {

    /*
      Your Lambda requires an S3 image key
      when saving metadata.

      Therefore image is required.
    */

    if (!selectedFile) {

      alert(
        "Please select an image."
      );

      return;
    }


    try {

      setSaving(true);

      setError("");


      /* ===================================================
         STEP 1
         GET PRESIGNED S3 UPLOAD URL
      =================================================== */

      const uploadUrlRequest =
        `${API_URL}?upload=true` +
        `&fileName=${encodeURIComponent(
          selectedFile.name
        )}` +
        `&fileType=${encodeURIComponent(
          selectedFile.type
        )}`;


      const uploadResponse =
        await fetch(
          uploadUrlRequest,
          {
            method: "POST",
          }
        );


      const uploadData =
        await uploadResponse.json();


      if (!uploadResponse.ok) {

        throw new Error(
          uploadData.message ||
          "Could not create S3 upload URL."
        );
      }


      const {
        uploadUrl,
        key,
      } = uploadData;


      if (!uploadUrl || !key) {

        throw new Error(
          "Invalid upload response from server."
        );
      }


      /* ===================================================
         STEP 2
         UPLOAD IMAGE DIRECTLY TO S3
      =================================================== */

      const s3Response =
        await fetch(
          uploadUrl,
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
          "Image upload to S3 failed."
        );
      }


      /* ===================================================
         STEP 3
         SAVE METADATA THROUGH LAMBDA
      =================================================== */

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

                key,

              name:

                name.trim(),

              description:

                description.trim(),

              category:

                category,

            }),
          }
        );


      const savedData =
        await saveResponse.json();


      if (!saveResponse.ok) {

        throw new Error(
          savedData.message ||
          "Could not save Career Banner."
        );
      }


      /* ===================================================
         SUCCESS
      =================================================== */

      alert(
        "Career Banner saved successfully."
      );


      /* ===================================================
         REFRESH DATA
      =================================================== */

      await loadItems();


      /* ===================================================
         GO TO LAST PAGE
      =================================================== */

      /*
        loadItems updates items asynchronously,
        so calculate using current count + 1.
      */

      const newTotalPages =
        Math.max(
          1,
          Math.ceil(
            (items.length + 1) /
              itemsPerPage
          )
        );


      setCurrentPage(
        newTotalPages
      );


      /* ===================================================
         RESET FORM
      =================================================== */

      resetForm();


    } catch (err) {

      console.error(
        "Career Banner SAVE error:",
        err
      );


      setError(
        err.message ||
        "Unable to save Career Banner."
      );


      alert(
        err.message ||
        "Unable to save Career Banner."
      );


    } finally {

      setSaving(false);

    }
  };


  /* =========================================================
     RESET FORM
  ========================================================= */

  const resetForm = () => {

    setShowForm(false);

    setCategory("Banner");

    setSelectedFile(null);

    setImagePreview("");

    setName("");

    setDescription("");

    setError("");


    if (fileInputRef.current) {

      fileInputRef.current.value =
        "";

    }
  };


  /* =========================================================
     CANCEL
  ========================================================= */

  const handleCancel = () => {

    resetForm();

  };


  /* =========================================================
     DELETE
  ========================================================= */

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

      setError("");


      /* ===================================================
         DELETE THROUGH API
      =================================================== */

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
              id,
            }),
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to delete Career Banner."
        );
      }


      /* ===================================================
         REFRESH
      =================================================== */

      await loadItems();


      alert(
        "Career Banner deleted successfully."
      );


    } catch (err) {

      console.error(
        "Career Banner DELETE error:",
        err
      );


      setError(
        err.message ||
        "Unable to delete Career Banner."
      );


      alert(
        err.message ||
        "Unable to delete Career Banner."
      );


    } finally {

      setDeletingId(null);

    }
  };


  /* =========================================================
     PAGINATION
  ========================================================= */

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


  /* =========================================================
     PAGE CHANGE
  ========================================================= */

  const handlePageChange = (
    page
  ) => {

    if (
      page < 1 ||
      page > totalPages
    ) {

      return;
    }


    setCurrentPage(page);

  };


  /* =========================================================
     JSX
  ========================================================= */

  return (

    <div className="careerbanner-admin">


      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="careerbanner-header">

        <div>

          <h1>
            Career Banner
          </h1>

        </div>


        {!showForm && (

          <button
            type="button"
            className="careerbanner-add-btn"
            onClick={handleAddImage}
          >
            + Add Image
          </button>

        )}

      </div>


      {/* ===================================================
          ERROR
      =================================================== */}

      {error && (

        <div
          style={{
            marginBottom: "15px",
            padding: "12px 16px",
            background: "#ffe8e8",
            color: "#c62828",
            borderRadius: "8px",
            fontSize: "14px",
          }}
        >
          {error}
        </div>

      )}


      {/* ===================================================
          FORM
      =================================================== */}

      {showForm && (

        <div className="careerbanner-form-card">


          {/* =================================================
              CATEGORY
          ================================================= */}

          <div className="careerbanner-field">

            <label className="careerbanner-label">
              Category
            </label>


            <select
              className="careerbanner-select"
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value
                )
              }
            >

              <option value="Banner">
                Banner
              </option>

              <option value="Life at Kaden Kopper">
                Life at Kaden Kopper
              </option>

            </select>

          </div>


          {/* =================================================
              IMAGE
          ================================================= */}

          <div className="careerbanner-field">

            <label className="careerbanner-label">
              Image
            </label>


            <label className="careerbanner-upload-box">

              {imagePreview ? (

                <div className="careerbanner-preview-wrapper">

                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="careerbanner-image-preview"
                  />

                  <span className="careerbanner-change-text">
                    Change Image
                  </span>

                </div>

              ) : (

                <div className="careerbanner-upload-placeholder">

                  <span className="careerbanner-upload-icon">
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


          {/* =================================================
              NAME
          ================================================= */}

          <div className="careerbanner-field">

            <label className="careerbanner-label">
              Name
            </label>


            <input
              type="text"
              className="careerbanner-input"
              placeholder="Enter name"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
            />

          </div>


          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <div className="careerbanner-field">

            <label className="careerbanner-label">
              Description
            </label>


            <textarea
              className="careerbanner-textarea"
              placeholder="Enter description"
              rows="5"
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
            />

          </div>


          {/* =================================================
              BUTTONS
          ================================================= */}

          <div className="careerbanner-form-actions">


            <button
              type="button"
              className="careerbanner-save-btn"
              onClick={handleSave}
              disabled={saving}
            >

              {saving
                ? "Saving..."
                : "Save"}

            </button>


            <button
              type="button"
              className="careerbanner-cancel-btn"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </button>


          </div>

        </div>

      )}


      {/* ===================================================
          LOADING
      =================================================== */}

      {loading && (

        <div
          style={{
            padding: "40px",
            textAlign: "center",
            color: "#666",
          }}
        >
          Loading Career Banner...
        </div>

      )}


      {/* ===================================================
          TABLE
      =================================================== */}

      {!loading &&
        items.length > 0 && (

          <div className="careerbanner-table-wrapper">

            <table className="careerbanner-table">

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
                      key={
                        item.id ||
                        item._id
                      }
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
                              "Image"
                            }
                            className="careerbanner-table-image"
                          />

                        ) : (

                          <div className="careerbanner-no-image">
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

                        <div className="careerbanner-description">

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

                        {item.created
                          ? new Date(
                              item.created
                            ).toLocaleDateString(
                              "en-GB"
                            )
                          : "-"}

                      </td>


                      {/* DELETE */}

                      <td>

                        <button
                          type="button"
                          className="careerbanner-delete-btn"
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

              <div className="careerbanner-pagination">


                {/* PREVIOUS */}

                <button
                  type="button"
                  className="careerbanner-page-btn"
                  disabled={
                    currentPage ===
                    1
                  }
                  onClick={() =>
                    handlePageChange(
                      currentPage -
                        1
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
                      className={`careerbanner-page-btn ${
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
                  className="careerbanner-page-btn"
                  disabled={
                    currentPage ===
                    totalPages
                  }
                  onClick={() =>
                    handlePageChange(
                      currentPage +
                        1
                    )
                  }
                >
                  Next
                </button>

              </div>

            )}

          </div>

        )}


      {/* ===================================================
          EMPTY
      =================================================== */}

      {!loading &&
        items.length === 0 &&
        !showForm && (

          <div
            style={{
              padding: "50px 20px",
              textAlign: "center",
              color: "#777",
            }}
          >

            No Career Banner images added yet.

          </div>

        )}

    </div>
  );
};


export default Careerbanner;