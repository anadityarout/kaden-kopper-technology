import { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
         
// =====================================================
// NAVBAR
// =====================================================

import Navbar from "./Components/Navbar/Navbar";

// =====================================================
// BOOK CONSULTATION POPUP
// =====================================================

import BookConsultation from "./Components/BookConsultation/BookConsultation";

// =====================================================
// HOME COMPONENTS
// =====================================================

import HomeSlider from "./Components/Home/HomeSlider";
import About from "./Components/About/About";
import Build from "./Components/Build/Build";
import Client from "./Components/Client/Client";
import Service from "./Components/ServiceHome/Service";
import TechStack from "./Components/Stack/TechStack";
import Work from "./Components/Work/Work";
import Process from "./Components/Process/Process";
import WhyChooseUs from "./Components/WhyChooseUs/WhyChooseUs";
import Solutions from "./Components/Solutions/Solutions";

// =====================================================
// MAIN PAGES
// =====================================================

import AboutPage from "./Components/AboutPage/AboutPage";
import Career from "./Components/Career/Career";
import Contact from "./Components/Contact/Contact";
import Footer from "./Components/Footer/Footer";
import Project from "./Components/ProjectPage/Project";

// =====================================================
// SERVICE PAGES
// =====================================================

import ServicePage from "./Components/Service/ServicePage";
import Web from "./Components/Service/Web";
import AppDevelopment from "./Components/Service/AppDevelopment";
import Seo from "./Components/Service/Seo";
import Video from "./Components/Service/Video";
import Market from "./Components/Service/Market";
import Graphic from "./Components/Service/Graphic";

// =====================================================
// INDUSTRY PAGES
// =====================================================

import Industry from "./Components/Industry/Industry";

// =====================================================
// HOME PAGE
// =====================================================

function Home() {
  return (
    <>
      <HomeSlider />
      <About />
      <Service />
      <Build />
      <TechStack />
      <Work />
      <Solutions />
      <WhyChooseUs />
      <Process />
      <Client />
    </>
  );
}

// =====================================================
// 404 PAGE
// =====================================================

function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "40px 20px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "760px",
        }}
      >
        {/* 404 NUMBER */}

        <div
          style={{
            margin: "0 0 35px",
            fontFamily: "Arial, sans-serif",
            fontSize: "clamp(120px, 20vw, 230px)",
            lineHeight: "0.85",
            fontWeight: "800",
            color: "#4b4f8f",
            letterSpacing: "-10px",
          }}
        >
          404
        </div>

        {/* PAGE NOT FOUND TITLE */}

        <h1
          style={{
            margin: "0 0 14px",
            fontFamily: "Arial, sans-serif",
            fontSize: "38px",
            lineHeight: "1.2",
            fontWeight: "700",
            color: "#222222",
          }}
        >
          Page Not Found
        </h1>

        {/* DESCRIPTION */}

        <p
          style={{
            margin: "0 0 30px",
            fontFamily: "Arial, sans-serif",
            fontSize: "17px",
            lineHeight: "1.6",
            fontWeight: "400",
            color: "#666666",
          }}
        >
          Sorry, the page you are looking for doesn't exist.
        </p>

        {/* BACK TO HOME */}

        <a
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: "156px",
            height: "44px",
            padding: "0 28px",
            boxSizing: "border-box",
            background: "#4b4f8f",
            color: "#ffffff",
            borderRadius: "6px",
            textDecoration: "none",
            fontFamily: "Arial, sans-serif",
            fontSize: "15px",
            fontWeight: "700",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          Back to Home
        </a>
      </div>
    </div>
  );
}

// =====================================================
// APP LAYOUT
// =====================================================

function AppLayout() {
  const location = useLocation();

  // ===================================================
  // BOOK CONSULTATION POPUP STATE
  // ===================================================

  const [consultationOpen, setConsultationOpen] = useState(false);

  // Show the consultation popup only on the Home page.

  const isHomePage = location.pathname === "/";

  // ===================================================
  // VALID WEBSITE ROUTES
  // ===================================================

  const validRoutes = [
    "/",

    // About
    "/about",

    // Industries
    "/industries",

    // Services
    "/services",
    "/services/web-development",
    "/services/app-development",
    "/services/seo",
    "/services/video-editor",
    "/services/graphic-designer",
    "/services/marketing",

    // Main Pages
    "/career",
    "/contact",
    "/project",
  ];

  // ===================================================
  // CHECK IF CURRENT PAGE IS 404
  // ===================================================

  const isNotFoundPage = !validRoutes.includes(location.pathname);

  // ===================================================
  // CLOSE POPUP WHEN LEAVING HOME PAGE
  // ===================================================

  // The popup is rendered only while the current route is "/".
  // Its open state cannot display it on other pages.

  return (
    <>
      {/* =================================================
          NAVBAR
          Hide Navbar on 404
      ================================================= */}

      {!isNotFoundPage && (
        <Navbar
          onBookConsultation={() => {
            if (isHomePage) {
              setConsultationOpen(true);
            }
          }}
        />
      )}

      {/* =================================================
          BOOK CONSULTATION POPUP
          HOME PAGE ONLY
      ================================================= */}

      {isHomePage && (
        <BookConsultation
          open={consultationOpen}
          onClose={() => setConsultationOpen(false)}
        />
      )}

      {/* =================================================
          ROUTES
      ================================================= */}

      <Routes>
        {/* HOME */}

        <Route
          path="/"
          element={<Home />}
        />

        {/* ABOUT */}

        <Route
          path="/about"
          element={<AboutPage />}
        />

        {/* INDUSTRIES */}

        <Route
          path="/industries"
          element={<Industry />}
        />

        {/* SERVICES */}

        <Route
          path="/services"
          element={<ServicePage />}
        />

        {/* WEB DEVELOPMENT */}

        <Route
          path="/services/web-development"
          element={<Web />}
        />

        {/* APP DEVELOPMENT */}

        <Route
          path="/services/app-development"
          element={<AppDevelopment />}
        />

        {/* SEO */}

        <Route
          path="/services/seo"
          element={<Seo />}
        />

        {/* VIDEO EDITOR */}

        <Route
          path="/services/video-editor"
          element={<Video />}
        />

        {/* GRAPHIC DESIGNER */}

        <Route
          path="/services/graphic-designer"
          element={<Graphic />}
        />

        {/* MARKETING */}

        <Route
          path="/services/marketing"
          element={<Market />}
        />

        {/* PROJECT */}

        <Route
          path="/project"
          element={<Project />}
        />

        {/* CAREER */}

        <Route
          path="/career"
          element={<Career />}
        />

        {/* CONTACT */}

        <Route
          path="/contact"
          element={<Contact />}
        />

        {/* 404 / INVALID URL */}

        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>

      {/* =================================================
          FOOTER
          Hide Footer on 404
      ================================================= */}

      {!isNotFoundPage && <Footer />}
    </>
  );
}

// =====================================================
// APP
// =====================================================

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;