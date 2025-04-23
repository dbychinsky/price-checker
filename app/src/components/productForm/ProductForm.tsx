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
import { IProduct, IProductPrice, ISize } from '../../models/Product.ts';
import { toJS } from 'mobx';
import mockData from '../../mocks/wb.json';

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
            <Button
                text={'checkChangePrice'}
                onClick={checkChangePrice}
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
        globalStore.setProductListView(productConvertedView);  // Добавляем продукт в список
        service.saveProductToLocalStorage(productConvertedView).then();  // Сохраняем продукт в LocalStorage
    }

    function checkChangePrice() {
        const productListView: IProduct[] = globalStore.productListView;

        productListView.forEach((itemProduct) => {
            service.getProductFromWB(itemProduct.id, globalStore.currency)
                .then((response) => {
                    const responseProduct: IProduct = Serialize.responseToView(response);


                    // @ts-ignore
                    // compareProductPrices(itemProduct, mockData[0]);
                    compareProductPrices(itemProduct, responseProduct);
                });
        });
    }

    function compareProductPrices(itemProduct: IProduct, responseProduct: IProduct) {
        const itemProductSize = itemProduct.productInsideContent.productSize;

        const responseProductSize: ISize[] = responseProduct.productInsideContent.productSize[0].size;
        const responsePriceList: IProductPrice[] = responseProduct.productInsideContent.productSize[0].size[0].priceList;
        const responseNameSize: string = responseProduct.productInsideContent.productSize[0].size[0].nameSize;
        const responseOrigNameSize: string = responseProduct.productInsideContent.productSize[0].size[0].origNameSize;
        let priceListFinded: IProductPrice[] = [];

        itemProductSize.map((item) => {
            item.size.map((itemSize) => {
                const nameSize = itemSize.nameSize;
                const origNameSize = itemSize.origNameSize;

                console.log(toJS(item), toJS(itemSize));
                // if (nameSize !== '') {
                //     priceListFinded = responseProductSize.find((itemResponseProductSize) => itemResponseProductSize.nameSize === nameSize)?.priceList || [];
                // } else {
                //     priceListFinded = responseProductSize.find((itemResponseProductSize) => itemResponseProductSize.origNameSize === origNameSize)?.priceList || [];
                // }

                if (nameSize !== '') {
                     responseProductSize.find((itemResponseProductSize) => itemResponseProductSize.nameSize === nameSize);
                } else {
                    priceListFinded = responseProductSize.find((itemResponseProductSize) => itemResponseProductSize.origNameSize === origNameSize)?.priceList || [];
                }

                // console.log(priceListFinded);
            });
        });

    }


});
