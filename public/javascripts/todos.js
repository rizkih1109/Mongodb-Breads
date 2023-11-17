// Variables
let id = null, title = '', complete = '', page = 1, query = '', limit = 10, sortBy = '_id', sortMode = 'desc', deadline = '';

// Support functions

function getId(_id) {
    id = _id
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
                sortMode
            }
        })
        let list = ''
        todos.data.forEach((item, index) => {
            list += `
        <div id="${item._id}" class="foot2 alert alert-secondary" role="alert">
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
        <div id="${todos[0]._id}" class="foot2 alert alert-secondary" role="alert">
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
        $(`#${todo._id}`).attr('class', "foot2 alert alert-secondary").html(newData)
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