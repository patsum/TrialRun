var db = require("../config/db");

exports.all = function() {
    return db.rows('GetAllPosts', []);
}

exports.write = function(p) {
    return db.row('InsertPost', [p.title, p.userid, p.categoryid, p.content]);
}

exports.read = function(id) {
    return db.row('GetSinglePost', [id]);
}

exports.update = function(p) {
    return db.empty('UpdatePost', [p.id, p.title, p.content, p.categoryid]);
}

exports.delete = function(id) {
    return db.empty('DeletePost', [id]);
}