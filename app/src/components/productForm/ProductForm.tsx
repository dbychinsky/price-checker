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
import {Input} from '../input/Input.tsx';
import {PasteButton} from '../pasteButton/PasteButton.tsx';
import {InputDataProductRequest} from '../../common/enum/InputDataProductRequest.ts';

/**
 * Компонент формы для управления списком продуктов.
 * Позволяет добавлять продукты по URL или артикулу,
 * выбирать валюту, а также сворачивать и разворачивать весь список.
 *
 * Использует MobX для управления состоянием и сервис для API и LocalStorage.
 *
 * @component
 * @returns {JSX.Element} React-компонент формы продуктов
 */
export const ProductForm = observer(() => {
    const {globalStore, service} = useStore();

    /**
     * Загружает продукты из localStorage при первом рендере.
     * Если есть продукты, проверяет изменение цен.
     */
    useEffect(() => {
        globalStore.loadFromLocalStorage().then(() => {
            if (globalStore.productListView.length > 0) {
                checkChangePrice();
            }
        });
    }, []);

    /**
     * Загружает текущую валюту из localStorage,
     * либо устанавливает валюту по умолчанию.
     */
    useEffect(() => {
        const currentCurrency: IProductCurrency = service.loadCurrentCurrencyToLocalStorage();
        if (Object.keys(currentCurrency).length > 0) {
            globalStore.setCurrency(currentCurrency);
        } else {
            globalStore.setCurrency(currencyList[0])
        }
    }, []);

    /**
     * При изменении валюты обновляет данные продуктов из API
     * и проверяет изменение цен.
     */
    useEffect(() => {
        globalStore.productListView.map((productItem) => {
            service.getProductFromWB(productItem.id, globalStore.currency)
                .then(responseProduct => {
                    globalStore.removeProduct(productItem.id);
                    saveProduct(responseProduct);
                })
                .then(() => checkChangePrice());
        })
    }, [globalStore.currency]);

    /**
     * Обработчик изменения выбранной валюты.
     * @param {IProductCurrency} value - новая валюта
     */
    const onChangeSelect = (value: IProductCurrency) => {
        if (!value) return;
        globalStore.setCurrency(value);
    };

    /**
     * Добавляет продукт в список по введённому URL или артикулу.
     * Парсит ввод, получает данные с API, проверяет дубли,
     * сохраняет в стор и localStorage, выводит ошибки через toast.
     */
    const addProductToList = () => {
        globalStore.setIsLoading(true);
        const productUrlShort = GetUrlToMarketplace.getShortUrlMarketplace(globalStore.productUrl);
        const productId = Number(GetUrlToMarketplace.getUrl(productUrlShort));

        let productValue: number = 0;

        if (productUrlShort !== '') {

            if (checkingValueInput(productUrlShort) === InputDataProductRequest.PRODUCT_URL) {
                productValue = productId;
            }

            if (checkingValueInput(productUrlShort) === InputDataProductRequest.PRODUCT_ARTICLE) {
                productValue = Number(productUrlShort);
            }

            service.getProductFromWB(productValue, globalStore.currency)
                .then(responseProduct =>
                    productExist(responseProduct.id, globalStore.productListView)
                        ? toast.error(MessageList.ERROR_PRODUCT_EXISTS)
                        : saveProduct(responseProduct)
                )
                .catch((error: string) => toast.error(error))
                .finally(() => {
                    globalStore.setProductUrl('');
                    globalStore.setIsLoading(false);
                });

        } else {
            toast.error(MessageList.ERROR_EMPTY_URL);
        }
    };

    /**
     * Сохраняет полученный продукт в стор и localStorage.
     * @param {IProductResponse} response - данные продукта из API
     */
    const saveProduct = (response: IProductResponse) => {
        const productConvertedView = Serialize.responseToView(response);
        globalStore.setProductListView(productConvertedView);
        service.saveProductToLocalStorage(productConvertedView);
    };

    /**
     * Проверяет изменение цен у продуктов, получая актуальные данные из API.
     * Сравнивает текущие продукты с новыми данными.
     */
    const checkChangePrice = () => {
        const productListView: IProduct[] = globalStore.productListView;

        // service.fetchMockProducts()
        //     .then((mockProducts: IProduct[]) => {
        //         productListView.forEach((product) => {
        //             const matchedProduct = mockProducts.find(mock => mock.id === product.id);
        //             if (matchedProduct) {
        //                 compareProductPrices(product, matchedProduct);
        //             }
        //         });
        //     });

        // Альтернативно, можно получать с API:
        productListView.forEach((itemProduct) => {
            service.getProductFromWB(itemProduct.id, globalStore.currency)
                .then((response) => {
                    const responseProduct: IProduct = Serialize.responseToView(response);
                    compareProductPrices(itemProduct, responseProduct);
                });
        });
    };

    /**
     * Сравнивает цены старого и нового продукта.
     * Если цены отличаются, обновляет историю размеров.
     *
     * @param {IProduct | undefined} itemProduct - текущий продукт
     * @param {IProduct | undefined} responseProduct - новый продукт из API
     */
    const compareProductPrices = (itemProduct: IProduct | undefined, responseProduct: IProduct | undefined) => {
        if (!itemProduct || !itemProduct.productInsideContent || !itemProduct.productInsideContent.productSize?.length) {
            return;
        }

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

            globalStore.updateProductSizeHistory(itemProduct.id, {size: updatedSizes});
        }
    };

    /**
     * Определяет, что введено — URL или артикул.
     *
     * @param {string} inputText - введённый текст
     * @returns {InputDataProductRequest} тип введённых данных
     */
    const checkingValueInput = (inputText: string): InputDataProductRequest =>
        /\D/.test(inputText) ? InputDataProductRequest.PRODUCT_URL : InputDataProductRequest.PRODUCT_ARTICLE;

    /**
     * Переключает состояние сворачивания/разворачивания всего списка продуктов.
     */
    const toggleCollapseAll = () => {
        globalStore.setCollapseAll(!globalStore.collapseAll);
    };

    return (
        <div className='product-form'>
            <div className='form'>
                <div className='top'>
                    <div className='input-wrapper'>
                        <Input
                            value={globalStore.productUrl}
                            onChange={(value) => globalStore.setProductUrl(value)}
                            placeholder={'Ссылка или артикул'}
                        />
                        <PasteButton onPaste={(value) => globalStore.setProductUrl(value)}/>
                    </div>
                    <Select
                        options={currencyList}
                        onChange={(value) =>
                            onChangeSelect(currencyList.find(c => c.value === value)!)
                        }
                        value={globalStore.currency.value}
                    />
                </div>
                <div className='bottom'>
                    <Button
                        text={'Добавить в список'}
                        onClick={addProductToList}
                        variant={'primary'}
                    />
                    <Button
                        text={globalStore.collapseAll ? 'Развернуть список' : 'Свернуть список'}
                        onClick={toggleCollapseAll}
                        variant={'secondary'}
                        isDisabled={globalStore.productListView.length === 0 ? true : false}
                    />
                </div>
            </div>
        </div>
    );
});
