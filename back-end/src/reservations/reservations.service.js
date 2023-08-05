const knex = require("../db/connection");

function list(date) {
  return knex("reservations")
    .select("*")
    .where("reservation_date", date)
    .whereNot("status", "finished")
    .orderBy("reservation_time");
}

function create(reservation) {
  return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

function read(reservation_id) {
  return knex("reservations").select("*").where({ reservation_id }).first();
}

function updateStatus(reservation_id, status) {
  return knex("reservations")
    .returning("*")
    .where({ reservation_id })
    .update({ status });
}

function update(reservation) {
  const { reservation_id } = reservation;
  return knex("reservations")
    .returning("*")
    .where({ reservation_id })
    .update(reservation);
}

function search(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

module.exports = {
  create,
  list,
  read,
  update,
  updateStatus,
  search,
};
