/**
 * List handler for tables resources
 */

// Middleware

// function isTableValid(req, res, next) {
//   const { table, reservation } = req.body.data;

//   // Check that table can accomodate the reservation size
//   if (reservation.people > table.capacity) {
//     next({ status: 400, message: "Reservation size exceeds table size." });
//   }
//   // Check that table is not already occupied
//   if (table.reservation_id) {
//     next({
//       status: 400,
//       message: `Table ${table.table_id} is already occupied`,
//     });
//   }
//   next();
// }

const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// Middleware

// Check if data object is empty
function hasData(req, res, next) {
  if (req.body && req.body.data) {
    // Proceed to the next middleware
    next();
  } else {
    // Proceed to next middleware with an error
    next({ status: 400, message: `Must include body data` });
  }
}

function isValidCapacity(req, res, next) {
  const { capacity } = req.body.data;
  if (typeof capacity != "number") {
    return next({ status: 400, message: "capacity must be a number" });
  }
  next();
}

// Check if property exists in object
function bodyDataHas(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[propertyName]) {
      return next();
    }
    next({ status: 400, message: `Must include a ${propertyName} property` });
  };
}

async function list(req, res) {
  const tables = await service.list();

  res.json({ data: tables });
}

// Create a new table
async function create(req, res, next) {
  const table = req.body.data;

  // Check that table_name length is valid
  if (table.table_name.length <= 1)
    return next({ status: 400, message: "table_name is too short." });

  // Check that capacity is valid
  if (!table.capacity)
    return next({ status: 400, message: "capacity invalid" });

  const createdTable = await service.create(table);
  res.status(201).json({ data: createdTable });
}

// Update a table to seat a reservation
// Also set reservation status to 'booked'
async function update(req, res, next) {
  const { reservation_id } = req.body.data;
  const { table_id } = req.params;

  const table = await service.readTable(table_id);
  const reservation = await service.readReservation(reservation_id);

  // Check if reservation exists
  if (!reservation) {
    next({
      status: 404,
      message: `Reservation_id ${reservation_id} not found`,
    });
  }

  // If reservation is already seated
  if (reservation.status == "seated") {
    return next({ status: 400, message: `Reservation is already seated` });
  }

  // If reservation size is too big for this table
  if (reservation.people > table.capacity) {
    next({
      status: 400,
      message: "Not enough capacity - reservation size exceeds table size.",
    });
  }

  // Check that table is not already occupied
  if (table.reservation_id) {
    next({
      status: 400,
      message: `Table ${table.table_id} is already occupied`,
    });
  }

  // Set reservation status to seated
  const response1 = await service.setReservationStatus(
    reservation_id,
    "seated"
  );

  const response = await service.update(table_id, reservation_id);
  res.status(200).json({ response });
}

// Delete the seated reservation from the given table - Delete data from 'reservation_id' column
// Also set associated reservation status to "finished"
async function destroy(req, res, next) {
  const { table_id } = req.params;

  const table = await service.readTable(table_id);

  // Error if table doesnt exist
  if (!table) {
    return next({ status: 404, message: `Table id ${table_id} not found` });
  }

  // Error if table is not occupied
  if (!table.reservation_id) {
    return next({
      status: 400,
      message: `Table id ${table_id} is not occupied`,
    });
  }

  const reservation_id = table.reservation_id;
  // Set reservation status to finished
  const response1 = await service.setReservationStatus(
    reservation_id,
    "finished"
  );
  const response = await service.delete(table_id);

  res.status(200).json({ response });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [
    bodyDataHas("table_name"),
    bodyDataHas("capacity"),
    isValidCapacity,
    asyncErrorBoundary(create),
  ],
  update: [hasData, bodyDataHas("reservation_id"), asyncErrorBoundary(update)],
  delete: destroy,
};
