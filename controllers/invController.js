const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* 
Build inventory by classification view
*/
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
/* 
Build the details page by product id 
*/
invCont.buildDetailsPage = async function (req, res, next) {
    const product_id = req.params.invId
    const data = await invModel.getCarDetailsById(product_id)
    //console.log(data)//For testing only...
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
    // req.flash("notice", "This is a test message for the management page")
    const classificationSelect = await utilities.buildClassificationList()
    res.render("inventory/management",{
      title: "Inventory Management",
      nav,
      classificationSelect,
    })
  }



/*
Build classification addition view
*/
invCont.buildAddClass = async function(req, res, next) { 
    let nav = await utilities.getNav()
    res.render("inventory/add-classification",{
      title: "Add Classification",
      nav,
      errors: null
    })
}

/* 
Build the inventory view  
*/
invCont.buildAddInv = async function(req, res, next) { 
  let nav = await utilities.getNav()
  let select = await utilities.buildClassificationList()
  res.render("inventory/add-inventory",{
    title: "Add Inventory",
    nav,
    errors: null,
    options: select
  })
}

/*
Add classification process
*/
invCont.addClassification = async function (req, res) {
    let nav = await utilities.getNav()
    const {classification_name} = req.body //Gets the classification from the post request body
  
    const addClassResult = await invModel.addClassification(
      classification_name
      ) //uses the invModel.addClassification method to add the new classification to the database which returns a fufilled or failed promise
  
    if (addClassResult)  //if the promise was fufilled succesfully then creates a success flash message and uses the res.render function to return to the inventory management view 
    {
      nav = await utilities.getNav()
      const classificationSelect = await utilities.buildClassificationList()
      req.flash(
        "notice",
        `Congratulations, you successfully added the new classification "${classification_name}".`)
        res.status(201).render("inventory/management",{
            title: "Inventory Management",
            nav,
            errors: null,
            classificationSelect,
          })
    } else //If the promise fulfilled with a failure it creates a failure message and uses res.render fn to return to the add classification page.
    {
      req.flash("notice", "Sorry, addition failed, please verify the information and try again. Or contact us for more support cse340@support.com")
      res.status(501).render("inventory/add-classification",{
        title: "Add Classification",
        nav,
        errors: null
      })
    }
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
    const classificationSelect = await utilities.buildClassificationList()
    req.flash(
      "notice",
      `Congratulations, you successfully added the new Vehicle "${inv_year} ${inv_make} ${inv_model}".`)
      res.status(201).render("inventory/management",{
          title: "Inventory Management",
          nav,
          errors: null,
          classificationSelect,
        })
  } else //If the promise fulfilled with a failure it creates a failure message and uses res.render fn to return to the add inventory page.
  {
    let select = await utilities.buildClassificationList(classification_id)
    req.flash("notice", "Sorry, addition failed, please verify the information and try again. Or contact us for more support cse340@support.com")
    res.status(501).render("inventory/add-inventory",{
      title: "Add Inventory",
      nav,
      errors: null,
      options: select
    })
  }
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
    const classificationSelect = await utilities.buildClassificationList()
    req.flash(
      "notice",
      `Congratulations, you successfully added the new Vehicle "${inv_year} ${inv_make} ${inv_model}".`)
      res.status(201).render("inventory/management",{
          title: "Inventory Management",
          nav,
          errors: null,
          classificationSelect,
        })
  } else //If the promise fulfilled with a failure it creates a failure message and uses res.render fn to return to the add inventory page.
  {
    let select = await utilities.buildClassificationList(classification_id)
    req.flash("notice", "Sorry, addition failed, please verify the information and try again. Or contact us for more support cse340@support.com")
    res.status(501).render("inventory/add-inventory",{
      title: "Add Inventory",
      nav,
      errors: null,
      options: select
    })
  }
}
/*
Return Inventory by Classification as JSON 
*/
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* 
Build the edit inventory view  
*/
invCont.buildEditInv = async function(req, res, next) {
  const inv_id = parseInt(req.params.invId)
  let nav = await utilities.getNav()
  const data = await invModel.getCarDetailsById(inv_id)
  let name = `${data[0].inv_make} ${data[0].inv_model}`
  let select = await utilities.buildClassificationList(data[0].classification_id)
  res.render("inventory/edit-inventory",{
    title: `Edit ${name}`,
    nav,
    errors: null,
    options: select,
    inv_id: data[0].inv_id,
    inv_make: data[0].inv_make,
    inv_model: data[0].inv_model,
    inv_year: data[0].inv_year,
    inv_description: data[0].inv_description,
    inv_image: data[0].inv_image,
    inv_thumbnail: data[0].inv_thumbnail,
    inv_price: data[0].inv_price,
    inv_miles: data[0].inv_miles,
    inv_color: data[0].inv_color,
    classification_id: data[0].classification_id
  })
}

/* 
Edit inventory process
*/
invCont.updateInventory = async function (req, res) {
  const {classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, inv_id } = req.body //Gets the values from the post request body

  const updateResult = await invModel.updateInventory (
    classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, inv_id
    ) //uses the invModel.updateInventory method to update the vehicle to the database which returns a fufilled or failed promise 

  if (updateResult)  //if the promise was fufilled succesfully then creates a success flash message and uses the res.render function to return to the inventory management view 
  {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else //If the promise fulfilled with a failure it creates a failure message and uses res.render fn to return to the add inventory page.
  {
    let select = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    let nav = utilities.getNav()
    req.flash("notice", "Sorry, the edition failed, please verify the information and try again.")
    res.status(501).render("inventory/edit-inventory",{
      title: `Edit  ${itemName}`,
      nav,
      options :select,
      errors: null,
      options: select,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    })
  }
}

// Build Delete inventory view
invCont.buildDeleteInv = async function(req, res, next) {
  const inv_id = parseInt(req.params.invId)
  let nav = await utilities.getNav()
  const data = await invModel.getCarDetailsById(inv_id)
  let name = `${data[0].inv_make} ${data[0].inv_model}`
  res.render("inventory/delete-confirm", {
    title: `Delete ${name}`,
    nav,
    errors: null,
    inv_id: data[0].inv_id,
    inv_make: data[0].inv_make,
    inv_model: data[0].inv_model,
    inv_year: data[0].inv_year,
    inv_price: data[0].inv_price
  })
}


/* 
Delete inventory process
*/
invCont.deleteInventory = async function (req, res, next) {
  let nav = utilities.getNav()
  const inv_id = req.body //Gets the values from the post request body

  const deleteResult = await invModel.deleteInventory (inv_id)

  if (deleteResult)
  {
    req.flash("notice", `The ${itemName} was successfully Deleted.`)
    res.redirect("/inv/")
  } else 
  {
    req.flash("notice", "Sorry, the deletion failed, please verify the information and try again.")
    res.status(501).render("inventory/delete-confirm",)
  }
}

module.exports = invCont;