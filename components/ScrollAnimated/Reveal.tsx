'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface RevealProps {
    children: ReactNode;
    // 🔥 Вибір ефекту
    effect?: 'fade-up' | 'fade-left' | 'fade-right' | 'scale' | 'blur' | 'flip';
    delay?: number;
    className?: string;
    duration?: number;
}

export const Reveal = ({ children, effect = 'fade-up', delay = 0, className = '', duration = 0.6 }: RevealProps) => {
    // Словник усіх наших анімацій
    const variants = {
        'fade-up': {
            initial: { opacity: 0, y: 40 },
            animate: { opacity: 1, y: 0 },
        },
        'fade-left': {
            initial: { opacity: 0, x: 40 }, // Виїжджає справа наліво
            animate: { opacity: 1, x: 0 },
        },
        'fade-right': {
            initial: { opacity: 0, x: -40 }, // Виїжджає зліва направо
            animate: { opacity: 1, x: 0 },
        },
        scale: {
            initial: { opacity: 0, scale: 0.8 }, // Трохи зменшено
            animate: { opacity: 1, scale: 1 }, // Виростає до нормального розміру
        },
        blur: {
            initial: { opacity: 0, filter: 'blur(12px)', y: 20 }, // Розмито
            animate: { opacity: 1, filter: 'blur(0px)', y: 0 }, // Фокусується (Apple style!)
        },
        flip: {
            initial: { opacity: 0, rotateX: -90 }, // Повернуто на 90 градусів у 3D
            animate: { opacity: 1, rotateX: 0 },
        },
    };

    return (
        <motion.div
            className={className}
            style={{ perspective: 1200 }}
            initial={variants[effect].initial}
            whileInView={variants[effect].animate}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
                duration: duration,
                delay: delay,
                ease: [0.21, 0.47, 0.32, 0.98], // Дорога і плавна крива
            }}>
            {children}
        </motion.div>
    );
};
