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
            {/* Top stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-center gap-3 bg-gray-50 p-3.5 rounded-xl">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                        <User size={16} className="text-gray-400" />
                    </div>
                    <div className="overflow-hidden min-w-0">
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Customer</p>
                        <p className="text-[13px] font-semibold text-gray-900 truncate">{order.customer_name}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 bg-gray-50 p-3.5 rounded-xl">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                        <CreditCard size={16} className="text-gray-400" />
                    </div>
                    <div className="overflow-hidden min-w-0">
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Payment</p>
                        <p className="text-[13px] font-semibold text-gray-900 truncate capitalize">
                            {order.payment_method}
                            <span
                                className={`ml-1 ${
                                    order.payment_status === 'paid' ? 'text-emerald-600' : 'text-amber-600'
                                }`}>
                                ({order.payment_status})
                            </span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 bg-gray-50 p-3.5 rounded-xl">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                        <MapPin size={16} className="text-gray-400" />
                    </div>
                    <div className="overflow-hidden min-w-0">
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Shipping</p>
                        <p className="text-[13px] font-semibold text-gray-900 truncate" title={order.shipping_address}>
                            {order.shipping_address}
                        </p>
                    </div>
                </div>
            </div>

            {/* Customer note */}
            {order.customer_notes && (
                <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3">
                    <FileText size={18} className="text-amber-500 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-[11px] font-semibold text-amber-700 uppercase tracking-wide mb-1">
                            Customer note
                        </p>
                        <p className="text-[13px] text-amber-900 italic leading-relaxed">
                            &ldquo;{order.customer_notes}&rdquo;
                        </p>
                    </div>
                </div>
            )}

            {/* Items */}
            <div>
                <h3 className="text-[13px] font-bold text-gray-900 mb-3 flex items-center gap-2 uppercase tracking-wide border-b border-gray-100 pb-2">
                    <Package size={15} /> Purchased items
                </h3>
                <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                    {order.items.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl hover:border-gray-200 transition-colors bg-white">
                            <Image
                                src={item.main_image_url}
                                alt={item.name}
                                width={64}
                                height={64}
                                className="w-14 h-14 object-cover rounded-lg bg-gray-50 border border-gray-100"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-[13px] font-semibold text-gray-900 truncate">{item.name}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 text-[11px] font-semibold text-gray-600">
                                        Size {item.size}
                                    </span>
                                    <span className="text-[11px] text-gray-400">#{item.good_id}</span>
                                </div>
                            </div>
                            <div className="text-right shrink-0">
                                <p className="text-[13px] font-bold text-gray-900">{item.price_at_purchase} ₴</p>
                                <p className="text-[11px] text-gray-400 mt-0.5">×{item.quantity}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Total */}
            <div className="border-t border-gray-100 pt-4">
                <div className="flex justify-between items-center mb-5">
                    <span className="text-[13px] text-gray-500 font-medium uppercase tracking-wider">Total</span>
                    <span className="text-2xl font-bold text-gray-900">{order.total_amount} ₴</span>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-[13px] font-semibold rounded-xl transition-colors">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
