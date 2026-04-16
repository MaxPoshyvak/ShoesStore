import { getUsers } from '@/utils/backendData';
import { useEffect, useState } from 'react';

interface User {
    id: number;
    username: string;
    email: string;
    role: 'admin' | 'user';
    ordersCount: number;
    created_at: string;
}

export const UsersPanel = () => {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        getUsers()
            .then((data) => setUsers(data))
            .catch((error) => console.error('Помилка при завантаженні користувачів:', error));
    }, []);

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Користувачі (Users)</h2>
            <div className="space-y-4">
                {users.map((user) => (
                    <div
                        key={user.id}
                        className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:border-gray-300 transition-colors">
                        <div>
                            <p className="font-semibold text-gray-900">{user.username}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                        <div className="text-right">
                            <span
                                className={`text-xs px-2 py-1 rounded ${user.role === 'admin' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}`}>
                                {user.role}
                            </span>
                            <p className="text-xs text-gray-400 mt-1">
                                Зареєстрований: {new Date(user.created_at).toLocaleString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
