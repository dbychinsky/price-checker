import { ToastContainer } from "react-toastify";
import './Toast.scss';

export const Toast = () => {
    return (
        <ToastContainer
            position='top-right'
            autoClose={1400}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            // pauseOnFocusLoss
            draggable
            pauseOnHover={false}
            theme='colored'
            className='appToastContainer'
        />
    );
};