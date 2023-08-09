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

function hasValidFields(req, res, next) {
  const { data = {} } = req.body;
  const validFields = new Set([
    "first_name",
    "last_name",
    "mobile_number",
    "reservation_date",
    "reservation_time",
    "people",
    "status",
    "created_at",
    "updated_at",
    "reservation_id",
  ]);

  const invalidFields = Object.keys(data).filter(
    (field) => !validFields.has(field)
  );

  if (invalidFields.length)
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  next();
}

function isStatusValid(req, res, next) {
  const { status } = req.body.data;

  if (status == "seated" || status == "finished") {
    return next({
      status: 400,
      message: `New reservation status can not be ${status}`,
    });
  }
  next();
}

function isValidDate(req, res, next) {
  const { data = {} } = req.body;

  const currentDateTime = new Date();

  const reservationDate = data.reservation_date;
  const reservationTime = data.reservation_time;
  // Parse reservation date and time
  const [year, month, day] = reservationDate.split("-").map(Number);
  const [hours, minutes] = reservationTime.split(":").map(Number);

  const reservationDateTime = new Date(year, month - 1, day, hours, minutes);

  if (isNaN(Date.parse(data["reservation_date"]))) {
    return next({ status: 400, message: `Invalid reservation_date` });
  }

  const dayOfWeek = reservationDateTime.getDay();
  if (dayOfWeek === 2) {
    return next({ status: 400, message: `Restaurant is closed on Tuesdays` });
  }

  if (reservationDateTime < currentDateTime) {
    return next({
      status: 400,
      message: `Reservation must be set in the future`,
    });
  }
  next();
}

function isPeopleNumber(req, res, next) {
  const { people } = req.body.data;

  if (typeof people != "number")
    return next({
      status: 400,
      message: "The people property is not a number.",
    });

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

// Check if reservation is valid
async function timeDuringOpenHours(req, res, next) {
  const newReservation = req.body.data;

  // Check that reservation_time is a valid time

  const timeRegex = /^(?:2[0-3]|[01]?[0-9]):[0-5][0-9](?::[0-5][0-9])?$/;
  if (!timeRegex.test(newReservation.reservation_time))
    next({ status: 400, message: "The reservation_time is invalid." });

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
  const mobile_number = req.query.mobile_number;
  const data = await (mobile_number
    ? service.search(mobile_number)
    : service.list(req.query.date));

  res.json({ data });
}

// Create a new reservation
async function create(req, res) {
  const newReservation = req.body.data;

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

// Update the details of a reservation
async function update(req, res, next) {
  const { reservation_id } = req.params;
  const reservation = req.body.data;
  reservation.reservation_id = reservation_id;
  const response = await service.update(reservation);
  res.status(200).json({ data: response[0] });
}

// Update reservation status
// Sets reservstion status
async function updateReservationStatus(req, res, next) {
  const { reservation_id } = req.params;

  // Get this full reservation via id
  const thisReservation = await service.read(reservation_id);

  // Return error if reservation not found
  if (!thisReservation) {
    return next({
      status: 400,
      message: `No reservation for id ${reservation_id}`,
    });
  }

  // Return error if it is already finished
  if (thisReservation.status == "finished") {
    return next({
      status: 400,
      message: `Reservation ${reservation_id} is already finished.`,
    });
  }

  // Get status from request
  const { status } = req.body.data;

  // Return error if status is not valid
  const validStrings = ["booked", "seated", "finished", "cancelled"];
  if (!validStrings.find((string) => string == status)) {
    return next({ status: 400, message: `Status of '${status}' is not valid` });
  }

  const response = await service.updateStatus(reservation_id, status);

  res.status(200).json({ data: response[0] });
}

const has_first_name = bodyDataHas("first_name");
const has_last_name = bodyDataHas("last_name");
const has_mobile_number = bodyDataHas("mobile_number");
const has_reservation_date = bodyDataHas("reservation_date");
const has_reservation_time = bodyDataHas("reservation_time");
const has_people = bodyDataHas("people");
// const has_capacity = bodyDataHas("capacity");
// const has_table_name = bodyDataHas("table_name");
const has_reservation_id = bodyDataHas("reservation_id");

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [
    has_first_name,
    has_last_name,
    has_mobile_number,
    has_reservation_date,
    has_reservation_time,
    isValidDate,
    has_people,
    isPeopleNumber,
    isStatusValid,
    timeDuringOpenHours,
    asyncErrorBoundary(create),
  ],
  read: [reservationExists, asyncErrorBoundary(read)],
  update: [
    reservationExists,
    has_first_name,
    has_last_name,
    has_mobile_number,
    has_reservation_date,
    has_reservation_time,
    isValidDate,
    has_people,
    isPeopleNumber,
    isStatusValid,
    timeDuringOpenHours,
    asyncErrorBoundary(update),
  ],
  updateStatus: [
    reservationExists,
    asyncErrorBoundary(updateReservationStatus),
  ],
};
