import { useEffect, useState } from "react";
import "./../ostylepages/Inventory.css";

import {
  Package,
  Plus,
  Search,
  AlertTriangle,
  Pencil,
  Trash2,
  X
} from "lucide-react";

import PageHeading from "../components/PageHeading";
import StatCard from "../components/StatCard";
import Table from "../components/Table";
import { API_BASE_URL } from "../config/api";

function Inventory({ currentUser }) {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [form, setForm] = useState({
    product_name: "",
    category: "",
    unit: "",
    selling_price: "",
    current_stock: "",
    reorder_level: "",
    supplier_id: ""
  });

  const isManager =
    currentUser?.position?.toLowerCase() === "store manager";

  // =========================
  // LOAD PRODUCTS
  // =========================

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/products`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load products"
        );
      }

      setProducts(data.products || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOAD SUPPLIERS
  // =========================

 const loadSuppliers = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/suppliers`
    );

    const data = await response.json();

    console.log("SUPPLIER API RESPONSE:", data);

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || "Failed to load suppliers"
      );
    }

    setSuppliers(data.suppliers || []);
  } catch (err) {
    console.error("SUPPLIER ERROR:", err);
    setError(err.message);
  }
  };

  useEffect(() => {
    loadProducts();
    loadSuppliers();
  }, []);

  // =========================
  // FORM
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const openAddModal = () => {

   console.log("SUPPLIERS IN MODAL:", suppliers);

    setEditingProduct(null);

    setForm({
      product_name: "",
      category: "",
      unit: "",
      selling_price: "",
      current_stock: "",
      reorder_level: "",
      supplier_id: ""
    });

    setMessage("");
    setError("");
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);

    setForm({
      product_name: product.product_name,
      category: product.category,
      unit: product.unit,
      selling_price: product.selling_price,
      current_stock: product.current_stock,
      reorder_level: product.reorder_level,
      supplier_id: product.supplier_id
    });

    setMessage("");
    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  // =========================
  // ADD / UPDATE
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!isManager) {
      setError("Only the Store Manager can modify products.");
      return;
    }

    const cashierID = currentUser?.cashier_id;

    if (!cashierID) {
      setError("Manager account information is missing.");
      return;
    }

    const productData = {
      product_name: form.product_name.trim(),
      category: form.category.trim(),
      unit: form.unit.trim(),
      selling_price: Number(form.selling_price),
      current_stock: Number(form.current_stock),
      reorder_level: Number(form.reorder_level),
      supplier_id: Number(form.supplier_id)
    };

    try {
      const url = editingProduct
        ? `${API_BASE_URL}/api/products/${editingProduct.product_id}`
        : `${API_BASE_URL}/api/products`;

      const method = editingProduct ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "X-Cashier-ID": String(cashierID)
        },
        body: JSON.stringify(productData)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            `Failed to ${
              editingProduct ? "update" : "add"
            } product`
        );
      }

      setMessage(data.message);

      closeModal();

      await loadProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  // =========================
  // DELETE
  // =========================

  const openDeleteModal = (product) => {
    if (!isManager) {
      setError("Only the Store Manager can delete products.");
      return;
    }

    setMessage("");
    setError("");
    setProductToDelete(product);
  };

  const closeDeleteModal = () => {
    if (!deleting) {
      setProductToDelete(null);
    }
  };

  const handleDelete = async () => {
    if (!productToDelete) {
      return;
    }

    setMessage("");
    setError("");
    setDeleting(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/products/${productToDelete.product_id}`,
        {
          method: "DELETE",
          headers: {
            "X-Cashier-ID": String(
              currentUser.cashier_id
            )
          }
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to delete product"
        );
      }

      setMessage(data.message);

      await loadProducts();
      setProductToDelete(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  // =========================
  // SEARCH
  // =========================

  const filteredProducts = products.filter((product) => {
    const searchText = search.toLowerCase();

    return (
      product.product_name
        .toLowerCase()
        .includes(searchText) ||
      product.category
        .toLowerCase()
        .includes(searchText) ||
      product.supplier_name
        ?.toLowerCase()
        .includes(searchText)
    );
  });

  // =========================
  // STATISTICS
  // =========================

  const totalStock = products.reduce(
    (total, product) =>
      total + Number(product.current_stock || 0),
    0
  );

  const lowStock = products.filter(
    (product) =>
      Number(product.current_stock) <=
      Number(product.reorder_level)
  ).length;

  const categories = [
    ...new Set(
      products.map(
        (product) => product.category
      )
    )
  ].length;

  return (
    <>
      <PageHeading
        eyebrow="INVENTORY"
        title="Inventory"
        description="Manage products, stock levels, pricing and suppliers."
        action={
          isManager ? (
            <button
              className="primary-btn"
              onClick={openAddModal}
            >
              <Plus size={17} />
              Add Product
            </button>
          ) : null
        }
      />

      {message && (
        <div className="status good">
          {message}
        </div>
      )}

      {error && (
        <div className="status danger">
          {error}
        </div>
      )}

      <div className="stats-grid">
        <StatCard
          icon={Package}
          label="Products"
          value={products.length}
          description="Registered products"
        />

        <StatCard
          icon={Package}
          label="Stock Units"
          value={totalStock}
          description="Total available stock"
        />

        <StatCard
          icon={AlertTriangle}
          label="Low Stock"
          value={lowStock}
          description="Requires restocking"
        />

        <StatCard
          icon={Package}
          label="Categories"
          value={categories}
          description="Product categories"
        />
      </div>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h3>Product Inventory</h3>

            <span>
              Complete hardware product list
            </span>
          </div>

          <div className="search-box">
            <Search size={15} />

            <input
              placeholder="Search products..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>
        </div>

        {loading ? (
          <p>Loading products...</p>
        ) : (
          <Table
            columns={[
              "Product",
              "Category",
              "Price",
              "Stock",
              "Supplier",
              "Status",
              ...(isManager ? ["Actions"] : [])
            ]}
            rows={filteredProducts}
            renderRow={(product) => {
              const low =
                Number(product.current_stock) <=
                Number(product.reorder_level);

              return (
                <tr key={product.product_id}>
                  <td>
                    <b>
                      {product.product_name}
                    </b>

                    <small>
                      Product #{product.product_id}
                    </small>
                  </td>

                  <td>
                    {product.category}
                  </td>

                  <td>
                    ₱
                    {Number(
                      product.selling_price
                    ).toLocaleString(
                      "en-PH",
                      {
                        minimumFractionDigits: 2
                      }
                    )}
                  </td>

                  <td>
                    <b>
                      {product.current_stock}
                    </b>{" "}
                    {product.unit}
                  </td>

                  <td>
                    {product.supplier_name ||
                      "No supplier"}
                  </td>

                  <td>
                    <span
                      className={
                        low
                          ? "status danger"
                          : "status good"
                      }
                    >
                      {low
                        ? "Low Stock"
                        : "In Stock"}
                    </span>
                  </td>

                  {isManager && (
                    <td>
                      <button
                        type="button"
                        onClick={() =>
                          openEditModal(product)
                        }
                        title="Edit product"
                      >
                        <Pencil size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          openDeleteModal(product)
                        }
                        title="Delete product"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  )}
                </tr>
              );
            }}
          />
        )}
      </section>

      {/* =========================
          ADD / EDIT MODAL
          ========================= */}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <div>
                <h3>
                  {editingProduct
                    ? "Edit Product"
                    : "Add Product"}
                </h3>

                <span>
                  {editingProduct
                    ? "Update product information"
                    : "Add a new hardware product"}
                </span>
              </div>

              <button
                type="button"
                onClick={closeModal}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>
                  Product Name
                </label>

                <input
                  name="product_name"
                  value={form.product_name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    Category
                  </label>

                  <input
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="e.g. Tools"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    Unit
                  </label>

                  <input
                    name="unit"
                    value={form.unit}
                    onChange={handleChange}
                    placeholder="e.g. pcs"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    Selling Price
                  </label>

                  <input
                    type="number"
                    name="selling_price"
                    value={form.selling_price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    Current Stock
                  </label>

                  <input
                    type="number"
                    name="current_stock"
                    value={form.current_stock}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    Reorder Level
                  </label>

                  <input
                    type="number"
                    name="reorder_level"
                    value={form.reorder_level}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    Supplier
                  </label>

                  <select
                    name="supplier_id"
                    value={form.supplier_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select supplier
                    </option>

                    {suppliers.map(
                      (supplier) => (
                        <option
                          key={
                            supplier.supplier_id
                          }
                          value={
                            supplier.supplier_id
                          }
                        >
                          {
                            supplier.supplier_name
                          }
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-btn"
                >
                  {editingProduct
                    ? "Save Changes"
                    : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {productToDelete && (
        <div
          className="modal-overlay inventory-delete-overlay"
          onClick={closeDeleteModal}
        >
          <div
            className="delete-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-product-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="delete-modal-icon">
              <Trash2 size={21} />
            </div>

            <div className="delete-modal-content">
              <h3 id="delete-product-title">Delete product?</h3>
              <p>
                You are about to remove{" "}
                <strong>{productToDelete.product_name}</strong> from your
                inventory. This action cannot be undone.
              </p>
            </div>

            <div className="delete-modal-actions">
              <button
                type="button"
                className="delete-cancel-button"
                onClick={closeDeleteModal}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="delete-confirm-button"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Inventory;