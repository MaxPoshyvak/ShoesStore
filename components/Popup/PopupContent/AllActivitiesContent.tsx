'use client';

import { useEffect, useState } from 'react';
import { Loader2, Activity as ActivityIcon } from 'lucide-react';

interface ActivityItem {
    _id: string;
    category: 'Order' | 'Register' | 'OutOfStock' | 'Feedback';
    action: string;
    createdAt: string;
}

// Функція для форматування часу
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

// Кольори для крапок
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

export const AllActivitiesContent = () => {
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const token = localStorage.getItem('token');
                // Зверни увагу: у твоєму роуті була опечатка 'activtiy/get'.
                // Якщо ти її виправив, зміни URL тут на правильний.
                // Також переконайся, що використовуєш правильний метод (POST чи GET)
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/statistic/activty/get`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    // Про всяк випадок сортуємо і на фронті, якщо бекенд не відсортував
                    const sorted = data.activities.sort(
                        (a: ActivityItem, b: ActivityItem) =>
                            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
                    );
                    setActivities(sorted);
                }
            } catch (error) {
                console.error('Failed to load activities:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchActivities();
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400 mb-4" />
                <p className="text-sm text-gray-500 font-medium">Loading history...</p>
            </div>
        );
    }

    if (activities.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                    <ActivityIcon size={24} className="text-gray-400" />
                </div>
                <p className="text-[15px] font-bold text-gray-900">No recent activity</p>
                <p className="text-[13px] text-gray-500 mt-1">Your store&apos;s activity history is empty.</p>
            </div>
        );
    }

    return (
        <div className="pr-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
            <div className="space-y-0">
                {activities.map((item, i) => (
                    <div key={item._id} className="flex items-start gap-3.5 py-3.5 group">
                        {/* Блок з крапкою та лінією */}
                        <div className="relative mt-1.5 flex flex-col items-center shrink-0">
                            <div
                                className={`w-2 h-2 rounded-full ${getDotColor(item.category)} ring-4 ring-white relative z-10`}
                            />
                            {/* Малюємо лінію для всіх елементів, крім останнього */}
                            {i < activities.length - 1 && (
                                <div className="absolute top-2 w-px h-[calc(100%+16px)] bg-gray-100" />
                            )}
                        </div>

                        {/* Текст активності */}
                        <div className="flex-1 min-w-0">
                            <p className="text-[13px] text-gray-700 font-medium leading-relaxed">{item.action}</p>
                        </div>

                        {/* Час */}
                        <span className="text-[11px] text-gray-400 font-medium whitespace-nowrap mt-0.5 shrink-0">
                            {timeAgo(item.createdAt)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};
