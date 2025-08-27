import type { Metadata } from "next";
import "./globals.css";
import { BoardProvider } from "@/contexts/BoardContext";
import { Inter } from "next/font/google";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Workspace Visual - Brainstorm & Referências",
  description: "Um workspace visual para brainstorming e organização de referências",
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="pt-br">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={`antialiased ${inter.variable}`}>
        <BoardProvider>
          {children}
        </BoardProvider>
      </body>
    </html>
  );
}
