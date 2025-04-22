"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { ChevronRight, Plus } from "lucide-react";
import { format } from "date-fns";

export function CalendarView() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [view, setView] = useState<"month" | "week" | "day">("month");

    // Generate example events (in a real app, these would come from a database)
    const events = [
        { id: 1, title: "Staff Meeting", date: new Date(2023, 4, 15, 14, 0), type: "meeting" },
        { id: 2, title: "Final Exams Begin", date: new Date(2023, 4, 16), type: "academic" },
        { id: 3, title: "Parent-Teacher Conference", date: new Date(2023, 4, 15, 16, 0), type: "meeting" },
        { id: 4, title: "End of Term", date: new Date(2023, 4, 30), type: "academic" },
    ];

    // Find events for selected date
    const selectedDateEvents = events.filter(
        (event) => date && event.date.toDateString() === date.toDateString()
    );

    return (
        <Card className="border-blue-100 dark:border-blue-900 h-full">
            <CardHeader className="pb-3 border-b border-blue-50 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/20">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl text-blue-700 dark:text-blue-300">Calendar</CardTitle>
                    <div className="flex items-center gap-2">
                        <div className="flex rounded-md border border-blue-200 dark:border-blue-800 overflow-hidden">
                            <Button
                                variant={view === "month" ? "default" : "ghost"}
                                size="sm"
                                className={view === "month" ? "bg-blue-600 text-white rounded-none" : "text-blue-600 dark:text-blue-300 rounded-none"}
                                onClick={() => setView("month")}
                            >
                                Month
                            </Button>
                            <Button
                                variant={view === "week" ? "default" : "ghost"}
                                size="sm"
                                className={view === "week" ? "bg-blue-600 text-white rounded-none" : "text-blue-600 dark:text-blue-300 rounded-none"}
                                onClick={() => setView("week")}
                            >
                                Week
                            </Button>
                            <Button
                                variant={view === "day" ? "default" : "ghost"}
                                size="sm"
                                className={view === "day" ? "bg-blue-600 text-white rounded-none" : "text-blue-600 dark:text-blue-300 rounded-none"}
                                onClick={() => setView("day")}
                            >
                                Day
                            </Button>
                        </div>
                        <Button variant="outline" size="sm" className="text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                            <ChevronRight className="h-4 w-4 mr-1" />
                            View All
                        </Button>
                    </div>
                </div>
                <CardDescription className="text-blue-600/70 dark:text-blue-400/70">
                    {format(new Date(), "MMMM yyyy")} • Academic Calendar
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="flex flex-col space-y-6">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border border-blue-100 dark:border-blue-900 mx-auto"
                    />

                    <div className="px-2 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-medium text-blue-700 dark:text-blue-300">
                                {date ? format(date, "MMMM d, yyyy") : "Select a date"}
                            </h3>
                            <Button size="sm" className="h-8 bg-blue-600 hover:bg-blue-700 text-white">
                                <Plus className="h-3.5 w-3.5 mr-1" />
                                Add Event
                            </Button>
                        </div>

                        {selectedDateEvents.length > 0 ? (
                            <div className="space-y-2">
                                {selectedDateEvents.map((event) => (
                                    <div
                                        key={event.id}
                                        className="p-2 rounded border border-blue-100 dark:border-blue-900/50 flex items-center gap-3"
                                    >
                                        <div className={`w-1.5 h-8 rounded-full ${event.type === "meeting" ? "bg-blue-500" : "bg-amber-500"
                                            }`} />
                                        <div>
                                            <p className="font-medium text-blue-700 dark:text-blue-300">{event.title}</p>
                                            <p className="text-xs text-blue-600/70 dark:text-blue-400/70">
                                                {event.date.getHours() ? format(event.date, "h:mm a") : "All day"}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-blue-600/70 dark:text-blue-400/70 py-4 text-center border border-dashed border-blue-200 dark:border-blue-800 rounded-md bg-blue-50/50 dark:bg-blue-900/10">
                                No events scheduled for this day
                            </p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 