export interface IUser {
    name: string;
    password: string;
    documentNumber: string;
    image_profile?: string; // Pode ser opcional
    birthday: string;
}