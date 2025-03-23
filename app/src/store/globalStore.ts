import { makeAutoObservable } from "mobx";
import { currencyList, IProductCurrency } from "../models/Currency.ts";
import { IProduct } from "../models/Product.ts";

class GlobalStore {
    // Индикатор загрузки
    isLoading = false;

    // Адрес продукта для добавления
    productUrl = '';

    // Валюта продукта
    currency: IProductCurrency = currencyList[1];

    // Отображаемый список продуктов
    productListView: IProduct[] = [];

    constructor() {
        makeAutoObservable(this);
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
        this.productListView.push(product);
    }


}

export const globalStore = new GlobalStore();
