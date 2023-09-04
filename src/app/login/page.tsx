"use client"
import Image from 'next/image'
import googleImg from '../../assets/images/icons/google.png'
import styles from './login.module.scss'
import authWithGoogle from '../../services/authWithGoogle'
import {useEffect, useState} from "react";
import showPassImg from '@/assets/images/icons/show__password.png'
import hidePassImg from  '@/assets/images/icons/hide__password.png'
import {signInWithEmailAndPassword} from "firebase/auth"
import {auth} from "@/firebase/firebase";
import {onAuthStateChanged} from "@firebase/auth";
import Link from "next/link";
import {useRouter} from "next/navigation";

export default function Login () {
    const router = useRouter()


    const [error, setError] = useState(false)

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
        if(!showPassword) {
            setShowPassword(true)
        }
        else {
            setShowPassword(false)
        }
    }

    const submitData = (e: any) => {
        e.preventDefault()
        const email = e.target[0].value
        const password = e.target[1].value

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
            })
            .catch((error) => {
                setError(true)
            });

    }

    return (
        <div className={styles.login}>
            <div className={styles.login__container}>
                <p className={styles.login__text}>LOGIN IN TO YOUR ACCOUNT</p>
                <div className={styles.login__block}>
                    <div className={styles.login__block__container}>
                        <form className={styles.login__form} onSubmit={submitData}>
                            <input type="email" placeholder="Email" required minLength={6} className={styles.login__form__input__email} onChange={() => setError(false)}/>
                            <input type={showPassword ? "text" : "password"} placeholder="Password" required minLength={6} className={styles.login__form__input__password} onChange={() => setError(false)}/>
                            <div className={styles.login__form__input__password__block}>
                                <Image className={styles.login__form__password__status__img} src={showPassword ? showPassImg : hidePassImg} alt={showPassword ? "Status: Your password is visible" : "Status: Your password is not visible"} width={20} onClick={passwordStatus}/>
                            </div>
                            <p className={error ? styles.errorMsg : styles.errorMsgNoShow}>{error ? "*Wrong login or password!" : null}</p>
                            <button className={styles.login__form__button__signin}>SIGN IN</button>
                        </form>
                        <div className={styles.login__line__textor__block}>
                            <div className={styles.login__line}></div>
                            <p className={styles.login__textor}>OR</p>
                            <div className={styles.login__line}></div>
                        </div>
                        <div className={styles.google}>
                        <button className={styles.google__login__button} onClick={authWithGoogle}>
                            <Image src={googleImg} alt="login google icon" width={24} quality={100} priority={true}/>
                            Google</button>
                        </div>
                        <p className={styles.signup__text}>Don't have an account? <Link href="signup">Register</Link></p>
                    </div>
                </div>
            </div>
        </div>
    )
}