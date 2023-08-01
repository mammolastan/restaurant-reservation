/**
 * Defines the router for tables resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./tables.controller");
// const methodNotAllowed = require("../errors/")

router
  .route("/")
  .get(controller.list)
  .post(controller.create)
  .put(controller.update);

// Put request below will seat a reservation
router
  .route("/:table_id/seat")
  .put(controller.update)
  .delete(controller.delete);

module.exports = router;
