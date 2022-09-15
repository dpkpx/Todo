import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-app.js";
import { getAuth, signOut, getAdditionalUserInfo, onAuthStateChanged, signInWithRedirect, getRedirectResult, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-auth.js";
import { initializeFirestore, CACHE_SIZE_UNLIMITED, getDocs, deleteDoc, where, collection, query, enableIndexedDbPersistence, getDoc, doc, setDoc, onSnapshot, updateDoc, deleteField } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCgtSqflLj7aglo1C0FwsjXb3QezIWkQng",
    authDomain: "todo-511ee.firebaseapp.com",
    projectId: "todo-511ee",
    storageBucket: "todo-511ee.appspot.com",
    messagingSenderId: "787209602136",
    appId: "1:787209602136:web:a251001e936e4b4242f62d",
    measurementId: "G-E565KPV2P8"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();

const db = initializeFirestore(app, {
    cacheSizeBytes: CACHE_SIZE_UNLIMITED
});

const auth = getAuth();

onAuthStateChanged(auth, (user) => {
    if (!user) {
        localStorage.removeItem("uid")
        signInWithRedirect(auth, provider);
    }
})

getRedirectResult(auth)
    .then((result) => {
        const user = result.user
        const { isNewUser } = getAdditionalUserInfo(result)
        if (isNewUser) {
            setUpUser(user.uid, user.displayName);
        }

    }).catch((error) => {

    });

enableIndexedDbPersistence(db)
  


document.querySelector("#signOutButton").addEventListener("click", signOutUser)
function signOutUser() {
    signOut(auth).then(() => {
        // Sign-out successful.
    }).catch((error) => {
        // An error happened.
    });

}

async function setUpUser(uid, displayName) {
   
    await setDoc(doc(db, `${uid}/todos/MyTodos`, "101"), {

        isChecked: false,
        todoText: "Welcome " + displayName
    });
}
let uid;

if (localStorage.getItem("uid")) {
    uid = localStorage.getItem("uid")
} else {
    uid = await new Promise((resolve, reject) => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                resolve(user.uid)
            }
        })
    })
    localStorage.setItem("uid", uid);
}


// ===========================================================================
export { deleteField, getDoc, getDocs, collection, where, deleteDoc, onSnapshot, query, setDoc, updateDoc, doc, db, uid }
