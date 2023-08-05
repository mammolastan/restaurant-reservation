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
  const reservation_date = new Date(data["reservation_date"]);
  const day = reservation_date.getUTCDay();

  if (isNaN(Date.parse(data["reservation_date"]))) {
    return next({ status: 400, message: `Invalid reservation_date` });
  }
  if (day === 2) {
    return next({ status: 400, message: `Restaurant is closed on Tuesdays` });
  }
  if (reservation_date < new Date()) {
    return next({
      status: 400,
      message: `Reservation must be set in the future`,
    });
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

// Check if reservation is valid
async function timeDuringOpenHours(req, res, next) {
  const newReservation = req.body.data;

  /** let isError = false;

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
  if (typeof newReservation.people != "number")
    next({ status: 400, message: "The people property is not a number." });

  // Check if reservation status is valid
  if (
    newReservation.status == "seated" ||
    newReservation.status == "finished"
  ) {
    next({
      status: 400,
      message: `Reservation status can not be ${newReservation.status}`,
    });
  }

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
*/
  // END REMOVAL

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

  // let { date } = req.query;

  // if (date === "undefined") date = new Date();

  // const reservations = await service.list(date);
  // res.json({
  //   data: reservations,
  // });
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

// Update reservation status
// Sets reservstion status
async function updateReservationStatus(req, res, next) {
  const { reservation_id } = req.params;

  // Get this full reservation from id
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

  // Get status from requesst
  const { status } = req.body.data;

  // Return error is  status is not valid
  const validStrings = ["booked", "seated", "finished"];
  if (!validStrings.find((string) => string == status)) {
    return next({ status: 400, message: `Status of '${status}' is not valid` });
  }

  const response = await service.update(reservation_id, status);

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
    isValidDate,
    has_reservation_time,
    has_people,
    isStatusValid,
    timeDuringOpenHours,
    asyncErrorBoundary(create),
  ],
  read: [reservationExists, asyncErrorBoundary(read)],
  update: [reservationExists, asyncErrorBoundary(updateReservationStatus)],
};
