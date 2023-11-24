// Variables
let id = null, condition = null, page = 1, query = '', limit = 5, sortBy = '_id', sortMode = 'desc';


// Support functions
function getId(_id) {
    id = _id
}

let button = document.getElementById('mybutton')
button.onclick = () => {
    condition ? addData() : editData()
}

let addButton = document.getElementById('addButton')
addButton.onclick = () => {
    condition = true
    const name = document.getElementById('name').value = ""
    const phone = document.getElementById('phone').value = ""
}

const sortNameAsc = (name) => {
    sortBy = name
    sortMode = 'asc'
    let random = `<a type="button" onclick="sortPhoneAsc('name')"><i class="fa-solid fa-sort"></i></a> Phone</th>`
    let sortAsc = `
    <a type="button" onclick="sortNameDesc('name')"><i class="fa-solid fa-sort-up"></i></a>
    <span>Name</span>
    `
    document.getElementById(`sort-name`).innerHTML = sortAsc
    document.getElementById(`sort-phone`).innerHTML = random
    readData()
}

const sortNameDesc = (name) => {
    sortBy = name
    sortMode = 'desc'
    let sortDesc = `
    <a type="button" onclick="sortNameAsc('name')"><i class="fa-solid fa-sort-down"></i></a>
    <span>Name</span>
    `
    document.getElementById(`sort-name`).innerHTML = sortDesc
    readData()
}

const sortPhoneAsc = (phone) => {
    sortBy = phone
    sortMode = 'asc'
    let random = `<a type="button" onclick="sortPhoneAsc('name')"><i class="fa-solid fa-sort"></i></a> Phone</th>`
    let sortAsc = `
    <a type="button" onclick="sortPhoneDesc('phone')"><i class="fa-solid fa-sort-up"></i></a>
    <span>Phone</span>
    `
    document.getElementById(`sort-phone`).innerHTML = sortAsc
    document.getElementById(`sort-name`).innerHTML = random
    readData()
}

const sortPhoneDesc = (phone) => {
    sortBy = phone
    sortMode = 'desc'
    let sortDesc = `
    <a type="button" onclick="sortPhoneAsc('phone')"><i class="fa-solid fa-sort-down"></i></a>
    <span>Phone</span>
    `
    document.getElementById(`sort-phone`).innerHTML = sortDesc
    readData()
}

const browse = () => {
    const name = document.getElementById('name').value
    const phone = document.getElementById('phone').value
    let inputData = document.getElementById('inputData').value
    query = inputData.toString()
    page = 1
    readData()
}

const clear = () => {
    query = document.getElementById('inputData').value = ''
    readData()
}

const chooselimit = () => {
    limit = document.getElementById('showData').value
    page = 1
    readData()
}

const changePage = async (num) => {
    page = num
    readData(page)
}

document.getElementById('form-user').addEventListener('submit', (event) => {
    event.preventDefault()
    addData()
})

document.getElementById('form-user').addEventListener('submit', (event) => {
    event.preventDefault()
    editData()
})

// Main functions
const readData = async () => {
    let pagination = ""
    let pageNumber = ""
    const response = await fetch(`http://localhost:3000/api/users?query=${query}&page=${page}&limit=${limit}&sortBy=${sortBy}&sortMode=${sortMode}`);
    const users = await response.json();
    let html = ''
    const offset = users.offset
    users.data.forEach((item, index) => {
        html += `
        <tr>
                <th scope="row">${index + offset + 1}</th>
                <td>${item.name}</td>
                <td>${item.phone}</td>
                <td>
                    <button class="btn btn-success" type="button" onclick="getoneData('${item._id}')" data-bs-toggle="modal" data-bs-target="#addData"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn btn-danger" onclick="getId('${item._id}')" type="button" data-bs-toggle="modal" data-bs-target="#deleteData"><i class="fa-solid fa-trash"></i></button>
                    <a href="/users/${item._id}/todos" class="btn btn-warning"><i class="fa-solid fa-right-to-bracket"></i></a>
                </td>
            </tr>
        `
    });

    for (let i = 1; i <= users.pages; i++) {
        pageNumber += `<a class="page-link ${page == i ? ' active' : ''}" id="button-pagination" onclick="changePage(${i})">${i}</a>`
    }

    if (document.getElementById('showData').value == 0) {
        pagination += `
        <span class="mx-2 mt-1">Showing ${users.offset + 1} to ${users.total} of ${users.total} entries </span>
        <div class="page">
        <a class="page-link active" id="button-pagination">1</a>
        </div>
        `
    } else {
        pagination += `
        <span class="mx-2 mt-1">Showing ${users.offset + 1} to ${(Number(limit) + Number(users.offset)) >= users.total ? Number(users.total) : Number(limit) + Number(users.offset)} of ${users.total} entries </span>
        <div class="page">
        ${users.page == 1 ? '' : '<a onclick="changePage(page - 1)" class="page-link" arial-lable="back"><span arial-hidden = true">&laquo</span></a>'}
        ${pageNumber}
        ${users.page == users.pages ? '' : '<a onclick="changePage(page + 1)" class="page-link" arial-lable="next"><span arial-hidden = true">&raquo</span></a>'}
        </div>
        `
    }

    document.getElementById('button-pagination').innerHTML = pagination
    document.getElementById('users-table-tbody').innerHTML = html
}
readData()

const addData = async () => {

    const name = document.getElementById('name').value
    const phone = document.getElementById('phone').value
    const response = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, phone })
    });
    const users = await response.json();
    document.getElementById('name').value = ""
    document.getElementById('phone').value = ""
    readData()
}

const getoneData = async (_id) => {
    condition = false
    const response = await fetch(`http://localhost:3000/api/users/${_id}`)
    const user = await response.json();
    getId(user._id)
    document.getElementById('name').value = user.name
    document.getElementById('phone').value = user.phone
}

const editData = async () => {
    const name = document.getElementById('name').value
    const phone = document.getElementById('phone').value
    const response = await fetch(`http://localhost:3000/api/users/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, phone })
    });
    const users = await response.json();
    document.getElementById('name').value = ""
    document.getElementById('phone').value = ""
    readData()
}

const deleteData = async () => {
    const response = await fetch(`http://localhost:3000/api/users/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        }
    });
    const users = await response.json();
    readData()
}

const pageTodos = async (id) => {
    const response = await fetch(`http://localhost:3000/users/${id}/todos`)
    const todos = await response.json()
}

