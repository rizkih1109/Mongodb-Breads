// Variables
let id = null, condition = null, page = 1, query = '', limit = 5, sortBy = '_id', sortMode = 'desc';





const readData = async () => {
    const response = await fetch(`http://localhost:3000/api/todos/`)
    const todos = await response.json()

    let html = ''
    todos.data.forEach((item, index) => {
        html =+ `
        <div>
            
        </div>
        `
    })
}