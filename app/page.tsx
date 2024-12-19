"use client";

import Header from "@/components/Header";
import {TaskCard} from "@/components/TaskCard";
import {Task} from "@/types/Task";
import {useEffect, useState} from "react";
import axios from "axios";

export default function Home() {
    const [taskList, setTaskList] = useState<Task[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        axios
            .get("/api/tasks")
            .then((response: any) => {
                setTaskList(response.data.data);
            })
            .catch((error) => {
                console.error("Error fetching tasks:", error);
                setError("Failed to load tasks. Please try again later.");
            });
    }, []);

    const deleteTask = (id: number) => {
        axios
            .delete(`/api/tasks/${id}`)
            .then(() => {
                setTaskList((prevList) => prevList.filter((task) => task.id !== id));
            })
            .catch((error) => {
                console.error(`Error deleting task with id ${id}:`, error);
                setError("Failed to delete task. Please try again.");
            });
    };

    return (
        <>
            <Header/>
            {error && (
                <div className="text-red-500 text-center my-4">
                    {error}
        </div>
            )}
            <div
                className="px-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-2 gap-y-10 gap-x-4 mb-16">
                {taskList.length > 0 ? (
                    taskList.map((task) => (
                        <TaskCard key={task.id} task={task} deleteTask={deleteTask}/>
                    ))
                ) : (
                    <p className="text-center text-gray-500 col-span-full">No tasks available.</p>
                )}
            </div>

        </>
  );
}
