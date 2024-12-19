import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Task {
    id: number;
    title: string;
    isCompleted: boolean;
    priority: 'low' | 'medium' | 'high';
    createdAt: string;
}

interface TasksState {
    tasks: Task[];
    loading: boolean;
    error: string | null;
    successMessage: string | null;
}

const initialState: TasksState = {
    tasks: [],
    loading: false,
    error: null,
    successMessage: null,
};

export const fetchTaskById = createAsyncThunk('tasks/fetchTaskById', async (id: string) => {
    const response = await axios.get(`/api/tasks/${id}`);
    return response.data;
});

export const createTask = createAsyncThunk('tasks/createTask', async (task: Task) => {
    const response = await axios.post('/api/tasks', task);
    return response.data;
});

export const updateTask = createAsyncThunk('tasks/updateTask', async (task: Task) => {
    const response = await axios.put(`/api/tasks/${task.id}`, task);
    return response.data;
});

const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        resetErrorAndSuccess: (state) => {
            state.error = null;
            state.successMessage = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTaskById.fulfilled, (state, action) => {
                state.successMessage = 'Task found';
                state.tasks = [action.payload];
            })
            .addCase(fetchTaskById.rejected, (state, action) => {
                state.error = 'Failed to fetch task';
            })
            .addCase(createTask.fulfilled, (state, action) => {
                state.successMessage = 'Task created successfully!';
                state.tasks.push(action.payload);
            })
            .addCase(createTask.rejected, (state, action) => {
                state.error = 'Failed to create task';
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                state.successMessage = 'Task updated successfully!';
                state.tasks = state.tasks.map((task) =>
                    task.id === action.payload.id ? action.payload : task
                );
            })
            .addCase(updateTask.rejected, (state, action) => {
                state.error = 'Failed to update task';
            });
    },
});

export const { resetErrorAndSuccess } = tasksSlice.actions;
export default tasksSlice.reducer;
