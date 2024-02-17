const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const messModel = require("../models/message-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const login = {}
/* ****************************************
*  Deliver login view
* *************************************** */
login.buildLogin = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      errors: null,
      title: "Login",
      nav,
    })
  }
/* Build registration view */
login.buildRegistration = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    errors: null,
    title: "Register",
    nav,
  })
}

login.buildAccountManagement = async function (req, res) {
  const account_id = parseInt(res.locals.accountData.account_id)
  let nav = await utilities.getNav()
  const messages = await messModel.getMessageByAccountId(account_id)
  const unreadMessages = await utilities.checkIfUnread(messages)
  const data = await accountModel.getAccountDetailsById(account_id)
  let name = `${data.account_firstname} ${data.account_lastname}`
  res.render("account/management", {
    title: "Account Management",
    nav,
    name,
    errors: null,
    unreadMessage: unreadMessages.length
  })
}

/* Build update account view */
login.buildAccountUpdate = async function (req, res, next) {
  const account_id = parseInt(res.locals.accountData.account_id)
  let nav = await utilities.getNav()
  const data = await accountModel.getAccountDetailsById(account_id)
  let name = `${data.account_firstname} ${data.account_lastname}`
  res.render("account/update-account", {
    errors: null,
    title: `Update ${name}'s  account information`,
    nav,
    account_firstname : data.account_firstname,
    account_lastname : data.account_lastname,
    account_email : data.account_email,
    account_id : account_id
  })
}
/*
Registration Process
*/
login.registerAccount = async function (req, res) {
  let nav = await utilities.getNav()
  const {account_firstname, account_lastname, account_email, account_password} = req.body
  let hashedPassword
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  ) 

  if (regResult)  
  {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`)
      res.status(201).render("account/login",{
        errors: null,
        title: "Login",
        nav,
      })
  } else 
  {
    req.flash("notice", "Sorry, failed registration, please verify your information and try again.")
    res.status(501).render("account/register", {
      errors: null,
      title: "Registration",
      nav,
    })
  }
}

/*
Process login request
*/
login.accountLogin = async function (req, res) {
  let nav = await utilities.getNav()
  const {account_email, account_password } = req.body 
  
  const accountData = await accountModel.getAccountByEmail(account_email) 
  if(!accountData)
  {
    req.flash("notice", "Please check your credentials and try again.")
  res.status(400).render("account/login", {
   title: "Login",
   nav,
   errors: null,
   account_email,
  })
  return 
}
try {
  if(await bcrypt.compare(account_password, accountData.account_password)) {
    console.log("ok till here")
    delete accountData.account_password
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000})
    return res.redirect("/account/")
  } else {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
  })
  return 
  }
  
} catch (error) {
  return new Error('Access Forbidden')
  }
}

/*Process to update the account */
login.accountUpdate = async function (req, res) {
  const {account_id, account_firstname, account_lastname, account_email } = req.body 

  const updateResult = await accountModel.updateAccount (
    account_id, account_firstname, account_lastname, account_email
    ) 

  if (updateResult)
  {
    let AccountName = updateResult.account_firstname + " " + updateResult.account_lastname
    req.flash("notice", `The account for ${AccountName} was successfully updated.`)
    res.redirect("/account/")
  } else
  {
    let nav = utilities.getNav()
    const data = await accountModel.getAccountDetailsById(account_id)
    let AccountName = data.account_firstname + " " + data.account_lastname
    req.flash("notice", "Sorry, the update attempt failed, please verify the information and try again.")
    res.status(501).render("account/update-account",{
      errors: null,
      title: `Update ${AccountName}'s  account information`,
      nav,
      account_firstname : data.account_firstname,
      account_lastname : data.account_lastname,
      account_email : data.account_email,
      account_id : account_id
    })
  }
}

/*Process to update the password */
login.passwordUpdate = async function (req, res) {
  const {account_password, account_id} = req.body 
  let hashedPassword
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    const data = await accountModel.getAccountDetailsById(account_id)
    const AccountName = data.account_firstname + " " + data.account_lastname
    req.flash("notice", 'Sorry, there was an error processing the update.')
    res.status(501).render("account/update-account",{
      errors: null,
      title: `Update ${AccountName}'s  account information`,
      nav,
      account_firstname : data.account_firstname,
      account_lastname : data.account_lastname,
      account_email : data.account_email,
      account_id : account_id
      })
  }

  const updateResult = await accountModel.passwordUpdate ( hashedPassword, account_id ) 

  if (updateResult)  
  {
    const data = await accountModel.getAccountDetailsById(account_id)
    const AccountName = data.account_firstname + " " + data.account_lastname
    req.flash("notice", `The password for ${AccountName} was successfully updated.`)
    res.redirect("/account/")
  } else 
  {
    let nav = utilities.getNav()
    const data = await accountModel.getAccountDetailsById(account_id)
    const AccountName = data.account_firstname + " " + data.account_lastname
    req.flash("notice", "Sorry, the update attempt failed, please verify the information and try again.")
    res.status(501).render("account/update-account",{
      errors: null,
      title: `Update ${AccountName}'s  account information`,
      nav,
      account_firstname : data.account_firstname,
      account_lastname : data.account_lastname,
      account_email : data.account_email,
      account_id : account_id
    })
  }
}

login.logout = async function (req, res) {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.clearCookie("jwt");
      res.redirect("/");
    }
  })
}
  module.exports = login