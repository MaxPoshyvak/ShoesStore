import { test, expect } from '@playwright/test';

test('Успішна реєстрація нового користувача', async ({ page }) => {
    // 1. Створюємо унікальний email ПЕРЕД початком кроків
    const uniqueId = Date.now(); // Наприклад: 1715871234567
    const randomEmail = `testuser_${uniqueId}@gmail.com`;

    // 2. Відкриваємо сайт і йдемо на реєстрацію
    await page.goto('/');
    await page.getByText('?', { exact: true }).click();

    // (Припустимо, тут треба клікнути на вкладку "Реєстрація", якщо вона є)
    // await page.getByRole('button', { name: 'Sign Up' }).click();
    await page.getByRole('link', { name: 'Sign Up' }).click();

    // 3. Вводимо унікальні дані
    await page.getByTestId('username').click();
    await page.getByTestId('username').fill('max');
    await page.getByRole('textbox', { name: 'your@email.com' }).fill(randomEmail);
    await page.getByRole('textbox', { name: 'Create a strong password' }).fill('testpass123!');

    await page.getByRole('button', { name: 'Register' }).click();
    await page.getByRole('button', { name: 'Go to verification' }).click();
    // 4. Перевірка: нас перекинуло на головну і з'явилась аватарка (перша буква імені "А")
    await expect(page).toHaveURL(/.*\/verify/);
    await expect(page.getByText('Verify your email', { exact: true })).toBeVisible();
});
