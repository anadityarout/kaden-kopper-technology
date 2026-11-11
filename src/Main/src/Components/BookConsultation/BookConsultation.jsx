
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  Tag,
  UserRound,
  Mail,
  Phone,
  Clock3,
  MessageSquare,
  Send,
  X,
  Check,
} from "lucide-react";

import "./BookConsultation.css";

// =====================================================
// AWS API CONFIGURATION
// =====================================================

const CONSULTATION_API_URL =
  "https://66ou0fp7m1.execute-api.ap-south-1.amazonaws.com/prod/consultations";

// =====================================================
// BOOK CONSULTATION COMPONENT
// =====================================================

export default function BookConsultation({ open, onClose }) {
  // ===================================================
  // STATES
  // ===================================================

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [form, setForm] = useState({
    topic: "General Inquiry",
    fullName: "",
    email: "",
    phone: "",
    contactTime: "Anytime",
    subject: "",
    message: "",
  });

  // ===================================================
  // MODAL OPEN / CLOSE HANDLING
  // ===================================================

  useEffect(() => {
    if (!open) {
      setSubmitted(false);
      setSubmitError("");
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !submitting) {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;

      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose, submitting]);

  // ===================================================
  // UPDATE FORM FIELDS
  // ===================================================

  const updateField = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    if (submitError) {
      setSubmitError("");
    }
  };

  // ===================================================
  // SUBMIT CONSULTATION TO AWS LAMBDA
  // ===================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitting) return;

    setSubmitting(true);
    setSubmitError("");

    try {
      const payload = {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        topic: form.topic,
        contactTime: form.contactTime,
        subject: form.subject.trim(),
        message: form.message.trim(),
      };

      // ===============================================
      // SEND POST REQUEST TO API GATEWAY
      // ===============================================

      const apiResponse = await fetch(CONSULTATION_API_URL, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      });

      // ===============================================
      // READ BACKEND RESPONSE
      // ===============================================

      const result = await apiResponse.json();

      if (!apiResponse.ok || result.success !== true) {
        throw new Error(
          result.message ||
            "Your consultation could not be submitted. Please try again."
        );
      }

      // ===============================================
      // SUCCESS
      // ===============================================

      setSubmitted(true);

      setForm({
        topic: "General Inquiry",
        fullName: "",
        email: "",
        phone: "",
        contactTime: "Anytime",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Consultation submission error:", error);

      if (error.message === "Failed to fetch") {
        setSubmitError(
          "Unable to connect to the server. Please check your internet connection or try again later."
        );
      } else {
        setSubmitError(
          error.message ||
            "Something went wrong. Please try again."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ===================================================
  // CLOSE MODAL
  // ===================================================

  const handleClose = () => {
    if (submitting) return;

    onClose?.();
  };

  // ===================================================
  // RENDER NOTHING WHEN CLOSED
  // ===================================================

  if (!open || typeof document === "undefined") {
    return null;
  }

  // ===================================================
  // MODAL UI
  // ===================================================

  return createPortal(
    <div
      className="bc-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !submitting
        ) {
          handleClose();
        }
      }}
    >
      <section
        className={`bc-modal ${
          submitted ? "bc-modal--success" : "bc-modal--form"
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="bc-title"
      >
        {/* CLOSE BUTTON */}

        <button
          className="bc-close"
          type="button"
          aria-label="Close consultation popup"
          onClick={handleClose}
          disabled={submitting}
        >
          <X size={23} strokeWidth={2.5} />
        </button>

        {!submitted ? (
          <div className="bc-form-panel">
            {/* =========================================
                FORM HEADER
            ========================================= */}

            <header className="bc-heading">
              <span
                className="bc-heading-line"
                aria-hidden="true"
              />

              <div className="bc-heading-copy">
                <h2 id="bc-title">
                  Send Us a <span>Message</span>
                </h2>

                <p>
                  Fill out the form below and our team will
                  get back to you shortly.
                </p>
              </div>
            </header>

            {/* =========================================
                CONSULTATION FORM
            ========================================= */}

            <form
              className="bc-form"
              onSubmit={handleSubmit}
            >
              {/* INQUIRY TOPIC */}

              <div className="bc-field bc-field--full">
                <label htmlFor="bc-topic">
                  <Tag aria-hidden="true" />
                  <span>
                    Inquiry Topic <b>*</b>
                  </span>
                </label>

                <div className="bc-control">
                  <span
                    className="bc-control-icon"
                    aria-hidden="true"
                  >
                    <Tag />
                  </span>

                  <select
                    id="bc-topic"
                    name="topic"
                    value={form.topic}
                    onChange={updateField}
                    required
                    disabled={submitting}
                  >
                    <option>General Inquiry</option>
                    <option>Website Development</option>
                    <option>App Development</option>
                    <option>SEO &amp; Marketing</option>
                    <option>Graphic Design</option>
                    <option>Project Consultation</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              {/* FULL NAME */}

              <div className="bc-field">
                <label htmlFor="bc-name">
                  <UserRound aria-hidden="true" />
                  <span>
                    Full Name <b>*</b>
                  </span>
                </label>

                <div className="bc-control">
                  <span
                    className="bc-control-icon"
                    aria-hidden="true"
                  >
                    <UserRound />
                  </span>

                  <input
                    id="bc-name"
                    name="fullName"
                    type="text"
                    value={form.fullName}
                    onChange={updateField}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    maxLength={150}
                    required
                    disabled={submitting}
                  />
                </div>
              </div>

              {/* EMAIL */}

              <div className="bc-field">
                <label htmlFor="bc-email">
                  <Mail aria-hidden="true" />
                  <span>
                    Email Address <b>*</b>
                  </span>
                </label>

                <div className="bc-control">
                  <span
                    className="bc-control-icon"
                    aria-hidden="true"
                  >
                    <Mail />
                  </span>

                  <input
                    id="bc-email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={updateField}
                    placeholder="Enter your email address"
                    autoComplete="email"
                    maxLength={254}
                    required
                    disabled={submitting}
                  />
                </div>
              </div>

              {/* PHONE */}

              <div className="bc-field">
                <label htmlFor="bc-phone">
                  <Phone aria-hidden="true" />
                  <span>
                    Phone Number <b>*</b>
                  </span>
                </label>

                <div className="bc-control">
                  <span
                    className="bc-control-icon"
                    aria-hidden="true"
                  >
                    <Phone />
                  </span>

                  <input
                    id="bc-phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={updateField}
                    placeholder="+91 98765 43210"
                    autoComplete="tel"
                    maxLength={40}
                    required
                    disabled={submitting}
                  />
                </div>
              </div>

              {/* CONTACT TIME */}

              <div className="bc-field">
                <label htmlFor="bc-time">
                  <Clock3 aria-hidden="true" />
                  <span>Best Time to Contact</span>
                </label>

                <div className="bc-control">
                  <span
                    className="bc-control-icon"
                    aria-hidden="true"
                  >
                    <Clock3 />
                  </span>

                  <select
                    id="bc-time"
                    name="contactTime"
                    value={form.contactTime}
                    onChange={updateField}
                    disabled={submitting}
                  >
                    <option>Anytime</option>
                    <option>Morning (9 AM – 12 PM)</option>
                    <option>Afternoon (12 PM – 4 PM)</option>
                    <option>Evening (4 PM – 7 PM)</option>
                  </select>
                </div>
              </div>

              {/* SUBJECT */}

              <div className="bc-field bc-field--full">
                <label htmlFor="bc-subject">
                  <Tag aria-hidden="true" />
                  <span>
                    Subject <b>*</b>
                  </span>
                </label>

                <div className="bc-control">
                  <span
                    className="bc-control-icon"
                    aria-hidden="true"
                  >
                    <Tag />
                  </span>

                  <input
                    id="bc-subject"
                    name="subject"
                    type="text"
                    value={form.subject}
                    onChange={updateField}
                    placeholder="Enter your subject"
                    maxLength={300}
                    required
                    disabled={submitting}
                  />
                </div>
              </div>

              {/* MESSAGE */}

              <div className="bc-field bc-field--full">
                <label htmlFor="bc-message">
                  <MessageSquare aria-hidden="true" />
                  <span>
                    Message <b>*</b>
                  </span>
                </label>

                <div className="bc-control bc-control--textarea">
                  <span
                    className="bc-control-icon"
                    aria-hidden="true"
                  >
                    <MessageSquare />
                  </span>

                  <textarea
                    id="bc-message"
                    name="message"
                    value={form.message}
                    onChange={updateField}
                    placeholder="Please provide details about your inquiry..."
                    rows={3}
                    maxLength={5000}
                    required
                    disabled={submitting}
                  />
                </div>
              </div>

              {/* BACKEND ERROR */}

              {submitError && (
                <p
                  className="bc-demo-note"
                  role="alert"
                  aria-live="polite"
                >
                  {submitError}
                </p>
              )}

              {/* SUBMIT BUTTON */}

              <button
                className="bc-submit"
                type="submit"
                disabled={submitting}
              >
                <Send size={21} aria-hidden="true" />

                <span>
                  {submitting
                    ? "Sending..."
                    : "Send Message"}
                </span>

                {!submitting && (
                  <span
                    className="bc-submit-arrow"
                    aria-hidden="true"
                  >
                    →
                  </span>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* =========================================
             SUCCESS SCREEN
          ========================================= */

          <div className="bc-success-content">
            <div
              className="bc-success-art"
              aria-hidden="true"
            >
              <span className="bc-success-ring">
                <span className="bc-success-circle">
                  <Check
                    size={55}
                    strokeWidth={2.5}
                  />
                </span>
              </span>

              <i className="bc-dot bc-dot--one" />
              <i className="bc-dot bc-dot--two" />
              <i className="bc-dot bc-dot--three" />
              <i className="bc-dot bc-dot--four" />
            </div>

            <h2 id="bc-title">
              Thank <span>You!</span>
            </h2>

            <p>Your consultation request has been received.</p>

            <p>Our team will contact you shortly.</p>
          </div>
        )}
      </section>
    </div>,
    document.body
  );
}
