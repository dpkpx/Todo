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
    let temp = document.querySelector('#ullist');
    for (let index = 0; index < temp.children.length; index++) {
        if (temp.children[index].children[0].children[0].children[0]) {
            temp.removeChild(temp.children[index])
            index--;
        }
    }
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
    let keys = [];
    let start;
    let end;
    let key = checkbox.id.replace('c', '');
    let temp = JSON.parse(localStorage.getItem(key));
    data.key = key;
    data.input = temp.input;
    data.isChecked = checkbox.checked;
    let found = false;
    let data1 = {
        key: "0",
        input: '',
        isChecked: false,
    }
    let off = 0;
    for (let index = 0; index < localStorage.length + off; index++) {
        if (localStorage.getItem(index)) {

            keys.push(index);

        } else {
            off++;
        }
    }
    if (checkbox.checked) {
        checkbox.parentElement.parentElement.setAttribute("style", "text-decoration: line-through; font-size:20px;color: #fff;text-transform:capitalize;font-family:'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;");
        for (let i = 0; i < keys.length; i++) {
            if (JSON.parse(localStorage.getItem(keys[i])).isChecked == true) {
                 end = i;
                data.key = keys[i + 1];
            }
        }
        if (end==undefined) {
            end = -1;
            data.key = keys[0];
        }


        //  data.key = keys[0];
        for (let i = keys.length - 1; i > end; i--) {
            if (keys[i] == key) {
                found = true;
            }
            if (found) {
                if (keys[i] != key) {
                    data1.key = keys[i] + 1;
                    data1.input = JSON.parse(localStorage.getItem(keys[i])).input
                    data1.isChecked = JSON.parse(localStorage.getItem(keys[i])).isChecked;
                    localStorage.setItem(keys[i] + 1, JSON.stringify(data1))
                }
                localStorage.removeItem(keys[i])
            }
        }

    } else {
        checkbox.parentElement.parentElement.setAttribute("style", "font-size:20px;color: #fff;text-transform:capitalize;font-family:'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;")
        for (let i = 0; i < keys.length; i++) {
            if (keys[i] == key) {
                start = i;
            }
            if (JSON.parse(localStorage.getItem(keys[i])).isChecked == false) {
                end = i;
                data.key = keys[i - 1];
                break;
            } else {
                end = keys.length;
                data.key = keys[keys.length - 1];
            }
        }

        for (let i = start; i < end; i++) {
            if (keys[i] != key) {
                data1.key = keys[i] - 1;
                data1.input = JSON.parse(localStorage.getItem(keys[i])).input
                data1.isChecked = JSON.parse(localStorage.getItem(keys[i])).isChecked;
                localStorage.setItem(keys[i] - 1, JSON.stringify(data1))
            } else {
                localStorage.removeItem(keys[i]);

            }
        }

    }
   localStorage.setItem(data.key, JSON.stringify(data));
    update();
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