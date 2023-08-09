import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";

import ErrorAlert from "../layout/ErrorAlert";
import ReservationsDisplay from "../reservations/ReservationsDisplay";
import TablesDisplay from "../tables/TablesDisplay";
import "./Dashboard.css";
import DashboardNavigation from "./DashboardNavigation";
import { today } from "../utils/date-time";

/**
 * Defines the dashboard page.
 * @returns {JSX.Element}
 */
function Dashboard() {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  const params = new URLSearchParams(window.location.search);

  let initialDate = params.get("date") || today();

  const [date, setDate] = useState(initialDate);
  const [tables, setTables] = useState([]);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();

    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);

    listTables(abortController.signal)
      .then(setTables)
      .catch(setReservationsError);

    return () => abortController.abort();
  }

  const renderReservations = () => {
    return reservations.map((reservation, index) => {
      return (
        <ReservationsDisplay
          loadDashboard={loadDashboard}
          reservation={reservation}
          key={index}
        />
      );
    });
  };

  const renderTables = () => {
    return tables?.map((table, index) => {
      return (
        <TablesDisplay
          table={table}
          index={index}
          tables={tables}
          setTables={setTables}
          key={index}
          loadDashboard={loadDashboard}
        />
      );
    });
  };


  return (
    <main>
      <h1>Dashboard</h1>

      <div className="reservations-base">
        <div className="d-md-flex mb-3">
          <h4 className="mb-0">
            Your reservations for {date}
          </h4>
        </div>
        <DashboardNavigation
          date={date}
          setDate={setDate}
        />
        <ErrorAlert error={reservationsError} />
        <div className="reservationsContainer">{renderReservations()}</div>
      </div>
      <h4 className="mb-0">Your tables</h4>
      <div className="tables-base">{renderTables()}</div>
    </main>
  );
}

export default Dashboard;
