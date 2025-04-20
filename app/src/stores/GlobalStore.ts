// stores/GlobalStore.ts
import { makeAutoObservable, reaction, runInAction } from "mobx";
import { currencyList, IProductCurrency } from "../models/Currency.ts";
import { IProduct } from "../models/Product.ts";
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
    currency: IProductCurrency = currencyList[1];

    // Список продуктов для отображения
    productListView: IProduct[] = [];

    // Процент заполненности LocalStorage
    fullFilledLS = 0;

    // Конструктор принимает зависимость (service)
    constructor(service: Service) {
        this.service = service;  // Инициализируем сервис
        makeAutoObservable(this); // Делает все свойства и методы автоматически наблюдаемыми для MobX

        // Реакция на изменение длины списка продуктов
        reaction(
            () => this.productListView.length,  // Следим за длиной списка продуктов
            () => {
                this.calcFullFilledLS(getLocalStorageSizeInMB());  // Пересчитываем заполненность LocalStorage
            }
        );
    }

    // Установить URL продукта
    setProductUrl(url: string) {
        this.productUrl = url;
    }

    // Установить состояние загрузки
    setIsLoading(loading: boolean) {
        this.isLoading = loading;
    }

    // Установить валюту продукта
    setCurrency(currency: IProductCurrency) {
        this.currency = currency;
    }

    // Добавить продукт в отображаемый список
    addProductListView(product: IProduct) {
        runInAction(() => {
            this.productListView.push(product);  // Добавляем продукт в массив
        });
    }

    // Загрузить продукты из LocalStorage через сервис
    async loadFromLocalStorage() {
        const products = await this.service.loadProductFromLocalStorage();  // Получаем данные из LocalStorage

        runInAction(() => {
            this.productListView = products;  // Обновляем список продуктов
        });
    }

    // Удалить продукт из списка
    removeProduct(productId: number) {
        runInAction(() => {
            this.productListView = this.productListView.filter(p => p.id !== productId);
        });
        this.service.removeProductFromLocalStorage(productId);
    }


    // Рассчитать заполненность LocalStorage
    calcFullFilledLS(value: number) {
        this.fullFilledLS = value;  // Обновляем процент заполненности
    }
}
