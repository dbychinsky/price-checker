import {IProductPrice, IProductSize} from "../../../models/Product";
import DateUtils from "../../../utils/DateUtils";
import "./ProductSizeOnDate.scss"
import {observer} from 'mobx-react-lite';
import {useStore} from '../../../stores/StoreContext.ts';
import {clsx} from 'clsx';

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
    const {analyticsStore} = useStore();

    const analytic = (priceList: IProductPrice[]): string => {
        const result = analyticsStore.comparePriceItem(priceList)
        if (result) {
            return result
        } else {
            return ''
        }
    }

    return (
        <div className={clsx('product-size-on-date',)}>
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

                    <table className='info' cellPadding={0} cellSpacing={0}>
                        <thead>
                        <tr className='date'>
                            {itemSize.priceList.map((itemPrice, index) => (
                                <th key={`header-${index}`}>
                                    {DateUtils.formatDateToDayMonth(itemPrice.dateAdded)}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        <tr className='sum'>
                            {itemSize.priceList.map((itemPrice, index) => (
                                <td key={`cell-${index}`}>
                                    {itemPrice.priceTotal !== null ? (
                                        itemPrice.priceTotal
                                    ) : (
                                        <div className="emptySum">Товар отсутствует</div>
                                    )}
                                </td>
                            ))}
                        </tr>
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
});
