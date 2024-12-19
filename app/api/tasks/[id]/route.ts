import { NextResponse } from "next/server";
import prismaClient from "@/db";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  try {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const task = await prismaClient.task.findUnique({
      where: { id: parsedId },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(task, { status: 200 });
  } catch (error) {
    console.error("Error fetching task:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch task";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  try {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const task = await prismaClient.task.findUnique({
      where: { id: parsedId },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const deletedTask = await prismaClient.task.delete({
      where: { id: parsedId },
    });

    return NextResponse.json(deletedTask, { status: 200 });
  } catch (error) {
    console.error("Error deleting task:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete task";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
