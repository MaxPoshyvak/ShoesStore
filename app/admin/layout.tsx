import '@/app/globals.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen bg-[#F8F9FA] font-sans">
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Контент сторінок адмінки буде рендеритись тут */}
                {children}
            </main>
        </div>
    );
}
