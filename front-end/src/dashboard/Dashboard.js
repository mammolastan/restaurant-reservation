import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
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
  let displayDate = params.get("date") || today();

  console.log("displayDate");
  console.log(displayDate);
  const [date, setDate] = useState(displayDate);
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
          key={index}
        />
      );
    });
  };

  return (
    <main>
      <h1>Dashboard</h1>

      <div className="reservations-base">
        <div className="d-md-flex mb-3">
          <h4 className="mb-0">Reservations for {date}</h4>
        </div>
        <DashboardNavigation
          date={date}
          setDate={setDate}
        />
        <ErrorAlert error={reservationsError} />
        <div className="reservationsContainer">{renderReservations()}</div>
      </div>
      <div className="tables-base">
        <h4 className="mb-0">Tables status</h4>
        {renderTables()}
      </div>
    </main>
  );
}

export default Dashboard;
