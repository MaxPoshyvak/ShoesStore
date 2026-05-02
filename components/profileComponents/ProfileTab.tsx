import React from 'react';
import { Edit2, User, Mail, Phone, MapPin } from 'lucide-react';
import { UserProfileData } from './types';

interface ProfileTabProps {
    user: UserProfileData;
    formData: Partial<UserProfileData>;
    setFormData: (data: Partial<UserProfileData>) => void;
    isEditing: boolean;
    setIsEditing: (val: boolean) => void;
    isSaving: boolean;
    handleSaveProfile: (e: React.FormEvent) => void;
}

export function ProfileTab({
    user,
    formData,
    setFormData,
    isEditing,
    setIsEditing,
    isSaving,
    handleSaveProfile,
}: ProfileTabProps) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h2 className="text-2xl font-black text-gray-900">Personal Information</h2>
                    <p className="text-gray-500 text-sm mt-1">Manage your account details and preferences.</p>
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
                            {user.phone || <span className="text-gray-400 font-normal">Not specified</span>}
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
                            onChange={(e) => setFormData({ ...formData, delivery_address: e.target.value })}
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none"
                            placeholder="City, Street..."
                        />
                    ) : (
                        <div className="flex items-center gap-3 text-gray-900 font-medium bg-gray-50 px-4 py-3 rounded-xl border border-transparent">
                            <MapPin size={18} className="text-gray-400" />{' '}
                            {user.delivery_address || <span className="text-gray-400 font-normal">Not specified</span>}
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
    );
}
