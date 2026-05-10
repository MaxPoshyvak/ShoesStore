'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUserProfile, updateUserProfile } from '@/utils/backendData/backendUsers';
import type { UserProfileData } from '@/components/profileComponents';

import {
    Sidebar,
    ProfileTab,
    OrdersTab,
    ReviewsTab,
    ProfileSkeleton,
    FavoritesTab,
} from '@/components/profileComponents';
import { Reveal } from '@/components/ScrollAnimated/Reveal';

type TabType = 'profile' | 'orders' | 'reviews' | 'favorites';

export default function UserProfile() {
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<TabType>('profile');
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
        <div className="min-h-screen bg-[#F8F9FA] py-4 sm:py-6 md:py-10 px-3 sm:px-4 md:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto mt-25 md:mt-20 flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8">
                {/* Sidebar */}
                <Reveal effect="fade-right">
                    <Sidebar
                        user={user}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        handleLogout={handleLogout}
                    />
                </Reveal>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                    <Reveal effect="fade-left">
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
                        {activeTab === 'favorites' && <FavoritesTab favorites={user.favorites} />}
                    </Reveal>
                </div>
            </div>
        </div>
    );
}
