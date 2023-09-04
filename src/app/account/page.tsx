"use client"
import {onAuthStateChanged} from "@firebase/auth";
import {auth} from "@/firebase/firebase";
import {signOut} from "@firebase/auth";
import styles from './account.module.scss'
import {useEffect, useState} from "react";
import Image from "next/image";
import settingsImg from '@/assets/images/icons/settings.png'
import addressImg from '@/assets/images/icons/address.png'
import voucherImg from '@/assets/images/icons/voucher.png'
import signOutImg from '@/assets/images/icons/logout.png'
import {useRouter} from "next/navigation";
export default function Account() {

    const router = useRouter()


    useEffect(() => {
        const checkAuth = async () => {
            const user = await onAuthStateChanged(auth, (user) => {
                if (!user) {
                    router.push('/login')
                } else {

                }
            });
        }

        checkAuth()

    }, [])

    const [userName, setUserName] = useState<any>(null)

    useEffect(() => {

        const getUserName = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserName(user.displayName)

            } else {
                setUserName(null)
            }
        });
        return () => {
            getUserName()
        }

    }, )


    const logout = async () => {
        await signOut(auth).then(() => {
            console.log(auth.currentUser)
            router.push('/login')
        }).catch((error) => {
            console.log(error)
        });
    }

    return (
        <div className={styles.account}>
            <div className={styles.account__container}>
                <div className={styles.account__mainInfo}>
                    <p className={styles.acconut__text}>Your Account</p>
                    <p>-</p>
                    <p className={styles.account__name}>{userName}</p>
                </div>
                <div className={styles.account__cards}>
                    <div className={styles.account__cards__settings} onClick={() => router.push('/account/settings')}>
                        <Image
                            className={styles.account__cards__settingsImg}
                            src={settingsImg} alt="settings" width={40}/>
                        <p className={styles.account__cards__text}>Settings</p>
                    </div>
                    <div className={styles.account__cards__addressCard}>
                        <Image
                            className={styles.account__cards__addressImg}
                            src={addressImg} alt="Address" width={55}/>
                        <p className={`${styles.account__cards__text} ${styles.account__cards__textAddress}`}>Address</p>
                    </div>
                    <div className={styles.account__cards__vouchersCard}>
                        <Image
                            className={styles.account__cards__vouchersImg}
                            src={voucherImg} alt="Address" width={40}/>
                        <p className={styles.account__cards__text}>Vouchers</p>
                    </div>
                </div>
                <div className={styles.signOut}>
                    <button className={styles.signOut__btn} onClick={logout}>Sign Out
                        <Image className={styles.signOut__btn__img} src={signOutImg} alt="Logout with account" width={20}/></button>
                </div>
            </div>
        </div>
    )
}
