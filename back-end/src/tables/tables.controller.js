/**
 * List handler for tables resources
 */

// Middleware

function isTableValid(req, res, next) {
  const { table, reservation } = req.body.data;

  // Check that table can accomodate the reservation size
  if (reservation.people > table.capacity) {
    next({ status: 400, message: "Reservation size exceeds table size." });
  }
  // Check that table is not already occupied
  if (table.reservation_id) {
    next({
      status: 400,
      message: `Table ${table.table_id} is already occupied`,
    });
  }
  next();
}

const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
  const tables = await service.list();

  res.json({ data: tables });
}

// Create a new table
async function create(req, res) {
  const table = req.body.data;
  const createdTable = await service.create(table);

  res.status(201).json({ data: createdTable });
}

// Update a table to seat a reservation
// Also set reservation status to 'booked'
async function update(req, res) {
  const { table, reservation } = req.body.data;
  const reservation_id = reservation.reservation_id;
  const table_id = table.table_id;

  if (reservation.people > table.capacity) {
    next({ status: 400, message: "Reservation size exceeds table size." });
  }

  console.log("before setReservationStatus");
  // Set reservation status to seated
  const response1 = await service.setReservationStatus(
    reservation_id,
    "seated"
  );
  console.log("after setReservationStatus");
  console.log(response1);
  const response = await service.update(table_id, reservation_id);
  res.status(201).json({ response });
}

// Delete the seated reservation from the given table
async function destroy(req, res) {
  const { table_id } = req.params;
  const response = await service.delete(table_id);
  res.status(200).json({ response });
}



module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [asyncErrorBoundary(create)],
  update: [isTableValid, asyncErrorBoundary(update)],
  delete: destroy,
};