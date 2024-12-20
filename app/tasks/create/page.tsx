"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Task } from "@/app/types/Task";

const CreateTask = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<Task>({
    id: 0,
    title: "",
    isCompleted: false,
    priority: "low",
    createdAt: new Date().toISOString(),
  });

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchedTask, setSearchedTask] = useState<Task | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as
      | HTMLInputElement
      | HTMLSelectElement;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const saveTask = async () => {
    try {
      const response = await axios.post("/api/tasks", formData);
      if (response.status === 201) {
        setSuccessMessage("Task created successfully!");
        setFormData({
          id: 0,
          title: "",
          isCompleted: false,
          priority: "low",
          createdAt: new Date().toISOString(),
        });
        setSearchedTask(null);
      }
    } catch (err) {
      setError("Failed to create task. Please try again.");
      console.error("Error:", err);
    }
  };



  const updateTask = async () => {
    if (!searchedTask) {
      setError("No task found to update.");
      return;
    }

    try {
      const response = await axios.post(
        `/api/tasks/${searchedTask.id}`,
        { ...formData, id: searchedTask.id }
      );
      if (response.status === 200) {
        setSuccessMessage("Task updated successfully!");
        setSearchedTask(null);
        setFormData({
          id: 0,
          title: "",
          isCompleted: false,
          priority: "low",
          createdAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      setError("Failed to update task. Please try again.");
      console.error("Error:", err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title) {
      setError("Task title is required.");
      return;
    }

    setError(null);

    if (searchedTask) {
      updateTask();
    } else {
      saveTask();
    }
  };

  const handleSearch = async () => {
    if (!searchQuery || !isNaN(Number(searchQuery))) {
      setSearchedTask(null);
      return;
    }

    try {
      const response = await axios.get<Task>(`/api/tasks/${searchQuery}`, {
        params: { id: searchQuery },
      });
      const data = response.data;
      console.log("feched task : ", data);
      setFormData(data);
      setSearchedTask(data);
    } catch (err: unknown) {
      setError("No task found with the given ID.");
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white text-black">
      <h1 className="text-3xl font-bold mb-6">
        {searchedTask ? "Update Task" : "Create a New Task"}
      </h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {successMessage && (
        <div className="text-green-500 mb-4">{successMessage}</div>
      )}

      <div className="mb-4 flex justify-end">
        {/* Search bar */}
        <input
          type="text"
          placeholder="Search by ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="ml-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg"
        >
          Search
        </button>
      </div>

      {searchedTask && (
        <div className="mb-4 p-4 border rounded-lg bg-gray-50">
          <h3 className="text-xl font-bold">Searched Task</h3>
          <p>ID: {searchedTask.id}</p>
          <p>Title: {searchedTask.title}</p>
          <p>
            Status: {searchedTask.isCompleted ? "Completed" : "Not Completed"}
          </p>
          <p>Priority: {searchedTask.priority}</p>
          <p>
            Created At: {new Date(searchedTask.createdAt).toLocaleDateString()}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter task title"
          />
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium mb-2">
            Priority
          </label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="isCompleted"
            className="block text-sm font-medium mb-2"
          >
            Completed
          </label>

          <input
            type="checkbox"
            name="isCompleted"
            checked={formData.isCompleted}
            onChange={handleChange}
            className="mr-2"
          />
          <span>{formData.isCompleted ? "Yes" : "No"}</span>
        </div>

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 bg-gray-300 text-black font-semibold rounded-lg"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg"
          >
            {searchedTask ? "Update Task" : "Create Task"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTask;
