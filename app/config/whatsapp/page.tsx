'use client';

import React, { useEffect, useState } from 'react';

export default function WhatsAppConnect() {
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [connected, setConnected] = useState(false);

    async function fetchStatus() {
        try {
            const res = await fetch('/api/whatsapp');
            const data = await res.json();
            setQrCode(data.qrCodeUrl);
            setConnected(data.connected);
        } catch {
            setQrCode(null);
            setConnected(false);
        }
    }

    useEffect(() => {
        fetchStatus();
        const interval = setInterval(fetchStatus, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50">
            <h1 className="text-3xl font-bold mb-6">Conectar WhatsApp</h1>

            {!connected && qrCode && (
                <div className="flex flex-col items-center">
                    <p className="mb-4 text-center">Escaneie o QR Code com seu app WhatsApp</p>
                    <img src={qrCode} alt="QR Code para conectar WhatsApp" className="w-64 h-64" />
                </div>
            )}

            {!connected && !qrCode && (
                <p className="text-gray-500">Aguardando geração do QR Code...</p>
            )}

            {connected && (
                <p className="text-green-600 font-semibold text-xl">
                    WhatsApp conectado com sucesso! ✅
                </p>
            )}
        </main>
    );
}
