import React from 'react';
import { Heart } from 'lucide-react';
import BestSellingCard from '@/components/BestSellingCard/BestSellingCard'; // Перевір правильність шляху

interface FavoritesTabProps {
    favorites: any[]; // Заміни any на твій тип товару (наприклад, Good), якщо він експортується
}

export const FavoritesTab = ({ favorites }: FavoritesTabProps) => {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-black text-gray-900 mb-6">My Favorites</h2>

            {!favorites || favorites.length === 0 ? (
                <div className="text-center py-16 text-gray-400 flex flex-col items-center justify-center">
                    <Heart size={48} className="text-gray-200 mb-4 stroke-1" />
                    <p>You haven&apos;t saved any items yet.</p>
                    <p className="text-sm mt-2">Browse our shop and click the heart icon to save items here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((product) => (
                        <div key={product.id} className="h-full">
                            <BestSellingCard
                                id={Number(product.goodId)}
                                image={product.goodImage} // Залежить від того, як бекенд повертає дані
                                name={product.goodName}
                                price={product.goodPrice}
                                oldPrice={product.oldPrice}
                                stockQuantity={product.stock_quantity}
                                isNew={product.is_new}
                                showHeart={true}
                                sizes={product.sizes}
                                initialIsFavorite={true} // Оскільки це вкладка улюблених, серце за замовчуванням зафарбоване
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
