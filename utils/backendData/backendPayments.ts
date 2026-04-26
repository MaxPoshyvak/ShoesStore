export interface Payment {
    id: number;
    transaction_id: string | null;
    order_id: number;
    amount: number;
    payment_method: string;
    status: 'success' | 'pending' | 'failed' | string;
    created_at: string;
}

export const getPayments = async (): Promise<Payment[]> => {
    const token = localStorage.getItem('token');

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/payments/get`, {
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });

    if (response.status === 401) {
        throw new Error('Не авторизовано');
    }

    if (!response.ok) {
        throw new Error('Не вдалося завантажити історію платежів');
    }

    return await response.json();
};
