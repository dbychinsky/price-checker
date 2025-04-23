import './ProductList.scss';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useStore } from '../../stores/StoreContext.ts';
import { Button } from "../button/Button.tsx";
import DateUtils from '../../utils/DateUtils.ts';

export const ProductList = observer(() => {
    const {globalStore} = useStore();

    useEffect(() => {
        if (globalStore.productListView.length === 0) {
            globalStore.loadFromLocalStorage();
        }
    }, []);

    return (
        <div className="productList">
            {globalStore.productListView.map(item => (
                <div key={item.id} className='product'>
                    <div className='id'>
                        {item.id}
                    </div>
                    <div>
                        {item.productInsideContent.productName}
                    </div>
                    <div>
                        {item.productInsideContent.productSize.map((product) => (
                            <div key={product.dateAdded.toDateString()}>
                                <div>{DateUtils.formatToISO(product.dateAdded)}</div>
                                <div>{product.size.map((itemSize) => (
                                    <div key={itemSize.nameSize}>
                                        <div>{itemSize.nameSize}</div>
                                        <div>
                                            {itemSize.priceList.map((itemPrice, index) => (
                                                <div key={index}>
                                                    {/*<div>{itemPrice.priceProduct}</div>*/}
                                                    <div>{itemPrice.priceTotal}</div>
                                                    {/*<div>{itemPrice.priceBasic}</div>*/}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}</div>
                            </div>
                        ))}
                    </div>
                    {/*{item.productInsideContent.map((itemDescription) => (*/}
                    {/*    <div key={item.id}>*/}
                    {/*        <div className='productName'>{itemDescription.productName}</div>*/}
                    {/*        <div>{itemDescription.dateAdded.toLocaleDateString()}</div>*/}
                    {/*        {itemDescription.size.map((itemSize, index) => (*/}
                    {/*            <div key={index} className='productListVariation'>*/}
                    {/*                <div>{itemSize.origNameSize}</div>*/}
                    {/*                <div>{itemSize.nameSize}</div>*/}
                    {/*                {itemSize.priceList.map((itemPrice, index) => (*/}
                    {/*                    <div key={index}>*/}
                    {/*                        <div>{itemPrice.priceProduct}</div>*/}
                    {/*                        <div>{itemPrice.priceTotal}</div>*/}
                    {/*                        <div>{itemPrice.priceBasic}</div>*/}
                    {/*                    </div>*/}
                    {/*                ))}*/}
                    {/*                /!*<Button text={'delete item'}*!/*/}
                    {/*                /!*        onClick={() => globalStore.removeItemFromProduct(item.id, itemSize.origNameSize)}/>*!/*/}
                    {/*            </div>*/}
                    {/*        ))}*/}
                    {/*    </div>*/}
                    {/*))}*/}
                    <div className="productListButtons">
                        <Button text={'delete'}
                                onClick={() => globalStore.removeProduct(item.id)}/>
                    </div>
                </div>
            ))}
        </div>
    );

});
