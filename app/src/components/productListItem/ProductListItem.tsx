import './ProductListItem.scss';
import { observer } from 'mobx-react-lite';
import { Button } from '../button/Button.tsx';
import DateUtils from '../../utils/DateUtils.ts';
import { IProduct } from '../../models/Product.ts';
import { useStore } from '../../stores/StoreContext.ts';
import { useState } from 'react';
import * as React from 'react';

interface ProductListItemProps {
    product: IProduct;
}

const ProductListItem = observer((props: ProductListItemProps) => {
    const {product} = props;
    const {globalStore} = useStore();
    const [isHideContent, setIsHideContent] = useState(true);

    const handleClick = () => {
        setIsHideContent(prev => !prev);
    };

    return (
        <div key={product.id} className={`productListItem ${isHideContent ? 'isHideContent' : ''}`}
             onClick={handleClick}>
            <div className='mainInfo'>
                <div className='productName'>
                    {product.productInsideContent.productName}
                </div>
                <Button text={product.id.toString()}
                        onClick={(e) => handleCopy(product.id, e)}
                        className={'article copy'}
                        variant={'iconText'}/>
            </div>
            <div className='priceList'>
                {product.productInsideContent.productSize.map((product, index) => (
                    <div key={index} className='productSizeOnDate'>
                        <div>{DateUtils.formatToISO(product.dateAdded)}</div>
                        {product.size.map((itemSize) => (
                            <div key={itemSize.nameSize} className='productForeignInfo'>
                                <div className='nameSize'>{itemSize.nameSize}</div>
                                <div className='origNameSize'>{itemSize.origNameSize}</div>
                                <div>
                                    {itemSize.priceList.map((itemPrice, index) => (
                                        <div key={index} className='priceTotal'>
                                            {itemPrice.priceTotal}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <div className='productListButtons'>
                <Button text={'Удалить'}
                        onClick={() => globalStore.removeProduct(product.id)}
                        variant={'secondary'}/>
                <Button text={'Перейти в каталог'}
                        onClick={() => globalStore.removeProduct(product.id)}
                        variant={'secondary'}/>
            </div>
        </div>
    );

    function handleCopy(id: number, e: React.MouseEvent) {
        e.stopPropagation();
        navigator.clipboard.writeText(id.toString()).then();
    };
});

export default ProductListItem;