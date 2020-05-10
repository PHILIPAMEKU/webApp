const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const Schema = mongoose.Schema


const app = express()

const urlencodedParser = bodyParser.urlencoded({ extended: true})


//create a schema for todo-list
const todoSchema = new Schema({
    name: {type: String},
    list: {type: Array}
})


//create collection(model) for the todoSchema
const todo = mongoose.model('Todo', todoSchema)



//connect to mongodb
mongoose.connect('mongodb://localhost/employeedb', {useNewUrlParser: true, useUnifiedTopology: true})
mongoose.Promise = global.Promise

//set up template engine
app.set('view engine', 'ejs')

//static files
app.use('public', express.static('/public'))

//body parser for displaying contents in text
app.use(bodyParser.text())

//body parser for accessing contents of the post request
app.use(bodyParser.urlencoded({ extended: true}))

//set up routes
app.get('/', function(req, res){
    res.render('homeView')
})

app.get('/employeeList', function(req, res){
    todo.find({}, {name:1, _id:0}).then(function(employee){
        res.render('employeeListView', {employee})
    })
    //const employeelist = todo.find({}, {name: 1, _id:0})
    //console.log(employeelist)
    
})

app.get('/todoList', function(req, res){
    todo.find({}, {name: 1, _id:0}).then(function(todolist){
        
        res.render('todoListView', {todolist})
    })
    
})
app.get('/addEmployee', function(req, res){
    res.render('addEmployeeView')
})

app.post('/Employees', urlencodedParser, function(req, res){
    console.log(req.body)
    const   employee = new todo(req.body).save()
    res.render('addEmployeeView')
})

//listen to port
app.listen(3000)
console.log('listening on port 3000')