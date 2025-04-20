import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useStore } from '../../stores/StoreContext.ts';
import { Button } from "../button/Button.tsx"; // Хук для доступа к стору

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
                <>
                    <div key={item.id}>
                        {item.id}
                        {item.productInsideContent.map((itemDescription) => (
                            <div key={itemDescription.productName}>
                                <div>{itemDescription.productName}</div>
                                <div>{itemDescription.dateAdded.toLocaleDateString()}</div>
                                <div>
                                    {itemDescription.size.map((itemSize, index) => (
                                        <div key={index}>
                                            <div>{itemSize.origNameSize}</div>
                                            <div>{itemSize.nameSize}</div>
                                            <div>
                                                {itemSize.priceList.map((itemPrice, index) => (
                                                    <div key={index}>
                                                        <div>{itemPrice.priceProduct}</div>
                                                        <div>{itemPrice.priceTotal}</div>
                                                        <div>{itemPrice.priceBasic}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="productListButtons">
                        <Button text={'delete'}
                                onClick={() => globalStore.removeProduct(item.id)}/>
                    </div>
                </>
            ))}
        </div>
    );

});
