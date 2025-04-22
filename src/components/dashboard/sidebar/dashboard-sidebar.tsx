"use client"

import * as React from "react"
import {
    Calendar,
    CalendarDays,
    BookOpen,
    Settings,
    Users,
    GraduationCap,
    PieChart,
    SquareTerminal
} from "lucide-react"

import { NavMain } from "@/components/dashboard/sidebar/nav-main"
import { NavProjects } from "@/components/dashboard/sidebar/nav-projects"
import { NavUser } from "@/components/dashboard/sidebar/nav-user"
import { TeamSwitcher } from "@/components/dashboard/sidebar/team-switcher"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"

// Calendar-specific sidebar data
const dashboardData = {
    user: {
        name: "Admin User",
        email: "admin@edupro.run",
        avatar: "/avatars/user.jpg",
    },
    teams: [
        {
            name: "Edupro Calendar",
            logo: CalendarDays,
            plan: "Education",
        },
        {
            name: "School Admin",
            logo: GraduationCap,
            plan: "Institution",
        },
    ],
    navMain: [
        {
            title: "Calendar",
            url: "/dashboard",
            icon: Calendar,
            isActive: true,
            items: [
                {
                    title: "Dashboard",
                    url: "/dashboard",
                },
                {
                    title: "Calendar Maker",
                    url: "/dashboard/calendar-maker",
                },
                {
                    title: "Templates",
                    url: "/dashboard/calendar-maker/templates",
                },
            ],
        },
        {
            title: "Students",
            url: "/students",
            icon: Users,
            items: [
                {
                    title: "Enrollment",
                    url: "/students/enrollment",
                },
                {
                    title: "Schedules",
                    url: "/students/schedules",
                },
                {
                    title: "Attendance",
                    url: "/students/attendance",
                },
            ],
        },
        {
            title: "Documentation",
            url: "/docs",
            icon: BookOpen,
            items: [
                {
                    title: "User Guide",
                    url: "/docs/guide",
                },
                {
                    title: "Tutorials",
                    url: "/docs/tutorials",
                },
                {
                    title: "API Reference",
                    url: "/docs/api",
                },
            ],
        },
        {
            title: "Settings",
            url: "/settings",
            icon: Settings,
            items: [
                {
                    title: "Account",
                    url: "/settings/account",
                },
                {
                    title: "Preferences",
                    url: "/settings/preferences",
                },
                {
                    title: "Notifications",
                    url: "/settings/notifications",
                },
            ],
        },
    ],
    projects: [
        {
            name: "Academic Calendar",
            url: "/projects/academic",
            icon: CalendarDays,
        },
        {
            name: "Class Schedules",
            url: "/projects/classes",
            icon: PieChart,
        },
        {
            name: "Event Planning",
            url: "/projects/events",
            icon: SquareTerminal,
        },
    ],
}

export function DashboardSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={dashboardData.teams} />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={dashboardData.navMain} />
                <NavProjects projects={dashboardData.projects} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={dashboardData.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
} 