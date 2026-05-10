import React, { useEffect, useMemo, useState } from 'react';
import { CreditCard, CheckCircle, XCircle, Clock } from 'lucide-react';
import { getPayments, Payment } from '@/utils/backendData/backendPayments';
import { TableSkeleton } from './TableSkeleton';

const statusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    success: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: <CheckCircle size={12} /> },
    succeeded: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: <CheckCircle size={12} /> },
    pending: { bg: 'bg-amber-50', text: 'text-amber-700', icon: <Clock size={12} /> },
    failed: { bg: 'bg-red-50', text: 'text-red-700', icon: <XCircle size={12} /> },
};

export const PaymentsPanel = ({ searchInp }: { searchInp: string }) => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            try {
                const data = await getPayments();
                setPayments(data);
            } catch (error) {
                console.error('Error loading payments:', error);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    const renderStatusBadge = (status: string) => {
        const config = statusConfig[status] ?? statusConfig.pending;
        return (
            <span
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold ${config.bg} ${config.text}`}>
                {config.icon}
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const filteredPayments = useMemo(() => {
        if (!searchInp) return payments; // Якщо пошук пустий — повертаємо всіх

        const query = searchInp.toLowerCase() as string;
        return payments.filter(
            (payment) =>
                (payment.status.toLowerCase() || '').includes(query) ||
                (payment.amount?.toString() || '').includes(query) ||
                (payment.order_id?.toString() || '').includes(query) ||
                (payment.payment_method?.toLowerCase() || '').includes(query) ||
                (payment.created_at?.toLowerCase() || '').includes(query),
        );
    }, [searchInp, payments]);

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-9 h-9 bg-gray-900 rounded-lg flex items-center justify-center shrink-0">
                        <CreditCard size={18} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-[15px] font-bold text-gray-900">Transactions</h2>
                        <p className="text-[12px] text-gray-400 mt-0.5">
                            {filteredPayments.length} transaction{filteredPayments.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                </div>

                {/* Mobile card list */}
                <div className="sm:hidden">
                    {isLoading ? (
                        <div className="p-8 text-center">
                            <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto" />
                        </div>
                    ) : filteredPayments.length === 0 ? (
                        <div className="flex flex-col items-center gap-2 py-12">
                            <CreditCard size={32} className="text-gray-300" />
                            <p className="text-sm text-gray-400 font-medium">No transactions yet</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {filteredPayments.map((payment) => (
                                <div key={payment.id} className="px-4 py-3.5">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-[13px] font-semibold text-gray-900 font-mono">
                                            #{payment.order_id}
                                        </span>
                                        {renderStatusBadge(payment.status)}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[13px] font-bold text-gray-900">{payment.amount} ₴</span>
                                        <span className="text-[11px] text-gray-400">
                                            {new Date(payment.created_at).toLocaleDateString('en-US', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <CreditCard size={12} className="text-gray-400" />
                                        <span className="text-[11px] text-gray-400 capitalize">
                                            {payment.payment_method ?? 'stripe'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Desktop table */}
                <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-left min-w-175">
                        <thead>
                            <tr className="bg-gray-50/80 text-gray-400 text-[11px] uppercase tracking-wider border-b border-gray-100">
                                <th className="px-6 py-3.5 font-semibold">Transaction</th>
                                <th className="px-6 py-3.5 font-semibold">Order</th>
                                <th className="px-6 py-3.5 font-semibold">Method</th>
                                <th className="px-6 py-3.5 font-semibold">Amount</th>
                                <th className="px-6 py-3.5 font-semibold">Status</th>
                                <th className="px-6 py-3.5 font-semibold">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <TableSkeleton columns={6} rows={8} />
                            ) : filteredPayments.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <CreditCard size={32} className="text-gray-300" />
                                            <p className="text-sm text-gray-400 font-medium">No transactions yet</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredPayments.map((payment) => (
                                    <tr key={payment.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 text-[12px] text-gray-400 font-mono">
                                            {payment.transaction_id ?? `Internal #${payment.id}`}
                                        </td>
                                        <td className="px-6 py-4 text-[13px] font-semibold text-gray-900 font-mono">
                                            #{payment.order_id}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 text-[13px] text-gray-500 capitalize">
                                                <CreditCard size={14} className="text-gray-400" />
                                                {payment.payment_method ?? 'stripe'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-[13px] font-bold text-gray-900">
                                            {payment.amount} ₴
                                        </td>
                                        <td className="px-6 py-4">{renderStatusBadge(payment.status)}</td>
                                        <td className="px-6 py-4 text-[12px] text-gray-400">
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
        </div>
    );
};
