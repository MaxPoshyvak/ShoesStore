'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUserProfile, updateUserProfile } from '@/utils/backendData/backendUsers';
import type { UserProfileData } from '@/components/profileComponents';

// 🔥 Імпортуємо FavoritesTab
import {
    Sidebar,
    ProfileTab,
    OrdersTab,
    ReviewsTab,
    ProfileSkeleton,
    FavoritesTab,
} from '@/components/profileComponents';

export default function UserProfile() {
    const router = useRouter();

    // 🔥 Додали 'favorites' до можливих станів
    const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'reviews' | 'favorites'>('profile');
    const [user, setUser] = useState<UserProfileData | null>(null);
    const [formData, setFormData] = useState<Partial<UserProfileData>>({});

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getUserProfile();
                setUser(data.user);
                setFormData(data.user);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [router]);

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const data = await updateUserProfile(formData);
            setUser((prev) => (prev ? { ...prev, ...data.user } : null));
            setIsEditing(false);
            localStorage.setItem('user', JSON.stringify(data.user));
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

    if (isLoading) {
        return <ProfileSkeleton />;
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#F8F9FA] py-30 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
                <Sidebar user={user} activeTab={activeTab} setActiveTab={setActiveTab} handleLogout={handleLogout} />

                <div className="flex-1">
                    {activeTab === 'profile' && (
                        <ProfileTab
                            user={user}
                            formData={formData}
                            setFormData={setFormData}
                            isEditing={isEditing}
                            setIsEditing={setIsEditing}
                            isSaving={isSaving}
                            handleSaveProfile={handleSaveProfile}
                        />
                    )}

                    {activeTab === 'orders' && <OrdersTab orders={user.orders} />}
                    {activeTab === 'reviews' && <ReviewsTab reviews={user.reviews} />}

                    {/* 🔥 Виводимо нову вкладку */}
                    {activeTab === 'favorites' && <FavoritesTab favorites={user.favorites} />}
                </div>
            </div>
        </div>
    );
}
