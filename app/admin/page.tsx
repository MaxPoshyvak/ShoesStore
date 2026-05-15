'use client';

import React, { useState } from 'react';
import {
    Users,
    Package,
    ShoppingCart,
    CreditCard,
    MessageSquare,
    Search,
    LayoutDashboard,
    Menu,
    X,
    LogOut,
    ChevronRight,
    Bell,
} from 'lucide-react';
import { DashboardPanel } from '@/components/adminComponents/DashboardPanel';
import { UsersPanel } from '@/components/adminComponents/UsersPanel';
import { GoodsPanel } from '@/components/adminComponents/GoodsPanel';
import { OrdersPanel } from '@/components/adminComponents/OrdersPanel';
import { PaymentsPanel } from '@/components/adminComponents/PaymentsPanel';
import { FeedbacksPanel } from '@/components/adminComponents/FeedbacksPanel';
import { SupportChatsPanel } from '@/components/adminComponents/SupportChatsPanel';
import Popup from '@/components/Popup/Popup';
import { AllActivitiesContent } from '@/components/Popup/PopupContent/AllActivitiesContent';
import { s } from 'framer-motion/client';

const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'goods', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'feedbacks', label: 'Feedbacks', icon: MessageSquare },
    { id: 'support', label: 'Support', icon: MessageSquare },
];

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const [isActivityPopupOpen, setIsActivityPopupOpen] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');

    const renderContent = (searchInp: string) => {
        switch (activeTab) {
            case 'dashboard':
                return <DashboardPanel setIsActivityPopupOpen={setIsActivityPopupOpen} />;
            case 'users':
                return <UsersPanel searchInp={searchInp} />;
            case 'goods':
                return <GoodsPanel searchInp={searchInp} />;
            case 'orders':
                return <OrdersPanel searchInp={searchInp} />;
            case 'payments':
                return <PaymentsPanel searchInp={searchInp} />;
            case 'feedbacks':
                return <FeedbacksPanel searchInp={searchInp} />;
            case 'support':
                return <SupportChatsPanel searchInp={searchInp} />;
            default:
                return <DashboardPanel setIsActivityPopupOpen={setIsActivityPopupOpen} />;
        }
    };

    const currentLabel = menuItems.find((i) => i.id === activeTab)?.label ?? 'Dashboard';

    return (
        <>
            {/* Mobile overlay */}
            <Popup isOpen={isActivityPopupOpen} onClose={() => setIsActivityPopupOpen(false)} title="All activities">
                <AllActivitiesContent />
            </Popup>
            {mobileSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
                    onClick={() => setMobileSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-[#0B0B0F] text-white transition-all duration-300 ease-in-out
                    ${sidebarOpen ? 'w-[260px]' : 'w-[72px]'}
                    lg:translate-x-0
                    ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}>
                {/* Logo */}
                <div
                    className={`flex items-center h-[68px] border-b border-white/[0.06] shrink-0 ${sidebarOpen ? 'px-6' : 'px-0 justify-center'}`}>
                    <button
                        onClick={() => {
                            setSidebarOpen(!sidebarOpen);
                            if (window.innerWidth < 1024) {
                                setMobileSidebarOpen(!mobileSidebarOpen);
                            }
                        }}
                        className="flex items-center gap-2.5 group">
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0">
                            <span className="text-black text-sm font-black">S</span>
                        </div>
                        {sidebarOpen && (
                            <span className="text-[17px] font-extrabold tracking-tight">
                                Slick<span className="text-white/40 font-medium">Admin</span>
                            </span>
                        )}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto scrollbar-thin">
                    {sidebarOpen && (
                        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/30">
                            Menu
                        </p>
                    )}
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setSearchQuery('');
                                    setActiveTab(item.id);
                                    setMobileSidebarOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 rounded-lg text-[13px] font-medium transition-all duration-150 group relative
                                    ${sidebarOpen ? 'px-3 py-2.5' : 'px-0 py-2.5 justify-center'}
                                    ${
                                        isActive
                                            ? 'bg-white/[0.1] text-white'
                                            : 'text-white/50 hover:text-white hover:bg-white/[0.06]'
                                    }
                                `}>
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-white rounded-r-full" />
                                )}
                                <Icon size={19} strokeWidth={isActive ? 2.2 : 1.8} className="shrink-0" />
                                {sidebarOpen && <span>{item.label}</span>}
                                {sidebarOpen && isActive && (
                                    <ChevronRight size={14} className="ml-auto text-white/30" />
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Bottom section */}
                <div className="p-3 border-t border-white/[0.06]">
                    {sidebarOpen ? (
                        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.06] transition-colors cursor-pointer group">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                A
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[13px] font-semibold text-white truncate">Admin</p>
                                <p className="text-[11px] text-white/40 truncate">admin@slick.com</p>
                            </div>
                            <LogOut size={16} className="text-white/30 group-hover:text-white/60 transition-colors" />
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer">
                                A
                            </div>
                        </div>
                    )}
                </div>
            </aside>

            {/* Main content area */}
            <div
                className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
                    sidebarOpen ? 'lg:ml-[260px]' : 'lg:ml-[72px]'
                }`}>
                {/* Header */}
                <header className="sticky top-0 z-30 h-[68px] bg-white/80 backdrop-blur-xl border-b border-gray-200/60 flex items-center justify-between px-4 lg:px-8 shrink-0">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <button
                            onClick={() => {
                                if (window.innerWidth < 1024) {
                                    setMobileSidebarOpen(!mobileSidebarOpen);
                                } else {
                                    setSidebarOpen(!sidebarOpen);
                                }
                            }}
                            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
                            {mobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>

                        {/* Breadcrumb */}
                        <div className={`${mobileSearchOpen ? 'hidden' : 'flex'} sm:flex items-center gap-1.5 text-sm`}>
                            <span className="text-gray-400">Admin</span>
                            <ChevronRight size={14} className="text-gray-300" />
                            <span className="font-semibold text-gray-900">{currentLabel}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Mobile search toggle */}
                        <button
                            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
                            {mobileSearchOpen ? <X size={19} /> : <Search size={19} />}
                        </button>

                        {/* Desktop search */}
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                type="text"
                                placeholder="Search anything…"
                                className="w-56 lg:w-72 pl-9 pr-4 py-2 bg-gray-50 border border-gray-200/80 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300 transition-all placeholder:text-gray-400"
                            />
                        </div>

                        {/* Notifications */}
                        <button
                            onClick={() => setIsActivityPopupOpen(true)}
                            className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
                            <Bell size={19} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
                        </button>
                    </div>
                </header>

                {/* Mobile search bar — expands below header */}
                {mobileSearchOpen && (
                    <div className="md:hidden px-4 py-3 border-b border-gray-200/60 bg-white">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                type="text"
                                placeholder="Search anything…"
                                autoFocus
                                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200/80 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300 transition-all placeholder:text-gray-400"
                            />
                        </div>
                    </div>
                )}

                {/* Page content */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden">
                    <div className="p-4 lg:p-8 max-w-[1400px] mx-auto">{renderContent(searchQuery)}</div>
                </main>
            </div>
        </>
    );
}
