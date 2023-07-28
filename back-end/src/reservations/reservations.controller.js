/**
 * List handler for reservation resources
 */

const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// Middleware

// Check if reservation is valid
async function reservationValid(req, res, next) {
  const newReservation = await service.create(req.body.data);
  req.locals = newReservation;
  let submittedDate = new Date(newReservation.reservation_date);
  submittedDate = new Date(submittedDate.getTime() + 240 * 60000);

  // If reservation is on Tuesday, call error
  if (submittedDate.getDay() === 2) {
    next({ status: 400, message: "Reservations can not be on Tuesday" });
  }
  // If reservation is in the past, call error
  if (submittedDate.getTime() < new Date().getTime()) {
    next({ status: 400, message: "Reservations can not be in the past" });
  }

  // display error if time before 10:30 am or after 9:30 pm
  const hours = submittedDate.getHours();
  const minutes = submittedDate.getMinutes() / 100;
  const time = hours + minutes;
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
  const { date } = req.query;
  const reservations = await service.list(date);
  res.json({
    data: reservations,
  });
}

async function create(req, res) {
  console.log("in create");
  console.log("req.body");
  console.log(req.body);
  const { newReservation } = req.locals;

  console.log("newReservation");
  console.log(newReservation);
  res.status(201).json({ newReservation });
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
