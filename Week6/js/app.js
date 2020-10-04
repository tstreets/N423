let data = JSON.parse(localStorage.getItem("com.tstreets.n423")) || {};

function addGuest() {
    const guestlist = document.querySelector(".guestlist");
    const signature = document.querySelector(".signature").value;

    if(!!signature.trim())
    {
        if(!data.guestlist) {
            data.guestlist = [];
        }
        data.guestlist.push({
            name: signature,
            time: new Date().toLocaleTimeString()
        });
        saveData();
        displayGuestlist();
    }
}

function removeGuest(e) {
    e.preventDefault();
    const thisName = this.dataset.name;
    const thisIndex = data.guestlist.findIndex((guest, index) => {
        if(guest.name == thisName)
        {
            return true;
        }
    });

    data.guestlist.splice(thisIndex, 1);
    saveData();
    displayGuestlist();
}

function initSignbtn() {
    const signbtn = document.querySelector(".signbtn");
    signbtn.addEventListener("click", function(e) {
        e.preventDefault();
        addGuest();
    });
    displayGuestlist();
}

function initDeleteGuestBtns() {
    const deleteguestbtns = document.querySelectorAll(".deleteguestbtn");
    
    deleteguestbtns.forEach(btn=> {
        btn.removeEventListener("click",removeGuest);
    });

    deleteguestbtns.forEach(btn=> {
        btn.addEventListener("click",removeGuest);
    });
}

function displayGuestlist() {
    const guestlist = document.querySelector(".guestlist");
    guestlist.innerHTML = `
    <div style="display: flex; align-items: center; width: 400px; justify-content: space-between;">
        <p style="width: 50%;">Guest</p>
        <p>Time</p>
        <p style="visibility: hidden;">options</p>
    </div>
    `;
    if(data.guestlist) {
        data.guestlist.forEach(guest => {
            guestlist.innerHTML += `
                <div style="display: flex; align-items: center; width: 400px; justify-content: space-between;">
                    <p style="width: 50%;">${guest.name}</p>
                    <p> ${guest.time}</p>
                    <button data-name="${guest.name}" class="deleteguestbtn">Delete</button>
                </div>
            `;
        });
        initDeleteGuestBtns();
    }
}

function saveData() {
    localStorage.setItem("com.tstreets.n423", JSON.stringify(data));
}

document.body.onload = ()=> {
    initSignbtn();
}