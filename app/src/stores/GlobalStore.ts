import {makeAutoObservable, reaction, runInAction} from "mobx";
import {IProductCurrency} from "../models/Currency.ts";
import {IProduct, IProductPrice, IProductSize, ISize} from "../models/Product.ts";
import {Service} from "../service/Service.ts";
import {getLocalStorageSizeInMB} from "../utils/GetLocalStorageSizeInMB.ts";
import DateUtils from "../utils/DateUtils.ts";

export class GlobalStore {
    private service: Service;

    /** Флаг загрузки данных */
    isLoading = false;

    /** Текущий URL продукта, введённый пользователем */
    productUrl = '';

    /** Текущая валюта */
    currency: IProductCurrency;

    /** Список продуктов для отображения */
    productListView: IProduct[] = [];

    /** Список продуктов, загруженных с WB (может быть временный/для других целей) */
    productListFromWb: IProduct[] = [];

    /** Размер данных, занятых в localStorage (Мб) */
    fullFilledLS = 0;

    /** Флаг для сворачивания/разворачивания всех продуктов */
    collapseAll = true;

    /**
     * Конструктор глобального стора.
     * Инициализирует сервис, валюту из localStorage,
     * настраивает реактивные реакции MobX.
     *
     * @param {Service} service - экземпляр сервиса для работы с API и localStorage
     */
    constructor(service: Service) {
        this.service = service;
        this.currency = service.loadCurrentCurrencyToLocalStorage();

        makeAutoObservable(this);

        reaction(
            () => this.productListView.length,
            () => {
                this.calcFullFilledLS(getLocalStorageSizeInMB());
            }
        );

        reaction(
            () => this.currency,
            (currency) => this.service.saveCurrentCurrencyToLocalStorage(currency)
        );
    }

    /**
     * Устанавливает флаг сворачивания/разворачивания всех продуктов.
     * @param {boolean} value - новое значение collapseAll
     */
    setCollapseAll = (value: boolean) => {
        this.collapseAll = value;
    };

    /**
     * Устанавливает URL продукта.
     * @param {string} url - URL или артикул продукта
     */
    setProductUrl = (url: string) => {
        this.productUrl = url;
    };

    /**
     * Устанавливает флаг загрузки.
     * @param {boolean} loading - статус загрузки
     */
    setIsLoading = (loading: boolean) => {
        this.isLoading = loading;
    };

    /**
     * Устанавливает текущую валюту.
     * @param {IProductCurrency} currency - валюта
     */
    setCurrency = (currency: IProductCurrency) => {
        this.currency = currency;
    };

    /**
     * Добавляет продукт в список для отображения.
     * @param {IProduct} product - продукт для добавления
     */
    setProductListView = (product: IProduct) => {
        this.productListView.push(product);
    };

    /**
     * Добавляет продукт в список, загруженный с WB.
     * @param {IProduct} product - продукт
     */
    setProductListFromWb = (product: IProduct) => {
        this.productListFromWb.push(product);
    };

    /**
     * Загружает список продуктов из localStorage в стор.
     * Асинхронная функция.
     */
    loadFromLocalStorage = async () => {
        const products = await this.service.loadProductFromLocalStorage();
        runInAction(() => {
            this.productListView = products;
        });
    };

    /**
     * Удаляет продукт из списка по ID и обновляет localStorage.
     * @param {number} productId - ID продукта для удаления
     */
    removeProduct = (productId: number) => {
        this.productListView = this.productListView.filter(p => p.id !== productId);
        this.service.removeProductFromLocalStorage(productId);
    };

    /**
     * Сравнивает две цены продуктов с учётом даты.
     * @private
     * @param {IProductPrice} a - первая цена
     * @param {IProductPrice} b - вторая цена
     * @returns {boolean} true, если цены равны
     */
    private isPriceEqual(a: IProductPrice, b: IProductPrice): boolean {
        const dateA = a.dateAdded instanceof Date ? a.dateAdded : DateUtils.parse(a.dateAdded);
        const dateB = b.dateAdded instanceof Date ? b.dateAdded : DateUtils.parse(b.dateAdded);

        return (
            a.priceTotal === b.priceTotal &&
            a.priceBasic === b.priceBasic &&
            a.priceProduct === b.priceProduct &&
            DateUtils.isSameDate(dateA, dateB)
        );
    }

    /**
     * Добавляет новые цены в существующий размер, избегая дубликатов.
     * Сохраняет только последние 2 записи.
     * @private
     * @param {ISize} existingSize - существующий размер продукта
     * @param {IProductPrice[]} newPrices - новые цены для добавления
     */
    private addNewPrices(existingSize: ISize, newPrices: IProductPrice[]) {
        newPrices.forEach(newPrice => {
            const alreadyExists = existingSize.priceList.some(existingPrice =>
                this.isPriceEqual(existingPrice, newPrice)
            );
            if (!alreadyExists) {
                existingSize.priceList.push(newPrice);
                if (existingSize.priceList.length > 2) {
                    existingSize.priceList = existingSize.priceList.slice(-2);
                }
            }
        });
    }

    /**
     * Обновляет последний элемент в истории размеров новыми размерами и ценами.
     * @private
     * @param {IProductSize} latestEntry - последний элемент истории размеров
     * @param {IProductSize["size"]} newSizes - новые размеры для обновления
     */
    private updateLatestEntry(latestEntry: IProductSize, newSizes: IProductSize["size"]) {
        newSizes.forEach(newSize => {
            const matchedSize = latestEntry.size.find(
                existingSize =>
                    existingSize.nameSize === newSize.nameSize &&
                    existingSize.origNameSize === newSize.origNameSize
            );

            if (matchedSize) {
                this.addNewPrices(matchedSize, newSize.priceList);
            } else {
                latestEntry.size.push({
                    ...newSize,
                    priceList: newSize.priceList.slice(-3),
                });
            }
        });
    }

    /**
     * Обновляет историю размеров продукта по ID, добавляя новые данные.
     * @param {number} productId - ID продукта
     * @param {IProductSize} newSizeData - новые данные размеров продукта
     */
    updateProductSizeHistory = (
        productId: number,
        newSizeData: IProductSize
    ) => {
        const product = this.productListView.find(p => p.id === productId);
        if (!product) return;

        if (!product.productInsideContent.productSize) {
            product.productInsideContent.productSize = [];
        }

        const productSizeList = product.productInsideContent.productSize;

        if (productSizeList.length === 0) {
            const newEntry: IProductSize = {
                size: newSizeData.size.map(size => ({
                    ...size,
                    priceList: size.priceList.slice(-3),
                })),
            };
            productSizeList.push(newEntry);
        } else {
            const latestEntry = productSizeList[productSizeList.length - 1];
            this.updateLatestEntry(latestEntry, newSizeData.size);
        }

        this.service.updateProductInLocalStorage(product);
    };

    /**
     * Обновляет размер, занимаемый данными в localStorage.
     * @param {number} value - размер в Мб
     */
    calcFullFilledLS = (value: number) => {
        this.fullFilledLS = value;
    };
}
