"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check } from "lucide-react"

// Simple theme hook
const useTheme = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        // Check if user has explicitly set a theme preference
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'dark') {
            setTheme('dark');
            document.documentElement.classList.add('dark');
        } else {
            setTheme('light');
            document.documentElement.classList.remove('dark');
        }
    }, []);

    return { theme };
};

const COOKIE_CONSENT_KEY = "cookie-consent-status"

function getCookieConsentStatus() {
    if (typeof window !== "undefined") {
        return localStorage.getItem(COOKIE_CONSENT_KEY)
    }
    return null
}

function setCookieConsentStatus(status: string) {
    if (typeof window !== "undefined") {
        localStorage.setItem(COOKIE_CONSENT_KEY, status)
    }
}

export default function CookieConsent() {
    const { theme } = useTheme()
    const [isVisible, setIsVisible] = useState(false)
    const [showAnimation, setShowAnimation] = useState(false)
    const [animationType, setAnimationType] = useState<"accept" | "decline" | null>(null)
    const footerRef = useRef<HTMLElement | null>(null)
    const hasCheckedConsent = useRef(false)
    const initialLoadRef = useRef(true)

    useEffect(() => {
        // Find the footer element
        footerRef.current = document.querySelector("footer") || document.querySelector("[class*='Footer']")

        const status = getCookieConsentStatus()
        // Only show if consent hasn't been given yet
        if (status === null) {
            hasCheckedConsent.current = true
            // Don't set to true initially - wait for scroll
            setIsVisible(false)
        } else {
            // If consent was already given, don't show the banner
            setIsVisible(false)
        }

        const handleScroll = () => {
            if (!hasCheckedConsent.current) return
            if (!footerRef.current) return

            // After initial load, allow the cookie to be shown based on scroll
            if (initialLoadRef.current) {
                initialLoadRef.current = false
                return
            }

            const footerRect = footerRef.current.getBoundingClientRect()
            const windowHeight = window.innerHeight

            // Show when footer is in view (or close to being in view)
            if (footerRect.top < windowHeight + 200) {
                setIsVisible(true)
            } else {
                setIsVisible(false)
            }
        }

        // Initial check - but with a delay to prevent immediate showing
        setTimeout(handleScroll, 1000)

        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const handleAccept = () => {
        setAnimationType("accept")
        setShowAnimation(true)

        // Delay hiding the component to allow animation to complete
        setTimeout(() => {
            setCookieConsentStatus("accepted")
            setIsVisible(false)
            setShowAnimation(false)
            // Here you would typically initialize your tracking code
            console.log("Tracking cookies accepted")
        }, 800) // Faster animation
    }

    const handleDecline = () => {
        setAnimationType("decline")
        setShowAnimation(true)

        // Delay hiding the component to allow animation to complete - much faster for decline
        setTimeout(() => {
            setCookieConsentStatus("declined")
            setIsVisible(false)
            setShowAnimation(false)
            console.log("Tracking cookies declined")
        }, 300) // Very fast disappearance
    }

    if (!isVisible) return null

    return (
        <AnimatePresence>
            <motion.div
                className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 z-50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
            >
                <motion.div
                    className="w-full md:w-[340px] overflow-hidden flex justify-end"
                    animate={{
                        width: showAnimation && animationType === "accept" ? "40px" : "100%",
                        height: showAnimation && animationType === "accept" ? "40px" : "auto",
                        backgroundColor: showAnimation && animationType === "accept"
                            ? theme === 'light' ? 'rgb(59, 130, 246)' : 'rgb(34, 197, 94)'
                            : 'rgba(255, 255, 255, 0.95)',
                        borderRadius: showAnimation && animationType === "accept" ? "50%" : "6px",
                        opacity: showAnimation && animationType === "decline" ? 0 : 1,
                        marginRight: showAnimation && animationType === "accept" ? "8px" : "0px"
                    }}
                    transition={{
                        duration: animationType === "accept" ? 0.5 : 0.2,
                        ease: "easeInOut"
                    }}
                    style={{ borderRadius: "6px", border: "2px solid black" }}
                >
                    <motion.div
                        className="px-5 py-4 relative overflow-hidden w-full"
                        animate={{
                            padding: showAnimation && animationType === "accept" ? "0px" : "20px",
                            borderRadius: showAnimation && animationType === "accept" ? "50%" : "6px",
                        }}
                        transition={{ duration: 0.5 }}
                    >
                        {showAnimation && animationType === "accept" && (
                            <motion.div
                                className="absolute inset-0 flex items-center justify-center"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Check className="text-white h-5 w-5" />
                            </motion.div>
                        )}

                        <motion.div
                            animate={{
                                opacity: showAnimation ? 0 : 1,
                                scale: showAnimation && animationType === "accept" ? 0.5 : 1
                            }}
                            transition={{ duration: 0.2 }}
                        >
                            <p className="mb-3 text-black text-sm text-left font-medium">
                                We use tracking cookies to understand how you use the product and help us improve it.
                            </p>
                            <div className="flex gap-4">
                                <button
                                    onClick={handleAccept}
                                    className="text-black text-sm hover:text-gray-700 transition-colors font-bold"
                                >
                                    Accept
                                </button>
                                <button
                                    onClick={handleDecline}
                                    className="text-gray-600 text-sm hover:text-gray-800 transition-colors"
                                >
                                    Decline
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
