const pool = require("../database/")

/**********************
 * Return messages using account_id 
 **********************/
async function getMessageByAccountId (account_id) {
    try {
        const sql = 'SELECT i.*, c_to.*, c_from.account_id AS message_from_account_id, c_from.account_firstname AS message_from_firstname, c_from.account_lastname AS message_from_lastname FROM public.message as i JOIN public.account AS c_to ON i.message_to = c_to.account_id JOIN public.account AS c_from ON i.message_from = c_from.account_id WHERE i.message_to = $1 ORDER BY i.message_created DESC'
        const messages = await pool.query(sql, [account_id])
            return  messages.rows


    } catch (error) {
        console.error("Model error " + error) 
        return new Error("No messages found for that id.")
    }

}




/**********************
 * Return archived messages using account_id 
 **********************/
async function getArchivedMessagesByAccountID (account_id) {
    try {
        const sql = 'SELECT i.*, c_to.*, c_from.account_id AS message_from_account_id, c_from.account_firstname AS message_from_firstname, c_from.account_lastname AS message_from_lastname FROM public.message as i JOIN public.account AS c_to ON i.message_to = c_to.account_id JOIN public.account AS c_from ON i.message_from = c_from.account_id WHERE i.message_to = $1 AND i.message_archived = true ORDER BY i.message_created DESC'
        const messages = await pool.query(sql, [account_id])
            return  messages.rows


    } catch (error) {
        console.error("Model error " + error) 
        return new Error("No messages found for that id.")
    }

}

/**********************
 * Return non-archived messages using account_id 
 **********************/
async function getNoArchiveMessagesByAccountID (account_id) {
    try {
        const sql = 'SELECT i.*, c_to.*, c_from.account_id AS message_from_account_id, c_from.account_firstname AS message_from_firstname, c_from.account_lastname AS message_from_lastname FROM public.message as i JOIN public.account AS c_to ON i.message_to = c_to.account_id JOIN public.account AS c_from ON i.message_from = c_from.account_id WHERE i.message_to = $1 AND i.message_archived = false ORDER BY i.message_created DESC'
        const messages = await pool.query(sql, [account_id])
            return  messages.rows


    } catch (error) {
        console.error("Model error " + error) 
        return new Error("No messages found for that id.")
    }

}
/**********************
 * Return messages by message id
 **********************/
async function getMessageById (message_id) {
    try {
        const sql = 'SELECT i.*, c_to.*, c_from.account_id AS message_from_account_id, c_from.account_firstname AS message_from_firstname, c_from.account_lastname AS message_from_lastname FROM public.message as i JOIN public.account AS c_to ON i.message_to = c_to.account_id JOIN public.account AS c_from ON i.message_from = c_from.account_id WHERE i.message_id = $1'
        const messages = await pool.query(sql, [message_id])
            return  messages.rows[0]


    } catch (error) {
        console.error("Model error " + error) 
        return new Error("No messages found.")
    }

}

/* **********************
 * Send message
 * ********************* */
async function sendMessage(
    message_subject,
        message_body,
        message_to,
        message_from
    ){
        try {
        const sql = "INSERT INTO public.message (message_subject, message_body, message_to, message_from) VALUES ($1, $2, $3, $4) RETURNING *"

        return await pool.query(sql, [
            message_subject,
            message_body,
            message_to,
            message_from])


        } catch (error) {
        return error.message

    }
}

/* **********************
 * Mark message as Read
 * ********************* */
async function markMessageRead(message_id){
    try {
        const sql = "UPDATE public.message SET message_read = true WHERE message_id = $1 RETURNING *"
        const data = await pool.query(sql, [
            message_id
        ])
            return data.rows[0]
    } catch (error) {
        console.error("Model error " + error) 
    }
}

/* **********************
 * Archive
 * ********************* */
async function archiveMessage(message_id){
    try {
        const sql = "UPDATE public.message SET message_archived = true WHERE message_id = $1 RETURNING *"
        const data = await pool.query(sql, [
            message_id
        ])
            return data.rows[0]
    } catch (error) {
        console.error("Model error " + error) 
    }
}


/* **********************
 * Delete message
 * ********************* */
async function deleteMessage(message_id){
    try {
        const sql = "DELETE FROM message WHERE message_id = $1"
        const data = await pool.query(sql, [message_id])
        return data
    } catch (error) {
        console.error("Delete message Error ") 
    }
}

module.exports = { getMessageByAccountId, getMessageById, sendMessage, deleteMessage, markMessageRead, archiveMessage, getArchivedMessagesByAccountID, getNoArchiveMessagesByAccountID}