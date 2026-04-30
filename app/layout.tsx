import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { AuthProvider } from '@/components/AuthContext';

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

// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
            <body className="min-h-full flex flex-col">
                {/* AuthProvider залишаємо тут, бо адміну теж потрібен доступ до юзера */}
                <AuthProvider>{children}</AuthProvider>
            </body>
        </html>
    );
}
