import { getUsers } from '@/utils/backendData/backendUsers';
import { useEffect, useState } from 'react';
import { User as UserIcon, Shield } from 'lucide-react';
import Popup from '@/components/Popup/Popup';
import { UserDetailsContent } from '@/components/Popup/PopupContent/UserDetailsContent';
import { OrderDetailsContent } from '@/components/Popup/PopupContent/OrderDetailsContent';
import type { Order } from '@/types/backendTypes';

export interface User {
    id: string;
    username: string;
    email: string;
    role: 'admin' | 'user';
    created_at: string;
}

export const UsersPanel = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        getUsers()
            .then((data) => setUsers(data))
            .catch((error) => console.error('Помилка при завантаженні користувачів:', error));
    }, []);

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Користувачі (Users)</h2>
                <span className="text-sm font-medium text-gray-500">Всього: {users.length}</span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                            <th className="p-4 font-semibold">ID / Ім&apos;я</th>
                            <th className="p-4 font-semibold">Email</th>
                            <th className="p-4 font-semibold">Роль</th>
                            <th className="p-4 font-semibold">Дата реєстрації</th>
                            <th className="p-4 font-semibold text-right">Дії</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${user.role === 'admin' ? 'bg-black' : 'bg-gray-300'}`}>
                                            {user.username.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{user.username}</p>
                                            <p className="text-xs text-gray-400">ID: {user.id}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-gray-600 font-medium">{user.email}</td>
                                <td className="p-4">
                                    <span
                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                            user.role === 'admin' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {user.role === 'admin' ? <Shield size={12} /> : <UserIcon size={12} />}
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-gray-500">
                                    {new Date(user.created_at).toLocaleDateString('uk-UA')}
                                </td>
                                <td className="p-4 text-right">
                                    <button
                                        onClick={() => setSelectedUser(user)}
                                        className="text-gray-500 hover:text-black bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg font-medium transition-colors text-xs">
                                        Профіль
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Popup isOpen={!!selectedUser} onClose={() => setSelectedUser(null)} title="Картка клієнта" maxWidth="md">
                {selectedUser && (
                    <UserDetailsContent
                        user={selectedUser}
                        onClose={() => setSelectedUser(null)}
                        onOpenOrder={(order) => {
                            setSelectedUser(null);

                            setSelectedOrder({
                                ...order,
                                customer_name: selectedUser.username,
                                customer_email: selectedUser.email,
                            });
                        }}
                    />
                )}
            </Popup>

            <Popup
                isOpen={!!selectedOrder}
                onClose={() => setSelectedOrder(null)}
                title={`Деталі замовлення #${selectedOrder?.id}`}
                maxWidth="lg">
                {selectedOrder && <OrderDetailsContent order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
            </Popup>
        </div>
    );
};
