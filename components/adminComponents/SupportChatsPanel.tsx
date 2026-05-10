'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Send, MoreVertical, Paperclip, MessageCircle, ArrowLeft } from 'lucide-react';
import { io, Socket } from 'socket.io-client';

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
    created_at: string | Date;
    customer_name: string;
    customer_email: string;
}

const SOCKET_URL = 'https://shoesstore-server.onrender.com';
const socket: Socket = io(SOCKET_URL, {
    transports: ['websocket'],
    upgrade: false,
    withCredentials: true,
    reconnectionAttempts: 5,
});

export const SupportChatsPanel = ({ searchInp }: { searchInp: string }) => {
    const [chats, setChats] = useState<Chat[]>([]);
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [replyText, setReplyText] = useState('');
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [myId, setMyId] = useState<string | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const activeChat = chats.find((c) => c.id === selectedChatId);

    const filteredChats = useMemo(() => {
        if (!searchInp) return chats;
        const query = searchInp.toLowerCase();
        return chats.filter(
            (chat) =>
                (chat.customer_name?.toLowerCase() || '').includes(query) ||
                (chat.customer_email?.toLowerCase() || '').includes(query),
        );
    }, [chats, searchInp]);

    // Load chats
    useEffect(() => {
        const getChats = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/telegram/get-support-chats`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
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

        const getMyIdFromToken = (): string | null => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return null;
                const payload = JSON.parse(atob(token.split('.')[1]));
                return String(payload.id);
            } catch (error) {
                console.error('Помилка розшифровки токена:', error);
                return null;
            }
        };

        setMyId(getMyIdFromToken());
    }, []);

    // Load history + websocket
    useEffect(() => {
        if (!selectedChatId) return;

        const fetchHistory = async () => {
            setIsLoadingMessages(true);
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/telegram/get-history/${selectedChatId}`,
                    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } },
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
        socket.emit('join_chat', selectedChatId);

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

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!replyText.trim() || !selectedChatId) return;
        const messageText = replyText.trim();
        setReplyText('');

        try {
            await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/telegram/send-support-message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ chat_id: selectedChatId, message: messageText }),
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
        <div className="flex h-[calc(100vh-140px)] sm:h-[calc(100vh-180px)] bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
            {/* Chat list — hidden on mobile when a chat is selected */}
            <div
                className={`w-full sm:w-80 sm:min-w-[280px] border-r border-gray-100 flex flex-col shrink-0 ${selectedChatId ? 'hidden sm:flex' : 'flex'}`}>
                <div className="px-4 sm:px-5 py-3.5 sm:py-4 border-b border-gray-100 shrink-0">
                    <h2 className="text-[15px] font-bold text-gray-900">Support Chats</h2>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                        {filteredChats.length} active chat{filteredChats.length !== 1 ? 's' : ''}
                    </p>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {filteredChats.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full gap-2 px-6">
                            <MessageCircle size={28} className="text-gray-300" />
                            <p className="text-[13px] text-gray-400 text-center">
                                {searchInp ? 'No chats match your search' : 'No active chats'}
                            </p>
                        </div>
                    ) : (
                        filteredChats.map((chat) => (
                            <button
                                key={chat.id}
                                onClick={() => setSelectedChatId(chat.id)}
                                className={`w-full text-left px-4 sm:px-5 py-3.5 border-b border-gray-50 transition-all duration-150 ${
                                    selectedChatId === chat.id
                                        ? 'bg-gray-50 sm:border-l-2 sm:border-l-gray-900'
                                        : 'hover:bg-gray-50/50 sm:border-l-2 sm:border-l-transparent'
                                }`}>
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="text-[13px] font-semibold text-gray-900 truncate pr-2">
                                        {chat.customer_name ?? 'Guest'}
                                    </h3>
                                    <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">
                                        {formatDateShort(chat.created_at)}
                                    </span>
                                </div>
                                <p className="text-[11px] text-gray-400 truncate">{chat.customer_email}</p>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Chat window — full screen on mobile when a chat is selected */}
            <div className={`flex-1 flex flex-col min-w-0 ${selectedChatId ? 'flex' : 'hidden sm:flex'}`}>
                {activeChat ? (
                    <>
                        {/* Chat header */}
                        <div className="px-3 sm:px-5 py-3 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                <button
                                    onClick={() => setSelectedChatId(null)}
                                    className="sm:hidden p-1.5 -ml-1 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors shrink-0">
                                    <ArrowLeft size={18} />
                                </button>
                                <div className="min-w-0">
                                    <h2 className="text-[13px] font-semibold text-gray-900 truncate">
                                        {activeChat.customer_name ?? 'Guest'}
                                    </h2>
                                    <p className="text-[11px] text-gray-400 mt-0.5 truncate">
                                        {activeChat.customer_email}
                                    </p>
                                </div>
                            </div>
                            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors shrink-0">
                                <MoreVertical size={18} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 p-3 sm:p-5 overflow-y-auto flex flex-col gap-2.5 sm:gap-3 bg-[#FAFAFA]">
                            {isLoadingMessages ? (
                                <div className="flex justify-center items-center h-full">
                                    <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="text-center text-gray-400 mt-10 text-[13px]">No messages yet.</div>
                            ) : (
                                messages.map((msg) => {
                                    const isAdmin = String(msg.sender_id) === myId;
                                    return (
                                        <div
                                            key={msg.id}
                                            className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                                            <div
                                                className={`max-w-[85%] sm:max-w-[70%] px-3.5 sm:px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
                                                    isAdmin
                                                        ? 'bg-gray-900 text-white rounded-br-md'
                                                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md shadow-sm'
                                                }`}>
                                                {msg.body}
                                                <span className="block text-[10px] mt-1 text-right text-gray-400">
                                                    {formatTime(msg.created_at)}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="px-3 sm:px-4 py-2.5 sm:py-3 border-t border-gray-100 bg-white shrink-0">
                            <div className="flex items-end gap-1.5 sm:gap-2">
                                <button className="p-2 sm:p-2.5 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-50 hidden sm:block">
                                    <Paperclip size={18} />
                                </button>
                                <textarea
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Type a message…"
                                    className="flex-1 max-h-24 sm:max-h-28 min-h-[38px] sm:min-h-[40px] bg-gray-50 border border-gray-200 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300 resize-none transition-all"
                                    rows={1}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!replyText.trim()}
                                    className="p-2 sm:p-2.5 bg-gray-900 text-white rounded-xl hover:bg-black transition-all active:scale-95 disabled:opacity-40 disabled:active:scale-100">
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3">
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100">
                            <MessageCircle size={28} className="text-gray-300" />
                        </div>
                        <p className="text-[13px] font-medium text-gray-400">Select a chat to start messaging</p>
                    </div>
                )}
            </div>
        </div>
    );
};
