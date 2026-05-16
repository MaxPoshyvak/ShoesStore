import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,

    // 1. Включаємо HTML репортер, щоб GitHub міг зберігати звіти при падінні
    reporter: [['html', { open: 'never' }]],

    use: {
        // 2. Робимо baseURL завжди локальним
        baseURL: 'http://127.0.0.1:3000',
        trace: 'on-first-retry',
    },

    // 3. НАЙГОЛОВНІШЕ: Вчимо Playwright самостійно піднімати Next.js
    webServer: {
        command: 'bun run build && bun run start',
        url: 'http://127.0.0.1:3000',
        reuseExistingServer: !process.env.CI, // На твоєму ПК використає вже запущений сервер
        timeout: 120 * 1000, // Даємо Next.js 2 хвилини на білд всередині GitHub
    },

    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
});
