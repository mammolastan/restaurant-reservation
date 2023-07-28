import React from "react";

function TablesDisplay({ table }) {
  const tableStatus = table.reservation_id
    ? `Occupied by reservation ${table.reservation_id}`
    : "Free";

  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

  const removeReservation = async () => {
    const userIsSure = window.confirm("Press a button!");

    if (!userIsSure) {
      return null;
    }
    await fetch(`${API_BASE_URL}/tables/${table.table_id}/seat`, {
      method: "DELETE",
    });
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
      <span data-table-id-status={tableStatus}> {tableStatus}</span>
      <br />
      {/* What is a good approach to making a conditional statement here. I want to Say:
      IF tableStatus.includes(occupied) THEN show the button */}
      <button
        onClick={removeReservation}
        data-table-id-finish={table.table_id}
      >
        Finish
      </button>
    </div>
  );
}

export default TablesDisplay;
