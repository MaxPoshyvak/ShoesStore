# 📧 Email Verification Implementation Guide

## Frontend ✅ (Готово)

### Файли які я створив:

1. **`app/(shop)/verify/page.tsx`** — Сторінка верифікації
   - Користувач може введити код верифікації
   - Автоматично перевіряє, якщо `?token=xxx` в URL
   - Показує SweetAlert2 status messages
   - Редирект на `/login` після успіху

2. **`app/(shop)/register/page.tsx`** — Оновлена реєстрація
   - Після успішної реєстрації → редирект на `/verify`
   - Повідомлення про перевірку пошти

---

## Backend 🔧 (Потрібно реалізувати)

### 1. Структура бази даних

Таблиця `users` повинна мати дополнительні поля:

```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS (
    email_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(500),
    token_expires_at TIMESTAMP
);
```

### 2. Нові API endpoints

#### **POST `/api/auth/register`** (Оновити)
**Response після реєстрації:**
```json
{
    "success": true,
    "message": "User registered. Check your email for verification.",
    "email": "user@example.com"
}
```

**Що робити на backend:**
- Створити користувача з `email_verified = false`
- Генерувати `verification_token` (JWT або random string)
- Встановити `token_expires_at` (наприклад, +24 години)
- **Відправити email** на адресу користувача з посиланням:
  ```
  https://yourdomain.com/verify?token=GENERATED_TOKEN
  ```

---

#### **POST `/api/auth/verify-email`** (НОВИЙ)
**Request:**
```json
{
    "token": "verification_token_from_email"
}
```

**Response (успіх):**
```json
{
    "success": true,
    "message": "Email verified successfully!",
    "user": {
        "id": 1,
        "email": "user@example.com",
        "email_verified": true
    }
}
```

**Response (помилка):**
```json
{
    "success": false,
    "message": "Token is invalid or expired"
}
```

**Що робити на backend:**
- Перевірити, що `verification_token` існує
- Перевірити, що `token_expires_at` не пройшов
- Встановити `email_verified = true`
- Видалити `verification_token` та `token_expires_at`
- Повернути успіх

---

### 3. Email Service (Відправка листів)

**Варіанти email сервісів:**

#### Option A: **SendGrid** (Рекомендується)
```bash
npm install @sendgrid/mail
```

**Приклад кода на Node.js:**
```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
    to: user.email,
    from: 'noreply@slickshoes.com',
    subject: 'Підтвердіть вашу реєстрацію у магазин Slick',
    html: `
        <h2>Вітаємо у Slick!</h2>
        <p>Щоб завершити реєстрацію, клікніть посилання нижче:</p>
        <a href="${frontendUrl}/verify?token=${verificationToken}" 
           style="background: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
            Підтвердити реєстрацію
        </a>
        <p>Код дійсний 24 години.</p>
    `
};

await sgMail.send(msg);
```

#### Option B: **Mailgun**
```bash
npm install mailgun.js
```

#### Option C: **SMTP** (Gmail, Outlook, etc.)
```bash
npm install nodemailer
```

---

### 4. Логіка реєстрації (Pseudo-code)

```javascript
// POST /api/auth/register
async function register(username, email, password) {
    // 1. Перевірити, чи email вже існує
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
        return { error: 'Email already registered' };
    }

    // 2. Хешувати пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Створити користувача
    const user = await User.create({
        username,
        email,
        password: hashedPassword,
        email_verified: false,
        verification_token: generateRandomToken(),
        token_expires_at: Date.now() + 24 * 60 * 60 * 1000 // 24 часа
    });

    // 4. Відправити email
    const verificationLink = `https://yourdomain.com/verify?token=${user.verification_token}`;
    await sendVerificationEmail(email, verificationLink);

    return { success: true, message: 'Check your email' };
}
```

---

### 5. Логіка верифікації (Pseudo-code)

```javascript
// POST /api/auth/verify-email
async function verifyEmail(token) {
    // 1. Знайти користувача з цим токеном
    const user = await User.findOne({ 
        verification_token: token,
        token_expires_at: { $gt: Date.now() } // Токен ще не закінчився
    });

    if (!user) {
        return { error: 'Token is invalid or expired' };
    }

    // 2. Встановити email_verified = true
    user.email_verified = true;
    user.verification_token = null;
    user.token_expires_at = null;
    await user.save();

    return { success: true, user };
}
```

---

### 6. Перевірка при логіні (опціонально)

На endpoint LOGIN можна додати перевірку:

```javascript
// POST /api/auth/login
if (!user.email_verified) {
    return { 
        error: 'Please verify your email first',
        email: user.email
    };
}
```

Або дозволити логіни, але показувати banner про верифікацію на сайті.

---

## Тестування 🧪

### Frontend flow:
1. ✅ Зареєструватися на `/register`
2. ✅ Редирект на `/verify`
3. ✅ Ввести код з email (коли backend почне відправляти)
4. ✅ SweetAlert2 показує результат

### Backend flow:
1. Відправити POST на `/api/users/registration`
2. Backend генерує токен
3. Backend відправляє email з посиланням
4. Користувач клікає посилання → автоматичне верифікація
5. Або користувач копіює код і вводить на сторінці `/verify`

---

## Environment Variables

Додайте у `.env.local`:

```
SENDGRID_API_KEY=SG.xxxxx...
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
```

---

## Дальші кроки

1. ✅ **Frontend готовий** — верифікація сторінка і логіка
2. 🔧 **Backend**: реалізувати endpoints й email сервіс
3. 🧪 **Тестування**: регістрація → email → верифікація → логін
4. 🚀 **Деплой**: SendGrid ключи на production
