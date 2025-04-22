"use client"

import { Navbar } from "@/components/layout/navbar"
import { BookOpen } from "lucide-react"

export default function DocsPage() {
    return (
        <div className="relative min-h-screen bg-bg text-text overflow-hidden">
            <div className="container mx-auto px-4 py-4 pt-8 md:py-6 md:pt-12 mb-24 relative">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center mb-8">
                        <div className="w-12 h-12 rounded-[5px] flex items-center justify-center bg-iconBg-docs dark:bg-darkIconBg-docs mr-4">
                            <BookOpen className="h-6 w-6 text-iconColor-docs dark:text-darkIconColor-docs" />
                        </div>
                        <h1 className="text-4xl font-heading">Documentation</h1>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        <div className="col-span-1 md:col-span-3">
                            <h2 className="text-2xl font-heading mb-4">Getting Started</h2>
                            <p className="text-text/70 mb-6">
                                Welcome to Edupro documentation. Here you&apos;ll find comprehensive guides and documentation to help you start working with Edupro as quickly as possible.
                            </p>
                        </div>

                        {docSections.map((section, index) => (
                            <div
                                key={index}
                                className="border border-border rounded-base p-6 hover:shadow-shadow transition-all duration-300 cursor-pointer bg-bw"
                            >
                                <h3 className="text-xl font-heading mb-3 text-text">{section.title}</h3>
                                <p className="text-text/70 mb-4">{section.description}</p>
                                <div className="flex items-center text-iconColor-docs dark:text-darkIconColor-docs font-medium">
                                    Read more →
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-border pt-8">
                        <h2 className="text-2xl font-heading mb-6 text-text">API Reference</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {apiEndpoints.map((endpoint, index) => (
                                <div
                                    key={index}
                                    className="border border-border rounded-base p-4 hover:bg-iconBg-docs/30 dark:hover:bg-darkIconBg-docs/30 transition-colors bg-bw"
                                >
                                    <div className="flex items-center mb-2">
                                        <span className="px-2 py-1 bg-iconBg-docs dark:bg-darkIconBg-docs text-iconColor-docs dark:text-darkIconColor-docs text-xs font-mono rounded-[5px] mr-2">
                                            {endpoint.method}
                                        </span>
                                        <span className="font-mono text-sm text-text">{endpoint.path}</span>
                                    </div>
                                    <p className="text-sm text-text/70">{endpoint.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <Navbar />
        </div>
    )
}

const docSections = [
    {
        title: "Installation",
        description: "Learn how to install and set up Edupro on your system."
    },
    {
        title: "Basic Usage",
        description: "Understand the core concepts and basic usage patterns."
    },
    {
        title: "Advanced Features",
        description: "Explore advanced features and capabilities of Edupro."
    },
    {
        title: "Browser Automation",
        description: "Learn how to automate web browsing tasks with Edupro."
    },
    {
        title: "AI Integration",
        description: "Integrate AI capabilities with your browsing workflows."
    },
    {
        title: "Troubleshooting",
        description: "Common issues and their solutions when working with Edupro."
    }
]

const apiEndpoints = [
    {
        method: "GET",
        path: "/api/browser/status",
        description: "Get the current status of the browser instance."
    },
    {
        method: "POST",
        path: "/api/browser/launch",
        description: "Launch a new browser instance with specified options."
    },
    {
        method: "POST",
        path: "/api/browser/navigate",
        description: "Navigate to a specified URL in the active browser."
    },
    {
        method: "GET",
        path: "/api/browser/screenshot",
        description: "Capture a screenshot of the current browser view."
    },
    {
        method: "POST",
        path: "/api/browser/execute",
        description: "Execute JavaScript code in the browser context."
    },
    {
        method: "DELETE",
        path: "/api/browser/close",
        description: "Close the active browser instance."
    }
] 