import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "АвтоСнаб — Заказ товаров",
  description: "Платформа для заказа товаров заведениями",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={cn("h-full", "font-sans", geist.variable)}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
