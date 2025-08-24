'use client'
import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import PhaseTime from '@/app/dashboard/PhaseTime';
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
                const response = await fetch("/api/pipefy", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
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
