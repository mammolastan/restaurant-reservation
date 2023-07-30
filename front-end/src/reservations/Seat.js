import React, { useEffect, useState } from "react";
import {
  useParams,
  useHistory,
} from "react-router-dom/cjs/react-router-dom.min";
import { listTables } from "../utils/api";

function Seat() {
  // Reservation ID passed in query parameters
  const { reservation_id } = useParams();
  const history = useHistory();
  const [tables, setTables] = useState(null);
  const [reservation, setReservation] = useState("");
  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

  // Get this reservation from API, put into State
  async function getReservation() {
    const url = `${API_BASE_URL}/reservations/${reservation_id}`;
    const response = await fetch(url);
    const { data: thisReservation } = await response.json();

    setReservation(thisReservation);
  }

  const renderTablesDropdown = () => {
    return tables.map((table, index) => {
      const disabled =
        table.capacity - reservation.people < 0 ? "disabled" : null;

      return (
        <option
          key={index}
          value={`${table.table_id}`}
          disabled={disabled}
        >
          {table.table_name} - {table.capacity}
        </option>
      );
    });
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    // Get table id from the value of the option selected.
    const selectedTable_id = event.target.table.value;

    // Filter through Tables to get full table details of this table
    const selectedTable = tables.filter(
      (table) => table.table_id == selectedTable_id
    )[0];

    // If the table capacity can fit this reservation, proceed. Otherwise, do nothing.
    if (selectedTable.capacity >= reservation.people) {
      const response = await fetch(`${API_BASE_URL}/tables`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: { table: selectedTable, reservation } }),
      });
      await response.json();

      history.push(`/dashboard`);
    }
  };

  useEffect(() => {}, [reservation]);

  useEffect(() => {
    //   Get all tables from API
    listTables().then(setTables);
    // get this one reservation
    getReservation();
  }, []);
  if (!reservation || !tables) {
    return <p>LOADING...</p>;
  }
  return (
    <>
      <p>Seat reservation #{reservation_id} at a table</p>
      <details>
        <summary>See reservation details </summary>

        <ul>
          <li>Size: {reservation.people} people</li>
          <li>
            Name: {reservation.first_name} {reservation.last_name}
          </li>
          <li>Contact: {reservation.mobile_number}</li>
        </ul>
      </details>

      <form onSubmit={submitHandler}>
        <label htmlFor="table">Choose a table:</label>
        <select
          id="table"
          name="table_id"
        >
          {tables && renderTablesDropdown()}
        </select>
        <br /> <button type="submit">Seat this reservation </button>
      </form>
      <button
        onClick={function () {
          history.go(-1);
        }}
      >
        Cancel
      </button>
    </>
  );
}

export default Seat;
