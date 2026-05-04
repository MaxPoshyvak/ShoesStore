import Link from 'next/link';
import { Check, ArrowRight, ShoppingBag, Receipt } from 'lucide-react';
import '@/app/globals.css';

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ order_id?: string }> }) {
    const params = await searchParams;

    const orderId = params.order_id;
    console.log(orderId);

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-4 font-sans selection:bg-black selection:text-white">
            <div className="max-w-lg w-full bg-white rounded-4xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <div className="bg-black p-6 sm:p-8 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <div className="w-full h-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-white to-transparent"></div>
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-6 border border-white/20 shadow-inner">
                            <Check size={40} className="text-white" strokeWidth={2} />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">Payment successful!</h1>
                        <p className="text-gray-300 text-sm font-medium">Your order has been placed successfully.</p>
                    </div>
                </div>

                <div className="p-6 sm:p-8 space-y-6 sm:space-y-8">
                    <div className="bg-gray-50 rounded-2xl p-5 sm:p-6 border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <Receipt size={20} className="text-gray-400" />
                            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Details</h2>
                        </div>

                        <div className="space-y-4">
                            {orderId && (
                                <div className="flex justify-between items-center pb-4 border-b border-gray-200 border-dashed">
                                    <span className="text-sm text-gray-500 font-medium">Order number</span>
                                    <span className="text-base font-black text-black">#{orderId}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500 font-medium">Status</span>
                                <span className="text-xs font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full uppercase tracking-wider">
                                    Paid
                                </span>
                            </div>
                        </div>
                    </div>

                    <p className="text-center text-sm text-gray-500 leading-relaxed px-4">
                        We have received your payment and started preparing your sneakers. Your receipt and delivery details
                        have been sent to your email.
                    </p>

                    <div className="flex flex-col gap-3 pt-2">
                        <Link
                            href="/profile"
                            className="w-full py-4 bg-black text-white rounded-xl font-bold text-sm hover:bg-gray-900 transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/20 hover:shadow-black/30 hover:-translate-y-0.5 active:translate-y-0">
                            <ShoppingBag size={18} />
                            View orders
                        </Link>
                        <Link
                            href="/"
                            className="w-full py-4 bg-white text-gray-900 border border-gray-200 rounded-xl font-bold text-sm hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2 group">
                            Continue shopping
                            <ArrowRight size={18} className="text-gray-400 group-hover:text-black transition-colors" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
