'use client';

import React, { useEffect, useState } from "react";
import Loading from "@/app/components/Loading";
import toast from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useSession } from "next-auth/react";

export default function Cards() {
    const { data: session } = useSession();
    const myEmail = session?.user?.email;

    const [cards, setCards] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [promise, setPromise] = useState(false)
    const [loadingIndex, setLoadingIndex] = useState<number | null>(null);

    useEffect(() => {
        async function fetchPipeData() {
            const query = `
query {
  allCards(pipeId: 304134796, first: 50) {
    edges {
      node {
        title
        current_phase {
          name
          color
        }
        assignees {
          name
          email
          avatar_url
        }
        labels {
          name
          color
        }
        fields {
          name
          value
        }
      }
    }
  }
}
      `;

            try {
                const response = await fetch('https://api.pipefy.com/graphql', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJQaXBlZnkiLCJpYXQiOjE3NDkxMzg2NTksImp0aSI6ImNlZDIyYjkwLTQ3MWQtNDgxYi1iMGJhLTk3NWE3YmU3YWI0OSIsInN1YiI6MzAzMjE1OTExLCJ1c2VyIjp7ImlkIjozMDMyMTU5MTEsImVtYWlsIjoiaGFycmlzb24udmlhbmFAbmVvb2guY29tLmJyIn19.kaHda8uV0esRE2ZU80Y5SaJdguOGZWHGiIxJ_Qvy45TkXEKBWZ8xaPnn807sL7J6oADVc4ngfy-9mzIouW6rQA',
                    },
                    body: JSON.stringify({ query }),
                });

                const result = await response.json();

                if (result.errors) {
                    throw new Error(result.errors[0].message);
                }

                const cards = result?.data?.allCards?.edges?.map((edge: any) => edge.node) || [];
                setCards(cards);
            } catch (err: any) {
                setError(err.message || 'Erro desconhecido');
            } finally {
                setLoading(false);
            }
        }

        fetchPipeData();
    }, []);

    const createGroup = async (title: string, desc: string) => {
        setPromise(true)
        try {
            const response = await fetch(`http://localhost:80/create-group?groupName=${title}&participants=553198315201,553182378662&groupDesc=${desc}`);
            if (!response.ok) {
                // Se a resposta não for 2xx, lança erro
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            const data = await response.json();
            console.log('Grupo criado:', data);
            // Aqui você pode fazer algo com "data"
        } catch (error) {
            console.error('Erro ao criar grupo:', error);
            // Aqui você pode tratar o erro de forma amigável na UI, se quiser
        } finally {
            setPromise(false)
        }
    }

    if (loading) return <div className='h-screen w-full flex justify-center items-center'><Loading /></div>;
    if (error) return <p className="text-center text-red-500 mt-10">Erro: {error}</p>;

    return (
        <div className="container mx-auto p-8 m-8 mt-28 bg-white shadow-lg shadow-black/40">
            <p className="text-xl font-semibold mb-6">Lista de cards</p>
            <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse border border-gray-300 text-xs">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left">Título</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Fase</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Responsável</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Tags</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">#</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cards.map((card, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="border border-gray-300 px-4 py-2">{card.title}</td>
                                <td className="border border-gray-300 px-4 py-2">
                                    <span
                                        className="relative px-2 py-1 rounded text-white text-xs overflow-hidden"
                                    >
                                        <span
                                            className="absolute inset-0 z-0 rounded"
                                            style={{
                                                backgroundColor: card.current_phase?.name === "EM ANÁLISE"
                                                    ? "#BDBDBD"
                                                    : card.current_phase?.color || '#999',
                                                filter: 'brightness(85%)',
                                            }}
                                        />
                                        <span className="relative z-10">{card.current_phase?.name || '-'}</span>
                                    </span>
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {card.assignees.length > 0 ? (
                                        <div className="flex gap-2 items-center">
                                            {card.assignees.map((a: any, i: number) => (
                                                <div key={i} className="flex items-center gap-2">
                                                    {a.avatar_url && (
                                                        <img
                                                            src={a.avatar_url}
                                                            alt={a.name}
                                                            className="w-6 h-6 rounded-full border"
                                                        />
                                                    )}
                                                    <span className="text-sm">{a.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        '-'
                                    )}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {card.labels.length > 0 ? (
                                        <div className="flex flex-wrap gap-1">
                                            {card.labels.map((label: any, i: number) => (
                                                <span
                                                    key={i}
                                                    className="px-2 py-1 rounded text-white text-xs"
                                                    style={{ backgroundColor: label.color }}
                                                >
                                                    {label.name}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        '-'
                                    )}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    <button
                                        className={"flex px-4 py-2 mx-auto rounded bg-green-600 text-xs text-white hover:bg-green-700 cursor-pointer"}
                                        disabled={promise}
                                        onClick={async () => {
                                            setLoadingIndex(index);
                                            try {
                                                await toast.promise(
                                                    createGroup(
                                                        card.title,
                                                        encodeURIComponent(card.fields?.find((f: { name: string; }) => f.name === 'Prévia da descrição da demanda')?.value || '')
                                                    ),
                                                    {
                                                        loading: 'Criando grupo. Aguarde...',
                                                        success: <b>Grupo criado com sucesso!</b>,
                                                        error: <b>Não foi possível criar o grupo.</b>,
                                                    }
                                                );
                                            } finally {
                                                setLoadingIndex(null);
                                            }
                                        }}
                                    >
                                        {loadingIndex === index
                                            ? <AiOutlineLoading3Quarters className="animate-spin h-4" />
                                            : 'Criar grupo'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div >
    );
}
