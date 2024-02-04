const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
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

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" ></a>'
      grid += '<div class="namePrice">'
      grid += '<hr>'
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


/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
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

Util.passwordButton = async function () {
    const pswdBtn = document.querySelector("#ShowPswdBtn");
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

Util.buildOptions = async function() {
    const classificationData = await invModel.getClassifications()
    let options = ''
    const classInner = [classificationData.rows]
    classInner[0].forEach(classification => {
        options += `<option value= ${classification.classification_id} >${classification.classification_name}</option>`
    })
    return options
}


/* 
Middleware For Handling Errors
Wrap other function in this for 
General Error Handling
*/
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util