import React from 'react';

interface TableSkeletonProps {
    rows?: number;
    columns?: number;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({ rows = 5, columns = 5 }) => {
    return (
        <>
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <tr key={rowIndex} className="border-b border-gray-100 last:border-none">
                    {Array.from({ length: columns }).map((_, colIndex) => (
                        <td key={colIndex} className="px-6 py-4">
                            <div
                                className={`h-4 rounded-md bg-gray-100 animate-pulse ${
                                    colIndex === columns - 1 ? 'w-16 ml-auto' : colIndex === 0 ? 'w-12' : 'w-3/4'
                                }`}
                                style={{ animationDelay: `${rowIndex * 50}ms` }}
                            />
                        </td>
                    ))}
                </tr>
            ))}
        </>
    );
};
