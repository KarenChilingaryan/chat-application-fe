export interface Message {
    userId: string;
    message: string;
    timestamp: string;
}
export interface User {
    id: string;
    name: string;
    color: string;
}

export interface UsersObject {
    [key: string]: User
}
