import "./../ostylepages/Cashiers.css";
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  UserPlus,
  CreditCard,
  Banknote,
  Smartphone,
  CheckCircle,
} from "lucide-react";
import PageHeading from "../components/PageHeading";
import { customers } from "../data/sampleData";
import { API_BASE_URL } from "../config/api";

function Cashiers({ currentUser }) {
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [amountReceived, setAmountReceived] = useState("");
  const [saleComplete, setSaleComplete] = useState(false);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productError, setProductError] = useState("");
  const [saleError, setSaleError] = useState("");
  const [saleLoading, setSaleLoading] = useState(false);
  useEffect(() => {
    fetchProducts();
  }, []);
  async function fetchProducts() {
    try {
      setLoadingProducts(true);
      setProductError("");
      const response = await fetch(`${API_BASE_URL}/api/products`);
      if (!response.ok) {
        throw new Error("Failed to load products.");
      }
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to load products.");
      }
      const formattedProducts = data.products.map((product) => ({
        id: product.product_id,
        name: product.product_name,
        category: product.category,
        unit: product.unit,
        price: Number(product.selling_price),
        stock: Number(product.current_stock),
      }));
      setProducts(formattedProducts);
    } catch (error) {
      console.error("Error loading products:", error);
      setProductError("Unable to load products from the server.");
    } finally {
      setLoadingProducts(false);
    }
  }
  const filteredProducts = useMemo(() => {
    const searchText = search.trim().toLowerCase();
    if (!searchText) {
      return products;
    }
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchText)
    );
  }, [products, search]);
  const subtotal = cart.reduce((total, item) => {
    return total + Number(item.price) * Number(item.quantity || 0);
  }, 0);
  const total = subtotal;
  const received = Number(amountReceived || 0);
  const change = received - total;
function addToCart(product) {
  setCart((currentCart) => {
    const existingItem = currentCart.find(
      (item) => item.id === product.id
    );

    if (existingItem) {
      return currentCart;
    }

    return [
      ...currentCart,
      {
        ...product,
        quantity: 1,
      },
    ];
  });
}
function increaseQuantity(id) {
  setCart((currentCart) =>
    currentCart.map((item) => {
      if (item.id !== id) {
        return item;
      }

      if (Number(item.quantity) >= Number(item.stock)) {
        alert(
          `Only ${item.stock} ${item.unit} of ${item.name} are available.`
        );
        return item;
      }

      return {
        ...item,
        quantity: Number(item.quantity) + 1,
      };
    })
  );
}

function decreaseQuantity(id) {
  setCart((currentCart) =>
    currentCart
      .map((item) => {
        if (item.id !== id) {
          return item;
        }

        return {
          ...item,
          quantity: Number(item.quantity) - 1,
        };
      })
      .filter((item) => Number(item.quantity) > 0)
  );
}
  function handleQuantityChange(id, value) {
    if (value === "") {
      setCart(
        cart.map((item) => {
          if (item.id !== id) {
            return item;
          }
          return {
            ...item,
            quantity: "",
          };
        })
      );
      return;
    }
    let quantity = Number(value);
    if (!Number.isInteger(quantity)) {
      return;
    }
    if (quantity < 1) {
      quantity = 1;
    }
    setCart(
      cart.map((item) => {
        if (item.id !== id) {
          return item;
        }
        if (quantity > Number(item.stock)) {
          alert(
            `Only ${item.stock} ${item.unit} of ${item.name} are available.`
          );
          return {
            ...item,
            quantity: Number(item.stock),
          };
        }
        return {
          ...item,
          quantity,
        };
      })
    );
  }
  function handleQuantityBlur(id) {
    setCart(
      cart.map((item) => {
        if (item.id !== id) {
          return item;
        }
        if (item.quantity === "" || Number(item.quantity) < 1) {
          return {
            ...item,
            quantity: 1,
          };
        }
        return item;
      })
    );
  }
  function removeItem(id) {
    setCart(cart.filter((item) => item.id !== id));
  }
  function clearSale() {
    setCart([]);
    setSelectedCustomer("");
    setAmountReceived("");
    setPaymentMethod("Cash");
    setSaleComplete(false);
    setSaleError("");
  }
  async function completeSale() {
    if (saleLoading) return;

    setSaleError("");
    setSaleLoading(true);

    try {
      if (cart.length === 0) {
        setSaleError("Please add products to the cart.");
        return;
      }

      if (!currentUser?.cashier_id) {
        setSaleError("Cashier information is missing. Please log in again.");
        return;
      }

      const invalidQuantity = cart.some(
        (item) => !item.quantity || Number(item.quantity) < 1
      );

      if (invalidQuantity) {
        setSaleError("Please enter a valid quantity for every product.");
        return;
      }

      if (paymentMethod === "Cash" && received < total) {
        setSaleError("The amount received is not enough.");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/sales`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_id: selectedCustomer
            ? Number(selectedCustomer)
            : null,
          cashier_id: Number(currentUser.cashier_id),
          payment_method: paymentMethod,
          items: cart.map((item) => ({
            product_id: Number(item.id),
            quantity: Number(item.quantity),
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setSaleError(data.message || "Failed to complete sale.");
        return;
      }

      await fetchProducts();
      setSaleComplete(true);
    } catch (error) {
      console.error("Sale error:", error);
      setSaleError("Failed to complete sale.");
    } finally {
      setSaleLoading(false);
    }
  }
  function formatPrice(value) {
    return Number(value).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  return (
    <>
      <PageHeading
        eyebrow="POINT OF SALE"
        title="Cashier"
        description="Create customer orders and process sales."
      />
      <div className="cashier-layout">
        <section className="cashier-products panel">
          <div className="cashier-section-header">
            <div>
              <h3>Products</h3>
              <span>{filteredProducts.length} products available to add</span>
            </div>
            <div className="cashier-search">
              <Search size={16} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
              />
            </div>
          </div>
          <div className="product-grid">
            {loadingProducts && (
              <div className="empty-cart">
                <ShoppingCart size={40} />
                <strong>Loading products...</strong>
                <span>Please wait while products are loaded.</span>
              </div>
            )}
            {!loadingProducts && productError && (
              <div className="empty-cart">
                <ShoppingCart size={40} />
                <strong>Unable to load products</strong>
                <span>{productError}</span>
              </div>
            )}
            {!loadingProducts &&
              !productError &&
              filteredProducts.length === 0 && (
                <div className="empty-cart">
                  <Search size={40} />
                  <strong>No products found</strong>
                  <span>Try searching for another product.</span>
                </div>
              )}
            {!loadingProducts &&
              !productError &&
              filteredProducts.length > 0 &&
              filteredProducts.map((product) => (
                <button
                  type="button"
                  className="product-card"
                  key={product.id}
                  onClick={() => addToCart(product)}
                  disabled={product.stock <= 0}
                >
                  <div className="product-card-topline">
                    <div className="product-card-icon">
                      <ShoppingCart size={19} />
                    </div>
                    <span className="product-card-category">
                      {product.category || "Hardware"}
                    </span>
                  </div>
                  <div className="product-card-info">
                    <strong>{product.name}</strong>
                    <span>Ready for checkout</span>
                  </div>
                  <div className="product-card-bottom">
                    <div>
                      <small className="product-card-label">Selling price</small>
                      <strong>₱{formatPrice(product.price)}</strong>
                    </div>
                    <span
                      className={`product-stock ${
                        product.stock <= 5 ? "low" : ""
                      }`}
                    >
                      {product.stock} {product.unit} left
                    </span>
                  </div>
                  <span className="product-card-action">Add to order <Plus size={14} /></span>
                </button>
              ))}
          </div>
        </section>
        <section className="cashier-order panel">
          <div className="cashier-section-header">
            <div>
              <h3>Current Order</h3>
              <span>
                {cart.length} item{cart.length !== 1 ? "s" : ""} selected
              </span>
            </div>
            {cart.length > 0 && (
              <button
                type="button"
                className="clear-btn"
                onClick={clearSale}
              >
                Clear
              </button>
            )}
          </div>
          <div className="customer-selector">
            <label>Customer</label>
            <div className="customer-row">
              <select
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
              >
                <option value="">Walk-in Customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="icon-btn"
                title="Add customer"
                onClick={() =>
                  alert(
                    "Customer creation will be connected in a later step."
                  )
                }
              >
                <UserPlus size={17} />
              </button>
            </div>
          </div>
          <div className="cart-items">
            {cart.length === 0 && (
              <div className="empty-cart">
                <ShoppingCart size={40} />
                <strong>No products added</strong>
                <span>Select products from the left to start an order.</span>
              </div>
            )}
            {cart.length > 0 &&
              cart.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div className="cart-item-info">
                    <strong>{item.name}</strong>
                    <span>₱{formatPrice(item.price)} each</span>
                  </div>
                  <div className="quantity-controls">
                    <button
                      type="button"
                      onClick={() => decreaseQuantity(item.id)}
                      title="Decrease quantity"
                    >
                      <Minus size={13} />
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={item.stock}
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.id, e.target.value)
                      }
                      onBlur={() => handleQuantityBlur(item.id)}
                      aria-label={`Quantity for ${item.name}`}
                    />
                    <button
                      type="button"
                      onClick={() => increaseQuantity(item.id)}
                      title="Increase quantity"
                      disabled={
                        Number(item.quantity) >= Number(item.stock)
                      }
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                  <strong className="cart-item-total">
                    ₱
                    {formatPrice(
                      Number(item.price) * Number(item.quantity || 0)
                    )}
                  </strong>
                  <button
                    type="button"
                    className="delete-item"
                    onClick={() => removeItem(item.id)}
                    title="Remove item"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
          </div>
          <div className="payment-section">
            <div className="summary-row">
              <span>Subtotal</span>
              <strong>₱{formatPrice(subtotal)}</strong>
            </div>
            <div className="summary-row total-row">
              <span>Total</span>
              <strong>₱{formatPrice(total)}</strong>
            </div>
            <label>Payment Method</label>
            <div className="payment-methods">
              <button
                type="button"
                className={
                  paymentMethod === "Cash"
                    ? "payment-btn active"
                    : "payment-btn"
                }
                onClick={() => setPaymentMethod("Cash")}
              >
                <Banknote size={17} />
                Cash
              </button>
              <button
                type="button"
                className={
                  paymentMethod === "GCash"
                    ? "payment-btn active"
                    : "payment-btn"
                }
                onClick={() => setPaymentMethod("GCash")}
              >
                <Smartphone size={17} />
                GCash
              </button>
              <button
                type="button"
                className={
                  paymentMethod === "Card"
                    ? "payment-btn active"
                    : "payment-btn"
                }
                onClick={() => setPaymentMethod("Card")}
              >
                <CreditCard size={17} />
                Card
              </button>
            </div>
            {paymentMethod === "Cash" && (
              <>
                <label>Amount Received</label>
                <input
                  className="amount-input"
                  type="number"
                  min="0"
                  step="0.01"
                  value={amountReceived}
                  onChange={(e) => setAmountReceived(e.target.value)}
                  placeholder="₱ 0.00"
                />
                <div className="change-row">
                  <span>Change</span>
                  <strong className={change < 0 ? "negative" : ""}>
                    ₱
                    {Math.max(change, 0).toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </strong>
                </div>
              </>
            )}
            {saleError && (
              <div className="sale-error">
                {saleError}
              </div>
            )}
            <button
              type="button"
              className="complete-sale-btn"
              disabled={cart.length === 0 || saleLoading}
              onClick={completeSale}
            >
              <CheckCircle size={18} />
              {saleLoading ? "Processing Sale..." : "Complete Sale"}
            </button>
          </div>
        </section>
      </div>
      {saleComplete && (
        <div className="sale-success">
          <div className="success-icon">
            <CheckCircle size={32} />
          </div>
          <div>
            <strong>Sale completed successfully</strong>
            <span>Transaction and stock have been updated.</span>
          </div>
          <button type="button" onClick={clearSale}>
            New Sale
          </button>
        </div>
      )}
    </>
  );
}
export default Cashiers;