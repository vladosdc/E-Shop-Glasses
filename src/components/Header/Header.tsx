"use client"
import Image from "next/image";
import logoImg from "../../assets/images/icons/logo.png"
import myProfileImg from "../../assets/images/icons/user.png"
import mobileMenuImg from '@/assets/images/icons/menu.png'
import mobileMenuCloseImg from  '@/assets/images/icons/closeMenu.png'
import styles from './header.module.scss'
import Link from "next/link";
import {useEffect, useState} from "react";
import {onAuthStateChanged} from "@firebase/auth";
import {auth} from "@/firebase/firebase";
import {useRouter} from "next/navigation";


const Header = () => {

    const router = useRouter()
    const [pathToAccount, setPathToAccount] = useState(false)
    const [menu, setMenu] = useState<boolean>(true)

    useEffect(() => {
        const checkAuth = async () => {
            const user = await onAuthStateChanged(auth, (user) => {
                if (user) {
                    setPathToAccount(true)
                }
            });
        }
        checkAuth()

    }, [])

    const menuStatus = () => {
        if (!menu) {
            setMenu(true)
        } else {
            setMenu(false)
        }
    }


    return (
        <>
            {/*PC Menu*/}
            <div className={styles.header}>
                <div className={styles.header__container}>
                    <div className={styles.header__logo} onClick={() => router.push("/")}>
                            <Image className={styles.header__logo__img} src={logoImg} alt="logo" width={80}
                                   quality={100}
                                   priority={true}/>
                    </div>
                    <ul className={styles.header__list}>
                        <li className={styles.header__list__item}
                            onClick={() => router.push('/sunglasses')}>SUNGLASSES
                        </li>
                        <li className={styles.header__list__item} onClick={() => router.push("/eyeglasses")}>EYEGLASSES</li>
                        <li className={styles.header__list__item} onClick={() => router.push("/sportglasses")}>SPORT GLASSES</li>
                        <li className={styles.header__list__item} onClick={() => router.push("/childrenglasses")}>CHILDREN</li>
                        <li className={styles.header__list__item} onClick={() => router.push("/lenses")}>CONTACT LENSES</li>
                    </ul>
                    <div className={styles.header__account}>
                        <div className={styles.header__account__mypfofile}>
                            <Image className={styles.header__account__myprofile__img} src={myProfileImg}
                                   alt="my profile" width={22} quality={100} priority={true}
                                   onClick={() => router.push(pathToAccount ? "/account" : "/login")}/>
                        </div>
                    </div>
                </div>
            </div>
            {/*Mobile Menu*/}
            <div className={styles.headerMobile}>
                <div className={styles.headerMobile__container}>
                    <div className={styles.menuMobile}>
                        <Image className={styles.menuImg} src={menu ? mobileMenuImg : mobileMenuCloseImg} quality={100} priority={true} alt="menu"
                               width={30} onClick={menuStatus}></Image>
                        <div className={menu ? styles.listItemsNoShow : styles.listItems}>

                            <div className={styles.headerMobile__list__item}
                                 onClick={() => {
                                     router.push('/')
                                     setMenu(true)
                                 }}>
                                HOME
                            </div>
                            <div className={styles.headerMobile__account}
                                 onClick={() => {
                                     router.push(pathToAccount ? "/account" : "/login")
                                     setMenu(true)
                                 }}>{pathToAccount ? "ACCOUNT" : "LOGIN"}</div>
                            <div className={styles.headerMobile__list__item}
                                 onClick={() => {
                                     router.push('/sunglasses')
                                     setMenu(true)
                                 }}>SUNGLASSES
                            </div>
                            <div className={styles.header__list__item} onClick={() => router.push("/eyeglasses")}>EYEGLASSES</div>
                            <div className={styles.header__list__item} onClick={() => router.push("/sportglasses")}>SPORT GLASSES</div>
                            <div className={styles.header__list__item} onClick={() => router.push("/childrenglasses")}>CHILDREN</div>
                            <div className={styles.header__list__item} onClick={() => router.push("/lenses")}>CONTACT LENSES</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Header