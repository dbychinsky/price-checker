// stores/GlobalStore.ts
import { makeAutoObservable, reaction, runInAction } from "mobx";
import { IProductCurrency } from "../models/Currency.ts";
import { IProduct, IProductSize } from "../models/Product.ts";
import { Service } from "../service/Service.ts";
import { getLocalStorageSizeInMB } from "../utils/GetLocalStorageSizeInMB.ts";

export class GlobalStore {
    // Сервис для работы с данными (API, LocalStorage)
    private service: Service;

    // Индикатор загрузки данных
    isLoading = false;

    // Адрес продукта для добавления
    productUrl = '';

    // Текущая валюта
    currency: IProductCurrency;

    // Список продуктов для отображения
    productListView: IProduct[] = [];

    // Список актуальных продуктов с сервера для сравнения с тем что отображается
    productListFromWb: IProduct[] = [];

    // Процент заполненности LocalStorage
    fullFilledLS = 0;

    // Конструктор принимает зависимость (service)
    constructor(service: Service) {
        this.service = service;  // Инициализируем сервис
        this.currency = service.loadCurrentCurrencyToLocalStorage();

        makeAutoObservable(this); // Делает все свойства и методы автоматически наблюдаемыми для MobX

        // Реакция на изменение длины списка продуктов
        reaction(
            () => this.productListView.length,  // Следим за длиной списка продуктов
            () => {
                this.calcFullFilledLS(getLocalStorageSizeInMB());  // Пересчитываем заполненность LocalStorage
            }
        );
        reaction(
            () => this.currency,
            (currency) => this.service.saveCurrentCurrencyToLocalStorage(currency)
        );
    }

    // Установить URL продукта
    setProductUrl = (url: string) => {
        this.productUrl = url;
    };

    // Установить состояние загрузки
    setIsLoading = (loading: boolean) => {
        this.isLoading = loading;
    };

    // Установить валюту продукта
    setCurrency = (currency: IProductCurrency) => {
        this.currency = currency;
    };

    // Добавить продукт в отображаемый список
    setProductListView = (product: IProduct) => {
        this.productListView.push(product);  // Добавляем продукт в массив
    };


    // Добавить продукт в список актуальных продуктов
    setProductListFromWb = (product: IProduct) => {
        this.productListFromWb.push(product);  // Добавляем продукт в массив
    };

    // Загрузить продукты из LocalStorage через сервис
    loadFromLocalStorage = async () => {
        const products = await this.service.loadProductFromLocalStorage();
        runInAction(() => {
            this.productListView = products;
        });
    };

    // Удалить продукт из списка
    removeProduct = (productId: number) => {
        this.productListView = this.productListView.filter(p => p.id !== productId);
        this.service.removeProductFromLocalStorage(productId);
    };

    updateProductSizeHistory = (
        productId: number,
        newSizeData: IProductSize,
    ) => {
        const product = this.productListView.find(p => p.id === productId);
        if (!product) return;

        if (!product.productInsideContent.productSize) {
            product.productInsideContent.productSize = [];
        }

        product.productInsideContent.productSize.push(newSizeData);

        // Ограничиваем до 3 последних записей (в коде было -5, поправлено на -3)
        if (product.productInsideContent.productSize.length > 3) {
            product.productInsideContent.productSize = product.productInsideContent.productSize.slice(-3);
        }

        this.service.updateProductInLocalStorage(product);
    };


    // Удалить из продукта item
    // removeItemFromProduct(productId: number, origNameSize: string) {
    //     const product = this.productListView.find((item) => item.id === productId);
    //     const productListNew = product?.productInsideContent
    //         .map((productInside) => productInside.size
    //             .filter((sizeItem) => sizeItem.origNameSize !== origNameSize));
    //
    //     runInAction(() => {
    //         this.productListView = this.productListView.filter(p => p.id !== productId);
    //         if (productListNew) {
    //             this.productListView.push(productListNew)
    //         }
    //     });
    // }

    // Рассчитать заполненность LocalStorage
    calcFullFilledLS = (value: number) => {
        this.fullFilledLS = value;  // Обновляем процент заполненности
    }
}
