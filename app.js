const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const path = require('path')
const url = "mongodb://localhost:27017"


const app = express()

const urlencodedParser = bodyParser.urlencoded({ extended: true})

const dbName = 'employeedb'
const collectionName = 'todo'




//connect to mongodb

MongoClient.connect(url, { useUnifiedTopology: true }, function(err, client){
    if(err) throw err;
    console.log("Connected to database")
    const dbo = client.db(dbName)
        dbo.createCollection(collectionName, function(err, res){
        if(err) throw err
        console.log("todo collection created")
        client.close()
        
    })
})



//set up template engine
app.set('view engine', 'ejs')

//static files
app.use(express.static('./public'))


//body parser for displaying contents in text
app.use(bodyParser.text())

//body parser for accessing contents of the post request
app.use(bodyParser.urlencoded({ extended: true}))

//set up routes
app.get('/', function(req, res){
    res.render('homeView')
})

app.get('/employeeList', urlencodedParser, function(req, res){
    
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db(dbName);
      dbo.collection(collectionName).find({}).toArray( function(err, result) {
        if (err) throw err;
        console.log("documents retrieved");
        console.log(result);
        db.close();
        res.render('employeeListView', {result});
        
      });
       
    });
});

    
//get complete list of employees and their todolist and render it in todolist view
app.get('/todoList', function(req, res){
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db(dbName);
        dbo.collection(collectionName).find({}).toArray( function(err, todoresult) {
          if (err) throw err;
          console.log("all todo items retrieved");
          console.log(todoresult);
          db.close();
          res.render('todoListView', {todoresult});
          
        });
         
      });    

    })
    
app.get('/addEmployee', function(req, res){
    res.render('addEmployeeView')
})




//get employee data and save it to 
app.post('/addEmployee', urlencodedParser, function(req, res){
    
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
      if (err) throw err;
      var dbo = db.db(dbName);
      var List = req.body.list.slice(0)
      var splitedList = List.split(/\n/)
      var data = {name: req.body.name, list: []}
      console.log(data)
      
      dbo.collection(collectionName).insertOne(data, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted");
         for(var i = 0; i<splitedList.length; i++){
                console.log(splitedList[i])
                dbo.collection(collectionName).updateOne({name: req.body.name}, { $push:{list: splitedList[i]} })
            }
      });
        
    });
    const feedback = "Employee added succesfully"
    res.render('successView', {feedback});
});

//get todo request and render the the result in todo request view
app.post('/todoRequest', urlencodedParser, function(req, res){
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
      if (err) throw err;
      var query = { name: req.body.name }
      var dbo = db.db(dbName);
      dbo.collection(collectionName).find(query).toArray(function(err, result) {
        if (err) throw err;
        console.log("query made");
        db.close();
        console.log(result)
        console.log(result.length)
        if (result.length == 0){
          res.render('notFoundView')
        }
        else{
          res.render('todoRequestView', {result})
        }
        
      });
        
    });
    
});


//listen to port
app.listen(3000)
console.log('listening on port 3000')