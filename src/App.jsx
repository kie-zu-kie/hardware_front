import { useState } from "react";

import Login from "./components/Login";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Sales from "./pages/Sales";
import Customers from "./pages/Customers";
import Cashiers from "./pages/Cashiers";
import Suppliers from "./pages/Suppliers";
import StockUpdates from "./pages/StockUpdates";
import SupplyMonitoring from "./pages/SupplyMonitoring";

import "./App.css";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  // Store the currently logged-in cashier
  const [currentUser, setCurrentUser] = useState(null);

  const [page, setPage] = useState("Dashboard");

  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  // Login
  const handleLogin = (cashier) => {
    setCurrentUser(cashier);
    setLoggedIn(true);
    setPage("Dashboard");
  };

  // Logout
  const handleLogout = () => {
    setLoggedIn(false);
    setCurrentUser(null);
    setPage("Dashboard");
    setMobileMenu(false);
  };

  // Show Login page when not logged in
  if (!loggedIn) {
    return (
      <Login
        onLogin={handleLogin}
      />
    );
  }

  const pages = {
    Dashboard: <Dashboard />,
    Inventory: <Inventory currentUser={currentUser} />,
    Sales: <Sales />,
    Customers: <Customers />,
    Cashiers: <Cashiers currentUser={currentUser} />,
    Suppliers: <Suppliers />,
    "Stock Updates": <StockUpdates />,
    "Supply Monitoring": <SupplyMonitoring />
  };

  return (
    <div className="app-shell">

      <Sidebar
        page={page}
        setPage={setPage}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileMenu={mobileMenu}
        setMobileMenu={setMobileMenu}
        onLogout={handleLogout}
      />

      <main
        className={`main-content ${
          collapsed ? "main-collapsed" : ""
        }`}
      >

        <Navbar
          page={page}
          onMenuClick={() => setMobileMenu(true)}
          onLogout={handleLogout}
          currentUser={currentUser}
        />

        <div className="page-content">
          {pages[page]}
        </div>

      </main>

    </div>
  );
}

export default App;