"use client";
import { FaTrash } from "react-icons/fa";
import React from "react";
import { Task } from "@/types/Task";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import axios from "axios";

interface TaskItemProps {
    task: Task;
    deleteTask: (id: number) => void;
}

export const TaskCard: React.FC<TaskItemProps> = ({
    task: { id, title, isCompleted, priority, createdAt },
    deleteTask,
}) => {

    const markAsCompleted = async (id: number) => {
        try {
            const updatedTaskData = {
                isCompleted: true,
            };

            const response = await axios.put(`/api/tasks/${id}`, updatedTaskData);

            if (response.status === 200) {
                alert("Task marked as completed!");
            } else {
                alert("Failed to mark task as completed");
            }
        } catch (error) {
            console.error("Error updating task state:", error);
            alert("Error updating task state");
        }
    };

    return (
        <div className="max-w-[330px] sm:max-w-[300px] bg-gradient-to-br from-white to-gray-100 border shadow-md hover:shadow-xl transition duration-300 ease-in-out rounded-lg overflow-hidden">
            <div key={id} className="p-4">
                <h2 className="text-lg font-bold text-gray-800">{title}</h2>
                <p
                    className={`mt-1 text-sm font-semibold ${isCompleted ? "text-green-500" : "text-red-500"
                        }`}
                >
                    {isCompleted ? "Completed" : "Not Completed"}
                </p>
                <p
                    className={`text-xs mt-2 py-1 px-2 w-fit rounded-lg font-medium uppercase ${priority === "high"
                        ? "bg-red-100 text-red-500"
                        : priority === "medium"
                            ? "bg-yellow-100 text-yellow-500"
                            : "bg-green-100 text-green-500"
                        }`}
                >
                    {priority} Priority
                </p>
                <p className="text-xs text-gray-400 mt-2">
                    Created on: {new Date(createdAt).toLocaleDateString()}
                </p>
            </div>
            <div className="flex flex-row justify-end px-4 py-3 bg-gray-50 ">
                <button
                    className="text-red-500 p-2 rounded-full hover:bg-red-500 hover:text-white transition duration-300 ease-in-out"
                    onClick={() => deleteTask(id)}
                    title="Delete Task"
                >
                    <FaTrash />
                </button>
                {/* mark as completed */}
                {
                    !isCompleted ? <button
                        className="text-green-500 p-2 rounded-full hover:bg-green-500 hover:text-white transition duration-300 ease-in-out"
                        onClick={() => markAsCompleted(id)}
                        title="Mark as Completed"
                    >
                        <IoCheckmarkDoneCircle />
                    </button> : <></>
                }
            </div>
        </div>
    );
};
