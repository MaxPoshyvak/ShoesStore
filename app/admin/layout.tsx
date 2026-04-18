import '@/app/globals.css';
import { AuthProvider } from '@/components/AuthContext';
import AdminGuard from './AdminGuard';

export const metadata = {
    title: 'Адмінка - Shoes Store',
    description: 'Панель адміністратора для управління товарами та замовленнями',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <AdminGuard>
                <div className="flex h-screen bg-[#F8F9FA] font-sans">
                    <main className="flex-1 flex flex-col h-screen overflow-hidden">{children}</main>
                </div>
            </AdminGuard>
        </AuthProvider>
    );
}
