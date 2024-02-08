const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const middleware = require("../utilities")
const addInvValidation = require("../utilities/add-inventory-validation")

//Default route
router.get("/",
    middleware.checkLogin,
    middleware.handleErrors(invController.buildManagement))

//Route to build inventory by classification view
router.get("/type/:classificationId", middleware.handleErrors(invController.buildByClassificationId))

//Route to build vehicle details by inventory Id view
router.get("/detail/:invId", middleware.handleErrors(invController.buildDetailsPage));

//Route to build management view
router.get("/management", 
middleware.checkLogin,
middleware.handleErrors(invController.buildManagement))

//Route to build the edition page
router.get("/edit/:invId", middleware.handleErrors(invController.buildEditInv))

//Route to build the deletion page
router.get("/delete/:invId", middleware.handleErrors(invController.buildDeleteInv))

//Route to build the add classification view
router.get("/add-classification", middleware.handleErrors(invController.buildAddClass))

//Route to process the AJAX request
router.get("/getInventory/:classification_id",
middleware.handleErrors(invController.getInventoryJSON))

//Route to send a post request to the server to add a new classification
router.post(
    "/add-classification",
    addInvValidation.classAddRules(),
    addInvValidation.checkClassAddition,
    middleware.handleErrors(invController.addClassification))

//Route to build the add inventory view
router.get("/add-inventory", middleware.handleErrors(invController.buildAddInv))

//Route to add new inventory using a post request
router.post(
        "/add-inventory",
        addInvValidation.invAddRules(),
        addInvValidation.checkInvAddition,
        middleware.handleErrors(invController.addInventory))
    
router.post(
    "/update/", 
    addInvValidation.invAddRules(),
    addInvValidation.checkInvUpdate,
    middleware.handleErrors (invController.updateInventory)
)

router.post("/delete/",middleware.handleErrors (invController.deleteInventory)
)

module.exports = router;