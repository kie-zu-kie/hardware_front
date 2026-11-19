import "./../ostylepages/SupplyMonitoring.css";

import {
  Activity,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

import PageHeading from "../components/PageHeading";
import StatCard from "../components/StatCard";
import Table from "../components/Table";

import {
  supplyMonitoring
} from "../data/sampleData";

function SupplyMonitoring() {
  const critical =
    supplyMonitoring.filter(
      (item) =>
        item.status === "Critical"
    ).length;

  const low =
    supplyMonitoring.filter(
      (item) =>
        item.status === "Low"
    ).length;

  return (
    <>
      <PageHeading
        eyebrow="MONITORING"
        title="Supply Monitoring"
        description="Monitor inventory levels and identify products that need replenishment."
      />

      <div className="stats-grid">
        <StatCard
          icon={Activity}
          label="Items Monitored"
          value={supplyMonitoring.length}
          description="Inventory monitoring"
        />

        <StatCard
          icon={AlertTriangle}
          label="Critical"
          value={critical}
          description="Immediate action needed"
        />

        <StatCard
          icon={AlertTriangle}
          label="Low Stock"
          value={low}
          description="Consider reordering"
        />

        <StatCard
          icon={CheckCircle}
          label="Healthy"
          value={
            supplyMonitoring.length -
            critical -
            low
          }
          description="Stock levels healthy"
        />
      </div>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h3>Supply Status</h3>
            <span>
              Current stock monitoring
            </span>
          </div>
        </div>

        <Table
          columns={[
            "Product",
            "Current Stock",
            "Reorder Level",
            "Supplier",
            "Status"
          ]}
          rows={supplyMonitoring}
          renderRow={(item) => (
            <tr key={item.id}>
              <td>
                <b>{item.product}</b>
              </td>

              <td>
                <b>{item.stock}</b>
              </td>

              <td>
                {item.reorder}
              </td>

              <td>
                {item.supplier}
              </td>

              <td>
                <span
                  className={
                    item.status ===
                    "Good"
                      ? "status good"
                      : "status danger"
                  }
                >
                  {item.status}
                </span>
              </td>
            </tr>
          )}
        />
      </section>
    </>
  );
}

export default SupplyMonitoring;