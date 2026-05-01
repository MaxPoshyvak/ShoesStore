import React from 'react';
import { MapPin, CreditCard, User, FileText, Package } from 'lucide-react';
import type { Order } from '@/types/backendTypes';
import Image from 'next/image';

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
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Customer</p>
                        <p className="text-sm font-bold text-gray-900 truncate">{order.customer_name}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-white rounded-lg shadow-sm">
                        <CreditCard size={18} className="text-gray-500" />
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Payment</p>
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
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Shipping</p>
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
                        <p className="text-xs font-bold text-yellow-800 uppercase tracking-wide mb-1">Customer note</p>
                        <p className="text-sm text-yellow-900 italic leading-relaxed">
                            &quot;{order.customer_notes}&quot;
                        </p>
                    </div>
                </div>
            )}

            {/* Список товарів */}
            <div>
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2 uppercase tracking-wide border-b pb-2">
                    <Package size={16} /> Purchased items
                </h3>
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {order.items.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-4 p-3 border border-gray-100 rounded-xl hover:border-gray-200 transition-colors bg-white">
                            <Image
                                src={item.main_image_url}
                                alt={item.name}
                                width={80}
                                height={80}
                                className="w-16 h-16 object-cover rounded-lg bg-gray-50 border border-gray-100"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-gray-900 text-sm truncate">{item.name}</p>

                                <div className="flex items-center gap-3 mt-1.5">
                                    {/* Плашка для розміру */}
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 border border-gray-200 text-xs font-semibold text-gray-800">
                                        Size {item.size}
                                    </span>

                                    {/* Код товару просто поруч */}
                                    <span className="text-xs text-gray-500">
                                        Code: <span className="font-mono text-gray-700">#{item.good_id}</span>
                                    </span>
                                </div>
                            </div>

                            <div className="text-right shrink-0">
                                <p className="text-sm font-black text-gray-900">{item.price_at_purchase} ₴</p>
                                <p className="text-xs text-gray-500 mt-1 font-medium">Qty: {item.quantity}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Підсумок та кнопки */}
            <div className="border-t border-gray-200 pt-5 mt-6">
                <div className="flex justify-between items-center mb-6">
                    <span className="text-gray-500 font-medium uppercase text-sm tracking-wider">Total:</span>
                    <span className="text-3xl font-black text-black">{order.total_amount} ₴</span>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-bold rounded-xl transition-colors">
                        Close details
                    </button>
                </div>
            </div>
        </div>
    );
};
