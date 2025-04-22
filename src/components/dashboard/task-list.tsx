"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface Task {
    id: string;
    title: string;
    completed: boolean;
}

export function TaskList() {
    const [tasks, setTasks] = useState<Task[]>([
        { id: "1", title: "Prepare final exam schedule", completed: false },
        { id: "2", title: "Update student grades", completed: true },
        { id: "3", title: "Submit term report", completed: false },
        { id: "4", title: "Schedule faculty meeting", completed: false },
    ]);

    const [newTask, setNewTask] = useState("");

    const toggleTask = (id: string) => {
        setTasks(
            tasks.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    };

    const addTask = () => {
        if (newTask.trim()) {
            setTasks([
                ...tasks,
                { id: Date.now().toString(), title: newTask, completed: false },
            ]);
            setNewTask("");
        }
    };

    return (
        <Card className="border-blue-100 dark:border-blue-900 h-full">
            <CardHeader className="pb-3 border-b border-blue-50 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/20">
                <CardTitle className="text-xl text-blue-700 dark:text-blue-300">Tasks</CardTitle>
                <CardDescription className="text-blue-600/70 dark:text-blue-400/70">
                    Your pending tasks and to-dos
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="space-y-4">
                    <div className="flex space-x-2">
                        <Input
                            placeholder="Add a new task..."
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") addTask();
                            }}
                            className="border-blue-200 dark:border-blue-800 focus-visible:ring-blue-500"
                        />
                        <Button
                            onClick={addTask}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="space-y-2">
                        {tasks.map((task) => (
                            <div
                                key={task.id}
                                className={`flex items-center space-x-3 p-2 rounded-md transition-colors ${task.completed
                                    ? "bg-blue-50/50 dark:bg-blue-900/10 text-blue-400 dark:text-blue-500"
                                    : "border border-blue-100 dark:border-blue-900/50"
                                    }`}
                            >
                                <Checkbox
                                    id={`task-${task.id}`}
                                    checked={task.completed}
                                    onCheckedChange={() => toggleTask(task.id)}
                                    className="border-blue-300 dark:border-blue-700 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                />
                                <label
                                    htmlFor={`task-${task.id}`}
                                    className={`text-sm flex-1 cursor-pointer ${task.completed ? "line-through" : "text-blue-700 dark:text-blue-300"
                                        }`}
                                >
                                    {task.title}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 