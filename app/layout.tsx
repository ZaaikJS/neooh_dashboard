import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import logoWhite from '@/assets/images/logo-white.svg'

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-[#352585] to-[#880a7b] bg-fixed`}
        >
        <Link href="/panel">
            <Image
                src={logoWhite}
                alt="Logo"
                height={40}
                className={"absolute top-10 left-10"}
            />
        </Link>
        {children}
        </body>
        </html>
    );
}
