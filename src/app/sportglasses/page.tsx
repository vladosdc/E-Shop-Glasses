"use client"
import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import { auth, firebaseApp } from '@/firebase/firebase';
import { useRouter } from 'next/navigation';
import data from '../../data/data.json';
import styles from './sportglasses.module.scss'
import cart from '../../assets/images/icons/cart.png';
import Image from 'next/image';
import 'bootstrap/dist/css/bootstrap.min.css';
export default function SportGlasses() {
    const router = useRouter();
    const db = getFirestore(firebaseApp);
    const [show, setShow] = useState(false);
    const [selectedSportGlasses, setSelectedSportGlasses] = useState<any>(null); // Стейт для хранения выбранной солнцезащитной очков

    const handleClose = () => setShow(false);
    const handleShow = (sportglasses:any) => {
        setSelectedSportGlasses(sportglasses); // Устанавливаем выбранные солнцезащитные очки перед открытием модального окна
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
        <div className={styles.sportglasses}>
            <div className={styles.sportglasses__container}>
                {data.sportglasses.map((sportglasses) => (
                    <div key={sportglasses.id} className={styles.sportglasses__card}>
                        <Image src={sportglasses.photo} alt={`${sportglasses.name} photo`} className={styles.sportglasses__photo} width={210} height={170} quality={100} />
                        <p className={styles.sportglasses__name}>{sportglasses.name}</p>
                        <div className={styles.sportglasses__price__cart__block}>
                            <p>€{sportglasses.price}</p>
                            <Button className={styles.sportglasses__buy__btn} onClick={() => handleShow(sportglasses)} variant="light">
                                Buy
                                <Image className={styles.sportglasses__cart} src={cart} alt="cart" quality={100} width={30} />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
            <Modal show={show} onHide={handleClose} backdrop={false} keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>{`${selectedSportGlasses?.name} - Order #${orderNumber()}`}</Modal.Title>
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
                    <Button variant="success" onClick={() => sendOrderData(selectedSportGlasses?.name)}>Order</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
