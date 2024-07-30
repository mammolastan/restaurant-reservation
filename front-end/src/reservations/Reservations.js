import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./Reservations.css";
import "./ReservationForm";
import ReservationForm from "./ReservationForm";

function Reservations() {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState(false);
  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

  let history = useHistory();

  function fillWithDummyData() {
    setFormData({
      first_name: "Steve",
      last_name: "Stalsworth",
      mobile_number: "800-555-1616",
      reservation_date: "2024-08-08",
      reservation_time: "14:00",
      people: 2,
    });
  }

  // Update state along with form input
  const changeHandler = (event) => {
    // Clear errors
    setErrors(false);

    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

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
      isError = true;
      setErrors(
        (errors) => `${errors} \nError: Reservation can not be on a Tuesday`
      );
    }
    // display error if in the past
    if (submittedDate.getTime() < new Date().getTime()) {
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
      const response = await fetch(`${API_BASE_URL}/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: formData }),
      });
      await response.json();
      history.push(`/dashboard?date=${formData.reservation_date}`);
    }
  };

  return (
    <>
      {
        errors && <div className="alert alert-danger m-2"> {errors} </div>
        // errors.map((error, index) => <ErrorAlert error={error} />)}
      }
      <h1>New reservation</h1>
      <ReservationForm
        submitHandler={submitHandler}
        changeHandler={changeHandler}
        formData={formData}
      />
      <button
        onClick={function () {
          history.go(-1);
        }}
        type="button"
        className="btn btn-danger"
      >
        Cancel
      </button>
      <br />
      <br />
      <br />
      <br />
      <button onClick={fillWithDummyData}>Fill with Dummy Data</button>
    </>
  );
}

export default Reservations;
