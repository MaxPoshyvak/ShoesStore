import React, { useEffect, useState } from 'react';
import { CreditCard, CheckCircle, XCircle, Clock } from 'lucide-react';
import { getPayments, Payment } from '@/utils/backendData/backendPayments';

export const PaymentsPanel = () => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getPayments()
            .then((data) => {
                setPayments(data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Помилка при завантаженні платежів:', error);
                setIsLoading(false);
            });
    }, []);

    const renderStatusBadge = (status: string) => {
        switch (status) {
            case 'success':
            case 'succeeded':
                return (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium flex items-center w-max gap-1 bg-green-100 text-green-800">
                        <CheckCircle size={14} /> Успішно
                    </span>
                );
            case 'pending':
                return (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium flex items-center w-max gap-1 bg-yellow-100 text-yellow-800">
                        <Clock size={14} /> В очікуванні
                    </span>
                );
            case 'failed':
                return (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium flex items-center w-max gap-1 bg-red-100 text-red-800">
                        <XCircle size={14} /> Помилка
                    </span>
                );
            default:
                return (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium flex items-center w-max gap-1 bg-gray-100 text-gray-800">
                        {status}
                    </span>
                );
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Історія транзакцій (Stripe)</h2>
                <span className="text-sm text-gray-500 font-medium">Всього: {payments.length}</span>
            </div>

            <div className="overflow-x-auto">
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
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-400 text-sm">
                                    Завантаження платежів...
                                </td>
                            </tr>
                        ) : payments.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-400 text-sm">
                                    Транзакцій поки немає
                                </td>
                            </tr>
                        ) : (
                            payments.map((payment) => (
                                <tr key={payment.id} className="hover:bg-gray-50 transition-colors text-sm">
                                    {/* Якщо Stripe ще не повернув transaction_id, показуємо прочерк або внутрішній ID */}
                                    <td className="p-4 text-gray-500 font-mono text-xs">
                                        {payment.transaction_id || `Внутрішній #${payment.id}`}
                                    </td>
                                    <td className="p-4 font-bold text-black">#{payment.order_id}</td>
                                    <td className="p-4 text-gray-600 flex items-center gap-2 capitalize">
                                        <CreditCard size={16} /> {payment.payment_method || 'stripe'}
                                    </td>
                                    <td className="p-4 font-black">{payment.amount} ₴</td>
                                    <td className="p-4 font-sans">{renderStatusBadge(payment.status)}</td>
                                    <td className="p-4 text-gray-500 font-medium text-xs">
                                        {new Date(payment.created_at).toLocaleString('uk-UA', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
