'use client'

import Link from 'next/link';
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import dashboard from '@/assets/images/dashboard.jpg'
import rat from '@/assets/images/rat.jpg'

export default function Panel() {
    const { data: session, status } = useSession();

    if (!session) {
        return
    }

    return (
        <div className="container mx-auto p-8 m-4 mt-28 bg-white shadow-lg shadow-black/40">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <p className="font-semibold text-lg">Olá, {session.user?.name ?? "Usuário"}</p>
                    <p className="text-sm text-gray-600">{session.user?.email}</p>
                </div>
                <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="px-4 py-2 bg-red-500 text-white text-xs rounded hover:bg-red-400 transition cursor-pointer"
                >
                    Logout
                </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <Link
                    href={'/panel/dashboard'}
                    className="p-4 flex flex-col gap-4 group bg-white border border-gray-200 shadow-lg hover:shadow-xl hover:shadow-black/20 duration-200 cursor-pointer"
                >
                    <div className="w-fit h-52 overflow-hidden">
                        <Image src={dashboard} alt={"Dashboard"} className="group-hover:scale-110 duration-400" />
                    </div>
                    <div className="flex flex-col">
                        <p className="font-bold">Dashboard</p>
                        <span className="text-xs">Monitore em tempo real as métricas do Pipefy</span>
                    </div>
                </Link>
                <Link
                    href={'/panel/generate'}
                    className="p-4 flex flex-col gap-4 group bg-white border border-gray-200 shadow-lg hover:shadow-xl hover:shadow-black/20 duration-200 cursor-pointer"
                >
                    <div className="w-fit h-52 overflow-hidden">
                        <Image src={rat} alt={"Gerador de RAT"} className="group-hover:scale-110 duration-400" />
                    </div>
                    <div className="flex flex-col">
                        <p className="font-bold">Gerador de RAT/Relatório</p>
                        <span className="text-xs">Gere RATs e relatórios ao mesmo tempo</span>
                    </div>
                </Link>
            </div>
        </div>
    );
}