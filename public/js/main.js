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

async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}

async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}