import React, { useEffect, useMemo, useState } from 'react';
import { ShoppingCart, Eye, ChevronRight } from 'lucide-react';
import { getOrders } from '@/utils/backendData/BackendOrders';
import Popup from '@/components/Popup/Popup';
import { OrderDetailsContent } from '@/components/Popup/PopupContent/OrderDetailsContent';

import type { Order } from '@/types/backendTypes';
import { TableSkeleton } from '@/components/adminComponents/TableSkeleton';

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
    pending: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
    paid: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    shipped: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
    completed: { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
};

export const OrdersPanel = ({ searchInp }: { searchInp: string }) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            try {
                const data = await getOrders();
                setOrders(data);
            } catch (error) {
                console.error('Error loading orders:', error);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    const filteredOrders = useMemo(() => {
        if (!searchInp) return orders; // Якщо пошук пустий — повертаємо всіх

        const query = searchInp.toLowerCase() as string;
        return orders.filter(
            (orders) =>
                (orders.customer_name?.toLowerCase() || '').includes(query) ||
                (orders.customer_email?.toLowerCase() || '').includes(query) ||
                (orders.total_amount?.toString() || '').includes(query) ||
                (orders.customer_notes?.toLowerCase() || '').includes(query) ||
                (orders.payment_method?.toLowerCase() || '').includes(query),
        );
    }, [orders, searchInp]);

    const getStatusBadge = (status: string) => {
        const config = statusConfig[status] ?? statusConfig.pending;
        return (
            <span
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold ${config.bg} ${config.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-9 h-9 bg-gray-900 rounded-lg flex items-center justify-center shrink-0">
                        <ShoppingCart size={18} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-[15px] font-bold text-gray-900">Orders</h2>
                        <p className="text-[12px] text-gray-400 mt-0.5">
                            {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} total
                        </p>
                    </div>
                </div>

                {/* Mobile card list */}
                <div className="sm:hidden">
                    {isLoading ? (
                        <div className="p-8 text-center">
                            <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto" />
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="flex flex-col items-center gap-2 py-12">
                            <ShoppingCart size={32} className="text-gray-300" />
                            <p className="text-sm text-gray-400 font-medium">No orders yet</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {filteredOrders.map((order) => (
                                <button
                                    key={order.id}
                                    onClick={() => setSelectedOrder(order)}
                                    className="w-full text-left px-4 py-3.5 active:bg-gray-50 transition-colors">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-[13px] font-semibold text-gray-900 font-mono">
                                            #{order.id}
                                        </span>
                                        {getStatusBadge(order.status)}
                                    </div>
                                    <p className="text-[13px] text-gray-700 font-medium">{order.customer_name}</p>
                                    <p className="text-[11px] text-gray-400 mt-0.5">{order.customer_email}</p>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-[13px] font-bold text-gray-900">
                                            {order.total_amount} ₴
                                        </span>
                                        <div className="flex items-center gap-1 text-[11px] text-gray-400">
                                            {new Date(order.created_at).toLocaleDateString('en-US', {
                                                day: '2-digit',
                                                month: 'short',
                                            })}
                                            <ChevronRight size={12} />
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Desktop table */}
                <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-left min-w-175">
                        <thead>
                            <tr className="bg-gray-50/80 text-gray-400 text-[11px] uppercase tracking-wider border-b border-gray-100">
                                <th className="px-6 py-3.5 font-semibold">Order</th>
                                <th className="px-6 py-3.5 font-semibold">Customer</th>
                                <th className="px-6 py-3.5 font-semibold">Amount</th>
                                <th className="px-6 py-3.5 font-semibold">Status</th>
                                <th className="px-6 py-3.5 font-semibold">Date</th>
                                <th className="px-6 py-3.5 font-semibold text-right">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <TableSkeleton columns={6} rows={8} />
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <ShoppingCart size={32} className="text-gray-300" />
                                            <p className="text-sm text-gray-400 font-medium">No orders yet</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4 text-[13px] font-semibold text-gray-900 font-mono">
                                            #{order.id}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-[13px] font-semibold text-gray-900">
                                                {order.customer_name}
                                            </p>
                                            <p className="text-[11px] text-gray-400 mt-0.5">{order.customer_email}</p>
                                        </td>
                                        <td className="px-6 py-4 text-[13px] font-bold text-gray-900">
                                            {order.total_amount} ₴
                                        </td>
                                        <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                                        <td className="px-6 py-4 text-[13px] text-gray-500">
                                            {new Date(order.created_at).toLocaleString('en-US', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                                                <Eye size={14} />
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Popup
                isOpen={!!selectedOrder}
                onClose={() => setSelectedOrder(null)}
                title={`Order #${selectedOrder?.id}`}
                maxWidth="lg">
                {selectedOrder && <OrderDetailsContent order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
            </Popup>
        </div>
    );
};
