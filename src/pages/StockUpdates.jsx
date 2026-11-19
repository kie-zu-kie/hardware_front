import "./../ostylepages/StockUpdates.css";

import { useEffect, useState } from "react";
import {
  RefreshCw,
  ArrowDown,
  ArrowUp
} from "lucide-react";

import PageHeading from "../components/PageHeading";
import Table from "../components/Table";
import { API_BASE_URL } from "../config/api";

function StockUpdates() {
  const [stockUpdates, setStockUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStockUpdates();
  }, []);

  async function fetchStockUpdates() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/stock-updates`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load stock updates."
        );
      }

      setStockUpdates(data.stock_updates || []);
    } catch (error) {
      console.error("Error loading stock updates:", error);
      setError("Unable to load stock updates from the server.");
    } finally {
      setLoading(false);
    }
  }

  function formatDate(date) {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  return (
    <>
      <PageHeading
        eyebrow="INVENTORY"
        title="Stock Updates"
        description="Track stock-in and stock-out movements."
      />

      <section className="panel">
        <div className="panel-header">
          <div>
            <h3>Stock Movement History</h3>
            <span>
              Recent inventory changes
            </span>
          </div>

          <button
            type="button"
            onClick={fetchStockUpdates}
            disabled={loading}
            className="refresh-btn"
          >
            <RefreshCw
              size={16}
              className={loading ? "spinning" : ""}
            />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="empty-cart">
            <RefreshCw
              size={32}
              className="spinning"
            />
            <strong>
              Loading stock updates...
            </strong>
            <span>
              Getting data from PostgreSQL.
            </span>
          </div>
        ) : error ? (
          <div className="empty-cart">
            <strong>
              Unable to load stock updates
            </strong>
            <span>{error}</span>

            <button
              type="button"
              onClick={fetchStockUpdates}
            >
              Try Again
            </button>
          </div>
        ) : stockUpdates.length === 0 ? (
          <div className="empty-cart">
            <strong>
              No stock updates found
            </strong>
            <span>
              There are no stock movement records.
            </span>
          </div>
        ) : (
          <Table
            columns={[
              "Product",
              "Movement",
              "Quantity",
              "Date",
              "Supplier",
              "Status"
            ]}
            rows={stockUpdates}
            renderRow={(item) => (
              <tr key={item.stock_update_id}>
                <td>
                  <b>{item.product_name}</b>
                </td>

                <td>
                  <span
                    className={
                      item.update_type === "IN"
                        ? "status good"
                        : "status danger"
                    }
                  >
                    {item.update_type === "IN" ? (
                      <ArrowDown size={12} />
                    ) : (
                      <ArrowUp size={12} />
                    )}

                    {" "}
                    {item.update_type === "IN"
                      ? "Stock In"
                      : "Stock Out"}
                  </span>
                </td>

                <td>
                  <b>{item.quantity}</b>
                </td>

                <td>
                  {formatDate(item.update_date)}
                </td>

                <td>
                  {item.supplier_name || "-"}
                </td>

                <td>
                  <span className="status good">
                    Completed
                  </span>
                </td>
              </tr>
            )}
          />
        )}
      </section>
    </>
  );
}

export default StockUpdates;