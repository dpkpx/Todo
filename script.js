//upadating from local storage
update();
//creating span 
let p = document.createElement('span');
p.id = 'span';
p.style = "color: crimson";
document.querySelector('#inputdiv').appendChild(p)

//object  

let data = {
    key: 0,
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
        //checking for available key
        let off = 0;
        for (let i = 0; i < document.querySelector('#ullist').children.length + off; i++) {
            if (!(localStorage.getItem(i))) {
                data.key = i;
                break;
            } else {
                off++;
            }
        }
        //storing data
        data.input = todo;
        data.isChecked = false;
        localStorage.setItem(data.key, JSON.stringify(data))
        // creating list
        const list = document.createElement('li')
        list.className = 'list'
        list.setAttribute("style", "list-style-type: none")
        let der = document.querySelector('#ullist')
        der.insertBefore(list, der.childNodes[0])
        //adding label
        const label = document.createElement('label')
        let lists = document.querySelectorAll('.list')
        lists[0].appendChild(label)
        //adding checkbox
        const checkbox = document.createElement('input')
        checkbox.type = 'checkbox';
        checkbox.id = 'c' + data.key
        checkbox.setAttribute('onclick', 'checkdone(this)')
        lists[0].children[0].appendChild(checkbox)
        // adding text node 
        let text = document.createTextNode(todo);
        lists[0].children[0].appendChild(text)
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
        if (temp.children[index].children[0].children[0].checked) {
            localStorage.removeItem(temp.children[index].children[0].children[0].id.replace('c', ''));
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
            const list = document.createElement('li')
            list.className = 'list'
            list.setAttribute("style", "list-style-type:none; margin-left: 0px;")
            //list.setAttribute("style", "margin-left: 10px")
            let der = document.querySelector('#ullist')
            der.insertBefore(list, der.childNodes[0])
            //adding label
            const label = document.createElement('label')
            let lists = document.querySelectorAll('.list')
            lists[0].appendChild(label)
            //adding checkbox
            const checkbox = document.createElement('input')
            checkbox.type = 'checkbox'
            checkbox.id = 'c' + JSON.parse(localStorage.getItem(index)).key
            checkbox.setAttribute('onclick', 'checkdone(this)')
            if (JSON.parse(localStorage.getItem(index)).isChecked) {
                checkbox.setAttribute('checked', '')
            }
            //checkbox.setAttribute('checked', '')
            lists[0].children[0].appendChild(checkbox)
            // adding text node 
            let text = document.createTextNode(JSON.parse(localStorage.getItem(index)).input);
            lists[0].children[0].appendChild(text)
        } else {
            off++;
        }
    }

}
//function to update checkbox
function checkdone(checkbox) {
    let key = checkbox.id.replace('c', '');
    let temp = JSON.parse(localStorage.getItem(key));
    data.key = parseInt(key);
    data.input = temp.input;
    data.isChecked = checkbox.checked;
    localStorage.setItem(data.key, JSON.stringify(data))

}