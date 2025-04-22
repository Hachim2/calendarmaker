import { Metadata } from "next";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/sidebar/dashboard-sidebar";

export const metadata: Metadata = {
    title: "Dashboard | Edupro Calendar",
    description: "Edupro calendar management dashboard",
};

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <SidebarProvider defaultOpen={true}>
            <div className="flex h-screen overflow-hidden bg-background">
                {/* Custom dashboard sidebar */}
                <DashboardSidebar className="border-r border-border" />

                <div className="flex-1 overflow-auto">
                    {/* Main content area */}
                    <main className="p-6">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
} 