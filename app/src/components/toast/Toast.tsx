import { ToastContainer } from "react-toastify";
import './Toast.scss';

export const Toast = () => {
    return (
        <ToastContainer
            position='top-right'
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme='colored'
            className='appToastContainer'
        />
    );
};