let _db;
const doc = document; doc.qs = doc.querySelector; doc.qsAll = doc.querySelectorAll;

/**
 * Initializes firebase connection
 * @param {Function} callback Function that should be ran immediately after firebase connection is made
 */
export function initFirebase(callback) {
    firebase
    .auth()
    .onAuthStateChanged(user=> {
        if(user) {
            _db = firebase.firestore();
        }
        else {
            signIn();
        }
        callback();
    })
}

/**
 * Connect to firebase anonymously for firestore access
 */
export function signIn() {
    firebase
    .auth()
    .signInAnonymously()
    .then(()=> {
        _db = firebase.firestore();
    })
}

/**
 * Filter out albums by a fieldname's value.
 * @param {Object} filter
 * @param {String} filter.fieldname 
 * @param {String} filter.value 
 */
export function getAlbumBy(filter) {
    const albumsDOM = doc.qs(".albums");
    albumsDOM.innerHTML = ``;

    if(!filter.value.trim()) {
        _db.collection("Albums").get()
        .then(querySnapshot=> {
            querySnapshot.forEach(albumDoc=> {
                let album = albumDoc.data();
                albumsDOM.innerHTML += `
                <div class="card mr-3 mb-3" style="width: 18rem;">
                    <img src="${album.Cover}" class="card-img-top" alt="${album.Name}">
                    <div class="card-body">
                        <p class="card-text">${album.Name} <span class="text-secondary">by ${album.Artist}</span></p>
                        <p class="card-text text-primary">${album.Genre}</p>
                    </div>
                </div>
                `;
            })
        })
    }
    else {
        _db.collection("Albums")
        .where(filter.fieldname, "==", filter.value).get()
        .then(querySnapshot=> {
            querySnapshot.forEach(albumDoc=> {
                let album = albumDoc.data();
                albumsDOM.innerHTML += `
                <div class="card mr-3 mb-3" style="width: 18rem;">
                    <img src="${album.Cover}" class="card-img-top" alt="${album.Name}">
                    <div class="card-body">
                        <p class="card-text">${album.Name} by ${album.Artist}</p>
                        <p class="card-text text-primary">${album.Genre}</p>
                    </div>
                </div>
                `;
            })
        })
    }
}

export function getStudentByClassNumber(classNumber) {
    const studentListDOM = doc.qs(".students");
    if(!classNumber.trim()) {
        studentListDOM.innerHTML = ``;
        return;
    }
    studentListDOM.innerHTML = `<h3>N${classNumber}</h3>`;
    
    _db
    .collection("Students")
    .where("classNumber", "==", classNumber)
    .get()
    .then(querySnapshot=> {
        querySnapshot.forEach(docData=>{
            let student = docData.data();
            studentListDOM.innerHTML += `
                <p>${student.fName} ${student.lName}</p>
            `;
        });
    })
}