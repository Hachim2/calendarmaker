"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Calendar,
    Users,
    ClipboardCheck,
    GraduationCap
} from "lucide-react";

interface QuickLink {
    title: string;
    description: string;
    icon: React.ReactNode;
    url: string;
    color: string;
}

export function QuickLinks() {
    const links: QuickLink[] = [
        {
            title: "Calendar Maker",
            description: "Create custom academic calendars",
            icon: <Calendar className="h-6 w-6" />,
            url: "/calendar-maker",
            color: "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
        },
        {
            title: "Student Records",
            description: "Manage student information",
            icon: <Users className="h-6 w-6" />,
            url: "/students",
            color: "bg-teal-50 text-teal-600 border-teal-100 dark:bg-teal-900/20 dark:text-teal-300 dark:border-teal-800",
        },
        {
            title: "Attendance Tracker",
            description: "Track student attendance",
            icon: <ClipboardCheck className="h-6 w-6" />,
            url: "/attendance",
            color: "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800",
        },
        {
            title: "Grade Book",
            description: "Manage student grades",
            icon: <GraduationCap className="h-6 w-6" />,
            url: "/grades",
            color: "bg-green-50 text-green-600 border-green-100 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800",
        },
    ];

    return (
        <Card className="border-blue-100 dark:border-blue-900">
            <CardHeader className="pb-3 border-b border-blue-50 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/20">
                <CardTitle className="text-xl text-blue-700 dark:text-blue-300">Quick Links</CardTitle>
                <CardDescription className="text-blue-600/70 dark:text-blue-400/70">
                    Access important tools and features
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-3">
                    {links.map((link, i) => (
                        <a
                            key={i}
                            href={link.url}
                            className={`flex flex-col items-center text-center p-4 rounded-md border transition-colors hover:border-blue-300 dark:hover:border-blue-700 ${link.color}`}
                        >
                            {link.icon}
                            <h3 className="font-medium mt-2">{link.title}</h3>
                            <p className="text-xs mt-1 opacity-80">{link.description}</p>
                        </a>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
} 