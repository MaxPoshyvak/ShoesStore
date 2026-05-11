'use client';

import { useEffect, useState } from 'react';
import { DollarSign, ShoppingCart, Users, ArrowUpRight, ArrowDownRight, Eye, Loader2 } from 'lucide-react';

interface ActivityItem {
    _id: string;
    category: 'Order' | 'Register' | 'OutOfStock' | 'Feedback';
    action: string;
    createdAt: string;
}

interface WeeklyData {
    day: string;
    count: number;
}

interface DashboardStats {
    totalRevenue: number;
    activeOrders: number;
    newCustomers: number;
    previousCustomers: number;
    customersTrend: number;
    recentActivity: ActivityItem[];
    weeklyOverview: WeeklyData[];
    totalWeeklyOrders: number;
    pageViews: {
        currentViews: number;
        trend: number;
    };
}

// Допоміжна функція для вирахування "часу назад"
const timeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return `Yesterday`;
    return `${diffDays} days ago`;
};

// Вибір кольору крапки залежно від категорії
const getDotColor = (category: string) => {
    switch (category) {
        case 'Order':
            return 'bg-emerald-500';
        case 'Register':
            return 'bg-blue-500';
        case 'OutOfStock':
            return 'bg-amber-500';
        case 'Feedback':
            return 'bg-violet-500';
        default:
            return 'bg-gray-500';
    }
};

export const DashboardPanel = () => {
    const [statsData, setStatsData] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');
                // Звертаємось до нашого нового роуту
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/statistic/get`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.ok) {
                    const data = await response.json();
                    setStatsData(data);
                }
            } catch (error) {
                console.error('Failed to load dashboard stats:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Формуємо масив карток на основі отриманих даних
    const stats = [
        {
            label: 'Total Revenue',
            value: statsData ? `${statsData.totalRevenue.toLocaleString('uk-UA')} ₴` : '0 ₴',
            change: 'Last month',
            trend: 'up' as const,
            icon: DollarSign,
            iconBg: 'bg-emerald-50',
            iconColor: 'text-emerald-600',
            accentColor: 'border-l-emerald-500',
        },
        {
            label: 'Active Orders',
            value: statsData ? statsData.activeOrders.toString() : '0',
            change: 'Pending',
            trend: 'up' as const,
            icon: ShoppingCart,
            iconBg: 'bg-blue-50',
            iconColor: 'text-blue-600',
            accentColor: 'border-l-blue-500',
        },
        {
            label: 'New Customers',
            value: statsData ? statsData.newCustomers.toString() : '0',
            // 🔥 Використовуємо наш тренд з бекенду
            change: statsData
                ? `${statsData.customersTrend > 0 ? '+' : ''}${statsData.customersTrend} vs last week`
                : '0 vs last week',
            trend: statsData && statsData.customersTrend < 0 ? ('down' as const) : ('up' as const),
            icon: Users,
            iconBg: 'bg-violet-50',
            iconColor: 'text-violet-600',
            accentColor: 'border-l-violet-500',
        },
        {
            label: 'Page Views',
            value: statsData ? statsData.pageViews.currentViews : 0, // Статичне значення, бо ми його ще не збираємо на бекенді
            change: statsData
                ? `${statsData.pageViews.trend > 0 ? '+' : ''}${statsData.pageViews.trend} vs last week`
                : '0 vs last week',
            trend: 'up' as const,
            icon: Eye,
            iconBg: 'bg-amber-50',
            iconColor: 'text-amber-600',
            accentColor: 'border-l-amber-500',
        },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.label}
                            className={`bg-white rounded-xl border border-gray-200/80 p-5 border-l-4 ${stat.accentColor} hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-200 group`}>
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-10 h-10 ${stat.iconBg} rounded-xl flex items-center justify-center`}>
                                    <Icon size={20} className={stat.iconColor} />
                                </div>
                                <div
                                    className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                                        stat.trend === 'up'
                                            ? 'bg-emerald-50 text-emerald-700'
                                            : 'bg-rose-50 text-rose-700'
                                    }`}>
                                    {stat.trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                    {stat.change}
                                </div>
                            </div>
                            <p className="text-[13px] font-medium text-gray-500 mb-1">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-900 tracking-tight">{stat.value}</p>
                        </div>
                    );
                })}
            </div>

            {/* Activity + Quick actions row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent activity */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200/80 p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-[15px] font-bold text-gray-900">Recent Activity</h3>
                        <button className="text-xs font-semibold text-gray-400 hover:text-gray-700 transition-colors">
                            View all →
                        </button>
                    </div>

                    {statsData?.recentActivity && statsData.recentActivity.length > 0 ? (
                        <div className="space-y-0">
                            {statsData.recentActivity.map((item, i) => (
                                <div key={item._id} className="flex items-start gap-3.5 py-3 group">
                                    <div className="relative mt-1.5">
                                        <div className={`w-2 h-2 rounded-full ${getDotColor(item.category)}`} />
                                        {i < statsData.recentActivity.length - 1 && (
                                            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-px h-6 bg-gray-100" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        {/* Виводимо текст активності, збережений у MongoDB */}
                                        <p className="text-[13px] text-gray-600 leading-relaxed font-medium">
                                            {item.action}
                                        </p>
                                    </div>
                                    <span className="text-[11px] text-gray-400 font-medium whitespace-nowrap mt-0.5">
                                        {timeAgo(item.createdAt)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400 py-4 text-center">No recent activity found.</p>
                    )}
                </div>

                {/* Quick stats / chart placeholder */}
                <div className="bg-white rounded-xl border border-gray-200/80 p-6 flex flex-col">
                    <h3 className="text-[15px] font-bold text-gray-900 mb-5">Weekly Overview</h3>

                    <div className="space-y-4 flex-1">
                        {statsData?.weeklyOverview
                            ? (() => {
                                  // Знаходимо максимальне значення за тиждень, щоб вирахувати 100% ширини
                                  const maxCount = Math.max(...statsData.weeklyOverview.map((d) => d.count)) || 1;

                                  return statsData.weeklyOverview.map((dayData) => {
                                      // Вираховуємо відсоток заповнення смужки
                                      const fillPercentage = Math.round((dayData.count / maxCount) * 100);

                                      // Динамічний колір як на дизайні:
                                      // Високі показники (>60%) — чорні, середні — темно-сірі, низькі — світло-сірі
                                      let barColor = 'bg-gray-300';
                                      if (fillPercentage > 60) barColor = 'bg-gray-900';
                                      else if (fillPercentage > 30) barColor = 'bg-gray-400';

                                      return (
                                          <div key={dayData.day} className="flex items-center gap-3 group">
                                              <span className="text-[11px] font-medium text-gray-400 w-8">
                                                  {dayData.day}
                                              </span>

                                              <div className="flex-1 h-6 bg-gray-50 rounded-md overflow-hidden relative">
                                                  {/* Анімована смужка заповнення */}
                                                  <div
                                                      className={`h-full ${barColor} rounded-md transition-all duration-1000 ease-out`}
                                                      style={{ width: `${fillPercentage}%` }}
                                                  />
                                              </div>

                                              {/* Виводимо кількість (або можна додати значок %, якщо на дизайні саме відсотки від цілі) */}
                                              <span className="text-[11px] font-semibold text-gray-500 w-8 text-right">
                                                  {dayData.count}
                                              </span>
                                          </div>
                                      );
                                  });
                              })()
                            : // Скелетон, поки дані завантажуються
                              Array.from({ length: 7 }).map((_, i) => (
                                  <div key={i} className="flex items-center gap-3 animate-pulse">
                                      <div className="w-8 h-4 bg-gray-100 rounded" />
                                      <div className="flex-1 h-6 bg-gray-50 rounded-md" />
                                      <div className="w-8 h-4 bg-gray-100 rounded" />
                                  </div>
                              ))}
                    </div>

                    {/* Підсумок тижня */}
                    <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-[12px] font-medium text-gray-500">Total this week</span>
                        <span className="text-[15px] font-bold text-gray-900">
                            {statsData ? `${statsData.totalWeeklyOrders} orders` : '...'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
