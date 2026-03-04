"use client"
import { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { doc, getFirestore, getDoc, updateDoc } from 'firebase/firestore';
import { auth, firebaseApp } from '@/firebase/firebase';
import { onAuthStateChanged } from '@firebase/auth';
import { useRouter } from 'next/navigation';
import styles from './address.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Address() {
    const router = useRouter();
    const db = getFirestore(firebaseApp);
    const [userUid, setUserUid] = useState<string | null>(null);
    
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [street, setStreet] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [phone, setPhone] = useState('');
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUserUid(user.uid);
                const docRef = doc(db, 'data', `user - ${user.uid}`);
                try {
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists() && docSnap.data().address) {
                        const addr = docSnap.data().address;
                        setCountry(addr.country || '');
                        setCity(addr.city || '');
                        setStreet(addr.street || '');
                        setZipCode(addr.zipCode || '');
                        setPhone(addr.phone || '');
                    }
                } catch (error) {
                    console.error("Error fetching address:", error);
                }
                setLoading(false);
            } else {
                router.push('/login');
            }
        });
        return () => unsubscribe();
    }, [db, router]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault(); 
        setSaving(true);
        try {
            if (userUid) {
                const docRef = doc(db, 'data', `user - ${userUid}`);
                await updateDoc(docRef, {
                    address: { country, city, street, zipCode, phone }
                });
                alert('Address successfully saved! 😎');
                router.push('/account'); 
            }
        } catch (error) {
            console.error("Error saving address:", error);
            alert('Oops, something went wrong.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className={styles.loader}>Loading your info...</div>;

    return (
        <div className={styles.address__page}>
            <div className={styles.address__container}>
                <h2 className={styles.title}>Delivery Address</h2>
                
                <Form onSubmit={handleSave} className={styles.form}>
                    <Form.Group className="mb-3">
                        <Form.Label>Country</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="e.g. Germany" 
                            value={country} 
                            onChange={(e) => setCountry(e.target.value)} 
                            required 
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>City</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="e.g. Berlin" 
                            value={city} 
                            onChange={(e) => setCity(e.target.value)} 
                            required 
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Street & House Number</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="e.g. Alexanderplatz 1" 
                            value={street} 
                            onChange={(e) => setStreet(e.target.value)} 
                            required 
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>ZIP / Postal Code</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="e.g. 10178" 
                            value={zipCode} 
                            onChange={(e) => setZipCode(e.target.value)} 
                            required 
                        />
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control 
                            type="tel" 
                            placeholder="+49 123 4567890" 
                            value={phone} 
                            onChange={(e) => setPhone(e.target.value)} 
                            required 
                        />
                    </Form.Group>

                    <div className={styles.btn__block}>
                        <Button variant="outline-dark" className={styles.back__btn} onClick={() => router.push('/account')}>
                            Back
                        </Button>
                        <Button type="submit" disabled={saving} className={styles.save__btn}>
                            {saving ? 'Saving...' : 'Save Address'}
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
}