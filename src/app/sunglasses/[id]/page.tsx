"use client"
import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { doc, getFirestore, updateDoc, getDoc } from 'firebase/firestore';
import { auth, firebaseApp } from '@/firebase/firebase';
import { useRouter } from 'next/navigation';
import data from '../../../data/data.json';
import styles from './product.module.scss';
import Image from 'next/image';
import 'bootstrap/dist/css/bootstrap.min.css';

// --- SVG Иконки гарантий ---
const DeliveryIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13"></rect>
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
        <circle cx="5.5" cy="18.5" r="2.5"></circle>
        <circle cx="18.5" cy="18.5" r="2.5"></circle>
    </svg>
);

const WarrantyIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        <polyline points="9 12 11 14 15 10"></polyline>
    </svg>
);

const ReturnIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="1 4 1 10 7 10"></polyline>
        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
    </svg>
);
// -------------------------------------

export default function ProductPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const db = getFirestore(firebaseApp);
    
    // Ищем товар по ID из URL
    const product = data.sunglasses.find(item => item.id.toString() === params.id);

    const [showOrderModal, setShowOrderModal] = useState(false);
    const [currentOrderNum, setCurrentOrderNum] = useState('');
    const [isOrdering, setIsOrdering] = useState(false);

    if (!product) {
        return <div className={styles.notFound}><h2>Product not found 🥲</h2></div>;
    }

    const handleCloseOrder = () => setShowOrderModal(false);
    
    const handleShowOrder = () => {
        setCurrentOrderNum(orderNumber()); 
        setShowOrderModal(true);
    };

    const orderNumber = () => {
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += Math.floor(Math.random() * 10);
        }
        return result;
    }

    const sendOrderData = async () => {
        setIsOrdering(true); 
        try {
            const user = auth.currentUser;
            if (user && user.email) {
                
                const docRef = doc(db, 'data', `user - ${user.uid}`);

                const docSnap = await getDoc(docRef);
                let userAddress = null;
                if (docSnap.exists() && docSnap.data().address) {
                    userAddress = docSnap.data().address;
                }

                await updateDoc(docRef, { order: product.name });

                await fetch('/api/send-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: user.email,
                        userName: user.displayName || 'Customer', 
                        orderName: product.name,
                        orderNumber: currentOrderNum,
                        photoUrl: product.photo, 
                        address: userAddress 
                    })
                });

                setShowOrderModal(false);
                alert("Order placed successfully! Check your email for confirmation 😎");
            } else {
                router.push('/login');
            }
        } catch (error) {
            console.error('Error sending order data:', error);
            alert("Something went wrong");
        } finally {
            setIsOrdering(false); 
        }
    };

    return (
        <div className={styles.productPage}>
            
            <div className={styles.backButtonBlock}>
                <Button variant="outline-dark" onClick={() => router.push('/sunglasses')}>
                    &larr; Back to Sunglasses
                </Button>
            </div>

            <div className={styles.container}>
                {/* Левая часть - Фото */}
                <div className={styles.imageSection}>
                    <Image 
                        src={product.photo} 
                        alt={product.name} 
                        width={600} 
                        height={600} 
                        quality={100}
                        className={styles.mainImage}
                    />
                </div>

                {/* Правая часть - Информация */}
                <div className={styles.infoSection}>
                    <h1 className={styles.title}>{product.name}</h1>
                    <p className={styles.brand}>Brand: <b>{product.brand}</b></p>
                    <p className={styles.description}>{product.descriptions}</p>
                    
                    {/* НОВЫЙ БЛОК: Линия и 3 иконки */}
                    <hr className={styles.divider} />
                    <div className={styles.features}>
                        <div className={styles.featureItem}>
                            <DeliveryIcon />
                            <p className={styles.featureTitle}>Fast Delivery</p>
                            <p className={styles.featureDesc}>Delivery within 7 days!</p>
                        </div>
                        <div className={styles.featureItem}>
                            <WarrantyIcon />
                            <p className={styles.featureTitle}>Official Warranty</p>
                            <p className={styles.featureDesc}>2 year warranty + minor repairs.</p>
                        </div>
                        <div className={styles.featureItem}>
                            <ReturnIcon />
                            <p className={styles.featureTitle}>Easy Returns</p>
                            <p className={styles.featureDesc}>14 days buyer protection return.</p>
                        </div>
                    </div>
                    
                    <div className={styles.actionBlock}>
                        <p className={styles.price}>€{product.price}</p>
                        <Button variant="dark" className={styles.buyBtn} onClick={handleShowOrder}>
                            Buy Now
                        </Button>
                    </div>
                </div>
            </div>

            <Modal show={showOrderModal} onHide={handleCloseOrder} backdrop={false} keyboard={false} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{`${product.name} - Order #${currentOrderNum}`}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to order this item?
                    <br/><br/>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <Image src={product.photo} alt={product.name} width={150} height={150} style={{borderRadius: '10px'}}/>
                    </div>
                    <p className={styles.confirmOrderText}>*Within 10 minutes they call/email you to confirm the order.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseOrder} disabled={isOrdering}>
                        Cancel
                    </Button>
                    <Button variant="success" onClick={sendOrderData} disabled={isOrdering}>
                        {isOrdering ? 'Processing...' : 'Confirm Order'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}