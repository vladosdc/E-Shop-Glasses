import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import {auth, firebaseApp} from '../firebase/firebase'
import {doc, getFirestore, setDoc} from "firebase/firestore";


const loginService = () => {
    const db = getFirestore(firebaseApp)

const provider = new GoogleAuthProvider();

signInWithPopup(auth, provider)
  .then((result) => {

    const credential = GoogleAuthProvider.credentialFromResult(result);

        const googleFunc = async () => {
            await setDoc(doc(db, "data", `user - ${auth.currentUser?.uid}`), {
                uid: await auth.currentUser?.uid,
                name: await auth.currentUser?.displayName,
                authWithGoogle: true,
            })
        }
        googleFunc()


  })

    .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    const email = error.customData.email;
    const credential = GoogleAuthProvider.credentialFromError(error);
    console.log(error)
  });
}

export default loginService