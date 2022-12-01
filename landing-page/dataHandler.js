const key = "chamados-info"

function getLabels(input_date, input_department, input_description, input_employee, input_equipment) {
    const date = document.createElement("p")
    date.textContent = input_date
    const department = document.createElement("p")
    department.textContent = input_department
    const description = document.createElement("p")
    description.textContent = input_description
    const employee = document.createElement("p")
    employee.textContent = input_employee
    const equipment = document.createElement("p")
    equipment.textContent = input_equipment
    return [
        equipment,
        date,
        employee,
        department,
        description,
    ]
}

export function createElement({ id, input_date, input_department, input_description, input_employee, input_equipment }) {
    const dataContainer = document.createElement("div")
    dataContainer.className = "data-container"
    const dataTitle = document.createElement("p")
    dataTitle.className = "data-title"
    dataTitle.textContent = `Chamado #${id}`

    const dataContent = document.createElement("div")
    dataContent.className = "data-content"

    const labels = getLabels(input_date, input_department, input_description, input_employee, input_equipment)

    dataContent.appendChild(dataTitle)
    labels.map((lb) => {
        dataContent.appendChild(lb)
    })

    dataContainer.appendChild(dataContent)

    const buttonsContainer = document.createElement("div")
    buttonsContainer.className = "buttons-container"

    const editButton = document.createElement("button")
    editButton.className = "edit-button"
    editButton.textContent = "Editar"
    editButton.addEventListener("click", editItem(id))
    buttonsContainer.appendChild(editButton)

    const deleteButton = document.createElement("button")
    deleteButton.className = "delete-button"
    deleteButton.textContent = "Deletar"
    deleteButton.addEventListener("click", deleteItem(id))
    buttonsContainer.appendChild(deleteButton)
    dataContainer.appendChild(buttonsContainer)

    return dataContainer
}

function deleteItem(id) {
    return (e) => {
        console.log(id)

        //save data
        let { data } = JSON.parse(localStorage.getItem(key)) ?? { data: [] }
        data = data.filter((obj) => {
            return obj.id !== id;
        });
        console.log(data)
        localStorage.setItem(key, JSON.stringify({ data }))

        loadChamados()
    }
}

function editItem(id) {
    return (e) => {
        const editMessage = document.querySelector("#edit_message")
        editMessage.value = "Editando Chamado " + id
        console.log(id)

        let { data } = JSON.parse(localStorage.getItem(key)) ?? { data: [] }
        const [dataToEdit] = data.filter((obj) => {
            return obj.id === id;
        });
        console.log(dataToEdit)
        fillFields(dataToEdit)
        // console.log(data)
        // localStorage.setItem(key, JSON.stringify({ data }))

        // loadChamados()
    }
}

function fillFields({ input_date, input_department, input_description, input_employee, input_equipment }) {
    document.querySelector("#input_date").value = input_date
    document.querySelector("#input_department").value = input_department
    document.querySelector("#input_description").value = input_description
    document.querySelector("#input_employee").value = input_employee
    document.querySelector("#input_equipment").value = input_equipment
}

export function loadDataSection() {
    const [completeButton] = [
        document.querySelector("#complete-button"),
    ]
    completeButton.addEventListener("click", saveData)

    loadChamados()
}

export function loadChamados() {
    const section = document.querySelector(".data-section")
    // remove previous childs
    section.innerHTML = ""
    const { data } = JSON.parse(localStorage.getItem(key))
    console.log(data)
    data.map((item) => {
        section.appendChild(createElement(item))
    })
}

export function validateData(data) {
    // let isValid = false
    const errorKeys = []
    for (let [key, val] of Object.entries(data)) {
        // console.log(key + "- " + val)
        if (!val && key !== "edit_message") errorKeys.push(key)
    }

    return { errorKeys, isValid: errorKeys.length == 0 }
}

export function saveData() {
    const [formHTML] = [
        document.querySelector("#chamado-form")
    ]
    const form = new FormData(formHTML)

    const temp_data = {
        id: crypto.randomUUID().substring(0, 5)
    }
    let isEditing = false
    for (let pair of form.entries()) {
        temp_data[pair[0].replace("-", "_")] = pair[1]
        if (pair[0] == "edit_message" && pair[1]) {
            isEditing = true
        }
        try {
            paintField(pair[0], "white")
        } catch (e) {
            //do nothing
            // console.log(e)
        }
    }

    const { errorKeys, isValid } = validateData(temp_data)
    if (!isValid || errorKeys.length > 0) {
        errorKeys.map((key) => {
            paintField(key, "red")
        })
        return;
    }

    //save data
    if (!isEditing) {
        const previousData = JSON.parse(localStorage.getItem(key)) ?? { data: [] }
        previousData.data.push(temp_data)
        localStorage.setItem(key, JSON.stringify(previousData))
    } else {
        const { data } = JSON.parse(localStorage.getItem(key)) ?? { data: [] }

        const id = temp_data.edit_message.slice(-5)
        temp_data.id = id

        const newData = data.filter((obj) => { return obj.id !== id })
        newData.push(temp_data)
        localStorage.setItem(key, JSON.stringify({ data: newData }))
    }

    loadChamados()
    //reset form
    formHTML.reset()
}

function paintField(fieldName, color) {
    let input = document.querySelector(`form[name='form'] input[name='${fieldName}']`);
    if (fieldName == "input_description") {
        input = document.querySelector(`textarea[name='${fieldName}']`);
    }
    input.style.backgroundColor = color
}