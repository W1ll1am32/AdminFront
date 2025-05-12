export interface Order {
    id: string;
    student_id: string;
    title: string;
    description: string;
    tags: string[];
    min_price: number;
    max_price: number;
    status: string;
    response_count: number;
    created_at: string;
    updated_at: string;
    is_responsed: boolean;
}

export interface Responses {
    id: string;
    order_id: string;
    tutor_id: string;
    name: string;
    is_final: boolean;
    created_at: string;
}

export interface OrderDetails {
    id: string;
    student_id: string;
    title: string;
    name: string;
    description: string;
    tags: string[];
    min_price: number;
    max_price: number;
    status: string;
    response_count: number;
    responses: Responses[];
    created_at: string;
    updated_at: string;
    is_responsed: boolean;
}

export interface OrderCreate {
    title: string;
    description: string;
    tags: string[];
    min_price: number;
    max_price: number;
}

export interface OrderUpdate {
    title: string;
    description: string;
    tags: string[];
    min_price: number;
    max_price: number;
}

export interface OrderEdit {
    is_responded: boolean;
}

export interface Orders {
    Orders: Order[];
}

export interface Tutor {
    Id: string;
    TelegramId: number;
    Name: string;
    Role: string;
    IsBanned: boolean;
}

export interface Review {
    id: string;
    tutor_id: string;
    is_active: boolean;
    rating: number;
    comment: string;
    created_at: string;
}

export interface TutorProfile {
    Tutor: Tutor;
    Bio: string;
    ResponseCount: number;
    Reviews: Review[];
    IsActive: boolean;
    Tags: string[];
    Rating: number;
    CreatedAt: string;
}