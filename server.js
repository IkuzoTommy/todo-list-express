const express = require('express') // creates a variable that allows access to the database, also allows the use of all the installed dependiencies 
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config() // not neccessary to assign to a variable bc we dont need to use methods to use .env


let db, //establishes database connection and assigning them to variables for later use
    dbConnectionStr = process.env.DB_STRING, // creates a variable that hides your DB connection string via the .env file folder
    dbName = 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //allows you to use the .connect method on the MongoClinet variable created earlier to access your connection string. Using the useUnifiedTopology setting to blend mongo and server code.
    .then(client => { //outlines instructions to be carried out after connection to the database is establised.
        console.log(`Connected to ${dbName} Database`) // prints the db's name as to verify connection
        db = client.db(dbName) 
    })
// setting the middleware to process C(post) R(get) U(put) D(delete) operations 
app.set('view engine', 'ejs') // sets the view engine to ejs which will help create the "html" that the user will interact with.
app.use(express.static('public')) // tells express to use everything in the public folder to help render the webpage.
app.use(express.urlencoded({ extended: true }))
app.use(express.json()) //allows express to parse through the json data that is recieved to be manipulated by javascript.

//READ
app.get('/',async (request, response)=>{ // the "/" signifies the index of our website. it then oulines an async function to handle the response from our database.
    const todoItems = await db.collection('todos').find().toArray() // creates and assigns an array that will store the incoming data from the db. in this case a list of everything that needs to be done.
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // this variable will store all the todo items that are still considered not complete by the user.
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // calls upon ejs to render html that will contain all todo items and items that are left which will be later styled by the linked style sheet.

    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})
//CREATE
app.post('/addTodo', (request, response) => { // outlines another user request that can be expected for databse to handle and respond to.
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // targets the todos collection and then uses the .insertOne and request.body being the user input on the webpage and then converted to an object that is added to collection.
    .then(result => {
        console.log('Todo Added') // confirms that the database has recieved the newly added item
        response.redirect('/') // navigates to the index upon successfully adding something, performing another get request to show the newly added todo item.
    })
    .catch(error => console.error(error)) //throws an error if inccured. 
})
//UPDATE
app.put('/markComplete', (request, response) => { //outlines the next request to be expected handled by the db, they serve as routes to the client side js functions
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //similiar to insertOne method, only it adjusts an existing entries completeion status to complete, this removes it from the itemsLeft array.
        $set: { // sets items completeion status to true, which is handled in the get request.
            completed: true
          }
    },{
        sort: {_id: -1}, // untouchable parameter, sorts items in decending order
        upsert: false // disables new entries being created should the existing entry not be found.
    })
    .then(result => {
        console.log('Marked Complete') //confirms in the console that the op was succesful.
        response.json('Marked Complete') // updates the status on the client-side allowing for the updated status to be rendered on the page.
    })
    .catch(error => console.error(error))

})
//this step works the same way only updating the initial put request to show an imcomplete status instead
app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Incomplete')
        response.json('Marked Incomplete')
    })
    .catch(error => console.error(error))

})
//DELETE
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //deletes the document from the todo collection
    .then(result => {
        console.log('Todo Deleted') //prints to the console confirmation that the todo was deleted.
        response.json('Todo Deleted') //updates client-side javascript
    })
    .catch(error => console.error(error))

})
// tells express to create a port and then specifies a port to use should the .env port not work
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})