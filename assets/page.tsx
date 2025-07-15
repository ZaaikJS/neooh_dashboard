'use client';
import React from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import googleLogo from "@/assets/images/Google__G__logo.png";

export default function Auth() {
    const handleGoogle = () => {
        signIn("google", { callbackUrl: "/panel" }).catch((err) => {
            console.error("Erro ao fazer login com Google:", err);
        });
    };

    return (
        <div className="flex justify-center m-4 mt-28">
            <div className="flex flex-col justify-center items-center gap-8 p-8">
                <p className="text-2xl text-gray-100 font-semibold">
                    Por favor, identifique-se
                </p>
                <div
                    className="px-6 py-2 flex items-center gap-4 bg-white border-2 border-gray-300 rounded-full shadow-lg shadow-black/20 hover:shadow-xl duration-200 cursor-pointer"
                    onClick={handleGoogle}
                >
                    <Image src={googleLogo} alt="Google" height={30} />
                    <span className="text-sm">Entrar com Google</span>
                </div>
            </div>
        </div>
    );
}