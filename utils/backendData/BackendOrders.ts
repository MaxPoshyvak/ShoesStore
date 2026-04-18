import { unauthorized } from './401Error';

export const getOrders = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/orders`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Якщо потрібна авторизація
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
};
