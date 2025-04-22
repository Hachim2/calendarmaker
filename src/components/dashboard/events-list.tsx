"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Plus, ChevronRight } from "lucide-react";
import { format, isSameDay } from "date-fns";

interface Event {
    id: string;
    title: string;
    date: Date;
    time?: string;
    type: "academic" | "meeting" | "deadline";
    location?: string;
}

export function EventsList() {
    const today = new Date();

    const events: Event[] = [
        {
            id: "1",
            title: "Staff Meeting",
            date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 14, 0),
            time: "2:00 PM - 3:30 PM",
            type: "meeting",
            location: "Conference Room A",
        },
        {
            id: "2",
            title: "Final Exams Begin",
            date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3),
            type: "academic",
        },
        {
            id: "3",
            title: "Parent-Teacher Conference",
            date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5, 16, 0),
            time: "4:00 PM - 7:00 PM",
            type: "meeting",
            location: "Main Building",
        },
        {
            id: "4",
            title: "Grades Due",
            date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7),
            type: "deadline",
        },
    ];

    const formatEventDate = (date: Date) => {
        if (isSameDay(date, today)) {
            return "Today";
        } else if (isSameDay(date, new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1))) {
            return "Tomorrow";
        } else {
            return format(date, "EEEE, MMMM d");
        }
    };

    const getEventTypeColor = (type: Event["type"]) => {
        switch (type) {
            case "academic":
                return "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300";
            case "meeting":
                return "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300";
            case "deadline":
                return "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300";
            default:
                return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300";
        }
    };

    return (
        <Card className="border-blue-100 dark:border-blue-900 h-full">
            <CardHeader className="pb-3 border-b border-blue-50 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/20">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl text-blue-700 dark:text-blue-300">Upcoming Events</CardTitle>
                    <div className="flex items-center gap-2">
                        <Button size="sm" className="h-8 bg-blue-600 hover:bg-blue-700 text-white">
                            <Plus className="h-3.5 w-3.5 mr-1" />
                            Add Event
                        </Button>
                        <Button variant="outline" size="sm" className="text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                            <ChevronRight className="h-4 w-4 mr-1" />
                            View All
                        </Button>
                    </div>
                </div>
                <CardDescription className="text-blue-600/70 dark:text-blue-400/70">
                    Your upcoming events and important dates
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="space-y-6">
                    {events.map((event) => (
                        <div key={event.id} className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                                <h3 className="font-medium text-blue-700 dark:text-blue-300">
                                    {formatEventDate(event.date)}
                                </h3>
                            </div>

                            <div className="p-3 rounded-md border border-blue-100 dark:border-blue-900/50 space-y-3">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h4 className="font-medium text-blue-700 dark:text-blue-300">{event.title}</h4>

                                        {event.time && (
                                            <div className="flex items-center mt-1 text-sm text-blue-600/70 dark:text-blue-400/70">
                                                <Clock className="h-3.5 w-3.5 mr-1.5" />
                                                <span>{event.time}</span>
                                            </div>
                                        )}

                                        {event.location && (
                                            <p className="text-sm text-blue-600/70 dark:text-blue-400/70 mt-1">
                                                {event.location}
                                            </p>
                                        )}
                                    </div>

                                    <Badge className={getEventTypeColor(event.type)}>
                                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
} 