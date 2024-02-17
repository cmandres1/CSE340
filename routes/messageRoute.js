const express = require("express")
const router = new express.Router()
const messController = require("../controllers/messageController")
const utilities = require("../utilities/")
const messValidate = require('../utilities/message-validation')

//Route to build message inbox view
router.get("/", 
utilities.checkLogin,
utilities.handleErrors(messController.buildInbox))

//Route to build message archive view
router.get("/archived",
utilities.checkLogin,
utilities.handleErrors(messController.buildArchiveInbox))

//Route to build message view
router.get("/read/:messageId",
utilities.checkLogin,
utilities.handleErrors(messController.buildMessageView))

//Route to build new message view
router.get("/new-message",
utilities.checkLogin,
utilities.handleErrors(messController.buildNewMessage))

//Route to process sending new message
router.post("/new-message",
utilities.checkLogin,
messValidate.sendMessageRules(),
messValidate.checkSendMessageData,
utilities.handleErrors(messController.sendNewMessage))

//Route to build reply to message view
router.post("/reply",
utilities.checkLogin,
utilities.handleErrors(messController.buildReplyMessage))

//Route to send the reply message
router.post("/send-reply",
utilities.checkLogin,
messValidate.replyMessageRules(),
messValidate.checkReplyMessageData,
utilities.handleErrors(messController.sendReplyMessage)
)

//Route to mark message as read
router.post("/mark-read",
utilities.checkLogin,
messValidate.checkMessageIdRules(),
messValidate.checkMessageIdData,
utilities.handleErrors(messController.markRead))

//Route to archive message
router.post("/archive",
utilities.checkLogin,
messValidate.checkMessageIdRules(),
messValidate.checkMessageIdData,
utilities.handleErrors(messController.archiveMessage))

//Route to delete a message
router.post("/delete", 
utilities.checkLogin,
messValidate.checkMessageIdRules(),
messValidate.checkMessageIdData,
utilities.handleErrors(messController.deleteMessage))

module.exports = router;