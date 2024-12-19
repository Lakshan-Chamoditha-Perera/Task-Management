"use client";

import Header from "@/components/Header";
import {TaskCard} from "@/components/TaskCard";
import {Task} from "@/types/Task";
import {useEffect, useState} from "react";
import axios from "axios";

export default function Home() {
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`/api/tasks?status=${statusFilter}`);
        setTaskList(response.data.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setError("Failed to load tasks. Please try again later.");
      }
    };

    fetchTasks();
  }, [statusFilter]);

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

        {error && <div className="text-red-500 text-center my-4">{error}</div>}

        <div className="mb-4 text-center border-b border-gray-200">
          <button
              onClick={() => setStatusFilter("all")}
              className={`px-4 py-2 rounded ${
                  statusFilter === "all" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
          >
            All Tasks
          </button>
          <button
              onClick={() => setStatusFilter("completed")}
              className={`px-4 py-2 rounded ${
                  statusFilter === "completed"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
              }`}
          >
            Completed Tasks
          </button>
          <button
              onClick={() => setStatusFilter("incomplete")}
              className={`px-4 py-2 rounded ${
                  statusFilter === "incomplete"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
              }`}
          >
            Incomplete Tasks
          </button>
        </div>

        <div className="px-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-2 gap-y-10 gap-x-4 mb-16">
          {taskList.length > 0 ? (
              taskList.map((task) => (
                  <TaskCard key={task.id} task={task} deleteTask={deleteTask}/>
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
