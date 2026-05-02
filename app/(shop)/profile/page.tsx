'use client';

import React, { useState, useEffect } from 'react';
import { User, Package, Star, LogOut, Edit2, MapPin, Phone, Mail, Clock, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getUserProfile, updateUserProfile } from '@/utils/backendData/backendUsers';
import Image from 'next/image';

// ==========================================
// INTERFACES (Based on your backend response)
// ==========================================
export interface OrderItem {
    name: string;
    price: string | number;
    size: string;
    image: string;
    quantity: number;
}

export interface Order {
    id: string;
    date: string;
    status: string;
    total: string | number;
    items: OrderItem[];
}

export interface Review {
    id: string;
    text: string;
    rating: number;
    productName: string;
    date: string;
}

export interface UserProfileData {
    id: string;
    username: string;
    email: string;
    created_at: string;
    phone?: string;
    delivery_address?: string;
    avatarUrl?: string;
    orders: Order[];
    reviews: Review[];
}

export default function UserProfile() {
    const router = useRouter();

    // ==========================================
    // STATES
    // ==========================================
    const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'reviews'>('profile');
    const [user, setUser] = useState<UserProfileData | null>(null);
    const [formData, setFormData] = useState<Partial<UserProfileData>>({});

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Стан для розгорнутих замовлень (зберігає id замовлень, які зараз відкриті)
    const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});

    // ==========================================
    // FETCH DATA
    // ==========================================
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getUserProfile();
                setUser(data.user);
                setFormData(data.user);
            } catch (error) {
                console.error(error);
                // Handle error or redirect
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [router]);

    // ==========================================
    // UPDATE PROFILE
    // ==========================================
    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const data = await updateUserProfile(formData);

            // Update local state with new data, keeping orders and reviews intact
            setUser((prev) => (prev ? { ...prev, ...data.user } : null));
            setIsEditing(false);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    // Функція для відкриття/закриття замовлення
    const toggleOrder = (orderId: string) => {
        setExpandedOrders((prev) => ({
            ...prev,
            [orderId]: !prev[orderId],
        }));
    };

    // ==========================================
    // RENDER HELPERS
    // ==========================================
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
                <Clock className="animate-spin text-gray-400" size={32} />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#F8F9FA] py-30 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
                {/* ================= SIDEBAR ================= */}
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
                                                activeTab === item.id
                                                    ? 'bg-white/20 text-white'
                                                    : 'bg-gray-100 text-gray-500'
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

                {/* ================= MAIN CONTENT ================= */}
                <div className="flex-1">
                    {/* TAB: PROFILE */}
                    {activeTab === 'profile' && (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900">Personal Information</h2>
                                    <p className="text-gray-500 text-sm mt-1">
                                        Manage your account details and preferences.
                                    </p>
                                </div>
                                {!isEditing && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-black bg-gray-50 px-4 py-2 rounded-xl transition-colors">
                                        <Edit2 size={16} /> Edit Profile
                                    </button>
                                )}
                            </div>

                            <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                        Full Name
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username || ''}
                                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none"
                                            required
                                        />
                                    ) : (
                                        <div className="flex items-center gap-3 text-gray-900 font-medium bg-gray-50 px-4 py-3 rounded-xl border border-transparent">
                                            <User size={18} className="text-gray-400" /> {user.username}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                        Email Address
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email || ''}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none"
                                            required
                                        />
                                    ) : (
                                        <div className="flex items-center gap-3 text-gray-900 font-medium bg-gray-50 px-4 py-3 rounded-xl border border-transparent">
                                            <Mail size={18} className="text-gray-400" /> {user.email}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                        Phone Number
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone || ''}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none"
                                            placeholder="+380..."
                                        />
                                    ) : (
                                        <div className="flex items-center gap-3 text-gray-900 font-medium bg-gray-50 px-4 py-3 rounded-xl border border-transparent">
                                            <Phone size={18} className="text-gray-400" />{' '}
                                            {user.phone || (
                                                <span className="text-gray-400 font-normal">Not specified</span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                        Delivery Address
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="delivery_address"
                                            value={formData.delivery_address || ''}
                                            onChange={(e) =>
                                                setFormData({ ...formData, delivery_address: e.target.value })
                                            }
                                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none"
                                            placeholder="City, Street..."
                                        />
                                    ) : (
                                        <div className="flex items-center gap-3 text-gray-900 font-medium bg-gray-50 px-4 py-3 rounded-xl border border-transparent">
                                            <MapPin size={18} className="text-gray-400" />{' '}
                                            {user.delivery_address || (
                                                <span className="text-gray-400 font-normal">Not specified</span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {isEditing && (
                                    <div className="md:col-span-2 flex justify-end gap-3 mt-4 pt-6 border-t border-gray-100">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsEditing(false);
                                                setFormData(user);
                                            }}
                                            className="px-6 py-3 rounded-xl text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSaving}
                                            className="px-6 py-3 rounded-xl text-sm font-bold text-white bg-black hover:bg-gray-800 transition-colors">
                                            {isSaving ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                )}
                            </form>
                        </div>
                    )}

                    {/* TAB: ORDERS */}
                    {activeTab === 'orders' && (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-2xl font-black text-gray-900 mb-6">Order History</h2>

                            {!user.orders || user.orders.length === 0 ? (
                                <div className="text-center py-10 text-gray-400">
                                    You haven&apos;t placed any orders yet.
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {user.orders.map((order) => {
                                        const isExpanded = expandedOrders[order.id];

                                        return (
                                            <div
                                                key={order.id}
                                                className="border border-gray-100 rounded-2xl p-5 hover:border-gray-200 transition-colors bg-white">
                                                {/* HEADER ЗАМОВЛЕННЯ (КЛІКАБЕЛЬНИЙ) */}
                                                <div
                                                    className="flex flex-wrap justify-between items-center cursor-pointer gap-4"
                                                    onClick={() => toggleOrder(order.id)}>
                                                    <div>
                                                        <span className="text-sm text-gray-500">Order ID</span>
                                                        <h3 className="font-bold text-lg text-gray-900">#{order.id}</h3>
                                                    </div>
                                                    <div className="text-right hidden sm:block">
                                                        <span className="text-sm text-gray-500">Total Amount</span>
                                                        <p className="font-black text-lg">₴{order.total}</p>
                                                    </div>
                                                    <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-4">
                                                        <div className="text-right sm:hidden">
                                                            <span className="text-sm text-gray-500">Total</span>
                                                            <p className="font-black">₴{order.total}</p>
                                                        </div>
                                                        <span className="text-sm text-gray-500 hidden md:inline-block">
                                                            {new Date(order.date).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric',
                                                            })}
                                                        </span>

                                                        {order.status != 'success' ? (
                                                            <span className="flex items-center gap-1.5 px-3 py-1 bg-black text-white text-xs font-bold rounded-lg capitalize">
                                                                {order.status}
                                                            </span>
                                                        ) : (
                                                            <span className="flex items-center gap-1.5 px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-lg capitalize">
                                                                {order.status}
                                                            </span>
                                                        )}
                                                        {/* СТРІЛОЧКА */}
                                                        <ChevronDown
                                                            className={`text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                                                            size={20}
                                                        />
                                                    </div>
                                                </div>

                                                {/* РОЗГОРНУТИЙ СПИСОК ТОВАРІВ */}
                                                {isExpanded && (
                                                    <div className="pt-6 mt-5 border-t border-gray-50 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                                            Items in order
                                                        </h4>
                                                        {order.items?.map((item, idx) => (
                                                            <div
                                                                key={idx}
                                                                className="flex items-center gap-4 bg-gray-50/50 p-3 rounded-xl border border-gray-50">
                                                                <div className="w-16 h-16 bg-white rounded-lg overflow-hidden shrink-0 border border-gray-100">
                                                                    <Image
                                                                        src={item.image}
                                                                        alt={item.name}
                                                                        width={100}
                                                                        height={100}
                                                                        className="w-full h-full object-cover mix-blend-multiply"
                                                                    />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <h4 className="font-bold text-sm text-gray-900">
                                                                        {item.name}
                                                                    </h4>
                                                                    <p className="text-xs text-gray-500 mt-1">
                                                                        Size:{' '}
                                                                        <span className="font-semibold text-gray-700">
                                                                            {item.size}
                                                                        </span>
                                                                    </p>
                                                                    <p className="text-xs text-gray-500">
                                                                        Quantity:{' '}
                                                                        <span className="font-semibold text-gray-700">
                                                                            {item.quantity}
                                                                        </span>
                                                                    </p>
                                                                </div>
                                                                <div className="font-bold text-sm text-gray-900">
                                                                    ₴{item.price}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* TAB: REVIEWS */}
                    {activeTab === 'reviews' && (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-2xl font-black text-gray-900 mb-6">My Reviews</h2>

                            {!user.reviews || user.reviews.length === 0 ? (
                                <div className="text-center py-10 text-gray-400">
                                    You haven&apos;t written any reviews yet.
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4">
                                    {user.reviews.map((review) => (
                                        <div
                                            key={review.id}
                                            className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="font-bold text-sm text-gray-900">
                                                    {review.productName}
                                                </h4>
                                                <div className="flex items-center gap-1">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Star
                                                            key={star}
                                                            size={14}
                                                            className={
                                                                star <= review.rating
                                                                    ? 'fill-yellow-400 text-yellow-400'
                                                                    : 'fill-gray-200 text-gray-200'
                                                            }
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600">&quot;{review.text}&quot;</p>
                                            <p className="text-xs text-gray-400 mt-4">
                                                {new Date(review.date).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
