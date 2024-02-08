const utilities = require(".")
const { body, validationResult} = require
("express-validator")
const validate = {}
const inventoryModel = require("../models/inventory-model")

/* 
Classification Addition Data Validation Rules 
*/
validate.classAddRules = () => {
    return [
        //classification name is required and must be a string
        body("classification_name").trim().isLength({ min: 1}).withMessage("Please provide a classification name").custom(async (classification_name) => {
        const classificationExists = await inventoryModel.checkExistingClassification(classification_name)
        if (classificationExists){
            throw new Error("Classification already exists. Please use a different name")
        }
    }),
    ]
}

/*
Check classification addition and return errors if any
*/ 
validate.checkClassAddition = async (req, res, next) => {
    const { classification_name} = req.body
    let errors = []
    errors = validationResult(req)
    if(!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            title: "Add Classification",
            nav,
            classification_name
        })
        return
    }
    next()
}
/* 
Inventory Addition Data Validation Rules 
*/
validate.invAddRules = () => {
    return [
        body("classification_id").isLength({ min: 1}).withMessage("Please provide a classification name"),
        body("inv_make").trim().isLength({min: 1}).withMessage("Please provide the Make"),

        body("inv_model").trim().isLength({min: 1}).withMessage("Please provide the Model"),

        body("inv_description").trim().isLength({min: 1}).withMessage("Please provide a description"),

        body("inv_image").trim().isLength({min: 1}).withMessage("Please provide a valid image path"),

        body("inv_thumbnail").trim().isLength({min: 1}).withMessage("Please provide a valid thumbnail path"),

        body("inv_price").trim().isNumeric().isLength({min: 1}).withMessage("Please provide a valid price"),

        body("inv_year").trim().isNumeric().isLength({min: 1}).withMessage("Please provide a valid year"),

        body("inv_miles").trim().isNumeric().isLength({min: 1}).withMessage("Please provide a valid mileage"),

        body("inv_color").trim().isLength({min: 1}).withMessage("Please provide a valid color"),

    ]
}

/*
Check inventory addition data and return errors or continue to add
*/ 
validate.checkInvAddition = async (req, res, next) => {
    const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
    let errors = []
    errors = validationResult(req)
    if(!errors.isEmpty()) {
        let select = await utilities.buildClassificationList(classification_id)
        let nav = await utilities.getNav()
        res.render("inventory/add-inventory", {
            errors,
            title: "Add Inventory",
            nav,
            options: select,
            classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color //for stickiness 
        })
        return
    }
    next()
}

/*
Check inventory updates data and return errors or continue to update
*/ 
validate.checkInvUpdate = async (req, res, next) => {
    const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, inv_id } = req.body
    let errors = []
    errors = validationResult(req)
    if(!errors.isEmpty()) {
        let select = await utilities.buildClassificationList(classification_id)
        let nav = await utilities.getNav()
        const data = await inventoryModel.getCarDetailsById(inv_id)
        let name = `${data[0].inv_make} ${data[0].inv_model}`
        res.render("inventory/edit-inventory", {
            errors,
            title: `Edit ${name}`,
            nav,
            options: select,
            classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, inv_id //for stickiness 
        })
        return
    }
    next()
}

module.exports = validate