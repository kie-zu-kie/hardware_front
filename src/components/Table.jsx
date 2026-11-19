import "./../astylecomp/Table.css";

function Table({
  columns = [],
  rows = [],
  renderRow
}) {
  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>
                {column}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.length > 0 ? (
            rows.map((row, index) =>
              renderRow
                ? renderRow(row, index)
                : (
                  <tr key={index}>
                    {Object.values(row).map(
                      (value, cellIndex) => (
                        <td key={cellIndex}>
                          {value}
                        </td>
                      )
                    )}
                  </tr>
                )
            )
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                style={{
                  textAlign: "center",
                  padding: "30px"
                }}
              >
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;