import "./../astylecomp/Login.css";

import { useState } from "react";
import { API_BASE_URL } from "../config/api";
import {
  Wrench,
  Package,
  ShoppingCart,
  ShieldCheck,
  CircleUserRound,
  LockKeyhole
} from "lucide-react";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [cashier, setCashier] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (!username.trim() || !password) {
      setError("Please enter your username and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Your current Go API returns the user as "cashier"
        setCashier(data.cashier);
        setShowModal(true);
      } else {
        setError(data.message || "Invalid username or password.");
      }
    } catch (error) {
      console.error("Login error:", error);

      setError(
        "Unable to connect to the server. Make sure the Go API is running."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleContinue() {
    setShowModal(false);

    // Send the logged-in cashier information to App.jsx
    onLogin(cashier);
  }

  return (
    <div className="login-page">
      <div className="login-brand-panel">
        <div className="brand-mark">
          <Wrench size={30} />
        </div>

        <span className="eyebrow">HARDWARE NI BAI</span>

        <h1>
          Everything your hardware store needs, in one workspace.
        </h1>

        <p>
          Manage inventory, sales, customers, suppliers and stock
          monitoring from one professional dashboard.
        </p>

        <div className="login-features">
          <div>
            <Package size={20} />
            <strong>Inventory</strong>
            <span>Track every product.</span>
          </div>

          <div>
            <ShoppingCart size={20} />
            <strong>Sales</strong>
            <span>Record transactions.</span>
          </div>

          <div>
            <ShieldCheck size={20} />
            <strong>Secure</strong>
            <span>Staff-ready access.</span>
          </div>
        </div>
      </div>

      <div className="login-form-area">
        <form className="login-card" onSubmit={handleSubmit}>
          <div className="mobile-logo">
            <Wrench size={22} />
          </div>

          <span className="eyebrow">WELCOME BACK</span>

          <h2>Sign in to your account</h2>

          <p className="muted">
            Enter your account details to continue.
          </p>

          <label>Username</label>

          <div className="input-with-icon">
            <CircleUserRound size={18} />

            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(event) => {
                setUsername(event.target.value);
                setError("");
              }}
              disabled={loading}
            />
          </div>

          <label>Password</label>

          <div className="input-with-icon">
            <LockKeyhole size={18} />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
              }}
              disabled={loading}
            />

            <button
              type="button"
              className="show-password"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <div className="login-options">
            <label className="remember">
              <input type="checkbox" />
              Remember me
            </label>

            <button type="button" className="forgot">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="primary-btn login-btn"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
            <span>→</span>
          </button>
        </form>
      </div>

      {showModal && cashier && (
        <div className="modal-overlay">
          <div className="success-modal">
            <div className="success-icon">
              ✓
            </div>

            <span className="eyebrow">LOGIN SUCCESSFUL</span>

            <h2>
              Hello {cashier.position}
            </h2>

            <p>
              Welcome back, {cashier.position}! You have successfully signed in.
            </p>

            <button
              className="primary-btn continue-btn"
              onClick={handleContinue}
            >
              Continue
              <span>→</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default Login;