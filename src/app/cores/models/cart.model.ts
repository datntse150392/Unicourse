export interface Cart {
    _id: string;
    user_id: UserInfo;
    amount: number;
    items: CartItem[];
    created_at: Date;
    updated_at: Date;
}

export interface UserInfo {
    _id: string;
    email: string;
}

export interface CartItem {
    _id: string;
    title: string;
    amount: number;
    thumbnail: string;
}