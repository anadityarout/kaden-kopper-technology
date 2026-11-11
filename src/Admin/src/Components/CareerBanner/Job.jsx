import React, { useEffect, useState } from "react";
import "./Job.css";

// =====================================================
// API CONFIGURATION
// =====================================================

const API_URL =
  "https://66Ou0fp7m1.execute-api.ap-south-1.amazonaws.com/prod/job";


// =====================================================
// JOB COMPONENT
// =====================================================

const Job = () => {

  // =====================================================
  // FORM STATE
  // =====================================================

  const [showForm, setShowForm] = useState(false);

  const [category, setCategory] =
    useState("Web Development");

  const [jobRole, setJobRole] =
    useState("");

  const [jobName, setJobName] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [jobType, setJobType] =
    useState("Full Time");

  const [requirement, setRequirement] =
    useState("");

  const [date, setDate] =
    useState("");

  const [time, setTime] =
    useState("");

  const [lastDate, setLastDate] =
    useState("");


  // =====================================================
  // JOB ITEMS
  // =====================================================

  const [items, setItems] =
    useState([]);


  // =====================================================
  // PAGINATION
  // =====================================================

  const [currentPage, setCurrentPage] =
    useState(1);

  const itemsPerPage = 5;


  // =====================================================
  // LOAD JOBS FROM AWS
  // =====================================================

  useEffect(() => {
    loadJobs();
  }, []);


  const loadJobs = async ({
    goToLastPage = false,
  } = {}) => {

    try {

      const response = await fetch(API_URL, {
        method: "GET",
      });

      if (!response.ok) {

        let errorData = {};

        try {
          errorData = await response.json();
        } catch {
          errorData = {};
        }

        throw new Error(
          errorData.message ||
          "Failed to load jobs."
        );
      }


      const data = await response.json();


      const jobs =
        Array.isArray(data)
          ? data
          : [];


      setItems(jobs);


      // =================================================
      // PAGINATION AFTER LOADING
      // =================================================

      const calculatedTotalPages =
        Math.max(
          1,
          Math.ceil(
            jobs.length / itemsPerPage
          )
        );


      if (goToLastPage) {

        setCurrentPage(
          calculatedTotalPages
        );

      } else {

        setCurrentPage((previousPage) =>
          Math.min(
            previousPage,
            calculatedTotalPages
          )
        );

      }

    } catch (error) {

      console.error(
        "Job load error:",
        error
      );

      alert(
        error.message ||
        "Failed to load jobs."
      );
    }
  };


  // =====================================================
  // ADD JOB
  // =====================================================

  const handleAddJob = () => {

    setShowForm(true);

    setCategory("Web Development");

    setJobRole("");

    setJobName("");

    setDescription("");

    setJobType("Full Time");

    setRequirement("");

    setDate("");

    setTime("");

    setLastDate("");
  };


  // =====================================================
  // SAVE JOB
  // =====================================================

  const handleSave = async () => {

    // ===================================================
    // VALIDATION
    // ===================================================

    if (!jobRole.trim()) {

      alert(
        "Please enter job role."
      );

      return;
    }


    if (!jobName.trim()) {

      alert(
        "Please enter job name."
      );

      return;
    }


    // ===================================================
    // SAVE TO AWS
    // ===================================================

    try {

      const response = await fetch(
        API_URL,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            category:
              category,

            jobRole:
              jobRole.trim(),

            jobName:
              jobName.trim(),

            description:
              description.trim(),

            jobType:
              jobType,

            requirement:
              requirement.trim(),

            date:
              date,

            time:
              time,

            lastDate:
              lastDate,

          }),
        }
      );


      // =================================================
      // READ RESPONSE
      // =================================================

      let data = {};

      try {

        data = await response.json();

      } catch {

        data = {};

      }


      // =================================================
      // ERROR
      // =================================================

      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to save job."
        );
      }


      // =================================================
      // SUCCESS
      // =================================================

      console.log(
        "Job saved successfully:",
        data
      );


      alert(
        "Job added successfully."
      );


      // =================================================
      // CLOSE / RESET FORM
      // =================================================

      resetForm();


      // =================================================
      // LOAD UPDATED JOB LIST
      // =================================================

      await loadJobs({
        goToLastPage: true,
      });

    } catch (error) {

      console.error(
        "Job save error:",
        error
      );

      alert(
        error.message ||
        "Failed to save job."
      );
    }
  };


  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {

    setShowForm(false);

    setCategory(
      "Web Development"
    );

    setJobRole("");

    setJobName("");

    setDescription("");

    setJobType(
      "Full Time"
    );

    setRequirement("");

    setDate("");

    setTime("");

    setLastDate("");
  };


  // =====================================================
  // CANCEL
  // =====================================================

  const handleCancel = () => {

    resetForm();
  };


  // =====================================================
  // DELETE JOB
  // =====================================================

  const handleDelete = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this job?"
      );


    if (!confirmDelete) {
      return;
    }


    // ===================================================
    // DELETE FROM AWS
    // ===================================================

    try {

      const response = await fetch(
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


      // =================================================
      // READ RESPONSE
      // =================================================

      let data = {};

      try {

        data = await response.json();

      } catch {

        data = {};

      }


      // =================================================
      // ERROR
      // =================================================

      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to delete job."
        );
      }


      // =================================================
      // SUCCESS
      // =================================================

      console.log(
        "Job deleted:",
        data
      );


      alert(
        "Job deleted successfully."
      );


      // =================================================
      // RELOAD JOBS
      // =================================================

      await loadJobs();

    } catch (error) {

      console.error(
        "Job delete error:",
        error
      );

      alert(
        error.message ||
        "Failed to delete job."
      );
    }
  };


  // =====================================================
  // PAGINATION
  // =====================================================

  const totalPages = Math.max(
    1,
    Math.ceil(
      items.length / itemsPerPage
    )
  );


  const startIndex =
    (currentPage - 1) *
    itemsPerPage;


  const currentItems =
    items.slice(
      startIndex,
      startIndex + itemsPerPage
    );


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
  // FORMAT DATE
  // =====================================================

  const formatDate = (value) => {

    if (!value) {
      return "-";
    }


    const dateObject =
      new Date(value);


    if (
      Number.isNaN(
        dateObject.getTime()
      )
    ) {
      return value;
    }


    return dateObject.toLocaleDateString(
      "en-GB"
    );
  };


  // =====================================================
  // FORMAT TIME
  // =====================================================

  const formatTime = (value) => {

    if (!value) {
      return "-";
    }


    const [
      hours,
      minutes,
    ] = value.split(":");


    const hour =
      Number(hours);


    if (Number.isNaN(hour)) {
      return value;
    }


    const period =
      hour >= 12
        ? "PM"
        : "AM";


    const formattedHour =
      hour % 12 === 0
        ? 12
        : hour % 12;


    return `${formattedHour}:${minutes} ${period}`;
  };


  // =====================================================
  // JSX
  // =====================================================

  return (
    <div className="job-admin">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="job-header">

        <h1>
          Job Opening
        </h1>


        <button
          type="button"
          className="job-add-btn"
          onClick={handleAddJob}
        >
          + Add Job
        </button>

      </div>


      {/* =================================================
          FORM
      ================================================= */}

      {showForm && (

        <div className="job-form-card">

          {/* =================================================
              CATEGORY
          ================================================= */}

          <div className="job-field">

            <label className="job-label">
              Category
            </label>


            <select
              className="job-select"
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value
                )
              }
            >

              <option value="Web Development">
                Web Development
              </option>


              <option value="App Development">
                App Development
              </option>


              <option value="Graphic Design">
                Graphic Design
              </option>


              <option value="SEO">
                SEO
              </option>


              <option value="Video Editor">
                Video Editor
              </option>


              <option value="Marketing">
                Marketing
              </option>


              <option value="Business Development">
                Business Development
              </option>

            </select>

          </div>


          {/* =================================================
              JOB ROLE
          ================================================= */}

          <div className="job-field">

            <label className="job-label">
              Job Role
            </label>


            <input
              type="text"
              className="job-input"
              placeholder="Enter job role"
              value={jobRole}
              onChange={(e) =>
                setJobRole(
                  e.target.value
                )
              }
            />

          </div>


          {/* =================================================
              JOB NAME
          ================================================= */}

          <div className="job-field">

            <label className="job-label">
              Job Name
            </label>


            <input
              type="text"
              className="job-input"
              placeholder="Enter job name"
              value={jobName}
              onChange={(e) =>
                setJobName(
                  e.target.value
                )
              }
            />

          </div>


          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <div className="job-field">

            <label className="job-label">
              Description
            </label>


            <textarea
              className="job-textarea"
              placeholder="Enter job description"
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
              JOB TYPE
          ================================================= */}

          <div className="job-field">

            <label className="job-label">
              Job Type
            </label>


            <select
              className="job-select"
              value={jobType}
              onChange={(e) =>
                setJobType(
                  e.target.value
                )
              }
            >

              <option value="Full Time">
                Full Time
              </option>


              <option value="Part Time">
                Part Time
              </option>

            </select>

          </div>


          {/* =================================================
              REQUIREMENT
          ================================================= */}

          <div className="job-field">

            <label className="job-label">
              Requirement
            </label>


            <textarea
              className="job-textarea"
              placeholder="Enter job requirements"
              rows="5"
              value={requirement}
              onChange={(e) =>
                setRequirement(
                  e.target.value
                )
              }
            />

          </div>


          {/* =================================================
              DATE / TIME
          ================================================= */}

          <div className="job-date-time-row">

            {/* DATE */}

            <div className="job-field">

              <label className="job-label">
                Date
              </label>


              <input
                type="date"
                className="job-input"
                value={date}
                onChange={(e) =>
                  setDate(
                    e.target.value
                  )
                }
              />

            </div>


            {/* TIME */}

            <div className="job-field">

              <label className="job-label">
                Time
              </label>


              <input
                type="time"
                className="job-input"
                value={time}
                onChange={(e) =>
                  setTime(
                    e.target.value
                  )
                }
              />

            </div>

          </div>


          {/* =================================================
              LAST DATE
          ================================================= */}

          <div className="job-field">

            <label className="job-label">
              Last Date
            </label>


            <input
              type="date"
              className="job-input"
              value={lastDate}
              onChange={(e) =>
                setLastDate(
                  e.target.value
                )
              }
            />

          </div>


          {/* =================================================
              SAVE / CANCEL
          ================================================= */}

          <div className="job-form-actions">

            <button
              type="button"
              className="job-save-btn"
              onClick={handleSave}
            >
              Save
            </button>


            <button
              type="button"
              className="job-cancel-btn"
              onClick={handleCancel}
            >
              Cancel
            </button>

          </div>

        </div>
      )}


      {/* =================================================
          TABLE
      ================================================= */}

      {items.length > 0 && (

        <div className="job-table-wrapper">

          <table className="job-table">

            <thead>

              <tr>

                <th>
                  No
                </th>

                <th>
                  Category
                </th>

                <th>
                  Job Role
                </th>

                <th>
                  Job Name
                </th>

                <th>
                  Description
                </th>

                <th>
                  Job Type
                </th>

                <th>
                  Requirement
                </th>

                <th>
                  Date
                </th>

                <th>
                  Time
                </th>

                <th>
                  Last Date
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
                      {
                        startIndex +
                        index +
                        1
                      }
                    </td>


                    {/* CATEGORY */}

                    <td>
                      {
                        item.category ||
                        "-"
                      }
                    </td>


                    {/* JOB ROLE */}

                    <td>
                      {
                        item.jobRole ||
                        "-"
                      }
                    </td>


                    {/* JOB NAME */}

                    <td>
                      {
                        item.jobName ||
                        "-"
                      }
                    </td>


                    {/* DESCRIPTION */}

                    <td>

                      <div className="job-description">
                        {
                          item.description ||
                          "-"
                        }
                      </div>

                    </td>


                    {/* JOB TYPE */}

                    <td>
                      {
                        item.jobType ||
                        "-"
                      }
                    </td>


                    {/* REQUIREMENT */}

                    <td>

                      <div className="job-requirement">
                        {
                          item.requirement ||
                          "-"
                        }
                      </div>

                    </td>


                    {/* DATE */}

                    <td>
                      {
                        formatDate(
                          item.date
                        )
                      }
                    </td>


                    {/* TIME */}

                    <td>
                      {
                        formatTime(
                          item.time
                        )
                      }
                    </td>


                    {/* LAST DATE */}

                    <td>
                      {
                        formatDate(
                          item.lastDate
                        )
                      }
                    </td>


                    {/* CREATED */}

                    <td>
                      {
                        item.created ||
                        "-"
                      }
                    </td>


                    {/* ACTION */}

                    <td>

                      <button
                        type="button"
                        className="job-delete-btn"
                        onClick={() =>
                          handleDelete(
                            item.id
                          )
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


          {/* =================================================
              PAGINATION
          ================================================= */}

          {totalPages > 1 && (

            <div className="job-pagination">

              {/* PREVIOUS */}

              <button
                type="button"
                className="job-page-btn"
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


              {/* PAGE NUMBERS */}

              {Array.from(
                {
                  length:
                    totalPages,
                },
                (_, index) =>
                  index + 1
              ).map((page) => (

                <button
                  type="button"
                  key={page}
                  className={`job-page-btn ${
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

              ))}


              {/* NEXT */}

              <button
                type="button"
                className="job-page-btn"
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

    </div>
  );
};


export default Job;