let timer;
let tempCurrentTodo;
let todos = {};
let doNotAnimation = false
let animate = true

// ===================== flag ====================
let editMode = false;
// ===============================================
updateScreen();

let todosWrapper = document.querySelector(".todosWrapper");

todosWrapper.addEventListener("pointerdown", pointerDown);

document.querySelector(".inputWrapper form").addEventListener("submit", handelSubmit)


todosWrapper.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    let todo = e.target.closest(".todo")
    if (!todo) return;
    showMenu(todo);
    todo.querySelector("input[type='checkbox']").disabled = true;
});


function pointerDown(e) {
    clearTimer();
    let todo = e.target.closest(".todo")
    if (!todo) return;
    timer = setTimeout(() => {
        showMenu(todo);
        todo.querySelector("input[type='checkbox']").disabled = true;
    }, 1300)
    document.body.addEventListener("pointerup", clearTimer, { once: true })
}


function clearTimer() {
    if (!timer) return
    clearTimeout(timer)
}


function showMenu(todo) {
    let contextMenu = todo.querySelector(".contextMenu")
    contextMenu.style.display = "block"
    contextMenu.focus();
    contextMenu.addEventListener("focusout", () => {
        contextMenu.style = "display:block;opacity:0"
        setTimeout(() => {
            contextMenu.style = "display:none"
            todo.querySelector("input[type='checkbox']").disabled = false;
        }, 500)
    }, { once: true })
}


function editTodo(editButton) {
    editMode = true;
    let todo = editButton.parentElement.parentElement
    let todoText = todo.querySelector(".todoText").innerText
    let inputBox = document.querySelector('#inputbox')
    tempCurrentTodo = todo
    inputBox.focus();
    inputBox.value = todoText

}


function deleteTodo(deleteButton) {
    let todo = deleteButton.parentElement.parentElement
    todo.parentElement.removeChild(todo)
    let todoId = todo.querySelector("input[type='checkbox']").id.replace("c", "")
    delete todos[todoId]

    updateLocalStorage();
}


function addTodoToScreen(id, isChecked, todoText, animate) {
    let todosContainerNew = document.querySelector(".todosContainerNew")
    let todosContainerDone = document.querySelector(".todosContainerDone")

    let todo = document.createElement("li")
    todo.className = "todo"
    if (animate) {
        todo.className = "todo listWithAnimation";
        setTimeout(function () {
            todo.className = todo.className + " show";
        }, 10);
    }

    todo.innerHTML = `
    <label>
        <div class="todoContent">
            <input type="checkbox" id="c${id}" onclick="todoStateChange(this)" ${isChecked ? "checked" : ""}>
            <label for="c${id}"></label>
            <div class="todoText">
                <span >${todoText}</span>
            </div>
        </div>
   </label>
   <div class="contextMenu" tabindex="0">
        <button type="button" title="edit" class="edit" onclick="editTodo(this)"></button>
        <button type="button" title="delete" class="delete" onclick="deleteTodo(this)"></button>
   </div>
    `;
    isChecked ? todosContainerDone.prepend(todo) : todosContainerNew.prepend(todo)
}


function handelSubmit(e) {

    e.preventDefault();

    let inputbox = document.querySelector('#inputbox')
    if (!inputbox.value) return

    let todoText = inputbox.value
    let id = Date.now()
    let isChecked = false;

    if (editMode) {
        tempCurrentTodo.querySelector(".todoText span").innerText = todoText;
        id = tempCurrentTodo.querySelector("input[type='checkbox']").id.replace("c", "")
        isChecked = tempCurrentTodo.querySelector(`#c${id}`).checked
        editMode = false;

    } else {

        addTodoToScreen(id, isChecked, todoText, animate)
    }

    todos[id] = { id, isChecked, todoText };
    updateLocalStorage();
    inputbox.value = "";
}


function updateLocalStorage() {
    localStorage.setItem("todos", JSON.stringify(todos))
}


function updateScreen() {
    todos = JSON.parse(localStorage.getItem("todos"))
    if (!todos) localStorage.setItem("todos", JSON.stringify({}))
    let ids = Object.keys(todos).map((id => parseInt(id))).sort((a, b) => a - b)

    ids.forEach((id) => {
        addTodoToScreen(id, todos[id].isChecked, todos[id].todoText, doNotAnimation)
    })

    let hideCompleted = JSON.parse(localStorage.getItem("hideCompleted"))

    if (hideCompleted) {
        document.querySelector("#chk").checked = true;
        document.querySelector(".todosContainerDone").style = "height:0px";
        setTimeout(function () {
            document.querySelector(".todosContainerDone").style = "";

        }, 500);
    }

}

function todoStateChange(checkbox) {
    let todo = checkbox.parentElement.parentElement.parentElement
    let oldTodoId = checkbox.id.replace("c", "")
    let isChecked = checkbox.checked
    let todoText = todos[oldTodoId].todoText
    let id = Date.now()

    delete todos[oldTodoId]
    todos[id] = { id, isChecked, todoText };
    checkbox.id = "c" + id;

    if (isChecked) {
        let todosContainerDone = document.querySelector(".todosContainerDone")
        todosContainerDone.insertBefore(todo, todosContainerDone.children[0])
    } else {
        let todosContainerNew = document.querySelector(".todosContainerNew")
        todosContainerNew.insertBefore(todo, todosContainerNew.children[0])
    }

    todo.className = "todo listWithAnimation";
    setTimeout(function () {
        todo.className = todo.className + " show";
    }, 10);

    updateLocalStorage();


}

function hideCompleted(checkbox) {
    let isHidden = !!checkbox.checked
    localStorage.setItem("hideCompleted", isHidden)

}

function deleteAllDoneTodo(){
    let ids = Object.keys(todos).map((id => parseInt(id)))

    ids.forEach((id) => {
        if(todos[id].isChecked){
            delete todos[id];
           
        }
    })
    updateLocalStorage();
   document.querySelector(".todosContainerDone").innerHTML="";
}