import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GiftPilot — thoughtful gift ideas, made easier",
  description: "Discover personalized gift ideas and find them at Saudi shopping stores.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
