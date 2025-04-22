'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    Calendar,
    Home,
    Settings,
    Users,
    BookOpen,
    FileText,
    BarChart2,
    Mail,
    HelpCircle,
} from 'lucide-react';

interface SidebarProps {
    className?: string;
}

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname();

    const navItems = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: Home,
        },
        {
            title: 'Calendar',
            href: '/calendar-maker',
            icon: Calendar,
        },
        {
            title: 'Students',
            href: '/students',
            icon: Users,
        },
        {
            title: 'Courses',
            href: '/courses',
            icon: BookOpen,
        },
        {
            title: 'Documents',
            href: '/documents',
            icon: FileText,
        },
        {
            title: 'Reports',
            href: '/reports',
            icon: BarChart2,
        },
        {
            title: 'Messages',
            href: '/messages',
            icon: Mail,
        },
        {
            title: 'Help',
            href: '/help',
            icon: HelpCircle,
        },
        {
            title: 'Settings',
            href: '/settings',
            icon: Settings,
        },
    ];

    return (
        <div className={cn("h-full w-[250px] border-r bg-background p-4 pt-8 hidden md:block", className)}>
            <div className="flex flex-col h-full">
                <div className="px-3 py-2">
                    <h2 className="mb-2 text-lg font-semibold tracking-tight">
                        Edupro
                    </h2>
                </div>
                <div className="flex-1">
                    <nav className="grid gap-1 px-2 group">
                        {navItems.map((item, index) => {
                            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

                            return (
                                <Link
                                    key={index}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent",
                                        isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                                    )}
                                >
                                    <item.icon className="h-4 w-4" />
                                    <span>{item.title}</span>
                                    {item.title === 'Calendar' && (
                                        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                                            New
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
                <div className="mt-auto">
                    <div className="rounded-lg border bg-card text-card-foreground p-4">
                        <h3 className="text-sm font-semibold">Need Help?</h3>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Check our documentation or contact support for assistance.
                        </p>
                        <Link
                            href="/docs"
                            className="mt-2 inline-flex h-8 items-center rounded-md px-3 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            View Documentation
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
} 