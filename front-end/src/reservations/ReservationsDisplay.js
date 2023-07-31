import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

function ReservationsDisplay({ reservation }) {
  return (
    <div
      key={`res-${reservation.reservation_id}`}
      className="reservation"
    >
      Time: {reservation.reservation_time}
      <br />
      Size: {reservation.people}
      <br />
      Contact: {reservation.mobile_number}
      <br />
      Name: {`${reservation.first_name} ${reservation.last_name}`}
      <br />
      Status:
      <span data-reservation-id-status={reservation.id}>
        {reservation.status.toUpperCase()}
      </span>
      <br />
      {reservation.status.includes("booked") && (
        <Link to={`/reservations/${reservation.reservation_id}/seat`}>
          <button>Seat</button>
        </Link>
      )}
      {reservation.status.includes("seated") && <button>Finish</button>}
    </div>
  );
}

export default ReservationsDisplay;
