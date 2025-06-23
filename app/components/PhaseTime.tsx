'use client'
import { useEffect, useState } from 'react';
import Loading from './Loading';

interface PhaseTime {
    phaseName: string;
    avgTime: number;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088FE', '#FF8042', '#A569BD', '#3498DB', '#E74C3C', '#2ECC71'];

export default function PhaseTime() {
    const [phaseTimes, setPhaseTimes] = useState<PhaseTime[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchPhaseData() {
            const query = `
        query {
          pipe(id: 304134796) {
            phases {
              name
              cards(first: 100) {
                edges {
                  node {
                    phases_history {
                      phase { name }
                      duration
                    }
                  }
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

                if (result.errors) throw new Error(result.errors[0].message);

                const phases = result.data.pipe.phases;
                const calculatedPhaseTimes = phases.map((phase: any) => {
                    const durations = phase.cards.edges
                        .flatMap((edge: any) => edge.node.phases_history)
                        .filter((history: any) => history.phase.name === phase.name)
                        .map((history: any) => history.duration);

                    const avgDuration = durations.length
                        ? durations.reduce((acc: number, cur: number) => acc + cur, 0) / durations.length
                        : 0;

                    return { phaseName: phase.name, avgTime: avgDuration };
                });

                setPhaseTimes(calculatedPhaseTimes);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchPhaseData();
    }, []);

    if (loading) return <div className='h-screen w-full flex justify-center items-center'><Loading /></div>;
    if (error) return <div>Erro: {error}</div>;

    const formatTime = (seconds: number) => {
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${days}d ${hours}h ${minutes}min`;
    };

    const firstColumn = phaseTimes.slice(0, 6);
    const secondColumn = phaseTimes.slice(6, 12);
    const threeColumn = phaseTimes.slice(12);

    return (
        <div className="bg-white h-full rounded-xl shadow-lg p-8">
            <h2 className="text-xl font-bold mb-4">Tempo médio por fase {'(últimos 100 cards)'}</h2>
            <div className="flex justify-around">
                <div className="mr-8">
                    {firstColumn.map((phase, index) => (
                        <div key={index} className="flex items-center mb-2">
                            <div
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                className="w-4 h-4 mr-2"
                            />
                            <span><span className="font-semibold">{phase.phaseName}:</span> {formatTime(phase.avgTime)}</span>
                        </div>
                    ))}
                </div>
                {secondColumn.length > 0 && (
                    <div>
                        {secondColumn.map((phase, index) => (
                            <div key={index} className="flex items-center mb-2">
                                <div
                                    style={{ backgroundColor: COLORS[(index + 6) % COLORS.length] }}
                                    className="w-4 h-4 mr-2"
                                />
                                <span><span className="font-semibold">{phase.phaseName}:</span> {formatTime(phase.avgTime)}</span>
                            </div>
                        ))}
                    </div>
                )}
                {threeColumn.length > 0 && (
                    <div>
                        {threeColumn.map((phase, index) => (
                            <div key={index} className="flex items-center mb-2">
                                <div
                                    style={{ backgroundColor: COLORS[(index + 6) % COLORS.length] }}
                                    className="w-4 h-4 mr-2"
                                />
                                <span><span className="font-semibold">{phase.phaseName}:</span> {formatTime(phase.avgTime)}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}