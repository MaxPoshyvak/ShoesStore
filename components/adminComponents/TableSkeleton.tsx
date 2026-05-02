import React from 'react';

interface TableSkeletonProps {
    rows?: number;
    columns?: number;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({ rows = 5, columns = 5 }) => {
    return (
        <>
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <tr key={rowIndex} className="animate-pulse border-b border-gray-200 last:border-none">
                    {Array.from({ length: columns }).map((_, colIndex) => (
                        <td key={colIndex} className="p-4">
                            {/* Смужка, яка імітує текст. Останній колонці (Actions) робимо меншу ширину */}
                            <div
                                className={`h-4 bg-gray-200 rounded ${
                                    colIndex === columns - 1 ? 'w-8 ml-auto' : 'w-3/4'
                                }`}></div>
                        </td>
                    ))}
                </tr>
            ))}
        </>
    );
};
