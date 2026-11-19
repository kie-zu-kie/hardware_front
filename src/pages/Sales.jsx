import { useEffect, useMemo, useState } from "react";
import "./../ostylepages/Sales.css";

import {
  ShoppingCart,
  PhilippinePeso,
  Eye,
  X,
  RefreshCw,
} from "lucide-react";

import PageHeading from "../components/PageHeading";
import StatCard from "../components/StatCard";
import Table from "../components/Table";
import { API_BASE_URL } from "../config/api";

const API_URL = `${API_BASE_URL}/api`;

function Sales() {
  // =========================
  // SALES DATA
  // =========================
  const [sales, setSales] = useState([]);

  // =========================
  // STATES
  // =========================
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =========================
  // SALE DETAILS
  // =========================
  const [selectedSale, setSelectedSale] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // =========================
  // FETCH SALES
  // =========================
  const fetchSales = async () => {
    try {
      const response = await fetch(`${API_URL}/sales`);

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load sales."
        );
      }

      setSales(data.sales || []);
    } catch (error) {
      console.error("Sales API error:", error);

      setSales([]);

      setError(
        error.message || "Unable to load sales."
      );
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");

      await fetchSales();

      setLoading(false);
    };

    loadData();
  }, []);

  // =========================
  // REFRESH SALES
  // =========================
  const refreshData = async () => {
    setRefreshing(true);
    setError("");
    setMessage("");

    try {
      await fetchSales();

      setMessage(
        "Sales data refreshed successfully."
      );
    } catch (error) {
      console.error("Refresh error:", error);

      setError(
        "Unable to refresh sales data."
      );
    } finally {
      setRefreshing(false);
    }
  };

  // =========================
  // RECORDED REVENUE
  // =========================
  const recordedRevenue = useMemo(() => {
    return sales.reduce(
      (total, sale) =>
        total +
        Number(
          sale.total_amount ??
            sale.total ??
            0
        ),
      0
    );
  }, [sales]);

  // =========================
  // GET SALE DETAILS
  // =========================
  const viewSaleDetails = async (saleId) => {
    setError("");
    setSelectedSale(null);
    setLoadingDetails(true);

    try {
      const response = await fetch(
        `${API_URL}/sales/${saleId}`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to load sale details."
        );
      }

      setSelectedSale(data.sale);
    } catch (error) {
      console.error(
        "Sale details error:",
        error
      );

      setError(
        error.message ||
          "Unable to load sale details."
      );
    } finally {
      setLoadingDetails(false);
    }
  };

  // =========================
  // FORMAT DATE
  // =========================
  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    const parsedDate = new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return date;
    }

    return parsedDate.toLocaleString();
  };

  // =========================
  // LOADING SCREEN
  // =========================
  if (loading) {
    return (
      <>
        <PageHeading
          eyebrow="SALES"
          title="Sales"
          description="View completed sales and customer transactions."
        />

        <section className="panel sales-loading">
          <div className="sales-loading-icon">
            <RefreshCw size={20} className="spin" />
          </div>
          <strong>Loading sales activity</strong>
          <p>Fetching the latest transactions for your store.</p>
        </section>
      </>
    );
  }

  // =========================
  // MAIN UI
  // =========================
  return (
    <>
      <PageHeading
        eyebrow="SALES"
        title="Sales"
        description="View completed sales and customer transactions."
        action={
          <button
            type="button"
            className="sales-refresh-button"
            onClick={refreshData}
            disabled={refreshing}
          >
            <RefreshCw size={16} className={refreshing ? "spin" : ""} />
            {refreshing ? "Refreshing..." : "Refresh data"}
          </button>
        }
      />

      {/* =========================
          STAT CARDS
      ========================== */}
      <div className="stats-grid">
        <StatCard
          icon={ShoppingCart}
          label="Transactions"
          value={sales.length}
          description="Recorded sales"
        />

        <StatCard
          icon={PhilippinePeso}
          label="Sales Revenue"
          value={`₱${recordedRevenue.toLocaleString(
            undefined,
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          )}`}
          description="Total recorded revenue"
        />
      </div>

      {/* =========================
          SUCCESS MESSAGE
      ========================== */}
      {message && (
        <div className="sales-alert sales-alert-success" role="status">
          <span className="sales-alert-dot" />
          {message}
        </div>
      )}

      {/* =========================
          ERROR MESSAGE
      ========================== */}
      {error && (
        <div className="sales-alert sales-alert-error" role="alert">
          <span className="sales-alert-dot" />
          {error}
        </div>
      )}

      {/* =========================
          SALES TRANSACTIONS
      ========================== */}
      <section className="panel">
        <div className="panel-header sales-panel-header">
          <div>
            <div className="sales-panel-title-row">
              <h3>Sales transactions</h3>
              <span className="sales-count">{sales.length} records</span>
            </div>
            <span>Customer purchase history and payment records</span>
          </div>

          <button
            type="button"
            className="sales-inline-refresh"
            onClick={refreshData}
            disabled={refreshing}
            aria-label="Refresh sales transactions"
          >
            <RefreshCw size={15} className={refreshing ? "spin" : ""} />
            <span>{refreshing ? "Updating" : "Refresh"}</span>
          </button>
        </div>

        {/* =========================
            SALES TABLE
        ========================== */}
        {sales.length === 0 ? (
          <div className="sales-empty-state">
            <div className="sales-empty-icon"><ShoppingCart size={22} /></div>
            <strong>No recorded sales yet</strong>
            <p>Completed transactions will appear here once they are recorded.</p>
          </div>
        ) : (
          <Table
            columns={[
              "Invoice",
              "Date",
              "Customer",
              "Cashier",
              "Total",
              "Payment",
              "Action",
            ]}
            rows={sales}
            renderRow={(sale) => (
              <tr
                key={
                  sale.sale_id ??
                  sale.id
                }
              >
                {/* INVOICE */}
                <td>
                  <span className="invoice-number">
                    INV-{String(sale.sale_id ?? sale.id).padStart(4, "0")}
                  </span>
                </td>

                {/* DATE */}
                <td>
                  {formatDate(
                    sale.sale_date ??
                      sale.date
                  )}
                </td>

                {/* CUSTOMER */}
                <td>
                  {sale.customer_name ??
                    sale.customer ??
                    "Walk-in Customer"}
                </td>

                {/* CASHIER */}
                <td>
                  {sale.cashier_name ??
                    sale.cashier ??
                    "-"}
                </td>

                {/* TOTAL */}
                <td>
                  <span className="sale-total">
                    ₱{Number(sale.total_amount ?? sale.total ?? 0).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </td>

                {/* PAYMENT */}
                <td>
                  <span className="pill">
                    {sale.payment_method ??
                      sale.payment ??
                      "-"}
                  </span>
                </td>

                {/* VIEW */}
                <td>
                  <button
                    type="button"
                    className="sales-view-button"
                    onClick={() => viewSaleDetails(sale.sale_id ?? sale.id)}
                  >
                    <Eye size={15} />
                    <span>View details</span>
                  </button>
                </td>
              </tr>
            )}
          />
        )}
      </section>

      {/* =========================
          SALE DETAILS MODAL
      ========================== */}
      {selectedSale && (
        <div
          className="sales-modal-overlay"
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0, 0, 0, 0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
          onClick={() =>
            setSelectedSale(null)
          }
        >
          <div
            className="sales-details-modal"
            style={{
              background: "#ffffff",
              width:
                "min(700px, 100%)",
              maxHeight: "90vh",
              overflowY: "auto",
              borderRadius: "12px",
              padding: "24px",
              boxShadow:
                "0 20px 50px rgba(0,0,0,0.25)",
            }}
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            {/* MODAL HEADER */}
            <div
              className="sales-details-header"
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: "700",
                    opacity: 0.6,
                    letterSpacing:
                      "1px",
                  }}
                >
                  SALES DETAILS
                </span>

                <h2
                  style={{
                    margin:
                      "5px 0 0",
                  }}
                >
                  INV-
                  {String(
                    selectedSale.sale_id
                  ).padStart(
                    4,
                    "0"
                  )}
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedSale(
                    null
                  )
                }
                style={{
                  width: "36px",
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent:
                    "center",
                  border: "none",
                  borderRadius: "50%",
                  cursor:
                    "pointer",
                  background:
                    "#f1f1f1",
                }}
              >
                <X size={19} />
              </button>
            </div>

            {/* SALE INFORMATION */}
            <div
              className="sales-details-summary"
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(2, 1fr)",
                gap: "14px",
                marginBottom:
                  "22px",
                padding: "16px",
                background:
                  "#f7f7f7",
                borderRadius:
                  "8px",
              }}
            >
              <div>
                <small>
                  Date
                </small>

                <strong
                  style={{
                    display: "block",
                    marginTop:
                      "4px",
                  }}
                >
                  {formatDate(
                    selectedSale.sale_date
                  )}
                </strong>
              </div>

              <div>
                <small>
                  Customer
                </small>

                <strong
                  style={{
                    display: "block",
                    marginTop:
                      "4px",
                  }}
                >
                  {selectedSale.customer_name ||
                    "Walk-in Customer"}
                </strong>
              </div>

              <div>
                <small>
                  Cashier
                </small>

                <strong
                  style={{
                    display: "block",
                    marginTop:
                      "4px",
                  }}
                >
                  {selectedSale.cashier_name ||
                    "-"}
                </strong>
              </div>

              <div>
                <small>
                  Payment
                </small>

                <strong
                  style={{
                    display: "block",
                    marginTop:
                      "4px",
                  }}
                >
                  {selectedSale.payment_method ||
                    "-"}
                </strong>
              </div>
            </div>

            {/* ITEMS */}
            <h3
              style={{
                marginBottom:
                  "12px",
              }}
            >
              Products
            </h3>

            <div
              className="sales-details-items"
              style={{
                display: "flex",
                flexDirection:
                  "column",
                gap: "8px",
              }}
            >
              {(
                selectedSale.items ||
                []
              ).map((item) => (
                <div
                  className="sales-detail-item"
                  key={
                    item.sale_item_id
                  }
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "1fr auto auto",
                    gap: "15px",
                    alignItems:
                      "center",
                    padding: "12px",
                    border:
                      "1px solid #e5e5e5",
                    borderRadius:
                      "8px",
                  }}
                >
                  {/* PRODUCT */}
                  <div>
                    <strong>
                      {
                        item.product_name
                      }
                    </strong>

                    <div
                      className="sales-details-total"
                      style={{
                        fontSize:
                          "13px",
                        opacity: 0.7,
                        marginTop:
                          "3px",
                      }}
                    >
                      {
                        item.quantity
                      }{" "}
                      × ₱
                      {Number(
                        item.unit_price
                      ).toLocaleString(
                        undefined,
                        {
                          minimumFractionDigits:
                            2,
                          maximumFractionDigits:
                            2,
                        }
                      )}
                    </div>
                  </div>

                  {/* QUANTITY */}
                  <span>
                    Qty:{" "}
                    <b>
                      {
                        item.quantity
                      }
                    </b>
                  </span>

                  {/* SUBTOTAL */}
                  <strong>
                    ₱
                    {Number(
                      item.subtotal
                    ).toLocaleString(
                      undefined,
                      {
                        minimumFractionDigits:
                          2,
                        maximumFractionDigits:
                          2,
                      }
                    )}
                  </strong>
                </div>
              ))}
            </div>

            {/* TOTAL */}
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                marginTop: "20px",
                paddingTop: "18px",
                borderTop:
                  "2px solid #e5e5e5",
              }}
            >
              <strong
                style={{
                  fontSize: "18px",
                }}
              >
                Total
              </strong>

              <strong
                style={{
                  fontSize: "24px",
                }}
              >
                ₱
                {Number(
                  selectedSale.total_amount ||
                    0
                ).toLocaleString(
                  undefined,
                  {
                    minimumFractionDigits:
                      2,
                    maximumFractionDigits:
                      2,
                  }
                )}
              </strong>
            </div>
          </div>
        </div>
      )}

      {/* =========================
          LOADING SALE DETAILS
      ========================== */}
      {loadingDetails && (
        <div
          className="sales-modal-overlay sales-details-loading"
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent:
              "center",
            zIndex: 10000,
          }}
        >
          <div
            className="sales-loading-card"
            style={{
              background:
                "#ffffff",
              padding:
                "25px 35px",
              borderRadius:
                "10px",
              fontWeight:
                "600",
            }}
          >
            Loading sale
            details...
          </div>
        </div>
      )}
    </>
  );
}

export default Sales;