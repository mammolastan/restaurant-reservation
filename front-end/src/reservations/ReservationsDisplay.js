import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

function ReservationsDisplay({ reservation, loadDashboard }) {
  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";
  const cancelReservation = async () => {
    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      )
    ) {
      const response = await fetch(
        `${API_BASE_URL}/reservations/${reservation.reservation_id}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data: { status: "cancelled" },
          }),
        }
      );
      await response.json();
      loadDashboard();
    }
  };

  if (
    reservation.status.includes("finished") &&
    !window.location.href.includes("search")
  ) {
    return null;
  }
  return (
    <div
      key={`res-${reservation.reservation_id}`}
      className={`reservation ${reservation.status}`}
    >
      <div className="id">{reservation.reservation_id}</div>
      Time: {reservation.reservation_time}
      <br />
      Size: {reservation.people}
      <br />
      Contact: {reservation.mobile_number}
      <br />
      Name: {`${reservation.first_name} ${reservation.last_name}`}
      <br />
      Status:
      <span data-reservation-id-status={reservation.reservation_id}>
        {` ${reservation.status.toUpperCase()}`}
      </span>
      <br />
      {reservation.status.includes("booked") && (
        <Link to={`/reservations/${reservation.reservation_id}/seat`}>
          <button
            type="button"
            className="btn btn-primary"
          >
            Seat
          </button>
        </Link>
      )}
      {reservation.status != "cancelled" && (
        <Link to={`/reservations/${reservation.reservation_id}/edit`}>
          <button
            type="button"
            className="btn btn-primary"
          >
            Edit
          </button>
        </Link>
      )}
      {reservation.status != "cancelled" && (
        <button
          data-reservation-id-cancel={reservation.reservation_id}
          onClick={cancelReservation}
          type="button"
          className="btn btn-danger"
        >
          Cancel
        </button>
      )}
    </div>
  );
}

export default ReservationsDisplay;
