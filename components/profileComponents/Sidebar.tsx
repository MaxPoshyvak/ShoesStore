import React from 'react';
import { User, Package, Star, LogOut, Heart } from 'lucide-react';
import { UserProfileData } from './types';

interface SidebarProps {
    user: UserProfileData;
    activeTab: 'profile' | 'orders' | 'reviews' | 'favorites';
    setActiveTab: (tab: 'profile' | 'orders' | 'reviews') => void;
    handleLogout: () => void;
}

export function Sidebar({ user, activeTab, setActiveTab, handleLogout }: SidebarProps) {
    return (
        <div className="w-full md:w-72 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-30">
                {/* User Summary */}
                <div className="p-6 border-b border-gray-50 flex items-center gap-4 bg-gray-50/50">
                    <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg">
                        {user.username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                        <h3 className="font-bold text-gray-900 truncate">{user.username}</h3>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="p-3 space-y-1">
                    {[
                        { id: 'profile', icon: User, label: 'Personal Information' },
                        { id: 'orders', icon: Package, label: 'My Orders', badge: user.orders?.length },
                        { id: 'reviews', icon: Star, label: 'My Reviews', badge: user.reviews?.length },
                        { id: 'favorites', icon: Heart, label: 'My Favorites', badge: user.favorites?.length },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as 'profile' | 'orders' | 'reviews')}
                            className={`w-full flex items-center justify-between px-4 py-3 text-sm font-bold rounded-xl transition-all ${
                                activeTab === item.id
                                    ? 'bg-black text-white shadow-md'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                            }`}>
                            <div className="flex items-center gap-3">
                                <item.icon size={18} />
                                {item.label}
                            </div>
                            {item.badge !== undefined && item.badge > 0 && (
                                <span
                                    className={`text-[10px] px-2 py-0.5 rounded-full ${
                                        activeTab === item.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                                    }`}>
                                    {item.badge}
                                </span>
                            )}
                        </button>
                    ))}

                    <div className="my-2 border-t border-gray-100"></div>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl text-red-500 hover:bg-red-50 transition-all">
                        <LogOut size={18} /> Log Out
                    </button>
                </nav>
            </div>
        </div>
    );
}
