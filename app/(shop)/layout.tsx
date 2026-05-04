import '@/app/globals.css';
import { CartProvider } from '@/components/context/CartContext';
import { AuthProvider } from '../../components/AuthContext';
import ShopShell from '@/components/ShopShell';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <AuthProvider>
            <CartProvider>
                <ShopShell>{children}</ShopShell>
            </CartProvider>
        </AuthProvider>
    );
}
