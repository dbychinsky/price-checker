import { IProductCurrency } from "../models/Currency.ts";
import { IProductResponse } from "../models/ProductResponse.ts";
import { IProduct } from '../models/Product.ts';
import { IProductLink } from '../models/ProductLink.ts';

const apiUrl = import.meta.env.VITE_SERVER_URL;

export class Service {
    private PRODUCT_LIST_KEY = 'PRODUCT_LIST_KEY';
    // private PRODUCT_URL_LIST_KEY = 'PRODUCT_URL_LIST_KEY';
    // private CURRENCY_KEY = 'CURRENCY_KEY';

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
     * @description  Сохранение продукта в список в LS.
     */
    async saveProductToLocalStorage(product: IProduct) {
        const productList: IProduct[] = this.load(this.PRODUCT_LIST_KEY);

        productList.push(product);
        this.save(this.PRODUCT_LIST_KEY, productList);
    }

    /**
     * @description  Загрузка продукта из LS.
     */
    async loadProductFromLocalStorage(): Promise<IProduct[]> {
        const productList: IProduct[] = this.load(this.PRODUCT_LIST_KEY);

        return productList
    }

    /**
     * Метод для работы с localStorage - сохранение данных
     */
    private save(key: string, object: IProduct[] | IProductCurrency | IProductLink[]) {
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
