"use client"
import {createUserWithEmailAndPassword, updateProfile} from "firebase/auth";
import {auth} from '@/firebase/firebase'
import {firebaseApp} from "@/firebase/firebase";
import {doc, setDoc} from "firebase/firestore";
import styles from './signup.module.scss'
import authWithGoogle from "@/services/authWithGoogle";
import Image from "next/image";
import googleImg from "@/assets/images/icons/google.png";
import Link from "next/link";
import {getFirestore} from "@firebase/firestore";
import showPassImg from "@/assets/images/icons/show__password.png";
import hidePassImg from "@/assets/images/icons/hide__password.png";
import {useEffect, useState} from "react";
import {onAuthStateChanged} from "@firebase/auth";
import {useRouter} from "next/navigation";

export default function Signup() {
    const router = useRouter()

    useEffect(() => {
        const checkAuth = async () => {
            const user = await onAuthStateChanged(auth, (user) => {
                if (user) {
                    router.push('/account')
                } else {

                }
            });
        }

        checkAuth()

    }, [])

    const [showPassword, setShowPassword] = useState<boolean>(false)

    const passwordStatus = () => {
        if (!showPassword) {
            setShowPassword(true)
        } else {
            setShowPassword(false)
        }
    }

    const db: any = getFirestore(firebaseApp)

    const submitData = async (e: any) => {
        e.preventDefault()

        const firstName = e.target[0].value
        const lastName = e.target[1].value
        const email = e.target[2].value
        const password = e.target[3].value
        if (email && password.trim() === "") {
            return
        }

        await createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log("welcome user UID:" + user.uid)

            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // ..
            });

        await setDoc(doc(db, "data", `user - ${auth.currentUser?.uid}`), {
            name: `${firstName} ${lastName}`,
            email: email,
            password: password,
            uid: auth.currentUser?.uid,
        })
            .then(() => {
                console.log("nice")
            })
            .catch((error) => console.log(error))
        if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
            displayName: `${firstName} ${lastName}`
        }).then(() => {
          console.log("set name - successfully ")
            console.log(auth.currentUser)
        }).catch((error) => {
           console.log(error)
        });
        }
    }

    return (
        <div className={styles.signup}>
            <p className={styles.signup__text}>CREATE ACOUNT</p>
            <div className={styles.signup__container}>

                <form onSubmit={submitData} className={styles.signup__form}>
                    <input type="text" name="firstName" placeholder="First Name" required maxLength={15}
                           className={styles.signup__form__input}/>
                    <input type="text" name="lastName" placeholder="Last Name" required maxLength={18}
                           className={styles.signup__form__input}/>
                    <input type="email" name="email" placeholder="Email" required minLength={5}
                           className={styles.signup__form__input}/>
                    <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" required
                           minLength={6}
                           className={styles.signup__form__input}/>
                    <div className={styles.signup__form__input__password__block} onClick={passwordStatus}>
                        <Image className={styles.signup__form__password__status__img}
                               src={showPassword ? showPassImg : hidePassImg}
                               alt={showPassword ? "Status: Your password is visible" : "Status: Your password is not visible"}
                               width={20}/>
                    </div>
                    <button className={styles.signup__form__create__button}>Create</button>
                    <div className={styles.signup__line__textor__block}>
                        <div className={styles.signup__line}></div>
                        <p className={styles.signup__textor}>OR</p>
                        <div className={styles.signup__line}></div>
                    </div>
                </form>
                <div className={styles.google}>
                    <button className={styles.google__login__button} onClick={authWithGoogle}>
                        <Image src={googleImg} alt="login google icon" width={24} quality={100} priority={true}/>
                        Google
                    </button>
                </div>
                <p className={styles.login__text}>Already have an account? <Link href="login">Login</Link></p>
            </div>
        </div>
    )
}