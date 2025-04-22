"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export function TopBanner() {
    const pathname = usePathname()
    const [isHovered, setIsHovered] = useState(false)

    // Only show on landing page
    if (pathname !== '/') return null

    return (
        <div className={`absolute top-0 left-0 right-0 z-[100] w-full transition-all duration-300 ${isHovered ? 'bg-gradient-to-r from-iconBg-home/30 to-iconBg-browser/30 dark:from-darkIconBg-home/30 dark:to-darkIconBg-browser/30' : 'bg-transparent'}`}>
            <Link
                href="https://www.producthunt.com/posts/edupro"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full transition-all duration-300 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="max-w-7xl mx-auto px-4 h-6 flex items-center justify-end">
                    <span className="text-xs text-black/80 dark:text-white/80 font-medium tracking-wide pointer-events-none transition-all duration-300">
                        We are live on Product Hunt | <span className="font-bold text-[#ff6b6b] dark:text-darkIconColor-browser">Support us!</span>
                    </span>
                </div>
            </Link>
        </div>
    )
} 