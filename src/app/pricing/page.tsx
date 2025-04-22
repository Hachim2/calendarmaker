"use client"

import { Navbar } from "@/components/layout/navbar"
import { Check, SquarePercent } from "lucide-react"

export default function PricingPage() {
    return (
        <div className="relative min-h-screen bg-bg text-text overflow-hidden">
            <div className="container mx-auto px-4 py-4 pt-8 md:py-6 md:pt-12 mb-24 relative">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center mb-8">
                        <div className="w-12 h-12 rounded-[5px] flex items-center justify-center bg-iconBg-pricing dark:bg-darkIconBg-pricing mr-4">
                            <SquarePercent className="h-6 w-6 text-iconColor-pricing dark:text-darkIconColor-pricing" />
                        </div>
                        <h1 className="text-4xl font-heading">Pricing</h1>
                    </div>

                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl font-heading mb-4 text-text">Choose the right plan for you</h2>
                        <p className="text-text/70 max-w-2xl mx-auto">
                            Whether you&apos;re just getting started or need advanced features, we have a plan that fits your needs.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {pricingPlans.map((plan, index) => (
                            <div
                                key={index}
                                className={`border border-border rounded-base p-8 hover:shadow-shadow transition-all duration-300 bg-bw ${plan.popular ? 'ring-2 ring-iconColor-pricing dark:ring-darkIconColor-pricing relative' : ''
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-iconBg-pricing dark:bg-darkIconBg-pricing text-iconColor-pricing dark:text-darkIconColor-pricing text-xs font-bold py-1 px-3 rounded-[5px]">
                                        MOST POPULAR
                                    </div>
                                )}
                                <div className="mb-6">
                                    <h3 className="text-xl font-heading mb-2 text-text">{plan.name}</h3>
                                    <p className="text-sm text-text/70">{plan.description}</p>
                                </div>
                                <div className="mb-6">
                                    <span className="text-3xl font-heading text-text">${plan.price}</span>
                                    <span className="text-text/70">/month</span>
                                </div>
                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start">
                                            <Check className="h-5 w-5 text-iconColor-pricing dark:text-darkIconColor-pricing mr-2 flex-shrink-0 mt-0.5" />
                                            <span className="text-sm text-text">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <button className={`w-full py-2 px-4 rounded-base font-base transition-colors ${plan.popular
                                    ? 'bg-iconColor-pricing dark:bg-darkIconColor-pricing text-white hover:bg-opacity-90'
                                    : 'border border-border hover:bg-iconBg-pricing dark:hover:bg-darkIconBg-pricing text-text'
                                    }`}>
                                    Get Started
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <Navbar />
        </div>
    )
}

const pricingPlans = [
    {
        name: "Basic",
        description: "Perfect for personal use",
        price: 0,
        popular: false,
        features: [
            "Basic browsing features",
            "Standard privacy protection",
            "1 device",
            "Community support"
        ]
    },
    {
        name: "Pro",
        description: "For power users and professionals",
        price: 9.99,
        popular: true,
        features: [
            "Advanced browsing features",
            "Enhanced privacy protection",
            "Up to 3 devices",
            "Priority support",
            "No ads",
            "Custom themes"
        ]
    },
    {
        name: "Enterprise",
        description: "For teams and organizations",
        price: 19.99,
        popular: false,
        features: [
            "All Pro features",
            "Unlimited devices",
            "Team management",
            "Dedicated support",
            "Advanced security",
            "Custom integrations",
            "Usage analytics"
        ]
    }
] 