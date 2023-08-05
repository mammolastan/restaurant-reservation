import React, { useState } from "react";
import ReservationsDisplay from "./ReservationsDisplay";
import { listReservations } from "../utils/api";

function Search() {
  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [searchOccured, setSearchOccured] = useState(false);

  const submitHandler = async (event) => {
    event.preventDefault();
    const mobile_number = event.target.mobile_number.value;
    console.log("mobile_number");
    console.log(mobile_number);
    const abortController = new AbortController();
    listReservations({ mobile_number }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);

    setSearchOccured(true);
  };

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

  return (
    <>
      <h1>Search </h1>
      <p>Look for a customer's reservation by mobile phone number</p>
      <form
        name="table-create"
        onSubmit={submitHandler}
      >
        <fieldset>
          <label htmlFor="mobile_number">Mobile number:</label>
          <input
            id="mobile_number"
            name="mobile_number"
            type="text"
            minLength={2}
            required={true}
            placeholder="Enter a customer's phone number"
          />
        </fieldset>
        <button type="submit">Search</button>
      </form>
      <div className="reservationsContainer">
        {searchOccured && !reservations.length ? (
          <p>No reservations found</p>
        ) : (
          renderReservations()
        )}
      </div>
    </>
  );
}

export default Search;
