"use client"
import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import { auth, firebaseApp } from '@/firebase/firebase';
import { useRouter } from 'next/navigation';
import data from '../../data/data.json';
import styles from './childrenglasses.module.scss'
import cart from '../../assets/images/icons/cart.png';
import Image from 'next/image';
import 'bootstrap/dist/css/bootstrap.min.css';
export default function ChildrenGlasses() {
    const router = useRouter();
    const db = getFirestore(firebaseApp);
    const [show, setShow] = useState(false);
    const [selectedChildrenGlasses, setSelectedChildrenGlasses] = useState<any>(null); // Стейт для хранения выбранной солнцезащитной очков

    const handleClose = () => setShow(false);
    const handleShow = (childrenglasses:any) => {
        setSelectedChildrenGlasses(childrenglasses); // Устанавливаем выбранные солнцезащитные очки перед открытием модального окна
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

    // @ts-ignore
    return (
        <div className={styles.childrenglasses}>
            <div className={styles.childrenglasses__container}>
                {data.childrenglasses.map((childrenglasses) => (
                    <div key={childrenglasses.id} className={styles.childrenglasses__card}>
                        <Image src={childrenglasses.photo} alt={`${childrenglasses.name} photo`} className={styles.childrenglasses__photo} width={210} height={170} quality={100} />
                        <p className={styles.childrenglasses__name}>{childrenglasses.name}</p>
                        <div className={styles.childrenglasses__price__cart__block}>
                            <p>€{childrenglasses.price}</p>
                            <Button className={styles.childrenglasses__buy__btn} onClick={() => handleShow(childrenglasses)} variant="light">
                                Buy
                                <Image className={styles.childrenglasses__cart} src={cart} alt="cart" quality={100} width={30} />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
            <Modal show={show} onHide={handleClose} backdrop={false} keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>{`${selectedChildrenGlasses?.name} - Order #${orderNumber()}`}</Modal.Title>
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
                    <Button variant="success" onClick={() => sendOrderData(selectedChildrenGlasses?.name)}>Order</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
