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
  console.log("In service update");
  console.log("table_id");
  console.log(table_id);
  console.log("reservation_id");
  console.log(reservation_id);
  return knex("tables").where({ table_id }).update({ reservation_id });
}

function removeReservation(table_id) {
  console.log("in Destrou Service");
  return knex("tables").where({ table_id }).update("reservation_id", null);
}

module.exports = {
  list,
  create,
  update,
  delete: removeReservation,
};
