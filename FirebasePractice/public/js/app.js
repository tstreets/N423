document.body.onload = ()=> {
    try { 
        let app = firebase.app(); 
        initFirebase();
    } catch (e) { 
        console.error(e); 
    } 
}

/* 
    ------------------------------------------------------------
    Init Functions
    ------------------------------------------------------------
*/

function initFirebase() {
/*     firebase
        .auth()
        .signInAnonymously()
        .then(result=>{
            globalThis._db = firebase.firestore();
            initInputs();
        }) */
        
    initInputs();
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {   
            globalThis._db = firebase.firestore();

            // User is signed in.
            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var isAnonymous = user.isAnonymous;
            var uid = user.uid;
            var providerData = user.providerData;
            // ...
            console.log("User signed in.", email || "Anon");
        } else {
            // User is signed out.
            console.log("User not signed in.")
        }
        });
}

function initInputs() {
    const testAddRef = document.querySelector(".testAdd");
    testAddRef.onclick = function(e) {
        e.preventDefault();
        const newData = {name: "Ty"};
        addData(newData);
    };

    const testGetRef = document.querySelector(".testGet");
    testGetRef.onclick = function(e) {
        e.preventDefault();
        getData();
    };

    const signupRef = document.querySelector(".signup");
    const loginRef = document.querySelector(".login");
    const logoutRef = document.querySelector(".logout");
    signupRef.onclick = ()=> {
        const email = "streetso71@gmail.com";
        const password = "Password123!"
        firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
            console.log(user);
        }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
            console.error(`${errorCode}: ${errorMessage}`);
        });
    }
    loginRef.onclick = ()=> {
        const email = "streetso71@gmail.com";
        const password = "Password123!"
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
          });
    }
    logoutRef.onclick = ()=> {
        firebase.auth().signOut().then(function() {
            // Sign-out successful.
            _db = null;
            console.log("Signed out");
          }).catch(function(error) {
            // An error happened.
            console.error(error);
          });
    }

    const updateUserRef = document.querySelector(".update");
    updateUserRef.onclick = ()=> {
        const userData = {
            // email: "streetso71@gmail.com",
            displayName: "Ty",
            photoURL: "https://example.com/tstreets/profile.jpg"
        }
        updateUser(userData);
    };
}

function updateUser(userData) {
    var user = firebase.auth().currentUser;

    if(!!userData.displayName || !!userData.photoURL) {
        user.updateProfile(userData).then(function() {
            console.log(user.displayName, user.photoURL);
            // Update successful.
        }).catch(function(error) {
            // An error happened.
        });
    }

    if(!!userData.email) {
        user.reauthenticateWithCredential(user).then(function() {
            // User re-authenticated.  
            user.updateEmail(userData.email).then(function() {
                // Update successful.
            }).catch(function(error) {
                // An error happened.
            });
        }).catch(function(error) {
            // An error happened.
        });
    }
}

/* 
    ------------------------------------------------------------
    CRUD Functions
    ------------------------------------------------------------
*/

function addData(newData) {
    if(databaseConnection()) return;
    _db
        .collection('CollectionName')
        .add(newData)
        .then(docRef=> {
            console.log(`Document written with ID: ${docRef.id}`);
        })
        .catch(error=> {
            console.error(`Error adding document ${error}`);
        })
}

function getData() {
    if(databaseConnection()) return;
    _db
        .collection('CollectionName')
        .doc('c7tTFwFeN0nN6PxpiD97')
        .get()
        .then(doc=> {
            console.log(doc.data(), doc.id);
        })
}

function getAllData() {
    if(databaseConnection()) return;
    _db
        .collection('CollectionName')
        .get()
        .then(querySnapshot=> {
            querySnapshot.forEach(doc=> {
               console.log(doc.data(), doc.id);
            })
        })
}

function updateData(id, newData) {
    if(databaseConnection()) return;
    _db
        .collection('CollectionName')
        .doc(id)
        .update(newData)
}

function deleteData(id) {
    if(databaseConnection()) return;
    _db
        .collection('CollectionName')
        .doc(id)
        .delete()
}

/*

*/

function databaseConnection() {
    if(!globalThis._db) console.log(`Database is not connected.`);
    return !globalThis._db;
}