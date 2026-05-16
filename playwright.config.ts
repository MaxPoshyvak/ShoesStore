// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
    use: {
        /* Базовий URL для всіх тестів */
        baseURL: process.env.CI ? 'https://www.slickstore.store' : 'http://localhost:3000',
        // Якщо тести біжать на GitHub (CI=true), вони стукають на твій реальний сайт на Vercel.
        // Якщо ти запускаєш їх на своєму ноуті, вони стукають на localhost.
    },
});
