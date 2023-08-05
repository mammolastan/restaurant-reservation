import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./Reservations.css";

function Reservations() {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState(false);
  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

  let history = useHistory();

  function fillWithDummyData() {
    setFormData({
      first_name: "Dummy",
      last_name: "Head",
      mobile_number: "555-867-5309",
      reservation_date: "2023-08-16",
      reservation_time: "20:01",
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

      <form
        name="reservation-create"
        onSubmit={submitHandler}
      >
        <fieldset>
          <legend>Make a new reservation</legend>
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
        <button type="submit">Save</button>
      </form>
      <button
        onClick={function () {
          history.go(-1);
        }}
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
