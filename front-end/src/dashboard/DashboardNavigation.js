import React from "react";
import { previous, today, next } from "../utils/date-time";

function DashboardNavigation({ date, setDate }) {
  const alterDate = (forward = true) => {
    forward ? setDate(next(date)) : setDate(previous(date));
  };

  return (
    <div className="control">
      <button
        type="button"
        className="btn btn-primary"
        onClick={function () {
          alterDate(false);
        }}
      >
        Previous
      </button>
      <button
        type="button"
        className="btn btn-primary"
        onClick={function () {
          setDate(today());
        }}
      >
        Today
      </button>
      <button
        type="button"
        className="btn btn-primary"
        onClick={function () {
          alterDate(true);
        }}
      >
        Next
      </button>
    </div>
  );
}

export default DashboardNavigation;
