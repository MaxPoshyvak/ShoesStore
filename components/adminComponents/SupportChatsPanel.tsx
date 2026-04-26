'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, MoreVertical, Paperclip } from 'lucide-react';
import { io, Socket } from 'socket.io-client';

// ==========================================
// TYPESCRIPT INTERFACES
// ==========================================
export interface Message {
    id: string;
    chat_id: string;
    sender_id: string;
    body: string;
    created_at: string;
}

export interface Chat {
    id: string;
    type: 'support';
    created_at: string | Date; // З API зазвичай приходить рядок
    customer_name: string;
    customer_email: string;
}

// ==========================================
// SOCKET.IO SETUP
// ==========================================
const SOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';
const socket: Socket = io(SOCKET_URL);

const ADMIN_ID = 'df6fe17e-6274-4631-ab65-8b930c6d99cc'; // Ваш ID адміністратора

export const SupportChatsPanel = () => {
    const [chats, setChats] = useState<Chat[]>([]);
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [replyText, setReplyText] = useState('');
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const activeChat = chats.find((c) => c.id === selectedChatId);

    // ==========================================
    // ЗАВАНТАЖЕННЯ СПИСКУ ЧАТІВ
    // ==========================================
    useEffect(() => {
        const getChats = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/telegram/get-support-chats`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                if (res.ok) {
                    const data = await res.json();
                    setChats(data);
                }
            } catch (error) {
                console.error('Помилка завантаження чатів:', error);
            }
        };

        getChats();
    }, []);

    // ==========================================
    // ЗАВАНТАЖЕННЯ ІСТОРІЇ ТА WEBSOCKET
    // ==========================================
    useEffect(() => {
        if (!selectedChatId) return;

        // 1. Завантажуємо історію
        const fetchHistory = async () => {
            setIsLoadingMessages(true);
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/telegram/get-history/${selectedChatId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    },
                );
                if (res.ok) {
                    const data = await res.json();
                    setMessages(data);
                }
            } catch (error) {
                console.error('Помилка завантаження історії:', error);
            } finally {
                setIsLoadingMessages(false);
            }
        };

        fetchHistory();

        // 2. Підключення до кімнати
        socket.emit('join_chat', selectedChatId);

        // 3. Слухаємо нові повідомлення
        const messageHandler = (newMessage: Message) => {
            setMessages((prev) => {
                if (prev.some((msg) => msg.id === newMessage.id)) return prev;
                return [...prev, newMessage];
            });
        };

        socket.on('new_message', messageHandler);

        return () => {
            socket.off('new_message', messageHandler);
        };
    }, [selectedChatId]);

    // Автоскрол вниз
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // ==========================================
    // ВІДПРАВКА ПОВІДОМЛЕННЯ
    // ==========================================
    const handleSendMessage = async () => {
        if (!replyText.trim() || !selectedChatId) return;

        const messageText = replyText.trim();
        setReplyText('');

        try {
            await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/telegram/send-support-message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    chat_id: selectedChatId,
                    message: messageText,
                }),
            });
        } catch (error) {
            console.error('Помилка відправки:', error);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatTime = (isoString: string | Date) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    const formatDateShort = (isoString: string | Date) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' });
    };

    return (
        <div className="flex h-[80vh] gap-6 bg-[#F8F9FA] rounded-xl">
            {/* ЛІВА ПАНЕЛЬ: Список чатів */}
            <div className="w-1/3 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden min-w-[320px]">
                <div className="p-5 border-b border-gray-100">
                    <h2 className="text-xl font-black text-gray-900">Support Chats</h2>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {chats.length === 0 ? (
                        <div className="p-8 text-center text-gray-400 text-sm">No active chats found</div>
                    ) : (
                        chats.map((chat) => (
                            <div
                                key={chat.id}
                                onClick={() => setSelectedChatId(chat.id)}
                                className={`p-4 border-b border-gray-50 cursor-pointer transition-colors ${
                                    selectedChatId === chat.id
                                        ? 'bg-gray-50/80 border-l-4 border-l-black'
                                        : 'hover:bg-gray-50 border-l-4 border-l-transparent'
                                }`}>
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-bold text-sm text-gray-900 truncate pr-2">
                                        {chat.customer_name || 'Guest'}
                                    </h3>
                                    <span className="text-xs text-gray-400 font-medium whitespace-nowrap">
                                        {formatDateShort(chat.created_at)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center gap-2">
                                    <p className="text-xs truncate text-gray-500">{chat.customer_email}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* ПРАВА ПАНЕЛЬ: Вікно листування */}
            <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden relative">
                {activeChat ? (
                    <>
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h2 className="font-bold text-gray-900">{activeChat.customer_name || 'Guest'}</h2>
                                <p className="text-xs text-gray-500 mt-0.5">{activeChat.customer_email}</p>
                            </div>
                            <button className="p-2 text-gray-400 hover:text-black rounded-lg hover:bg-gray-100 transition-colors">
                                <MoreVertical size={20} />
                            </button>
                        </div>

                        <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-gray-50/30">
                            {isLoadingMessages ? (
                                <div className="flex justify-center items-center h-full text-gray-400">
                                    Loading messages...
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="text-center text-gray-400 mt-10">No messages yet.</div>
                            ) : (
                                messages.map((msg) => {
                                    const isAdmin = String(msg.sender_id) === ADMIN_ID;

                                    return (
                                        <div
                                            key={msg.id}
                                            className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                                            <div
                                                className={`max-w-[70%] p-3 rounded-2xl text-sm ${
                                                    isAdmin
                                                        ? 'bg-black text-white rounded-br-sm shadow-md'
                                                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm'
                                                }`}>
                                                {msg.body}
                                                <span
                                                    className={`block text-[10px] mt-1 text-right ${isAdmin ? 'text-gray-400' : 'text-gray-400'}`}>
                                                    {formatTime(msg.created_at)}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-4 border-t border-gray-100 bg-white">
                            <div className="flex items-end gap-2">
                                <button className="p-3 text-gray-400 hover:text-black transition-colors rounded-xl hover:bg-gray-100">
                                    <Paperclip size={20} />
                                </button>
                                <textarea
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Type a message..."
                                    className="flex-1 max-h-32 min-h-[44px] bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 resize-none"
                                    rows={1}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!replyText.trim()}
                                    className="p-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:active:scale-100">
                                    <Send size={20} className="ml-1" />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
                            <Send size={32} className="text-gray-300" />
                        </div>
                        <p className="font-medium text-gray-500">Select a chat to start messaging</p>
                    </div>
                )}
            </div>
        </div>
    );
};
