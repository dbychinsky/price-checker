import { IProductCurrency } from "../models/Currency.ts";
import { IProductResponse } from "../models/ProductResponse.ts";
import { IProduct } from '../models/Product.ts';

const apiUrl = import.meta.env.VITE_SERVER_URL;

export class Service {
    private PRODUCT_LIST_KEY = 'PRODUCT_LIST_KEY';
    // private PRODUCT_URL_LIST_KEY = 'PRODUCT_URL_LIST_KEY';
    private CURRENCY_KEY = 'CURRENCY_KEY';

    /**
     * @description  Получение списка продуктов c WB.
     */
    async getProductFromWB(productId: number, currency: IProductCurrency): Promise<IProductResponse> {
        try {
            const response = await fetch(`${apiUrl}?id=${productId}&currency=${currency?.value}`);
            if (!response.ok) {
                throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
            }

            return response.json();

        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error);
            throw error; // Пробрасываем ошибку дальше
        }
    }

    /**
     * @description  Получение списка продуктов c StubMock.
     */
    async fetchMockProducts(): Promise<IProduct[]> {
        try {
            const response = await fetch('mocks/wb.json');

            if (!response.ok) {
                throw new Error(`Ошибка при загрузке данных: ${response.statusText}`);
            }

            const data: IProduct[] = await response.json();
            return data;
        } catch (error) {
            console.error('Ошибка загрузки моковых данных:', error);
            return [];
        }
    }

    /**
     * @description  Сохранение продукта в список в LS.
     */
    saveProductToLocalStorage(product: IProduct) {
        const productList: IProduct[] = this.load(this.PRODUCT_LIST_KEY);

        productList.push(product);
        this.save(this.PRODUCT_LIST_KEY, productList);
    }

    /**
     * @description  Загрузка продукта из LS.
     */
    loadProductFromLocalStorage(): IProduct[] {
        const productList: IProduct[] = this.load(this.PRODUCT_LIST_KEY);

        productList.forEach(product => {
            product.productInsideContent.productSize?.forEach(sizeEntry => {
                sizeEntry.size?.forEach(size => {
                    size.priceList?.forEach(price => {
                        if (price.dateAdded) {
                            price.dateAdded = new Date(price.dateAdded);
                        } else {
                            // Если поле отсутствует — можно задать дефолт, чтобы избежать undefined
                            price.dateAdded = new Date(0); // или new Date() для текущей даты
                        }
                    });
                });
            });
        });

        return productList;
    }


    /**
     * @description Удаление продукта из списка и сохранение в LS.
     */
    removeProductFromLocalStorage(productId: number) {
        const productList = this.load(this.PRODUCT_LIST_KEY) as IProduct[];
        const updatedList = productList.filter(p => p.id !== productId);

        this.save(this.PRODUCT_LIST_KEY, updatedList);
    }

    /**
     * @description Обновляет продукт в localStorage (удаляет старый и сохраняет новый)
     */
    updateProductInLocalStorage(updatedProduct: IProduct) {
        const productList: IProduct[] = this.load(this.PRODUCT_LIST_KEY);

        const updatedList = productList.map(product =>
            product.id === updatedProduct.id ? updatedProduct : product
        );

        this.save(this.PRODUCT_LIST_KEY, updatedList); // используем уже существующий метод save
    }

    /**
     * Сохранение валюты в LS
     */
    saveCurrentCurrencyToLocalStorage(currency: IProductCurrency) {
        this.save(this.CURRENCY_KEY, currency);
    }

    /**
     * Загрузка валюты из LS
     */
    loadCurrentCurrencyToLocalStorage(): IProductCurrency {
        return this.load(this.CURRENCY_KEY);
    }

    /**
     * Метод для работы с localStorage - сохранение данных
     */
    private save<T>(key: string, object: T): void {
        localStorage.setItem(key, JSON.stringify(object));
    }


    /**
     * Метод для работы с localStorage - загрузка данных
     */
    private load(key: string) {
        const result = JSON.parse(localStorage.getItem(key)!);

        if (result === null) {
            return []
        }
        return result;
    }

}
