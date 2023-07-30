import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import Reservations from "../reservations/Reservations";
import Seat from "../reservations/Seat";
import Tables from "../tables/Tables";
import NotFound from "./NotFound";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  return (
    <Switch>
      <Route
        exact={true}
        path="/"
      >
        <Redirect to={"/dashboard"} />
      </Route>
      <Route
        exact={true}
        path="/reservations"
      >
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/reservations/new">
        <Reservations />
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <Seat />
      </Route>
      <Route path="/dashboard/:displayDate">
        <Dashboard />
      </Route>
      <Route path="/dashboard">
        <Dashboard />
      </Route>
      <Route path="/tables/new">
        <Tables />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
