"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Bell,
    Calendar as CalendarIcon,
    Check,
    Download,
    MoreHorizontal,
    Plus,
    Save,
    Share
} from "lucide-react";

export default function CalendarMakerPage() {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [selectedTemplate, setSelectedTemplate] = useState("k12");

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-blue-700 dark:text-blue-300">Calendar Maker</h1>
                <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                        <Bell className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">Notifications</span>
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="h-4 w-4 mr-1" />
                        <span>New Calendar</span>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-blue-100 dark:border-blue-900">
                        <CardHeader className="pb-3 border-b border-blue-50 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/20">
                            <CardTitle className="text-xl text-blue-700 dark:text-blue-300">
                                Calendar Configuration
                            </CardTitle>
                            <CardDescription className="text-blue-600/70 dark:text-blue-400/70">
                                Configure your academic calendar settings
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <Tabs defaultValue="general" className="space-y-6">
                                <TabsList className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900">
                                    <TabsTrigger value="general" className="data-[state=active]:bg-white dark:data-[state=active]:bg-blue-800 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-200">
                                        General
                                    </TabsTrigger>
                                    <TabsTrigger value="dates" className="data-[state=active]:bg-white dark:data-[state=active]:bg-blue-800 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-200">
                                        School Dates
                                    </TabsTrigger>
                                    <TabsTrigger value="terms" className="data-[state=active]:bg-white dark:data-[state=active]:bg-blue-800 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-200">
                                        Terms
                                    </TabsTrigger>
                                    <TabsTrigger value="events" className="data-[state=active]:bg-white dark:data-[state=active]:bg-blue-800 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-200">
                                        Events
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="general" className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="calendar-name" className="text-blue-700 dark:text-blue-300">Calendar Name</Label>
                                            <Input
                                                id="calendar-name"
                                                placeholder="2023-2024 Academic Year"
                                                className="border-blue-200 dark:border-blue-800 focus-visible:ring-blue-500"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="template" className="text-blue-700 dark:text-blue-300">Calendar Template</Label>
                                            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                                                <SelectTrigger id="template" className="border-blue-200 dark:border-blue-800">
                                                    <SelectValue placeholder="Select a template" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="k12">K-12 School</SelectItem>
                                                    <SelectItem value="college">College/University</SelectItem>
                                                    <SelectItem value="district">School District</SelectItem>
                                                    <SelectItem value="custom">Custom</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="start-date" className="text-blue-700 dark:text-blue-300">Academic Year Start</Label>
                                            <Input
                                                id="start-date"
                                                type="date"
                                                defaultValue="2023-08-15"
                                                className="border-blue-200 dark:border-blue-800 focus-visible:ring-blue-500"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="end-date" className="text-blue-700 dark:text-blue-300">Academic Year End</Label>
                                            <Input
                                                id="end-date"
                                                type="date"
                                                defaultValue="2024-06-15"
                                                className="border-blue-200 dark:border-blue-800 focus-visible:ring-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4 flex justify-end gap-2">
                                        <Button variant="outline" className="text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                                            Cancel
                                        </Button>
                                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                            <Save className="h-4 w-4 mr-1" />
                                            Save
                                        </Button>
                                    </div>
                                </TabsContent>

                                <TabsContent value="dates">
                                    <div className="text-blue-600 dark:text-blue-300 text-center py-8">
                                        Configure school year start/end dates and holidays
                                    </div>
                                </TabsContent>

                                <TabsContent value="terms">
                                    <div className="text-blue-600 dark:text-blue-300 text-center py-8">
                                        Define semesters, quarters, or custom terms
                                    </div>
                                </TabsContent>

                                <TabsContent value="events">
                                    <div className="text-blue-600 dark:text-blue-300 text-center py-8">
                                        Add special events, testing dates, and other important days
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>

                    <Card className="border-blue-100 dark:border-blue-900">
                        <CardHeader className="pb-3 border-b border-blue-50 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/20">
                            <CardTitle className="text-xl text-blue-700 dark:text-blue-300">
                                Calendar Preview
                            </CardTitle>
                            <CardDescription className="text-blue-600/70 dark:text-blue-400/70">
                                Preview your calendar as you build it
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="flex flex-col space-y-4">
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={setSelectedDate}
                                    className="rounded-md border border-blue-100 dark:border-blue-900 mx-auto"
                                />

                                <div className="flex justify-end gap-2 pt-4">
                                    <Button variant="outline" className="text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                                        <Share className="h-4 w-4 mr-1" />
                                        Share
                                    </Button>
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                        <Download className="h-4 w-4 mr-1" />
                                        Export
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="border-blue-100 dark:border-blue-900">
                        <CardHeader className="pb-3 border-b border-blue-50 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/20">
                            <CardTitle className="text-xl text-blue-700 dark:text-blue-300">
                                Templates
                            </CardTitle>
                            <CardDescription className="text-blue-600/70 dark:text-blue-400/70">
                                Start from a pre-built template
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-3">
                                {["K-12 Standard", "College Semester", "Quarter System", "Year-Round"].map((template, i) => (
                                    <div
                                        key={i}
                                        className="p-3 rounded-md border border-blue-100 dark:border-blue-900/50 flex items-center justify-between hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-md">
                                                <CalendarIcon className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                                            </div>
                                            <span className="font-medium text-blue-700 dark:text-blue-300">{template}</span>
                                        </div>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                            <MoreHorizontal className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-blue-100 dark:border-blue-900">
                        <CardHeader className="pb-3 border-b border-blue-50 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/20">
                            <CardTitle className="text-xl text-blue-700 dark:text-blue-300">
                                Recent Calendars
                            </CardTitle>
                            <CardDescription className="text-blue-600/70 dark:text-blue-400/70">
                                Your recently created calendars
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-3">
                                {["2023-2024 Academic Year", "Summer School 2023", "Staff Development Days"].map((calendar, i) => (
                                    <div
                                        key={i}
                                        className="p-3 rounded-md border border-blue-100 dark:border-blue-900/50 flex items-center justify-between hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-colors"
                                    >
                                        <div>
                                            <h4 className="font-medium text-blue-700 dark:text-blue-300">{calendar}</h4>
                                            <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-1">
                                                Last edited on May 10, 2023
                                            </p>
                                        </div>
                                        {i === 0 && (
                                            <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-1">
                                                <Check className="h-3 w-3 text-blue-600 dark:text-blue-300" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
} 