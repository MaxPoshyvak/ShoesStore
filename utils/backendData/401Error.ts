import Swal from 'sweetalert2';

export const unauthorized = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please log in to your account.',
        showCancelButton: true,
        confirmButtonColor: '#000',
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Go to Login',
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = '/login';
        } else {
            window.location.reload();
        }
    });

    // throw new Error('Session expired. Please log in again.');
};
