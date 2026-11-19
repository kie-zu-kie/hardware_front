import "./../astylecomp/Navbar.css";

import {
  Bell,
  ChevronDown,
  LogOut,
  Menu
} from "lucide-react";

function Navbar({ page, onMenuClick, onLogout }) {
  return (
    <header className="topbar">
      <button
        className="mobile-menu-btn"
        onClick={onMenuClick}
      >
        <Menu size={22} />
      </button>

      <div className="breadcrumb">
        <span>Workspace</span>
        <b>/</b>
        <strong>{page}</strong>
      </div>

      <div className="topbar-actions">
        <button className="notification-btn">
          <Bell size={19} />
          <i />
        </button>

        <div className="top-profile">
          <div className="profile-avatar">
            AD
          </div>

          <div>
            <b>Admin</b>
            <span>Store Manager</span>
          </div>

          <ChevronDown size={16} />
        </div>

        <button
          className="logout-btn"
          title="Sign out"
          onClick={onLogout}
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}

export default Navbar;