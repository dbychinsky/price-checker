import './Header.scss';

export const Header = () => {
    return (
        <div className='header'>
            <div className='heading'>
                <div className='title'>Лови цену!</div>
                <div className='logo'></div>
            </div>
            <div className='logo'>Отслеживает цену - покупай выгодно на wildberries</div>
            {/*<div className='header-logo'>*/}
            {/*    <div className='logo'></div>*/}
            {/*    <h1>Отслеживайте изменения цен на товары</h1>*/}
            {/*</div>*/}
        </div>
    );
};
