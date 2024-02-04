const utilities = require(".")
const { body, validationResult} = require("express-validator")
const inventoryModel = require("../models/inventory-model")
const validate = {}


/* 
Registration Data Validation Rules 
*/
validate.classAddRules = () => {
    return [
        body("classification_name")
        .trim().
        isLength({ min: 3}).
        withMessage("Please provide a classification name").custom(async (classification_name) => {
            const classificationExists = await inventoryModel.checkExistingClassification(classification_name);
            if (classificationExists){
                throw new Error("Classification already exists. Please use a different name");
            }
        }),
    ];
};

/*
Check data and return errors or continue to registration
*/ 
validate.checkClassAddition = async (req, res, next) => {
    const { classification_name} = req.body
    let errors = []
    errors = validationResult(req)
    if(!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("/inv/add-classification", {
            errors,
            title: "Add Classification",
            nav,
            classification_name
        })
        return
    }
    next()
}

validate.invAddRules = () => {
    return [
        body("classification_id").isLength({ min: 1}).withMessage("Please provide a classification name"),
        body("inv_make").trim().isLength({min: 1}).withMessage("Please provide the Make"),

        body("inv_model").trim().isLength({min: 1}).withMessage("Please provide the Model"),

        body("inv_description").trim().isLength({min: 1}).withMessage("Please provide a description"),

        body("inv_image").trim().isLength({min: 1}).withMessage("Please provide a valid image path"),

        body("inv_thumbnail").trim().isLength({min: 1}).withMessage("Please provide a valid thumbnail path"),

        body("inv_price").trim().isNumeric().isLength({min: 1}).withMessage("Please provide a valid price"),

        body("inv_year").trim().isNumeric().isLength({max: 4}).withMessage("Please provide a valid  4-digits year"),

        body("inv_miles").trim().isNumeric().isLength({min: 1}).withMessage("Please provide a valid mileage"),

        body("inv_color").trim().isLength({min: 1}).withMessage("Please provide a valid color"),

    ]
}


/*
Check data and return errors or continue to registration
*/ 
validate.checkInvAddition = async (req, res, next) => {
    const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
    let errors = []
    errors = validationResult(req)
    if(!errors.isEmpty()) {
        let select = await utilities.buildOptions()
        let nav = await utilities.getNav()
        res.render("inventory/add-inventory", {
            errors,
            title: "Add Inventory",
            nav,
            options: select,
            classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color
        })
        return
    }
    next()
}



module.exports = validate