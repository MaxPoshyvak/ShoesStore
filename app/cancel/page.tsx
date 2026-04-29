import Link from 'next/link';
import { X, ArrowLeft, RefreshCcw, AlertCircle } from 'lucide-react';
import '@/app/globals.css';

export default function CancelPage() {
    return (
        <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-4 font-sans selection:bg-black selection:text-white">
            <div className="max-w-lg w-full bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                {/* Верхній блок */}
                <div className="p-6 sm:p-10 text-center flex flex-col items-center border-b border-gray-100 bg-gray-50/50">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 border border-gray-200 shadow-sm relative">
                        <div className="absolute inset-0 border border-gray-100 rounded-full animate-ping opacity-20"></div>
                        <X size={32} className="text-gray-400" strokeWidth={2} />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-3">
                        Оплату перервано
                    </h1>
                    <p className="text-gray-500 text-sm font-medium px-4">
                        Схоже, ти закрив сторінку або виникла проблема з банком.
                    </p>
                </div>

                {/* Тіло картки */}
                <div className="p-6 sm:p-8 space-y-6 sm:space-y-8">
                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 flex items-start gap-4">
                        <AlertCircle size={24} className="text-gray-400 shrink-0 mt-0.5" />
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 mb-1">Що сталось?</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Ми не списали гроші з твоєї картки. Твоє замовлення все ще чекає в кошику, ти можеш
                                спробувати оплатити його іншою карткою.
                            </p>
                        </div>
                    </div>

                    {/* Кнопки */}
                    <div className="flex flex-col gap-3">
                        <Link
                            href="/"
                            className="w-full py-4 bg-black text-white rounded-xl font-bold text-sm hover:bg-gray-900 transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/20 hover:shadow-black/30 hover:-translate-y-0.5 active:translate-y-0">
                            <ArrowLeft size={18} className="text-gray-300 group-hover:text-black transition-colors" />
                            На головну
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
