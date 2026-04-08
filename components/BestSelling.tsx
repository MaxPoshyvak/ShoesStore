"use client";

import { useState } from "react";
import styles from "./BestSelling.module.css";
import ProductCard from "./ProductCard";

const categories = ["Man", "Woman", "Boy", "Child"];

// Оновлені дані під твої 6 нових картинок з Фігми
const mockGoods = [
    { id: 1, category: "Man", name: "Slick formal sneaker shoe", price: "₹ 2999.00", oldPrice: "₹ 4999.00", isNew: true, image: "/bs-shoe-1.png" },
    { id: 2, category: "Man", name: "Slick casual sneaker shoe", price: "₹ 3999.00", oldPrice: "₹ 4999.00", isNew: true, image: "/bs-shoe-2.png" },
    { id: 3, category: "Man", name: "Slick sneaker shoe", price: "₹ 2499.00", oldPrice: "₹ 4999.00", isNew: true, image: "/bs-shoe-3.png" },
    { id: 4, category: "Man", name: "Slick sneaker shoe", price: "₹ 2999.00", oldPrice: "₹ 4999.00", isNew: true, image: "/bs-shoe-4.png" },
    { id: 5, category: "Man", name: "Slick trendy sneaker shoe", price: "₹ 2799.00", oldPrice: "₹ 4999.00", isNew: true, image: "/bs-shoe-5.png" },
    { id: 6, category: "Man", name: "Slick canvas shoe", price: "₹ 1999.00", oldPrice: "₹ 4999.00", isNew: true, image: "/bs-shoe-6.png" },
];

export default function BestSelling() {
    const [activeCategory, setActiveCategory] = useState("Man");

    const filteredGoods = mockGoods.filter(good => good.category === activeCategory);

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
                {filteredGoods.length > 0 ? (
                    filteredGoods.map((good) => (
                        <ProductCard
                            key={good.id}
                            image={good.image}
                            name={good.name}
                            price={good.price}
                            oldPrice={good.oldPrice}
                            isNew={good.isNew}
                            showHeart={true}
                            fullWidth={true}
                            bestSellingStyle={true}
                        />
                    ))
                ) : (
                    <p style={{ textAlign: 'center', gridColumn: 'span 3', fontFamily: 'Poppins, sans-serif' }}>No products in this category yet.</p>
                )}
            </div>

        </section>
    );
}