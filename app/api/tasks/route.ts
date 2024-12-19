import { NextResponse, type NextRequest } from "next/server";
import prismaClient from "@/app/db";

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const status = url.searchParams.get("status");

        let tasks;
        if (status === "completed") {
            tasks = await prismaClient.task.findMany({
                where: { isCompleted: true },
            });
        } else if (status === "incomplete") {
            tasks = await prismaClient.task.findMany({
                where: { isCompleted: false },
            });
        } else {
            tasks = await prismaClient.task.findMany();
        }

        console.log(`Fetching ${status || "all"} tasks`);
        return NextResponse.json({ data: tasks }, { status: 200 });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch tasks";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const taskData = await request.json();

        const newTask = await prismaClient.task.create({
            data: {
                title: taskData.title,
                isCompleted: taskData.isCompleted,
                priority: taskData.priority,
                createdAt: taskData.createdAt,
            },
        });

        return NextResponse.json({ data: newTask }, { status: 201 });
    } catch (error) {
        console.error("Error creating task:", error);
        return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
    }
}
