"use client"
import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import { auth, firebaseApp } from '@/firebase/firebase';
import { useRouter } from 'next/navigation';
import data from '../../data/data.json';
import styles from './sunglasses.module.scss'
import cart from '../../assets/images/icons/cart.png';
import Image from 'next/image';
import 'bootstrap/dist/css/bootstrap.min.css';
export default function Sunglasses() {
    const router = useRouter();
    const db = getFirestore(firebaseApp);
    const [show, setShow] = useState(false);
    const [selectedSunglasses, setSelectedSunglasses] = useState<any>(null); // Стейт для хранения выбранной солнцезащитной очков

    const handleClose = () => setShow(false);
    const handleShow = (sunglasses:any) => {
        setSelectedSunglasses(sunglasses); // Устанавливаем выбранные солнцезащитные очки перед открытием модального окна
        setShow(true);
    };

    const orderNumber = () => {
        let result = '';
        for (let i = 0; i < 6; i++) {
            const randomDigit = Math.floor(Math.random() * 10);
            result += randomDigit;
        }
        return result;
    }

    const sendOrderData = async (name:any) => {
        try {
            const userId = auth.currentUser?.uid;

            if (userId) {
                const docRef = doc(db, 'data', `user - ${userId}`);
                await updateDoc(docRef, {
                    order: name,
                });

                setShow(false);
            } else {
                router.push('/login');
            }
        } catch (error) {
            // Handle any errors that occur during the database operation
            console.error('Error sending order data:', error);
        }
    };

    return (
        <div className={styles.sunglasses}>
            <div className={styles.sunglasses__container}>
                {data.sunglasses.map((sunglasses) => (
                    <div key={sunglasses.id} className={styles.sunglasses__card}>
                        <Image src={sunglasses.photo} alt={`${sunglasses.name} photo`} className={styles.sunglasses__photo} width={178} height={178} quality={100} />
                        <p className={styles.sunglasses__name}>{sunglasses.name}</p>
                        <div className={styles.sunglasses__price__cart__block}>
                            <p>€{sunglasses.price}</p>
                            <Button className={styles.sunglasses__buy__btn} onClick={() => handleShow(sunglasses)} variant="light">
                                Buy
                                <Image className={styles.sunglasses__cart} src={cart} alt="cart" quality={100} width={30} />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
            <Modal show={show} onHide={handleClose} backdrop={false} keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>{`${selectedSunglasses?.name} - Order #${orderNumber()}`}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to order?
                    <br/>
                    <p className={styles.confirmOrderText}>*Within 10 minutes they call/email you to confirm the order.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="success" onClick={() => sendOrderData(selectedSunglasses?.name)}>Order</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
