import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flex Living - Reviews Dashboard",
  description: "Review management system for Flex Living properties",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
