import React, { useState } from "react";

// =====================================================
// HOME COMPONENTS
// =====================================================

import Homebanner from "./Components/HomeBanner/HomeBanner.jsx";
import HomeAbout from "./Components/Homeabout/Homeabout.jsx";
import WhyChoose from "./Components/WhyChoose/WhyChoose.jsx";

// =====================================================
// ABOUT PAGE COMPONENTS
// =====================================================

import Aboutslider from "./Components/Aboutpage/Aboutslider.jsx";
import Story from "./Components/Aboutpage/Story.jsx";
import Founder from "./Components/Aboutpage/Founder.jsx";
import Life from "./Components/Aboutpage/Life.jsx";
import Team from "./Components/Aboutpage/Team.jsx";

// =====================================================
// SERVICE COMPONENTS
// =====================================================

import ServiceBanner from "./Components/ServiceBanner/ServiceBanner.jsx";
import WebDevelopment from "./Components/ServiceBanner/WebDevelopment.jsx";
import Appdevelop from "./Components/ServiceBanner/Appdevlop.jsx";
import Seodevelop from "./Components/ServiceBanner/Seodevelop.jsx";
import Videoeditor from "./Components/ServiceBanner/Videoeditor.jsx";
import Grapgicdesign from "./Components/ServiceBanner/Graphicdesign.jsx";
import Digitalmarketing from "./Components/ServiceBanner/Digitalmarketing.jsx";


// =====================================================
// INDUSTRY COMPONENTS
// =====================================================
import Industrybanenr from "./Components/Industry Admin/Industrybanner.jsx";
import Smarthealthcare from "./Components/Industry Admin/Smarthealthcare.jsx";
import Weddingevents from "./Components/Industry Admin/Weddingevents.jsx";
import Adminmanufacture from "./Components/Industry Admin/Adminmanufacture.jsx";
import Travelhospitality from "./Components/Industry Admin/Travelhospitality.jsx";
import Mediaentertainment from "./Components/Industry Admin/Mediaentertainment.jsx";
import EducationLearn from "./Components/Industry Admin/EducationLearn.jsx";
import Realestate from "./Components/Industry Admin/Realestate.jsx";
import Retailecommerce from "./Components/Industry Admin/Retailecommerce.jsx";

  
// =====================================================
// PROJECT COMPONENT
// =====================================================

import AdminProject from "./Components/AdminProject/AdminProject.jsx";

// =====================================================
// CAREER COMPONENTS
// =====================================================
import Careerbanner from "./Components/CareerBanner/Careerbanner.jsx";
import Job from "./Components/CareerBanner/Job.jsx";
import Leads from "./Components/Leads/Leads.jsx";
import Seo from "./Components/Seo/Seoadmin.jsx";
// =====================================================
// SIDEBAR
// =====================================================

import Sidebar from "./Components/Sidebar/Sidebar.jsx";


function App() {

  // =====================================================
  // SELECTED PAGE
  // =====================================================

  const [selectedPage, setSelectedPage] = useState("Home Slider");


  // =====================================================
  // RENDER SELECTED PAGE
  // =====================================================

  const renderPage = () => {

    switch (selectedPage) {

      // =================================================
      // HOME
      // =================================================

      case "Home Slider":
        return <Homebanner />;

      case "About":
        return <HomeAbout />;

      case "Why Choose":
        return <WhyChoose />;


      // =================================================
      // ABOUT PAGE
      // =================================================

      case "About Banner":
        return <Aboutslider />;

      case "Our Story":
        return <Story />;

      case "Founder":
        return <Founder />;

      case "Life at Kaden Kopper":
        return <Life />;

      case "Our Team":
        return <Team />;


      // =================================================
      // SERVICE PAGE
      // =================================================

      case "Service Banner":
        return <ServiceBanner />;

      case "Web Development":
        return <WebDevelopment />;

      case "App Development":
        return <Appdevelop />;

      case "Seo":
        return <Seodevelop />;

        case "Video Editor":
     return <Videoeditor />;

        case "Graphic Design":
     return <Grapgicdesign />;

        case "Digital Marketing":
     return <Digitalmarketing />;

       

     // =================================================
      // INDUSTRY PAGE
      // =================================================

      case "Industry Banner":
        return <Industrybanenr />;

      case "Smart Healthcare":
        return <Smarthealthcare />;

        case "Wedding & Events":
         return <Weddingevents />;

         case "Manufacturing":
        return <Adminmanufacture />;

        case "Travel & Hospitality":
      return <Travelhospitality />;

      case "Media & Entertainment":
     return <Mediaentertainment />;

     case "Education & Learning":
    return <EducationLearn />;

   case "Real Estate":
  return <Realestate />;

   case "Retail & E-Commerce":
  return <Retailecommerce />;


   
      // =================================================
      // PROJECT PAGE
      // =================================================

      case "Project":
        return <AdminProject />;

  // =================================================
      // CAREER PAGE
      // =================================================

    case "Career Banner":
  return <Careerbanner />;

  case "Job Opening":
  return <Job />;

  // =====================================================
// LEADS PAGE
// =====================================================

case "Customer Leads":
  return <Leads />;

  // =====================================================
// SEO MANAGEMENT
// =====================================================

case "SEO":
case "Add SEO":
  return <Seo />;

    }
  };


  // =====================================================
  // APP
  // =====================================================

  return (
    <div className="App">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <Sidebar
        onSelect={setSelectedPage}
      />


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="main-content">

        {renderPage()}

      </main>

    </div>
  );
}


export default App;