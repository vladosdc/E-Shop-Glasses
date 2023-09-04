"use client"
import styles from './settings.module.scss'
import {useEffect, useState} from "react";
import {onAuthStateChanged, updateProfile, updateEmail, updatePassword} from "@firebase/auth";
import {auth} from "@/firebase/firebase";
import {firebaseApp} from "@/firebase/firebase";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {getFirestore} from "@firebase/firestore";
import userEmailImg from "@/assets/images/icons/userEmail.png"
import userNameImg from "@/assets/images/icons/userName.png"
import userPasswordImg from "@/assets/images/icons/userPassword.png"
import showPassImg from '@/assets/images/icons/show__password.png'
import hidePassImg from '@/assets/images/icons/hide__password.png'
import Image from "next/image";

export default function Settings() {


    const db = getFirestore(firebaseApp)

    const [userName, setUserName] = useState<any>(null)
    const [userEmail, setUserEmail] = useState<any>(null)
    const [userPassword, setUserPassword] = useState<any>(null)
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [showInputPass ,setShowInputPass] = useState<boolean>(true)

    const passwordStatus = () => {
        if (!showPassword) {
            setShowPassword(true)
        } else {
            setShowPassword(false)
        }
    }

    useEffect(() => {
        const getData = async () => {

            await onAuthStateChanged(auth, (user) => {
                if (user) {
                    setUserName(user.displayName)
                    setUserEmail(user.email)
                } else {
                    setUserName("You don't have an account!")
                    setUserEmail("You don't have an account!")
                }
            });

            const docRef = await doc(db, "data", `user - ${auth.currentUser?.uid}`);
            const docSnap = await getDoc(docRef);
            const dataForGoogle = docSnap.data()
            if (docSnap.exists()) {
                console.log("Document data:", docSnap.data());
                const userData = await docSnap.data()
                const userDataPassword = await userData.password
                setUserPassword(userDataPassword)

            } else {
                // docSnap.data() will be undefined in this case
                console.log("No such document!");
            }

            if(dataForGoogle && dataForGoogle.authWithGoogle) {
                setShowInputPass(false)
                console.log("YEAH GOOGLE")
            }

        }

        getData()
    }, [userName, userEmail, userPassword])

    const submitData = async (e: any) => {
        e.preventDefault()

        const newUserName = e.target[0].value
        const newUserEmail = e.target[1].value
        const newUserPassword = e.target[2].value

        if (auth.currentUser) {
            await updateProfile(auth.currentUser, {
                displayName: newUserName
            }).then(() => {
                // Profile updated!
                // ...
                console.log("New name - success")
            }).catch((error) => {
                // An error occurred
                // ...
                console.log(error)

            });
        }

        if (auth.currentUser) {
            await updateEmail(auth.currentUser, newUserEmail).then(() => {
                // Email updated!
                // ...
                console.log("New email - success")
            }).catch((error) => {
                console.log(error)
            });
        }

       if (auth.currentUser) {
       await updatePassword(auth.currentUser, newUserPassword).then(() => {
            console.log("New password - success")
        }).catch((error) => {
            // An error ocurred
            // ...
           console.log(error)

        });
       }

        const updateData = doc(db, "data", `user - ${auth.currentUser?.uid}`);

        await updateDoc(updateData, {
            email: newUserEmail,
            name: newUserName,
            password: newUserPassword
        });


    }


    return (
        <div className={styles.settings}>
            <div className={styles.settings__container}>
                <p className={styles.settings__text}>Your personal information</p>
                <form onSubmit={submitData}>
                    <div className={styles.settings__name}>
                        <Image src={userNameImg} alt={""} width={25}/>
                        <input className={showInputPass ? styles.settings__name__input : styles.settings__name__inputDisabled} type="text" defaultValue={userName}
                               required={true}
                               placeholder="Name" minLength={4} readOnly={!showInputPass}/>
                    </div>
                    <div className={styles.settings__email}>
                        <Image src={userEmailImg} alt={""} width={25}/>
                        <input className={showInputPass ? styles.settings__email__input : styles.settings__email__inputDisabled} type="text" defaultValue={userEmail}
                               required={true} placeholder="Email" minLength={6} readOnly={!showInputPass}/>
                    </div>
                    <div className={showInputPass ? styles.settings__password : styles.settings__passwordNotShow}>
                        <Image src={userPasswordImg} alt={""} width={25}/>
                        <input className={styles.settings__password__input} type={showPassword ? "text" : "password"}
                               defaultValue={userPassword} required={true} placeholder="Password" minLength={6} readOnly={!showInputPass}/>
                        <div className={styles.settings__input__password__block} onClick={passwordStatus}>
                            <Image className={styles.settings__password__status__img}
                                   src={showPassword ? showPassImg : hidePassImg}
                                   alt={showPassword ? "Status: Your password is visible" : "Status: Your password is not visible"}
                                   width={20}/>
                        </div>
                    </div>
                    <p className={styles.noAccessGoogle}>{showInputPass? null : "*Sorry, we do not have access to your Google account, so you cannot change the data."}</p>
                    <div className={styles.saveData}>
                        <button className={showInputPass ? styles.saveDataBtn : styles.saveDataBtnDisabled} disabled={!showInputPass}>Save Data</button>
                    </div>
                </form>
            </div>
        </div>
    )
}