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

// returns one table
function readTable(table_id) {
  return knex("tables").where({ table_id }).first();
}

// Read one reservation
function readReservation(reservation_id) {
  return knex("reservations").select("*").where({ reservation_id }).first();
}

function update(table_id, reservation_id) {
  return knex("tables").where({ table_id }).update({ reservation_id });
}

function removeReservation(table_id) {
  return knex("tables").where({ table_id }).update("reservation_id", null);
}

function setReservationStatus(reservation_id, status) {
  return knex("reservations")
    .where({ reservation_id })
    .update("status", status);
}

module.exports = {
  list,
  create,
  readTable,
  readReservation,
  update,
  delete: removeReservation,
  setReservationStatus,
};
