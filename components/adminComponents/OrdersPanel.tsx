import React, { useEffect, useState } from 'react';
import { getOrders } from '@/utils/backendData/BackendOrders';
import Popup from '@/components/Popup/Popup';
import { OrderDetailsContent } from '@/components/Popup/PopupContent/OrderDetailsContent';

import type { Order } from '@/types/backendTypes';
import { TableSkeleton } from '@/components/adminComponents/TableSkeleton';

export const OrdersPanel = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchOrders = () => {
        setIsLoading(true);
        getOrders()
            .then((data) => setOrders(data))
            .catch((error) => console.error('Error loading orders:', error))
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        function loadOrders() {
            fetchOrders();
        }

        loadOrders();
    }, []);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Pending
                    </span>
                );
            case 'paid':
                return (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Paid
                    </span>
                );
            case 'shipped':
                return (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Shipped
                    </span>
                );
            case 'completed':
                return (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
                        Completed
                    </span>
                );
            default:
                return (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {status}
                    </span>
                );
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Orders</h2>
                <span className="text-sm font-medium text-gray-500">Total: {orders.length}</span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                            <th className="p-4 font-semibold">Order #</th>
                            <th className="p-4 font-semibold">Customer</th>
                            <th className="p-4 font-semibold">Amount</th>
                            <th className="p-4 font-semibold">Status</th>
                            <th className="p-4 font-semibold">Date</th>
                            <th className="p-4 font-semibold text-right">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {isLoading ? (
                            <TableSkeleton columns={6} rows={10} />
                        ) : (
                            orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 text-sm font-medium text-black">#{order.id}</td>
                                    <td className="p-4 text-sm text-gray-700">
                                        <p className="font-semibold">{order.customer_name}</p>
                                        <p className="text-xs text-gray-400">{order.customer_email}</p>
                                    </td>
                                    <td className="p-4 text-sm font-bold">{order.total_amount} ₴</td>
                                    <td className="p-4 text-sm">{getStatusBadge(order.status)}</td>
                                    <td className="p-4 text-sm text-gray-500">
                                        {new Date(order.created_at).toLocaleString('en-US', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </td>
                                    <td className="p-4 text-sm text-right">
                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="text-gray-500 hover:text-black bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg font-medium transition-colors text-xs">
                                            Details
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* 🚀 Очищений виклик Попапу */}
            <Popup
                isOpen={!!selectedOrder}
                onClose={() => setSelectedOrder(null)}
                title={`Order details #${selectedOrder?.id}`}
                maxWidth="lg">
                {selectedOrder && <OrderDetailsContent order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
            </Popup>
        </div>
    );
};
