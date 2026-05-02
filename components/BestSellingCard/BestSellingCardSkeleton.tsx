import React from 'react';

interface Props {
    className?: string;
}

export const BestSellingCardSkeleton: React.FC<Props> = ({ className = '' }) => {
    return (
        <div
            className={`flex flex-col w-full h-full bg-[#f9f9f9] border border-[#eaeaea] rounded-[16px] overflow-hidden animate-pulse ${className}`}>
            {/* Блок з картинкою: 180px на мобілці, 200px на ПК */}
            <div className="w-full h-[180px] md:h-[200px] bg-gray-200 relative flex-shrink-0">
                <div className="absolute top-[16px] left-[16px] w-[50px] h-[24px] bg-gray-300 rounded-[20px]"></div>
                <div className="absolute top-[16px] right-[16px] w-[36px] h-[36px] bg-gray-300 rounded-full"></div>
            </div>

            {/* Контентна частина: менші відступи на мобілці (12px), стандартні на ПК (16px) */}
            <div className="flex flex-col p-[12px] md:p-[16px] flex-1">
                {/* Назва: менша висота рядка на телефоні */}
                <div className="flex flex-col gap-[6px] mb-[8px] min-h-[38px] md:min-h-[42px]">
                    <div className="w-full h-[16px] md:h-[18px] bg-gray-200 rounded"></div>
                    <div className="w-[70%] h-[16px] md:h-[18px] bg-gray-200 rounded"></div>
                </div>

                {/* Запаси та розміри */}
                <div className="flex flex-col gap-[4px] mb-[12px]">
                    <div className="w-[85px] h-[20px] bg-gray-200 rounded-[6px]"></div>
                    <div className="w-[90%] h-[16px] md:h-[20px] bg-gray-200 rounded"></div>
                </div>

                {/* Нижня панель: менша кнопка та ціни на мобілці */}
                <div className="mt-auto flex justify-between items-end pt-[12px] border-t border-[#f0f0f0]">
                    <div className="flex flex-col gap-[2px]">
                        <div className="w-[70px] md:w-[80px] h-[22px] md:h-[26px] bg-gray-300 rounded-[6px]"></div>
                        <div className="w-[45px] md:w-[50px] h-[16px] md:h-[20px] bg-gray-200 rounded-[6px]"></div>
                    </div>

                    {/* Кнопка: 40x40 на мобілці, 44x44 на ПК */}
                    <div className="w-[40px] h-[40px] md:w-[44px] md:h-[44px] bg-gray-300 rounded-full flex-shrink-0"></div>
                </div>
            </div>
        </div>
    );
};
