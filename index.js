
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