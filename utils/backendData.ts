export const getUsers = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`, // Якщо потрібна авторизація
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);

        return data; // Припускаємо, що відповідь має структуру { users: [...] }
    } catch (error) {
        console.error('Помилка при отриманні користувачів:', error);
        throw error;
    }
};

export const getGoods = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/goods`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`, // Якщо потрібна авторизація
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);

        return data; // Припускаємо, що відповідь має структуру { goods: [...] }
    } catch (error) {
        console.error('Помилка при отриманні товарів:', error);
        throw error;
    }
};
