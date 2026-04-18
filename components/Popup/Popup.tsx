// components/ui/Popup.tsx
import React, { useEffect } from 'react';
import { X } from 'lucide-react'; // Іконка хрестика

interface PopupProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode; // Ось сюди приїде твій контент!
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl'; // Можна додати розміри
}

const Popup: React.FC<PopupProps> = ({ isOpen, onClose, title, children, maxWidth = 'md' }) => {
    // Блокуємо скрол сторінки, коли попап відкритий
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    // Визначаємо ширину залежно від пропсу
    const maxWidthClass = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
    }[maxWidth];

    return (
        // 1. Темний фон (Overlay). Клік по ньому закриває попап
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={onClose}>
            {/* 2. Саме біле вікно. onClick={(e) => e.stopPropagation()} забороняє закриття при кліку ВНУТРІ вікна */}
            <div
                className={`bg-white rounded-2xl shadow-xl w-full ${maxWidthClass} flex flex-col max-h-[90vh] overflow-hidden`}
                onClick={(e) => e.stopPropagation()}>
                {/* Шапка попапа (Header) */}
                <div className="flex justify-between items-center p-5 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-1.5 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Тіло попапа (Content). Дозволяємо скролити, якщо контенту багато */}
                <div className="p-5 overflow-y-auto">{children}</div>
            </div>
        </div>
    );
};

export default Popup;
