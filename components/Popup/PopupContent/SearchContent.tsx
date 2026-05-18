'use client';

import { useState, useEffect } from 'react';
import { Search, Loader2, Package, ArrowRight, LucideIcon, ShieldCheck, House, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface SearchProduct {
    id: string;
    name: string;
    price: number;
    main_image_url: string;
    category: string;
}

interface SearchRoute {
    id: string;
    route: string;
    price: number;
    iconRoute: LucideIcon;
    desc: string;
}

interface SearchContentProps {
    onClose: () => void;
}

export const SearchContent = ({ onClose }: SearchContentProps) => {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [resultsProduct, setResultsProduct] = useState<SearchProduct[]>([]);
    const [resultsRoute, setResultsRoute] = useState<SearchRoute[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const routes: SearchRoute[] = [
        { id: '0', route: '/', price: 0, iconRoute: House, desc: 'Home' },
        { id: '1', route: '/shop', price: 0, iconRoute: Package, desc: 'Shop' },
        { id: '2', route: '/profile', price: 0, iconRoute: User, desc: 'Profile' },
        { id: '3', route: '/admin', price: 0, iconRoute: ShieldCheck, desc: 'Admin' },
    ];
    // Магія Debounce та пошуку
    useEffect(() => {
        // Якщо поле пусте, очищаємо результати
        if (!searchTerm.trim()) {
            setResultsProduct([]);
            setResultsRoute([]);
            setHasSearched(false);
            return;
        }

        // Шукаємо роути локально (одразу)
        const delayRouteFn = setTimeout(() => {
            const filteredRoutes = routes.filter((route) =>
                route.desc.toLowerCase().includes(searchTerm.toLowerCase()),
            );
            setResultsRoute(filteredRoutes);
        }, 400);

        // Встановлюємо таймер на 400мс для запиту на бекенд
        const delayDebounceFn = setTimeout(async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/goods/search/${searchTerm}`, {
                    method: 'GET',
                });

                if (response.ok) {
                    const data = await response.json();
                    setResultsProduct(data || []);
                }
            } catch (error) {
                console.error('Search error:', error);
                setResultsProduct([]);
            } finally {
                setIsLoading(false);
                setHasSearched(true);
            }
        }, 400);

        return () => {
            clearTimeout(delayDebounceFn);
            clearTimeout(delayRouteFn);
        };
    }, [searchTerm]);

    // Обробник для товарів
    const handleProductClick = (productId: string) => {
        onClose();
        router.push(`/product/${productId}`);
    };

    // Обробник для роутів
    const handleRouteClick = (path: string) => {
        onClose();
        router.push(path);
    };

    return (
        <div className="flex flex-col h-full max-h-[70vh]">
            {/* Поле вводу */}
            <div className="relative shrink-0 mb-4">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    autoFocus
                    placeholder="Search for shoes, brands, categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-none rounded-xl text-[15px] font-medium text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-black/10 focus:bg-white transition-all outline-none"
                />
            </div>

            {/* Зона результатів */}
            <div className="flex-1 overflow-y-auto custom-scrollbar -mx-2 px-2 pb-2">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="w-7 h-7 animate-spin text-black/50 mb-3" />
                        <p className="text-sm text-gray-500">Searching...</p>
                    </div>
                ) : resultsProduct.length > 0 || resultsRoute.length > 0 ? (
                    <div className="space-y-5">
                        {/* Секція: Pages (Роути) */}
                        {resultsRoute.length > 0 && (
                            <div className="space-y-1.5">
                                <p className="text-xs font-semibold text-gray-400 px-2 uppercase tracking-wider mb-2">
                                    Pages
                                </p>
                                {resultsRoute.map((routeItem) => {
                                    const Icon = routeItem.iconRoute;
                                    return (
                                        <div
                                            key={routeItem.id}
                                            onClick={() => handleRouteClick(routeItem.route)}
                                            className="flex items-center gap-4 p-2.5 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors group">
                                            {/* Іконка роута */}
                                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                                                <Icon className="w-5 h-5 text-gray-500" />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-[14px] font-semibold text-gray-900 truncate">
                                                    {routeItem.desc}
                                                </h4>
                                                <p className="text-[12px] text-gray-500 truncate">Go to page</p>
                                            </div>

                                            <ArrowRight className="w-4 h-4 text-gray-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Секція: Products (Товари) */}
                        {resultsProduct.length > 0 && (
                            <div className="space-y-1.5">
                                <p className="text-xs font-semibold text-gray-400 px-2 uppercase tracking-wider mb-2">
                                    Products
                                </p>
                                {resultsProduct.map((product) => (
                                    <div
                                        key={product.id}
                                        onClick={() => handleProductClick(product.id)}
                                        className="flex items-center gap-4 p-2.5 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors group">
                                        {/* Картинка */}
                                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0 flex items-center justify-center relative">
                                            {product.main_image_url ? (
                                                <Image
                                                    fill
                                                    sizes="48px"
                                                    src={product.main_image_url}
                                                    alt={product.name}
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <Package className="w-6 h-6 text-gray-400" />
                                            )}
                                        </div>

                                        {/* Інформація */}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-[14px] font-semibold text-gray-900 truncate">
                                                {product.name}
                                            </h4>
                                            <p className="text-[13px] text-gray-500 truncate">{product.category}</p>
                                        </div>

                                        {/* Ціна та стрілка */}
                                        <div className="flex items-center gap-3 pr-2">
                                            <span className="text-[14px] font-bold text-gray-900">
                                                ₴{product.price}
                                            </span>
                                            <ArrowRight className="w-4 h-4 text-gray-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : hasSearched && searchTerm ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                            <Search className="w-5 h-5 text-gray-400" />
                        </div>
                        <p className="text-[15px] font-bold text-gray-900">No results found</p>
                        <p className="text-[13px] text-gray-500 mt-1">
                            We couldn&apos;t find anything matching &quot;{searchTerm}&quot;
                        </p>
                    </div>
                ) : (
                    // Початковий стан (до пошуку)
                    <div className="py-8 text-center">
                        <p className="text-[13px] text-gray-400">Start typing to search products or pages...</p>
                    </div>
                )}
            </div>
        </div>
    );
};
