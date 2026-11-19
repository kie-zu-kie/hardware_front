import "./../astylecomp/Sidebar.css";

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  UserRound,
  Truck,
  ArrowDownToLine,
  ClipboardList,
  Settings,
  LogOut,
  Menu,
  X
} from "lucide-react";

function Sidebar({
  page,
  setPage,
  collapsed,
  setCollapsed,
  mobileMenu,
  setMobileMenu,
  onLogout
}) {
  const navItems = [
    ["Dashboard", LayoutDashboard],
    ["Inventory", Package],
    ["Sales", ShoppingCart],
    ["Customers", Users],
    ["Cashiers", UserRound],
    ["Suppliers", Truck],
    ["Stock Updates", ArrowDownToLine],
    ["Supply Monitoring", ClipboardList]
  ];

  const handleNavigation = (name) => {
    setPage(name);
    setMobileMenu(false);
  };

  return (
    <>
      {mobileMenu && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileMenu(false)}
        />
      )}

      <aside
        className={`sidebar ${
          collapsed ? "sidebar-collapsed" : ""
        } ${mobileMenu ? "sidebar-mobile-open" : ""}`}
      >
        <div className="sidebar-header">
          <div className="brand">
            <div className="brand-icon">
              <Package size={22} />
            </div>

            {!collapsed && (
              <div className="brand-text">
                <strong>HARDWARE NI BAI</strong>
                <span>HARDWARE AND CONSTRUCTION SUPPLY</span>
              </div>
            )}
          </div>

          <button
            className="sidebar-close"
            onClick={() => setMobileMenu(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-menu-title">
          {!collapsed && "MAIN MENU"}
        </div>

        <nav className="sidebar-nav">
          {navItems.map(([name, Icon]) => (
            <button
              key={name}
              className={`nav-item ${
                page === name ? "nav-active" : ""
              }`}
              onClick={() => handleNavigation(name)}
              title={collapsed ? name : ""}
            >
              <Icon size={20} />

              {!collapsed && <span>{name}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button
            className="nav-item"
            onClick={() => handleNavigation("Settings")}
            title={collapsed ? "Settings" : ""}
          >
            <Settings size={20} />

            {!collapsed && <span>Settings</span>}
          </button>

          <div className="administrator">
            <div className="admin-avatar">
              AD
            </div>

            {!collapsed && (
              <div className="admin-info">
                <strong>Administrator</strong>
                <span>Store Manager</span>
              </div>
            )}

            {!collapsed && (
              <button
                className="logout-button"
                onClick={onLogout}
                title="Log out"
              >
                <LogOut size={18} />
              </button>
            )}
          </div>
        </div>

        <button
          className="sidebar-collapse"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Menu size={20} />
        </button>
      </aside>
    </>
  );
}

export default Sidebar;