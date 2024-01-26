const utilities = require("../utilities")

const errorCont = {}

errorCont.errBuilder = async function(req,res,next){
    next({status: 500, message: "Oh no! I crashed, maybe try a different route?"})
}

module.exports = errorCont