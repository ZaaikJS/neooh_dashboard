'use client';

import React, {useEffect, useState} from "react";
import Loading from "@/app/components/Loading";

export default function Cards() {
    const [cards, setCards] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
          avatar_url
        }
        labels {
          name
          color
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
                    body: JSON.stringify({query}),
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

    if (loading) return <div className='h-screen w-full flex justify-center items-center'><Loading/></div>;
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
                                                style={{backgroundColor: label.color}}
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
                                    className={"px-4 py-2 rounded bg-green-600 text-xs text-white hover:bg-green-700 cursor-pointer"}>Criar
                                    grupo
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
