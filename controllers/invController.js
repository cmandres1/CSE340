const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  let grid
  if (data.length >= 1){
      grid = await utilities.buildClassificationGrid(data)
      let nav = await utilities.getNav()
      const className = data[0].classification_name
      res.render("./inventory/classification", {
          title: className + " vehicles",
          nav,
          grid,
  })
  } else {
      grid = `<h2 class="no-cars-notice">Sorry, we currently have no cars related to this type of vehicle! </h2>`
      let nav = await utilities.getNav()
      const className = await invModel.getClassificationName(classification_id)
      res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
  })
  }
}

/* Build the details  */
invCont.buildDetailsPage = async function (req, res, next) {
  const product_id = req.params.invId
  const data = await invModel.getCarDetailsById(product_id)
  const grid = await utilities.buildDetailsGrid(data)
  let nav = await utilities.getNav()
  const className = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`
  res.render("./inventory/detail", {
      title: className,
      nav,
      grid,
  })
}

/*
Build inventory management view
*/
invCont.buildManagement = async function(req, res,next) {
  let nav = await utilities.getNav()
  res.render("inventory/management",{
    title: "Inventory Management",
    nav,
    errors:null,
  })
}

/* ****************************************
*  Deliver add classification view
* *************************************** */
invCont.buildAddClass = async function(req, res, next) { 
  let nav = await utilities.getNav()
  res.render("inventory/add-classification",{
    title: "Add Classification",
    nav,
    errors: null
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
invCont.addClassification = async function (req, res) {
  const {classification_name} = req.body //Gets the classification from the post request body

  const addClassResult = await invModel.addClassification(classification_name) 
  if (addClassResult) 
  {
    let nav = await utilities.getNav()
    req.flash(
      "notice",
      `Congratulations, you successfully added the new classification "${classification_name}".`)
      res.status(201).render("inventory/management",{
          title: "Inventory Management",
          nav,
          errors: null
        })
  } else 
  {
    req.flash("notice", "Sorry, addition failed, please verify the information and try again.")
    res.status(501).render("inventory/add-classification",{
      title: "Add Classification",
      nav,
      errors: null
    })
  }
}


/* ****************************************
*  Deliver add inventory view
* *************************************** */

invCont.buildAddInv = async function(req, res, next) { 
  let nav = await utilities.getNav()
  let select = await utilities.buildOptions()
  res.render("inventory/add-inventory",{
    title: "Add Inventory",
    nav,
    errors: null,
    options: select
  })
}

/* 
Add inventory process
*/
invCont.addInventory = async function (req, res) {
  const {classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body //Gets the values from the post request body

  const addClassResult = await invModel.addInventory (
    classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color
    ) //uses the invModel.addInventory method to add the vehicle to the database which returns a fufilled or failed promise 

  if (addClassResult)  //if the promise was fufilled succesfully then creates a success flash message and uses the res.render function to return to the inventory management view 
  {
    let nav = await utilities.getNav()
    req.flash(
      "notice",
      `Congratulations, you successfully added the new Vehicle "${inv_year} ${inv_make} ${inv_model}".`)
      res.status(201).render("inventory/management",{
          title: "Inventory Management",
          nav,
          errors: null
        })
  } else //If the promise fulfilled with a failure it creates a failure message and uses res.render fn to return to the add inventory page.
  {
    let select = await utilities.buildOptions()
    req.flash("notice", "Sorry, addition failed, please verify the information and try again.")
    res.status(501).render("inventory/add-inventory",{
      title: "Add Inventory",
      nav,
      errors: null,
      options: select
    })
  }
}



module.exports = invCont