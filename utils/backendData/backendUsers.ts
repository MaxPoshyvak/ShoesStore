import { UserProfileData } from '@/app/(shop)/profile/page';
import { unauthorized } from './401Error';

export const getUsers = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        if (response.status === 401) {
            unauthorized();
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);

        return data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

export const getUserProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        unauthorized();
        return;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/me`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (response.status === 401 || response.status === 403) {
        unauthorized();
        return;
    }

    if (!response.ok) throw new Error('Error fetching user profile');

    const data = await response.json();
    // console.log(data.user.orders[0].id);

    return data;
};

export const updateUserProfile = async (profileData: Partial<UserProfileData>) => {
    const token = localStorage.getItem('token');
    if (!token) {
        unauthorized();
        return;
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/edit`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            username: profileData.username,
            email: profileData.email,
            phone: profileData.phone,
            delivery_address: profileData.delivery_address,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Error updating profile');
    }

    return data;
};
