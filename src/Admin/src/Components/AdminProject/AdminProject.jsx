import React, { useEffect, useRef, useState } from "react";
import "./AdminProject.css";

// =====================================================
// API
// =====================================================

const API_URL =
  "https://66ou0fp7m1.execute-api.ap-south-1.amazonaws.com/prod/projects";

// Main project categories
const CATEGORY_OPTIONS = ["Banner", "Featured Project", "Work"];

// Categories shown when the main category is "Work"
const WORK_CATEGORY_OPTIONS = [
  "Web Development",
  "App Development",
  "Graphic Design",
  "Video Editor",
  "SEO & Marketing",
  "Business Development",
];

const ITEMS_PER_PAGE = 5;

const AdminProject = () => {
  const fileInputRef = useRef(null);

  // Project data
  const [projects, setProjects] = useState([]);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [category, setCategory] = useState("");
  const [workCategory, setWorkCategory] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [projectUrl, setProjectUrl] = useState("");

  // Pagination and request state
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load projects.");
      }

      const projectData = Array.isArray(data) ? data : [];
      setProjects(projectData);

      const newTotalPages = Math.max(
        1,
        Math.ceil(projectData.length / ITEMS_PER_PAGE)
      );
      setCurrentPage((page) => Math.min(page, newTotalPages));
    } catch (error) {
      console.error("Project loading error:", error);
      alert(error.message || "Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.max(
    1,
    Math.ceil(projects.length / ITEMS_PER_PAGE)
  );

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProjects = projects.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const resetForm = () => {
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setSelectedFile(null);
    setImagePreview("");
    setCategory("");
    setWorkCategory("");
    setName("");
    setDescription("");
    setProjectUrl("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddImage = () => {
    resetForm();
    setShowForm(true);
  };

  const handleCancel = () => {
    resetForm();
    setShowForm(false);
  };

  const handleCategoryChange = (event) => {
    const nextCategory = event.target.value;
    setCategory(nextCategory);

    // Clear the subcategory if Work is no longer selected.
    if (nextCategory !== "Work") {
      setWorkCategory("");
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      event.target.value = "";
      return;
    }

    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setSelectedFile(null);
    setImagePreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (saving) return;

    if (category === "Work" && !workCategory) {
      alert("Please select a Work Category.");
      return;
    }

    // Validate the optional URL when a value is entered.
    if (projectUrl.trim()) {
      try {
        const parsedUrl = new URL(projectUrl.trim());
        if (!["http:", "https:"].includes(parsedUrl.protocol)) {
          throw new Error("URL must start with http:// or https://");
        }
      } catch {
        alert("Please enter a valid URL, including https://.");
        return;
      }
    }

    try {
      setSaving(true);
      let uploadedKey = "";

      // Step 1: get a presigned S3 upload URL when an image is selected.
      if (selectedFile) {
        const uploadUrlRequest =
          `${API_URL}?upload=true` +
          `&fileName=${encodeURIComponent(selectedFile.name)}` +
          `&fileType=${encodeURIComponent(selectedFile.type)}`;

        const uploadResponse = await fetch(uploadUrlRequest, {
          method: "POST",
        });
        const uploadData = await uploadResponse.json();

        if (!uploadResponse.ok) {
          throw new Error(
            uploadData.message || "Could not create upload URL."
          );
        }

        const { uploadUrl, key } = uploadData;
        if (!uploadUrl || !key) {
          throw new Error("Invalid upload response from server.");
        }

        uploadedKey = key;

        // Step 2: upload the image directly to S3.
        const s3Response = await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": selectedFile.type },
          body: selectedFile,
        });

        if (!s3Response.ok) {
          throw new Error("Image upload failed.");
        }
      }

      // Step 3: save project metadata through Lambda.
      // NOTE: The current Lambda requires an image key. Select an image
      // before saving unless you also update Lambda to allow image-less items.
      const saveResponse = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: uploadedKey,
          name: name.trim(),
          description: description.trim(),
          category: category.trim(),
          workCategory: category === "Work" ? workCategory.trim() : "",
          url: projectUrl.trim(),
        }),
      });

      const saveData = await saveResponse.json();

      if (!saveResponse.ok) {
        throw new Error(saveData.message || "Failed to save project.");
      }

      // Step 4: reload saved data from AWS.
      const refreshedResponse = await fetch(API_URL);
      const refreshedData = await refreshedResponse.json();

      if (!refreshedResponse.ok) {
        throw new Error(
          refreshedData.message ||
            "Project saved, but failed to reload projects."
        );
      }

      const updatedProjects = Array.isArray(refreshedData)
        ? refreshedData
        : [];

      setProjects(updatedProjects);

      const newTotalPages = Math.max(
        1,
        Math.ceil(updatedProjects.length / ITEMS_PER_PAGE)
      );
      setCurrentPage(newTotalPages);

      resetForm();
      setShowForm(false);
      alert("Project saved successfully.");
    } catch (error) {
      console.error("Project save error:", error);
      alert(error.message || "Failed to save project.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) {
      return;
    }

    try {
      setDeletingId(id);

      const response = await fetch(API_URL, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete project.");
      }

      const refreshedResponse = await fetch(API_URL);
      const refreshedData = await refreshedResponse.json();

      if (!refreshedResponse.ok) {
        throw new Error(
          refreshedData.message ||
            "Project deleted, but failed to reload projects."
        );
      }

      const updatedProjects = Array.isArray(refreshedData)
        ? refreshedData
        : [];

      setProjects(updatedProjects);

      const newTotalPages = Math.max(
        1,
        Math.ceil(updatedProjects.length / ITEMS_PER_PAGE)
      );

      setCurrentPage((page) => Math.min(page, newTotalPages));
      alert("Project deleted successfully.");
    } catch (error) {
      console.error("Project delete error:", error);
      alert(error.message || "Failed to delete project.");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return "-";
    return parsedDate.toLocaleDateString("en-GB");
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((page) => page + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage((page) => page - 1);
  };

  const goToPage = (page) => setCurrentPage(page);

  return (
    <div className="admin-project-page">
      <div className="admin-project-header">
        <div>
          <h2>Project</h2>
          <p>Manage project images and information</p>
        </div>

        {!showForm && (
          <button
            type="button"
            className="project-add-button"
            onClick={handleAddImage}
          >
            <span>+</span> Add Image
          </button>
        )}
      </div>

      {showForm && (
        <div className="project-form-card">
          <div className="project-form-header">
            <div>
              <h3>Add Project Image</h3>
              <p>Add an image, project information, category, and link.</p>
            </div>
          </div>

          <form onSubmit={handleSave}>
            {/* IMAGE */}
            <div className="project-form-group">
              <label>
                Image <span>Required by current Lambda</span>
              </label>

              <div className="project-upload-box">
                {imagePreview ? (
                  <div className="project-selected-image">
                    <img src={imagePreview} alt="Selected project preview" />
                    <button
                      type="button"
                      className="project-remove-image"
                      onClick={handleRemoveImage}
                      aria-label="Remove selected image"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="project-upload-content"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <span className="project-upload-plus">+</span>
                    <strong>Add Image</strong>
                    <span>Click here to select an image</span>
                  </button>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleFileChange}
                />
              </div>
            </div>

            {/* MAIN CATEGORY */}
            <div className="project-form-group">
              <label>
                Category <span>Optional</span>
              </label>

              <select
                className="project-input"
                value={category}
                onChange={handleCategoryChange}
              >
                <option value="">Select Category</option>
                {CATEGORY_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* WORK SUBCATEGORY: CONDITIONAL */}
            {category === "Work" && (
              <div className="project-form-group">
                <label>
                  Work Category <span>Required</span>
                </label>

                <select
                  className="project-input"
                  value={workCategory}
                  onChange={(event) => setWorkCategory(event.target.value)}
                  required
                >
                  <option value="">Select Work Category</option>
                  {WORK_CATEGORY_OPTIONS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* NAME */}
            <div className="project-form-group">
              <label>
                Name <span>Optional</span>
              </label>
              <input
                className="project-input"
                type="text"
                placeholder="Enter project name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>

            {/* DESCRIPTION */}
            <div className="project-form-group">
              <label>
                Description <span>Optional</span>
              </label>
              <textarea
                className="project-input project-textarea"
                placeholder="Enter project description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>

            {/* PROJECT URL */}
            <div className="project-form-group">
              <label>
                Project URL <span>Optional</span>
              </label>
              <input
                className="project-input"
                type="url"
                placeholder="https://example.com/project"
                value={projectUrl}
                onChange={(event) => setProjectUrl(event.target.value)}
              />
              <small>
                If provided, the main website can open this link when the
                visitor clicks the project image. The website component must
                use the saved `url` field.
              </small>
            </div>

            {/* ACTIONS */}
            <div className="project-form-actions">
              <button
                type="button"
                className="project-cancel-button"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="project-save-button"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* PROJECT TABLE */}
      <div className="project-table-card">
        <div className="project-table-wrapper">
          <table className="project-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Preview</th>
                <th>Type</th>
                <th>Name</th>
                <th>Description</th>
                <th>Category</th>
                <th>Work Category</th>
                <th>Project URL</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="10" className="project-empty-cell">
                    Loading projects...
                  </td>
                </tr>
              ) : currentProjects.length === 0 ? (
                <tr>
                  <td colSpan="10" className="project-empty-cell">
                    No projects added yet.
                  </td>
                </tr>
              ) : (
                currentProjects.map((project, index) => (
                  <tr key={project.id}>
                    <td>{startIndex + index + 1}</td>

                    <td>
                      <div className="project-table-preview">
                        {project.image ? (
                          <img
                            src={project.image}
                            alt={project.name || "Project"}
                          />
                        ) : (
                          <div className="project-no-image">-</div>
                        )}
                      </div>
                    </td>

                    <td>{project.type || "Image"}</td>
                    <td>{project.name || "-"}</td>
                    <td>{project.description || "-"}</td>
                    <td>{project.category || "-"}</td>
                    <td>{project.workCategory || "-"}</td>

                    <td>
                      {project.url ? (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Open Link
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>

                    <td>{formatDate(project.created)}</td>

                    <td>
                      <button
                        type="button"
                        className="project-delete-button"
                        disabled={deletingId === project.id}
                        onClick={() => handleDelete(project.id)}
                      >
                        {deletingId === project.id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {projects.length > ITEMS_PER_PAGE && (
          <div className="project-pagination">
            <button
              type="button"
              className="pagination-arrow"
              disabled={currentPage === 1}
              onClick={goToPreviousPage}
            >
              ← Previous
            </button>

            <div className="pagination-numbers">
              {Array.from({ length: totalPages }, (_, index) => {
                const page = index + 1;
                return (
                  <button
                    type="button"
                    key={page}
                    className={
                      currentPage === page
                        ? "pagination-number active"
                        : "pagination-number"
                    }
                    onClick={() => goToPage(page)}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              className="pagination-arrow"
              disabled={currentPage === totalPages}
              onClick={goToNextPage}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProject;
