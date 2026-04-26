export interface OrderItem {
    order_id: number;
    good_id: number;
    quantity: number;
    price_at_purchase: number;
    name: string;
    main_image_url: string;
}

export interface Order {
    id: number;
    total_amount: number;
    status: string;
    payment_method: string;
    payment_status: string;
    shipping_address: string;
    customer_notes: string | null;
    created_at: string;
    customer_email: string;
    customer_name: string;
    items: OrderItem[];
}

export interface Good {
    id: number;
    name: string;
    category: string;
    price: number;
    stock_quantity: number;
    is_new?: boolean;
    old_price?: number;
    sizes: string;
    main_image_url: string;
    description?: string;
    gallery_urls?: string;
}
