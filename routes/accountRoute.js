const express = require("express");
const router = new express.Router();
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")

//Default route
router.get("/",
    utilities.checkLogin,
    utilities.handleErrors(accountController.buildAccountManagement))

//Route to build login, registration views
router.get("/login", 
    //utilities.passwordButton(),
    utilities.handleErrors(accountController.buildLogin));

router.get("/registration",
    //utilities.passwordButton(),
    utilities.handleErrors(accountController.buildRegistration))

//Route to post a new user registration
router.post("/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount))

// Process the login attempt using a post request
router.post(
        "/login", 
        regValidate.loginRules(),
        regValidate.checkLoginData,
        utilities.handleErrors(
        accountController.accountLogin)
      )

module.exports = router;