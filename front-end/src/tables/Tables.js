import React, { useState } from "react";
import { useHistory } from "react-router-dom";

function Tables() {
  const [formData, setFormData] = useState({});
  let history = useHistory();

  const submitHandler = async (event) => {
    console.log("in submitHandler");
    event.preventDefault();
    const response = await fetch(`http://localhost:5001/tables`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: formData }),
    });
    console.log("before await response.json();");
    await response.json();
    console.log("after await response.json();");
    history.push(`/dashboard/`);
  };

  const changeHandler = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    console.log(formData);
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
        <button type="submit">Save</button>
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

export default Tables;
