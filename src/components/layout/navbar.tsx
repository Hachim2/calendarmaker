"use client"

import { FloatingDock } from "@/components/ui/dock"
import { Home, Moon, Sun, Calendar, CalendarDays, Users, GraduationCap, HelpCircle } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import Image from "next/image"

export const Navbar = () => {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // After mounting, we have access to the theme
    useEffect(() => setMounted(true), [])

    const navItems = [
        {
            title: "Home",
            icon: <Home className="h-[75%] w-[75%]" />,
            href: "/",
            bgColor: "bg-blue-50 dark:bg-blue-900/20",
            iconColor: "text-blue-600 dark:text-blue-300"
        },
        {
            title: "Dashboard",
            icon: <CalendarDays className="h-[75%] w-[75%]" />,
            href: "/dashboard",
            bgColor: "bg-teal-50 dark:bg-teal-900/20",
            iconColor: "text-teal-600 dark:text-teal-300"
        },
        {
            title: "Calendar Maker",
            icon: <Calendar className="h-[75%] w-[75%]" />,
            href: "/calendar-maker",
            bgColor: "bg-amber-50 dark:bg-amber-900/20",
            iconColor: "text-amber-600 dark:text-amber-300"
        },
        {
            title: "Edupro",
            icon: (
                <div className="h-full w-full flex items-center justify-center overflow-hidden rounded-[5px]">
                    <Image
                        src={theme === 'dark' ? "/images/icon.png" : "/images/logo/potentiallogo.png"}
                        alt="Edupro Logo"
                        width={120}
                        height={120}
                        className="object-contain w-[130%] h-[130%]"
                        priority
                    />
                </div>
            ),
            href: "/",
            bgColor: "bg-slate-50 dark:bg-slate-900/20",
            iconColor: "text-slate-600 dark:text-slate-300"
        },
        {
            title: "Students",
            icon: <Users className="h-[75%] w-[75%]" />,
            href: "/students",
            bgColor: "bg-green-50 dark:bg-green-900/20",
            iconColor: "text-green-600 dark:text-green-300"
        },
        {
            title: "Courses",
            icon: <GraduationCap className="h-[75%] w-[75%]" />,
            href: "/courses",
            bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
            iconColor: "text-indigo-600 dark:text-indigo-300"
        },
        {
            title: "Help",
            icon: <HelpCircle className="h-[75%] w-[75%]" />,
            href: "/docs",
            bgColor: "bg-purple-50 dark:bg-purple-900/20",
            iconColor: "text-purple-600 dark:text-purple-300"
        },
        {
            title: mounted ? (theme === 'dark' ? 'Light Mode' : 'Dark Mode') : 'Toggle Theme',
            icon: mounted ? (
                theme === 'dark' ? (
                    <Sun className="h-[75%] w-[75%]" />
                ) : (
                    <Moon className="h-[75%] w-[75%]" />
                )
            ) : null,
            href: "#",
            bgColor: "bg-orange-50 dark:bg-orange-900/20",
            iconColor: "text-orange-600 dark:text-orange-300",
            onClick: () => setTheme(theme === 'dark' ? 'light' : 'dark')
        }
    ]

    return (
        <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 transform hidden md:block">
            <FloatingDock items={navItems} desktopClassName="border shadow-md rounded-lg bg-white dark:bg-slate-800" />
        </div>
    )
} 