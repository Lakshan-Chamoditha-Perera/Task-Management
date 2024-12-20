"use client";

import Header from "@/app/components/Header";
import { TaskCard } from "@/app/components/TaskCard";
import { Task } from "@/app/types/Task";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchTasks();
  }, [statusFilter]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get<{ data: Task[] }>(
        `/api/tasks?status=${statusFilter}`
      );
      setTaskList(response.data.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load tasks.";
      alert(`Error fetching tasks: ${errorMessage}`);
    }
  };

  const deleteTask = (id: number) => {
    axios
      .delete(`/api/tasks/${id}`, { params: { id } })
      .then(() => {
        alert(`Task with id ${id} deleted successfully.`);
        fetchTasks();
      })
      .catch((error) => {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to delete task.";
        alert(`Error deleting task with id ${id}: ${errorMessage}`);
      });
  };

  const updateTask = (task: Task) => {
    axios
      .post(
        `/api/tasks/${task.id}`,
        { ...task, isCompleted: true },
        { params: { id: task.id } }
      )
      .then(() => {
        alert(`Task with id ${task.id} updated successfully.`);
        fetchTasks();
      })
      .catch((error) => {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to update task.";
        alert(`Error updating task with id ${task.id}: ${errorMessage}`);
      });
  };

  const buttonClass = (filter: string) =>
    `px-4 py-2 rounded ${
      statusFilter === filter ? "bg-blue-500 text-white" : "bg-gray-200"
    }`;

  return (
    <>
      <Header />

      <div className="mb-4 text-center border-b border-gray-200">
        <button
          onClick={() => setStatusFilter("all")}
          className={buttonClass("all")}
        >
          All Tasks
        </button>
        <button
          onClick={() => setStatusFilter("completed")}
          className={buttonClass("completed")}
        >
          Completed Tasks
        </button>
        <button
          onClick={() => setStatusFilter("incomplete")}
          className={buttonClass("incomplete")}
        >
          Incomplete Tasks
        </button>
      </div>

      <div className="px-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-2 gap-y-10 gap-x-4 mb-16">
        {taskList.length > 0 ? (
          taskList.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No tasks available.
          </p>
        )}
      </div>
    </>
  );
}
