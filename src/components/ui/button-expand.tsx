import { ArrowRight, LucideIcon, Phone, ArrowLeft, BookOpen, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/actions/utils"
import Image from "next/image"
import { useState } from "react"

interface ButtonExpandProps {
    text: string;
    icon?: LucideIcon;
    bgColor?: string;
    textColor?: string;
    hoverBgColor?: string;
    hoverTextColor?: string;
    onClick?: () => void;
    className?: string;
    iconPlacement?: 'left' | 'right';
    type?: 'button' | 'submit' | 'reset';
    expandOnHover?: boolean;
}

function ButtonExpand({
    text,
    icon: Icon = ArrowRight,
    bgColor = "bg-green-50 dark:bg-green-900/30",
    textColor = "text-green-700 dark:text-green-300",
    hoverBgColor = "hover:bg-green-100 dark:hover:bg-green-900/40",
    hoverTextColor = "hover:text-green-800 dark:hover:text-green-800",
    onClick,
    className,
    iconPlacement = 'right',
    type = 'button',
    expandOnHover = false
}: ButtonExpandProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Button
            type={type}
            variant="outline"
            className={cn(
                `text-lg sm:text-base font-medium ${textColor} ${hoverTextColor} ${bgColor} ${hoverBgColor} shadow-shadow transition-all duration-300 h-[60px] sm:h-12 px-[32px] sm:px-4 focus:outline-none focus-visible:outline-none flex items-center`,
                className
            )}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {iconPlacement === 'left' && <Icon className="h-6 w-6 mr-2" />}
            <span>{text}</span>
            {iconPlacement === 'right' && (
                expandOnHover ? (
                    <span className={`overflow-hidden transition-all duration-300 flex items-center ${isHovered ? 'w-8 ml-2 opacity-100' : 'w-0 opacity-0'}`}>
                        <Icon className="h-6 w-6" />
                    </span>
                ) : (
                    <Icon className="h-6 w-6 ml-2" />
                )
            )}
        </Button>
    )
}

// Pre-configured button for Connect action
function ButtonExpandIconRight() {
    return (
        <ButtonExpand
            text="Connect"
            expandOnHover={true}
            onClick={() => window.location.href = '/sign-in'}
        />
    )
}

// Pre-configured button for Talk to us action
function ButtonExpandTalkToUs() {
    return (
        <ButtonExpand
            text="Talk to us"
            icon={Phone}
            bgColor="bg-blue-50 dark:bg-blue-900/30"
            textColor="text-blue-700 dark:text-blue-300"
            hoverBgColor="hover:bg-blue-100 dark:hover:bg-blue-900/40"
            hoverTextColor="hover:text-blue-800 dark:hover:text-blue-800"
            expandOnHover={true}
            onClick={() => window.open('https://cal.com/babacar-diop-umkvq2/30min', '_blank')}
        />
    )
}

// Back button with specific styling
function ButtonExpandBack({ onClick, text }: { onClick?: () => void, text: string }) {
    return (
        <ButtonExpand
            text={text}
            icon={ArrowLeft}
            iconPlacement="left"
            bgColor="bg-zinc-900/90 dark:bg-black/50"
            textColor="text-zinc-100 dark:text-sage-100"
            hoverTextColor="hover:text-black dark:hover:text-gray-800"
            hoverBgColor="hover:bg-zinc-900"
            className="relative z-20 inline-flex items-center transition-colors px-4 py-2 rounded-none border-zinc-800 border w-fit shadow-none backdrop-blur-sm"
            onClick={onClick}
        />
    )
}

// Pre-configured button for Dashboard
function ButtonExpandDocs() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Button
            variant="outline"
            className={cn(
                "text-lg sm:text-base font-heading text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-base shadow-md transition-all duration-300 h-[60px] sm:h-12 px-[32px] sm:px-4 focus:outline-none focus-visible:outline-none hover:translate-y-[-2px] hover:shadow-none group flex items-center"
            )}
            onClick={() => window.location.href = '/dashboard'}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <span>Dashboard</span>
            <span className={`overflow-hidden transition-all duration-300 flex items-center ${isHovered ? 'w-6 ml-2 opacity-100' : 'w-0 opacity-0'}`}>
                <Calendar className="h-5 w-5" />
            </span>
        </Button>
    )
}

// Pre-configured button for Calendar Maker
function ButtonExpandBrowser() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Button
            variant="outline"
            className={cn(
                "text-lg sm:text-base font-heading text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-900/20 border-2 border-teal-200 dark:border-teal-800 rounded-base shadow-md transition-all duration-300 h-[60px] sm:h-12 px-[32px] sm:px-4 focus:outline-none focus-visible:outline-none hover:translate-y-[-2px] hover:shadow-none group flex items-center justify-center"
            )}
            onClick={() => window.location.href = '/calendar-maker'}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <span>Calendar Maker</span>
            <div className={`overflow-hidden transition-all duration-300 flex items-center justify-center ${isHovered ? 'w-6 ml-2 opacity-100' : 'w-0 opacity-0'}`}>
                <Calendar className="h-5 w-5" />
            </div>
        </Button>
    )
}

export {
    ButtonExpand,
    ButtonExpandIconRight,
    ButtonExpandTalkToUs,
    ButtonExpandBack,
    ButtonExpandDocs,
    ButtonExpandBrowser
} 