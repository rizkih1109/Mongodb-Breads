let id = null
let condition = null

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

function getId(_id) {
    id = _id
}

document.getElementById('form-user').addEventListener('submit', (event) => {
    event.preventDefault()
    addData()
})

const readData = async () => {
    const response = await fetch("http://localhost:3000/api/users");
    const users = await response.json();
    let html = ''
    users.data.forEach((item, index) => {
        html += `
        <tr>
                <th scope="row">${index + 1}</th>
                <td>${item.name}</td>
                <td>${item.phone}</td>
                <td>
                    <button class="btn btn-success" type="button" onclick="getoneData('${item._id}')" data-bs-toggle="modal" data-bs-target="#addData"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn btn-danger" onclick="getId('${item._id}')" type="button" data-bs-toggle="modal" data-bs-target="#deleteData"><i class="fa-solid fa-trash"></i></button>
                    <button class="btn btn-warning" type="button"><i class="fa-solid fa-right-to-bracket"></i></button>
                </td>
            </tr>
        `
    })
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