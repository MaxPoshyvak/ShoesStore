import React, { useState } from 'react';
import { UploadCloud, CheckCircle2 } from 'lucide-react';
import { addGood } from '@/utils/backendData/backendGoods';

interface AddGoodContentProps {
    onClose: () => void;
    onSuccess: () => void;
}

export const AddGoodContent: React.FC<AddGoodContentProps> = ({ onClose, onSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        old_price: '',
        category: 'Man',
        stock_quantity: '',
        is_new: false,
        description: '',
        sizes: '',
        main_image_url: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData((prev) => ({ ...prev, [name]: val }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await addGood(formData);
            onSuccess();
            onClose();
        } catch (err: unknown) {
            setError((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    const inputClass =
        'w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-gray-300 outline-none text-[13px] transition-all placeholder:text-gray-400';

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-[13px] font-medium border border-red-100">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className="block text-[12px] font-semibold text-gray-600 mb-1.5">Product name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Nike Air Max 270"
                        className={inputClass}
                        required
                    />
                </div>

                <div>
                    <label className="block text-[12px] font-semibold text-gray-600 mb-1.5">Price (₴)</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="3999"
                        className={inputClass}
                        required
                    />
                </div>

                <div>
                    <label className="block text-[12px] font-semibold text-gray-600 mb-1.5">Old price (optional)</label>
                    <input
                        type="number"
                        name="old_price"
                        value={formData.old_price}
                        onChange={handleChange}
                        placeholder="4999"
                        className={inputClass}
                    />
                </div>

                <div>
                    <label className="block text-[12px] font-semibold text-gray-600 mb-1.5">Category</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className={`${inputClass} appearance-none`}>
                        <option value="Man">Men (Man)</option>
                        <option value="Woman">Women (Woman)</option>
                        <option value="Boy">Boys (Boy)</option>
                        <option value="Child">Kids (Child)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-[12px] font-semibold text-gray-600 mb-1.5">Stock quantity</label>
                    <input
                        type="number"
                        name="stock_quantity"
                        value={formData.stock_quantity}
                        onChange={handleChange}
                        placeholder="25"
                        className={inputClass}
                        required
                    />
                </div>
            </div>

            <div>
                <label className="block text-[12px] font-semibold text-gray-600 mb-1.5">Sizes (comma-separated)</label>
                <input
                    type="text"
                    name="sizes"
                    value={formData.sizes}
                    onChange={handleChange}
                    placeholder="e.g. 38, 39, 40, 41, 42"
                    className={inputClass}
                    required
                />
            </div>

            <div>
                <label className="block text-[12px] font-semibold text-gray-600 mb-1.5">Product description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Short product description…"
                    className={`${inputClass} resize-none`}
                    required
                />
            </div>

            <div>
                <label className="block text-[12px] font-semibold text-gray-600 mb-1.5">Main image URL</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <UploadCloud className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="url"
                        name="main_image_url"
                        value={formData.main_image_url}
                        onChange={handleChange}
                        placeholder="https://example.com/image.png"
                        className={`${inputClass} pl-10`}
                        required
                    />
                </div>
            </div>

            <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="relative flex items-center">
                    <input
                        type="checkbox"
                        name="is_new"
                        checked={formData.is_new}
                        onChange={handleChange}
                        className="peer w-5 h-5 cursor-pointer appearance-none border border-gray-300 rounded bg-white checked:bg-gray-900 checked:border-gray-900 transition-all"
                    />
                    <CheckCircle2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                </div>
                <div>
                    <p className="text-[13px] font-semibold text-gray-900">Mark as new</p>
                    <p className="text-[11px] text-gray-400">Shows a New badge on the product card</p>
                </div>
            </label>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 text-[13px] font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                    disabled={isLoading}>
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-5 py-2.5 text-[13px] font-semibold text-white bg-gray-900 rounded-xl hover:bg-black transition-colors disabled:opacity-60 inline-flex items-center gap-2">
                    {isLoading ? (
                        <>
                            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                            Saving…
                        </>
                    ) : (
                        'Save product'
                    )}
                </button>
            </div>
        </form>
    );
};
