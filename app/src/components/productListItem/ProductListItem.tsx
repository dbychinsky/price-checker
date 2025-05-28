import './ProductListItem.scss';
import { observer } from 'mobx-react-lite';
import { Button } from '../button/Button.tsx';
import { IProduct } from '../../models/Product.ts';
import { useStore } from '../../stores/StoreContext.ts';
import { useState } from 'react';
import { CopyButton } from "../copyButton/CopyButton.tsx";
import { ProductSizeOnDate } from './productSizeOnDate/ProductSizeOnDate.tsx';
import { clsx } from 'clsx';

interface ProductListItemProps {
    product: IProduct;
}

/**
 * Компонент для отображения одного продукта в списке.
 * Показывает название продукта, кнопку копирования ID, цены по размерам,
 * а также кнопки для удаления и перехода в каталог.
 *
 * @param {ProductListItemProps} props - Свойства компонента
 * @param {IProduct} props.product - Объект продукта для отображения
 * @returns {JSX.Element} React элемент продукта в списке
 */
export const ProductListItem = observer((props: ProductListItemProps) => {
    const {product} = props;
    const {globalStore} = useStore();
    const [isHideContent, setIsHideContent] = useState(true);
    const [isChanged, setIsChanged] = useState(false);

    const handleClick = () => {
        setIsHideContent(prev => !prev);
    };

    const productListItemWrapper = clsx(
        'product-list-item',
        {'is-hide-content': isHideContent},
        {'is-changed': isChanged}
    );


    return (
        <div
            // className={`product-list-item ${isHideContent ? 'is-hide-content' : ''}`}
            className={productListItemWrapper}
            onClick={handleClick}
        >
            <div className='main-info'>
                <div className='product-name'>
                    {product.productInsideContent.productName}
                </div>
                <CopyButton textToCopy={product.id.toString()} className={'article'}/>
            </div>
            <div className='price-list'>
                {product.productInsideContent.productSize.map((productSize, index) => (
                    <ProductSizeOnDate
                        product={productSize}
                        key={index}
                        setIsChanged={setIsChanged}/>
                ))}
            </div>
            <div className='product-list-buttons'>
                <Button
                    text={'Удалить'}
                    onClick={() => globalStore.removeProduct(product.id)}
                    variant={'secondary'}
                />
                <Button
                    text={'Перейти в каталог'}
                    onClick={() => globalStore.removeProduct(product.id)} // Возможно, тут ошибка - должно быть действие перехода, а не удаления
                    variant={'secondary'}
                />
            </div>
        </div>
    );
});
