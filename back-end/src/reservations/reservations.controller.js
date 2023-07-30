/**
 * List handler for reservation resources
 */

const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// Middleware

// Check if reservation is valid
async function reservationValid(req, res, next) {
  const newReservation = req.body.data;
  res.locals.newReservation = newReservation;

  let submittedDate = new Date(
    `${newReservation.reservation_date}T${newReservation.reservation_time}`
  );

  // If reservation is on Tuesday, call error
  if (submittedDate.getDay() === 2) {
    next({ status: 400, message: "Reservations can not be on Tuesday" });
  }
  // If reservation is in the past, call error
  if (submittedDate.getTime() < new Date().getTime()) {
    next({ status: 400, message: "Reservations can not be in the past" });
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

// Request handlers
async function list(req, res) {
  let { date } = req.query;
  if (date === "undefined") date = new Date();
  const reservations = await service.list(date);
  res.json({
    data: reservations,
  });
}

async function create(req, res) {
  const { newReservation } = res.locals;
  const createdReservation = await service.create(newReservation);
  console.log(createdReservation);
  res.status(201).json({ data: createdReservation });
}

// Get One specific reservation
async function read(req, res) {
  const { reservation_id } = req.params;
  const thisReservation = await service.read(reservation_id);
  res.json({
    data: thisReservation,
  });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [reservationValid, asyncErrorBoundary(create)],
  read: [asyncErrorBoundary(read)],
};
