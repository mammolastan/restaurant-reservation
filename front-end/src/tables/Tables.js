import React, { useState } from "react";
import { useHistory } from "react-router-dom";

function Tables() {
  const [formData, setFormData] = useState({});
  let history = useHistory();
  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

  const submitHandler = async (event) => {
    event.preventDefault();
    const response = await fetch(`${API_BASE_URL}/tables`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: formData }),
    });

    await response.json();

    history.push(`/dashboard/`);
  };

  const changeHandler = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  return (
    <>
      <h1>Tables</h1>

      <form
        name="table-create"
        onSubmit={submitHandler}
      >
        <fieldset>
          <legend>Make a new table</legend>
          <label htmlFor="table_name">Table name:</label>
          <input
            id="table_name"
            name="table_name"
            type="text"
            minLength={2}
            required={true}
            onChange={changeHandler}
            value={formData.table_name}
          />
          <label htmlFor="capacity">Capacity:</label>
          <input
            id="capacity"
            name="capacity"
            type="number"
            min={1}
            required={true}
            onChange={changeHandler}
            value={formData.capacity}
          />
        </fieldset>
        <button
          type="submit"
          className="btn btn-primary"
        >
          Save
        </button>
      </form>
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

export default Tables;
