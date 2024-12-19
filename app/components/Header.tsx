"use client";
import React from "react";
import { useRouter } from "next/navigation";

const Header = () => {
    const router = useRouter();

    return (
        <div className="py-5 border px-5 md:px-12 lg:px-28">
            <div className="flex justify-between items-center">
                <div className="text-2xl font-bold">Tasks Management</div>
                <div className="flex items-center">
                    <button
                        onClick={() => router.push("/tasks/create")}
                        className="mr-5 rounded p-2 border shadow flex items-center"
                    >
                        Manage Tasks
                    </button>

                </div>
            </div>
            <div className="mt-5 flex flex-col justify-center items-center">
                <h1 className="text-4xl font-bold">Tasks List</h1>
                <p className="mt-2">

                </p>

            </div>
        </div>
    );
};

export default Header;
