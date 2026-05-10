import { DollarSign, ShoppingCart, Users, ArrowUpRight, ArrowDownRight, Eye } from 'lucide-react';

const stats = [
    {
        label: 'Total Revenue',
        value: '124,500 ₴',
        change: '+14.5%',
        trend: 'up' as const,
        icon: DollarSign,
        iconBg: 'bg-emerald-50',
        iconColor: 'text-emerald-600',
        accentColor: 'border-l-emerald-500',
    },
    {
        label: 'Active Orders',
        value: '42',
        change: '+3 today',
        trend: 'up' as const,
        icon: ShoppingCart,
        iconBg: 'bg-blue-50',
        iconColor: 'text-blue-600',
        accentColor: 'border-l-blue-500',
    },
    {
        label: 'New Customers',
        value: '18',
        change: '-2 vs last week',
        trend: 'down' as const,
        icon: Users,
        iconBg: 'bg-violet-50',
        iconColor: 'text-violet-600',
        accentColor: 'border-l-violet-500',
    },
    {
        label: 'Page Views',
        value: '2,847',
        change: '+8.1%',
        trend: 'up' as const,
        icon: Eye,
        iconBg: 'bg-amber-50',
        iconColor: 'text-amber-600',
        accentColor: 'border-l-amber-500',
    },
];

const activities = [
    {
        dot: 'bg-emerald-500',
        message: (
            <>
                Order <span className="font-semibold text-gray-900">#103</span> was successfully paid
            </>
        ),
        time: '5 min ago',
    },
    {
        dot: 'bg-blue-500',
        message: (
            <>
                New user registered — <span className="font-semibold text-gray-900">alex@example.com</span>
            </>
        ),
        time: '1 hour ago',
    },
    {
        dot: 'bg-amber-500',
        message: (
            <>
                <span className="font-semibold text-gray-900">Nike V2K Run</span> is out of stock
            </>
        ),
        time: '3 hours ago',
    },
    {
        dot: 'bg-violet-500',
        message: (
            <>
                New feedback received — <span className="font-semibold text-gray-900">5 stars</span> for Air Max
            </>
        ),
        time: '5 hours ago',
    },
    {
        dot: 'bg-rose-500',
        message: (
            <>
                Order <span className="font-semibold text-gray-900">#97</span> was cancelled by customer
            </>
        ),
        time: 'Yesterday',
    },
];

export const DashboardPanel = () => {
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
                    <div className="space-y-0">
                        {activities.map((item, i) => (
                            <div key={i} className="flex items-start gap-3.5 py-3 group">
                                <div className="relative mt-1.5">
                                    <div className={`w-2 h-2 rounded-full ${item.dot}`} />
                                    {i < activities.length - 1 && (
                                        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-px h-6 bg-gray-100" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[13px] text-gray-600 leading-relaxed">{item.message}</p>
                                </div>
                                <span className="text-[11px] text-gray-400 font-medium whitespace-nowrap mt-0.5">
                                    {item.time}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick stats / chart placeholder */}
                <div className="bg-white rounded-xl border border-gray-200/80 p-6">
                    <h3 className="text-[15px] font-bold text-gray-900 mb-5">Weekly Overview</h3>
                    <div className="space-y-4">
                        {[
                            { label: 'Mon', value: 65, color: 'bg-gray-900' },
                            { label: 'Tue', value: 80, color: 'bg-gray-900' },
                            { label: 'Wed', value: 45, color: 'bg-gray-400' },
                            { label: 'Thu', value: 90, color: 'bg-gray-900' },
                            { label: 'Fri', value: 70, color: 'bg-gray-900' },
                            { label: 'Sat', value: 55, color: 'bg-gray-400' },
                            { label: 'Sun', value: 30, color: 'bg-gray-300' },
                        ].map((bar) => (
                            <div key={bar.label} className="flex items-center gap-3">
                                <span className="text-[11px] font-medium text-gray-400 w-8">{bar.label}</span>
                                <div className="flex-1 h-6 bg-gray-50 rounded-md overflow-hidden">
                                    <div
                                        className={`h-full ${bar.color} rounded-md transition-all duration-500`}
                                        style={{ width: `${bar.value}%` }}
                                    />
                                </div>
                                <span className="text-[11px] font-semibold text-gray-500 w-8 text-right">
                                    {bar.value}%
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-[12px] text-gray-500">Total this week</span>
                        <span className="text-[15px] font-bold text-gray-900">435 orders</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
