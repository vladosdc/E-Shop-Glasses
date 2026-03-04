"use client"
import { useState } from 'react';
import { Button, Form, Offcanvas } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import data from '../../data/data.json';
import styles from './eyeglasses.module.scss'
import cart from '../../assets/images/icons/cart.png';
import Image from 'next/image';
import 'bootstrap/dist/css/bootstrap.min.css';

const FilterIcon = () => (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
        <path d="M1.5 3.5H14.5M4.5 8H11.5M6.5 12.5H9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default function Eyeglasses() {
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

    // Вытягиваем уникальные бренды и цвета из нового data.json
    const uniqueBrands = Array.from(new Set(data.eyeglasses.map(item => (item as any).brand))).filter(Boolean);
    const uniqueColors = Array.from(new Set(data.eyeglasses.map(item => (item as any).color))).filter(Boolean);

    // Фильтруем и сортируем
    const filteredAndSortedData = data.eyeglasses
        .filter(item => (filterBrand ? (item as any).brand === filterBrand : true))
        .filter(item => (filterColor ? (item as any).color === filterColor : true))
        .sort((a, b) => {
            if (sortPrice === 'asc') return a.price - b.price;
            if (sortPrice === 'desc') return b.price - a.price;
            return 0;
        });

    // Функция перехода на страницу товара
    const goToProduct = (id: number) => {
        router.push(`/eyeglasses/${id}`);
    };

    return (
        <div className={styles.eyeglasses}>
            {/* Верхняя панель с кнопкой фильтра */}
            <div className={styles.top__bar}>
                <Button variant="light" className={styles.filter__trigger__btn} onClick={handleShowFilter}>
                    <FilterIcon />
                    Filter
                </Button>
                <div className={styles.results__count}>
                   {filteredAndSortedData.length} Results
                </div>
            </div>

            {/* Контейнер с карточками */}
            <div className={styles.eyeglasses__container}>
                {filteredAndSortedData.map((eyeglasses) => (
                    <div key={eyeglasses.id} className={styles.eyeglasses__card}>
                        <Image 
                            src={eyeglasses.photo} 
                            alt={`${eyeglasses.name} photo`} 
                            className={styles.eyeglasses__photo} 
                            width={210} 
                            height={170} 
                            quality={100} 
                            onClick={() => goToProduct(eyeglasses.id)}
                            style={{ cursor: 'pointer', objectFit: 'contain' }}
                        />
                        <p className={styles.eyeglasses__name}>{eyeglasses.name}</p>
                        <div className={styles.eyeglasses__price__cart__block}>
                            <p>€{eyeglasses.price}</p>
                            <Button className={styles.eyeglasses__buy__btn} onClick={() => goToProduct(eyeglasses.id)} variant="light">
                                View & Buy
                                <Image className={styles.eyeglasses__cart} src={cart} alt="cart" quality={100} width={30} />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Боковая панель фильтров */}
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