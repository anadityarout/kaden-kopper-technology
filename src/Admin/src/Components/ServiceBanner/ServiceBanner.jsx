import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import "./ServiceBanner.css";

/* =====================================================
   API
===================================================== */

const API_URL =
  "https://66ou0fp7m1.execute-api.ap-south-1.amazonaws.com/prod/servicebanner";


const ServiceBanner = () => {

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
  // INPUT STATE
  // =====================================================

  const [imageName, setImageName] = useState("");

  const [description, setDescription] = useState("");

  const [category, setCategory] =
    useState("App Development");

  // =====================================================
  // TABLE DATA
  // =====================================================

  const [items, setItems] = useState([]);

  // =====================================================
  // LOADING STATE
  // =====================================================

  const [loading, setLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  // =====================================================
  // FILE INPUT REF
  // =====================================================

  const fileInputRef = useRef(null);

  // =====================================================
  // CATEGORY OPTIONS
  // =====================================================

  const categories = [
    "App Development",
    "Web Development",
    "SEO",
    "Video",
    "Graphic",
    "Marketing",
  ];


  // =====================================================
  // LOAD SERVICE BANNERS FROM AWS
  // =====================================================

  const loadItems = async () => {

    try {

      setLoading(true);

      const response = await fetch(
        API_URL,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to load service banners: ${response.status}`
        );
      }

      const data = await response.json();

      console.log(
        "Service Banner API Response:",
        data
      );

      setItems(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.error(
        "Load Service Banner Error:",
        error
      );

      alert(
        "Failed to load service banners."
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

    setImageName("");

    setDescription("");

    setCategory(
      "App Development"
    );

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

    if (!file) return;


    // Only image
    if (
      !file.type.startsWith("image/")
    ) {

      alert(
        "Please select an image."
      );

      e.target.value = "";

      return;

    }


    // Optional size validation
    const maxSize =
      10 * 1024 * 1024;

    if (file.size > maxSize) {

      alert(
        "Image size must be less than 10 MB."
      );

      e.target.value = "";

      return;

    }


    setImageFile(file);


    // Create local preview only
    const previewUrl =
      URL.createObjectURL(file);

    setImagePreview(
      previewUrl
    );

  };


  // =====================================================
  // SAVE
  // =====================================================

  const handleSave = async () => {

    // -----------------------------------------------
    // IMAGE VALIDATION
    // -----------------------------------------------

    if (!imageFile) {

      alert(
        "Please select an image."
      );

      return;

    }


    // -----------------------------------------------
    // NAME VALIDATION
    // -----------------------------------------------

    if (!imageName.trim()) {

      alert(
        "Please enter image name."
      );

      return;

    }


    // -----------------------------------------------
    // DESCRIPTION VALIDATION
    // -----------------------------------------------

    if (!description.trim()) {

      alert(
        "Please enter description."
      );

      return;

    }


    // -----------------------------------------------
    // CATEGORY VALIDATION
    // -----------------------------------------------

    if (!category) {

      alert(
        "Please select a category."
      );

      return;

    }


    try {

      setSaving(true);


      // =================================================
      // STEP 1
      // GET PRESIGNED S3 URL
      // =================================================

      const uploadUrlResponse =
        await fetch(
          `${API_URL}?upload=true&fileName=${encodeURIComponent(
            imageFile.name
          )}&fileType=${encodeURIComponent(
            imageFile.type
          )}`,
          {
            method: "GET",
          }
        );


      if (!uploadUrlResponse.ok) {

        const errorText =
          await uploadUrlResponse.text();

        throw new Error(
          `Could not create upload URL: ${errorText}`
        );

      }


      const uploadData =
        await uploadUrlResponse.json();


      console.log(
        "Upload URL Response:",
        uploadData
      );


      if (
        !uploadData.uploadUrl ||
        !uploadData.key
      ) {

        throw new Error(
          "Upload URL or S3 key is missing."
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


      console.log(
        "Image uploaded to S3 successfully."
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

              name:
                imageName.trim(),

              description:
                description.trim(),

              category:
                category,

              key:
                uploadData.key,

              image:
                uploadData.fileUrl,

            }),
          }
        );


      if (!saveResponse.ok) {

        const errorText =
          await saveResponse.text();

        throw new Error(
          `Failed to save metadata: ${errorText}`
        );

      }


      const saveData =
        await saveResponse.json();


      console.log(
        "Save Response:",
        saveData
      );


      // =================================================
      // SUCCESS
      // =================================================

      alert(
        "Service banner uploaded successfully."
      );


      // Reload from AWS

      await loadItems();


      // Reset form

      resetForm();


    } catch (error) {

      console.error(
        "Save Service Banner Error:",
        error
      );

      alert(
        error.message ||
        "Failed to upload service banner."
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
        "Are you sure you want to delete this service?"
      );


    if (!confirmDelete) return;


    try {

      setLoading(true);


      // =================================================
      // DELETE THROUGH LAMBDA
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

        const errorText =
          await response.text();

        throw new Error(
          `Delete failed: ${errorText}`
        );

      }


      const data =
        await response.json();


      console.log(
        "Delete Response:",
        data
      );


      alert(
        "Service banner deleted successfully."
      );


      // Reload data

      await loadItems();


    } catch (error) {

      console.error(
        "Delete Service Banner Error:",
        error
      );

      alert(
        error.message ||
        "Failed to delete service banner."
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {

    setShowForm(false);

    setImagePreview("");

    setImageFile(null);

    setImageName("");

    setDescription("");

    setCategory(
      "App Development"
    );


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
  // RETURN
  // =====================================================

  return (

    <div className="servicebanner-admin">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="servicebanner-header">

        <h1>
          Service Banner
        </h1>


        <button
          type="button"
          className="servicebanner-add-btn"
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

        <div className="servicebanner-form-card">

          {/* =================================================
              IMAGE UPLOAD
          ================================================= */}

          <div className="servicebanner-field">

            <label className="servicebanner-label">
              Image
            </label>


            <label className="servicebanner-upload-box">

              {imagePreview ? (

                <div className="servicebanner-preview-wrapper">

                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="servicebanner-image-preview"
                  />


                  <span className="servicebanner-change-text">
                    Change Image
                  </span>

                </div>

              ) : (

                <div className="servicebanner-upload-placeholder">

                  <span className="servicebanner-upload-icon">
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
              IMAGE NAME
          ================================================= */}

          <div className="servicebanner-field">

            <label className="servicebanner-label">
              Image Name
            </label>


            <input
              type="text"
              className="servicebanner-input"
              placeholder="Enter image name"
              value={imageName}
              onChange={(e) =>
                setImageName(
                  e.target.value
                )
              }
              disabled={saving}
            />

          </div>


          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <div className="servicebanner-field">

            <label className="servicebanner-label">
              Description
            </label>


            <textarea
              className="servicebanner-textarea"
              placeholder="Enter description"
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              rows="5"
              disabled={saving}
            />

          </div>


          {/* =================================================
              CATEGORY
          ================================================= */}

          <div className="servicebanner-field">

            <label className="servicebanner-label">
              Category
            </label>


            <select
              className="servicebanner-select"
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value
                )
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
              SAVE / CANCEL
          ================================================= */}

          <div className="servicebanner-form-actions">

            <button
              type="button"
              className="servicebanner-save-btn"
              onClick={handleSave}
              disabled={saving}
            >

              {saving
                ? "Uploading..."
                : "Save"}

            </button>


            <button
              type="button"
              className="servicebanner-cancel-btn"
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

      {loading && items.length === 0 && (

        <div
          style={{
            padding: "30px",
            textAlign: "center",
          }}
        >
          Loading service banners...
        </div>

      )}


      {/* =================================================
          TABLE
      ================================================= */}

      {items.length > 0 && (

        <div className="servicebanner-table-wrapper">

          <table className="servicebanner-table">

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

              {items.map(
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

                      {(
                        item.preview ||
                        item.imageUrl ||
                        item.image ||
                        item.fileUrl
                      ) ? (

                        <img
                          src={
                            item.preview ||
                            item.imageUrl ||
                            item.image ||
                            item.fileUrl
                          }
                          alt={
                            item.name ||
                            "Service Banner"
                          }
                          className="servicebanner-table-image"
                        />

                      ) : (

                        <div>
                          No Image
                        </div>

                      )}

                    </td>


                    {/* TYPE */}

                    <td>

                      <span className="servicebanner-type">

                        {item.type ||
                          "Image"}

                      </span>

                    </td>


                    {/* NAME */}

                    <td>

                      <div className="servicebanner-name">

                        {item.name ||
                          "-"}

                      </div>

                    </td>


                    {/* DESCRIPTION */}

                    <td>

                      <div className="servicebanner-description">

                        {item.description ||
                          "-"}

                      </div>

                    </td>


                    {/* CATEGORY */}

                    <td>

                      <span className="servicebanner-category">

                        {item.category ||
                          "-"}

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
                        className="servicebanner-delete-btn"
                        onClick={() =>
                          handleDelete(
                            item.id
                          )
                        }
                        disabled={
                          loading ||
                          saving
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


      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {!loading &&
        items.length === 0 &&
        !showForm && (

          <div
            style={{
              padding: "40px",
              textAlign: "center",
              color: "#777",
            }}
          >
            No service banners added yet.
          </div>

        )}

    </div>

  );

};


export default ServiceBanner;