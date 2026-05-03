'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { Mail, CheckCircle2, AlertCircle } from 'lucide-react';

export default function VerifyPage() {
    const router = useRouter();
    const [token, setToken] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [isResending, setIsResending] = useState(false);

    const verifyEmail = useCallback(async (verificationToken: string) => {
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
    }, [router]);

    // Якщо в URL є token, автоматично перевіряємо
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const urlToken = params.get('token');

        if (urlToken) {
            setToken(urlToken);
            verifyEmail(urlToken);
        }
    }, [verifyEmail]);

    const resendVerification = async () => {
        const { value: email } = await Swal.fire({
            title: 'Повторно надіслати код',
            input: 'email',
            inputLabel: 'Вкажіть вашу пошту',
            inputPlaceholder: 'your@email.com',
            showCancelButton: true,
            confirmButtonText: 'Надіслати',
            cancelButtonText: 'Скасувати',
            preConfirm: (val) => {
                if (!val || !val.includes('@')) {
                    Swal.showValidationMessage('Вкажіть дійсну електронну пошту');
                }
                return val;
            },
        });

        if (!email) return;

        setIsResending(true);

        try {
            const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
            if (!baseUrl) throw new Error('NEXT_PUBLIC_BACKEND_URL не налаштований');

            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            const headers: Record<string, string> = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const response = await fetch(`${baseUrl}/users/resend-verification-email`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ email }),
            });

            const data = await response.json().catch(() => ({}));

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Лист надіслано',
                    text: 'Ми надіслали код верифікації на зазначену пошту. Перевірте папку Спам якщо потрібно.',
                    confirmButtonColor: '#000',
                });
                setIsResending(false);
                return;
            }

            // Handle common server responses
            if (response.status === 401) {
                const msg = (data && data.message) ? String(data.message) : 'Токен відсутній. Доступ заборонено';
                const result = await Swal.fire({ icon: 'error', title: 'Помилка', text: msg, confirmButtonText: 'Увійти', showCancelButton: true });
                if (result.isConfirmed) router.push('/login');
                setIsResending(false);
                return;
            }

            if (response.status === 404) {
                Swal.fire({ icon: 'error', title: 'Користувача не знайдено', text: (data && data.message) ? String(data.message) : 'User not found', confirmButtonColor: '#000' });
                setIsResending(false);
                return;
            }

            // Generic error
            const errMsg = (data && data.message) ? String(data.message) : `Помилка: ${response.status}`;
            Swal.fire({ icon: 'error', title: 'Помилка', text: errMsg, confirmButtonColor: '#000' });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Невідома помилка';
            Swal.fire({ icon: 'error', title: 'Помилка', text: message, confirmButtonColor: '#000' });
        } finally {
            setIsResending(false);
        }
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

                    {/* Кнопка верифікації + resend поруч */}
                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={isLoading || !token.trim()}
                            className="flex-1 bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition">
                            {isLoading ? 'Перевіряємо...' : 'Підтвердити пошту'}
                        </button>

                        <button
                            type="button"
                            onClick={resendVerification}
                            disabled={isResending}
                            className="flex-none border border-gray-200 bg-white text-gray-900 px-4 py-3 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed transition">
                            {isResending ? 'Надсилаємо...' : 'resend'}
                        </button>
                    </div>
                </form>

                {/* Інформаційний блок */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-700">
                        <p className="font-semibold mb-1">Не отримали лист?</p>
                        <p>Перевірте теку &quot;Спам&quot; або спробуйте зареєструватися ще раз.</p>
                    </div>
                </div>

                {/* Resend moved next to submit button above */}

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
