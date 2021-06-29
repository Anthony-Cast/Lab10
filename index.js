
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
    let ReportsTo = req.params.id;
    let sql = "SELECT EmployeeID, LastName, FirstName, Title FROM lab10_employees.employees where ReportsTo = ?";
    let params = [ReportsTo];
    conn.query(sql, params, function (err,results){
        if (err) throw err;
        res.json(results);
    });
});

app.get("/empleados/getByTitle/:title",function (req, res) {
    let Title = req.params.title;
    let sql="SELECT EmployeeID, LastName, FirstName, Title FROM lab10_employees.employees where Title =?";
    let params=[Title];
    conn.query(sql,params,function (err,results){
        if(err) throw err;
        res.json(results);
    })
});

app.listen(3000,function (){
   console.log("Servidor levantado");
});