import { makeAutoObservable, reaction, runInAction } from "mobx";
import { IProductCurrency } from "../models/Currency.ts";
import { IProduct, IProductPrice, IProductSize, ISize } from "../models/Product.ts";
import { Service } from "../service/Service.ts";
import { getLocalStorageSizeInMB } from "../utils/GetLocalStorageSizeInMB.ts";

/**
 * Глобальный MobX-стор приложения для управления продуктами, валютой и состоянием загрузки.
 */
export class GlobalStore {
    /** Сервис для работы с API и LocalStorage */
    private service: Service;

    /** Индикатор загрузки данных */
    isLoading = false;

    /** Введённый URL продукта */
    productUrl = '';

    /** Текущая валюта приложения */
    currency: IProductCurrency;

    /** Список отображаемых продуктов (из localStorage) */
    productListView: IProduct[] = [];

    /** Список актуальных продуктов с сервера (для сравнения) */
    productListFromWb: IProduct[] = [];

    /** Заполненность localStorage в МБ */
    fullFilledLS = 0;

    /**
     * Создает экземпляр глобального стора.
     * @param service - Сервис для загрузки/сохранения данных.
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
     * Устанавливает URL продукта.
     * @param url - URL для добавления продукта.
     */
    setProductUrl = (url: string) => {
        this.productUrl = url;
    };

    /**
     * Устанавливает индикатор загрузки.
     * @param loading - `true`, если идёт загрузка.
     */
    setIsLoading = (loading: boolean) => {
        this.isLoading = loading;
    };

    /**
     * Устанавливает текущую валюту.
     * @param currency - Объект валюты.
     */
    setCurrency = (currency: IProductCurrency) => {
        this.currency = currency;
    };

    /**
     * Добавляет продукт в отображаемый список.
     * @param product - Продукт для отображения.
     */
    setProductListView = (product: IProduct) => {
        this.productListView.push(product);
    };

    /**
     * Добавляет продукт в список продуктов с сервера.
     * @param product - Продукт для сравнения.
     */
    setProductListFromWb = (product: IProduct) => {
        this.productListFromWb.push(product);
    };

    /**
     * Загружает список продуктов из localStorage.
     */
    loadFromLocalStorage = async () => {
        const products = await this.service.loadProductFromLocalStorage();
        runInAction(() => {
            this.productListView = products;
        });
    };

    /**
     * Удаляет продукт из отображаемого списка и localStorage.
     * @param productId - ID продукта.
     */
    removeProduct = (productId: number) => {
        this.productListView = this.productListView.filter(p => p.id !== productId);
        this.service.removeProductFromLocalStorage(productId);
    };


    /**
     * Проверяет, совпадают ли два объекта цены.
     * @param a - Первый объект цены.
     * @param b - Второй объект цены.
     * @returns true, если цены равны.
     */
    private isPriceEqual(a: IProductPrice, b: IProductPrice): boolean {
        return (
            a.priceTotal === b.priceTotal &&
            a.priceBasic === b.priceBasic &&
            a.priceProduct === b.priceProduct
        );
    }

    /**
     * Добавляет новые цены в priceList размера, ограничивая длину 2.
     * @param existingSize - Размер с текущим priceList.
     * @param newPrices - Массив новых цен.
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
     * Обновляет последний элемент productSize новыми размерами и ценами.
     * @param latestEntry - Последний элемент productSize.
     * @param newSizes - Новые данные размеров с ценами.
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
     * Обновляет историю изменения цен в productSize, ограничивая до 3 последних записей.
     * @param productId - ID продукта.
     * @param newSizeData - Новые данные о размере и ценах.
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
     * Обновляет процент заполненности localStorage.
     * @param value - Значение заполненности (в МБ).
     */
    calcFullFilledLS = (value: number) => {
        this.fullFilledLS = value;
    };
}
