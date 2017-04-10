var db = require("../config/db");

exports.all = function() {
    return db.rows('GetAllUsers', []);
}

exports.read = function(id) {
    return db.row('GetSingleUser', [id]);
}

exports.readByEmail = function(email) {
    return db.row('GetUserByEmail', [email]);
}

exports.delete = function(id) {
    return db.empty('DeleteUser', [id]);
}