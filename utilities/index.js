const invModel = require("../models/inventory-model")
const accModel = require("../models/account-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* 
 Build the classification view HTML
*/
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
        grid = '<ul class="inv-display">'
        data.forEach(vehicle => { 
            grid += ' <li>'
            grid +=  ' <a href="../../inv/detail/'+ vehicle.inv_id + '" class="picture-anchor" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
            + ' details"><img src="' + vehicle.inv_thumbnail 
            +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
            +' on CSE Motors" /></a>'
            grid += '<div class="namePrice">'
            grid += '<hr />'
            grid += '<h2>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
            + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
            + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
            grid += '</h2>'
            grid += '<span>$' 
            + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '</div>'
            grid += '</li>'
          })
          grid += '</ul>'
        } else {
            grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
        }
        return grid
    }
/* 
Build the grid for the details page
*/
Util.buildDetailsGrid = async function (dataObj) {
    let grid = ''
    dataObj.forEach(data => {
    grid =`
    <img class="car-picture" src="${data.inv_image}" alt="Image of ${data.inv_make} ${data.inv_model} on CSE Motors">
    <div class="details-inner-box">
    <h2 class="car-detail-name">${data.inv_make} ${data.inv_model} Details</h2>
    <span class="price"><b>Price:</b> ${new Intl.NumberFormat('en-US',{style: 'currency', currency: 'USD'}).format(data.inv_price)}</span>
    <p class="desc-text"><b>Description:</b> ${data.inv_description}</p>
    <span class="color"><b>Color:</b> ${data.inv_color}</span>
    <span class="mileage"><b>Miles:</b> ${new Intl.NumberFormat('en-US').format(data.inv_miles)}</span>
    </div>`         
    });
    return grid
}

/*
Constructs the nav HTML unordered list
*/
Util.getNav = async function (req, res, next){
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) =>{
        list += "<li>"
        list +=
        '<a href="/inv/type/' +
        row.classification_id +
        '" title="See our inventory of ' +
        row.classification_name +
        ' vehicles">' +
        row.classification_name +
        "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}
/* 
Show password button function
*/
Util.passwordButton = async function () {
    const pswdBtn = document.querySelector("#ShowPdwdBtn");
    pswdBtn.addEventListener("click", function() {
    const pswdInput = document.getElementById("pword");
    const type = pswdInput.getAttribute("type");
    if (type == "password") {
        pswdInput.setAttribute("type", "text");
        pswdBtn.innerHTML = "Hide Password";
    } else {
        pswdInput.setAttribute("type", "password");
        pswdBtn.innerHTML = "Show Password";
    }
});
}

/* 
Get the classification names to build the options dinamically for the add Inventory form 
*/
Util.buildClassificationList = async function(classification_id = "1") {
    const classificationData = await invModel.getClassifications()
    let options = `<select name="classification_id" id="classification_id" class="classificationList" required ><option value="">Classification</option>`
    const classInner = [classificationData.rows]
    classInner[0].forEach(classification => {
        // check if the current option matches the last selected classification_id
        let selected = ""
        if (classification.classification_id == classification_id) {
            selected = "selected" 
        }
        options += `<option value= ${classification.classification_id} ${selected}>${classification.classification_name}</option>`
    })
    options += `</select>`

    return options
}

/* 
Middleware to check token validity 
*/
Util.checkJWTToken = (req, res, next) => {
    if (req.cookies.jwt) {
     jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
       if (err) {
        req.flash("Please log in")
        res.clearCookie("jwt")
        return res.redirect("/account/login")
       }
       res.locals.accountData = accountData
       res.locals.loggedin = 1
       next()
      })
    } else {
     next()
    }
   }

   Util.checkLogin = (req, res, next) => {
    if (res.locals.loggedin) {
      next()
    } else {
      req.flash("notice", "Please log in.")
      return res.redirect("/account/login")
    }
   }

   Util.checkAccountType = (req, res, next) => {
    
    if (res.locals.accountData.account_type == 'Employee' || res.locals.accountData.account_type == 'Admin') {
      next();
    } else {
      req.flash("notice", "You don't have sufficient permissions to access this page.")
      return res.redirect("/account/login")
    }
   }


/* Handle Account Message */
/******************
 * Check if messages are unread
*******************/
Util.checkIfUnread = async function(messages) {
    let unreadMessages = []  
    messages.forEach(message => {
        if (!message.message_read) {
            unreadMessages.push(message)
          }
      })
      return unreadMessages
    }
  
    /******************
   * Check if messages are archived
  *******************/
  Util.checkIfArchived = async function(messages) {
    let archivedMessages = []  
    messages.forEach(message => {
          if(message.message_archived) {
            archivedMessages.push(message)
          }
      })
      return archivedMessages
    }
  
  /****************
   * Build inbox table
   ****************/
    Util.buildInboxTable = async function(messages) {
  
      // Set up the table labels
      let dataTable = '<table id="inbox">'
      dataTable += '<thead>'
      dataTable += '<tr><th>Received</th><th>Subject</th><th>From</th><th>Read</th></tr>'
      dataTable += '</thead>'
  
      // Set up the table body
      dataTable += '<tbody>'
  
      // Iterate over all the messages in the array and put each in a row
      for (let message of messages) {
        let date = new Date(message.message_created)
        let formattedDate = date.toLocaleDateString();
        let formattedTime = date.toLocaleTimeString([],{ hour: 'numeric', minute: '2-digit', hour12: true })
      dataTable += '<tr>'
      dataTable += `<td>${formattedDate} ${formattedTime}</td>`
      dataTable += `<td><a href="/message/read/${message.message_id}" title="Click to view message">${message.message_subject}</a></td>`
      dataTable += `<td>${message.message_from_firstname} ${message.message_from_lastname}</td>`
      dataTable += `<td>${message.message_read}</td>`
      dataTable += '</tr>'
      };
  
      dataTable += '</tbody>'
      dataTable += '</table>'
  
      return dataTable;
      }
  
  /****************
   * Build message view
   ****************/
    Util.buildMessage = async function(message) {
      const date = new Date(message.message_created)
      const formattedDate = date.toLocaleDateString();
      const formattedTime = date.toLocaleTimeString([],{ hour: 'numeric', minute: '2-digit', hour12: true });
      let messageInfo = "<ul>" 
      messageInfo += `<li class="bold">Subject: <span class="no-bold">${message.message_subject}</span></li>`
      messageInfo += `<li class="bold">From: <span class="no-bold">${message.message_from_firstname} ${message.message_from_lastname}</span></li>`
      messageInfo += `<li class="bold">Sent: <span class="no-bold">${formattedDate} ${formattedTime}</span></li>`
      messageInfo += `<li class="bold">Message: <p class="no-bold" id="message_body">${message.message_body}</p></li>`
      messageInfo += "</ul>"
      return messageInfo
      }
  /*****************
  * Build account select
  ******************/
  Util.getAccountToAdd = async function (selectedAccount) {
    let data = await accModel.getAccounts()
    let list = '<select name="message_to" id="message_to" required>'
    list += '<option value="">Select a recipient</option>'
    data.rows.forEach((row) => {
      let selected = ""
      if (selectedAccount == row.account_id) {
        selected = "selected"
      }
      list += '<option value="' + row.account_id + '" ' + selected + '>' + row.account_firstname + " " + row.account_lastname + '</option>';
    });   
      list += '</select>'
    return list
  }
  
  /*****************
  * Build account select for reply
  ******************/
  Util.getAccountForReply = async function (selectedAccount) {
    let data = await accModel.getAccountDetailsById(selectedAccount)
    let list = '<select name="message_to" id="message_to" required>'
    const selected = "selected"
    list += '<option value="' + data.account_id + '" ' + selected + '>' + data.account_firstname + " " + data.account_lastname + '</option>';
    list += '</select>'
    return list
  }

/* 
Middleware For Handling Errors
Wrap other function in this for 
General Error Handling
*/
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util