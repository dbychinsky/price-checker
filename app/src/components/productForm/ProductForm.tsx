import './ProductForm.scss';
import { Button } from "../button/Button.tsx";
import { GetUrlToMarketplace } from "../../utils/GetUrlToMarketplace.ts";
import { currencyList, IProductCurrency } from "../../models/Currency.ts";
import { Select } from "../select/Select.tsx";
import { observer } from "mobx-react-lite";
import { toast } from "react-toastify";
import { MessageList } from "../infoPanel/MessageList.ts";
import { IProductResponse } from "../../models/ProductResponse.ts";
import { Serialize } from "../../utils/Serialize.ts";
import { productExist } from "../../utils/ProductExist.ts";
import { useStore } from "../../stores/StoreContext.ts";
import { IProduct } from '../../models/Product.ts';
import { useEffect } from 'react';
import { Input } from '../input/Input.tsx';
import { PasteButton } from '../pasteButton/PasteButton.tsx';
import { InputDataProductRequest } from '../../common/enum/InputDataProductRequest.ts';
import mockData from '../../mocks/wb.json';

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
        const currentCurrency: IProductCurrency = service.loadCurrentCurrencyToLocalStorage();
        if (Object.keys(currentCurrency).length > 0) {
            globalStore.setCurrency(currentCurrency);
        } else {
            globalStore.setCurrency(currencyList[0])
        }
    }, []);

    // Обработка изменения валюты
    const onChangeSelect = (value: IProductCurrency) => {
        if (!value) return;
        globalStore.setCurrency(value);
    };

    // Добавление продукта в список
    const addProductToList = () => {
        globalStore.setIsLoading(true);
        const productUrlShort = GetUrlToMarketplace.getShortUrlMarketplace(globalStore.productUrl);
        const productId = Number(GetUrlToMarketplace.getUrl(productUrlShort));

        let productValue: number = 0;

        if (productUrlShort !== '') {

            if (checkingValueInput(productUrlShort) === InputDataProductRequest.PRODUCT_URL) {
                // Введенные данные это url
                productValue = productId
            }

            if (checkingValueInput(productUrlShort) === InputDataProductRequest.PRODUCT_ARTICLE) {
                productValue = Number(productUrlShort);
            }

            service.getProductFromWB(productValue, globalStore.currency)
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
    };

    // Сохранение нового продукта в список и LocalStorage
    const saveProduct = (response: IProductResponse) => {
        const productConvertedView = Serialize.responseToView(response);
        globalStore.setProductListView(productConvertedView);
        service.saveProductToLocalStorage(productConvertedView);
    };

    // Проверка изменения цены для каждого продукта
    const checkChangePrice = () => {
        const productListView: IProduct[] = globalStore.productListView;

        productListView.forEach((itemProduct, index) => {
            const mockProduct = mockData[index] as unknown as IProduct;
            compareProductPrices(itemProduct, mockProduct);
        });

        // productListView.forEach((itemProduct) => {
        //     service.getProductFromWB(itemProduct.id, globalStore.currency)
        //         .then((response) => {
        //             const responseProduct: IProduct = Serialize.responseToView(response);
        //             compareProductPrices(itemProduct, responseProduct);
        //         });
        // });
    };

    // Сравнение цен старого и нового продукта, обновление истории если цена изменилась
    const compareProductPrices = (itemProduct: IProduct | undefined, responseProduct: IProduct | undefined) => {
        // Нет данных у старого продукта — нечего сравнивать
        if (!itemProduct || !itemProduct.productInsideContent || !itemProduct.productInsideContent.productSize?.length) {
            return;
        }

        // Нет данных у нового продукта — нечего сравнивать
        if (!responseProduct || !responseProduct.productInsideContent || !responseProduct.productInsideContent.productSize?.length) {
            return;
        }

        const oldSizes = itemProduct.productInsideContent.productSize;
        const oldPrice = oldSizes[oldSizes.length - 1]?.size?.[0]?.priceList?.[0]?.priceTotal;

        const newSizes = responseProduct.productInsideContent.productSize;
        const newPrice = newSizes[0]?.size?.[0]?.priceList?.[0]?.priceTotal;

        if (oldPrice !== newPrice && newSizes.length > 0) {
            const updatedSizes = newSizes[0].size.map(size => ({
                ...size,
                priceList: size.priceList.map(price => ({
                    ...price,
                    dateAdded: price.dateAdded ? new Date(price.dateAdded) : new Date(),
                })),
            }));

            globalStore.updateProductSizeHistory(itemProduct.id, { size: updatedSizes });
        }
    };





    // Проверяем что введено - url или артикул
    const checkingValueInput = (inputText: string): InputDataProductRequest =>
        /\D/.test(inputText) ? InputDataProductRequest.PRODUCT_URL : InputDataProductRequest.PRODUCT_ARTICLE;

    return (
        <div className='product-form'>

            <div className={`top`}>

                <div className='input-wrapper'>
                    <Input value={globalStore.productUrl}
                           onChange={(value) => globalStore.setProductUrl(value)}
                           placeholder={'Ссылка или артикул'}/>
                    <PasteButton onPaste={(value) => globalStore.setProductUrl(value)}/>
                </div>

                <Select
                    options={currencyList}
                    onChange={(value) =>
                        onChangeSelect(currencyList.find(c => c.value === value)!)
                    }
                    value={globalStore.currency.value}/>
            </div>

            <Button
                text={'Добавить в список'}
                onClick={addProductToList}
                variant={'primary'}
            />
        </div>
    );

});