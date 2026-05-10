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

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'success':
            case 'completed':
            case 'delivered':
                return 'bg-green-600';
            case 'pending':
            case 'processing':
                return 'bg-yellow-500';
            case 'cancelled':
            case 'failed':
                return 'bg-red-500';
            default:
                return 'bg-black';
        }
    };

    const formatDate = (dateStr: string, full: boolean) => {
        const opts: Intl.DateTimeFormatOptions = full
            ? { year: 'numeric', month: 'short', day: 'numeric' }
            : { month: 'short', day: 'numeric' };
        return new Date(dateStr).toLocaleDateString('en-US', opts);
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-4 sm:mb-6">Order History</h2>

            {!orders || orders.length === 0 ? (
                <div className="text-center py-10 sm:py-16 text-gray-400">
                    <p className="text-base sm:text-lg">You have not placed any orders yet.</p>
                    <p className="text-sm mt-2 text-gray-300">Start shopping to see your orders here.</p>
                </div>
            ) : (
                <div className="space-y-3 sm:space-y-4">
                    {orders.map((order) => {
                        const isExpanded = expandedOrders[order.id];

                        return (
                            <div
                                key={order.id}
                                className="border border-gray-100 rounded-2xl p-3 sm:p-5 hover:border-gray-200 transition-colors bg-white">
                                <div className="cursor-pointer" onClick={() => toggleOrder(order.id)}>
                                    <div className="flex items-start justify-between gap-2 mb-2 sm:mb-3">
                                        <div className="min-w-0">
                                            <span className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider">
                                                Order
                                            </span>
                                            <h3 className="font-bold text-sm sm:text-lg text-gray-900 truncate">
                                                #{order.id}
                                            </h3>
                                        </div>
                                        <span
                                            className={`shrink-0 flex items-center px-2 sm:px-3 py-0.5 sm:py-1 text-white text-[10px] sm:text-xs font-bold rounded-lg capitalize ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-xs sm:text-sm text-gray-500">
                                            <span className="hidden sm:inline">{formatDate(order.date, true)}</span>
                                            <span className="sm:hidden">{formatDate(order.date, false)}</span>
                                        </span>
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <span className="font-black text-sm sm:text-lg text-gray-900">
                                                ₴{order.total}
                                            </span>
                                            <ChevronDown
                                                className={`text-gray-400 transition-transform duration-300 shrink-0 ${
                                                    isExpanded ? 'rotate-180' : ''
                                                }`}
                                                size={18}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className="pt-4 mt-4 border-t border-gray-100 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <h4 className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">
                                            Items in order
                                        </h4>
                                        {order.items?.map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center gap-3 sm:gap-4 bg-gray-50/50 p-2.5 sm:p-3 rounded-xl border border-gray-50">
                                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-lg overflow-hidden shrink-0 border border-gray-100">
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        width={100}
                                                        height={100}
                                                        className="w-full h-full object-cover mix-blend-multiply"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-xs sm:text-sm text-gray-900 truncate">
                                                        {item.name}
                                                    </h4>
                                                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
                                                        <p className="text-[10px] sm:text-xs text-gray-500">
                                                            Size:{' '}
                                                            <span className="font-semibold text-gray-700">
                                                                {item.size}
                                                            </span>
                                                        </p>
                                                        <p className="text-[10px] sm:text-xs text-gray-500">
                                                            Qty:{' '}
                                                            <span className="font-semibold text-gray-700">
                                                                {item.quantity}
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="font-bold text-xs sm:text-sm text-gray-900 shrink-0">
                                                    ₴{item.price}
                                                </div>
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
