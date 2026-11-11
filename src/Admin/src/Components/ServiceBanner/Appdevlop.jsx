import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import "./Appdevlop.css";


/* =====================================================
   AWS API
===================================================== */

const APP_DEVELOPMENT_API =
  "https://66ou0fp7m1.execute-api.ap-south-1.amazonaws.com/prod/appdevelopment";


/* =====================================================
   APP DEVELOPMENT COMPONENT
===================================================== */

const Appdevlop = () => {

  // =====================================================
  // FORM STATE
  // =====================================================

  const [showForm, setShowForm] =
    useState(false);


  // =====================================================
  // IMAGE STATE
  // =====================================================

  const [imagePreview, setImagePreview] =
    useState("");

  const [imageFile, setImageFile] =
    useState(null);


  // =====================================================
  // FORM DATA
  // =====================================================

  const [category, setCategory] =
    useState("Banner");

  const [name, setName] =
    useState("");

  const [description, setDescription] =
    useState("");


  // =====================================================
  // TABLE DATA
  // =====================================================

  const [items, setItems] =
    useState([]);


  // =====================================================
  // LOADING
  // =====================================================

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState(null);


  // =====================================================
  // PAGINATION
  // =====================================================

  const [currentPage, setCurrentPage] =
    useState(1);

  const itemsPerPage = 5;


  // =====================================================
  // FILE INPUT
  // =====================================================

  const fileInputRef =
    useRef(null);


  // =====================================================
  // CATEGORY OPTIONS
  // =====================================================

  const categories = [
    "Banner",
    "Native App Development",
    "Why Choose",
  ];


  // =====================================================
  // GET IMAGE URL
  // =====================================================

  const getImageUrl = (item) => {

    return (
      item?.image ||
      item?.imageUrl ||
      item?.fileUrl ||
      item?.preview ||
      ""
    );

  };


  // =====================================================
  // LOAD DATA FROM AWS
  // =====================================================

  const loadItems = async () => {

    try {

      setLoading(true);

      const response =
        await fetch(
          APP_DEVELOPMENT_API
        );


      if (!response.ok) {

        throw new Error(
          `GET request failed: ${response.status}`
        );

      }


      const data =
        await response.json();


      if (Array.isArray(data)) {

        setItems(data);

      } else {

        setItems([]);

      }

    } catch (error) {

      console.error(
        "App Development GET error:",
        error
      );

      alert(
        "Failed to load App Development data."
      );

      setItems([]);

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

    const file =
      e.target.files?.[0];


    if (!file) {
      return;
    }


    // -----------------------------------------------
    // IMAGE VALIDATION
    // -----------------------------------------------

    if (
      !file.type.startsWith("image/")
    ) {

      alert(
        "Please select an image file."
      );

      e.target.value = "";

      return;

    }


    setImageFile(file);


    // -----------------------------------------------
    // LOCAL PREVIEW
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


  // =====================================================
  // GET PRESIGNED UPLOAD URL
  // =====================================================

  const getUploadUrl = async (file) => {

    const url =
      `${APP_DEVELOPMENT_API}?upload=true&fileName=${encodeURIComponent(
        file.name
      )}&fileType=${encodeURIComponent(
        file.type
      )}`;


    const response =
      await fetch(url);


    if (!response.ok) {

      const errorText =
        await response.text();

      throw new Error(
        `Failed to get upload URL: ${errorText}`
      );

    }


    const data =
      await response.json();


    if (!data.uploadUrl) {

      throw new Error(
        "Upload URL was not returned by Lambda."
      );

    }


    return data;

  };


  // =====================================================
  // UPLOAD IMAGE DIRECTLY TO S3
  // =====================================================

  const uploadImageToS3 = async (
    uploadUrl,
    file
  ) => {

    const response =
      await fetch(
        uploadUrl,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              file.type,
          },

          body: file,
        }
      );


    if (!response.ok) {

      const errorText =
        await response.text();

      throw new Error(
        `S3 upload failed: ${response.status} ${errorText}`
      );

    }


    return true;

  };


  // =====================================================
  // SAVE
  // =====================================================

  const handleSave = async () => {

    // -----------------------------------------------
    // IMAGE REQUIRED
    // -----------------------------------------------

    if (!imageFile) {

      alert(
        "Please select an image."
      );

      return;

    }


    try {

      setSaving(true);


      // =============================================
      // STEP 1
      // GET PRESIGNED S3 URL
      // =============================================

      const uploadData =
        await getUploadUrl(
          imageFile
        );


      console.log(
        "Upload data:",
        uploadData
      );


      // =============================================
      // STEP 2
      // UPLOAD IMAGE TO S3
      // =============================================

      await uploadImageToS3(
        uploadData.uploadUrl,
        imageFile
      );


      console.log(
        "Image uploaded to S3"
      );


      // =============================================
      // STEP 3
      // SAVE METADATA THROUGH POST
      // =============================================

      const postResponse =
        await fetch(
          APP_DEVELOPMENT_API,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              key:
                uploadData.key,

              category:
                category,

              name:
                name.trim(),

              description:
                description.trim(),

            }),

          }
        );


      if (!postResponse.ok) {

        const errorText =
          await postResponse.text();

        throw new Error(
          `POST request failed: ${postResponse.status} ${errorText}`
        );

      }


      const savedItem =
        await postResponse.json();


      console.log(
        "Saved item:",
        savedItem
      );


      // =============================================
      // STEP 4
      // RELOAD FROM AWS
      // =============================================

      await loadItems();


      // =============================================
      // RESET PAGINATION
      // =============================================

      const newTotalItems =
        items.length + 1;

      const newPage =
        Math.ceil(
          newTotalItems /
            itemsPerPage
        );

      setCurrentPage(
        newPage
      );


      // =============================================
      // RESET FORM
      // =============================================

      resetForm();


      alert(
        "App Development image uploaded successfully."
      );

    } catch (error) {

      console.error(
        "App Development save error:",
        error
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


      // =============================================
      // DELETE FROM API
      // =============================================

      const response =
        await fetch(
          APP_DEVELOPMENT_API,
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

        const errorText =
          await response.text();

        throw new Error(
          `DELETE request failed: ${response.status} ${errorText}`
        );

      }


      const data =
        await response.json();


      console.log(
        "Delete response:",
        data
      );


      // =============================================
      // RELOAD FROM AWS
      // =============================================

      await loadItems();


      // =============================================
      // PAGE ADJUSTMENT
      // =============================================

      const remainingItems =
        items.filter(
          (item) =>
            String(item.id) !==
            String(id)
        );


      const totalPages =
        Math.max(
          1,
          Math.ceil(
            remainingItems.length /
              itemsPerPage
          )
        );


      if (
        currentPage >
        totalPages
      ) {

        setCurrentPage(
          totalPages
        );

      }


      alert(
        "App Development item deleted successfully."
      );

    } catch (error) {

      console.error(
        "App Development delete error:",
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
  // PAGINATION
  // =====================================================

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


  // =====================================================
  // CHANGE PAGE
  // =====================================================

  const handlePageChange = (
    page
  ) => {

    setCurrentPage(
      page
    );

  };


  // =====================================================
  // JSX
  // =====================================================

  return (

    <div className="appdevlop-admin">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="appdevlop-header">

        <h1>
          App Development
        </h1>


        <button
          type="button"
          className="appdevlop-add-btn"
          onClick={
            handleAddClick
          }
        >
          + Add Image
        </button>

      </div>


      {/* =================================================
          FORM
      ================================================= */}

      {showForm && (

        <div className="appdevlop-form-card">


          {/* =================================================
              IMAGE UPLOAD
          ================================================= */}

          <div className="appdevlop-field">

            <label className="appdevlop-label">
              Image
            </label>


            <label className="appdevlop-upload-box">

              {imagePreview ? (

                <div className="appdevlop-preview-wrapper">

                  <img
                    src={
                      imagePreview
                    }
                    alt="Preview"
                    className="appdevlop-image-preview"
                  />


                  <span className="appdevlop-change-text">
                    Change Image
                  </span>

                </div>

              ) : (

                <div className="appdevlop-upload-placeholder">

                  <span className="appdevlop-upload-icon">
                    +
                  </span>


                  <span>
                    Choose Image
                  </span>

                </div>

              )}


              <input
                ref={
                  fileInputRef
                }
                type="file"
                accept="image/*"
                onChange={
                  handleImageChange
                }
              />

            </label>

          </div>


          {/* =================================================
              CATEGORY
          ================================================= */}

          <div className="appdevlop-field">

            <label className="appdevlop-label">
              Category
            </label>


            <select
              className="appdevlop-select"
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value
                )
              }
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

          <div className="appdevlop-field">

            <label className="appdevlop-label">
              Name
            </label>


            <input
              type="text"
              className="appdevlop-input"
              placeholder="Enter name (optional)"
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

          <div className="appdevlop-field">

            <label className="appdevlop-label">
              Description
            </label>


            <textarea
              className="appdevlop-textarea"
              placeholder="Enter description (optional)"
              value={
                description
              }
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              rows="5"
            />

          </div>


          {/* =================================================
              SAVE / CANCEL
          ================================================= */}

          <div className="appdevlop-form-actions">

            <button
              type="button"
              className="appdevlop-save-btn"
              onClick={
                handleSave
              }
              disabled={saving}
            >

              {saving
                ? "Saving..."
                : "Save"}

            </button>


            <button
              type="button"
              className="appdevlop-cancel-btn"
              onClick={
                handleCancel
              }
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
            padding: "30px",
            textAlign: "center",
          }}
        >
          Loading App Development data...
        </div>

      )}


      {/* =================================================
          TABLE
      ================================================= */}

      {!loading &&
        items.length > 0 && (

          <div className="appdevlop-table-wrapper">

            <table className="appdevlop-table">

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
                  (
                    item,
                    index
                  ) => (

                    <tr
                      key={
                        item.id
                      }
                    >


                      {/* NO */}

                      <td>
                        {
                          startIndex +
                          index +
                          1
                        }
                      </td>


                      {/* PREVIEW */}

                      <td>

                        {getImageUrl(
                          item
                        ) ? (

                          <img
                            src={getImageUrl(
                              item
                            )}
                            alt={
                              item.name ||
                              item.category ||
                              "App Development"
                            }
                            className="appdevlop-table-image"
                          />

                        ) : (

                          <span>
                            No Image
                          </span>

                        )}

                      </td>


                      {/* TYPE */}

                      <td>

                        <span className="appdevlop-type">
                          {
                            item.type ||
                            "Image"
                          }
                        </span>

                      </td>


                      {/* NAME */}

                      <td>

                        <div className="appdevlop-name">
                          {
                            item.name ||
                            "-"
                          }
                        </div>

                      </td>


                      {/* DESCRIPTION */}

                      <td>

                        <div className="appdevlop-description">
                          {
                            item.description ||
                            "-"
                          }
                        </div>

                      </td>


                      {/* CATEGORY */}

                      <td>

                        <span className="appdevlop-category">
                          {
                            item.category ||
                            "-"
                          }
                        </span>

                      </td>


                      {/* CREATED */}

                      <td>

                        {
                          item.created ||
                          "-"
                        }

                      </td>


                      {/* DELETE */}

                      <td>

                        <button
                          type="button"
                          className="appdevlop-delete-btn"
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

              <div className="appdevlop-pagination">


                {/* PREVIOUS */}

                <button
                  type="button"
                  className="appdevlop-page-btn"
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
                  (
                    _,
                    index
                  ) =>
                    index + 1
                ).map(
                  (page) => (

                    <button
                      type="button"
                      key={
                        page
                      }
                      className={`appdevlop-page-btn ${
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
                      {
                        page
                      }
                    </button>

                  )
                )}


                {/* NEXT */}

                <button
                  type="button"
                  className="appdevlop-page-btn"
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


      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {!loading &&
        items.length === 0 && (
          <div
            style={{
              padding: "40px",
              textAlign: "center",
            }}
          >
            No App Development images added yet.
          </div>
        )}

    </div>

  );

};


export default Appdevlop;