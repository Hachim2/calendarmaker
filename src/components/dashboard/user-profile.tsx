"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Edit, Mail, Phone } from "lucide-react";

export interface UserProfileProps {
    user: {
        name: string;
        email: string;
        phone?: string;
        role: string;
        avatar?: string;
        initials: string;
    };
}

export function UserProfile({ user }: UserProfileProps) {
    return (
        <Card className="border-blue-100 dark:border-blue-900">
            <CardHeader className="pb-3 border-b border-blue-50 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/20">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl text-blue-700 dark:text-blue-300">Profile</CardTitle>
                    <Button size="sm" variant="outline" className="text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                        <Edit className="h-3.5 w-3.5 mr-1.5" />
                        Edit
                    </Button>
                </div>
                <CardDescription className="text-blue-600/70 dark:text-blue-400/70">
                    Your personal information
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="flex flex-col items-center space-y-4">
                    <Avatar className="h-20 w-20 border-2 border-blue-100 dark:border-blue-900">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 text-xl">
                            {user.initials}
                        </AvatarFallback>
                    </Avatar>

                    <div className="text-center">
                        <h3 className="font-medium text-lg text-blue-700 dark:text-blue-300">{user.name}</h3>
                        <p className="text-sm text-blue-600/70 dark:text-blue-400/70">{user.role}</p>
                    </div>

                    <div className="w-full space-y-3 pt-2">
                        <div className="flex items-center gap-3 p-2 rounded-md border border-blue-100 dark:border-blue-900/50">
                            <Mail className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                            <span className="text-sm text-blue-600 dark:text-blue-300">{user.email}</span>
                        </div>

                        {user.phone && (
                            <div className="flex items-center gap-3 p-2 rounded-md border border-blue-100 dark:border-blue-900/50">
                                <Phone className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                                <span className="text-sm text-blue-600 dark:text-blue-300">{user.phone}</span>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 