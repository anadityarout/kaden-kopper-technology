import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import "./Graphicdesign.css";

// =====================================================
// AWS API
// =====================================================

const GRAPHIC_DESIGN_API =
  "https://66ou0fp7m1.execute-api.ap-south-1.amazonaws.com/prod/graphicdesign";

// =====================================================
// IMAGE URL HELPER
// =====================================================

const getImageUrl = (item) => {
  return (
    item?.preview ||
    item?.image ||
    item?.imageUrl ||
    item?.fileUrl ||
    ""
  );
};

// =====================================================
// COMPONENT
// =====================================================

const Graphicdesign = () => {

  // =====================================================
  // FORM
  // =====================================================

  const [showForm, setShowForm] =
    useState(false);

  const [imagePreview, setImagePreview] =
    useState("");

  const [imageFile, setImageFile] =
    useState(null);

  const [name, setName] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [category, setCategory] =
    useState("Banner");

  // =====================================================
  // DATA
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
  // LOAD DATA FROM AWS
  // =====================================================

  const loadItems = async () => {

    try {

      setLoading(true);

      const response =
        await fetch(
          GRAPHIC_DESIGN_API
        );

      if (!response.ok) {
        throw new Error(
          `Failed to load data: ${response.status}`
        );
      }

      const data =
        await response.json();

      if (!Array.isArray(data)) {

        setItems([]);

        return;
      }

      setItems(data);

      // -----------------------------------------------
      // KEEP CURRENT PAGE VALID
      // -----------------------------------------------

      const totalPages =
        Math.max(
          1,
          Math.ceil(
            data.length /
              itemsPerPage
          )
        );

      setCurrentPage(
        (page) =>
          Math.min(
            page,
            totalPages
          )
      );

    } catch (error) {

      console.error(
        "Graphic Design GET error:",
        error
      );

      alert(
        "Failed to load Graphic Design data."
      );

      setItems([]);

    } finally {

      setLoading(false);
    }
  };

  // =====================================================
  // LOAD WHEN PAGE OPENS
  // =====================================================

  useEffect(() => {

    loadItems();

  }, []);

  // =====================================================
  // ADD IMAGE
  // =====================================================

  const handleAddImage = () => {

    setShowForm(true);

    setImagePreview("");

    setImageFile(null);

    setName("");

    setDescription("");

    setCategory("Banner");

    if (fileInputRef.current) {

      fileInputRef.current.value =
        "";
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

    setImageFile(file);

    // -----------------------------------------------
    // LOCAL PREVIEW ONLY
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

      // =================================================
      // STEP 1
      // GET PRESIGNED S3 UPLOAD URL
      // =================================================

      const uploadUrlResponse =
        await fetch(
          `${GRAPHIC_DESIGN_API}?upload=true&fileName=${encodeURIComponent(
            imageFile.name
          )}&fileType=${encodeURIComponent(
            imageFile.type
          )}`
        );

      if (
        !uploadUrlResponse.ok
      ) {

        throw new Error(
          `Failed to get upload URL: ${uploadUrlResponse.status}`
        );
      }

      const uploadData =
        await uploadUrlResponse.json();

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
      // SAVE METADATA THROUGH LAMBDA
      // =================================================

      const saveResponse =
        await fetch(
          GRAPHIC_DESIGN_API,
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

        let errorMessage =
          "Failed to save Graphic Design data.";

        try {

          const errorData =
            await saveResponse.json();

          if (
            errorData?.message
          ) {

            errorMessage =
              errorData.message;
          }

        } catch (error) {
          // Ignore JSON parsing error
        }

        throw new Error(
          errorMessage
        );
      }

      // =================================================
      // STEP 4
      // RELOAD DATA
      // =================================================

      await loadItems();

      // =================================================
      // STEP 5
      // OPEN LAST PAGE
      // =================================================

      // loadItems() already refreshes
      // the complete data.

      setCurrentPage(
        Math.max(
          1,
          Math.ceil(
            (items.length + 1) /
              itemsPerPage
          )
        )
      );

      // =================================================
      // RESET FORM
      // =================================================

      resetForm();

      alert(
        "Graphic Design image uploaded successfully."
      );

    } catch (error) {

      console.error(
        "Graphic Design save error:",
        error
      );

      alert(
        error.message ||
          "Failed to save Graphic Design image."
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

    setImagePreview("");

    setImageFile(null);

    setName("");

    setDescription("");

    setCategory("Banner");

    if (fileInputRef.current) {

      fileInputRef.current.value =
        "";
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
      // DELETE FROM API
      // =================================================

      const response =
        await fetch(
          GRAPHIC_DESIGN_API,
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

      if (!response.ok) {

        let errorMessage =
          "Failed to delete item.";

        try {

          const errorData =
            await response.json();

          if (
            errorData?.message
          ) {

            errorMessage =
              errorData.message;
          }

        } catch (error) {
          // Ignore parsing error
        }

        throw new Error(
          errorMessage
        );
      }

      // =================================================
      // RELOAD DATA
      // =================================================

      await loadItems();

      alert(
        "Graphic Design item deleted successfully."
      );

    } catch (error) {

      console.error(
        "Graphic Design delete error:",
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

  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div className="graphicdesign-admin">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="graphicdesign-header">

        <h1>
          Graphic Design
        </h1>

        <button
          type="button"
          className="graphicdesign-add-btn"
          onClick={
            handleAddImage
          }
        >
          + Add Image
        </button>

      </div>


      {/* =================================================
          ADD FORM
      ================================================= */}

      {showForm && (

        <div className="graphicdesign-form-card">

          {/* =================================================
              IMAGE UPLOAD
          ================================================= */}

          <div className="graphicdesign-field">

            <label className="graphicdesign-label">
              Upload Image
            </label>

            <label className="graphicdesign-upload-box">

              {imagePreview ? (

                <div className="graphicdesign-preview-wrapper">

                  <img
                    src={
                      imagePreview
                    }
                    alt="Preview"
                    className="graphicdesign-image-preview"
                  />

                  <span className="graphicdesign-change-text">
                    Change Image
                  </span>

                </div>

              ) : (

                <div className="graphicdesign-upload-placeholder">

                  <span className="graphicdesign-upload-icon">
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

          <div className="graphicdesign-field">

            <label
              htmlFor="graphicdesign-category"
              className="graphicdesign-label"
            >
              Category
            </label>

            <select
              id="graphicdesign-category"
              className="graphicdesign-select"
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

              <option value="Creative Design">
                Creative Design
              </option>

              <option value="Why Choose">
                Why Choose
              </option>

            </select>

          </div>


          {/* =================================================
              NAME
          ================================================= */}

          <div className="graphicdesign-field">

            <label className="graphicdesign-label">
              Name
            </label>

            <input
              type="text"
              className="graphicdesign-input"
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

          <div className="graphicdesign-field">

            <label className="graphicdesign-label">
              Description
            </label>

            <textarea
              className="graphicdesign-textarea"
              placeholder="Enter description"
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
              BUTTONS
          ================================================= */}

          <div className="graphicdesign-form-actions">

            <button
              type="button"
              className="graphicdesign-save-btn"
              onClick={
                handleSave
              }
              disabled={saving}
            >

              {saving
                ? "Uploading..."
                : "Save"}

            </button>

            <button
              type="button"
              className="graphicdesign-cancel-btn"
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
            textAlign:
              "center",
            padding:
              "30px",
          }}
        >
          Loading Graphic Design...
        </div>

      )}


      {/* =================================================
          TABLE
      ================================================= */}

      {!loading &&
        items.length > 0 && (

        <div className="graphicdesign-table-wrapper">

          <table className="graphicdesign-table">

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
                ) => {

                  const image =
                    getImageUrl(
                      item
                    );

                  return (

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

                        {image ? (

                          <img
                            src={
                              image
                            }
                            alt={
                              item.name ||
                              "Graphic Design"
                            }
                            className="graphicdesign-table-image"
                          />

                        ) : (

                          <span>
                            No Image
                          </span>

                        )}

                      </td>


                      {/* TYPE */}

                      <td>

                        <span className="graphicdesign-type">
                          {
                            item.type ||
                            "Image"
                          }
                        </span>

                      </td>


                      {/* NAME */}

                      <td>

                        <div className="graphicdesign-name">
                          {
                            item.name ||
                            "-"
                          }
                        </div>

                      </td>


                      {/* DESCRIPTION */}

                      <td>

                        <div className="graphicdesign-description">
                          {
                            item.description ||
                            "-"
                          }
                        </div>

                      </td>


                      {/* CATEGORY */}

                      <td>

                        <span className="graphicdesign-category">
                          {
                            item.category
                          }
                        </span>

                      </td>


                      {/* CREATED */}

                      <td>
                        {
                          item.created
                        }
                      </td>


                      {/* ACTION */}

                      <td>

                        <button
                          type="button"
                          className="graphicdesign-delete-btn"
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


          {/* =================================================
              PAGINATION
          ================================================= */}

          {totalPages > 1 && (

            <div className="graphicdesign-pagination">

              <button
                type="button"
                className="graphicdesign-page-btn previous"
                disabled={
                  currentPage ===
                  1
                }
                onClick={() =>
                  goToPage(
                    currentPage -
                      1
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
                (
                  _,
                  index
                ) =>
                  index + 1
              ).map(
                (page) => (

                  <button
                    type="button"
                    key={page}
                    className={`graphicdesign-page-btn ${
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

                )
              )}


              <button
                type="button"
                className="graphicdesign-page-btn next"
                disabled={
                  currentPage ===
                  totalPages
                }
                onClick={() =>
                  goToPage(
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
          NO DATA
      ================================================= */}

      {!loading &&
        items.length === 0 &&
        !showForm && (

        <div
          style={{
            textAlign:
              "center",
            padding:
              "40px",
            color:
              "#777",
          }}
        >
          No Graphic Design
          items found.
        </div>

      )}

    </div>
  );
};

export default Graphicdesign;