import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '@/app/globals.css';
import { CartProvider } from '@/components/context/CartContext';
import { AuthProvider } from '../../components/AuthContext';
import ShopShell from '@/components/ShopShell';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    metadataBase: new URL('https://www.slickstore.store'),

    title: {
        default: 'SlickStore | Your Perfect Shoe Store',
        template: '%s | SlickStore',
    },
    description: 'The best selection of sneakers and shoes. Fast delivery, quality guaranteed.',

    openGraph: {
        title: 'SlickStore | Buy Stylish Shoes',
        description: 'Upgrade your style with us. Top models at the best prices.',
        url: 'https://www.slickstore.store',
        siteName: 'SlickStore',
        locale: 'en_US',
        type: 'website',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
            <body className="min-h-full flex flex-col">
                <AuthProvider>
                    <CartProvider>
                        <ShopShell>{children}</ShopShell>
                    </CartProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
