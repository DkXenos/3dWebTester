import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  title: "StudyNest — Your Digital Sanctuary",
  description: "A premium 3D study ecosystem for focused learning, GPA tracking, and AI-powered companionship.",
  keywords: ["study", "focus", "pomodoro", "GPA", "IPK", "AI companion", "productivity"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="noise-overlay">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
