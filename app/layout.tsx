"use client";

import React, {useEffect} from "react";
import {SessionProvider, useSession} from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import logoWhite from "@/assets/images/logo-white.svg";
import {Geist, Geist_Mono} from "next/font/google";
import "../app/globals.css";
import {Toaster} from "react-hot-toast";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-[#352585] to-[#880a7b] bg-fixed`}
        >
        <SessionProvider>
            <Link href="/">
                <Image
                    src={logoWhite}
                    alt="Logo"
                    height={40}
                    className={"absolute top-10 left-10"}
                />
            </Link>
            <div className="container mx-auto px-4 h-screen flex flex-col justify-between gap-8">
                {children}
            </div>
        </SessionProvider>
        <Toaster position="top-center" reverseOrder={false}/>
        </body>
        </html>
    );
}