const invModel = require("../models/inventory-model")
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

/* 
Middleware For Handling Errors
Wrap other function in this for 
General Error Handling
*/
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util