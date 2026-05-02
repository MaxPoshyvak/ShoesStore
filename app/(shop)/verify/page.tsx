'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { Mail, CheckCircle2, AlertCircle } from 'lucide-react';

export default function VerifyPage() {
    const router = useRouter();
    const [token, setToken] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

    // Якщо в URL є token, автоматично перевіряємо
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const urlToken = params.get('token');

        if (urlToken) {
            setToken(urlToken);
            verifyEmail(urlToken);
        }
    }, []);

    const verifyEmail = async (verificationToken: string) => {
        if (!verificationToken.trim()) {
            Swal.fire({
                icon: 'error',
                title: 'Помилка',
                text: 'Будь ласка, введіть код верифікації',
                confirmButtonColor: '#000',
            });
            return;
        }

        setIsLoading(true);

        // Показуємо loading alert
        Swal.fire({
            title: 'Верифікація...',
            text: 'Будь ласка, чекайте',
            icon: 'info',
            allowOutsideClick: false,
            didOpen: async () => {
                Swal.showLoading();

                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/verify-email`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ token: verificationToken }),
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(data.message || 'Помилка верифікації');
                    }

                    // Успіх!
                    setIsVerified(true);
                    Swal.fire({
                        icon: 'success',
                        title: 'Вітаємо!',
                        text: 'Ваша пошта успішно підтверджена. Переводимо на вхід...',
                        confirmButtonColor: '#000',
                        timer: 2000,
                        timerProgressBar: true,
                    }).then(() => {
                        router.push('/login');
                    });
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Невідома помилка';

                    Swal.fire({
                        icon: 'error',
                        title: 'Помилка верифікації',
                        text: errorMessage,
                        confirmButtonColor: '#000',
                        footer: 'Код може бути невірним або закінчився',
                    });
                } finally {
                    setIsLoading(false);
                }
            },
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        verifyEmail(token);
    };

    if (isVerified) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="w-full max-w-md text-center">
                    <CheckCircle2 className="w-16 h-16 mx-auto text-green-600 mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Пошта підтверджена!</h1>
                    <p className="text-gray-600">Переводимо на вхід...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
            <div className="w-full max-w-md">
                {/* Заголовок */}
                <div className="text-center mb-8">
                    <Mail className="w-12 h-12 mx-auto text-gray-900 mb-4" />
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Підтвердіть вашу пошту</h1>
                    <p className="text-gray-600">Ми відправили код на вашу поштову скриньку. Введіть його нижче.</p>
                </div>

                {/* Форма верифікації */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Input для коду */}
                    <div>
                        <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-2">
                            Код верифікації
                        </label>
                        <input
                            id="token"
                            type="text"
                            placeholder="Вставте код з листа"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            disabled={isLoading}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-gray-900 font-mono text-center text-lg"
                        />
                    </div>

                    {/* Кнопка верифікації */}
                    <button
                        type="submit"
                        disabled={isLoading || !token.trim()}
                        className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition">
                        {isLoading ? 'Перевіряємо...' : 'Підтвердити пошту'}
                    </button>
                </form>

                {/* Інформаційний блок */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-700">
                        <p className="font-semibold mb-1">Не отримали лист?</p>
                        <p>Перевірте теку &quot;Спам&quot; або спробуйте зареєструватися ще раз.</p>
                    </div>
                </div>

                {/* Посилання на login */}
                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        Вже верифіковані?{' '}
                        <button
                            onClick={() => router.push('/login')}
                            className="text-gray-900 font-semibold hover:underline">
                            Перейти на вхід
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
