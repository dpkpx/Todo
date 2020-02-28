//upadating from local storage
update();
//creating span 
let p = document.createElement('span');
p.id = 'span';
p.style = "color: crimson";
document.querySelector('#inputdiv').appendChild(p)

//object  
let data = {
    key: "0",
    input: '',
    isChecked: false,
}

//getting input
let todo;
document.querySelector('#form').addEventListener('submit', (event) => {
    event.preventDefault();
    add();
});
function add() {
    todo = document.querySelector('#inputbox').value
    if (todo) {


        //storing data
        try {
            data.key = (parseInt(document.querySelector('#ullist').children[0].children[0].children[0].children[0].id.replace('c', '')) + 1).toString();
        }
        catch (err) {
            data.key = "0";
        }
        data.input = todo;
        data.isChecked = false;
        localStorage.setItem(data.key, JSON.stringify(data))
        //adding todo to the screen
        addRecord(data.key, data.input, data.isChecked);
        //clearing the input field
        document.querySelector('#inputbox').value = '';
        document.querySelector('#span').textContent = '';

    } else {
        if (!(document.querySelector('#span').textContent)) {
            p.textContent = 'Please enter a todo first';
        }
    }
}

// removing the checked item
function remove() {
    let temp = document.querySelector('#ullist');
    for (let index = 0; index < temp.children.length; index++) {
        if (temp.children[index].children[0].children[0].children[0].checked) {
            localStorage.removeItem(temp.children[index].children[0].children[0].children[0].id.replace('c', ''));
            temp.removeChild(temp.children[index])
            index--;
        }
    }
}

//function for updating from localstorage
function update() {
    let off = 0;
    for (let index = 0; index < localStorage.length + off; index++) {
        if (localStorage.getItem(index)) {

            addRecord(JSON.parse(localStorage.getItem(index)).key, JSON.parse(localStorage.getItem(index)).input, JSON.parse(localStorage.getItem(index)).isChecked)

        } else {
            off++;
        }
    }

}

//function to update checkbox
function checkdone(checkbox) {
    let key = checkbox.id.replace('c', '');
    let temp = JSON.parse(localStorage.getItem(key));
    data.key = key;
    data.input = temp.input;
    data.isChecked = checkbox.checked;
    localStorage.setItem(data.key, JSON.stringify(data))
    if (checkbox.checked) {
        checkbox.parentElement.parentElement.setAttribute("style", "text-decoration: line-through; font-size:20px;color: #fff;text-transform:capitalize;font-family:'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;")
    } else {
        checkbox.parentElement.parentElement.setAttribute("style", "font-size:20px;color: #fff;text-transform:capitalize;font-family:'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;")
    }

}

//function for adding record
function addRecord(key, inputdata, checked) {
    const list = document.createElement('li')
    list.className = 'list'
    list.setAttribute("style", "list-style-type:none;border-radius: 5px;  padding: 3px;margin-top: 5px; background-color:#3f3f3f;")
    let der = document.querySelector('#ullist')
    der.insertBefore(list, der.childNodes[0])
    //adding label
    let label = document.createElement('label')
    label.className = 'firstlevel'
    label.setAttribute("style", " font-size:20px;color: #fff;text-transform:capitalize;font-family:'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;")
    let lists = document.querySelectorAll('.list')
    lists[0].appendChild(label)
    //creating div
    const div = document.createElement('div');
    div.className = "round";
    div.setAttribute("style", "padding-bottom: 5px;")
    let label2 = document.querySelectorAll('.firstlevel');
    label2[0].appendChild(div);
    //adding checkbox
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.id = 'c' + key;// assigning id
    checkbox.setAttribute('onclick', 'checkdone(this)')
    checkbox.setAttribute("style", "width: 27px;height: 27px;")
    if (checked) {
        checkbox.setAttribute('checked', '')//assigning boolean
        label.setAttribute("style", "text-decoration: line-through; font-size:20px;color: #fff;text-transform:capitalize;font-family:'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;")
    }
    let finaldiv = document.querySelectorAll('.round');
    finaldiv[0].appendChild(checkbox)
    //adding label for checkbox
    const label3 = document.createElement('label')
    label3.setAttribute("for", 'c' + key)
    let divround = document.querySelectorAll('.round')
    divround[0].appendChild(label3)
    // adding text node 
    let text = document.createTextNode("" + inputdata);// assigning todo data
    lists[0].children[0].children[0].appendChild(text)
}