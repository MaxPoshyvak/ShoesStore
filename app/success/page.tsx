import Link from 'next/link';
import { Check, ArrowRight, ShoppingBag, Receipt } from 'lucide-react';
import '@/app/globals.css';

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ order_id?: string }> }) {
    const params = await searchParams;

    // 3. Тепер спокійно беремо з нього наш ID
    const orderId = params.order_id;
    console.log(orderId);

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-4 font-sans selection:bg-black selection:text-white">
            <div className="max-w-lg w-full bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                {/* Верхній блок з іконкою */}
                <div className="bg-black p-8 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        {/* Патерн для преміальності (опціонально) */}
                        <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-6 border border-white/20 shadow-inner">
                            <Check size={40} className="text-white" strokeWidth={2} />
                        </div>
                        <h1 className="text-3xl font-black text-white tracking-tight mb-2">Оплата пройшла!</h1>
                        <p className="text-gray-300 text-sm font-medium">Твоє замовлення успішно оформлено.</p>
                    </div>
                </div>

                {/* Тіло картки (Чек) */}
                <div className="p-8 space-y-8">
                    {/* Інформаційний блок */}
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <Receipt size={20} className="text-gray-400" />
                            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Деталі</h2>
                        </div>

                        <div className="space-y-4">
                            {orderId && (
                                <div className="flex justify-between items-center pb-4 border-b border-gray-200 border-dashed">
                                    <span className="text-sm text-gray-500 font-medium">Номер замовлення</span>
                                    <span className="text-base font-black text-black">#{orderId}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500 font-medium">Статус</span>
                                <span className="text-xs font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full uppercase tracking-wider">
                                    Оплачено
                                </span>
                            </div>
                        </div>
                    </div>

                    <p className="text-center text-sm text-gray-500 leading-relaxed px-4">
                        Ми вже отримали твій платіж і почали пакувати кросівки. Чек та деталі доставки надіслані на твою
                        пошту.
                    </p>

                    {/* Кнопки */}
                    <div className="flex flex-col gap-3 pt-2">
                        <Link
                            href="/profile"
                            className="w-full py-4 bg-black text-white rounded-xl font-bold text-sm hover:bg-gray-900 transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/20 hover:shadow-black/30 hover:-translate-y-0.5 active:translate-y-0">
                            <ShoppingBag size={18} />
                            Переглянути замовлення
                        </Link>
                        <Link
                            href="/"
                            className="w-full py-4 bg-white text-gray-900 border border-gray-200 rounded-xl font-bold text-sm hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2 group">
                            Продовжити покупки
                            <ArrowRight size={18} className="text-gray-400 group-hover:text-black transition-colors" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
