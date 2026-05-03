'use client';

import { usePathname } from 'next/navigation';
import { Suspense } from 'react';

import Navbar from '@/components/Navbar';
import CartSidebar from '@/components/CartSidebar';
import Footer from '@/components/Footer';

const hideChromeRoutes = ['/login', '/register', '/verify'];

export default function ShopShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const hideChrome = hideChromeRoutes.includes(pathname);

    if (hideChrome) {
        return <>{children}</>;
    }

    return (
        <>
            <Suspense fallback={<div>Loading header...</div>}>
                <Navbar />
            </Suspense>
            <CartSidebar />
            {children}
            <Footer />
        </>
    );
}