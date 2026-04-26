import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, Package, Database } from 'lucide-react';
import { updateGood, updateGoodStock } from '@/utils/backendData/backendGoods';
import type { Good } from '@/types/backendTypes';

interface EditGoodContentProps {
    good: Good;
    onClose: () => void;
    onSuccess: () => void;
}

export const EditGoodContent: React.FC<EditGoodContentProps> = ({ good, onClose, onSuccess }) => {
    const [activeTab, setActiveTab] = useState<'full' | 'stock'>('full');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: good?.name || '',
        price: good?.price || '',
        old_price: good?.old_price || '',
        category: good?.category || 'Man',
        stock_quantity: good?.stock_quantity || '',
        is_new: good?.is_new || false,
        description: good?.description || '',
        sizes: Array.isArray(good?.sizes) ? good.sizes.join(', ') : good?.sizes || '',
        main_image_url: good?.main_image_url || '',

        gallery_urls: Array.isArray(good?.gallery_urls) ? good.gallery_urls.join('\n') : good?.gallery_urls || '',
    });

    const [stockValue, setStockValue] = useState(good?.stock_quantity || 0);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData((prev) => ({ ...prev, [name]: val }));
    };

    const handleFullSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            await updateGood(good.id, formData);
            onSuccess();
            onClose();
        } catch (err: unknown) {
            setError((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStockSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            await updateGoodStock(good.id, Number(stockValue));
            onSuccess();
            onClose();
        } catch (err: unknown) {
            setError((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* --- ПЕРЕМИКАЧ ВКЛАДОК (TABS) --- */}
            <div className="flex bg-gray-100 p-1 rounded-xl">
                <button
                    onClick={() => setActiveTab('full')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                        activeTab === 'full' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    }`}>
                    <Database size={16} /> Full details
                </button>
                <button
                    onClick={() => setActiveTab('stock')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                        activeTab === 'stock' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    }`}>
                    <Package size={16} /> Stock only
                </button>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">
                    {error}
                </div>
            )}

            {/* --- ВМІСТ ВСТАВКИ: ПОВНА ФОРМА --- */}
            {/* --- ВМІСТ ВСТАВКИ: ПОВНА ФОРМА --- */}
            {activeTab === 'full' && (
                <form onSubmit={handleFullSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Product name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none text-sm"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Price (₴)</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none text-sm"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Old price (optional)
                            </label>
                            <input
                                type="number"
                                name="old_price"
                                value={formData.old_price}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none text-sm">
                                <option value="Man">Men (Man)</option>
                                <option value="Woman">Women (Woman)</option>
                                <option value="Boy">Boys (Boy)</option>
                                <option value="Child">Kids (Child)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Stock quantity
                            </label>
                            <input
                                type="number"
                                name="stock_quantity"
                                value={formData.stock_quantity}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none text-sm"
                                required
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Sizes</label>
                            <input
                                type="text"
                                name="sizes"
                                value={formData.sizes}
                                onChange={handleChange}
                                placeholder="40, 41, 42"
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none text-sm"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Product description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none text-sm resize-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Main image URL</label>
                        <div className="relative">
                            <UploadCloud className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type="url"
                                name="main_image_url"
                                value={formData.main_image_url}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none text-sm"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="flex justify-between items-center text-sm font-semibold text-gray-700 mb-1.5">
                            <span>Additional images (gallery)</span>
                            <span className="text-xs text-gray-400 font-normal">One URL per line</span>
                        </label>
                        <textarea
                            name="gallery_urls"
                            value={formData.gallery_urls}
                            onChange={handleChange}
                            rows={4}
                            placeholder="https://example.com/image.png"
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none text-sm resize-none"
                        />
                    </div>

                    <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                        <input
                            type="checkbox"
                            name="is_new"
                            checked={formData.is_new}
                            onChange={handleChange}
                            className="w-5 h-5 cursor-pointer accent-black"
                        />
                        <span className="text-sm font-semibold text-gray-900">Mark as new (NEW)</span>
                    </label>

                    <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-white border rounded-xl hover:bg-gray-50 disabled:opacity-50"
                            disabled={isLoading}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-5 py-2.5 text-sm font-semibold text-white bg-black rounded-xl hover:bg-gray-800 disabled:opacity-70">
                            {isLoading ? 'Saving...' : 'Update all details'}
                        </button>
                    </div>
                </form>
            )}

            {/* --- ВМІСТ ВСТАВКИ: ТІЛЬКИ ЗАЛИШОК --- */}
            {activeTab === 'stock' && (
                <form onSubmit={handleStockSubmit} className="space-y-6 py-4">
                    <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center justify-between">
                        <div>
                            <p className="text-sm text-blue-600 font-medium">Current stock:</p>
                            <p className="text-xl font-bold text-blue-900">{good.stock_quantity} pcs</p>
                        </div>
                        <Package size={32} className="text-blue-200" />
                    </div>

                    <div>
                        <label className="block text-lg font-semibold text-gray-700 mb-2 text-center">
                            New stock quantity
                        </label>
                        <input
                            type="number"
                            value={stockValue}
                            onChange={(e) => setStockValue(Number(e.target.value))}
                            className="w-full text-center text-3xl font-bold px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-black outline-none"
                            required
                            min="0"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-white border rounded-xl hover:bg-gray-50 disabled:opacity-50"
                            disabled={isLoading}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-5 py-2.5 text-sm font-semibold text-white bg-black rounded-xl hover:bg-gray-800 disabled:opacity-70 flex items-center gap-2">
                            <CheckCircle2 size={18} />
                            {isLoading ? 'Updating...' : 'Save stock'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};
