"use client"
import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import { auth, firebaseApp } from '@/firebase/firebase';
import { useRouter } from 'next/navigation';
import data from '../../data/data.json';
import styles from './eyeglasses.module.scss'
import cart from '../../assets/images/icons/cart.png';
import Image from 'next/image';
import 'bootstrap/dist/css/bootstrap.min.css';
export default function Eyeglasses() {
    const router = useRouter();
    const db = getFirestore(firebaseApp);
    const [show, setShow] = useState(false);
    const [selectedEyeglasses, setSelectedEyeglasses] = useState<any>(null); // Стейт для хранения выбранной солнцезащитной очков

    const handleClose = () => setShow(false);
    const handleShow = (eyeglasses:any) => {
        setSelectedEyeglasses(eyeglasses); // Устанавливаем выбранные солнцезащитные очки перед открытием модального окна
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
        <div className={styles.eyeglasses}>
            <div className={styles.eyeglasses__container}>
                {data.eyeglasses.map((eyeglasses:any) => (
                    <div key={eyeglasses.id} className={styles.eyeglasses__card}>
                        <Image src={eyeglasses.photo} alt={`${eyeglasses.name} photo`} className={styles.eyeglasses__photo} width={210} height={170} quality={100} />
                        <p className={styles.eyeglasses__name}>{eyeglasses.name}</p>
                        <div className={styles.eyeglasses__price__cart__block}>
                            <p>€{eyeglasses.price}</p>
                            <Button className={styles.eyeglasses__buy__btn} onClick={() => handleShow(eyeglasses)} variant="light">
                                Buy
                                <Image className={styles.eyeglasses__cart} src={cart} alt="cart" quality={100} width={30} />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
            <Modal show={show} onHide={handleClose} backdrop={false} keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>{`${selectedEyeglasses?.name} - Order #${orderNumber()}`}</Modal.Title>
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
                    <Button variant="success" onClick={() => sendOrderData(selectedEyeglasses?.name)}>Order</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
