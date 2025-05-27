import { IProductSize } from "../../../models/Product";
import DateUtils from "../../../utils/DateUtils";
import "./ProductSizeOnDate.scss"

interface ProductSizeOnDateProps {
    product: IProductSize;
}

const ProductSizeOnDate = (props: ProductSizeOnDateProps) => {
    const {product} = props;

    return (
        <div className='product-size-on-date'>
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
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductSizeOnDate;