const express = require("express");
const router = new express.Router();
const middleware = require("../utilities")
const errController = require("../controllers/errController")

//Route to build inventory by classification view
router.get("/500", middleware.handleErrors(errController.errBuilder));

module.exports = router;