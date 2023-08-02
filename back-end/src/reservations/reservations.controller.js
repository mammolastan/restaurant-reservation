/**
 * List handler for reservation resources
 */

const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// Middleware

// Check if data object is empty
function hasData() {
  const { data = {} } = req.body;
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      next();
    }
  }
  next({ status: 400, message: `No body data.` });
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

// Check if reservation is valid
async function reservationValid(req, res, next) {
  let isError = false;
  const newReservation = req.body.data;

  // Check properties not empty
  if (!newReservation.first_name) isError = true;
  if (!newReservation.last_name) isError = true;
  if (!newReservation.mobile_number) isError = true;
  if (!newReservation.reservation_date) isError = true;
  if (!newReservation.reservation_time) isError = true;
  if (!newReservation.people) isError = true;
  if (isError) {
    next({ status: 400, message: "The reservation data is invalid." });
  }

  // Check that reservation_date is a date
  if (!/^\d{4}-\d{1,2}-\d{1,2}$/.test(newReservation.reservation_date))
    next({ status: 400, message: "The reservation_date is invalid." });

  // Check that reservation_time is a time
  if (!/^(\d{2}:\d{2})$/.test(newReservation.reservation_time))
    next({ status: 400, message: "The reservation_time is invalid." });

  // Check that people is a number
  if (isNaN(newReservation.people))
    next({ status: 400, message: "The people property is not a number." });

  res.locals.newReservation = newReservation;

  let submittedDate = new Date(
    `${newReservation.reservation_date}T${newReservation.reservation_time}`
  );

  // If reservation is on Tuesday, call error
  if (submittedDate.getDay() === 2) {
    next({
      status: 400,
      message: "Reservations can not be on Tuesday - resturant is closed",
    });
  }
  // If reservation is in the past, call error
  if (submittedDate.getTime() < new Date().getTime()) {
    next({
      status: 400,
      message:
        "Reservations can not be in the past - must be made in the future",
    });
  }

  // display error if time before 10:30 am or after 9:30 pm
  const hours = newReservation.reservation_time.slice(0, 2);
  const minutes = newReservation.reservation_time.slice(-2);
  const time = Number(hours) + Number(minutes) / 100;
  if (time < 10.3 || time > 21.3) {
    next({
      status: 400,
      message: "Reservation must be between the hours of 10:30am and 9:30pm ",
    });
  }

  return next();
}

async function reservationExists(req, res, next) {
  const { reservation_id } = req.params;
  const thisReservation = await service.read(reservation_id);
  console.log("thisReservation");
  console.log(thisReservation);

  if (thisReservation) {
    res.locals.thisReservation = thisReservation;
    return next();
  }

  next({
    status: 404,
    message: `Reservation ID ${reservation_id} not found`,
  });
}

//
// Request handlers
//

// List all reservations for a specified date
async function list(req, res) {
  let { date } = req.query;
  if (date === "undefined") date = new Date();

  const reservations = await service.list(date);
  res.json({
    data: reservations,
  });
}

// Create a new reservation
async function create(req, res) {
  console.log("in create");
  const { newReservation } = res.locals;
  const createdReservation = await service.create(newReservation);

  res.status(201).json({ data: createdReservation });
}

// Get One specific reservation
async function read(req, res) {
  thisReservation = res.locals.thisReservation;

  res.status(200).json({
    data: thisReservation,
  });
}

// Update reservation status
async function updateReservationStatus(req, res) {
  // Sets reservstion status to finished
  // Removes the reservation from the table
  const { reservation_id } = req.params;
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [
    bodyDataHas("first_name"),
    bodyDataHas("last_name"),
    bodyDataHas("mobile_number"),
    bodyDataHas("reservation_date"),
    bodyDataHas("reservation_time"),
    bodyDataHas("people"),
    reservationValid,
    asyncErrorBoundary(create),
  ],
  read: [reservationExists, asyncErrorBoundary(read)],
};
