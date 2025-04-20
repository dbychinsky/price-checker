import { observer } from 'mobx-react-lite';
import { useStore } from '../../stores/StoreContext.ts';  // Импортируем хук для получения контекста

export const ProductList = observer(() => {
    const { globalStore } = useStore();  // Используем useStore для получения доступа к globalStore

    return (
        <div>
            {globalStore.productListView.map(item => (
                <div key={item.id}>
                    {item.id}
                    {item.productInsideContent.map((itemDescription) => (
                        <div key={itemDescription.productName}>
                            <div>{itemDescription.productName}</div>
                            <div>{itemDescription.dateAdded.toDateString()}</div>
                            <div>{itemDescription.size.map((itemSize, index) => (
                                <div key={index}>
                                    <div>{itemSize.origNameSize}</div>
                                    <div>{itemSize.nameSize}</div>
                                    <div>{itemSize.priceList.map((itemPrice, index) => (
                                        <div key={index}>
                                            <div>{itemPrice.priceProduct}</div>
                                            <div>{itemPrice.priceTotal}</div>
                                            <div>{itemPrice.priceBasic}</div>
                                        </div>
                                    ))}</div>
                                </div>
                            ))}</div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
});
