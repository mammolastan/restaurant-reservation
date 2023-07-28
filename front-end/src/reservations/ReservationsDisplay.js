import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

function reservationsDisplay({ reservation }) {
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
      <Link
        to={`/reservations/${reservation.reservation_id}/seat`}
      >
        <button>Seat</button>
      </Link>
    </div>
  );
}

export default reservationsDisplay;
