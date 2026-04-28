'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';

interface ServerStatusPopupProps {
    // Цей пропс ти передаватимеш зі свого головного компонента.
    // false = сервер ще вантажиться
    // true = сервер відповів (статус 200)
    isReady: boolean;
}

export const ServerStatusPopup = ({ isReady }: ServerStatusPopupProps) => {
    // Стан для повного видалення з DOM
    const [isMounted, setIsMounted] = useState(true);
    // Стан для запуску анімації ховання (від'їзду за екран)
    const [isSlidingOut, setIsSlidingOut] = useState(false);

    useEffect(() => {
        if (isReady) {
            // Коли сервер "прокинувся", чекаємо 2 секунди, щоб юзер встиг прочитати "Server is ready"
            const slideTimer = setTimeout(() => {
                setIsSlidingOut(true); // Запускаємо анімацію від'їзду
            }, 2000);

            // Ще через 500мс (час анімації), повністю видаляємо компонент
            const unmountTimer = setTimeout(() => {
                setIsMounted(false);
            }, 2500);

            return () => {
                clearTimeout(slideTimer);
                clearTimeout(unmountTimer);
            };
        }
    }, [isReady]);

    // Якщо компонент видалено, нічого не рендеримо
    if (!isMounted) return null;

    return (
        <div
            className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ease-in-out transform ${
                isSlidingOut ? 'translate-x-[150%] opacity-0' : 'translate-x-0 opacity-100'
            }`}>
            <div className="bg-white border border-gray-100 shadow-xl rounded-2xl p-4 pr-6 flex items-center gap-4 max-w-sm">
                {/* Динамічна іконка */}
                <div
                    className={`p-2 rounded-full ${isReady ? 'bg-green-50 text-green-500' : 'bg-blue-50 text-blue-500'}`}>
                    {isReady ? (
                        <CheckCircle2 size={24} className="animate-in zoom-in duration-300" />
                    ) : (
                        <Loader2 size={24} className="animate-spin" />
                    )}
                </div>

                {/* Динамічний текст */}
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900">
                        {isReady ? 'Server is ready!' : 'Waking up the server...'}
                    </span>
                    <span className="text-xs text-gray-500">
                        {isReady
                            ? 'Connection established successfully.'
                            : 'This might take up to 50 seconds on Render.'}
                    </span>
                </div>
            </div>
        </div>
    );
};
