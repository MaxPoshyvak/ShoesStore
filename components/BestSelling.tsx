'use client';

import { useState, useEffect } from 'react';
import styles from './BestSelling.module.css';
import BestSellingCard from './BestSellingCard/BestSellingCard';
import Link from 'next/link';
import { BestSellingCardSkeleton } from '@/components/BestSellingCard/BestSellingCardSkeleton';

const categories = ['Man', 'Woman', 'Boy', 'Child'];

export default function BestSelling() {
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

    const [activeCategory, setActiveCategory] = useState('Man');

    const skeletonArray = [1, 2, 3, 4, 5, 6];

    //СТАНИ ДЛЯ API

    const [goods, setGoods] = useState<Good[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchGoods = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/goods`);
                if (!response.ok) {
                    throw new Error('помилка мережі');
                }
                const data = await response.json();
                setGoods(data);
            } catch (error) {
                console.error('Помилка завантаження товарів:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGoods();
    }, []);
    const filteredGoods = goods.filter((good) => good.category === activeCategory).slice(0, 6);

    return (
        <section id="best-selling" className={styles.bestSelling}>
            <div className={styles.header}>
                <span className={styles.line}></span>
                <h2 className={styles.title}>Best Selling</h2>
                <span className={styles.line}></span>
            </div>

            <div className={styles.filters}>
                {categories.map((cat) => (
                    <button
                        key={cat}
                        className={`${styles.filterBtn} ${activeCategory === cat ? styles.activeFilter : ''}`}
                        onClick={() => setActiveCategory(cat)}>
                        {cat}
                    </button>
                ))}
            </div>

            <div className={styles.grid}>
                {isLoading ? (
                    <>
                        {skeletonArray.map((_, index) => (
                            <BestSellingCardSkeleton key={index} />
                        ))}
                    </>
                ) : filteredGoods.length > 0 ? (
                    filteredGoods.map((product) => (
                        <BestSellingCard // Використовуємо новий компонент
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
                    <p style={{ textAlign: 'center', gridColumn: '1 / -1', fontFamily: 'Poppins, sans-serif' }}>
                        В цій категорії поки немає товарів
                    </p>
                )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', paddingRight: '10px' }}>
                <Link
                    href={`/shop?category=${activeCategory}`}
                    style={{ fontFamily: 'Poppins', color: '#888888', textDecoration: 'none', fontSize: '16px' }}>
                    All goods...
                </Link>
            </div>
        </section>
    );
}
