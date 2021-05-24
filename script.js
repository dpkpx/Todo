//upadating from local storage
update(false);

//boolean to stop users from cleacking multiple time on same element
//(cleacking multiple time on same element while animating results duplicate list items)
let clickAvailable = true;

//object  to receive data
let data = {
    key: "0",
    input: '',
    isChecked: false,
}

//getting input on submit
document.querySelector('#form').addEventListener('submit', (event) => {
    event.preventDefault();
    add();
});


//function to add todo to local storage and Dom
function add() {

    //scrolls to the top
    document.documentElement.scrollTop = 0;

    let todo = document.querySelector('#inputbox').value

    if (todo) {


        //generating key by parsing the id of first element to integer and then adding 1 to it 
        try {
            data.key = (parseInt(document.querySelector('#uList').children[0].children[0].children[0].children[0].id.replace('c', '')) + 1).toString();
        }
        catch (err) {
            //if todo list is empty
            data.key = "0";
        }

        data.input = todo;
        data.isChecked = false;

        //storing data on local storage
        localStorage.setItem(data.key, JSON.stringify(data));

        //adding todo to the screen
        addRecord(data.key, data.input, data.isChecked, true);

        //clearing the input field
        document.querySelector('#inputbox').value = "";


    }
}



// removing the checked items
function remove() {
    let temp = document.querySelector('#uList');
    for (let index = 0; index < temp.children.length; index++) {
        if (temp.children[index].children[0].children[0].children[0].checked) {
            localStorage.removeItem(temp.children[index].children[0].children[0].children[0].id.replace('c', ''));

            temp.children[index].className = "listWithAnimation";

            setTimeout(function () {
                temp.removeChild(temp.children[temp.children.length - 1])
            }, 350);


        }
    }
}

//function for updating from localstorage
function update(animate) {
    //deleting all todos from DOM
    let temp = document.querySelector('#uList');
    temp.textContent = '';


    //recreating all todos  in DOM
    let keys = [];
    for (let i = 0; i < localStorage.length; i++) {
        keys.push(localStorage.key(i));
    }
    keys.sort(function (a, b) { return a - b });


    for (let index of keys) {
        addRecord(JSON.parse(localStorage.getItem(index)).key, JSON.parse(localStorage.getItem(index)).input, JSON.parse(localStorage.getItem(index)).isChecked, animate)

    }


}


//function to bubble up or down lists when checked or unchecked
function checkdone(checkbox) {
    if (clickAvailable) {


        let key = checkbox.id.replace('c', '');
        let temp = JSON.parse(localStorage.getItem(key));


        data.key = key;
        data.input = temp.input;
        data.isChecked = checkbox.checked;


        let tempData = {
            key: "0",
            input: '',
            isChecked: false,
        }

        //getting all available keys from localStorage
        let keys = [];

        for (let i = 0; i < localStorage.length; i++) {
            keys.push(localStorage.key(i));
        }
        keys.sort(function (a, b) { return a - b });




        if (checkbox.checked) {

            clickAvailable = false;
            /*finding the  position to place the checked list
            checked list will be placed just above another already checked list(end) if none then it will be placed at buttom */
            let start;
            let end;
            for (let i = keys.length - 1; i >= 0; i--) {
                if (keys[i] == key) {
                    start = i;
                }
                if (JSON.parse(localStorage.getItem(keys[i])).isChecked == true) {
                    end = i;
                    data.key = keys[i + 1];
                    break;
                } else {
                    end = - 1;
                    data.key = keys[0];
                }
            }
            /*creating empty position for the checked list to be inserted
            shifting will be done between the original position(start) of the cheched list and the end position*/
            for (let i = --start; i > end; i--) {


                tempData.key = keys[i + 1];
                tempData.input = JSON.parse(localStorage.getItem(keys[i])).input;
                tempData.isChecked = JSON.parse(localStorage.getItem(keys[i])).isChecked;
                localStorage.setItem(keys[i + 1], JSON.stringify(tempData));

            }
            /*after this loop there will be a duplicate element  at (end + 1) position
            which will be replaced (outside of if-else block) by the list  which is unchecked  */

            //animating
            let ele = document.querySelector("#" + checkbox.id).parentElement.parentElement.parentElement;
            ele.className = "listWithAnimation";
            setTimeout(function () {
                if (end != -1) {
                    ele.parentNode.insertBefore(ele, ele.parentNode.children[(ele.parentNode.childElementCount - 1) - end]);
                } else {
                    ele.parentNode.appendChild(ele);
                }
            }, 300);

            setTimeout(function () {
                ele.className = ele.className + " show";
            }, 350);



        } else {

            clickAvailable = false;
            /*finding the  position to place the unchecked list
            checked list will be placed just below another already unchecked list(start) if none then it will be placed at top */
            let start;
            let end;
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

            /*creating empty position for the checked list to be inserted
            shifting will be done between the original position(start) of the cheched list and the end position*/
            for (let i = ++start; i < end; i++) {

                tempData.key = keys[i - 1];
                tempData.input = JSON.parse(localStorage.getItem(keys[i])).input
                tempData.isChecked = JSON.parse(localStorage.getItem(keys[i])).isChecked;
                localStorage.setItem(keys[i - 1], JSON.stringify(tempData))
            }
            /*after this loop there will be a duplicate element  at (end - 1) position
            which will be replaced (outside of if-else block) by the list  which is unchecked  */

            //animating 
            let ele = document.querySelector("#" + checkbox.id).parentElement.parentElement.parentElement;
            ele.className = "listWithAnimation";
            setTimeout(function () {
                if (end != ele.parentNode.childElementCount) {
                    ele.parentNode.insertBefore(ele, (ele.parentNode.children[(ele.parentNode.childElementCount - 1) - end]).nextSibling);
                } else {
                    ele.parentNode.prepend(ele);
                }
            }, 300);

            setTimeout(function () {
                ele.className = ele.className + " show";
            }, 350);

        }
        localStorage.setItem(data.key, JSON.stringify(data));

        setTimeout(function () {
            update(false);
            clickAvailable = true;
        }, 600);

    }
}

//function for adding record
function addRecord(key, inputdata, checked, animate) {
    let list = document.createElement('li')
    list.className = 'list'

    let container = document.querySelector('#uList')
    container.prepend(list);


    //adding label
    let label = document.createElement('label')
    label.className = 'text'

    list.appendChild(label);

    //creating div
    const div = document.createElement('div');
    div.className = "round";

    label.appendChild(div);

    //adding checkbox
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.id = 'c' + key;// assigning id
    checkbox.setAttribute('onclick', 'checkdone(this)')
    checkbox.className = "check";
    if (checked) {
        checkbox.setAttribute('checked', '')//assigning boolean
        label.classList = "linedLabel text";
    }

    div.appendChild(checkbox)

    //adding label for checkbox
    const label3 = document.createElement('label')
    label3.setAttribute("for", 'c' + key)

    div.appendChild(label3)

    // adding text node 
    let text = document.createTextNode(inputdata);// assigning todo data

    div.appendChild(text)

    if (animate) {
        list.className = "listWithAnimation";
        setTimeout(function () {
            list.className = list.className + " show";
        }, 10);
    }

}