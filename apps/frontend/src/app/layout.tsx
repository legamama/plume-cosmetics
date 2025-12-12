import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Plumé Cosmetics",
    template: "%s | Plumé Cosmetics",
  },
  description: "Nuôi dưỡng vẻ đẹp tự nhiên bằng sự tinh tế và khoa học.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
