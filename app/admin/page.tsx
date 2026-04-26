'use client';

import React, { useState } from 'react';
import { Users, Package, ShoppingCart, CreditCard, MessageSquare, Search, LayoutDashboard } from 'lucide-react';
import { DashboardPanel } from '@/components/adminComponents/DashboardPanel';
import { UsersPanel } from '@/components/adminComponents/UsersPanel';
import { GoodsPanel } from '@/components/adminComponents/GoodsPanel';
import { OrdersPanel } from '@/components/adminComponents/OrdersPanel';
import { PaymentsPanel } from '@/components/adminComponents/PaymentsPanel';
import { FeedbacksPanel } from '@/components/adminComponents/FeedbacksPanel';
import { SupportChatsPanel } from '@/components/adminComponents/SupportChatsPanel';

export default function App() {
    const [activeTab, setActiveTab] = useState('dashboard');

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'users', label: 'Users', icon: Users },
        { id: 'goods', label: 'Goods', icon: Package },
        { id: 'orders', label: 'Orders', icon: ShoppingCart },
        { id: 'payments', label: 'Payments', icon: CreditCard },
        { id: 'feedbacks', label: 'Feedbacks', icon: MessageSquare },
        { id: 'support', label: 'Support', icon: MessageSquare },
    ];

    // Функція-роутер: малює потрібний компонент залежно від вибраного меню
    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <DashboardPanel />;
            case 'users':
                return <UsersPanel />;
            case 'goods':
                return <GoodsPanel />;
            case 'orders':
                return <OrdersPanel />;
            case 'payments':
                return <PaymentsPanel />;
            case 'feedbacks':
                return <FeedbacksPanel />;
            case 'support':
                return <SupportChatsPanel />;
            default:
                return <GoodsPanel />;
        }
    };

    return (
        <div className="flex h-screen bg-[#F8F9FA] font-sans">
            {/* ЛІВИЙ САЙДБАР */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
                {/* Логотип */}
                <div className="h-20 flex items-center px-8 border-b border-gray-100">
                    <h1 className="text-2xl font-extrabold tracking-tight text-black">
                        Slick<span className="text-gray-400 font-normal ml-1">Admin</span>
                    </h1>
                </div>

                {/* Навігація */}
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                                    isActive
                                        ? 'bg-black text-white shadow-md shadow-black/10'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-black'
                                }`}>
                                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                {/* Профіль адміна внизу */}
                <div className="p-4 border-t border-gray-100 m-4 rounded-xl bg-gray-50 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-bold">
                        A
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-bold text-gray-900 truncate">Admin</p>
                        <p className="text-xs text-gray-500 truncate">admin@slick.com</p>
                    </div>
                </div>
            </aside>

            {/* ГОЛОВНА РОБОЧА ОБЛАСТЬ */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Верхній хедер (Header) */}
                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
                    <h2 className="text-xl font-bold text-gray-800 capitalize">
                        {menuItems.find((i) => i.id === activeTab)?.label} Dashboard
                    </h2>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Quick search..."
                            className="pl-10 pr-4 py-2 bg-gray-100 border-transparent rounded-lg focus:bg-white focus:border-black focus:ring-2 focus:ring-black/5 outline-none transition-all text-sm w-64"
                        />
                    </div>
                </header>

                {/* Контент сторінки */}
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-6xl mx-auto">{renderContent()}</div>
                </div>
            </main>
        </div>
    );
}
