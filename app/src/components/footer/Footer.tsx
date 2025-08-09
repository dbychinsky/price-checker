import './Footer.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from "../../stores/StoreContext.ts";

export const Footer = observer(() => {
    const {globalStore} = useStore();  // Получаем globalStore через useStore

    return (
        <div className='footer'>
            <p>Добавленные в отслеживаемый список товары хранятся на устройстве!</p>
            <p style={{color: 'red'}}>{`Занято в localStorage: ${globalStore.fullFilledLS.toFixed(6)} МБ`}</p>
            <p style={{color: 'red'}}>Beta-version: beta-price-checker-cache-v1</p>
        </div>
    );
});
