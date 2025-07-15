'use client'
import {Geist, Geist_Mono} from "next/font/google";
import "../app/globals.css";
import Link from "next/link";
import Image from "next/image";
import logoWhite from '@/assets/images/logo-white.svg'
import { SessionProvider, useSession } from "next-auth/react";
import React, {useEffect} from "react";
import {usePathname, useRouter} from "next/navigation";
import Loading from "@/app/components/Loading";

function IsAuth({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (status === "authenticated" && pathname === "/") {
            router.push("/panel");
        }
    }, [status, pathname, router]);

    if ((status === "loading" || status === "authenticated") && pathname === "/") {
        return (
            <div className="w-full h-screen flex justify-center items-center">
                <Loading />
            </div>
        );
    }

    return <>{children}</>;
}

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

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
        <SessionProvider>
            <IsAuth>
        <Link href="/panel">
            <Image
                src={logoWhite}
                alt="Logo"
                height={40}
                className={"absolute top-10 left-10"}
            />
        </Link>
        {children}
            </IsAuth>
        </SessionProvider>
        </body>
        </html>
    );
}
