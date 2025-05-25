// stores/GlobalStore.ts
import {makeAutoObservable, reaction, runInAction} from "mobx";
import {IProductCurrency} from "../models/Currency.ts";
import {IProduct, ISize} from "../models/Product.ts";
import {Service} from "../service/Service.ts";
import {getLocalStorageSizeInMB} from "../utils/GetLocalStorageSizeInMB.ts";

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
        newSizeData: ISize[],
    ) => {
        const product = this.productListView.find(p => p.id === productId);
        if (!product) return;

        const productSizes = product.productInsideContent.productSize;

        if (productSizes.length === 0) {
            productSizes.push({size: newSizeData});
        } else {
            const lastSizeEntry = productSizes[productSizes.length - 1];

            newSizeData.forEach(newSizeItem => {
                const existingSize = lastSizeEntry.size.find(
                    s =>
                        s.nameSize === newSizeItem.nameSize &&
                        s.origNameSize === newSizeItem.origNameSize
                );

                if (!existingSize) {
                    // Добавляем новый размер с обрезанным списком цен (последние 3)
                    lastSizeEntry.size.push({
                        ...newSizeItem,
                        priceList: newSizeItem.priceList.slice(-3),
                    });
                } else {
                    newSizeItem.priceList.forEach(newPrice => {
                        const exists = existingSize.priceList.some(
                            p => JSON.stringify(p) === JSON.stringify(newPrice)
                        );

                        if (!exists) {
                            existingSize.priceList.push(newPrice);

                            // Сортируем по дате и сохраняем только последние 3
                            existingSize.priceList = existingSize.priceList
                                .sort((a, b) => new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime())
                                .slice(-3);
                        }
                    });
                }
            });
        }

        // Не нужно ограничивать productSize, так как он больше не содержит истории по дате

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
