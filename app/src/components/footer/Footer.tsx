import './Footer.scss';
import { globalStore } from '../../store/globalStore.ts';
import { observer } from 'mobx-react-lite';

export const Footer = observer(() => {
    return (
        <div className='footer'>
            <p>Добавленные в отслеживаемый список товары хранятся на устройстве!</p>
            <p style={{color: 'red'}}>{`Занято в localStorage: ${globalStore.fullFilledLS.toFixed(6)} МБ`}</p>
        </div>
    );
});
