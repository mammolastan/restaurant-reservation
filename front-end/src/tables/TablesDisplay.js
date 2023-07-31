import React from "react";
import { listTables } from "../utils/api";

function TablesDisplay({ table, index, tables, setTables }) {
  const tableStatus = table?.reservation_id
    ? `Occupied by reservation ${table.reservation_id}`
    : "Free";

  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

  const removeReservation = async () => {
    const userIsSure = window.confirm(
      "Is this table ready to seat new guests? This cannot be undone."
    );

    // If user is not sure, end function
    if (!userIsSure) {
      return null;
    }

    // Send API request to delete this reservation from this table
    await fetch(`${API_BASE_URL}/tables/${table.table_id}/seat`, {
      method: "DELETE",
    });

    const newTables = [...tables];
    newTables[index].reservation_id = null;

    setTables(newTables);

    const abortController = new AbortController();
    listTables(abortController.signal).then(setTables).catch();
  };

  return (
    <div
      key={`table-${table.table_id}`}
      className="reservation"
    >
      Name: {table.table_name}
      <br />
      Capacity: {table.capacity}
      <br />
      Status:
      <span data-table-id-status={table.table_id}> {tableStatus}</span>
      <br />
      {tableStatus.toLowerCase().includes("occupied") && (
        <button
          onClick={removeReservation}
          data-table-id-finish={table.table_id}
        >
          Finish
        </button>
      )}
    </div>
  );
}

export default TablesDisplay;
