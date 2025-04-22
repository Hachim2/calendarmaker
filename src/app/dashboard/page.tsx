"use client"

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarClock, ListTodo, BookOpen, User, Bell, Plus, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { Navbar } from "@/components/layout/navbar";
import Link from "next/link";

export default function DashboardPage() {
    const [date, setDate] = useState<Date | undefined>(new Date());

    // Sample events for the dashboard
    const upcomingEvents = [
        { id: 1, title: "Staff Meeting", date: "Today, 2:00 PM", type: "meeting" },
        { id: 2, title: "Final Exams Begin", date: "Tomorrow", type: "academic" },
        { id: 3, title: "Parent-Teacher Conference", date: "May 15, 4:00 PM", type: "meeting" },
        { id: 4, title: "End of Term", date: "May 30", type: "academic" },
    ];

    const tasks = [
        { id: 1, title: "Grade mid-term papers", completed: false },
        { id: 2, title: "Prepare final exam questions", completed: true },
        { id: 3, title: "Update student attendance records", completed: false },
        { id: 4, title: "Submit term reports", completed: false },
    ];

    return (
        <div className="relative min-h-screen bg-bg text-text overflow-hidden">
            <div className="container mx-auto px-4 py-4 pt-8 md:py-6 md:pt-12 mb-24 relative">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold tracking-tight text-blue-700 dark:text-blue-300">Academic Calendar</h1>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 dark:text-blue-300 dark:border-blue-800">
                                <Bell className="h-4 w-4 mr-2" />
                                Notifications
                            </Button>
                            <Link href="/dashboard/calendar-maker">
                                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                                    <Plus className="h-4 w-4 mr-2" />
                                    New Calendar
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="border-blue-100 dark:border-blue-900">
                                <CardHeader className="pb-3 border-b border-blue-50 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/20">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-xl text-blue-700 dark:text-blue-300">Calendar View</CardTitle>
                                        <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-300">
                                            <ChevronRight className="h-4 w-4" />
                                            View All
                                        </Button>
                                    </div>
                                    <CardDescription className="text-blue-600/70 dark:text-blue-400/70">
                                        Plan your academic year and view important dates
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="flex flex-col space-y-4">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={setDate}
                                            className="rounded-md border border-blue-100 dark:border-blue-900 mx-auto"
                                        />

                                        {date && (
                                            <div className="pt-4 px-2">
                                                <h3 className="font-medium mb-2 text-blue-700 dark:text-blue-300">
                                                    Selected: {format(date, "MMMM d, yyyy")}
                                                </h3>
                                                <p className="text-sm text-blue-600/70 dark:text-blue-400/70">
                                                    No events scheduled for this day. Click &quot;New Calendar&quot; to add events.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-blue-100 dark:border-blue-900">
                                <CardHeader className="border-b border-blue-50 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/20">
                                    <CardTitle className="flex items-center text-blue-700 dark:text-blue-300">
                                        <CalendarClock className="h-5 w-5 mr-2 text-blue-600" />
                                        Upcoming Events
                                    </CardTitle>
                                    <CardDescription className="text-blue-600/70 dark:text-blue-400/70">
                                        Your schedule for the coming days
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="space-y-4">
                                        {upcomingEvents.map((event) => (
                                            <div
                                                key={event.id}
                                                className="flex items-center justify-between p-3 rounded-lg border border-blue-100 dark:border-blue-900/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-2 h-10 rounded-full ${event.type === "meeting" ? "bg-blue-500" : "bg-amber-500"
                                                        }`} />
                                                    <div>
                                                        <p className="font-medium text-blue-700 dark:text-blue-300">{event.title}</p>
                                                        <p className="text-sm text-blue-600/70 dark:text-blue-400/70">{event.date}</p>
                                                    </div>
                                                </div>
                                                <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-300">View</Button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-6">
                            <Card className="border-blue-100 dark:border-blue-900">
                                <CardHeader className="border-b border-blue-50 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/20">
                                    <CardTitle className="flex items-center text-blue-700 dark:text-blue-300">
                                        <User className="h-5 w-5 mr-2 text-blue-600" />
                                        Your Profile
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                                            <User className="h-10 w-10 text-blue-600 dark:text-blue-300" />
                                        </div>
                                        <h3 className="font-bold text-lg text-blue-700 dark:text-blue-300">Admin User</h3>
                                        <p className="text-blue-600/70 dark:text-blue-400/70 mb-4">Education Administrator</p>
                                        <Button variant="outline" size="sm" className="w-full border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-300">
                                            Edit Profile
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-blue-100 dark:border-blue-900">
                                <CardHeader className="border-b border-blue-50 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/20">
                                    <CardTitle className="flex items-center text-blue-700 dark:text-blue-300">
                                        <ListTodo className="h-5 w-5 mr-2 text-blue-600" />
                                        Tasks
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="space-y-4">
                                        {tasks.map((task) => (
                                            <div key={task.id} className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    defaultChecked={task.completed}
                                                    className="h-4 w-4 rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <span className={`text-sm ${task.completed ? "line-through text-blue-400 dark:text-blue-500" : "text-blue-700 dark:text-blue-300"}`}>
                                                    {task.title}
                                                </span>
                                            </div>
                                        ))}
                                        <Button variant="ghost" size="sm" className="w-full mt-2 text-blue-600 dark:text-blue-300">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Task
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-blue-100 dark:border-blue-900">
                                <CardHeader className="border-b border-blue-50 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/20">
                                    <CardTitle className="flex items-center text-blue-700 dark:text-blue-300">
                                        <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                                        Quick Links
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="space-y-2">
                                        <Link href="/dashboard/calendar-maker">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full justify-start text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                                            >
                                                Calendar Maker
                                            </Button>
                                        </Link>
                                        <Button variant="outline" size="sm" className="w-full justify-start text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                                            Student Records
                                        </Button>
                                        <Button variant="outline" size="sm" className="w-full justify-start text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                                            Attendance Tracker
                                        </Button>
                                        <Button variant="outline" size="sm" className="w-full justify-start text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                                            Grade Book
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <Navbar />
        </div>
    );
} 