import { getUsers } from '@/utils/backendData/backendUsers';
import { useEffect, useState, useMemo } from 'react';
import { User as UserIcon, Shield, Users, ChevronRight } from 'lucide-react';
import Popup from '@/components/Popup/Popup';
import { UserDetailsContent } from '@/components/Popup/PopupContent/UserDetailsContent';
import { OrderDetailsContent } from '@/components/Popup/PopupContent/OrderDetailsContent';
import type { Order } from '@/types/backendTypes';
import { TableSkeleton } from '@/components/adminComponents/TableSkeleton';

export interface User {
    id: string;
    username: string;
    email: string;
    role: 'admin' | 'user';
    created_at: string;
}

// 🔥 ВИПРАВЛЕННЯ 1: Правильно приймаємо пропси
interface UsersPanelProps {
    searchInp: string;
}

export const UsersPanel = ({ searchInp }: UsersPanelProps) => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Завантажуємо юзерів ТІЛЬКИ один раз при старті
    useEffect(() => {
        (async () => {
            setIsLoading(true);
            try {
                const data = await getUsers();
                setUsers(data);
            } catch (error) {
                console.error('Error loading users:', error);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    // 🔥 ВИПРАВЛЕННЯ 2: Фільтруємо "на льоту" (Derived State)
    // Використовуємо useMemo, щоб не перераховувати це при кожному зайвому рендері
    const filteredUsers = useMemo(() => {
        if (!searchInp) return users; // Якщо пошук пустий — повертаємо всіх

        const query = searchInp.toLowerCase();
        return users.filter(
            (user) =>
                (user.username?.toLowerCase() || '').includes(query) ||
                (user.email?.toLowerCase() || '').includes(query) ||
                (user.created_at?.toLowerCase() || '').includes(query),
        );
    }, [users, searchInp]); // Фільтруємо заново тільки якщо змінилися юзери або рядок пошуку

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-9 h-9 bg-gray-900 rounded-lg flex items-center justify-center shrink-0">
                        <Users size={18} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-[15px] font-bold text-gray-900">Users</h2>
                        <p className="text-[12px] text-gray-400 mt-0.5">
                            {/* 🔥 Використовуємо filteredUsers для лічильника */}
                            {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
                        </p>
                    </div>
                </div>

                {/* Mobile card list */}
                <div className="sm:hidden">
                    {isLoading ? (
                        <div className="p-8 text-center">
                            <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto" />
                        </div>
                    ) : filteredUsers.length === 0 ? ( // 🔥 Замінили users на filteredUsers
                        <div className="flex flex-col items-center gap-2 py-12">
                            <Users size={32} className="text-gray-300" />
                            <p className="text-sm text-gray-400 font-medium">No users found</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {filteredUsers.map(
                                (
                                    user, // 🔥 Замінили users на filteredUsers
                                ) => (
                                    <button
                                        key={user.id}
                                        onClick={() => setSelectedUser(user)}
                                        className="w-full text-left px-4 py-3.5 flex items-center gap-3 active:bg-gray-50 transition-colors">
                                        <div
                                            className={`w-9 h-9 rounded-lg flex items-center justify-center text-white text-[12px] font-bold shrink-0 ${user.role === 'admin' ? 'bg-gray-900' : 'bg-gray-300 text-gray-600'}`}>
                                            {user.username.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="text-[13px] font-semibold text-gray-900 truncate">
                                                    {user.username}
                                                </p>
                                                <span
                                                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${user.role === 'admin' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                                    {user.role === 'admin' ? (
                                                        <Shield size={9} />
                                                    ) : (
                                                        <UserIcon size={9} />
                                                    )}
                                                    {user.role}
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-gray-400 truncate mt-0.5">{user.email}</p>
                                        </div>
                                        <ChevronRight size={16} className="text-gray-300 shrink-0" />
                                    </button>
                                ),
                            )}
                        </div>
                    )}
                </div>

                {/* Desktop table */}
                <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-left min-w-[650px]">
                        <thead>
                            <tr className="bg-gray-50/80 text-gray-400 text-[11px] uppercase tracking-wider border-b border-gray-100">
                                <th className="px-6 py-3.5 font-semibold">User</th>
                                <th className="px-6 py-3.5 font-semibold">Email</th>
                                <th className="px-6 py-3.5 font-semibold">Role</th>
                                <th className="px-6 py-3.5 font-semibold">Registered</th>
                                <th className="px-6 py-3.5 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <TableSkeleton columns={5} rows={8} />
                            ) : filteredUsers.length === 0 ? ( // 🔥 Замінили users на filteredUsers
                                <tr>
                                    <td colSpan={5} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <Users size={32} className="text-gray-300" />
                                            <p className="text-sm text-gray-400 font-medium">No users found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map(
                                    (
                                        user, // 🔥 Замінили users на filteredUsers
                                    ) => (
                                        <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-[11px] font-bold ${user.role === 'admin' ? 'bg-gray-900' : 'bg-gray-300 text-gray-600'}`}>
                                                        {user.username.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-[13px] font-semibold text-gray-900">
                                                            {user.username}
                                                        </p>
                                                        <p className="text-[11px] text-gray-400 font-mono">
                                                            {String(user.id).slice(0, 8)}…
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-[13px] text-gray-500">{user.email}</td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold ${user.role === 'admin' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'}`}>
                                                    {user.role === 'admin' ? (
                                                        <Shield size={11} />
                                                    ) : (
                                                        <UserIcon size={11} />
                                                    )}
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-[13px] text-gray-500">
                                                {new Date(user.created_at).toLocaleDateString('en-US', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => setSelectedUser(user)}
                                                    className="text-[12px] font-semibold text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                                                    Profile
                                                </button>
                                            </td>
                                        </tr>
                                    ),
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Popup isOpen={!!selectedUser} onClose={() => setSelectedUser(null)} title="Customer Profile" maxWidth="md">
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
                title={`Order #${selectedOrder?.id}`}
                maxWidth="lg">
                {selectedOrder && <OrderDetailsContent order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
            </Popup>
        </div>
    );
};
