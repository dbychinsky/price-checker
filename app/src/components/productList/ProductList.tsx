import './ProductList.scss';
import {observer} from 'mobx-react-lite';
import {useEffect} from 'react';
import {useStore} from '../../stores/StoreContext.ts';
import {ProductListItem} from '../productListItem/ProductListItem.tsx';
import {ProductListIsEmpty} from './ProductListIsEmpty.tsx';

/**
 * Компонент списка продуктов.
 * Отображает список продуктов из глобального стора.
 * Загружает продукты из localStorage при первом рендере, если список пуст.
 */
export const ProductList = observer(() => {
    const {globalStore} = useStore();

    useEffect(() => {
        if (globalStore.productListView.length === 0) {
            globalStore.loadFromLocalStorage()
                .then();
        }
    }, []);

    return (
        <>{globalStore.productListView.length === 0
            ? <ProductListIsEmpty/>
            : <div className='product-list'>
                {globalStore.productListView.map(product => (
                    <ProductListItem key={product.id} product={product}/>
                ))}
            </div>}
        </>
    );
});