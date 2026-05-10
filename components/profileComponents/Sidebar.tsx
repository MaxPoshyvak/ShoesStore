import React from 'react';
import { User, Package, Star, LogOut, Heart } from 'lucide-react';
import { UserProfileData } from './types';

interface SidebarProps {
    user: UserProfileData;
    activeTab: 'profile' | 'orders' | 'reviews' | 'favorites';
    setActiveTab: (tab: 'profile' | 'orders' | 'reviews' | 'favorites') => void;
    handleLogout: () => void;
}

export function Sidebar({ user, activeTab, setActiveTab, handleLogout }: SidebarProps) {
    const navItems = [
        { id: 'profile' as const, icon: User, label: 'Profile', badge: undefined },
        { id: 'orders' as const, icon: Package, label: 'Orders', badge: user.orders?.length },
        { id: 'reviews' as const, icon: Star, label: 'Reviews', badge: user.reviews?.length },
        { id: 'favorites' as const, icon: Heart, label: 'Favorites', badge: user.favorites?.length },
    ];

    return (
        <div className="w-full shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden md:sticky md:top-30">
                {/* User Summary — hidden on very small screens, shown on sm+ */}
                <div className="p-4 sm:p-6 border-b border-gray-50 flex items-center gap-3 sm:gap-4 bg-gray-50/50">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-base sm:text-lg shrink-0">
                        {user.username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="overflow-hidden min-w-0">
                        <h3 className="font-bold text-gray-900 truncate text-sm sm:text-base">{user.username}</h3>
                        <p className="text-xs text-gray-500 truncate hidden sm:block">{user.email}</p>
                    </div>
                </div>

                {/* Navigation — horizontal scroll on mobile, vertical on md+ */}
                <nav className="flex md:flex-col overflow-x-auto md:overflow-visible p-2 sm:p-3 gap-1 md:gap-0 md:space-y-1 no-scrollbar">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`flex items-center justify-center md:justify-start gap-2 md:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap shrink-0 md:shrink md:w-full ${
                                activeTab === item.id
                                    ? 'bg-black text-white shadow-md'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                            }`}>
                            <item.icon size={16} className="shrink-0" />
                            <span className="hidden sm:inline">{item.label}</span>
                            {item.badge !== undefined && item.badge > 0 && (
                                <span
                                    className={`text-[10px] px-1.5 py-0.5 rounded-full hidden sm:inline ${
                                        activeTab === item.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                                    }`}>
                                    {item.badge}
                                </span>
                            )}
                        </button>
                    ))}

                    {/* Divider — hidden on mobile horizontal layout */}
                    <div className="hidden md:block my-2 border-t border-gray-100" />

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center md:justify-start gap-2 md:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold rounded-xl text-red-500 hover:bg-red-50 transition-all whitespace-nowrap shrink-0 md:shrink md:w-full">
                        <LogOut size={16} className="shrink-0" />
                        <span className="hidden sm:inline">Log Out</span>
                    </button>
                </nav>
            </div>
        </div>
    );
}
