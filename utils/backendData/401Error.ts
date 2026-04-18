export const unauthorized = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    window.location.href = '/login';

    throw new Error('Сесія закінчилась. Будь ласка, увійдіть знову.');
};
