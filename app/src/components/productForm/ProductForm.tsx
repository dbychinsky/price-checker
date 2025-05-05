import './ProductForm.scss';
import {Button} from "../button/Button.tsx";
import {GetUrlToMarketplace} from "../../utils/GetUrlToMarketplace.ts";
import {currencyList, IProductCurrency} from "../../models/Currency.ts";
import {Select} from "../select/Select.tsx";
import {observer} from "mobx-react-lite";
import {toast} from "react-toastify";
import {MessageList} from "../infoPanel/MessageList.ts";
import {IProductResponse} from "../../models/ProductResponse.ts";
import {Serialize} from "../../utils/Serialize.ts";
import {productExist} from "../../utils/ProductExist.ts";
import {useStore} from "../../stores/StoreContext.ts";
import {IProduct} from '../../models/Product.ts';
import {useEffect} from 'react';

export const ProductForm = observer(() => {
    const {globalStore, service} = useStore();

    // При монтировании компонента загружаем продукты и проверяем изменение цен
    useEffect(() => {
        globalStore.loadFromLocalStorage().then(() => {
            if (globalStore.productListView.length > 0) {
                checkChangePrice();
            }
        });
    }, []);

    useEffect(() => {
        globalStore.setCurrency(service.loadCurrentCurrencyToLocalStorage());
    }, []);

    useEffect(() => {

    }, [globalStore.currency]);

    return (
        <div className='product-form'>
            <div className={`top`}>
                <label>Укажите ссылку на товар</label>
                <Select
                    options={currencyList}
                    onChange={(value) =>
                        onChangeSelect(currencyList.find(c => c.value === value)!)
                    }
                    value={globalStore.currency.value}
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

    // Обработка изменения URL продукта
    function onChangeInput(value: string) {
        globalStore.setProductUrl(value);
    }

    // Обработка изменения валюты
    function onChangeSelect(value: IProductCurrency) {
        if (!value) return;
        globalStore.setCurrency(value);
    }

    // Добавление продукта в список
    function addProductToList() {
        globalStore.setIsLoading(true);
        const productUrlShort = GetUrlToMarketplace.getShortUrlMarketplace(globalStore.productUrl);
        const productId = Number(GetUrlToMarketplace.getUrl(productUrlShort));
        // const productLinkToWb: IProductLink = {id: productId, url: productUrlShort};
        if (productUrlShort !== '') {
            service.getProductFromWB(productId, globalStore.currency)
                .then(responseProduct =>
                    productExist(responseProduct.id, globalStore.productListView)
                        ? toast.error(MessageList.ERROR_PRODUCT_EXISTS)
                        : saveProduct(responseProduct))
                .catch(() => toast.error(MessageList.ERROR_PRODUCT_ADD))
                .finally(() => {
                    globalStore.setProductUrl('');
                    globalStore.setIsLoading(false);
                });
        } else {
            toast.error(MessageList.ERROR_EMPTY_URL);
        }
    }

    // Сохранение нового продукта в список и LocalStorage
    function saveProduct(response: IProductResponse) {
        const productConvertedView = Serialize.responseToView(response);
        globalStore.setProductListView(productConvertedView);
        service.saveProductToLocalStorage(productConvertedView);
    }

    // Проверка изменения цены для каждого продукта
    function checkChangePrice() {
        const productListView: IProduct[] = globalStore.productListView;

        // productListView.forEach((itemProduct, index) => {
        //     const mockProduct = mockData[index] as unknown as IProduct;
        //     compareProductPrices(itemProduct, mockProduct);
        // });

        productListView.forEach((itemProduct) => {
            service.getProductFromWB(itemProduct.id, globalStore.currency)
                .then((response) => {
                    const responseProduct: IProduct = Serialize.responseToView(response);
                    compareProductPrices(itemProduct, responseProduct);
                });
        });
    }

    // Сравнение цен старого и нового продукта, обновление истории если цена изменилась
    function compareProductPrices(itemProduct: IProduct, responseProduct: IProduct) {
        const sizes = itemProduct.productInsideContent.productSize;
        const oldPrice = sizes?.[sizes.length - 1]?.size?.[0]?.priceList?.[0]?.priceTotal;
        const newPrice = responseProduct.productInsideContent.productSize?.[0]?.size?.[0]?.priceList?.[0]?.priceTotal;

        if (oldPrice !== newPrice) {
            const newSizeData = {
                size: responseProduct.productInsideContent.productSize[0].size,
                dateAdded: new Date(),
            };

            // Обновление истории productSize в сторе при изменении цены
            globalStore.updateProductSizeHistory(itemProduct.id, newSizeData);
        }
    }
});