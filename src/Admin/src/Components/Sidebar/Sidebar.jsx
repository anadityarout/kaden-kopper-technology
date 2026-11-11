import React, { useState } from "react";
import {
  Home,
  Info,
  Phone,
  Users,
  Search,
  LogOut,
  ChevronRight,
  FolderKanban,
} from "lucide-react";

import "./Sidebar.css";

// =====================================================
// SIDEBAR MENU ITEMS
// =====================================================

const menuItems = [
  // HOME
  {
    label: "Home",
    icon: Home,
    subItems: [
      "Home Slider",
      "About",
      "Why Choose",
    ],
  },

  // ABOUT
  {
    label: "About",
    icon: Info,
    subItems: [
      "About Banner",
      "Our Story",
      "Founder",
      "Life at Kaden Kopper",
      "Our Team",
    ],
  },

  // SERVICE
  {
    label: "Service",
    icon: Info,
    subItems: [
      "Service Banner",
      "Web Development",
      "App Development",
      "Seo",
      "Video Editor",
      "Graphic Design",
      "Digital Marketing",
    ],
  },

  // INDUSTRY
  {
    label: "Industry",
    icon: Info,
    subItems: [
      "Industry Banner",
      "Smart Healthcare",
      "Wedding & Events",
      "Manufacturing",
      "Travel & Hospitality",
      "Media & Entertainment",
      "Education & Learning",
      "Real Estate",
      "Retail & E-Commerce",
    ],
  },

  // PROJECTS
  {
    label: "Projects",
    icon: FolderKanban,
    subItems: [
      "Project",
    ],
  },

  // CAREER
  {
    label: "Career",
    icon: Info,
    subItems: [
      "Career Banner",
      "Job Opening",
    ],
  },

  // CONTACT
  {
    label: "Contact",
    icon: Phone,
  },

  // LEADS - EXPANDABLE WITH ONE SUBMENU
  {
    label: "Leads",
    icon: Users,
    subItems: [
      "Customer Leads",
    ],
  },

  // SEO - EXPANDABLE MENU
{
  label: "SEO",
  icon: Search,
  subItems: [
    "Add SEO",
  ],
},
];

// =====================================================
// SIDEBAR COMPONENT
// =====================================================

const Sidebar = ({ onSelect }) => {
  const [openMenu, setOpenMenu] = useState("Home");
  const [activeItem, setActiveItem] = useState("Home Slider");

  // ===================================================
  // MAIN MENU CLICK
  // ===================================================

  const handleToggle = (label, hasSubItems) => {
    if (hasSubItems) {
      setOpenMenu((previous) =>
        previous === label ? null : label
      );

      return;
    }

    setActiveItem(label);
    setOpenMenu(null);

    onSelect?.(label);
  };

  // ===================================================
  // SUBMENU CLICK
  // ===================================================

  const handleSubItemClick = (subItem, parentMenu) => {
    setActiveItem(subItem);
    setOpenMenu(parentMenu);

    // Send "Customer Leads" to App.jsx
    onSelect?.(subItem);
  };

  // ===================================================
  // LOGOUT
  // ===================================================

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) return;

    console.log("Logout clicked");

    // Add your existing authentication logout logic here.
  };

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <aside className="sidebar">

      {/* SIDEBAR TITLE */}

      <h1 className="sidebar-title">
        Admin Panel
      </h1>

      {/* NAVIGATION */}

      <nav className="sidebar-nav">

        {menuItems.map((item) => {
          const Icon = item.icon;

          const hasSubItems = Boolean(
            item.subItems?.length
          );

          const isOpen = openMenu === item.label;

          const isActive =
            activeItem === item.label ||
            (hasSubItems &&
              item.subItems.includes(activeItem));

          return (
            <div
              className="sidebar-item-wrapper"
              key={item.label}
            >

              {/* MAIN MENU */}

              <button
                type="button"
                className={`sidebar-item ${
                  isActive ? "active" : ""
                }`}
                onClick={() =>
                  handleToggle(
                    item.label,
                    hasSubItems
                  )
                }
                aria-expanded={
                  hasSubItems ? isOpen : undefined
                }
              >
                <span className="sidebar-item-left">

                  <Icon
                    size={18}
                    strokeWidth={2}
                  />

                  <span className="sidebar-label">
                    {item.label}
                  </span>

                </span>

                {hasSubItems && (
                  <ChevronRight
                    size={16}
                    className={`sidebar-chevron ${
                      isOpen ? "open" : ""
                    }`}
                  />
                )}
              </button>

              {/* SUBMENU */}

              {hasSubItems && isOpen && (
                <div className="sidebar-submenu">

                  {item.subItems.map((subItem) => {
                    const isSubActive =
                      activeItem === subItem;

                    return (
                      <button
                        type="button"
                        key={subItem}
                        className={`sidebar-subitem ${
                          isSubActive ? "active" : ""
                        }`}
                        onClick={() =>
                          handleSubItemClick(
                            subItem,
                            item.label
                          )
                        }
                      >
                        {subItem === "Customer Leads" && (
                          <Users
                            size={15}
                            strokeWidth={1.8}
                          />
                        )}

                        <span>{subItem}</span>
                      </button>
                    );
                  })}

                </div>
              )}

            </div>
          );
        })}

        {/* LOGOUT */}

        <button
          type="button"
          className="sidebar-item sidebar-logout"
          onClick={handleLogout}
        >
          <span className="sidebar-item-left">

            <LogOut
              size={18}
              strokeWidth={2}
            />

            <span className="sidebar-label">
              Logout
            </span>

          </span>
        </button>

      </nav>
    </aside>
  );
};

export default Sidebar;