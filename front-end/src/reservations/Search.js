import React, { useState } from "react";

function Search() {
  const submitHandler = () => {
    // do stuff
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
    </>
  );
}

export default Search;
