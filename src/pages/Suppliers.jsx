import "./../ostylepages/Suppliers.css";

import { useEffect, useState } from "react";

import {
  Truck,
  Plus,
  X,
  Trash2
} from "lucide-react";

import PageHeading from "../components/PageHeading";
import StatCard from "../components/StatCard";
import Table from "../components/Table";
import { API_BASE_URL } from "../config/api";

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
const [saving, setSaving] = useState(false);

const [showDeleteModal, setShowDeleteModal] = useState(false);
const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
const [selectedSuppliers, setSelectedSuppliers] = useState([]);
const [deleting, setDeleting] = useState(false);

  const [formData, setFormData] = useState({
    supplier_name: "",
    contact_person: "",
    phone: "",
    address: "",
    email: ""
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  async function fetchSuppliers() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/suppliers`
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setSuppliers(data.suppliers);
      } else {
        setError(
          data.message || "Failed to load suppliers."
        );
      }
    } catch (error) {
      console.error("Supplier API error:", error);

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
      supplier_name: "",
      contact_person: "",
      phone: "",
      address: "",
      email: ""
    });

    setError("");
    setShowAddModal(true);
  }

  function closeAddModal() {
    if (!saving) {
      setShowAddModal(false);
    }
  }

  async function handleSaveSupplier(event) {
    event.preventDefault();

    setError("");

    if (
      !formData.supplier_name.trim() ||
      !formData.contact_person.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim() ||
      !formData.email.trim()
    ) {
      setError("Please fill in all supplier fields.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/suppliers`,
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
          supplier_name: "",
          contact_person: "",
          phone: "",
          address: "",
          email: ""
        });

        await fetchSuppliers();
      } else {
        setError(
          data.message || "Failed to add supplier."
        );
      }
    } catch (error) {
      console.error("Add supplier error:", error);

      setError(
        "Unable to connect to the server. Make sure your Go API is running."
      );
    } finally {
      setSaving(false);
    }
  }
function openDeleteModal() {
  if (suppliers.length === 0) {
    setError("There are no suppliers to delete.");
    return;
  }

  setSelectedSuppliers([]);
  setError("");
  setShowDeleteModal(true);
}

function closeDeleteModal() {
  if (!deleting) {
    setShowDeleteModal(false);
    setSelectedSuppliers([]);
  }
}

function toggleSupplierSelection(supplierId) {
  setSelectedSuppliers((previous) => {
    if (previous.includes(supplierId)) {
      return previous.filter(
        (id) => id !== supplierId
      );
    }

    return [...previous, supplierId];
  });
}

function handleDeleteNext() {
  if (selectedSuppliers.length === 0) {
    setError("Please select at least one supplier.");
    return;
  }

  setError("");
  setShowDeleteModal(false);
  setShowDeleteConfirm(true);
}

function cancelDeleteConfirmation() {
  if (!deleting) {
    setShowDeleteConfirm(false);
    setShowDeleteModal(true);
  }
}

async function confirmDeleteSuppliers() {
  setDeleting(true);
  setError("");

  try {
    for (const supplierId of selectedSuppliers) {
      const response = await fetch(
        `${API_BASE_URL}/api/suppliers/${supplierId}`,
        {
          method: "DELETE"
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to delete supplier."
        );
      }
    }

    setShowDeleteConfirm(false);
    setSelectedSuppliers([]);

    await fetchSuppliers();

  } catch (error) {
    console.error(
      "Delete supplier error:",
      error
    );

    setError(
      error.message ||
      "Unable to delete supplier."
    );

    setShowDeleteConfirm(false);

  } finally {
    setDeleting(false);
  }
}
  return (
    <>
      <PageHeading
  eyebrow="SUPPLIERS"
  title="Suppliers"
  description="Manage your hardware store suppliers and their information."
  action={
    <div className="supplier-page-actions">

      <button
  className="delete-supplier-btn"
  onClick={openDeleteModal}
>
  <Trash2 size={17} />
  Delete Supplier
</button>

      <button
        className="primary-btn"
        onClick={openAddModal}
      >
        <Plus size={17} />
        Add Supplier
      </button>

    </div>
  }
/>

      <div className="stats-grid">
        <StatCard
          icon={Truck}
          label="Total Suppliers"
          value={suppliers.length}
          description="Registered suppliers"
        />
      </div>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h3>Supplier Directory</h3>

            <span>
              Supplier information
            </span>
          </div>
        </div>

        {loading ? (
          <p>Loading suppliers...</p>
        ) : error && !showAddModal ? (
          <div className="login-error">
            {error}
          </div>
        ) : (
          <Table
            columns={[
              "Supplier",
              "Contact Person",
              "Phone",
              "Address",
              "Email"
            ]}
            rows={suppliers}
            renderRow={(supplier) => (
              <tr key={supplier.supplier_id}>
                <td>
                  <b>
                    {supplier.supplier_name}
                  </b>

                  <small>
                    Supplier #{supplier.supplier_id}
                  </small>
                </td>

                <td>
                  {supplier.contact_person}
                </td>

                <td>
                  {supplier.phone}
                </td>

                <td>
                  {supplier.address}
                </td>

                <td>
                  {supplier.email}
                </td>
              </tr>
            )}
          />
        )}
      </section>

      {/* ADD SUPPLIER MODAL */}

      {showAddModal && (
        <div className="supplier-modal-overlay">

          <div className="supplier-modal">

            <div className="supplier-modal-header">

              <div>
                <span className="eyebrow">
                  NEW SUPPLIER
                </span>

                <h2>
                  Add Supplier
                </h2>

                <p>
                  Enter the supplier's information below.
                </p>
              </div>

              <button
                type="button"
                className="supplier-close-btn"
                onClick={closeAddModal}
                disabled={saving}
              >
                <X size={20} />
              </button>

            </div>

            <form
              onSubmit={handleSaveSupplier}
            >

              {/* SUPPLIER NAME */}

              <div className="supplier-form-group">

                <label>
                  Supplier Name
                </label>

                <input
                  type="text"
                  name="supplier_name"
                  placeholder="Enter supplier name"
                  value={formData.supplier_name}
                  onChange={handleInputChange}
                  disabled={saving}
                />

              </div>

              {/* CONTACT PERSON */}

              <div className="supplier-form-group">

                <label>
                  Contact Person
                </label>

                <input
                  type="text"
                  name="contact_person"
                  placeholder="Enter contact person"
                  value={formData.contact_person}
                  onChange={handleInputChange}
                  disabled={saving}
                />

              </div>

              {/* PHONE */}

              <div className="supplier-form-group">

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

              <div className="supplier-form-group">

                <label>
                  Address
                </label>

                <input
                  type="text"
                  name="address"
                  placeholder="Enter supplier address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={saving}
                />

              </div>

              {/* EMAIL */}

              <div className="supplier-form-group">

                <label>
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter supplier email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={saving}
                />

              </div>

              {error && showAddModal && (
                <div className="login-error">
                  {error}
                </div>
              )}

              <div className="supplier-modal-actions">

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
                    : "Save Supplier"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}
      {/* DELETE SUPPLIER MODAL */}

{showDeleteModal && (
  <div className="supplier-modal-overlay">

    <div className="supplier-delete-modal">

      <div className="supplier-modal-header">

        <div>
          <span className="eyebrow">
            DELETE SUPPLIERS
          </span>

          <h2>
            Select Suppliers
          </h2>

          <p>
            Select one or more suppliers to delete.
          </p>
        </div>

        <button
          type="button"
          className="supplier-close-btn"
          onClick={closeDeleteModal}
        >
          <X size={20} />
        </button>

      </div>

      <div className="supplier-selection-list">

        {suppliers.map((supplier) => (
          <label
            key={supplier.supplier_id}
            className={`supplier-selection-item ${
              selectedSuppliers.includes(
                supplier.supplier_id
              )
                ? "selected"
                : ""
            }`}
          >

            <input
              type="checkbox"
              checked={selectedSuppliers.includes(
                supplier.supplier_id
              )}
              onChange={() =>
                toggleSupplierSelection(
                  supplier.supplier_id
                )
              }
            />

            <div className="supplier-selection-info">

              <strong>
                {supplier.supplier_name}
              </strong>

              <span>
                Supplier #{supplier.supplier_id}
              </span>

            </div>

          </label>
        ))}

      </div>

      <div className="selected-count">
        {selectedSuppliers.length} supplier
        {selectedSuppliers.length !== 1
          ? "s"
          : ""} selected
      </div>

      <div className="supplier-modal-actions">

        <button
          type="button"
          className="secondary-btn"
          onClick={closeDeleteModal}
        >
          Cancel
        </button>

        <button
          type="button"
          className="delete-supplier-btn"
          onClick={handleDeleteNext}
        >
          <Trash2 size={17} />
          OK
        </button>

      </div>

    </div>

  </div>
)}

 {/* DELETE CONFIRMATION MODAL */}

{showDeleteConfirm && (
  <div className="supplier-modal-overlay">

    <div className="supplier-confirm-modal">

      <div className="delete-confirm-icon">
        <Trash2 size={26} />
      </div>

      <span className="eyebrow">
        CONFIRM DELETE
      </span>

      <h2>
        Are you sure?
      </h2>

      <p>
        Are you sure you want to delete{" "}
        <strong>
          {selectedSuppliers.length}
        </strong>{" "}
        selected supplier
        {selectedSuppliers.length !== 1
          ? "s"
          : ""}?
      </p>

      <p className="delete-warning">
        This action cannot be undone.
      </p>

      <div className="supplier-modal-actions">

        <button
          type="button"
          className="secondary-btn"
          onClick={cancelDeleteConfirmation}
          disabled={deleting}
        >
          Cancel
        </button>

        <button
          type="button"
          className="delete-supplier-btn"
          onClick={confirmDeleteSuppliers}
          disabled={deleting}
        >
          <Trash2 size={17} />

          {deleting
            ? "Deleting..."
            : "Delete"}
        </button>

      </div>

    </div>

  </div>
)}
    </>
  );
}

export default Suppliers;