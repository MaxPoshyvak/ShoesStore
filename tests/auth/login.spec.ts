import * as dotenv from 'dotenv';
dotenv.config();
import { test, expect } from '@playwright/test';

const { USER_EMAIL, USER_PASSWORD } = process.env;

if (!USER_EMAIL || !USER_PASSWORD) {
    throw new Error('Missing email or password');
}

test('test login', async ({ page }) => {
    await page.goto('/');
    await page.getByText('?', { exact: true }).click();
    await page.getByRole('textbox', { name: 'your@email.com' }).fill(USER_EMAIL);
    await page.getByRole('textbox', { name: 'Enter your password' }).fill(USER_PASSWORD);
    await page.getByRole('button', { name: 'Log In' }).click();

    await expect(page).toHaveURL('/');

    await expect(page.getByText('?', { exact: true })).not.toBeVisible();

    // Замість перевірки букви "М", перевіряємо, що аватарка просто з'явилася
    await expect(page.getByTestId('user-avatar')).toBeVisible();
});
