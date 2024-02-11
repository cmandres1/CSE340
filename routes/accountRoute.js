const express = require("express");
const router = new express.Router();
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")


//Default route
router.get("/",utilities.checkLogin,utilities.handleErrors(accountController.buildAccountManagement))

router.get("/management",utilities.checkLogin,utilities.handleErrors(accountController.buildAccountManagement))

//Route to build login, registration views
router.get("/login",utilities.handleErrors(accountController.buildLogin));

//Route to logout
router.get("/logout",
    utilities.handleErrors(accountController.logout))    

router.get("/registration",utilities.handleErrors(accountController.buildRegistration))

//Route to build account update view
router.get("/update",utilities.handleErrors(accountController.buildAccountUpdate))

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

// Process the update account using a post request
router.post(
  "/update-account", 
  regValidate.updateRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(
  accountController.accountUpdate)
)

// Process the update password using a post request
router.post(
  "/update-password", 
  regValidate.updatePwdRules(),
  regValidate.checkPwdUpdate,
  utilities.handleErrors(
  accountController.passwordUpdate)
)


module.exports = router;