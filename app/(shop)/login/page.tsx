"use client";

import React, { useState } from "react";
// In the original Next.js, uncomment these lines:
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { useAuth } from '../../../components/AuthContext';
import { Mail, Lock, AlertCircle, ArrowRight } from "lucide-react";

export default function LoginPage() {
    // In the original Next.js, uncomment these:
    // const router = useRouter();
    // const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const res = await fetch("https://shoesstore-server.onrender.com/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                throw new Error(data.message || "Login error. Please check your email or password.");
            }

            localStorage.setItem("token", data.token);
            
            // In the original Next.js, uncomment this:
            // login(data.token, data.user);

            // Routing simulation for Canvas. In Next.js use: router.push("/");
            window.location.href = "/";
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-black flex items-center justify-center p-4">
            
            <div className="max-w-md w-full bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
                
                {/* Decorative background */}
                <div className="absolute top-0 left-0 w-full h-2 bg-black"></div>

                <div className="text-center mb-8">
                    <div className="text-3xl font-black tracking-tighter mb-6">Slick</div>
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome Back</h1>
                    <p className="text-gray-500 text-sm">Log in to your account to continue.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-start gap-3 text-sm">
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">Email Address <span className="text-red-500">*</span></label>
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
                        <label className="block text-sm font-semibold mb-2 text-gray-700">Password <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Enter your password"
                                className="w-full border border-gray-200 p-4 pl-12 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full bg-black text-white py-4 px-6 font-semibold rounded-xl hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center gap-2 group"
                        >
                            {isLoading ? (
                                "Logging in..."
                            ) : (
                                <>
                                    Log In
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Registration Link */}
                <div className="mt-8 text-center text-sm text-gray-500">
                    Don&apos;t have an account?{" "}
                    {/* In Next.js replace <a> with <Link href="/register"> */}
                    <a href="/register" className="text-black font-bold hover:underline transition-all">
                        Sign Up
                    </a>
                </div>

            </div>
            
        </div>
    );
}