import { GoogleAuthProvider, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { auth, fireStore } from "./config";

const googleProvider = new GoogleAuthProvider();
const logout = () => {
  signOut(auth).then(() => {
    // Sign-out successful.
  }).catch((error) => {
    alert("Oops! Something went wrong. Please try again.")
  });
};

async function getDocData(user) {
  const querySnapshot = await getDocs(collection(fireStore, "users"));
  let data;
  querySnapshot.forEach((doc) => {
    if (doc.data().uid === user.uid) {
      data = doc.data();
      return data;
    }
  });
  return data;
}

export {
  googleProvider,
  auth,
  fireStore,
  signInWithEmailAndPassword,
  logout,
  getDocData
};

