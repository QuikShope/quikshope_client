const _config = require("./config")
const config = new _config();

var shop = require("./shop");
var customer = require("./customer");
var auth = require("./auth");
var inventory = require("./inventory");

function initQuikShope(username){
    config.update_username(username);
    console.log("QuikShope initiated");
}


module.exports = {
    init: initQuikShope,
    authenticate : auth,
    customer : customer,
    inventory : inventory,
    shop : shop
}

