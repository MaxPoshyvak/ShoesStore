// components/popups/AddGoodContent.tsx
import React, { useState } from 'react';
import { UploadCloud, CheckCircle2 } from 'lucide-react';
import { addGood } from '@/utils/backendData/backendGoods';

interface AddGoodContentProps {
    onClose: () => void;
    onSuccess: () => void; // Функція, щоб оновити таблицю товарів після додавання
}

export const AddGoodContent: React.FC<AddGoodContentProps> = ({ onClose, onSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Стейт для всіх полів форми
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        old_price: '',
        category: 'Man',
        stock_quantity: '',
        is_new: false,
        description: '',
        sizes: '', // Зберігаємо як строку "40, 41, 42", а при відправці розіб'ємо в масив
        main_image_url: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData((prev) => ({ ...prev, [name]: val }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        // 1. UI-логіка: зупиняємо перезавантаження сторінки
        e.preventDefault();

        // 2. UI-логіка: керуємо станом кнопок і помилок
        setIsLoading(true);
        setError(null);

        try {
            // 3. Викликаємо нашу чисту API-функцію!
            // Передаємо туди formData (яка має відповідати інтерфейсу AddGoodData)
            await addGood(formData);

            // 4. UI-логіка: якщо все ок, оновлюємо таблицю і закриваємо попап
            onSuccess();
            onClose();
        } catch (err: unknown) {
            // Якщо API викинуло помилку — показуємо її
            setError((err as Error).message);
        } finally {
            // Знімаємо лоадер
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Вивід помилки, якщо щось пішло не так */}
            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">
                    {error}
                </div>
            )}

            {/* Основна інформація */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Назва товару</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Напр. Nike Air Max 270"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none text-sm"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Ціна (₴)</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="3999"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none text-sm"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Стара ціна (необов&apos;язково)
                    </label>
                    <input
                        type="number"
                        name="old_price"
                        value={formData.old_price}
                        onChange={handleChange}
                        placeholder="4999"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Категорія</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none text-sm appearance-none">
                        <option value="Man">Чоловікам (Man)</option>
                        <option value="Woman">Жінкам (Woman)</option>
                        <option value="Boy">Хлопчикам (Boy)</option>
                        <option value="Child">Дітям (Child)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Кількість на складі</label>
                    <input
                        type="number"
                        name="stock_quantity"
                        value={formData.stock_quantity}
                        onChange={handleChange}
                        placeholder="25"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none text-sm"
                        required
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Розміри (через кому)</label>
                <input
                    type="text"
                    name="sizes"
                    value={formData.sizes}
                    onChange={handleChange}
                    placeholder="Напр. 38, 39, 40, 41, 42"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none text-sm"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Опис товару</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Короткий опис кросівок..."
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none text-sm resize-none"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">URL головного фото</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UploadCloud className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="url"
                        name="main_image_url"
                        value={formData.main_image_url}
                        onChange={handleChange}
                        placeholder="https://example.com/image.png"
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none text-sm"
                        required
                    />
                </div>
            </div>

            {/* Чекбокс Новинка */}
            <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="relative flex items-center">
                    <input
                        type="checkbox"
                        name="is_new"
                        checked={formData.is_new}
                        onChange={handleChange}
                        className="peer w-5 h-5 cursor-pointer appearance-none border border-gray-300 rounded bg-white checked:bg-black checked:border-black transition-all"
                    />
                    <CheckCircle2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-gray-900">Відмітити як новинку (NEW)</p>
                    <p className="text-xs text-gray-500">Товар отримає чорний бейдж &quot;New&quot; на сайті</p>
                </div>
            </label>

            {/* Кнопки керування */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                    disabled={isLoading}>
                    Скасувати
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-black rounded-xl hover:bg-gray-800 transition-colors shadow-lg shadow-black/20 disabled:opacity-70 flex items-center gap-2">
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Збереження...
                        </>
                    ) : (
                        'Зберегти товар'
                    )}
                </button>
            </div>
        </form>
    );
};
