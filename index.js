
const express = require('express');
const mysql = require('mysql2');
const bodyParser=require('body-parser');
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

//Pregunta 1
app.get("/empleados/get",function (req, res){
    conn.query("SELECT EmployeeID, LastName, FirstName, Title FROM lab10_employees.employees", function (err,results){
        if (err) throw err;
        res.json(results);
    });
});

//Pregunta 2
app.get("/empleados/getManagerEmployees/:id",function (req, res){
    let ReportsTo = req.params.id;
    let sql = "SELECT EmployeeID, LastName, FirstName, Title FROM lab10_employees.employees where ReportsTo = ?";
    let params = [ReportsTo];
    conn.query(sql, params, function (err,results){
        if (err) throw err;
        res.json(results);
    });
});

//Pregunta 3
app.get("/empleados/getByTitle/:title",function (req, res) {
    let Title = req.params.title;
    let sql="SELECT EmployeeID, LastName, FirstName, Title FROM lab10_employees.employees where Title =?";
    let params=[Title];
    conn.query(sql,params,function (err,results){
        if(err) throw err;
        res.json(results);
    })
});

//Pregunta 4
app.post("/empleados/update",bodyParser.urlencoded({extended:true}), function (req,res){
    var id = req.body.Id;
    var address = req.body.Address;
    var email = req.body.Email;
    if(address == null){
        var sql = "update employees set Email=? where EmployeeID=?";
        var params =[email,id];
    }
    else if(email==null){
        var sql = "update employees set Address=? where EmployeeID=?";
        var params =[address,id];
    }
    else{
        var sql = "update employees set Email=?,Address=? where EmployeeID=?";
        var params =[email,address,id];
    }
    conn.query(sql,params,function (err,results)
    {
        if (err){
            res.json({
                "status":"error",
                "message":err.sqlMessage
            });
        }
        else{
            res.json({
                "status":"ok",
                "message":"Employee updated"
            });
        }
    });
});

//Pregunta 5
app.get("/productos/get",function (req,res){
    var page = parseInt(req.query.page);
    if(Number.isNaN(page)){
        res.json({
            "status":"error",
            "message":"Numero de página no existe"
        });
    }
    else {
        var resultPerPage = 10;
        var sql = "select ProductID,ProductName,UnitPrice,UnitsInStock from lab10_employees.products";
        conn.query(sql, function (err, results) {
            var pages = Math.ceil(results.length / 10);
            if (page <= 0 || page > pages) {
                res.json({
                    "status": "error",
                    "message": "Numero de página no existe"
                });
            }
            if (err) {
                res.json({
                    "status": "ok",
                    "message": err.sqlMessage
                });
            }
            var resultCort = results.slice((page - 1) * resultPerPage, page * resultPerPage);
            res.json(resultCort);
        });
    }
});

//Pregunta 6
app.post("/categorias/create",bodyParser.urlencoded({extended:true}),function (req,res) {
    var name = req.body.name;
    var description = req.body.description;
    var picture = req.body.picture;
    if(name == null||description == null||picture == null){
        res.json({
            "status":"error",
            "message":"Missing parameters"
        });
    }
    else if(!(picture.endsWith(".jpg")||picture.endsWith(".png"))){
        res.json({
            "status":"error",
            "message":"Picture doesn't have correct extension"
        });
    }
    else {
        var sql = "INSERT INTO `lab10_employees`.`categories` (`CategoryName`, `Description`, `Picture`) VALUES (?, ?, ?)";
        var params = [name, description, picture];
        conn.query(sql, params, function (err, results) {
            if (err) {
                res.json({
                    "status": "error",
                    "message": err.sqlMessage
                });
            }
            res.json({
                "status": "ok",
                "message": "Category created"
            });
        });
    }
});

//Puerto
app.listen(3000,function (){
   console.log("Servidor levantado");
});