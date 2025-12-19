const todoInput = document.getElementById("todo-input")
const todoAdd = document.getElementById("add-todo")
const todoPlans = document.getElementById("todo-plans")

const inprogressInput = document.getElementById("inprogress-input")
const inprogressAdd = document.getElementById("add-inprogress")
const inprogressPlans = document.getElementById("inprogress-plans")

const doneInput = document.getElementById("done-input")
const doneAdd = document.getElementById("add-done")
const donePlans = document.getElementById("done-plans")

let todoArray = JSON.parse(localStorage.getItem("todoArray")) || []
let inprogressArray = JSON.parse(localStorage.getItem("inprogressArray")) || []
let doneArray = JSON.parse(localStorage.getItem("doneArray")) || []

function saveArray(array, name) {
    localStorage.setItem(name, JSON.stringify(array))
}


let draggedElement = null

function enableDrag(element) {
    element.setAttribute("draggable", "true")

    element.addEventListener("dragstart", () => {
        draggedElement = element
        setTimeout(() => {
            element.style.opacity = "0.3"
        }, 0)
    })

    element.addEventListener("dragend", () => {
        element.style.opacity = "1"
        draggedElement = null
    })
}

document.querySelectorAll(".plans").forEach(container => {
    container.addEventListener("dragover", e => {
        e.preventDefault()
        const afterElement = getDragAfterElement(container, e.clientY)
        if (!afterElement) container.appendChild(draggedElement)
        else container.insertBefore(draggedElement, afterElement)
    })

    container.addEventListener("drop", () => {
        updateLocalStorage()
    })
})

function getDragAfterElement(container, y) {
    const elements = [...container.querySelectorAll(".plan:not(.dragging)")]

    return elements.reduce((closest, child) => {
        const box = child.getBoundingClientRect()
        const offset = y - box.top - box.height / 2
        if (offset < 0 && offset > closest.offset) {
            return { offset, element: child }
        } else return closest
    }, { offset: Number.NEGATIVE_INFINITY }).element
}


function updateLocalStorage() {
    function extract(container) {
        return [...container.querySelectorAll(".plans-list")].map(i => i.textContent)
    }

    todoArray = extract(todoPlans)
    inprogressArray = extract(inprogressPlans)
    doneArray = extract(donePlans)

    saveArray(todoArray, "todoArray")
    saveArray(inprogressArray, "inprogressArray")
    saveArray(doneArray, "doneArray")
}




function createPlanElement(textContent, array, name) {
    const text = document.createElement("div")
    text.className = "plan"

    const lists = document.createElement("p")
    lists.className = "plans-list"
    lists.textContent = textContent

    enableDrag(text)  

    const selectMenu = document.createElement("div")
    selectMenu.innerHTML = `<button class="delete-btn">🗑️</button>`
    selectMenu.style.display = "none"

    text.appendChild(lists)
    text.appendChild(selectMenu)

    lists.addEventListener("click", (e) => {
        e.stopPropagation()
        selectMenu.style.display = "block"
    })

    const deletebtn = selectMenu.querySelector(".delete-btn")
    deletebtn.addEventListener("click", (e) => {
        e.stopPropagation()
        text.remove()
        const index = array.indexOf(textContent)
        if (index > -1) array.splice(index, 1)
        saveArray(array, name)
    })

    return text
}

function createLists(input, container, array, name) {
    const value = input.value.trim()
    if (!value) return

    array.push(value)
    saveArray(array, name)

    const planElement = createPlanElement(value, array, name)
    container.appendChild(planElement)

    input.value = ""
}

todoAdd.addEventListener("click", () => {
  createLists(todoInput, todoPlans, todoArray, "todoArray")
})
inprogressAdd.addEventListener("click", () => {
  createLists(inprogressInput, inprogressPlans, inprogressArray, "inprogressArray")
})
doneAdd.addEventListener("click", () => {
  createLists(doneInput, donePlans, doneArray, "doneArray")
})

document.addEventListener("click", () => {
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.parentElement.style.display = "none"
    })
})

function loadSaved(array, container, name) {
    array.forEach(item => {
        const planElement = createPlanElement(item, array, name)
        container.appendChild(planElement)
    })
}

loadSaved(todoArray, todoPlans, "todoArray")
loadSaved(inprogressArray, inprogressPlans, "inprogressArray")
loadSaved(doneArray, donePlans, "doneArray")


const darkmode = document.querySelector(".dark-mode")

darkmode.addEventListener("click", ()=>{
    document.body.classList.toggle("dark")
})