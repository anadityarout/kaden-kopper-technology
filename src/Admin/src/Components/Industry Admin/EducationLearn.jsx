import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import "./EducationLearn.css";


// =====================================================
// API
// =====================================================

const API_URL =
  "https://66Ou0fp7m1.execute-api.ap-south-1.amazonaws.com/prod/educationlearning";


const EducationLearn = () => {

  // =====================================================
  // FORM STATE
  // =====================================================

  const [showForm, setShowForm] =
    useState(false);

  const [category, setCategory] =
    useState("Banner");

  const [imagePreview, setImagePreview] =
    useState("");

  const [imageFile, setImageFile] =
    useState(null);

  const [name, setName] =
    useState("");

  const [description, setDescription] =
    useState("");


  // =====================================================
  // ITEMS
  // =====================================================

  const [items, setItems] =
    useState([]);


  // =====================================================
  // LOADING
  // =====================================================

  const [loading, setLoading] =
    useState(false);

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


  // =====================================================
  // FILE INPUT
  // =====================================================

  const fileInputRef =
    useRef(null);


  // =====================================================
  // LOAD DATA FROM AWS
  // =====================================================

  useEffect(() => {
    loadItems();
  }, []);


  const loadItems = async () => {

    try {

      setLoading(true);


      const response =
        await fetch(API_URL, {
          method: "GET",
        });


      const data =
        await response.json();


      console.log(
        "Education Learning GET:",
        data
      );


      if (!response.ok) {

        throw new Error(
          data?.message ||
          "Failed to load Education & Learning data."
        );
      }


      /*
       * Your Lambda GET returns an array directly.
       *
       * Example:
       *
       * [
       *   {
       *     id: "...",
       *     key: "...",
       *     image: "...",
       *     imageUrl: "...",
       *     preview: "...",
       *     name: "...",
       *     description: "...",
       *     category: "Banner"
       *   }
       * ]
       */

      if (Array.isArray(data)) {

        setItems(data);

      } else if (
        Array.isArray(data?.items)
      ) {

        setItems(data.items);

      } else {

        setItems([]);
      }


    } catch (error) {

      console.error(
        "Load Education Learning error:",
        error
      );

      alert(
        error.message ||
        "Failed to load Education & Learning data."
      );

    } finally {

      setLoading(false);
    }
  };


  // =====================================================
  // ADD IMAGE
  // =====================================================

  const handleAddClick = () => {

    setShowForm(true);

    setCategory("Banner");

    setImagePreview("");

    setImageFile(null);

    setName("");

    setDescription("");


    if (fileInputRef.current) {

      fileInputRef.current.value =
        "";
    }
  };


  // =====================================================
  // CATEGORY
  // =====================================================

  const handleCategoryChange = (e) => {

    setCategory(
      e.target.value
    );
  };


  // =====================================================
  // IMAGE SELECT
  // =====================================================

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
      !file.type.startsWith(
        "image/"
      )
    ) {

      alert(
        "Please select an image file."
      );

      return;
    }


    // Optional file-size validation
    // 10 MB maximum

    if (
      file.size >
      10 * 1024 * 1024
    ) {

      alert(
        "Image size must be less than 10 MB."
      );

      return;
    }


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


  // =====================================================
  // SAVE
  // =====================================================

  const handleSave = async () => {

    // =================================================
    // VALIDATE IMAGE
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
      // GET PRESIGNED S3 UPLOAD URL
      // =================================================

      console.log(
        "Requesting S3 upload URL..."
      );


      const uploadUrlRequest =
        `${API_URL}?upload=true` +
        `&fileName=${encodeURIComponent(
          imageFile.name
        )}` +
        `&fileType=${encodeURIComponent(
          imageFile.type
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


      console.log(
        "Upload URL response:",
        uploadData
      );


      if (
        !uploadResponse.ok
      ) {

        throw new Error(
          uploadData?.message ||
          "Failed to generate S3 upload URL."
        );
      }


      if (
        !uploadData?.uploadUrl ||
        !uploadData?.key
      ) {

        throw new Error(
          "S3 upload URL or key was not returned."
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


      if (
        !s3Response.ok
      ) {

        throw new Error(
          `S3 upload failed. Status: ${s3Response.status}`
        );
      }


      console.log(
        "Image uploaded to S3."
      );


      // =================================================
      // STEP 3
      // SAVE METADATA THROUGH LAMBDA
      // =================================================

      const metadata = {

        key:
          uploadData.key,

        name:
          name.trim() || "-",

        description:
          description.trim() || "-",

        category:
          category,

      };


      console.log(
        "Saving metadata:",
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


      const saveData =
        await saveResponse.json();


      console.log(
        "Metadata save response:",
        saveData
      );


      if (
        !saveResponse.ok
      ) {

        throw new Error(
          saveData?.message ||
          "Failed to save image information."
        );
      }


      // =================================================
      // STEP 4
      // ADD SAVED ITEM TO TABLE
      // =================================================

      /*
       * Lambda POST returns:
       *
       * {
       *   id,
       *   type,
       *   key,
       *   name,
       *   description,
       *   category,
       *   created
       * }
       *
       * It does not return the signed image URL.
       *
       * So after saving, we reload GET data.
       */

      const updatedResponse =
        await fetch(API_URL);


      const updatedData =
        await updatedResponse.json();


      if (
        updatedResponse.ok &&
        Array.isArray(updatedData)
      ) {

        setItems(
          updatedData
        );


        // Move to last page

        const newTotalPages =
          Math.max(
            1,
            Math.ceil(
              updatedData.length /
              itemsPerPage
            )
          );


        setCurrentPage(
          newTotalPages
        );

      } else {

        /*
         * Fallback if GET fails.
         */

        setItems(
          (prev) => [
            ...prev,
            {
              ...saveData,

              preview:
                imagePreview,
            },
          ]
        );
      }


      // =================================================
      // RESET FORM
      // =================================================

      resetForm();


      alert(
        "Education & Learning image uploaded successfully."
      );


    } catch (error) {

      console.error(
        "Education Learning save error:",
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

      fileInputRef.current.value =
        "";
    }
  };


  // =====================================================
  // CANCEL
  // =====================================================

  const handleCancel = () => {

    if (saving) {
      return;
    }

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

            headers: {
              "Content-Type":
                "application/json",
            },
          }
        );


      const data =
        await response.json();


      console.log(
        "Delete response:",
        data
      );


      if (
        !response.ok
      ) {

        throw new Error(
          data?.message ||
          "Failed to delete item."
        );
      }


      // =================================================
      // REMOVE FROM UI
      // =================================================

      const updatedItems =
        items.filter(
          (item) =>
            String(item.id) !==
            String(id)
        );


      setItems(
        updatedItems
      );


      // =================================================
      // UPDATE PAGINATION
      // =================================================

      const newTotalPages =
        Math.max(
          1,
          Math.ceil(
            updatedItems.length /
            itemsPerPage
          )
        );


      if (
        currentPage >
        newTotalPages
      ) {

        setCurrentPage(
          newTotalPages
        );
      }


      alert(
        "Education & Learning item deleted successfully."
      );


    } catch (error) {

      console.error(
        "Delete Education Learning error:",
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
  // PAGE CHANGE
  // =====================================================

  const handlePageChange = (page) => {

    setCurrentPage(page);


    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  // =====================================================
  // PREVIOUS
  // =====================================================

  const handlePrevious = () => {

    if (
      currentPage > 1
    ) {

      handlePageChange(
        currentPage - 1
      );
    }
  };


  // =====================================================
  // NEXT
  // =====================================================

  const handleNext = () => {

    if (
      currentPage <
      totalPages
    ) {

      handlePageChange(
        currentPage + 1
      );
    }
  };


  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="educationlearn-admin">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="educationlearn-header">

        <h1>
          Education & Learning
        </h1>


        <button
          type="button"
          className="educationlearn-add-btn"
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

        <div className="educationlearn-form-card">

          {/* =================================================
              CATEGORY
          ================================================= */}

          <div className="educationlearn-field">

            <label>
              Category
            </label>


            <select
              value={category}
              onChange={
                handleCategoryChange
              }
              disabled={saving}
            >

              <option value="Banner">
                Banner
              </option>


              <option value="Why Choose Us">
                Why Choose Us
              </option>


              <option value="Learning Experiences">
                Learning Experiences
              </option>


              <option value="Our Gallery">
                Our Gallery
              </option>

            </select>

          </div>


          {/* =================================================
              IMAGE UPLOAD
          ================================================= */}

          <div className="educationlearn-field">

            <label className="educationlearn-upload-box">

              {imagePreview ? (

                <div className="educationlearn-preview-wrapper">

                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="educationlearn-image-preview"
                  />


                  <span className="educationlearn-change-text">
                    Change Image
                  </span>

                </div>

              ) : (

                <div className="educationlearn-upload-placeholder">

                  <span className="educationlearn-upload-icon">
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


          {/* =================================================
              NAME
          ================================================= */}

          <div className="educationlearn-field">

            <input
              type="text"
              placeholder="Image Name"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              disabled={saving}
            />

          </div>


          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <div className="educationlearn-field">

            <textarea
              rows="5"
              placeholder="Image Description"
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              disabled={saving}
            />

          </div>


          {/* =================================================
              SAVE / CANCEL
          ================================================= */}

          <div className="educationlearn-form-actions">

            <button
              type="button"
              className="educationlearn-save-btn"
              onClick={handleSave}
              disabled={saving}
            >

              {saving
                ? "Uploading..."
                : "Save"}

            </button>


            <button
              type="button"
              className="educationlearn-cancel-btn"
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
          Loading Education & Learning data...
        </div>

      )}


      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {!loading &&
        items.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "50px 20px",
              color: "#666",
            }}
          >
            No Education & Learning images found.
          </div>
        )}


      {/* =================================================
          TABLE
      ================================================= */}

      {!loading &&
        items.length > 0 && (

        <div className="educationlearn-table-wrapper">

          <table className="educationlearn-table">

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


                  {/* IMAGE */}

                  <td>

                    <img
                      src={
                        item.preview ||
                        item.imageUrl ||
                        item.image ||
                        item.fileUrl
                      }
                      alt={
                        item.name ||
                        "Education Learning"
                      }
                      className="educationlearn-table-image"
                    />

                  </td>


                  {/* TYPE */}

                  <td>
                    {item.type ||
                      "Image"}
                  </td>


                  {/* NAME */}

                  <td>

                    <div className="educationlearn-name">

                      {item.name ||
                        "-"}

                    </div>

                  </td>


                  {/* DESCRIPTION */}

                  <td>

                    <div className="educationlearn-description">

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


                  {/* DELETE */}

                  <td>

                    <button
                      type="button"
                      className="educationlearn-delete-btn"
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

              ))}

            </tbody>

          </table>


          {/* =================================================
              PAGINATION
          ================================================= */}

          {totalPages > 1 && (

            <div className="educationlearn-pagination">

              <button
                type="button"
                className="educationlearn-page-btn"
                disabled={
                  currentPage === 1
                }
                onClick={
                  handlePrevious
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
                  className={`educationlearn-page-btn ${
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

              ))}


              <button
                type="button"
                className="educationlearn-page-btn"
                disabled={
                  currentPage ===
                  totalPages
                }
                onClick={
                  handleNext
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


export default EducationLearn;