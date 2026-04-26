// utils/backendData/BackendFeedbacks.ts

export interface FeedbackType {
    _id: string;
    comment: string;
    rating: number;
    goodName: string;
    goodId: string;
    userId: string;
    username: string;
    userEmail: string;
    createdAt: string; // MongoDB автоматично додає це поле, якщо у схемі є timestamps: true
}

export const fetchFeedbacks = async (): Promise<FeedbackType[]> => {
    const token = localStorage.getItem('token');

    // Заміни URL на свій робочий
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/feedbacks/get`, {
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });

    if (!response.ok) {
        throw new Error('Не вдалося завантажити відгуки');
    }

    const data = await response.json();
    return data.feedbacks; // Твій бекенд повертає { feedbacks: [...] }
};
