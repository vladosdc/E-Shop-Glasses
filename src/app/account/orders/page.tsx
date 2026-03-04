"use client"
import { useEffect, useState } from 'react';
import { doc, getDoc, getFirestore, updateDoc, deleteField } from 'firebase/firestore'; 
import { auth, firebaseApp } from '@/firebase/firebase';
import Image from 'next/image';
import data from '../..//../data/data.json';
import { Button, Spinner } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import styles from './orders.module.scss'; 

const Orders = () => {
    const [orderName, setOrderName] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isCanceling, setIsCanceling] = useState(false); 
    const db = getFirestore(firebaseApp);
    const router = useRouter();

    useEffect(() => {
        const fetchOrder = async () => {
            const user = auth.currentUser;
            if (user) {
                const docRef = doc(db, 'data', `user - ${user.uid}`);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists() && docSnap.data().order) {
                    setOrderName(docSnap.data().order);
                }
            }
            setLoading(false);
        };

        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                fetchOrder();
            } else {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return <div className={styles.loader}><Spinner animation="border" variant="dark" /></div>;
    }

    if (!orderName) {
        return (
            <div className={styles.emptyOrders}>
                <h3 className="mb-4">You have no orders yet 🥲</h3>
                <Button variant="dark" onClick={() => router.push('/sunglasses')}>
                    Go to Shop
                </Button>
            </div>
        );
    }

    const allProducts = [
        ...data.sunglasses,
        ...data.eyeglasses,
        ...data.sportglasses,
        ...data.childrenglasses,
        ...data.lenses
    ];

    const product = allProducts.find(item => item.name === orderName);


    const handleCancelOrder = async () => {
        const confirmCancel = window.confirm("Are you sure you want to cancel this order?");
        if (!confirmCancel) return;

        setIsCanceling(true);
        try {
            const user = auth.currentUser;
            if (user && product) {
                const docRef = doc(db, 'data', `user - ${user.uid}`);
                

                await updateDoc(docRef, {
                    order: deleteField()
                });


                await fetch('/api/cancel-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: user.email,
                        userName: user.displayName || 'Customer',
                        orderName: product.name,
                        photoUrl: product.photo
                    })
                });

                setOrderName(null);
                alert("Order canceled successfully. Check your email.");
            }
        } catch (error) {
            console.error("Error canceling order:", error);
            alert("Something went wrong while canceling.");
        } finally {
            setIsCanceling(false);
        }
    };

    return (
        <div className={styles.ordersContainer}>
            <h3 className="mb-4">My Current Order</h3>
            
            {product ? (
                <div className={styles.orderCard}>
                    <div className={styles.orderMain}>
                        <div className={styles.imageBox}>
                            <Image 
                                src={product.photo} 
                                width={150} 
                                height={150} 
                                alt={product.name}
                                style={{ objectFit: 'contain' }}
                            />
                        </div>
                        <div className={styles.orderInfo}>
                            <h4>{product.name}</h4>
                            <p className={styles.brand}>Brand: {product.brand || 'N/A'}</p>
                            <div className={styles.statusBlock}>
                                <span className={styles.statusLabel}>Status:</span>
                                <span className={styles.statusValue}>Processing ⏳</span>
                            </div>
                            <p className={styles.price}>Total: <b>€{product.price}</b></p>
                        </div>
                    </div>
                    <div className={styles.orderActions}>
                        <Button 
                            variant="outline-danger" 
                            onClick={handleCancelOrder} 
                            disabled={isCanceling}
                            className={styles.cancelBtn}
                        >
                            {isCanceling ? 'Canceling...' : 'Cancel Order'}
                        </Button>
                    </div>
                </div>
            ) : (
                <div className={styles.orderCard}>
                    <div className={styles.orderInfo}>
                        <h4>{orderName}</h4>
                        <div className={styles.statusBlock}>
                            <span className={styles.statusLabel}>Status:</span>
                            <span className={styles.statusValue}>Processing ⏳</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;