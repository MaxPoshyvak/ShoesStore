import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { getGoods } from '@/utils/backendData';

interface Good {
    id: number;
    name: string;
    category: string;
    price: number;
    stock_quantity: number;
    isNew?: boolean;
}

export const GoodsPanel = () => {
    const [goods, setGoods] = useState<Good[]>([]);

    useEffect(() => {
        getGoods()
            .then((data) => setGoods(data))
            .catch((error) => console.error('Помилка при завантаженні товарів:', error));
    }, []);

    // ТУТ БУДЕ ТВІЙ ЗАПИТ ДО БЕКЕНДУ:
    // useEffect(() => {
    //   fetch('http://localhost:3000/api/goods')
    //     .then(res => res.json())
    //     .then(data => setGoods(data));
    // }, []);

    // const handleDelete = (id) => {
    //     if (window.confirm('Видалити цей товар?')) {
    //         // ТУТ БУДЕ ЗАПИТ НА ВИДАЛЕННЯ:
    //         // fetch(`http://localhost:3000/api/goods/${id}`, { method: 'DELETE' });
    //         setGoods(goods.filter((g) => g.id !== id));
    //     }
    // };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
                <h2 className="text-xl font-bold text-gray-900">Товари (Goods)</h2>
                <button className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                    <Plus size={16} /> Додати товар
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                            <th className="p-4 font-semibold">ID</th>
                            <th className="p-4 font-semibold">Назва</th>
                            <th className="p-4 font-semibold">Категорія</th>
                            <th className="p-4 font-semibold">Ціна</th>
                            <th className="p-4 font-semibold">Залишок</th>
                            <th className="p-4 font-semibold text-right">Дії</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {goods.map((good) => (
                            <tr key={good.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 text-sm text-gray-600">#{good.id}</td>
                                <td className="p-4 text-sm font-medium text-gray-900">
                                    {good.name}
                                    {good.isNew && (
                                        <span className="ml-2 bg-black text-white text-[10px] px-2 py-0.5 rounded-full">
                                            NEW
                                        </span>
                                    )}
                                </td>
                                <td className="p-4 text-sm text-gray-600">{good.category}</td>
                                <td className="p-4 text-sm font-medium">{good.price} ₴</td>
                                <td className="p-4 text-sm">
                                    <span
                                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                            good.stock_quantity > 10
                                                ? 'bg-green-100 text-green-800'
                                                : good.stock_quantity > 0
                                                  ? 'bg-yellow-100 text-yellow-800'
                                                  : 'bg-red-100 text-red-800'
                                        }`}>
                                        {good.stock_quantity > 0 ? `${good.stock_quantity} шт.` : 'Немає в наявності'}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-right">
                                    <button className="text-gray-400 hover:text-blue-600 p-1 transition-colors">
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        // onClick={() => handleDelete(good.id)}
                                        className="text-gray-400 hover:text-red-600 p-1 ml-2 transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
