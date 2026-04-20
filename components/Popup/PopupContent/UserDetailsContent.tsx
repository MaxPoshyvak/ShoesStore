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
        if (!user.id) {
            return;
        }

        getOrdersByUserId(user.id)
            .then((data) => setOrders(data))
            .catch((error) => console.error('Помилка при завантаженні замовлень користувача:', error));
    }, [user.id]);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center text-xl font-bold shadow-md">
                    {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        {user.username}
                        <span
                            className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-200 text-gray-700'
                            }`}>
                            {user.role}
                        </span>
                    </h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1.5">
                            <Mail size={14} /> {user.email}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Calendar size={14} /> {new Date(user.created_at).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>

            {/* Статистика клієнта */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-gray-100 p-4 rounded-xl flex items-center justify-between shadow-sm">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Витрачено</p>
                        <p className="text-2xl font-black text-gray-900">
                            {orders.reduce((total, order) => total + Number(order.total_amount), 0).toFixed(2)} ₴
                        </p>
                    </div>
                    <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                        <ShoppingBag size={20} />
                    </div>
                </div>
                <div className="bg-white border border-gray-100 p-4 rounded-xl flex items-center justify-between shadow-sm">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Замовлень</p>
                        <p className="text-2xl font-black text-gray-900">{orders.length}</p>
                    </div>
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                        <Package size={20} />
                    </div>
                </div>
            </div>

            <div>
                <h4 className="text-sm font-bold text-gray-900 mb-3 border-b pb-2 uppercase tracking-wide">
                    Історія замовлень
                </h4>

                <div className="space-y-2 max-h-62.5 overflow-y-auto pr-2 custom-scrollbar">
                    {orders.length === 0 ? (
                        <div className="p-6 text-center text-gray-400 text-sm">
                            The user has not made any orders yet.
                        </div>
                    ) : (
                        orders.map((order) => (
                            <div
                                key={order.id}
                                className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:border-black transition-colors group cursor-pointer bg-white">
                                {/* Ліва частина: Іконка та Інфо */}
                                <div className="flex items-center gap-4">
                                    <div className="bg-gray-50 p-2 rounded-lg text-gray-500 group-hover:bg-black group-hover:text-white transition-colors">
                                        <ShoppingBag size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">Замовлення #{order.id}</p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(order.created_at).toLocaleDateString()} •{' '}
                                            {order.items?.length || 0} товар(ів)
                                        </p>
                                    </div>
                                </div>

                                {/* Права частина: Ціна, Статус та Іконка переходу */}
                                <div className="text-right flex items-center gap-4">
                                    <div>
                                        {/* Виправили суму на Number() + toLocaleString */}
                                        <p className="text-sm font-black text-gray-900">
                                            {Number(order.total_amount).toLocaleString('uk-UA')} ₴
                                        </p>
                                        <p
                                            className={`text-[10px] font-bold uppercase tracking-wider ${
                                                order.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                                            }`}>
                                            {order.status === 'completed' ? 'Виконано' : 'В обробці'}
                                        </p>
                                    </div>
                                    <ExternalLink
                                        onClick={() => onOpenOrder(order)}
                                        size={16}
                                        className="text-gray-300 group-hover:text-black transition-colors"
                                    />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="pt-4 flex justify-end">
                <button
                    onClick={onClose}
                    className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-bold rounded-xl transition-colors">
                    Закрити
                </button>
            </div>
        </div>
    );
};
