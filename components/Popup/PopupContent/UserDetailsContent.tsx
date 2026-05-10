import React from 'react';
import { Mail, Calendar, ShoppingBag, Package, ExternalLink } from 'lucide-react';
import { getOrdersByUserId } from '@/utils/backendData/BackendOrders';
import type { Order } from '@/types/backendTypes';

interface User {
    id: string;
    username: string;
    email: string;
    role: 'admin' | 'user';
    created_at: string;
}

interface UserDetailsContentProps {
    user: User;
    onClose: () => void;
    onOpenOrder: (order: Order) => void;
}

export const UserDetailsContent: React.FC<UserDetailsContentProps> = ({ user, onClose, onOpenOrder }) => {
    const [orders, setOrders] = React.useState<Order[]>([]);

    React.useEffect(() => {
        if (!user.id) return;
        getOrdersByUserId(user.id)
            .then((data) => setOrders(data))
            .catch((error) => console.error('Error loading user orders:', error));
    }, [user.id]);

    const totalSpent = orders.reduce((total, order) => total + Number(order.total_amount), 0);

    return (
        <div className="space-y-6">
            {/* User header */}
            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl">
                <div className="w-12 h-12 bg-gray-900 text-white rounded-xl flex items-center justify-center text-lg font-bold">
                    {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-[15px] font-bold text-gray-900 flex items-center gap-2">
                        {user.username}
                        <span
                            className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                                user.role === 'admin' ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-600'
                            }`}>
                            {user.role}
                        </span>
                    </h3>
                    <div className="flex items-center gap-3 mt-1 text-[12px] text-gray-400">
                        <span className="flex items-center gap-1">
                            <Mail size={12} /> {user.email}
                        </span>
                        <span className="flex items-center gap-1">
                            <Calendar size={12} /> {new Date(user.created_at).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-white border border-gray-100 p-4 rounded-xl flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Spent</p>
                        <p className="text-xl font-bold text-gray-900 mt-0.5">{totalSpent.toFixed(2)} ₴</p>
                    </div>
                    <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center">
                        <ShoppingBag size={18} className="text-emerald-600" />
                    </div>
                </div>
                <div className="bg-white border border-gray-100 p-4 rounded-xl flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Orders</p>
                        <p className="text-xl font-bold text-gray-900 mt-0.5">{orders.length}</p>
                    </div>
                    <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Package size={18} className="text-blue-600" />
                    </div>
                </div>
            </div>

            {/* Order history */}
            <div>
                <h4 className="text-[13px] font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2 uppercase tracking-wide">
                    Order History
                </h4>

                <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                    {orders.length === 0 ? (
                        <div className="p-8 text-center text-gray-400 text-[13px]">
                            The user has not made any orders yet.
                        </div>
                    ) : (
                        orders.map((order) => (
                            <div
                                key={order.id}
                                className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:border-gray-200 transition-colors group cursor-pointer bg-white">
                                <div className="flex items-center gap-3">
                                    <div className="bg-gray-50 p-2 rounded-lg text-gray-400 group-hover:bg-gray-900 group-hover:text-white transition-colors">
                                        <ShoppingBag size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[13px] font-semibold text-gray-900">Order #{order.id}</p>
                                        <p className="text-[11px] text-gray-400">
                                            {new Date(order.created_at).toLocaleDateString()} •{' '}
                                            {order.items?.length ?? 0} item(s)
                                        </p>
                                    </div>
                                </div>

                                <div className="text-right flex items-center gap-3">
                                    <div>
                                        <p className="text-[13px] font-bold text-gray-900">
                                            {Number(order.total_amount).toLocaleString('en-US')} ₴
                                        </p>
                                        <p
                                            className={`text-[10px] font-semibold uppercase tracking-wider ${
                                                order.status === 'completed' ? 'text-emerald-600' : 'text-amber-600'
                                            }`}>
                                            {order.status === 'completed' ? 'Completed' : 'In progress'}
                                        </p>
                                    </div>
                                    <ExternalLink
                                        onClick={() => onOpenOrder(order)}
                                        size={14}
                                        className="text-gray-300 group-hover:text-gray-600 transition-colors"
                                    />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="pt-3 flex justify-end">
                <button
                    onClick={onClose}
                    className="px-5 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-[13px] font-semibold rounded-xl transition-colors">
                    Close
                </button>
            </div>
        </div>
    );
};
