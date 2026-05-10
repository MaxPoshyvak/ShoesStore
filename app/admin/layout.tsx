import '@/app/globals.css';
import { AuthProvider } from '@/components/AuthContext';
import AdminGuard from './AdminGuard';

export const metadata = {
    title: 'Admin Panel - Slick',
    description: 'Administrator dashboard for managing products and orders',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <AdminGuard>
                <div className="flex h-screen bg-[#F4F5F7] font-sans antialiased">{children}</div>
            </AdminGuard>
        </AuthProvider>
    );
}
