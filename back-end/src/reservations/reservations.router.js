/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./reservations.controller");
// const methodNotAllowed = require("../errors/")

router.route("/").get(controller.list).post(controller.create);

router.route("/:reservation_id").get(controller.read);

router.route("/:reservation_id/status").put();

module.exports = router;
