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
                title: 'Error',
                text: 'Please enter your verification code.',
                confirmButtonColor: '#000',
            });
            return;
        }

        setIsLoading(true);

        // Показуємо loading alert
        Swal.fire({
            title: 'Verifying...',
            text: 'Please wait',
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
                        throw new Error(data.message || 'Verification failed');
                    }

                    // Успіх!
                    setIsVerified(true);
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'Your email has been verified successfully.',
                        confirmButtonColor: '#000',
                        timer: 1500,
                        timerProgressBar: true,
                    }).then(() => {
                        // If a next param was provided, redirect there (and keep openReview flag if present)
                        try {
                            const params = new URLSearchParams(window.location.search);
                            const next = params.get('next');
                            const openReview = params.get('openReview');
                            if (next) {
                                const suffix = openReview === '1' ? (next.includes('?') ? '&openReview=1' : '?openReview=1') : '';
                                router.push(`${next}${suffix}`);
                                return;
                            }
                        } catch {
                            // fallthrough
                        }

                        router.push('/login');
                    });
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

                    Swal.fire({
                        icon: 'error',
                        title: 'Verification error',
                        text: errorMessage,
                        confirmButtonColor: '#000',
                        footer: 'The code may be invalid or expired',
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
            title: 'Resend code',
            input: 'email',
            inputLabel: 'Enter your email',
            inputPlaceholder: 'your@email.com',
            showCancelButton: true,
            confirmButtonText: 'Send',
            cancelButtonText: 'Cancel',
            preConfirm: (val) => {
                if (!val || !val.includes('@')) {
                    Swal.showValidationMessage('Please enter a valid email address');
                }
                return val;
            },
        });

        if (!email) return;

        setIsResending(true);

        try {
            const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
            if (!baseUrl) throw new Error('NEXT_PUBLIC_BACKEND_URL is not configured');

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
                    title: 'Email sent',
                    text: 'We sent a new verification code to the email address you entered. Check your Spam folder if needed.',
                    confirmButtonColor: '#000',
                });
                setIsResending(false);
                return;
            }

            // Handle common server responses
            if (response.status === 401) {
                const msg = (data && data.message) ? String(data.message) : 'Token missing. Access denied.';
                const result = await Swal.fire({ icon: 'error', title: 'Error', text: msg, confirmButtonText: 'Log in', showCancelButton: true });
                if (result.isConfirmed) router.push('/login');
                setIsResending(false);
                return;
            }

            if (response.status === 404) {
                Swal.fire({ icon: 'error', title: 'User not found', text: (data && data.message) ? String(data.message) : 'User not found', confirmButtonColor: '#000' });
                setIsResending(false);
                return;
            }

            // Generic error
            const errMsg = (data && data.message) ? String(data.message) : `Error: ${response.status}`;
            Swal.fire({ icon: 'error', title: 'Error', text: errMsg, confirmButtonColor: '#000' });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            Swal.fire({ icon: 'error', title: 'Error', text: message, confirmButtonColor: '#000' });
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
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Email verified!</h1>
                    <p className="text-gray-600">Redirecting to login...</p>
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
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify your email</h1>
                    <p className="text-gray-600">We sent a code to your inbox. Enter it below.</p>
                </div>

                {/* Форма верифікації */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Input для коду */}
                    <div>
                        <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-2">
                            Verification code
                        </label>
                        <input
                            id="token"
                            type="text"
                            placeholder="Paste the code from the email"
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
                            {isLoading ? 'Verifying...' : 'Verify email'}
                        </button>

                        <button
                            type="button"
                            onClick={resendVerification}
                            disabled={isResending}
                            className="flex-none border border-gray-200 bg-white text-gray-900 px-4 py-3 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed transition">
                            {isResending ? 'Sending...' : 'resend'}
                        </button>
                    </div>
                </form>

                {/* Інформаційний блок */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-700">
                        <p className="font-semibold mb-1">Didn&apos;t get the email?</p>
                        <p>Check your Spam folder or try registering again.</p>
                    </div>
                </div>

                {/* Resend moved next to submit button above */}

                {/* Посилання на login */}
                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        Already verified?{' '}
                        <button
                            onClick={() => router.push('/login')}
                            className="text-gray-900 font-semibold hover:underline">
                            Go to login
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
