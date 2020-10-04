let data = {};

document.body.onload = ()=> {
    getData();
}

/* 
    ---------------------------------------------------------------------------------
    Local Storage Data Functions Below
    ---------------------------------------------------------------------------------
*/

function getData() {
    const storageData = localStorage.getItem("com.n423.tstreets");
    data = (!!storageData) ? JSON.parse(storageData) : { students: []};
    initNewForm();
    displayStudentList();
}

function saveData() {
    const storageData = localStorage.getItem("com.n423.tstreets");
    if(JSON.parse(storageData) != data) {
        localStorage.setItem("com.n423.tstreets", JSON.stringify(data));
        displayStudentList();
    }
}

/* 
    ---------------------------------------------------------------------------------
    CRUD Student Data Functions Below
    ---------------------------------------------------------------------------------
*/

function addStudentData(newdata) {
    data.students.push({
        name: newdata.name,
        age: newdata.age,
        phone: newdata.phone,
        email: newdata.email,
        classes: newdata.classes,
        id: generateID()
    });
    saveData();
}

function getStudentData(id) {
    return data.students.find(student=> student.id == id);
}

function updateStudentData(id, newdata) {
    const studentIndex = data.students.findIndex(student=> student.id == id);
    if(newdata != data.students[studentIndex] && !isNaN(parseInt(id))) {
        data.students.splice(studentIndex, 1, newdata);
        disableForm();
        saveData();
    }
}

function deleteStudentData() {
    const id = doc.qs(".studentid").value;
    const studentIndex = data.students.findIndex(student=> student.id == id);
    data.students.splice(studentIndex, 1);
    hideStudentData();
    saveData();
}

/* 
    ---------------------------------------------------------------------------------
    Init Functions Below
    ---------------------------------------------------------------------------------
*/

function initNewForm() {
    const form = doc.qs(".newstudent");
    form.onsubmit = function(e) {
        e.preventDefault();
        const newdata = getFormData(this);
        const valid = validateFormData(newdata, form);
        newdata.classes = getFormClassData(form);

        if(valid) {
            addStudentData(newdata);
            this.reset();
        }
    }

    const hidebtn = form.querySelector(".hidebtn");
    hidebtn.removeEventListener("click", toggleNewStudentForm);
    hidebtn.addEventListener("click", toggleNewStudentForm);
    
    const addclassbtn = form.querySelector(".addclass");
    addclassbtn.removeEventListener("click", addFieldset);
    addclassbtn.addEventListener("click", addFieldset);

    const removeclassbtn = form.querySelector(".removeclass");
    removeclassbtn.removeEventListener("click", removeFieldset);
    removeclassbtn.addEventListener("click", removeFieldset);
}

function initViewBtns() {
    const students = doc.qsAll(".student");
    for(let student of students) {
        const viewbtn = student.querySelector("button");
        viewbtn.removeEventListener("click", displayStudentData);
        viewbtn.addEventListener("click", displayStudentData);
    }
}

function initStudentDataBtns() {
    const form = doc.qs(".studentdata");
    const dataBtns = doc.qsAll(".studentform__btn");
    for(let btn of dataBtns) {
        switch(btn.dataset.name) {
            case "edit":
                btn.removeEventListener("click", enableForm);
                btn.addEventListener("click", enableForm);
                break;
            case "delete":
                btn.removeEventListener("click", deleteStudentData);
                btn.addEventListener("click", deleteStudentData);
                break;
            case "addclass":
                btn.removeEventListener("click", addFieldset);
                btn.addEventListener("click", addFieldset);
                break;
            case "removeclass":
                btn.removeEventListener("click", removeFieldset);
                btn.addEventListener("click", removeFieldset);
                break;
            case "close":
                btn.removeEventListener("click", hideStudentData);
                btn.addEventListener("click", hideStudentData);
                break;
        }
    }

    form.onsubmit = function(e) {
        e.preventDefault();
        const newdata = getFormData(this);
        const valid = validateFormData(newdata, form);
        const id = doc.qs(".studentid").value;
        newdata.classes = getFormClassData(form);
        if(valid) updateStudentData(id, newdata);
    }
}

/* 
    ---------------------------------------------------------------------------------
    Display Functions Below
    ---------------------------------------------------------------------------------
*/

function displayStudentList() {
    const studentlist = doc.qs(".studentlist");
    studentlist.innerHTML = ``;
    for(let student of data.students) {
        studentlist.innerHTML += `
        <div class="studentlist__student student">
            <p class="studentlist__label">${student?.name}</p>
            <button class="studentlist__btn" data-id="${student.id}">View</button>
        </div>
        `;
    }
    initViewBtns();
}

function displayErrorModal(err, form) {
    const inputs = form.querySelectorAll("input");
    if(err.status != 0) {
        for(let input of inputs) {
            if(input.name == err.status) {
                input.setCustomValidity(`${err.title}. ${err.text}`);
                input.reportValidity();
                input.oninput = ()=> {
                    input.setCustomValidity("");
                }
            }
        }
    }
}

function displayLoading() {
    const loading = doc.qs(".loading");
    loading.addClass("loading--active");
}

function displayStudentData() {
    const form = doc.qs(".studentdata");
    const studentData = getStudentData(this.dataset.id);
    form.removeAttribute("hidden");

    for(let input of form.elements) {
        if(!!input.name) {
            input.value = studentData[input.name];
        }
    }

    displayClasses(form, studentData?.classes);

    initStudentDataBtns();
}

function displayClasses(form, classes = []) {
    const destination = form.querySelector(".classes");
    let destinationlength = destination.childNodes.length - 3;

    if(classes.length > 0) {
        for(let thisclass of classes) {
            destinationlength = destination.childNodes.length - 3;
            const fieldsets = destination.querySelectorAll("fieldset");
            const newFieldSet = document.createElement("fieldset");
            newFieldSet.classList.add("studentform__fieldset");
            newFieldSet.innerHTML = `
                <legend class="studentform__legend studentform__legend--sub">Class ${fieldsets.length + 1}</legend>
                <div class="studentform__group">
                    <label class="studentform__label">Class Name</label>
                    <input class="studentform__input" type="text" data-name="name" placeholder="Class Name" value="${thisclass.name}" disabled>
                </div>
                <div class="studentform__group">
                    <label class="studentform__label">Class Code</label>
                    <input class="studentform__input" type="text" data-name="code" placeholder="XXXX-X ###" value="${thisclass.code}" disabled>
                </div>
                <div class="studentform__group">
                    <label class="studentform__label">Teacher</label>
                    <input class="studentform__input" type="text" data-name="teacher" placeholder="John Doe" value="${thisclass.teacher}" disabled>
                </div>
            `; 
        
            destination.insertBefore(newFieldSet, destination.childNodes[destinationlength]);
        }
    } else {
        const newFieldSet = document.createElement("fieldset");
        newFieldSet.classList.add("studentform__fieldset");
        newFieldSet.innerHTML = `
        <legend class="studentform__legend studentform__legend--sub">Class 1</legend>
        <div class="studentform__group">
            <label class="studentform__label">Class Name</label>
            <input class="studentform__input" type="text" data-name="name" placeholder="Class Name" disabled>
        </div>
        <div class="studentform__group">
            <label class="studentform__label">Class Code</label>
            <input class="studentform__input" type="text" data-name="code" placeholder="XXXX-X ###" disabled>
        </div>
        <div class="studentform__group">
            <label class="studentform__label">Teacher</label>
            <input class="studentform__input" type="text" data-name="teacher" placeholder="John Doe" disabled>
        </div>
        `;
        
        destination.insertBefore(newFieldSet, destination.childNodes[destinationlength]);
    }
}

/* 
    ---------------------------------------------------------------------------------
    Hide Functions Below
    ---------------------------------------------------------------------------------
*/

function hideLoading() {
    const loading = doc.qs(".loading");
    loading.removeClass("loading--active");
}

function hideStudentData() {
    const form = doc.qs(".studentdata");
    form.setAttribute("hidden", true);
}

/* 
    ---------------------------------------------------------------------------------
    Forms Functions Below
    ---------------------------------------------------------------------------------
*/

function getFormData(form) {
    return Object.fromEntries(new FormData(form));
}

function validateFormData(newdata, form) {
    const err = { status: 0, text: ""};

    if(isNaN(parseInt(newdata.phone))) {
        err.status = "phone";
        err.title = "Invalid Phone Number";
        err.text = "Please enter a valid phone number (Only numbers): 1234567890"
    } 
    else if(newdata.phone.length != 10) {
        err.status = "phone";
        err.title = "Invalid Phone Number";
        err.text = "Please enter a valid phone number (10 digits long): 1234567890"
    }
    else if(!newdata.email.includes("@") || !newdata.email.includes(".")) {
        err.status = "email";
        err.title = "Invalid Email Address";
        err.text = "Please enter a valid email address: email@domain.com";
    } else if(!newdata.name.trim() || newdata.name.split(" ").length < 2) {
        err.status = "name";
        err.title = "Invalid Name";
        err.text = "Please enter a valid name.: Firstname Lastname";
    }
    
    displayErrorModal(err, form);
    return !err.status;
}

function enableForm() {
    const form = doc.qs(".studentdata");
    for(let input of form) {
        if(!!input?.name) {
            input.removeAttribute("disabled");
        }
    }
    const dataBtns = doc.qsAll(".studentform__btn");
    for(let btn of dataBtns) {
        if(btn.dataset.name == "edit") {
            btn.setAttribute("hidden", true);
        } else {
            btn.removeAttribute("hidden");
        }
    }
    enableFieldsets(form);
}

function disableForm() {
    const form = doc.qs(".studentdata");
    for(let input of form) {
        if(!!input?.name) {
            input.setAttribute("disabled", true);
        }
    }
    const dataBtns = doc.qsAll(".studentform__btn");
    for(let btn of dataBtns) {
        if(btn.dataset.name != "edit") {
            btn.setAttribute("hidden", true);
        } else {
            btn.removeAttribute("hidden");
        }
    }
    disableFieldsets(form);
}

function toggleNewStudentForm() {
    const form = doc.qs(".newstudent");
    const fieldsets = form.querySelectorAll("fieldset");
    for(let set of fieldsets) {
        if(this.value == "Hide Form") {
            set.setAttribute("hidden", true);
        } else {
            set.removeAttribute("hidden");
        }
    }
    if(this.value == "Hide Form") {
        form.querySelector(".submitbtn").setAttribute("hidden", true);
        this.value = "Show Form";
    } else {
        form.querySelector(".submitbtn").removeAttribute("hidden");
        this.value = "Hide Form";
    }
}

function addFieldset() {
    const form = doc.qs(`.${this.dataset.form}`);
    const destination = form.querySelector(".classes");
    const destinationlength = destination.childNodes.length - 3;
    const fieldsets = destination.querySelectorAll("fieldset");

    const newFieldSet = document.createElement("fieldset");
    newFieldSet.classList.add("studentform__fieldset");
    newFieldSet.innerHTML = `
        <legend class="studentform__legend studentform__legend--sub">Class ${fieldsets.length + 1}</legend>
        <div class="studentform__group">
            <label class="studentform__label">Class Name</label>
            <input class="studentform__input" type="text" data-name="name" placeholder="Class Name">
        </div>
        <div class="studentform__group">
            <label class="studentform__label">Class Code</label>
            <input class="studentform__input" type="text" data-name="code" placeholder="XXXX-X ###">
        </div>
        <div class="studentform__group">
            <label class="studentform__label">Teacher</label>
            <input class="studentform__input" type="text" data-name="teacher" placeholder="John Doe">
        </div>
    `; 

    if(fieldsets.length < 8) {
        destination.insertBefore(newFieldSet, destination.childNodes[destinationlength]);
    }
}

function removeFieldset() {
    const form = doc.qs(`.${this.dataset.form}`);
    const destination = form.querySelector(".classes");
    const fieldsets = destination.querySelectorAll("fieldset");
    if(fieldsets.length > 1) {
        fieldsets[fieldsets.length -1].remove();
    }
}

function getFormClassData(form) {
    const classes = form.querySelector(".classes").querySelectorAll("fieldset");
    let newClasses = [];

    for(let thisclass of classes) {
        let newClass = {};
        for(let input of thisclass.querySelectorAll("input")) {
            newClass[input.dataset.name] = input.value.trim();
        }
        if(!!newClass?.code)
        {
            newClasses.push(newClass);
        }
    }

    return (newClasses);
}

function enableFieldsets(form) {
    const destination = form.querySelector(".classes");
    const fieldsets = destination.querySelectorAll("fieldset");

    for(let thisclass of fieldsets) {
        for(let input of thisclass.querySelectorAll("input")) {
            input.removeAttribute("disabled");
        }
    }
}

function disableFieldsets(form) {
    const destination = form.querySelector(".classes");
    const fieldsets = destination.querySelectorAll("fieldset");

    for(let thisclass of fieldsets) {
        for(let input of thisclass.querySelectorAll("input")) {
            input.setAttribute("disabled", true);
        }
    }
}

/* 
    ---------------------------------------------------------------------------------
    Misc Functions Below
    ---------------------------------------------------------------------------------
*/

function generateID() {
    let newid = `0`;
    for(let i of new Array(8)) {
        newid += `${parseInt(Math.random() * 10)}`;
    }
    return (!!data.students.find(student=> student.id == newid))
    ? generateID()
    : newid;
}

/* 
    ---------------------------------------------------------------------------------
    Shortcut Functions Below
    ---------------------------------------------------------------------------------
*/

const doc = {
    qs: function(query) {
        return document.querySelector(query);
    },
    qsAll: function(query) {
        return document.querySelectorAll(query);
    }
}

const con = {
    l: function(text) {
        console.log(text);
    },
    e: function(text) {
        console.error(text);
    },
    t: function(text) {
        console.table(text);
    }
}