"use client";

import React, { useEffect } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loading from '@/app/components/Loading';

function AuthGuard({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/");
            return;
        }
    }, [status, session, router]);

    if (status === "loading" || status === "unauthenticated") {
        return (
            <div className="w-full h-screen flex justify-center items-center">
                <Loading />
            </div>
        );
    }

    return <>{children}</>;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <AuthGuard>
                <div className="container mx-auto px-4 h-screen flex flex-col justify-between gap-8">
                    {/* Aqui você pode colocar seu layout como header, menu, footer etc */}
                    {children}
                </div>
            </AuthGuard>
        </SessionProvider>
    );
}