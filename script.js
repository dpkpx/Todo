import {doc,  deleteDoc, uid, db, query,where, getDocs, setDoc,  onSnapshot, collection } from "./firebase.js"
let tempCurrentTodo;
// let doNotAnimation = false
// let animate = true
// ===================== flag ====================
let editMode = false;
// ===============================================

let todosWrapper = document.querySelector(".todosWrapper");
todosWrapper.addEventListener("contextmenu", showCustomMenu);


let inputBox = document.querySelector(".inputWrapper form");
inputBox.addEventListener("submit", handelSubmit)


function showCustomMenu(e) {
    e.preventDefault();
    let todo = e.target.closest(".todo")
    if (!todo) return;
    customMenu(todo);
    todo.querySelector("input[type='checkbox']").disabled = true;
}

function customMenu(todo) {
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

function addTodoToScreen(id, isChecked, todoText, animate=true) {
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
        id = parseInt(tempCurrentTodo.querySelector("input[type='checkbox']").id.replace("c", ""))
        isChecked = tempCurrentTodo.querySelector(`#c${id}`).checked
        editMode = false;

    }
    inputbox.value = "";

    setDoc(doc(db, `${uid}/todos/MyTodos`, String(id)), {

        isChecked: isChecked,
        todoText: todoText
    });

}

window.todoStateChange = function (checkbox) {
    let todo = checkbox.parentElement.parentElement.parentElement
    let idOld = checkbox.id.replace("c", "")
    let isChecked = checkbox.checked
    let todoText = todo.querySelector(".todoText").innerText
    let id = Date.now();

    todo.parentElement.removeChild(todo)
    
    deleteDoc(doc(db, `${uid}/todos/MyTodos`, String(idOld)));


    setDoc(doc(db, `${uid}/todos/MyTodos`, String(id)), {

        isChecked: isChecked,
        todoText: todoText
    });

}

window.hideCompleted = function (checkbox) {
    let isHidden = !!checkbox.checked
    localStorage.setItem("hideCompleted", isHidden)

}

window.deleteAllDoneTodo = async function () {

    document.querySelector(".todosContainerDone").innerHTML = "";

    const q = query(collection(db, `${uid}/todos/MyTodos`), where("isChecked", "==", true));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((docRef) => {
        // doc.data() is never undefined for query doc snapshots
        deleteDoc(doc(db, `${uid}/todos/MyTodos`, String(docRef.id)));

    });

}

window.openMenu = function () {
    document.querySelector(".friends").style = "display:flex"
}

window.closeMenu = function () {
    document.querySelector(".friends").style = ""
}

window.editTodo = function (editButton) {
    editMode = true;
    let todo = editButton.parentElement.parentElement
    let todoText = todo.querySelector(".todoText").innerText
    let inputBox = document.querySelector('#inputbox')
    tempCurrentTodo = todo
    inputBox.focus();
    inputBox.value = todoText

}

window.deleteTodo = function (deleteButton) {
    let todo = deleteButton.parentElement.parentElement
    todo.parentElement.removeChild(todo)
    let todoId = todo.querySelector("input[type='checkbox']").id.replace("c", "")
   
    deleteDoc(doc(db, `${uid}/todos/MyTodos`, String(todoId)));
}


const q = query(collection(db, `${uid}/todos/MyTodos`));
onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
            console.log("Added : ", change.doc.id);
            addTodoToScreen(change.doc.id, change.doc.data().isChecked, change.doc.data().todoText)
        }
        if (change.type === "modified") {
            console.log("Modified : ", change.doc.data());
        }
        if (change.type === "removed") {
            console.log("Removed : ", change.doc.data());
        }
    });
});

