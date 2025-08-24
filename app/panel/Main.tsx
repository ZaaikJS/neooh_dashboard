'use client'

import Link from 'next/link';
import Image from "next/image";
import { useSession, signOut, signIn } from "next-auth/react";
import dashboard from '@/assets/images/dashboard.jpg';
import googleLogo from "@/assets/images/Google__G__logo.png";
import React from "react";
import Loading from "@/app/components/Loading";
import { toast } from "react-hot-toast";
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

export default function PanelContent() {
  const { data: session, status } = useSession();

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const shownRef = React.useRef(false);

  React.useEffect(() => {
    const code = searchParams.get('error');
    if (!code || shownRef.current) return;

    const messages: Record<string, string> = {
      OrganizationOnly: 'Usuário não faz parte da organização.',
      AccessDenied: 'Acesso negado.',
      Default: 'Falha na autenticação.'
    };

    const message = messages[code] ?? messages.Default;

    toast.error(message, {
      duration: 4000,
      style: { background: '#d32f2f', color: '#fff' }
    });

    const sp = new URLSearchParams(searchParams.toString());
    sp.delete('error');
    router.replace(sp.toString() ? `${pathname}?${sp}` : pathname, { scroll: false });

    shownRef.current = true;
  }, [searchParams, router, pathname]);

  if (status === "loading") {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  if (!session) {
    const handleGoogle = async () => {
      await signIn("google", { callbackUrl: "/" });
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
          href={'/dashboard'}
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
      </div>
    </div>
  );
}