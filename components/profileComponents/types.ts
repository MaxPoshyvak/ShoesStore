export interface OrderItem {
    name: string;
    price: string | number;
    size: string;
    image: string;
    quantity: number;
}

export interface Order {
    id: string;
    date: string;
    status: string;
    total: string | number;
    items: OrderItem[];
}

export interface Review {
    id: string;
    text: string;
    rating: number;
    productName: string;
    date: string;
}

export interface UserProfileData {
    id: string;
    username: string;
    email: string;
    created_at: string;
    phone?: string;
    delivery_address?: string;
    avatarUrl?: string;
    orders: Order[];
    reviews: Review[];
    favorites: any[];
}
