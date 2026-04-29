import type { Metadata } from "next";
import "./globals.css";
import ServiceWorkerRegistration from "@/src/components/shared/ServiceWorkerRegistration";

export const metadata: Metadata = {
  title: "Habit Tracker",
  description: "Track your daily habits",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#6366f1" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-gray-50 min-h-screen">
        <ServiceWorkerRegistration />
        {children}
      </body>
    </html>
  );
}
