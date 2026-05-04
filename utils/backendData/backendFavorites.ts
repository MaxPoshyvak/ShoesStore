import { unauthorized } from '@/utils/backendData/401Error';

export const addToFavorites = async (goodId: number) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/favorites/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ goodId }),
    });

    if (response.status === 401) unauthorized();

    if (!response.ok) {
        throw new Error('Не вдалося додати до обраних');
    }

    return await response.json();
};

export const removeFromFavorites = async (goodId: number) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/favorites/remove/${goodId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });

    if (response.status === 401) unauthorized();

    if (!response.ok) {
        throw new Error('Не вдалося видалити з обраних');
    }

    return await response.json();
};
