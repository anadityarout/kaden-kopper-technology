import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import "./WhyChoose.css";

/* =====================================================
   API
===================================================== */

const API_URL =
  "https://66ou0fp7m1.execute-api.ap-south-1.amazonaws.com/prod/whychoose";


const WhyChoose = () => {

  /* ===================================================
     FORM
  =================================================== */

  const [showForm, setShowForm] =
    useState(false);

  const [imagePreview, setImagePreview] =
    useState("");

  const [imageFile, setImageFile] =
    useState(null);

  const [imageName, setImageName] =
    useState("");

  const [description, setDescription] =
    useState("");


  /* ===================================================
     DATA
  =================================================== */

  const [items, setItems] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [loadingItems, setLoadingItems] =
    useState(true);

  const fileInputRef =
    useRef(null);


  /* ===================================================
     LOAD DATA
  =================================================== */

  const loadItems = async () => {

    try {

      setLoadingItems(true);

      console.log(
        "Loading Why Choose data..."
      );


      const response =
        await fetch(API_URL);


      if (!response.ok) {

        const errorText =
          await response.text();

        console.error(
          "GET Why Choose error:",
          errorText
        );

        throw new Error(
          "Failed to load Why Choose images."
        );
      }


      const data =
        await response.json();


      console.log(
        "Why Choose API response:",
        data
      );


      setItems(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.error(
        "Load Why Choose error:",
        error
      );

      alert(
        "Unable to load Why Choose images."
      );

      setItems([]);

    } finally {

      setLoadingItems(false);

    }
  };


  /* ===================================================
     LOAD WHEN PAGE OPENS
  =================================================== */

  useEffect(() => {

    loadItems();

  }, []);


  /* ===================================================
     ADD IMAGE BUTTON
  =================================================== */

  const handleAddClick = () => {

    setShowForm(true);

    setImagePreview("");

    setImageFile(null);

    setImageName("");

    setDescription("");


    if (fileInputRef.current) {

      fileInputRef.current.value = "";

    }
  };


  /* ===================================================
     IMAGE UPLOAD / PREVIEW
  =================================================== */

  const handleImageChange = (e) => {

    const file =
      e.target.files[0];


    if (!file) return;


    /* ================================================
       VALIDATE IMAGE
    ================================================= */

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {

      alert(
        "Please select a valid image file."
      );

      e.target.value = "";

      return;
    }


    /* ================================================
       SAVE FILE
    ================================================= */

    setImageFile(file);


    /* ================================================
       CREATE LOCAL PREVIEW
    ================================================= */

    const previewUrl =
      URL.createObjectURL(file);


    setImagePreview(
      previewUrl
    );

  };


  /* ===================================================
     SAVE
  =================================================== */

  const handleSave = async () => {

    /* =================================================
       VALIDATE IMAGE ONLY
       
       IMAGE = REQUIRED
       NAME = OPTIONAL
       DESCRIPTION = OPTIONAL
    ================================================= */

    if (!imageFile) {

      alert(
        "Please select an image."
      );

      return;
    }


    try {

      setLoading(true);


      /* =================================================
         STEP 1
         GET PRESIGNED S3 URL
      ================================================= */

      console.log(
        "===================================="
      );

      console.log(
        "STEP 1: Requesting presigned URL"
      );

      console.log(
        "File Name:",
        imageFile.name
      );

      console.log(
        "File Type:",
        imageFile.type
      );

      console.log(
        "File Size:",
        imageFile.size
      );

      console.log(
        "===================================="
      );


      const uploadUrlResponse =
        await fetch(
          `${API_URL}?upload=true&fileName=${encodeURIComponent(
            imageFile.name
          )}&fileType=${encodeURIComponent(
            imageFile.type
          )}`
        );


      /* =================================================
         CHECK PRESIGNED URL RESPONSE
      ================================================= */

      if (!uploadUrlResponse.ok) {

        const errorText =
          await uploadUrlResponse.text();

        console.error(
          "Presigned URL error:",
          errorText
        );

        throw new Error(
          "Failed to generate S3 upload URL."
        );
      }


      const uploadData =
        await uploadUrlResponse.json();


      console.log(
        "Presigned URL response:",
        uploadData
      );


      if (
        !uploadData.success
      ) {

        throw new Error(
          uploadData.message ||
          "Failed to generate upload URL."
        );
      }


      const uploadUrl =
        uploadData.uploadUrl;

      const imageKey =
        uploadData.key;


      /* =================================================
         LOG PRESIGNED URL
      ================================================= */

      console.log(
        "===================================="
      );

      console.log(
        "PRESIGNED URL CREATED"
      );

      console.log(
        "Image Key:",
        imageKey
      );

      console.log(
        "File Type:",
        imageFile.type
      );

      console.log(
        "File Size:",
        imageFile.size
      );

      console.log(
        "Upload URL:",
        uploadUrl
      );

      console.log(
        "===================================="
      );


      /* =================================================
         STEP 2
         UPLOAD DIRECTLY TO S3
      ================================================= */

      console.log(
        "STEP 2: Uploading image to S3..."
      );


      const uploadResponse =
        await fetch(
          uploadUrl,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                imageFile.type,
            },

            body:
              imageFile,
          }
        );


      /* =================================================
         CHECK S3 RESPONSE
      ================================================= */

      if (
        !uploadResponse.ok
      ) {

        const errorText =
          await uploadResponse.text();


        console.error(
          "===================================="
        );

        console.error(
          "S3 UPLOAD ERROR"
        );

        console.error(
          "Status:",
          uploadResponse.status
        );

        console.error(
          "Status Text:",
          uploadResponse.statusText
        );

        console.error(
          "Response:",
          errorText
        );

        console.error(
          "Upload URL:",
          uploadUrl
        );

        console.error(
          "File Name:",
          imageFile.name
        );

        console.error(
          "File Type:",
          imageFile.type
        );

        console.error(
          "File Size:",
          imageFile.size
        );

        console.error(
          "===================================="
        );


        throw new Error(
          `S3 upload failed (${uploadResponse.status}): ${errorText}`
        );
      }


      console.log(
        "S3 upload successful!"
      );


      /* =================================================
         STEP 3
         SAVE METADATA
         
         NAME AND DESCRIPTION ARE OPTIONAL.
         
         If empty:
         
         name: ""
         description: ""
      ================================================= */

      console.log(
        "STEP 3: Saving image information..."
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

            body: JSON.stringify({

              type:
                "Image",

              key:
                imageKey,

              fileUrl:
                uploadData.fileUrl,

              image:
                uploadData.fileUrl,

              name:
                imageName.trim(),

              description:
                description.trim(),

            }),
          }
        );


      /* =================================================
         CHECK SAVE RESPONSE
      ================================================= */

      if (
        !saveResponse.ok
      ) {

        const errorText =
          await saveResponse.text();


        console.error(
          "Save API error:",
          errorText
        );


        throw new Error(
          "Failed to save image information."
        );
      }


      const saveData =
        await saveResponse.json();


      console.log(
        "Save response:",
        saveData
      );


      if (
        !saveData.success
      ) {

        throw new Error(
          saveData.message ||
          "Failed to save image."
        );
      }


      /* =================================================
         SUCCESS
      ================================================= */

      alert(
        "Why Choose image uploaded successfully!"
      );


      /* =================================================
         RESET FORM
      ================================================= */

      resetForm();


      /* =================================================
         RELOAD DATA
      ================================================= */

      await loadItems();


    } catch (error) {

      console.error(
        "===================================="
      );

      console.error(
        "Save Why Choose error:",
        error
      );

      console.error(
        "===================================="
      );


      alert(
        error.message ||
        "Something went wrong while uploading."
      );


    } finally {

      setLoading(false);

    }
  };


  /* ===================================================
     DELETE
  =================================================== */

  const handleDelete = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this item?"
      );


    if (!confirmDelete) {
      return;
    }


    try {

      setLoading(true);


      console.log(
        "Deleting Why Choose item:",
        id
      );


      /* =================================================
         DELETE API
      ================================================= */

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


      const data =
        await response.json();


      console.log(
        "Delete response:",
        data
      );


      if (
        !response.ok ||
        !data.success
      ) {

        throw new Error(
          data.message ||
          "Failed to delete image."
        );
      }


      alert(
        "Why Choose image deleted successfully!"
      );


      /* =================================================
         RELOAD DATA
      ================================================= */

      await loadItems();


    } catch (error) {

      console.error(
        "Delete Why Choose error:",
        error
      );


      alert(
        error.message ||
        "Unable to delete image."
      );


    } finally {

      setLoading(false);

    }
  };


  /* ===================================================
     RESET FORM
  =================================================== */

  const resetForm = () => {

    setShowForm(false);

    setImagePreview("");

    setImageFile(null);

    setImageName("");

    setDescription("");


    if (
      fileInputRef.current
    ) {

      fileInputRef.current.value =
        "";

    }
  };


  /* ===================================================
     CANCEL
  =================================================== */

  const handleCancel = () => {

    resetForm();

  };


  /* ===================================================
     RETURN
  =================================================== */

  return (

    <div className="whychoose-admin">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="whychoose-header">

        <h1>
          Why Choose
        </h1>


        <button
          type="button"
          className="whychoose-add-btn"
          onClick={handleAddClick}
          disabled={loading}
        >
          + Add Image
        </button>

      </div>


      {/* =================================================
          ADD IMAGE FORM
      ================================================= */}

      {showForm && (

        <div className="whychoose-form-card">


          {/* =================================================
              IMAGE UPLOADER
          ================================================= */}

          <div className="whychoose-field">

            <label className="whychoose-label">
              Image <span>*</span>
            </label>


            <label className="whychoose-upload-box">


              {imagePreview ? (

                <div className="whychoose-preview-wrapper">

                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="whychoose-image-preview"
                  />


                  <span className="whychoose-change-text">
                    Change Image
                  </span>

                </div>

              ) : (

                <div className="whychoose-upload-placeholder">

                  <span className="whychoose-upload-icon">
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
                disabled={loading}
              />

            </label>

          </div>


          {/* =================================================
              IMAGE NAME
          ================================================= */}

          <div className="whychoose-field">

            <label className="whychoose-label">
              Image Name
              <span className="optional-text">
                {" "}
                (Optional)
              </span>
            </label>


            <input
              type="text"
              className="whychoose-input"
              placeholder="Enter image name"
              value={imageName}
              onChange={(e) =>
                setImageName(
                  e.target.value
                )
              }
              disabled={loading}
            />

          </div>


          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <div className="whychoose-field">

            <label className="whychoose-label">
              Image Description
              <span className="optional-text">
                {" "}
                (Optional)
              </span>
            </label>


            <textarea
              className="whychoose-textarea"
              placeholder="Enter image description"
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              rows="5"
              disabled={loading}
            />

          </div>


          {/* =================================================
              FORM BUTTONS
          ================================================= */}

          <div className="whychoose-form-actions">

            <button
              type="button"
              className="whychoose-save-btn"
              onClick={handleSave}
              disabled={loading}
            >

              {loading
                ? "Uploading..."
                : "Save"}

            </button>


            <button
              type="button"
              className="whychoose-cancel-btn"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>

          </div>

        </div>

      )}


      {/* =================================================
          LOADING
      ================================================= */}

      {loadingItems && (

        <div className="whychoose-loading">

          Loading Why Choose images...

        </div>

      )}


      {/* =================================================
          EMPTY
      ================================================= */}

      {!loadingItems &&
        items.length === 0 && (

          <div className="whychoose-empty">

            <p>
              No Why Choose images added yet.
            </p>

          </div>

      )}


      {/* =================================================
          DATA TABLE
      ================================================= */}

      {!loadingItems &&
        items.length > 0 && (

          <div className="whychoose-table-wrapper">

            <table className="whychoose-table">


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

                        {item.preview ||
                        item.imageUrl ||
                        item.image ? (

                          <img
                            src={
                              item.preview ||
                              item.imageUrl ||
                              item.image
                            }
                            alt={
                              item.name ||
                              "Why Choose"
                            }
                            className="whychoose-table-image"
                          />

                        ) : (

                          <span>
                            No Preview
                          </span>

                        )}

                      </td>


                      {/* TYPE */}

                      <td>

                        <span className="whychoose-type">

                          {item.type ||
                            "Image"}

                        </span>

                      </td>


                      {/* NAME */}

                      <td>

                        <div className="whychoose-name">

                          {item.name?.trim()
                            ? item.name
                            : "—"}

                        </div>

                      </td>


                      {/* DESCRIPTION */}

                      <td>

                        <div className="whychoose-description">

                          {item.description?.trim()
                            ? item.description
                            : "—"}

                        </div>

                      </td>


                      {/* CREATED */}

                      <td>

                        {item.created ||
                          item.createdAt ||
                          "—"}

                      </td>


                      {/* ACTION */}

                      <td>

                        <button
                          type="button"
                          className="whychoose-delete-btn"
                          onClick={() =>
                            handleDelete(
                              item.id
                            )
                          }
                          disabled={loading}
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

    </div>

  );
};


export default WhyChoose;