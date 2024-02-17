const utilities = require("../utilities")
const messModel = require("../models/message-model")
const accModel = require("../models/account-model")

/* ************************
 * Deliver inbox view
 * *********************** */

async function buildInbox(req, res, next) {
    let nav = await utilities.getNav();
    const inboxMessages = await messModel.getNoArchiveMessagesByAccountID(res.locals.accountData.account_id)
    const totalMessages = await messModel.getMessageByAccountId(res.locals.accountData.account_id)
    const archivedMessages = await utilities.checkIfArchived(totalMessages)
    const inboxTable = await utilities.buildInboxTable(inboxMessages)
    res.render("message/inbox", {
        title: res.locals.accountData.account_firstname + " " + res.locals.accountData.account_lastname + " Inbox",
        nav,
        errors: null,
        archivedMessage: archivedMessages.length,
        inboxMessages: inboxTable,
    })
}

/* ************************
 * Deliver archive inbox view
 * *********************** */

async function buildArchiveInbox(req, res, next) {
    let nav = await utilities.getNav();
    const inbox = await messModel.getArchivedMessagesByAccountID(res.locals.accountData.account_id)
    const inboxTable = await utilities.buildInboxTable(inbox)
    res.render("message/archived", {
        title: res.locals.accountData.account_firstname + " " + res.locals.accountData.account_lastname + " Archive",
        nav,
        errors: null,
        archivedMessages: inboxTable,
    })
}

/* ************************
 * Deliver message view
 * *********************** */

async function buildMessageView(req, res, next) {
    let nav = await utilities.getNav();
    const messageId = parseInt(req.params.messageId)
    const message = await messModel.getMessageById(messageId)
    const messageInfo = await utilities.buildMessage(message)
    res.locals.message_read = message.message_read
    res.locals.message_archived = message.message_archived
    res.render("message/message", {
        title: message.message_subject,
        nav,
        errors: null,
        messageInfo,
        message_id: messageId
        
    })
}

/* ************************
 * Deliver write message view
 * *********************** */

async function buildNewMessage(req, res, next) {
    let nav = await utilities.getNav();
    const select = await utilities.getAccountToAdd();
    res.render("message/new-message", {
        title: "New Message",
        nav,
        errors: null,
        select
    })
}

/* ************************
 * Process the sending of new message
 * ***********************/

async function sendNewMessage(req, res, next) {
    let nav = await utilities.getNav();
    
    const { 
        message_subject,
        message_body,
        message_to,
        message_from } = req.body
        const select = await utilities.getAccountToAdd(message_to);

    const sendRes = await messModel.sendMessage(
        message_subject,
        message_body,
        message_to,
        message_from
    )

    if(sendRes) {
    const sentTo = await accModel.getAccountById(message_to)
    req.flash("success", `The message to ${sentTo.account_firstname} ${sentTo.account_lastname} sent successfully.`)
    res.redirect("/message")
    
    } else {
        req.flash("failure", "Message failed to send.")
        res.status(500).render(
            "message/new-message", {
                title: "New Message",
                nav,
                errors: null,
                select,
                message_subject,
                message_body,
                message_to,
                message_from,
            
            })
    }

}

/* ************************
 * Deliver reply message view
 * *********************** */

async function buildReplyMessage(req, res, next) {
    const {message_id} = req.body
    console.log("Message ID:", message_id);
    let nav = await utilities.getNav()
    const message = await messModel.getMessageById(message_id)
    const select = await utilities.getAccountForReply(message.message_from)
    console.log("Select:", select);
    const senderName = message.message_from_firstname + " " + message.message_from_lastname
    console.log("Sender Name:", senderName);
    const date = new Date(message.message_created)
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString([],{ hour: 'numeric', minute: '2-digit', hour12: true });
    res.render("message/reply", {
        title: "Reply to: " + senderName,
        nav,
        errors: null,
        select,
        message_subject: "RE: " + message.message_subject,
        senderName,
        message_body:  "&#13;" + "&#13;" + "Sent on: " + formattedDate + " " + formattedTime + "&#13;" + "From: " 
        + senderName + "&#13;" + "Message:" + "&#13;" + "&#13;" + message.message_body,
        message_id: message_id,
        
    })
}

/* ************************
 * Process sending reply
 * ***********************/

async function sendReplyMessage(req, res, next) {
    let nav = await utilities.getNav();
    
    const { 
        message_subject,
        message_body,
        message_to,
        message_from } = req.body
        const select = await utilities.getAccountForReply(message_to);

    const sendRes = await messModel.sendMessage(
        message_subject,
        message_body,
        message_to,
        message_from
    )

    const sentTo = await accModel.getAccountById(message_to)
    if(sendRes) {
    
    req.flash("success", `The message to ${sentTo.account_firstname} ${sentTo.account_lastname} sent successfully.`)
    res.redirect("/message")
    
    } else {
        const senderName = sentTo.account_firstname + " " + sentTo.account_lastname
        req.flash("failure", "Message failed to send.")
        res.status(500).render(
            "message/reply", {
                title: "Reply to: " + senderName,
                nav,
                errors: null,
                select,
                message_subject: message_subject,
                message_body,
                message_to,
                message_from,
                senderName,
            
            })
    }

}

/**********************
 * Mark message as read
 ***********************/
async function markRead(req, res) {
    const { message_id } = (req.body)
    
    const markReadResult = await messModel.markMessageRead(message_id)

    if (markReadResult) {
        req.flash(
            "notice",
            `Message marked as read.`
            )
        res.redirect("/message")
        
    } else {
        req.flash("notice", "Sorry, unable to mark message as read." 
        )
        res.redirect(`/message`)
    }
}

/**********************
 * Archive message
 ***********************/
async function archiveMessage(req, res) {
    const { message_id } = (req.body)
    const archiveResult = await messModel.archiveMessage(message_id)
    
    if (archiveResult) {
        req.flash(
            "success",
            `Message archived.`
            )
        res.redirect("/message")
    } else {
        req.flash("failure", "Sorry, unable to archive message." 
        )
        res.redirect(`/message`)
    }
}

/**********************
 * Delete message
 ***********************/
async function deleteMessage(req, res) {
    const { message_id } = (req.body)
    
    const deleteResult = await messModel.deleteMessage(message_id)

    if (deleteResult) {
        req.flash(
            "success",
            `Message was successfully deleted.`
            )
        res.redirect("/message")
    } else {
        req.flash("failure", "Sorry, the deletion failed." 
        )
        res.redirect(`/message`)
    }
}



module.exports = { 
    buildInbox, 
    buildMessageView, 
    buildNewMessage, 
    sendNewMessage, 
    buildReplyMessage, 
    deleteMessage, 
    sendReplyMessage, 
    markRead, 
    archiveMessage, 
    buildArchiveInbox
}