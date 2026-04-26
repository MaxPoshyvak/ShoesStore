import { unauthorized } from './401Error';

export const getGoods = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/goods`, {
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
        console.error('Помилка при отриманні товарів:', error);
        throw error;
    }
};

export const deleteGood = async (goodId: number) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/goods/${goodId}`, {
            method: 'DELETE',
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
    } catch (error) {
        console.error('Помилка при видаленні товару:', error);
        throw error;
    }
};

export interface AddGoodData {
    name: string;
    category: string;
    price: string | number;
    stock_quantity: string | number;
    sizes: string;
    main_image_url: string;
    old_price?: string | number;
    is_new?: boolean;
    description?: string;
}

export const addGood = async (goodData: AddGoodData) => {
    const payload = {
        ...goodData,
        price: Number(goodData.price),
        old_price: goodData.old_price ? Number(goodData.old_price) : null,
        stock_quantity: Number(goodData.stock_quantity),
        sizes: goodData.sizes
            .split(',')
            .map((s) => Number(s.trim()))
            .filter((n) => !isNaN(n)),
        gallery_urls: [goodData.main_image_url],
    };

    const token = localStorage.getItem('token');

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/goods`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
    });

    if (response.status === 401) {
        unauthorized();
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Не вдалося створити товар. Перевірте дані.');
    }

    return await response.json();
};

export interface UpdateGoodData {
    name: string;
    category: string;
    price: string | number;
    stock_quantity: string | number;
    sizes: string;
    main_image_url: string;
    old_price?: string | number;
    is_new?: boolean;
    description?: string;
    gallery_urls?: string;
}

export const updateGood = async (id: number, goodData: UpdateGoodData) => {
    const payload = {
        ...goodData,
        price: Number(goodData.price),
        old_price: goodData.old_price ? Number(goodData.old_price) : null,
        stock_quantity: Number(goodData.stock_quantity),
        sizes: goodData.sizes
            .split(',')
            .map((s) => Number(s.trim()))
            .filter((n) => !isNaN(n)),

        gallery_urls: goodData.gallery_urls
            ? goodData.gallery_urls
                  .split(/[\n,]+/)
                  .map((url) => url.trim())
                  .filter((url) => url !== '')
            : [],
    };

    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/goods/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
    });

    if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Сесія закінчилась.');
    }

    if (!response.ok) throw new Error('Не вдалося оновити товар');
    return await response.json();
};

export const updateGoodStock = async (goodId: number, newStock: number) => {
    const token = localStorage.getItem('token');

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/goods/stock/${goodId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ newStock: newStock }),
    });

    if (response.status === 401) {
        unauthorized();
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Не вдалося оновити залишок товару.');
    }

    return await response.json();
};
