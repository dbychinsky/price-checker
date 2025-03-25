import './ProductForm.scss';
import { globalStore } from "../../store/globalStore.ts";
import { Button } from "../button/Button.tsx";
import { GetUrlToMarketplace } from "../../utils/GetUrlToMarketplace.ts";
import { IProductLink } from "../../models/ProductLink.ts";
import { currencyList, IProductCurrency } from "../../models/Currency.ts";
import { Select } from "../select/Select.tsx";
import { observer } from "mobx-react-lite";
import { service } from "../../App.tsx";
import { productExist } from "../../utils/ProductExist.ts";
import { toast } from "react-toastify";
import { MessageList } from "../infoPanel/MessageList.ts";
import { IProductResponse } from "../../models/ProductResponse.ts";
import { Serialize } from "../../utils/Serialize.ts";

export const ProductForm = observer(() => {
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
        globalStore.setProductUrl(value);
    }

    function onChangeSelect(value: IProductCurrency) {
        if (!value) return; // Защита от ошибок
        globalStore.setCurrency(value);
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
                .finally(
                    () => {
                        globalStore.setProductUrl('')
                        globalStore.setIsLoading(false)
                    }
                );
        } else {
            toast.error(MessageList.ERROR_EMPTY_URL)
        }
    }

    function saveProduct(response: IProductResponse, productLinkToWb: IProductLink) {
        const productConvertedView = Serialize.responseToView(response);
        globalStore.addProductListView(productConvertedView);
        service.saveProductToLocalStorage(Serialize.responseToView(response)).then();

        // setProductList([... productList, productConvertedView]);
        // service.saveProductToLocalStorage(Serialize.responseToStorage(response)).then();
        // service.saveLinkToLocalStorage(productLinkToWb).then();
    }

});
