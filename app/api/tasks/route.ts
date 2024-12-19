import { NextResponse, type NextRequest } from "next/server";
import prismaClient from "@/db"; // Import the Prisma client

export async function GET(request: NextRequest) {
    try {
        console.log("Fetching all tasks");
        const tasks = await prismaClient.task.findMany();

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
