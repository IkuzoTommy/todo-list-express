const deleteBtn = document.querySelectorAll('.fa-trash') //assigns a varible that will allow js to target the html element with the specified class
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

//creates an array from the all of the delete item buttons
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem) // adds an event listener to each item's delete button that will execute the deleteItem function.
})
//creates an array from every list item in class item.
Array.from(item).forEach((element)=>{ //creates an array from each list item
    element.addEventListener('click', markComplete) // runs the function when the user clicks the span with the class 'item'.
})

Array.from(itemCompleted).forEach((element)=>{ // when items are marked completed they are sorted seperately and in an array.
    element.addEventListener('click', markUnComplete) // assigns an event listener to items specifically in this class to beable to later unmark them as complete.
})

async function deleteItem(){ // dispatched on click via event listener
    const itemText = this.parentNode.childNodes[1].innerText // assigns current item in focus to a varible for later use.
    try{ //happens first
        const response = await fetch('deleteItem', { //promise awaits the servers response and runs the delete item function
            method: 'delete', //deletes content
            headers: {'Content-Type': 'application/json'}, //spcifies the content type that will be returned.
            body: JSON.stringify({ //grabs the db object and converts it to a json object that is able to be parsed through.
              'itemFromJS': itemText
            })
          })
        const data = await response.json() // awaits 'response' to be completed and stores it into the 'data' variable
        console.log(data)
        location.reload() // reloads the page on the client side

    }catch(err){ // if try fails this executes and console logs the err for debugging
        console.log(err)
    }
}

async function markComplete(){ // function inititialization, this function will allow the user to mark things complete
    const itemText = this.parentNode.childNodes[1].innerText // references the text that is within the second child of the parent section of the current item in focus
    try{ //tries this line of code first to carry out the function
        const response = await fetch('markComplete', { // awaits and assigns the response of the fetch to a constant named 'response'. Also begins specifying the 'options' of the response.
            method: 'put', // updates content
            headers: {'Content-Type': 'application/json'}, //signifies that the response should be JSON
            body: JSON.stringify({ // grabs object and converts it into json that can be parsed through
                'itemFromJS': itemText
            })
          })
        const data = await response.json() // waits for the fetch to be completed before storing it into another varibale 'data'.
        console.log(data) // prints data recieved into the console
        location.reload() // reloads the page

    }catch(err){ // if the 'try' in unsuccessful then this code executes
        console.log(err) // prints to the conslole what error was incurred 
    }
}

async function markUnComplete(){ // function initialization that will allow the user to mark things incomplete after marking them complete.
    const itemText = this.parentNode.childNodes[1].innerText // targets the text of the second child within the parent node of the item in focus
    try{ //executes first
        const response = await fetch('markUnComplete', { // awaits the response of the function and outlines specific settings of how the response should be given
            method: 'put', //update content
            headers: {'Content-Type': 'application/json'}, // should be a json object when the response is given.
            body: JSON.stringify({ // grabs item and converts the object into json that is able to be parsed through
                'itemFromJS': itemText
            })
          })
        const data = await response.json() // awaits the response of the function and resulting json and stores it into a variable 'data'.
        console.log(data) // prints the response to the console
        location.reload() //reloads the page

    }catch(err){ // executes only if the 'try' doesnt work
        console.log(err) // console logs the error type to the console for debugging
    }
}