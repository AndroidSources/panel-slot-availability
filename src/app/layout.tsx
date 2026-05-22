import type { Metadata } from "next";
import "../styles/index.css";

export const metadata: Metadata = {
  title: "Interview Panel Booking Platform",
  description: "Interview panel booking and utilization dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
