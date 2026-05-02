import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import { Order } from './types';

interface OrdersTabProps {
    orders: Order[];
}

export function OrdersTab({ orders }: OrdersTabProps) {
    const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});

    const toggleOrder = (orderId: string) => {
        setExpandedOrders((prev) => ({
            ...prev,
            [orderId]: !prev[orderId],
        }));
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Order History</h2>

            {!orders || orders.length === 0 ? (
                <div className="text-center py-10 text-gray-400">You haven&apos;t placed any orders yet.</div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => {
                        const isExpanded = expandedOrders[order.id];

                        return (
                            <div
                                key={order.id}
                                className="border border-gray-100 rounded-2xl p-5 hover:border-gray-200 transition-colors bg-white">
                                {/* HEADER ЗАМОВЛЕННЯ */}
                                <div
                                    className="flex flex-wrap justify-between items-center cursor-pointer gap-4"
                                    onClick={() => toggleOrder(order.id)}>
                                    <div>
                                        <span className="text-sm text-gray-500">Order ID</span>
                                        <h3 className="font-bold text-lg text-gray-900">#{order.id}</h3>
                                    </div>
                                    <div className="text-right hidden sm:block">
                                        <span className="text-sm text-gray-500">Total Amount</span>
                                        <p className="font-black text-lg">₴{order.total}</p>
                                    </div>
                                    <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-4">
                                        <div className="text-right sm:hidden">
                                            <span className="text-sm text-gray-500">Total</span>
                                            <p className="font-black">₴{order.total}</p>
                                        </div>
                                        <span className="text-sm text-gray-500 hidden md:inline-block">
                                            {new Date(order.date).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </span>

                                        <span
                                            className={`flex items-center gap-1.5 px-3 py-1 text-white text-xs font-bold rounded-lg capitalize ${
                                                order.status !== 'success' ? 'bg-black' : 'bg-green-600'
                                            }`}>
                                            {order.status}
                                        </span>
                                        {/* СТРІЛОЧКА */}
                                        <ChevronDown
                                            className={`text-gray-400 transition-transform duration-300 ${
                                                isExpanded ? 'rotate-180' : ''
                                            }`}
                                            size={20}
                                        />
                                    </div>
                                </div>

                                {/* РОЗГОРНУТИЙ СПИСОК ТОВАРІВ */}
                                {isExpanded && (
                                    <div className="pt-6 mt-5 border-t border-gray-50 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                            Items in order
                                        </h4>
                                        {order.items?.map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center gap-4 bg-gray-50/50 p-3 rounded-xl border border-gray-50">
                                                <div className="w-16 h-16 bg-white rounded-lg overflow-hidden shrink-0 border border-gray-100">
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        width={100}
                                                        height={100}
                                                        className="w-full h-full object-cover mix-blend-multiply"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-sm text-gray-900">{item.name}</h4>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Size:{' '}
                                                        <span className="font-semibold text-gray-700">{item.size}</span>
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Quantity:{' '}
                                                        <span className="font-semibold text-gray-700">
                                                            {item.quantity}
                                                        </span>
                                                    </p>
                                                </div>
                                                <div className="font-bold text-sm text-gray-900">₴{item.price}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
