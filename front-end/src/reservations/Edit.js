import React, { useEffect, useState } from "react";
import {
  useParams,
  useHistory,
} from "react-router-dom/cjs/react-router-dom.min";
import { formatAsDate } from "../utils/date-time";

function Edit() {
  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";
  const [reservation, setReservation] = useState(null);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState(false);

  const { reservation_id } = useParams();
  const history = useHistory();

  async function getReservation() {
    const url = `${API_BASE_URL}/reservations/${reservation_id}`;
    const response = await fetch(url);
    const { data: thisReservation } = await response.json();
    thisReservation.reservation_date = formatAsDate(
      thisReservation.reservation_date
    );
    setReservation(thisReservation);
  }

  //   Get reservation upon page load
  useEffect(getReservation, []);

  //   set reservation to the form data upon load
  useEffect(
    function () {
      setFormData(reservation);
    },
    [reservation]
  );

  //   Set indicator if reservation is unable to be edited
  const editable = reservation?.status == "booked" ? true : false;

  // Handler for form submit -Validate, post new reservation, redirect to dashboard
  const submitHandler = async (event) => {
    event.preventDefault();
    let isError = false;

    //Validate form response
    let submittedDate = new Date(
      `${formData.reservation_date}T${formData.reservation_time}`
    );

    // Adjust date to be in Eastern US Time Zone
    submittedDate = new Date(submittedDate.getTime());
    // submittedDate = new Date(submittedDate.getTime() + 240 * 60000);

    // display error if Tuesday
    if (submittedDate.getDay() === 2) {
      console.log("Trying to set Tuesday error");
      isError = true;
      setErrors(
        (errors) => `${errors} \nError: Reservation can not be on a Tuesday`
      );
    }
    // display error if in the past
    if (submittedDate.getTime() < new Date().getTime()) {
      console.log("trying to set past error");
      isError = true;
      setErrors(
        (errors) => `${errors} \n\nError: Reservation can not be in the past`
      );
    }
    // display error if time before 10:30 am or after 9:30 pm
    const hours = formData.reservation_time.slice(0, 2);
    const minutes = formData.reservation_time.slice(-2);
    const time = Number(hours) + Number(minutes) / 100;

    if (time < 10.3 || time > 21.3) {
      isError = true;
      setErrors(
        (errors) =>
          `${errors} \n Error: Reservation must be during the hours of 10:30 AM - 9:30 PM`
      );
    }

    // If no errors, proceed
    if (!isError) {
      console.log("Running fetch");
      const response = await fetch(
        `${API_BASE_URL}/reservations/${reservation_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: formData }),
        }
      );
      await response.json();
      history.push(`/dashboard?date=${formData.reservation_date}`);
    }
  };

  // Update state along with form input
  const changeHandler = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  if (!formData || !reservation) {
    return <p>LOADING...</p>;
  }

  return (
    <>
      <form
        name="reservation-create"
        onSubmit={submitHandler}
      >
        <fieldset>
          <legend>Edit reservation #{reservation.reservation_id}</legend>
          <label htmlFor="first_name">First name:</label>
          <input
            id="first_name"
            name="first_name"
            type="text"
            required={true}
            onChange={changeHandler}
            value={formData.first_name}
          />
          <label htmlFor="last_name">Last name:</label>
          <input
            id="last_name"
            name="last_name"
            type="text"
            required={true}
            onChange={changeHandler}
            value={formData.last_name}
          />
          <label htmlFor="mobile_number">Phone number:</label>
          <input
            id="mobile_number"
            name="mobile_number"
            type="tel"
            placeholder="404-915-3092"
            required={true}
            onChange={changeHandler}
            value={formData.mobile_number}
          />
          <label htmlFor="reservation_date">Date:</label>
          <input
            id="reservation_date"
            name="reservation_date"
            type="date"
            placeholder="YYYY-MM-DD"
            pattern="\d{4}-\d{2}-\d{2}"
            required={true}
            onChange={changeHandler}
            value={formData.reservation_date}
          />
          <label htmlFor="reservation_time">Time:</label>
          <input
            id="reservation_time"
            name="reservation_time"
            type="time"
            required={true}
            onChange={changeHandler}
            value={formData.reservation_time}
          />
          <label htmlFor="people">Party size:</label>
          <input
            id="people"
            name="people"
            type="number"
            required={true}
            onChange={changeHandler}
            value={formData.people}
          />
        </fieldset>
        {editable ? (
          <button type="submit">Submit</button>
        ) : (
          <p>
            Reservation with status of {reservation.status} can not be edited
          </p>
        )}
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

export default Edit;
