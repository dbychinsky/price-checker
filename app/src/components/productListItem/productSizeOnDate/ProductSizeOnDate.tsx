import {IProductSize} from "../../../models/Product";
import DateUtils from "../../../utils/DateUtils";
import "./ProductSizeOnDate.scss"


interface ProductSizeOnDateProps {
    product: IProductSize;
}

const ProductSizeOnDate = (props: ProductSizeOnDateProps) => {
    const {product} = props;

    return (
        <div className='product-size-on-date'>
            {/*<div>{DateUtils.formatToISO(product.dateAdded)}</div>*/}
            {product.size.map((itemSize) => (
                <div key={itemSize.nameSize} className='product-foreign-info'>
                    <div className='name-size'>{itemSize.nameSize}</div>
                    <div className='orig-name-size'>{itemSize.origNameSize}</div>
                    <div className='price-total'>
                        {
                            itemSize.priceList.map((itemPrice) => (
                                <div key={itemPrice.priceTotal} className='price-total-item'>
                                    {itemPrice.priceTotal}
                                    {DateUtils.formatToISO(itemPrice.dateAdded)}
                                </div>
                            ))
                        }
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductSizeOnDate;