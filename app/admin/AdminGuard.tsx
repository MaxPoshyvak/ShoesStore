'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
// Імпортуй свій хук або стор, де лежить юзер
import { useAuth } from '../../components/AuthContext';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth(); // Твоя логіка авторизації
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        if (!isLoading) {
            if (!user || user.role !== 'admin') {
                // Якщо не адмін — викидаємо на головну сторінку
                router.replace('/');
            } else {
                // Якщо адмін — пускаємо
                setIsAuthorized(true);
            }
        }
    }, [user, isLoading, router]);

    if (isLoading || !isAuthorized) {
        // Поки перевіряємо, показуємо лоадер або просто пустий екран
        return <div className="h-screen flex items-center justify-center">Перевірка доступу...</div>;
    }

    return <>{children}</>;
}
