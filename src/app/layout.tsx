import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/common/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Edupro - Agentic Browser",
  description: "Edupro is a calendar maker for schools powered by AI.",
  keywords: ["calendar", "ai", "ai-calendar", "tool", "school-calendar", "calendrier", "ecole", "college", "high-school", "lycee", "calendrier scolaire"],
  authors: [{ name: "Hachim Diop" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://edupro.com",
    title: "Edupro - School Calendar Maker",
    description: "Edupro is a calendar maker for schools powered by AI.",
    siteName: "Edupro",
  },
  twitter: {
    card: "summary_large_image",
    title: "Edupro - AI School Calendar Maker",
    description: "Edupro is a calendar maker for schools powered by AI.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
