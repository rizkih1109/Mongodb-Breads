// Variables
let id = null, title = '', complete = '', page = 1, limit = 10, sortBy = '_id', sortMode = 'desc';
let deadline = '', startdateDeadline = '', enddateDeadline = '';

// Support functions

function getId(_id) {
    id = _id
}

const browseData = () => {
    title = $('#searchTitle').val()
    startdateDeadline = $('#startdateDeadline').val()
    enddateDeadline = $('#enddateDeadline').val()
    if($('#completeTodo').val()) complete = $('#completeTodo').val()
    readData()
}

const resetData = () => {
    title = ''
    startdateDeadline = ''
    enddateDeadline = ''
    complete = ''
    $('#searchTitle').val('')
    $('#startdateDeadline').val('')
    $('#enddateDeadline').val('')
    $('#compelteTodo').val('')
    readData()
}

const sortAsc = (deadline) => {
    console.log(deadline, 'dedada')
    sortBy = deadline
    sortMode = 'asc'
    let ascMode = `
    <div class="row mb-3 px-3" onclick="sortDesc('deadline')">
        <div class="col-sm-2">
            <button class="btn btn-success"><i class="fa-solid fa-sort-down"></i> sort by deadline</button>
        </div>
        <div class="col-sm-10">
            <button class="btn btn-warning"><i class="fa-solid fa-rotate"></i></button>
            <button class="btn btn-info" type="submit"><i class="fa fa-search"></i></button>
        </div>
    </div>
    `
    $('#changeSort').html(ascMode)
    readData()
}

const sortDesc = (deadline) => {
    console.log(deadline)
    sortBy = deadline
    sortMode = 'desc'
    let descMode = `
    <div class="row mb-3 px-3" onclick="sortAsc('deadline')">
        <div class="col-sm-2">
            <button class="btn btn-success"><i class="fa-solid fa-sort-up"></i> sort by deadline</button>
        </div>
        <div class="col-sm-10">
            <button class="btn btn-warning"><i class="fa-solid fa-rotate"></i></button>
            <button class="btn btn-info" type="submit"><i class="fa fa-search"></i></button>
        </div>
    </div>
    `
    $('#changeSort').html(descMode)
    readData()
}

// Main functions
const readData = async () => {
    try {
        const todos = await $.ajax({
            url: `/api/todos`,
            method: "GET",
            dataType: "json",
            data: {
                executor,
                sortBy,
                sortMode,
                deadline,
                title,
                startdateDeadline,
                enddateDeadline,
                complete
            }
        })
        let list = ''
        todos.data.forEach((item, index) => {
            list += `
        <div id="${item._id}" class="foot2 ${item.complete == false && new Date(`${item.deadline}`).getTime() < new Date().getTime() ? ' alert alert-danger' : item.complete == true ? ' alert alert-success' : ' alert alert-secondary'}" role="alert">
              ${moment(item.deadline).format('DD-MM-YYYY HH:mm')} ${item.title}
            <div>
            <a type="button" onclick="getData('${item._id}')" data-bs-toggle="modal" data-bs-target="#edit"><i class="fa-solid fa-pencil"></i></a>
            <a type="button" onclick="getId('${item._id}')" data-bs-toggle="modal" data-bs-target="#delete"><i class="fa-solid fa-trash mx-2"></i></a>
            </div>
        </div>
        `
        })
        $('#showTodos').html(list)
    } catch (e) {
        alert('pengambilan data gagal')
    }
}
readData()

const addData = async () => {
    try {
        title = $('#title').val()
        const a_day = 24 * 60 * 60 * 1000
        const todos = await $.ajax({
            url: `/api/todos`,
            method: "POST",
            dataType: "json",
            data: {
                title,
                executor
            }
        });
        newlist = `
        <div id="${todos[0]._id}" class="foot2 ${todos[0].complete == false && new Date(`${todos[0].deadline}`).getTime() < new Date().getTime() ? ' alert alert-danger' : todos[0].complete == true ? ' alert alert-success' : ' alert alert-secondary'}" role="alert">
            ${moment(new Date(Date.now() + a_day)).format('DD-MM-YYYY HH:mm')} ${title}
            <div>
            <a type="button" onclick="getData('${todos[0]._id}')" data-bs-toggle="modal" data-bs-target="#edit"><i class="fa-solid fa-pencil"></i></a>
            <a type="button" onclick="getId('${todos[0]._id}')" data-bs-toggle="modal" data-bs-target="#delete"><i class="fa-solid fa-trash mx-2"></i></a>
            </div>
        </div>
        `
        $('#showTodos').prepend(newlist)
        $('#title').val('')
    } catch (e) {
        alert('Data gagal ditambahkan')
    }
}

const getData = async (_id) => {
    try {
        getId(_id)
        const todo = await $.ajax({
            url: `/api/todos/${_id}`,
            method: "GET",
            dataType: "json",
        });
        $('#editTitle').val(todo.title)
        $('#editDeadline').val(moment(todo.deadline).format('YYYY-MM-DDThh:mm'))
        $('#editComplete').prop('checked', todo.complete)
    } catch (e) {
        console.log(e)
        alert('tidak dapat menampilkan data')
    }
}

const editData = async () => {
    try {
        title = $('#editTitle').val()
        deadline = $('#editDeadline').val()
        complete = $('#editComplete').prop('checked')
        const a_day = 24 * 60 * 60 * 1000
        const todo = await $.ajax({
            url: `/api/todos/${id}`,
            method: "PUT",
            dataType: "json",
            data: {
                title,
                executor,
                deadline,
                complete: Boolean(complete)
            }
        });
        let newData = ''
        newData += `
        ${moment(new Date(Date.now() + a_day)).format('DD-MM-YYYY HH:mm')} ${title}
        <div>
        <a type="button" onclick="getData('${todo._id}')" data-bs-toggle="modal" data-bs-target="#edit"><i class="fa-solid fa-pencil"></i></a>
        <a type="button" onclick="getId('${todo._id}')" data-bs-toggle="modal" data-bs-target="#delete"><i class="fa-solid fa-trash mx-2"></i></a>
        </div>
        `
        $(`#${todo._id}`).attr('class', `foot2 ${todo.complete == false && new Date(`${todo.deadline}`).getTime() < new Date().getTime() ? ' alert alert-danger' : todo.complete == true ? ' alert alert-success' : ' alert alert-secondary'}`).html(newData)
    } catch (e) {
        console.log(e)
        alert('Perubahan data gagal')
    }
}


const deleteData = async () => {
    try {
        const todo = await $.ajax({
            url: `/api/todos/${id}`,
            method: "DELETE",
            dataType: "json",
        })
        $(`#${id}`).remove()

    } catch (error) {

    }
}