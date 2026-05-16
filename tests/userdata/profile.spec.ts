import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();
const { USER_EMAIL, USER_PASSWORD } = process.env;

if (!USER_EMAIL || !USER_PASSWORD) {
    throw new Error('Missing email or password');
}

test('test /profile', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('user-avatar').click();
    await page.getByRole('textbox', { name: 'your@email.com' }).fill(USER_EMAIL);
    await page.getByRole('textbox', { name: 'Enter your password' }).fill(USER_PASSWORD);
    await page.getByRole('button', { name: 'Log In' }).click();
    await page.getByTestId('user-avatar').click();

    await expect(page).toHaveURL(/.*\/profile/);
    // Якщо це input
    await expect(page.getByTestId('email-input')).toHaveText(USER_EMAIL);
});
