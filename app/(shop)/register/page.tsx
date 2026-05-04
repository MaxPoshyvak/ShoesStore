'use client';

import React, { useState } from 'react';
import Swal from 'sweetalert2';
// In the original Next.js, uncomment these lines:
// import { useRouter } from "next/navigation";
// import Link from "next/link";
import { User, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
    // In the original Next.js, uncomment:
    // const router = useRouter();

    // States for form fields
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // UI states
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Call the API
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/registration`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                throw new Error(data.message || 'Registration error');
            }

            await Swal.fire({
                icon: 'success',
                title: 'Registration successful!',
                text: 'Check your email for the verification code. It should arrive within a few minutes.',
                confirmButtonColor: '#000',
                confirmButtonText: 'Go to verification',
            });

            // Redirect to verification page, preserve any next/openReview query params
            const search = typeof window !== 'undefined' ? window.location.search : '';
            window.location.href = `/verify${search}`;
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-black flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
                {/* Decorative background (optional) */}
                <div className="absolute top-0 left-0 w-full h-2 bg-black"></div>

                <div className="text-center mb-8">
                    <div className="text-3xl font-black tracking-tighter mb-6">Slick</div>
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">Create an account</h1>
                    <p className="text-gray-500 text-sm">Fill in the details below to join us.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-start gap-3 text-sm">
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Username Field */}
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">
                            Username <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                placeholder="e.g., john_slick"
                                className="w-full border border-gray-200 p-4 pl-12 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white"
                            />
                        </div>
                    </div>

                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">
                            Email Address <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="your@email.com"
                                className="w-full border border-gray-200 p-4 pl-12 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white"
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">
                            Password <span className="text-gray-400 font-normal">(min. 6 characters)</span>{' '}
                            <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                placeholder="Create a strong password"
                                className="w-full border border-gray-200 p-4 pl-12 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-black text-white py-4 px-6 font-semibold rounded-xl hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center gap-2 group">
                            {isLoading ? (
                                'Registering...'
                            ) : (
                                <>
                                    Register
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Login Link */}
                <div className="mt-8 text-center text-sm text-gray-500">
                    Already have an account? {/* In Next.js replace <a> with <Link href="/login"> */}
                    <a href="/login" className="text-black font-bold hover:underline transition-all">
                        Log In
                    </a>
                </div>
            </div>
        </div>
    );
}
