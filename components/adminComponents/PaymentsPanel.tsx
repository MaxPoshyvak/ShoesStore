import React, { useEffect, useState } from 'react';
import { CreditCard, CheckCircle, XCircle, Clock } from 'lucide-react';
import { getPayments, Payment } from '@/utils/backendData/backendPayments';
import { TableSkeleton } from './TableSkeleton';

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
                console.error('Error loading payments:', error);
                setIsLoading(false);
            });
    }, []);

    const renderStatusBadge = (status: string) => {
        switch (status) {
            case 'success':
            case 'succeeded':
                return (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium flex items-center w-max gap-1 bg-green-100 text-green-800">
                        <CheckCircle size={14} /> Succeeded
                    </span>
                );
            case 'pending':
                return (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium flex items-center w-max gap-1 bg-yellow-100 text-yellow-800">
                        <Clock size={14} /> Pending
                    </span>
                );
            case 'failed':
                return (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium flex items-center w-max gap-1 bg-red-100 text-red-800">
                        <XCircle size={14} /> Failed
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
                <h2 className="text-xl font-bold text-gray-900">Transactions (Stripe)</h2>
                <span className="text-sm text-gray-500 font-medium">Total: {payments.length}</span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                            <th className="p-4 font-semibold">Transaction ID</th>
                            <th className="p-4 font-semibold">Order</th>
                            <th className="p-4 font-semibold">Method</th>
                            <th className="p-4 font-semibold">Amount</th>
                            <th className="p-4 font-semibold">Status</th>
                            <th className="p-4 font-semibold">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {isLoading ? (
                            <>
                                <TableSkeleton columns={6} rows={10} />
                            </>
                        ) : payments.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-400 text-sm">
                                    No transactions yet
                                </td>
                            </tr>
                        ) : (
                            payments.map((payment) => (
                                <tr key={payment.id} className="hover:bg-gray-50 transition-colors text-sm">
                                    {/* Якщо Stripe ще не повернув transaction_id, показуємо прочерк або внутрішній ID */}
                                    <td className="p-4 text-gray-500 font-mono text-xs">
                                        {payment.transaction_id || `Internal #${payment.id}`}
                                    </td>
                                    <td className="p-4 font-bold text-black">#{payment.order_id}</td>
                                    <td className="p-4 text-gray-600 flex items-center gap-2 capitalize">
                                        <CreditCard size={16} /> {payment.payment_method || 'stripe'}
                                    </td>
                                    <td className="p-4 font-black">{payment.amount} ₴</td>
                                    <td className="p-4 font-sans">{renderStatusBadge(payment.status)}</td>
                                    <td className="p-4 text-gray-500 font-medium text-xs">
                                        {new Date(payment.created_at).toLocaleString('en-US', {
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
