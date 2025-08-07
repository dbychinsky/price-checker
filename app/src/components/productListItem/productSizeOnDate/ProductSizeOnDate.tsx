import {IProductSize} from "../../../models/Product";
import DateUtils from "../../../utils/DateUtils";
import "./ProductSizeOnDate.scss"
import {observer} from 'mobx-react-lite';

// import { useStore } from '../../../stores/StoreContext.ts';

interface ProductSizeOnDateProps {
    product: IProductSize;
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
    const {product} = props;
    // const {analyticsStore} = useStore();

    // const analytic = (priceList: IProductPrice[]): string => {
    //     const result = analyticsStore.comparePriceItem(priceList)
    //     if (result) {
    //         return result
    //     } else {
    //         return ''
    //     }
    // }

    return (
        <div className={'product-size-on-date'}>
            <div className='date-list'>
                <div className='date-item'>Размер</div>
                {product.size[0].priceList.map((date, index) => (
                    <div key={index} className='date-item'>
                        {DateUtils.formatDateToDayMonth(date.dateAdded)}
                    </div>
                ))}
            </div>

            {product.size.map((itemSize, index) => (
                <div key={index} className='product-foreign-info'>
                    <div className='product-description'>
                        {itemSize.nameSize && (
                            <div className='name-size'>{itemSize.nameSize}</div>
                        )}
                        {itemSize.origNameSize &&
                            itemSize.origNameSize !== '0' &&
                            itemSize.origNameSize !== itemSize.nameSize && (
                                <div className='orig-name-size'>{itemSize.origNameSize}</div>
                            )}
                    </div>
                    <div className={'sum-list'}>
                        {itemSize.priceList.map((itemPrice, index) => (
                            <div key={`cell-${index}`} className={'cell'}>
                                {itemPrice.priceTotal !== null ? (
                                    itemPrice.priceTotal
                                ) : (
                                    <div className="emptySum">Товар отсутствует</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
});
