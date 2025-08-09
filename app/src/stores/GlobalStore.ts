import {makeAutoObservable, reaction, runInAction} from "mobx";
import {IProductCurrency} from "../models/Currency.ts";
import {IProduct, IProductPrice, IProductSize, ISize} from "../models/Product.ts";
import {Service} from "../service/Service.ts";
import {getLocalStorageSizeInMB} from "../utils/GetLocalStorageSizeInMB.ts";
import DateUtils from "../utils/DateUtils.ts";

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

    setProductUrl = (url: string) => {
        this.productUrl = url;
    };

    setIsLoading = (loading: boolean) => {
        this.isLoading = loading;
    };

    setCurrency = (currency: IProductCurrency) => {
        this.currency = currency;
    };

    setProductListView = (product: IProduct) => {
        this.productListView.push(product);
    };

    setProductListFromWb = (product: IProduct) => {
        this.productListFromWb.push(product);
    };

    loadFromLocalStorage = async () => {
        const products = await this.service.loadProductFromLocalStorage();
        runInAction(() => {
            this.productListView = products;
        });
    };

    removeProduct = (productId: number) => {
        this.productListView = this.productListView.filter(p => p.id !== productId);
        this.service.removeProductFromLocalStorage(productId);
    };

    /**
     * Проверяет, совпадают ли два объекта цены с учётом даты.
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
     * Добавляет новые цены в priceList размера, учитывая дату, с ограничением длины 2.
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

    calcFullFilledLS = (value: number) => {
        this.fullFilledLS = value;
    };
}
