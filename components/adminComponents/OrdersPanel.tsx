import { MoreVertical } from 'lucide-react';

const mockOrders = [
    { id: 101, user: 'Олексій Іванов', total: 3999, status: 'pending', date: '2026-04-16' },
    { id: 102, user: 'Марія Коваленко', total: 7472, status: 'paid', date: '2026-04-15' },
];

export const OrdersPanel = () => {
    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gray-50/50">
                <h2 className="text-xl font-bold text-gray-900">Замовлення (Orders)</h2>
            </div>
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                        <th className="p-4 font-semibold">№ Замовлення</th>
                        <th className="p-4 font-semibold">Клієнт</th>
                        <th className="p-4 font-semibold">Сума</th>
                        <th className="p-4 font-semibold">Статус</th>
                        <th className="p-4 font-semibold">Дата</th>
                        <th className="p-4 font-semibold text-right">Деталі</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {mockOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                            <td className="p-4 text-sm font-medium">#{order.id}</td>
                            <td className="p-4 text-sm text-gray-700">{order.user}</td>
                            <td className="p-4 text-sm font-bold">{order.total} ₴</td>
                            <td className="p-4 text-sm">
                                <span
                                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                        order.status === 'paid'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}>
                                    {order.status === 'paid' ? 'Оплачено' : 'В очікуванні'}
                                </span>
                            </td>
                            <td className="p-4 text-sm text-gray-500">{order.date}</td>
                            <td className="p-4 text-sm text-right">
                                <button className="text-gray-400 hover:text-black">
                                    <MoreVertical size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
