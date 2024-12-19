export interface Task {
    id: number;
    title: string;
    isCompleted: boolean;
    priority: 'low' | 'medium' | 'high';
    createdAt: string;
}