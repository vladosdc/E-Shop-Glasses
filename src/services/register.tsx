// "use client"
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import {auth} from '@/firebase/firebase'
// import {useEffect} from "react";
//
// interface RegisterProps {
//     email: string,
//     password: string
// }
//
//
// export default function RegisterService ({email, password}: RegisterProps) {
//     useEffect(() => {
//         createUserWithEmailAndPassword(auth, email, password)
//             .then((userCredential) => {
//                 // Signed in
//                 const user = userCredential.user;
//                 console.log("top")
//
//             })
//             .catch((error) => {
//                 const errorCode = error.code;
//                 const errorMessage = error.message;
//                 // ..
//             });
//     }, [email, password])
//
//
//
//     return null
// }