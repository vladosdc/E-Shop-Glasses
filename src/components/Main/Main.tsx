"use client"
import Carousel from 'react-bootstrap/Carousel';
import Image from "next/image";
import 'bootstrap/dist/css/bootstrap.min.css';
import manSunglasses from '../../assets/images/backgrounds/man-sunglassesl.jpg'
import womanEyeglasses from '../../assets/images/backgrounds/woman-eyeglasses.jpeg'
import childrenLenses from '../../assets/images/backgrounds/children-lenses.jpg'
import styles from './main.module.scss'
import './carousel.scss'
import Link from "next/link";
import {useRouter} from "next/navigation";

const Main = () => {
    const router = useRouter()

    return (
        <Carousel interval={null} className={styles.mainBody}>
            <Carousel.Item>
                <div className={styles.bg}>
                    <Image src={manSunglasses} alt="man with sunglasses (background)" quality={85} fill={true}
                           sizes="100vw" style={{objectFit: 'cover'}} placeholder="blur" priority={true}/>
                </div>
                <Carousel.Caption>
                    <h2 className={styles.title}>Sunglasses</h2>
                    <p className={styles.quote1}>"Clothing affects everything from a person's sense of humor to their
                        perception of themselves. People should look seductive when they wear Dolce & Gabbana"<br/> -
                        Dolce & Gabbana</p>
                        <button className={styles.button__sunglasses__buy} onClick={() => router.push("/sunglasses")}><span
                            className={styles.button__sunglasses__buy__textBtn}>Buy</span><p
                            className={styles.button__sunglasses__buy__company}>Dolce & Gabbana</p></button>
                    <h5>OR</h5>
                    <div className={styles.buttonBlock}>
                        <button className={styles.button__sunglasses__find}
                                onClick={() => router.push("sunglasses")}>FIND YOUR IDEAL SUNGLASSES
                        </button>
                    </div>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <div className={styles.bg}>
                    <Image src={womanEyeglasses} alt="woman with eyeglasses (background)" quality={85} fill={true}
                           sizes="100vw" style={{objectFit: 'cover'}} placeholder="blur" priority={false}/>
                </div>
                <Carousel.Caption>
                    <h2 className={styles.title}>Eyeglasses</h2>
                    <p className={styles.quote2}>"I know what women look good in. I don't think the rules ever
                        change."<br/>- Michael Kors</p>
                        <button className={styles.button__sunglasses__buy} onClick={() => router.push("/eyeglasses")}><span
                            className={styles.button__sunglasses__buy__textBtn}>Buy</span><p
                            className={styles.button__sunglasses__buy__company}>Michael Kors</p></button>
                    <h5>OR</h5>
                        <div className={styles.buttonBlock}>
                            <button className={styles.button__sunglasses__find} onClick={() => router.push("/eyeglasses")}>FIND YOUR IDEAL EYEGLASSES</button>
                        </div>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <div className={styles.bg}>
                    <Image src={childrenLenses} alt="contact lenses (background)" quality={85} fill={true} sizes="100vw"
                           style={{objectFit: "cover"}} placeholder="blur" priority={false}/>
                </div>
                <Carousel.Caption>
                    <h2 className={styles.title}>Contact lenses</h2>
                    <p className={styles.about__lenses}>
                        Contact lenses are lenses that are placed directly on the cornea of the eye. They are most often
                        used to correct visual impairments: myopia (nearsightedness), hyperopia (hyperopia), astigmatism
                        and presbyopia. Lenses can also be used to change and emphasize eye color. In some cases, lenses
                        are prescribed for therapeutic purposes to protect the surface of the eye.
                    </p>
                    <div className={styles.buttonBlock}>
                    <button className={styles.button__sunglasses__find} onClick={() => router.push("/lenses")}>FIND YOUR IDEAL LENSES</button>
                    </div>
                </Carousel.Caption>
            </Carousel.Item>
        </Carousel>
    );
}

export default Main;