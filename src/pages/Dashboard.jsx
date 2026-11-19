import "./../ostylepages/Dashboard.css";

import {
  PhilippinePeso,
  Package,
  Boxes,
  AlertTriangle,
  TrendingUp,
  Wrench
} from "lucide-react";

import StatCard from "../components/StatCard";
import Table from "../components/Table";
import PageHeading from "../components/PageHeading";

import {
  products,
  sales
} from "../data/sampleData";

function money(value) {
  return `₱${Number(value).toLocaleString("en-PH", {
    minimumFractionDigits: 2
  })}`;
}

function Dashboard() {
  const totalStock = products.reduce(
    (total, product) => total + product.stock,
    0
  );

  const lowStock = products.filter(
    (product) => product.stock <= product.reorder
  );

  const totalSales = sales.reduce(
    (total, sale) => total + sale.total,
    0
  );

  return (
    <div>
      <PageHeading
        eyebrow="OVERVIEW"
        title="Good morning, Admin"
        description="Here's what's happening across your hardware store today."
      />

      <div className="stats-grid">
        <StatCard
          icon={PhilippinePeso}
          label="Total Sales"
          value={money(totalSales)}
          description={`${sales.length} recorded transactions`}
          trend="12.8%"
        />

        <StatCard
          icon={Package}
          label="Products"
          value={products.length}
          description="Across your inventory"
        />

        <StatCard
          icon={Boxes}
          label="Total Stock Units"
          value={totalStock}
          description="All inventory items"
        />

        <StatCard
          icon={AlertTriangle}
          label="Low Stock Items"
          value={lowStock.length}
          description="Needs your attention"
        />
      </div>

      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <h3>Recent Sales</h3>
              <span>Latest customer transactions</span>
            </div>

            <button className="text-btn">
              View All →
            </button>
          </div>

          <Table
            columns={[
              "Invoice",
              "Customer",
              "Cashier",
              "Total",
              "Payment"
            ]}
            rows={sales.slice(-5).reverse()}
            renderRow={(sale) => (
              <tr key={sale.id}>
                <td>
                  <b>
                    INV-
                    {String(sale.id).padStart(4, "0")}
                  </b>

                  <small>
                    {sale.date}
                  </small>
                </td>

                <td>
                  {sale.customer}
                </td>

                <td>
                  {sale.cashier}
                </td>

                <td>
                  <b>
                    {money(sale.total)}
                  </b>
                </td>

                <td>
                  <span className="pill">
                    {sale.payment}
                  </span>
                </td>
              </tr>
            )}
          />
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <h3>Inventory Alerts</h3>
              <span>Products requiring attention</span>
            </div>
          </div>

          {lowStock.length > 0 ? (
            lowStock.map((product) => (
              <div
                className="alert-item"
                key={product.id}
              >
                <div className="alert-icon">
                  <AlertTriangle size={17} />
                </div>

                <div className="alert-details">
                  <b>
                    {product.name}
                  </b>

                  <span>
                    {product.stock}{" "}
                    {product.unit} left
                    {" • "}
                    reorder at{" "}
                    {product.reorder}
                  </span>
                </div>

                <span className="status danger">
                  Reorder
                </span>
              </div>
            ))
          ) : (
            <div className="empty-state">
              All stock levels are healthy.
            </div>
          )}

          <div className="stock-health">
            <div>
              <span>
                Stock coverage
              </span>

              <b>
                92%
              </b>
            </div>

            <div className="progress">
              <span
                style={{
                  width: "92%"
                }}
              />
            </div>
          </div>
        </section>
      </div>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h3>
              Inventory by Category
            </h3>

            <span>
              Current stock distribution
            </span>
          </div>
        </div>

        <div className="category-grid">
          {[
            ...new Set(
              products.map(
                (product) =>
                  product.category
              )
            )
          ].map((category) => {
            const categoryProducts =
              products.filter(
                (product) =>
                  product.category ===
                  category
              );

            const categoryStock =
              categoryProducts.reduce(
                (total, product) =>
                  total + product.stock,
                0
              );

            return (
              <div
                className="category-card"
                key={category}
              >
                <div className="category-icon">
                  <Wrench size={18} />
                </div>

                <span>
                  {category}
                </span>

                <strong>
                  {categoryStock}
                </strong>

                <small>
                  {categoryProducts.length}{" "}
                  products
                </small>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;