import { IProductPrice, IProductSize } from "../../../models/Product";
import DateUtils from "../../../utils/DateUtils";
import "./ProductSizeOnDate.scss"
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../stores/StoreContext.ts';
import { clsx } from 'clsx';

interface ProductSizeOnDateProps {
    product: IProductSize;
    setIsChanged: (value: boolean) => void;
}

/**
 * Компонент отображает информацию о размерах продукта и их ценах на конкретные даты.
 * Для каждого размера выводится имя, оригинальное имя (если не '0'),
 * а также список цен с датами добавления.
 *
 * @param {ProductSizeOnDateProps} props - Свойства компонента
 * @param {IProductSize} props.product - Данные о размере продукта и связанных ценах
 * @returns {JSX.Element} React элемент с информацией о размерах и ценах
 */
export const ProductSizeOnDate = observer((props: ProductSizeOnDateProps) => {
    const {product, setIsChanged} = props;
    const {analyticsStore} = useStore();

    const analicitic = (priceList: IProductPrice[]): string => {
        const result = analyticsStore.comparePriceItem(priceList)
        if (result) {
            setIsChanged(true);
            return result
        } else {
            return ''
        }
    }

    return (
        <div className={clsx('product-size-on-date',)}>
            {product.size.map((itemSize) => (
                <div key={itemSize.nameSize} className='product-foreign-info'>
                    <div className='name-size'>{itemSize.nameSize}</div>
                    {itemSize.origNameSize !== '0' && (
                        <div className='orig-name-size'>{itemSize.origNameSize}</div>
                    )}
                    <div className='price-total'>
                        {itemSize.priceList.map((itemPrice, index) => (
                            <div key={index} className='info'>
                                <div className='date'>
                                    {DateUtils.formatDateToDayMonth(itemPrice.dateAdded)}
                                </div>
                                <div className='sum'>
                                    {itemPrice.priceTotal !== null ? itemPrice.priceTotal :
                                        <div className='emptySum'>Товар отсутствует</div>}
                                </div>
                            </div>
                        ))}
                        {/*<div>{analyticsStore.comparePriceItem(itemSize.priceList)}</div>*/}
                        <div>{analicitic(itemSize.priceList)}</div>
                    </div>
                </div>
            ))}
        </div>
    );
});
