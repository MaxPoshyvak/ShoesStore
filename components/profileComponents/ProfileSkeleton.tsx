export function ProfileSkeleton() {
    return (
        <div className="min-h-screen bg-[#F8F9FA] py-30 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 animate-pulse">
                {/* ================= SKELETON SIDEBAR ================= */}
                <div className="w-full md:w-72 shrink-0">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-30">
                        {/* User Summary: Висота точно 96px */}
                        <div className="p-6 border-b border-gray-50 flex items-center gap-4 bg-gray-50/50">
                            <div className="w-12 h-12 bg-gray-200 rounded-full shrink-0"></div>
                            <div className="flex flex-col gap-1 w-full">
                                <div className="w-24 h-[24px] bg-gray-200 rounded-md"></div>
                                <div className="w-40 h-[16px] bg-gray-100 rounded-md"></div>
                            </div>
                        </div>

                        {/* Navigation: Ідеальні відступи (space-y-1) та висота кнопок (44px) */}
                        <div className="p-3 space-y-1">
                            <div className="w-full h-[44px] bg-gray-200 rounded-xl"></div>
                            <div className="w-full h-[44px] bg-gray-100 rounded-xl"></div>
                            <div className="w-full h-[44px] bg-gray-100 rounded-xl"></div>
                            <div className="my-2 border-t border-gray-100"></div>
                            <div className="w-full h-[44px] bg-gray-50 rounded-xl"></div>
                        </div>
                    </div>
                </div>

                {/* ================= SKELETON MAIN CONTENT ================= */}
                <div className="flex-1">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                        {/* Header: mb-8, висота заголовка точно 32px, підзаголовка 20px */}
                        <div className="flex justify-between items-start mb-8">
                            <div className="flex flex-col">
                                <div className="w-48 md:w-64 h-[32px] bg-gray-200 rounded-lg"></div>
                                <div className="w-64 md:w-80 h-[20px] bg-gray-100 rounded-md mt-1"></div>
                            </div>
                            <div className="w-[120px] h-[36px] bg-gray-50 rounded-xl hidden sm:block border border-gray-100"></div>
                        </div>

                        {/* Inputs Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[1, 2, 3, 4].map((item) => (
                                <div key={item}>
                                    {/* Label: текст-xs (16px) + mb-2 (8px) */}
                                    <div className="w-32 h-[16px] bg-gray-200 rounded mb-2"></div>

                                    {/* Input Box: py-3 (24px) + font-medium (~20px) = 44px */}
                                    <div className="w-full h-[50px] bg-gray-50 border border-transparent rounded-xl px-4 flex items-center gap-3">
                                        <div className="w-[18px] h-[18px] bg-gray-200 rounded shrink-0"></div>
                                        <div className="w-1/2 md:w-2/3 h-[20px] bg-gray-200 rounded-md"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
