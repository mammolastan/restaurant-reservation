import React, { useEffect, useState } from "react";
import {
  useParams,
  useHistory,
} from "react-router-dom/cjs/react-router-dom.min";
import { formatAsDate } from "../utils/date-time";
import ReservationForm from "./ReservationForm";

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

  if (!editable) {
    return (
      <>
        <p>Reservation with status of {reservation.status} can not be edited</p>
        <button
          onClick={function () {
            history.go(-1);
          }}
          type="button"
          className="btn btn-danger"
        >
          Go back
        </button>
      </>
    );
  }

  return (
    <>
      <h1>Edit reservation</h1>
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
    </>
  );
}

export default Edit;
