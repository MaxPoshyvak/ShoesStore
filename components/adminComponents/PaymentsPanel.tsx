import React from 'react';
import { CreditCard, CheckCircle, XCircle } from 'lucide-react';

const mockPayments = [
    {
        id: 'txn_3Mkd...',
        orderId: 101,
        amount: 3999,
        method: 'Stripe',
        status: 'succeeded',
        date: '16 Квіт 2026, 14:30',
    },
    {
        id: 'txn_9Lqp...',
        orderId: 102,
        amount: 7472,
        method: 'Stripe',
        status: 'succeeded',
        date: '15 Квіт 2026, 09:15',
    },
    { id: 'txn_4Xnc...', orderId: 103, amount: 2499, method: 'Stripe', status: 'failed', date: '14 Квіт 2026, 18:00' },
];

export const PaymentsPanel = () => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Історія транзакцій (Stripe)</h2>
            <span className="text-sm text-gray-500">Синхронізовано з вебхуками</span>
        </div>
        <table className="w-full text-left">
            <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                    <th className="p-4 font-semibold">ID Транзакції</th>
                    <th className="p-4 font-semibold">Замовлення</th>
                    <th className="p-4 font-semibold">Метод</th>
                    <th className="p-4 font-semibold">Сума</th>
                    <th className="p-4 font-semibold">Статус</th>
                    <th className="p-4 font-semibold">Дата</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
                {mockPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50 font-mono text-sm">
                        <td className="p-4 text-gray-600">{payment.id}</td>
                        <td className="p-4 font-medium text-black">#{payment.orderId}</td>
                        <td className="p-4 text-gray-600 flex items-center gap-2">
                            <CreditCard size={16} /> {payment.method}
                        </td>
                        <td className="p-4 font-bold">{payment.amount} ₴</td>
                        <td className="p-4 font-sans">
                            <span
                                className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center w-max gap-1 ${
                                    payment.status === 'succeeded'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                {payment.status === 'succeeded' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                {payment.status === 'succeeded' ? 'Успішно' : 'Помилка'}
                            </span>
                        </td>
                        <td className="p-4 text-gray-500 font-sans text-xs">{payment.date}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);
