import React, { useEffect, useState, useMemo } from 'react';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import { getGoods, deleteGood } from '@/utils/backendData/backendGoods';

import Popup from '@/components/Popup/Popup';
import { AddGoodContent } from '@/components/Popup/PopupContent/AddGoodContent';
import { EditGoodContent } from '@/components/Popup/PopupContent/EditGoodContent';
import type { Good } from '@/types/backendTypes';
import { TableSkeleton } from '@/components/adminComponents/TableSkeleton';

export const GoodsPanel = ({ searchInp }: { searchInp: string }) => {
    const [goods, setGoods] = useState<Good[]>([]);
    const [addGoodPopupOpen, setAddGoodPopupOpen] = useState(false);
    const [editingGood, setEditingGood] = useState<Good | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchGoods = async () => {
        setIsLoading(true);
        try {
            const data = await getGoods();
            setGoods(data);
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            try {
                const data = await getGoods();
                setGoods(data);
            } catch (error) {
                console.error('Error loading products:', error);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    const filteredGoods = useMemo(() => {
        if (!searchInp) return goods; // Якщо пошук пустий — повертаємо всіх

        const query = searchInp.toLowerCase() as string;
        return goods.filter(
            (goods) =>
                (goods.name?.toLowerCase() || '').includes(query) ||
                (goods.category?.toLowerCase() || '').includes(query) ||
                (goods.price?.toString() || '').includes(query),
        );
    }, [goods, searchInp]);

    const handleDelete = (id: number) => {
        if (window.confirm('Delete this product? This action cannot be undone.')) {
            deleteGood(id);
            setGoods(goods.filter((g) => g.id !== id));
        }
    };

    const stockBadge = (qty: number) => {
        const config =
            qty > 10
                ? { bg: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500', label: `${qty} pcs` }
                : qty > 0
                  ? { bg: 'bg-amber-50 text-amber-700', dot: 'bg-amber-500', label: `${qty} pcs` }
                  : { bg: 'bg-red-50 text-red-700', dot: 'bg-red-500', label: 'Out of stock' };
        return (
            <span
                className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold ${config.bg}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                {config.label}
            </span>
        );
    };

    return (
        <div className="space-y-4 sm:space-y-6">
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
                        onSuccess={() => fetchGoods()}
                    />
                )}
            </Popup>

            <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 bg-gray-900 rounded-lg flex items-center justify-center shrink-0">
                            <Package size={18} className="text-white" />
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-[15px] font-bold text-gray-900">Products</h2>
                            <p className="text-[12px] text-gray-400 mt-0.5">
                                {filteredGoods.length} product{filteredGoods.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>
                    <button
                        className="inline-flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-3 sm:px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all shrink-0"
                        onClick={() => setAddGoodPopupOpen(true)}>
                        <Plus size={16} />
                        <span className="hidden sm:inline">Add product</span>
                    </button>
                </div>

                {/* Mobile card list */}
                <div className="sm:hidden">
                    {isLoading ? (
                        <div className="p-8 text-center">
                            <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto" />
                        </div>
                    ) : filteredGoods.length === 0 ? (
                        <div className="flex flex-col items-center gap-2 py-12">
                            <Package size={32} className="text-gray-300" />
                            <p className="text-sm text-gray-400 font-medium">No products yet</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {filteredGoods.map((good: Good) => (
                                <div key={good.id} className="px-4 py-3">
                                    {/* Row 1: name + badge */}
                                    <div className="flex items-start gap-2 mb-1">
                                        <span className="text-[13px] font-semibold text-gray-900 break-words min-w-0 flex-1">
                                            {good.name}
                                        </span>
                                        {good.is_new && (
                                            <span className="bg-gray-900 text-white text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider shrink-0 mt-0.5">
                                                New
                                            </span>
                                        )}
                                    </div>

                                    {/* Row 2: meta */}
                                    <p className="text-[11px] text-gray-400 mb-2">
                                        #{good.id} · {good.category}
                                    </p>

                                    {/* Row 3: price + stock + actions — wraps on small screens */}
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                                        <span className="text-[13px] font-bold text-gray-900">{good.price} ₴</span>
                                        {stockBadge(good.stock_quantity)}
                                        <div className="flex items-center gap-1 ml-auto">
                                            <button
                                                onClick={() => setEditingGood(good)}
                                                className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                                                <Edit size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(good.id)}
                                                className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Desktop table */}
                <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-left min-w-[700px]">
                        <thead>
                            <tr className="bg-gray-50/80 text-gray-400 text-[11px] uppercase tracking-wider border-b border-gray-100">
                                <th className="px-6 py-3.5 font-semibold">ID</th>
                                <th className="px-6 py-3.5 font-semibold">Product</th>
                                <th className="px-6 py-3.5 font-semibold">Category</th>
                                <th className="px-6 py-3.5 font-semibold">Price</th>
                                <th className="px-6 py-3.5 font-semibold">Stock</th>
                                <th className="px-6 py-3.5 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <TableSkeleton columns={6} rows={8} />
                            ) : filteredGoods.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <Package size={32} className="text-gray-300" />
                                            <p className="text-sm text-gray-400 font-medium">No products yet</p>
                                            <p className="text-xs text-gray-300">
                                                Add your first product to get started
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredGoods.map((good: Good) => (
                                    <tr key={good.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4 text-[13px] text-gray-400 font-mono">#{good.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[13px] font-semibold text-gray-900">
                                                    {good.name}
                                                </span>
                                                {good.is_new && (
                                                    <span className="bg-gray-900 text-white text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                                                        New
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-[13px] text-gray-500">{good.category}</td>
                                        <td className="px-6 py-4 text-[13px] font-semibold text-gray-900">
                                            {good.price} ₴
                                        </td>
                                        <td className="px-6 py-4">{stockBadge(good.stock_quantity)}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                                    onClick={() => setEditingGood(good)}
                                                    title="Edit">
                                                    <Edit size={15} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(good.id)}
                                                    className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                                    title="Delete">
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
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
