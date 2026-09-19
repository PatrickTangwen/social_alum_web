import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Join the Career Explorer | Yale SOM Career Development Office",
  description:
    "Yale SOM and YSE alumni working in social impact can add themselves to the Career Explorer.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
