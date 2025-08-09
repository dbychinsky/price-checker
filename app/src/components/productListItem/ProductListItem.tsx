import './ProductListItem.scss';
import {observer} from 'mobx-react-lite';
import {Button} from '../button/Button.tsx';
import {IProduct} from '../../models/Product.ts';
import {useStore} from '../../stores/StoreContext.ts';
import React, {useState} from 'react';
import {CopyButton} from "../copyButton/CopyButton.tsx";
import {ProductSizeOnDate} from './productSizeOnDate/ProductSizeOnDate.tsx';
import {clsx} from 'clsx';
import {ConfirmModal} from '../сonfirmModal/ConfirmModal.tsx';

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
    const [isModalOpen, setIsModalOpen] = useState(false);

    const wildberriesUrlEnv = import.meta.env.VITE_WILDBERRIES_URL;

    const handleClick = () => {
        setIsHideContent(prev => !prev);
    };

    const productListItemWrapper = clsx(
        'product-list-item',
        {'is-hide-content': isHideContent}
    );

    const openModal = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const confirmDelete = () => {
        globalStore.removeProduct(product.id);
        setIsModalOpen(false);
    };

    const goToProduct = (id: number, e?: React.MouseEvent<HTMLElement>) => {
        e?.stopPropagation();
        window.open(
            `${wildberriesUrlEnv}/catalog/${id}/detail.aspx`,
            '_blank',
            'noopener,noreferrer'
        );
    };

    return (
        <div
            // className={`product-list-item ${isHideContent ? 'is-hide-content' : ''}`}
            className={productListItemWrapper}
            onClick={handleClick}
        >
            <div className='main-info'>
                <h2 className='product-name'>
                    {product.productInsideContent.productName}
                </h2>
                <div className='icon'></div>
                <CopyButton textToCopy={product.id.toString()} className={'article'}/>
            </div>
            <div className='price-list'>
                {product.productInsideContent.productSize.map((productSize, index) => (
                    <ProductSizeOnDate
                        product={productSize}
                        key={index}/>
                ))}
            </div>
            <div className='product-list-buttons'>
                <Button
                    text={'Удалить'}
                    onClick={openModal}
                    variant={'secondary'}
                    className={'red'}
                />
                <Button
                    text={'Перейти в каталог'}
                    // onClick={() => globalStore.removeProduct(product.id)}
                    onClick={(e) => goToProduct(product.id, e)}
                    variant={'secondary'}
                    className={'purple'}
                />
            </div>
            <ConfirmModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onConfirm={confirmDelete}
            />
        </div>
    );

});
