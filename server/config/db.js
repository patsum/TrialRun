var mysql = require("mysql");

var pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "patrick",
    password: "powerpower",
    database: "AngularBlog"
});

exports.pool = pool;

//CALL A MYSQL QUERY THAT HAS NO RETURN VALUES
exports.empty = function (procedure, values) {
    return sendQuery(procedure, values).then(function () {
        return;
    })
};

//CALL A MYSQL QUERY THAT RETURNS A SINGLE ROW
exports.row = function (procedure, values) {
    return sendQuery(procedure, values).then(function (resultSets) {
        return resultSets[0][0];
    })
};

//CALL A MYSQL QUERY THAT RETURNS MULTIPLE ROWS
exports.rows = function (procedure, values) {
    return sendQuery(procedure, values).then(function (resultSets) {
        return resultSets[0];
    })
};

function sendQuery(procedure, values) {
    return new Promise(function (fulfill, reject) {
        pool.getConnection(function (err, connection) {
            if (err) {
                reject(err);
            } else {
                var queryString = "CALL " + procedure + parseParams(values.length);
                connection.query(queryString, values, function (err, resultSets) {
                    connection.release();
                    if (err) {
                        reject(err);
                    } else {
                        fulfill(resultSets);
                    }
                })
            }
        })
    })
}

//CALL SomeProcedure -- > (?, ?, ?, ?) - If there's 4 parameters
function parseParams(amount) {
    var output = "";
    for (var i = 1; i <= amount; i++) {
        output += (i == amount ? "?" : "?, ");
    }
    return "(" + output + ")"
}