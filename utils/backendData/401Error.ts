import Swal from 'sweetalert2';

export const unauthorized = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    window.location.href = '/login';

    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Session expired. Please log in again.',
        confirmButtonColor: '#000',
    });

    // throw new Error('Session expired. Please log in again.');
};
