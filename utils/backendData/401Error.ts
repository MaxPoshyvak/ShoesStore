import Swal from 'sweetalert2';

export const unauthorized = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Session expired. Please log in again.',
        confirmButtonColor: '#000',
        confirmButtonText: 'Go to Login',
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = '/login';
        }
    });

    // throw new Error('Session expired. Please log in again.');
};
