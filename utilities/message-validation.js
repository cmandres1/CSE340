const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const messModel = require("../models/message-model")
const accModel = require("../models/account-model")

/* ******************
 * Send message data validation rules
******************** */
validate.sendMessageRules = () => {
    return [

        //A registered account recipient is required.
        body("message_to")
        .trim()
        .isInt()
        .withMessage("Please select a message recipient account."),

        //A message subject is required.
        body("message_subject")
        .trim()
        .isLength({min: 1})
        .withMessage("Please enter a message subject"),

        //A message body is required.
        body("message_body")
        .trim()
        .isLength({min: 1})
        .withMessage("Please include a message to send."),

        //Sender account number is required.
        body("message_from")
        .trim()
        .isInt()
        .withMessage("Cannot send a meesage without a valid account number."),

    ]
}

/* *********************
 * Check data and return errors or continue to send message.
 * ********************* */
validate.checkSendMessageData = async (req, res, next) => {
    const { message_to, message_subject, message_body, message_from } = req.body
    const select = await utilities.getAccountToAdd(message_to)
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("message/new-message", {
            errors,
            title: "New Message",
            nav,
            select,
            message_subject,
            message_body,


        })
    return
    }
    next()
}

/* ******************
 * Reply message data validation rules
******************** */
validate.replyMessageRules = () => {
    return [

        //A registered account recipient is required.
        body("message_to")
        .trim()
        .isInt()
        .withMessage("Please select a message recipient account."),

        //A message subject is required.
        body("message_subject")
        .trim()
        .isLength({min: 1})
        .withMessage("Please enter a message subject"),

        //A message body is required.
        body("message_body")
        .trim()
        .isLength({min: 1})
        .withMessage("Please include a message to send."),

        //Sender account number is required.
        body("message_from")
        .trim()
        .isInt()
        .withMessage("Cannot send a message without a valid account number."),

        //An original message id is required.
        body("message_original_id")
        .trim()
        .isInt()
        .withMessage("Please include the original message_id.")
    ]
}



/* *********************
 * Check data and return errors or continue to reply message.
 * ********************* */
validate.checkReplyMessageData = async (req, res, next) => {
    const { message_to, message_subject, message_body, message_from, message_original_id } = req.body
    const select = await utilities.getAccountForReply(message_to)
    const sentTo = await accModel.getAccountDetailsById(message_to)
    const senderName = sentTo.account_firstname + " " + sentTo.account_lastname
    const message = await messModel.getMessageById(message_original_id)
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("message/reply", {
            errors,
            title: "Reply to: " + sentTo.account_firstname + " " + sentTo.account_lastname,
            nav,
            select,
            message_subject: "RE: " + message.message_subject,
            message_body: message_body,
            message_from,
            message_to,
            senderName,
            message_id: message_original_id,
        })
    return
    }
    next()
}

/* ******************
 * Send message data validation rules
******************** */
validate.checkMessageIdRules = () => {
    return [

        //Sender account number is required.
        body("message_id")
        .trim()
        .isInt()


    ]
}

/* *********************
 * Check data and return errors or continue to perform button action.
 * ********************* */
validate.checkMessageIdData = async (req, res, next) => {
    const { message_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        req.flash("failure", "Unable to perform action without a message identifier.")
        res.redirect("/message")
    }
    next()
}

module.exports = validate