import "./../ostylepages/Customers.css";

import { useEffect, useState } from "react";

import {
  Users,
  UserPlus,
  X,
  Trash2
} from "lucide-react";

import PageHeading from "../components/PageHeading";
import StatCard from "../components/StatCard";
import Table from "../components/Table";
import { API_BASE_URL } from "../config/api";

function Customers() {
  const [customers, setCustomers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    customer_name: "",
    phone: "",
    address: "",
    customer_type: ""
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/customers`
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setCustomers(data.customers);
      } else {
        setError(
          data.message || "Failed to load customers."
        );
      }
    } catch (error) {
      console.error("Customer API error:", error);

      setError(
        "Unable to connect to the server. Make sure your Go API is running."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleInputChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  }

  function openAddModal() {
    setFormData({
      customer_name: "",
      phone: "",
      address: "",
      customer_type: ""
    });

    setError("");
    setShowAddModal(true);
  }

  function closeAddModal() {
    if (!saving) {
      setShowAddModal(false);
    }

  }

  async function handleSaveCustomer(event) {
    event.preventDefault();

    setError("");

    if (
      !formData.customer_name.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim() ||
      !formData.customer_type.trim()
    ) {
      setError("Please fill in all customer fields.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/customers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setShowAddModal(false);

        setFormData({
          customer_name: "",
          phone: "",
          address: "",
          customer_type: ""
        });

        await fetchCustomers();
      } else {
        setError(
          data.message || "Failed to add customer."
        );
      }
    } catch (error) {
      console.error("Add customer error:", error);

      setError(
        "Unable to connect to the server. Make sure your Go API is running."
      );
    } finally {
      setSaving(false);
    }
  }
async function handleDeleteCustomer(customer) {
  const confirmed = window.confirm(
  `Are you sure you want to delete ${customer.customer_name}?`
  );

  if (!confirmed) {
  return;
  }

  try {
    setError("");

    const response = await fetch(
    `${API_BASE_URL}/api/customers/${customer.customer_id}`,
    {
      method: "DELETE"
    }
    );

    const data = await response.json();

    if (response.ok && data.success) {
      await fetchCustomers();
    } else {
      setError(
        data.message || "Failed to delete customer."
      );
    }
  } catch (error) {
    console.error("Delete customer error:", error);

    setError(
      "Unable to connect to the server. Make sure your Go API is running."
    );
  }
  }

  return (
    <>
      <PageHeading
        eyebrow="CUSTOMERS"
        title="Customers"
        description="Manage your hardware store customers and their information."
        action={
          <button
            className="primary-btn"
            onClick={openAddModal}
          >
            <UserPlus size={17} />
            Add Customer
          </button>
        }
      />

      <div className="stats-grid">
        <StatCard
          icon={Users}
          label="Total Customers"
          value={customers.length}
          description="Registered customers"
        />
      </div>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h3>Customer Directory</h3>
            <span>
              Customer information
            </span>
          </div>
        </div>

        {loading ? (
          <p>Loading customers...</p>
        ) : error && !showAddModal ? (
          <div className="login-error">
            {error}
          </div>
        ) : (
          <Table
            columns={[
              "Customer",
              "Phone",
              "Address",
              "Type",
              "Action"
            ]}
            rows={customers}
            renderRow={(customer) => (
              <tr key={customer.customer_id}>
                <td>
                  <b>{customer.customer_name}</b>
                  <small>
                    Customer #{customer.customer_id}
                  </small>
                </td>

                <td>
                  {customer.phone}
                </td>

                <td>
                  {customer.address}
                </td>

                <td>
                  {customer.customer_type}
                </td>

                <td>
                  <button className="delete-customer-btn" 
                  onClick={() => handleDeleteCustomer(customer)}
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </td>
              </tr>
            )}
          />
        )}
      </section>

      {/* ADD CUSTOMER MODAL */}
      {showAddModal && (
        <div className="customer-modal-overlay">

          <div className="customer-modal">

            <div className="customer-modal-header">
              <div>
                <span className="eyebrow">
                  NEW CUSTOMER
                </span>

                <h2>Add Customer</h2>

                <p>
                  Enter the customer's information below.
                </p>
              </div>

              <button
                type="button"
                className="customer-close-btn"
                onClick={closeAddModal}
                disabled={saving}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveCustomer}>

              {/* CUSTOMER NAME */}
              <div className="customer-form-group">
                <label>
                  Customer Name
                </label>

                <input
                  type="text"
                  name="customer_name"
                  placeholder="Enter customer name"
                  value={formData.customer_name}
                  onChange={handleInputChange}
                  disabled={saving}
                />
              </div>

              {/* PHONE */}
              <div className="customer-form-group">
                <label>
                  Phone
                </label>

                <input
                  type="text"
                  name="phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={saving}
                />
              </div>

              {/* ADDRESS */}
              <div className="customer-form-group">
                <label>
                  Address
                </label>

                <input
                  type="text"
                  name="address"
                  placeholder="Enter customer address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={saving}
                />
              </div>

              {/* CUSTOMER TYPE */}
              <div className="customer-form-group">
                <label>
                  Customer Type
                </label>

                <select
                  name="customer_type"
                  value={formData.customer_type}
                  onChange={handleInputChange}
                  disabled={saving}
                >
                  <option value="">
                    Select customer type
                  </option>

                  <option value="Regular">
                    Regular
                  </option>

                  <option value="Wholesale">
                    Wholesale
                  </option>

                  <option value="Contractor">
                    Contractor
                  </option>
                </select>
              </div>

              {error && showAddModal && (
                <div className="login-error">
                  {error}
                </div>
              )}


              <div className="customer-modal-actions">

                <button
                  type="button"
                  className="secondary-btn"
                  onClick={closeAddModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : "Save Customer"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}
    </>
  );
}

export default Customers;