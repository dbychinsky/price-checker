import './ProductListItem.scss';
import {observer} from 'mobx-react-lite';
import {Button} from '../button/Button.tsx';
import {IProduct} from '../../models/Product.ts';
import {useStore} from '../../stores/StoreContext.ts';
import {useState} from 'react';
import {CopyButton} from "../copyButton/CopyButton.tsx";
import { ProductSizeOnDate } from './productSizeOnDate/ProductSizeOnDate.tsx';

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
        <div className={`product-list-item ${isHideContent ? 'is-hide-content' : ''}`}
             onClick={handleClick}>
            <div className='main-info'>
                <div className='product-name'>
                    {product.productInsideContent.productName}
                </div>
                <CopyButton textToCopy={product.id.toString()}
                            className={'article'}/>
            </div>
            <div className='price-list'>
                {product.productInsideContent.productSize.map((product, index) => (
                    <ProductSizeOnDate product={product} key={index}/>
                ))}
            </div>
            <div className='product-list-buttons'>
                <Button text={'Удалить'}
                        onClick={() => globalStore.removeProduct(product.id)}
                        variant={'secondary'}/>
                <Button text={'Перейти в каталог'}
                        onClick={() => globalStore.removeProduct(product.id)}
                        variant={'secondary'}/>
            </div>
        </div>
    );
});

export default ProductListItem;