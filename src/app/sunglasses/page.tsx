"use client"
import { useState } from 'react';
import { Button, Form, Offcanvas } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import data from '../../data/data.json';
import styles from './sunglasses.module.scss'
import cart from '../../assets/images/icons/cart.png';
import Image from 'next/image';
import 'bootstrap/dist/css/bootstrap.min.css';

const FilterIcon = () => (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
        <path d="M1.5 3.5H14.5M4.5 8H11.5M6.5 12.5H9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default function Sunglasses() {
    const router = useRouter();
    
    // Стейты для Offcanvas (Фильтры)
    const [showFilterCanvas, setShowFilterCanvas] = useState(false);
    
    // Стейты для самих фильтров
    const [filterBrand, setFilterBrand] = useState('');
    const [filterColor, setFilterColor] = useState('');
    const [sortPrice, setSortPrice] = useState('');

    const handleCloseFilter = () => setShowFilterCanvas(false);
    const handleShowFilter = () => setShowFilterCanvas(true);

    const resetFilters = () => {
        setFilterBrand('');
        setFilterColor('');
        setSortPrice('');
    }

    const uniqueBrands = Array.from(new Set(data.sunglasses.map(item => item.brand))).filter(Boolean);
    const uniqueColors = Array.from(new Set(data.sunglasses.map(item => (item as any).color))).filter(Boolean);

    const filteredAndSortedData = data.sunglasses
        .filter(item => (filterBrand ? item.brand === filterBrand : true))
        .filter(item => (filterColor ? (item as any).color === filterColor : true))
        .sort((a, b) => {
            if (sortPrice === 'asc') return a.price - b.price;
            if (sortPrice === 'desc') return b.price - a.price;
            return 0;
        });

    // Функция перехода на страницу товара
    const goToProduct = (id: number) => {
        router.push(`/sunglasses/${id}`);
    };

    return (
        <div className={styles.sunglasses}>
            <div className={styles.top__bar}>
                <Button variant="light" className={styles.filter__trigger__btn} onClick={handleShowFilter}>
                    <FilterIcon />
                    Filter
                </Button>
                <div className={styles.results__count}>
                   {filteredAndSortedData.length} Results
                </div>
            </div>

            <div className={styles.sunglasses__container}>
                {filteredAndSortedData.map((sunglasses) => (
                    <div key={sunglasses.id} className={styles.sunglasses__card}>
                        {/* Клик по картинке */}
                        <Image 
                            src={sunglasses.photo} 
                            alt={`${sunglasses.name} photo`} 
                            className={styles.sunglasses__photo} 
                            width={178} 
                            height={178} 
                            quality={100} 
                            onClick={() => goToProduct(sunglasses.id)}
                            style={{ cursor: 'pointer' }}
                        />
                        <p className={styles.sunglasses__name}>{sunglasses.name}</p>
                        <div className={styles.sunglasses__price__cart__block}>
                            <p>€{sunglasses.price}</p>
                            {/* Переименовали кнопку и повесили переход */}
                            <Button className={styles.sunglasses__buy__btn} onClick={() => goToProduct(sunglasses.id)} variant="light">
                                View & Buy
                                <Image className={styles.sunglasses__cart} src={cart} alt="cart" quality={100} width={30} />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <Offcanvas show={showFilterCanvas} onHide={handleCloseFilter} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title className="fw-bold">Filter</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body className={styles.offcanvas__body}>
                    <Form.Group className="mb-4">
                        <Form.Label className="fw-bold">Brand</Form.Label>
                        <Form.Select onChange={(e) => setFilterBrand(e.target.value)} value={filterBrand}>
                            <option value="">All Brands</option>
                            {uniqueBrands.map(brand => (
                                <option key={brand as string} value={brand as string}>{brand as string}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label className="fw-bold">Color</Form.Label>
                        <Form.Select onChange={(e) => setFilterColor(e.target.value)} value={filterColor}>
                            <option value="">All Colors</option>
                            {uniqueColors.map(color => (
                                <option key={color as string} value={color as string}>{color as string}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-5">
                        <Form.Label className="fw-bold">Price</Form.Label>
                        <Form.Select onChange={(e) => setSortPrice(e.target.value)} value={sortPrice}>
                            <option value="">Default sorting</option>
                            <option value="asc">Lowest to Highest</option>
                            <option value="desc">Highest to Lowest</option>
                        </Form.Select>
                    </Form.Group>

                    <div className={styles.offcanvas__actions}>
                         <Button variant="outline-dark" onClick={resetFilters} className="mb-2 w-100">
                            Reset
                        </Button>
                        <Button variant="dark" onClick={handleCloseFilter} className="w-100">
                            Show results ({filteredAndSortedData.length})
                        </Button>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    );
}