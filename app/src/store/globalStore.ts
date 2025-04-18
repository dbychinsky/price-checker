import { makeAutoObservable, reaction, runInAction } from "mobx";
import { currencyList, IProductCurrency } from "../models/Currency.ts";
import { IProduct } from "../models/Product.ts";
import { GetLocalStorageSizeInMB } from '../utils/getLocalStorageSizeInMB.ts';

class GlobalStore {
    // Индикатор загрузки
    isLoading = false;

    // Адрес продукта для добавления
    productUrl = '';

    // Валюта продукта
    currency: IProductCurrency = currencyList[1];

    // Отображаемый список продуктов
    productListView: IProduct[] = [];

    // Заполненность LS
    fullFilledLS = 0;

    constructor() {
        makeAutoObservable(this);
        reaction(
            () => this.productListView.length,
            () => {
                this.calcFullFilledLS(GetLocalStorageSizeInMB());
            }
        );
    }

    setProductUrl(url: string) {
        this.productUrl = url;
    }

    setIsLoading(loading: boolean) {
        this.isLoading = loading;
    }

    setCurrency(currency: IProductCurrency) {
        this.currency = currency;
    }

    addProductListView(product: IProduct) {
        // Уведомляем MobX, что мы изменяем массив
        runInAction(() => {
            this.productListView.push(product);
        });
    }

    removeProductListView(product: IProduct) {
        runInAction(() => {
            this.productListView = this.productListView.filter(p => p !== product);
        });
    }

    calcFullFilledLS(value: number) {
        this.fullFilledLS = value;
    }
}

export const globalStore = new GlobalStore();
