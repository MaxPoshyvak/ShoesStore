export const addToWaitlist = async (email: string, id: number) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/waitlist`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Якщо токена немає, передасться порожній рядок. Це нормально, бекенд це пропустить.
                Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
            },
            // Відправляємо ту пошту, яку визначили вище
            body: JSON.stringify({ good_id: id, email: email }),
        });

        if (!response.ok) throw new Error(`API error: ${response.status}`);
    } catch (error) {
        console.error('Error adding to waitlist:', error);
    }
};
