export function getAllEquipments(){
    return[
        "Monitor",
        "Teclado Mecânico",
        "Teclado Decente",
        "Mouse"
    ]
}
export function getAllDepartments(){
    return[
        "Dep. #01",
        "Departamento TI",
        "Departamento Aloha"
    ]
}

export function loadAllHtmlInputs(){
    const [ inputEquipment, inputDepartment ] = [
        document.querySelector("#input_equipment"),
        document.querySelector("#input_department")
    ]

    const equipments = getAllEquipments()
    equipments.map((item) => {
        let option = document.createElement("option")
        option.textContent = item
        option.value = item
        inputEquipment.appendChild(option)
    })
    const departments = getAllDepartments()
    departments.map((item) => {
        let option = document.createElement("option")
        option.textContent = item
        option.value = item
        inputDepartment.appendChild(option)
    })
}