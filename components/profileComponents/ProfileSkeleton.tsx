export function ProfileSkeleton() {
    return (
        <div className="min-h-screen bg-[#F8F9FA] py-4 sm:py-8 px-3 sm:px-6 lg:px-8">
            <div className="max-w-6xl mt-25 md:mt-20 mx-auto flex flex-col md:flex-row gap-4 sm:gap-8 animate-pulse">
                {/* Skeleton Sidebar */}
                <div className="w-full md:w-72 shrink-0">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        {/* User Summary */}
                        <div className="p-4 sm:p-6 border-b border-gray-50 flex items-center gap-3 sm:gap-4 bg-gray-50/50">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-full shrink-0" />
                            <div className="flex flex-col gap-1.5 w-full">
                                <div className="w-24 h-4 sm:h-5 bg-gray-200 rounded-md" />
                                <div className="w-32 sm:w-40 h-3 sm:h-4 bg-gray-100 rounded-md hidden sm:block" />
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="flex md:flex-col p-2 sm:p-3 gap-1 overflow-x-auto">
                            <div className="w-28 sm:w-full h-9 sm:h-11 bg-gray-200 rounded-xl shrink-0" />
                            <div className="w-28 sm:w-full h-9 sm:h-11 bg-gray-100 rounded-xl shrink-0" />
                            <div className="w-28 sm:w-full h-9 sm:h-11 bg-gray-100 rounded-xl shrink-0" />
                            <div className="w-28 sm:w-full h-9 sm:h-11 bg-gray-100 rounded-xl shrink-0" />
                            <div className="hidden md:block my-2 border-t border-gray-100" />
                            <div className="w-28 sm:w-full h-9 sm:h-11 bg-gray-50 rounded-xl shrink-0" />
                        </div>
                    </div>
                </div>

                {/* Skeleton Main Content */}
                <div className="flex-1 min-w-0">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 md:p-8">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-6 sm:mb-8">
                            <div className="flex flex-col gap-2">
                                <div className="w-40 sm:w-56 h-6 sm:h-8 bg-gray-200 rounded-lg" />
                                <div className="w-56 sm:w-72 h-4 sm:h-5 bg-gray-100 rounded-md" />
                            </div>
                            <div className="w-24 sm:w-28 h-8 sm:h-9 bg-gray-50 rounded-xl hidden sm:block border border-gray-100" />
                        </div>

                        {/* Inputs Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            {[1, 2, 3, 4].map((item) => (
                                <div key={item}>
                                    <div className="w-24 sm:w-32 h-3 sm:h-4 bg-gray-200 rounded mb-2" />
                                    <div className="w-full h-10 sm:h-12 bg-gray-50 border border-transparent rounded-xl px-3 sm:px-4 flex items-center gap-3">
                                        <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-200 rounded shrink-0" />
                                        <div className="w-1/2 sm:w-2/3 h-4 sm:h-5 bg-gray-200 rounded-md" />
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
