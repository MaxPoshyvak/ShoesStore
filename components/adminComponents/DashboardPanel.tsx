import { DollarSign, ShoppingCart, TrendingUp, Users } from 'lucide-react';

export const DashboardPanel = () => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Статистика */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                <div>
                    <p className="text-sm font-medium text-gray-500">Total revenue</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">124,500 ₴</p>
                    <p className="text-sm text-green-600 flex items-center mt-2 font-medium">
                        <TrendingUp size={16} className="mr-1" /> +14.5% this month
                    </p>
                </div>
                <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center text-white shadow-lg shadow-black/20">
                    <DollarSign size={28} />
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                <div>
                    <p className="text-sm font-medium text-gray-500">Active orders</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">42</p>
                    <p className="text-sm text-blue-600 flex items-center mt-2 font-medium">In progress</p>
                </div>
                <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center text-black border border-gray-100">
                    <ShoppingCart size={28} />
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                <div>
                    <p className="text-sm font-medium text-gray-500">New customers</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">18</p>
                    <p className="text-sm text-gray-500 flex items-center mt-2 font-medium">Last 7 days</p>
                </div>
                <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center text-black border border-gray-100">
                    <Users size={28} />
                </div>
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent activity</h3>
            <div className="space-y-4">
                {/* Імітація стрічки подій */}
                <div className="flex items-center gap-4 py-3 border-b border-gray-50">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p className="text-sm text-gray-600 flex-1">
                        Order <span className="font-bold text-black">#103</span> was successfully paid
                    </p>
                    <span className="text-xs text-gray-400">5 min ago</span>
                </div>
                <div className="flex items-center gap-4 py-3 border-b border-gray-50">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <p className="text-sm text-gray-600 flex-1">
                        New user registered <span className="font-bold text-black">alex@example.com</span>
                    </p>
                    <span className="text-xs text-gray-400">1 hour ago</span>
                </div>
                <div className="flex items-center gap-4 py-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <p className="text-sm text-gray-600 flex-1">
                        <span className="font-bold text-black">Nike V2K Run</span> is out of stock
                    </p>
                    <span className="text-xs text-gray-400">3 hours ago</span>
                </div>
            </div>
        </div>
    </div>
);
