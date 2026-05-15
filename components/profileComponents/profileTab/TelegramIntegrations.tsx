'use client';

import { BellOff, BellRing, Check, Delete, ExternalLink, GlobeX, MessageCircleX } from 'lucide-react';
import { unauthorized } from '@/utils/backendData/401Error';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Swal from 'sweetalert2';

export default function TelegramIntegrations({ telegramChatId }: { telegramChatId: string }) {
    const router = useRouter();
    // State to simulate tracking bot connection

    const [isTreckingConnected, setIsTreckingConnected] = useState(telegramChatId !== null ? true : false);

    const handleDisconnect = async () => {
        Swal.fire({
            title: 'Disconnect',
            text: 'Are you sure you want to disconnect?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            confirmButtonColor: '#000',
            cancelButtonColor: '#d33',
            background: '#fff',
            color: '#000',
        })
            .then(async (result) => {
                if (result.isConfirmed) {
                    const res = await fetch(
                        `${process.env.NEXT_PUBLIC_BACKEND_URL}/telegram/disconnect-notifications`,
                        {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${localStorage.getItem('token')}`,
                            },
                        },
                    );
                    if (res.status === 401) {
                        unauthorized();
                        return;
                    }
                    const data = await res.json();
                    if (!res.ok) {
                        throw new Error(data.message || 'Disconnect error');
                    }
                    setIsTreckingConnected(false);
                    router.refresh();
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const getTelegramLink = async (bot: string) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/telegram/generate-link/${bot}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (res.status === 401) {
                unauthorized();
                return;
            }
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Registration error');
            }

            window.open(data.link, '_blank', 'noopener,noreferrer');
            window.location.reload();

            return data;
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Card Header */}
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">Telegram Integration</h2>
                <p className="text-sm text-gray-500 mt-1">Manage order notifications and contact support.</p>
            </div>

            <div className="flex flex-col gap-4">
                {/* BOT 1: Order Notifications */}
                <div className="bg-[#F7F7F9] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-transparent hover:border-gray-200 transition-colors">
                    <div className="flex items-center gap-4">
                        {/* Icon with light blue Telegram background */}
                        <div className="w-12 h-12 rounded-full bg-[#2AABEE]/10 flex items-center justify-center shrink-0">
                            <BellRing className="w-6 h-6 text-[#2AABEE]" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                                Telegram Notifications
                                {isTreckingConnected && (
                                    <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                        Active
                                    </span>
                                )}
                            </h3>
                            <p className="text-sm text-gray-500 mt-0.5">Get real-time order status updates.</p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {isTreckingConnected && (
                            <button
                                title="Disconect"
                                onClick={() => handleDisconnect()}
                                className="shrink-0 px-3 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 bg-gray-200 text-gray-700 hover:bg-red-300">
                                <BellOff className="w-4 h-4" />
                            </button>
                        )}
                        <button
                            onClick={() => {
                                if (!isTreckingConnected) {
                                    getTelegramLink('info');
                                }
                            }}
                            className={`shrink-0 px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2
              ${
                  isTreckingConnected
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-black text-white hover:bg-gray-800 shadow-md'
              }
            `}>
                            {isTreckingConnected ? (
                                <>
                                    <Check className="w-4 h-4" />
                                    Connected
                                </>
                            ) : (
                                'Connect'
                            )}
                        </button>
                    </div>
                </div>

                {/* BOT 2: Customer Support */}
                <div className="bg-[#F7F7F9] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-transparent hover:border-gray-200 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#2AABEE]/10 flex items-center justify-center shrink-0">
                            {/* Original Telegram icon for support */}
                            <svg className="w-6 h-6 text-[#2AABEE]" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.548.223l.188-2.85 5.18-4.686c.223-.195-.054-.285-.346-.096l-6.405 4.032-2.76-.864c-.6-.188-.61-.6.125-.89l10.8-4.16c.5-.19.95.115.805.903z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-gray-900">Customer Support</h3>
                            <p className="text-sm text-gray-500 mt-0.5">Have questions? Our support team is online.</p>
                        </div>
                    </div>

                    <div
                        onClick={() => getTelegramLink('support')}
                        rel="noopener noreferrer"
                        className="shrink-0 px-5 py-2.5 rounded-lg text-sm font-medium bg-white border border-gray-200 text-gray-900 hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                        Open Chat
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                    </div>
                </div>
            </div>
        </div>
    );
}
