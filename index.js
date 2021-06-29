console.log("Hola");
const express = require('express');
const mysql = require('mysql2');

const app = express();

let conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'lab10_employees'
});

conn.connect(function(err){
    if(err) throw err;
    console.log("Conexión exitosa a base de datos");
});

app.get("/empleados/get",function (req, res){
    conn.query("SELECT EmployeeID, LastName, FirstName, Title FROM lab10_employees.employees", function (err,results){
        if (err) throw err;
        res.json(results);
    });
});

app.get("/empleados/getManagerEmployees/:id",function (req, res){
    let ReportsTo = req.param.id
    let sql = "SELECT EmployeeID, LastName, FirstName, Title FROM lab10_employees.employees where ReportsTo = ?"
    let params = [ReportsTo];
    conn.query(sql, params, function (err,results){
        if (err) throw err;
        res.json(results);
    });
});