export interface Track{
    id: string;
    name: string; 
    status: 'active' | 'inactive'; 
    createdAt: string; 
}
export interface ApiResponse<T>{
    data: T; 
    message?: string; 
    success: boolean; 
}