import './ProductListItem.scss';
import {observer} from 'mobx-react-lite';
import {Button} from '../button/Button.tsx';
import {IProduct} from '../../models/Product.ts';
import {useStore} from '../../stores/StoreContext.ts';
import React, {useEffect, useState} from 'react';
import {CopyButton} from "../copyButton/CopyButton.tsx";
import {ProductSizeOnDate} from './productSizeOnDate/ProductSizeOnDate.tsx';
import {clsx} from 'clsx';
import {ConfirmModal} from '../сonfirmModal/ConfirmModal.tsx';

interface ProductListItemProps {
    /** Продукт для отображения */
    product: IProduct;
}

/**
 * Компонент отображения одного элемента списка продуктов.
 * Отображает основную информацию, список размеров с ценами,
 * кнопки для удаления и перехода в каталог,
 * а также модальное окно подтверждения удаления.
 *
 * @param {ProductListItemProps} props - пропсы компонента
 * @returns {JSX.Element} - JSX элемент компонента
 */
export const ProductListItem = observer(({product}: ProductListItemProps) => {
    const {globalStore} = useStore();

    /** Локальное состояние для сворачивания/разворачивания контента */
    const [isHideContent, setIsHideContent] = useState(globalStore.collapseAll);

    /** Локальное состояние для отображения модального окна подтверждения удаления */
    const [isModalOpen, setIsModalOpen] = useState(false);

    /** URL Wildberries из переменных окружения */
    const wildberriesUrlEnv = import.meta.env.VITE_WILDBERRIES_URL;

    /**
     * Синхронизация локального состояния isHideContent с глобальным collapseAll
     * при изменении глобального состояния.
     */
    useEffect(() => {
        setIsHideContent(globalStore.collapseAll);
    }, [globalStore.collapseAll]);

    /** Обработчик клика по элементу для переключения сворачивания контента */
    const handleClick = () => {
        setIsHideContent(prev => !prev);
    };

    /** Классы для корневого элемента компонента */
    const productListItemWrapper = clsx(
        'product-list-item',
        {'is-hide-content': isHideContent}
    );

    /**
     * Открыть модальное окно подтверждения удаления.
     * @param {React.MouseEvent<HTMLButtonElement>} e - событие клика по кнопке
     */
    const openModal = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setIsModalOpen(true);
    };

    /** Закрыть модальное окно */
    const closeModal = () => setIsModalOpen(false);

    /** Подтверждение удаления: удаляет продукт из глобального стора и закрывает модал */
    const confirmDelete = () => {
        globalStore.removeProduct(product.id);
        setIsModalOpen(false);
    };

    /**
     * Открыть страницу продукта на Wildberries в новой вкладке.
     * @param {number} id - ID продукта
     * @param {React.MouseEvent<HTMLElement>} [e] - необязательное событие клика для остановки всплытия
     */
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
                        key={index}
                    />
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
