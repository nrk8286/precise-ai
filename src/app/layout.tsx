import "./globals.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import LayoutWrapper from './LayoutWrapper';

// eslint-disable-next-line @typescript-eslint/no-require-imports
require("@solana/wallet-adapter-react-ui/styles.css");

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Palms AI",
    description: "GPT trade assistant in the palm of your hand.",
};

// eslint-disable-next-line
export default async function RootLayout({ children }: any) {

    return (
        <LayoutWrapper >
            <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
            <main className={`min-h-screen`}>
                {children}
            </main>
            </body>
            </html>
        </LayoutWrapper>

    );
}
