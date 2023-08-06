import React from "react";

function ReservationForm({ submitHandler, changeHandler, formData }) {
  return (
    <>
      <form
        name="reservation-create"
        onSubmit={submitHandler}
      >
        <fieldset>
          <legend>Reservation details:</legend>
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
        <button
          type="submit"
          className="btn btn-primary"
        >
          Save
        </button>
      </form>
    </>
  );
}

export default ReservationForm;
