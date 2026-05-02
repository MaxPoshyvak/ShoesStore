'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from '../../../components/BestSelling.module.css';
import BestSellingCard from '../../../components/BestSellingCard';

const categories = ['Man', 'Woman', 'Boy', 'Child'];

interface Good {
    id: string;
    name: string;
    price: number;
    old_price: number | null;
    category: string;
    is_new: boolean;
    main_image_url: string;
    stock_quantity: number;
    sizes: string[];
}

// 1. МИ ПЕРЕЙМЕНУВАЛИ ГОЛОВНУ ФУНКЦІЮ НА ShopContent
function ShopContent() {
    const searchParams = useSearchParams();

    const activeCategory = searchParams.get('category') || 'Man';
    const sizeFilter = searchParams.get('size');
    const sortFilter = searchParams.get('sort');
    const instockFilter = searchParams.get('instock') === 'true';

    const [goods, setGoods] = useState<Good[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchGoods = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/goods`);
                if (!response.ok) throw new Error('Помилка');
                const data = await response.json();
                setGoods(data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchGoods();
    }, []);

    let filteredGoods = goods.filter((good) => good.category === activeCategory);

    if (sizeFilter) {
        filteredGoods = filteredGoods.filter((good) => good.sizes && good.sizes.map(String).includes(sizeFilter));
    }

    if (instockFilter) {
        filteredGoods = filteredGoods.filter((good) => good.stock_quantity > 0);
    }

    if (sortFilter === 'price_asc') {
        filteredGoods.sort((a, b) => a.price - b.price);
    } else if (sortFilter === 'price_desc') {
        filteredGoods.sort((a, b) => b.price - a.price);
    }

    const handleCategoryChange = (cat: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('category', cat);
        window.history.pushState(null, '', `?${params.toString()}`);
    };

    return (
        <main style={{ paddingTop: '120px', paddingBottom: '40px', minHeight: '80vh' }}>
            <div className={styles.header}>
                <span className={styles.line}></span>
                <h2 className={styles.title}>Shop Now</h2>
                <span className={styles.line}></span>
            </div>

            <div className={styles.filters}>
                {categories.map((cat) => (
                    <button
                        key={cat}
                        className={`${styles.filterBtn} ${activeCategory === cat ? styles.activeFilter : ''}`}
                        onClick={() => handleCategoryChange(cat)}>
                        {cat}
                    </button>
                ))}
            </div>

            <div className={styles.grid}>
                {isLoading ? (
                    <p style={{ textAlign: 'center', gridColumn: 'span 3', fontFamily: 'Poppins' }}>Loading...</p>
                ) : filteredGoods.length > 0 ? (
                    filteredGoods.map((product) => (
                        <BestSellingCard
                            key={product.id}
                            id={String(product.id)}
                            image={product.main_image_url}
                            name={product.name}
                            price={product.price}
                            oldPrice={product.old_price ? product.old_price : undefined}
                            stockQuantity={product.stock_quantity}
                            showHeart={true}
                            isNew={product.is_new}
                            sizes={product.sizes}
                        />
                    ))
                ) : (
                    <p style={{ textAlign: 'center', gridColumn: 'span 3', fontFamily: 'Poppins' }}>
                        За вашими фільтрами нічого не знайдено.
                    </p>
                )}
            </div>
        </main>
    );
}

// 2. СТВОРИЛИ НОВУ ГОЛОВНУ ФУНКЦІЮ, ЯКА ОБГОРТАЄ ВСЕ В SUSPENSE
export default function ShopPage() {
    return (
        <Suspense
            fallback={
                <div style={{ paddingTop: '120px', textAlign: 'center', fontFamily: 'Poppins' }}>Loading shop...</div>
            }>
            <ShopContent />
        </Suspense>
    );
}
