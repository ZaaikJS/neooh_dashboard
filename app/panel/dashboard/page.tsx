'use client'
import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import PhaseTime from '@/app/panel/dashboard/PhaseTime';
import Loading from '@/app/components/Loading';

export default function Dashboard() {
    const [phases, setPhases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchPipeData() {
            const query = `
        query {
          pipe(id: 304134796) {
            phases {
              name
              cards_count
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

                setPhases(result.data.pipe.phases);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchPipeData();
    }, []);

    if (loading) return <div className='h-screen w-full flex justify-center items-center'><Loading /></div>;
    if (error) return <div>Erro: {error}</div>;

    const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088FE'];

    const data = phases
        .filter((phase: any) => phase.name !== 'CONCLUÍDO' && phase.cards_count > 0)
        .map((phase: any) => ({ name: phase.name, value: phase.cards_count }));

    const legendData = phases
        .filter((phase: any) => phase.name !== 'CONCLUÍDO')
        .map((phase: any) => ({ name: phase.name, value: phase.cards_count }));

    return (
        <>
            <div className="p-8 flex flex-col gap-8 h-screen">
                <div className='flex'>
                    <div className="bg-white rounded-lg shadow-xl w-1/2">
                        <p className='text-center text-2xl font-semibold text-neutral-950 mt-10'>Porcentagem de cards por fase</p>
                        <ResponsiveContainer width="100%" height={400}>
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={120}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {data.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="ml-8 flex flex-col justify-center bg-white rounded-xl shadow-lg p-8 w-1/2">
                        {legendData.map((entry, index) => (
                            <div key={`legend-${index}`} className="flex items-center mb-2">
                                <div
                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                    className="w-4 h-4 mr-2"
                                />
                                <span><span className='font-semibold'>{entry.name}:</span> {entry.value} cards</span>
                            </div>
                        ))}
                    </div>
                </div>
                <PhaseTime />
            </div>
        </>
    );
}
