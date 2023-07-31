const knex = require("../db/connection");

function list() {
  return knex("tables").select("*").orderBy("table_name");
}

function create(table) {
  return knex("tables")
    .insert(table)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

function update(table_id, reservation_id) {
  return knex("tables").where({ table_id }).update({ reservation_id });
}

function removeReservation(table_id) {
  return knex("tables").where({ table_id }).update("reservation_id", null);
}

function setReservationStatus(reservation_id, status) {
  console.log("in setReservationStatus service");
  console.log(reservation_id);
  console.log(status);
  return knex("reservations")
    .where({ reservation_id })
    .update("status", status);
}

module.exports = {
  list,
  create,
  update,
  delete: removeReservation,
  setReservationStatus,
};
