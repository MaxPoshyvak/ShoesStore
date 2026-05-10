import React from 'react';
import { Heart } from 'lucide-react';
import BestSellingCard from '@/components/BestSellingCard/BestSellingCard';
import { Reveal } from '@/components/ScrollAnimated/Reveal';

interface FavoriteItem {
    id: string | number;
    goodId: string | number;
    goodImage?: string;
    goodName?: string;
    goodPrice?: string | number;
    oldPrice?: string | number;
    stock_quantity?: number;
    is_new?: boolean;
    sizes?: string[];
    [key: string]: unknown;
}

interface FavoritesTabProps {
    favorites: FavoriteItem[];
}

export const FavoritesTab = ({ favorites }: FavoritesTabProps) => {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-4 sm:mb-6">My Favorites</h2>

            {!favorites || favorites.length === 0 ? (
                <div className="text-center py-12 sm:py-16 text-gray-400 flex flex-col items-center justify-center">
                    <Heart size={48} className="text-gray-200 mb-4 stroke-1" />
                    <p className="text-base sm:text-lg">You have not saved any items yet.</p>
                    <p className="text-sm mt-2 text-gray-300 max-w-xs">
                        Browse our shop and click the heart icon to save items here.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {favorites.map((product) => (
                        <div key={product.id} className="h-full">
                            <Reveal effect="fade-up">
                                <BestSellingCard
                                    id={Number(product.goodId)}
                                    image={product.goodImage ?? '/shoe-black.png'}
                                    name={product.goodName ?? 'Unknown product'}
                                    price={product.goodPrice ?? 0}
                                    oldPrice={product.oldPrice}
                                    stockQuantity={product.stock_quantity ?? 0}
                                    isNew={product.is_new}
                                    showHeart={true}
                                    sizes={product.sizes}
                                    initialIsFavorite={true}
                                />
                            </Reveal>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
