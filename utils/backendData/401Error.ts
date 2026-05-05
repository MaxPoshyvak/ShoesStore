export const unauthorized = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    window.location.href = '/login';

    throw new Error('Session expired. Please log in again.');
};
