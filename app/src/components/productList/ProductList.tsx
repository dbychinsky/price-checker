import './ProductList.scss';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useStore } from '../../stores/StoreContext.ts';
import ProductListItem from '../productListItem/ProductListItem.tsx';

export const ProductList = observer(() => {
    const {globalStore} = useStore();

    useEffect(() => {
        if (globalStore.productListView.length === 0) {
            globalStore.loadFromLocalStorage().then();
        }
    }, []);

    return (
        <div className='productList'>
            {globalStore.productListView.map(product => (
                <ProductListItem product={product}/>
            ))}
        </div>
    );
});
