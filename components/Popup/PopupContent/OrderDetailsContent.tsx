// components/popups/OrderDetailsContent.tsx
import React from 'react';
import { MapPin, CreditCard, User, FileText, Package } from 'lucide-react';

// Експортуємо інтерфейси, щоб їх можна було перевикористати в OrdersPanel
export interface OrderItem {
    order_id: number;
    good_id: number;
    quantity: number;
    price_at_purchase: number;
    name: string;
    main_image_url: string;
}

export interface Order {
    id: number;
    total_amount: number;
    status: string;
    payment_method: string;
    payment_status: string;
    shipping_address: string;
    customer_notes: string | null;
    created_at: string;
    customer_email: string;
    customer_name: string;
    items: OrderItem[];
}

interface OrderDetailsContentProps {
    order: Order;
    onClose: () => void;
}

export const OrderDetailsContent: React.FC<OrderDetailsContentProps> = ({ order, onClose }) => {
    return (
        <div className="space-y-6">
            {/* Верхня статистика */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-white rounded-lg shadow-sm">
                        <User size={18} className="text-gray-500" />
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Клієнт</p>
                        <p className="text-sm font-bold text-gray-900 truncate">{order.customer_name}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-white rounded-lg shadow-sm">
                        <CreditCard size={18} className="text-gray-500" />
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Оплата</p>
                        <p className="text-sm font-bold text-gray-900 capitalize truncate">
                            {order.payment_method}
                            <span
                                className={
                                    order.payment_status === 'paid' ? 'text-green-600 ml-1' : 'text-yellow-600 ml-1'
                                }>
                                ({order.payment_status})
                            </span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-white rounded-lg shadow-sm">
                        <MapPin size={18} className="text-gray-500" />
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Доставка</p>
                        <p className="text-sm font-bold text-gray-900 truncate" title={order.shipping_address}>
                            {order.shipping_address}
                        </p>
                    </div>
                </div>
            </div>

            {/* Нотатки клієнта */}
            {order.customer_notes && (
                <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl flex gap-3">
                    <FileText size={20} className="text-yellow-600 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-xs font-bold text-yellow-800 uppercase tracking-wide mb-1">
                            Коментар клієнта
                        </p>
                        <p className="text-sm text-yellow-900 italic leading-relaxed">
                            &quot;{order.customer_notes}&quot;
                        </p>
                    </div>
                </div>
            )}

            {/* Список товарів */}
            <div>
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2 uppercase tracking-wide border-b pb-2">
                    <Package size={16} /> Придбані товари
                </h3>
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {order.items.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-4 p-3 border border-gray-100 rounded-xl hover:border-gray-200 transition-colors bg-white">
                            <img
                                src={item.main_image_url}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-lg bg-gray-50 border border-gray-100"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-gray-900 text-sm truncate">{item.name}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Код товару: <span className="font-mono text-gray-700">#{item.good_id}</span>
                                </p>
                            </div>
                            <div className="text-right shrink-0">
                                <p className="text-sm font-black text-gray-900">{item.price_at_purchase} ₴</p>
                                <p className="text-xs text-gray-500 mt-1 font-medium text-black">
                                    К-сть: {item.quantity}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Підсумок та кнопки */}
            <div className="border-t border-gray-200 pt-5 mt-6">
                <div className="flex justify-between items-center mb-6">
                    <span className="text-gray-500 font-medium uppercase text-sm tracking-wider">Загальна сума:</span>
                    <span className="text-3xl font-black text-black">{order.total_amount} ₴</span>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-bold rounded-xl transition-colors">
                        Закрити деталі
                    </button>
                </div>
            </div>
        </div>
    );
};
