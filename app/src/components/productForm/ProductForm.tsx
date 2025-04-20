import './ProductForm.scss';
import { Button } from "../button/Button.tsx";
import { GetUrlToMarketplace } from "../../utils/GetUrlToMarketplace.ts";
import { IProductLink } from "../../models/ProductLink.ts";
import { currencyList, IProductCurrency } from "../../models/Currency.ts";
import { Select } from "../select/Select.tsx";
import { observer } from "mobx-react-lite";
import { toast } from "react-toastify";
import { MessageList } from "../infoPanel/MessageList.ts";
import { IProductResponse } from "../../models/ProductResponse.ts";
import { Serialize } from "../../utils/Serialize.ts";
import { productExist } from "../../utils/ProductExist.ts";
import { useStore } from "../../stores/StoreContext.ts";

export const ProductForm = observer(() => {
    const {globalStore, service} = useStore();  // Используем useStore для получения доступа к globalStore и service

    return (
        <div className='productForm'>
            <div className={`top`}>
                <label>Укажите ссылку на товар</label>
                <Select
                    options={currencyList}
                    onChange={(value) => onChangeSelect(currencyList.find(c => c.value === value)!)}
                />
            </div>
            <input
                value={globalStore.productUrl}
                onChange={(value) =>
                    onChangeInput(value.target.value)}
            />
            <Button
                text={'Добавить в список'}
                onClick={addProductToList}
                variant={'primary'}
            />
        </div>
    );

    function onChangeInput(value: string) {
        globalStore.setProductUrl(value);  // Обновляем URL продукта
    }

    function onChangeSelect(value: IProductCurrency) {
        if (!value) return; // Защита от ошибок
        globalStore.setCurrency(value);  // Обновляем валюту
    }

    function addProductToList() {
        globalStore.setIsLoading(true);
        const productUrlShort = GetUrlToMarketplace.getShortUrlMarketplace(globalStore.productUrl);
        const productId = Number(GetUrlToMarketplace.getUrl(productUrlShort));
        const productLinkToWb: IProductLink = {id: productId, url: productUrlShort}

        if (productUrlShort !== '') {
            service.getProductFromWB(productId, globalStore.currency)
                .then(responseProduct =>
                    productExist(responseProduct.id, globalStore.productListView)
                        ? toast.error(MessageList.ERROR_PRODUCT_EXISTS)
                        : saveProduct(responseProduct, productLinkToWb))
                .catch(() => toast.error(MessageList.ERROR_PRODUCT_ADD))
                .finally(() => {
                    globalStore.setProductUrl('');
                    globalStore.setIsLoading(false);
                });
        } else {
            toast.error(MessageList.ERROR_EMPTY_URL);
        }
    }

    function saveProduct(response: IProductResponse, productLinkToWb: IProductLink) {
        const productConvertedView = Serialize.responseToView(response);  // Преобразуем ответ

        globalStore.addProductListView(productConvertedView);  // Добавляем продукт в список
        service.saveProductToLocalStorage(productConvertedView).then();  // Сохраняем продукт в LocalStorage
        console.log(productLinkToWb);
        console.log(productConvertedView);
    }
});
