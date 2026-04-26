import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { getGoods, deleteGood } from '@/utils/backendData/backendGoods';

import Popup from '@/components/Popup/Popup';
import { AddGoodContent } from '@/components/Popup/PopupContent/AddGoodContent';
import { EditGoodContent } from '@/components/Popup/PopupContent/EditGoodContent';
import type { Good } from '@/types/backendTypes';

export const GoodsPanel = () => {
    const [goods, setGoods] = useState<Good[]>([]);

    const [addGoodPopupOpen, setAddGoodPopupOpen] = useState(false);

    const [editingGood, setEditingGood] = useState<Good | null>(null);

    const fetchGoods = () => {
        getGoods()
            .then((data) => setGoods(data))
            .catch((error) => console.error('Error loading products:', error));
    };

    useEffect(() => {
        fetchGoods();
    }, []);

    const handleDelete = (id: number) => {
        if (window.confirm('Delete this good?')) {
            deleteGood(id);
            setGoods(goods.filter((g) => g.id !== id));
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <Popup isOpen={addGoodPopupOpen} onClose={() => setAddGoodPopupOpen(false)} title="Add a new product">
                <AddGoodContent onClose={() => setAddGoodPopupOpen(false)} onSuccess={() => fetchGoods()} />
            </Popup>
            <Popup
                isOpen={!!editingGood}
                onClose={() => setEditingGood(null)}
                title={`Edit: ${editingGood?.name}`}
                maxWidth="md">
                {editingGood && (
                    <EditGoodContent
                        good={editingGood}
                        onClose={() => setEditingGood(null)}
                        onSuccess={() => {
                            fetchGoods();
                        }}
                    />
                )}
            </Popup>
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
                <h2 className="text-xl font-bold text-gray-900">Products</h2>
                <button
                    className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    onClick={() => setAddGoodPopupOpen(true)}>
                    <Plus size={16} /> Add product
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                            <th className="p-4 font-semibold">ID</th>
                            <th className="p-4 font-semibold">Name</th>
                            <th className="p-4 font-semibold">Category</th>
                            <th className="p-4 font-semibold">Price</th>
                            <th className="p-4 font-semibold">Stock</th>
                            <th className="p-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {goods.map((good) => (
                            <tr key={good.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 text-sm text-gray-600">#{good.id}</td>
                                <td className="p-4 text-sm font-medium text-gray-900">
                                    {good.name}
                                    {good.is_new && (
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
                                        {good.stock_quantity > 0 ? `${good.stock_quantity} pcs` : 'Out of stock'}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-right">
                                    <button
                                        className="text-gray-400 hover:text-blue-600 p-1 transition-colors"
                                        onClick={() => setEditingGood(good)}>
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(good.id)}
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
