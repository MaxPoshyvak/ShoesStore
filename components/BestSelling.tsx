"use client";

import { useState, useEffect } from "react";
import styles from "./BestSelling.module.css";
import ProductCard from "./ProductCard";

const categories = ["Man", "Woman", "Boy", "Child"];



export default function BestSelling() {
  interface Good {
    id: string;
    name: string;
    price: number;
    old_price: number | null;
    category: string;
    is_new: boolean;
    main_image_url: string;
}

    const [activeCategory, setActiveCategory] = useState("Man")

    //СТАНИ ДЛЯ API

    const [goods, setGoods] = useState<Good[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        const fetchGoods = async () => {
            try {
                const response = await fetch('https://shoesstore-server.onrender.com/api/goods')
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
        }

        fetchGoods();

    }, []);
    const filteredGoods = goods.filter(good => good.category === activeCategory);



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
                        className={`${styles.filterBtn} ${activeCategory === cat ? styles.activeFilter : ""}`}
                        onClick={() => setActiveCategory(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className={styles.grid}>

                {isLoading ? (
                <p style={{ textAlign: 'center', gridColumn: 'span 3', fontFamily: 'Poppins, sans-serif' }}>Завантаження товарів...</p>
                ) : filteredGoods.length > 0 ? (
                    filteredGoods.map((good) => (
                        <ProductCard
                            key={good.id}
                            image={good.main_image_url}
                            name={good.name}
                            price={`₹ ${good.price}`}
                            oldPrice={good.old_price ? `₹ ${good.old_price}` : undefined}
                            isNew={good.is_new}
                            showHeart={true}
                            fullWidth={true}
                            bestSellingStyle={true}
                        />
                    ))
                ) : (
                    <p style={{ textAlign: 'center', gridColumn: 'span 3', fontFamily: 'Poppins, sans-serif' }}>В цій категорії поки немає товарів</p>
                )}
            </div>

        </section>
    );
}