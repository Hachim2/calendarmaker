"use client";

import { cn } from "@/lib/actions/utils";
import { IconLayoutNavbarCollapse } from "@tabler/icons-react";
import {
    AnimatePresence,
    MotionValue,
    motion,
    useMotionValue,
    useSpring,
    useTransform,
} from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";

export const FloatingDock = ({
    items,
    desktopClassName,
    mobileClassName,
}: {
    items: {
        title: string;
        icon: React.ReactNode;
        href: string;
        bgColor?: string;
        iconColor?: string;
        onClick?: () => void;
    }[];
    desktopClassName?: string;
    mobileClassName?: string;
}) => {
    return (
        <>
            <FloatingDockDesktop items={items} className={desktopClassName} />
            <FloatingDockMobile items={items} className={mobileClassName} />
        </>
    );
};

const FloatingDockMobile = ({
    items,
    className,
}: {
    items: {
        title: string;
        icon: React.ReactNode;
        href: string;
        bgColor?: string;
        iconColor?: string;
        onClick?: () => void;
    }[];
    className?: string;
}) => {
    const [open, setOpen] = useState(false);
    return (
        <div className={cn("relative block md:hidden", className)}>
            <AnimatePresence>
                {open && (
                    <motion.div
                        layoutId="nav"
                        className="absolute bottom-full mb-2 inset-x-0 flex flex-col gap-2"
                    >
                        {items.map((item, idx) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                exit={{
                                    opacity: 0,
                                    y: 10,
                                    transition: {
                                        delay: idx * 0.05,
                                    },
                                }}
                                transition={{ delay: (items.length - 1 - idx) * 0.05 }}
                            >
                                {item.onClick ? (
                                    <button
                                        onClick={item.onClick}
                                        className={cn(
                                            "h-12 w-12 rounded-[5px] flex items-center justify-center p-0",
                                            item.bgColor || "bg-white dark:bg-white",
                                            item.iconColor || "text-black dark:text-black"
                                        )}
                                    >
                                        <div className="h-full w-full">{item.icon}</div>
                                    </button>
                                ) : (
                                    <Link
                                        href={item.href}
                                        key={item.title}
                                        className={cn(
                                            "h-12 w-12 rounded-[5px] flex items-center justify-center p-0",
                                            item.bgColor || "bg-white dark:bg-white",
                                            item.iconColor || "text-black dark:text-black"
                                        )}
                                    >
                                        <div className="h-full w-full">{item.icon}</div>
                                    </Link>
                                )}
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
            <button
                onClick={() => setOpen(!open)}
                className="h-12 w-12 rounded-[5px] bg-white dark:bg-white flex items-center justify-center text-black dark:text-black p-0"
            >
                <IconLayoutNavbarCollapse className="h-full w-full" />
            </button>
        </div>
    );
};

const FloatingDockDesktop = ({
    items,
    className,
}: {
    items: {
        title: string;
        icon: React.ReactNode;
        href: string;
        bgColor?: string;
        iconColor?: string;
        onClick?: () => void;
    }[];
    className?: string;
}) => {
    const mouseX = useMotionValue(Infinity);
    return (
        <motion.div
            onMouseMove={(e: React.MouseEvent) => mouseX.set(e.pageX)}
            onMouseLeave={() => mouseX.set(Infinity)}
            className={cn(
                "mx-auto hidden md:flex h-16 w-auto min-w-[280px] gap-2 items-center justify-center rounded-[5px] bg-bw dark:bg-bw px-2 py-2",
                className
            )}
        >
            {items.map((item) => (
                <IconContainer mouseX={mouseX} key={item.title} {...item} />
            ))}
        </motion.div>
    );
};

function IconContainer({
    mouseX,
    title,
    icon,
    href,
    bgColor,
    iconColor,
    onClick,
}: {
    mouseX: MotionValue;
    title: string;
    icon: React.ReactNode;
    href: string;
    bgColor?: string;
    iconColor?: string;
    onClick?: () => void;
}) {
    const ref = useRef<HTMLDivElement>(null);

    const distance = useTransform(mouseX, (val: number) => {
        const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };

        return val - bounds.x - bounds.width / 2;
    });

    const widthTransform = useTransform(distance, [-150, 0, 150], [48, 60, 48]);
    const heightTransform = useTransform(distance, [-150, 0, 150], [48, 60, 48]);

    // Check if this is the Edupro icon by title
    const isEdupro = title === "Edupro";

    // Use larger values for the Edupro icon
    const widthTransformIcon = useTransform(
        distance,
        [-150, 0, 150],
        isEdupro ? [47, 56, 47] : [36, 45, 36]
    );
    const heightTransformIcon = useTransform(
        distance,
        [-150, 0, 150],
        isEdupro ? [47, 56, 47] : [36, 45, 36]
    );

    const width = useSpring(widthTransform, {
        mass: 0.1,
        stiffness: 150,
        damping: 12,
    });
    const height = useSpring(heightTransform, {
        mass: 0.1,
        stiffness: 150,
        damping: 12,
    });

    const widthIcon = useSpring(widthTransformIcon, {
        mass: 0.1,
        stiffness: 150,
        damping: 12,
    });
    const heightIcon = useSpring(heightTransformIcon, {
        mass: 0.1,
        stiffness: 150,
        damping: 12,
    });

    const [hovered, setHovered] = useState(false);

    // All icons use the same container now
    if (onClick) {
        return (
            <button
                onClick={onClick}
                type="button"
            >
                <motion.div
                    ref={ref}
                    style={{ width, height }}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    className={cn(
                        "aspect-square rounded-[5px] flex items-center justify-center relative p-0",
                        bgColor || "bg-gray-100 dark:bg-gray-100",
                        iconColor || "text-black dark:text-black"
                    )}
                >
                    <AnimatePresence>
                        {hovered && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, x: "-50%" }}
                                animate={{ opacity: 1, y: 0, x: "-50%" }}
                                exit={{ opacity: 0, y: 2, x: "-50%" }}
                                className="px-2 py-0.5 whitespace-pre rounded-[5px] bg-white border dark:bg-bw dark:border-border dark:text-text border-gray-200 text-black absolute left-1/2 -translate-x-1/2 -top-8 w-fit text-xs"
                            >
                                {title}
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <motion.div
                        style={{ width: widthIcon, height: heightIcon }}
                        className="flex items-center justify-center w-full h-full"
                    >
                        {icon}
                    </motion.div>
                </motion.div>
            </button>
        );
    }

    return (
        <Link href={href}>
            <motion.div
                ref={ref}
                style={{ width, height }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className={cn(
                    "aspect-square rounded-[5px] flex items-center justify-center relative p-0",
                    bgColor || "bg-gray-100 dark:bg-gray-100",
                    iconColor || "text-black dark:text-black"
                )}
            >
                <AnimatePresence>
                    {hovered && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, x: "-50%" }}
                            animate={{ opacity: 1, y: 0, x: "-50%" }}
                            exit={{ opacity: 0, y: 2, x: "-50%" }}
                            className="px-2 py-0.5 whitespace-pre rounded-[5px] bg-white border dark:bg-bw dark:border-border dark:text-text border-gray-200 text-black absolute left-1/2 -translate-x-1/2 -top-8 w-fit text-xs"
                        >
                            {title}
                        </motion.div>
                    )}
                </AnimatePresence>
                <motion.div
                    style={{ width: widthIcon, height: heightIcon }}
                    className="flex items-center justify-center w-full h-full"
                >
                    {icon}
                </motion.div>
            </motion.div>
        </Link>
    );
}
