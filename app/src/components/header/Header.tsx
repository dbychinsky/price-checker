import './Header.scss';

export const Header = () => {
    return (
        <div className='header'>
            <div className='heading'>
                <h1>Лови цену!</h1>
                <div className='logo'></div>
            </div>
            <div className='title'>Цены падают — ты выигрываешь <span>на Wildberries</span></div >
        </div>
    );
};