import { IProductCurrency } from "../models/Currency.ts";
import { IProductResponse } from "../models/ProductResponse.ts";

const apiUrl = import.meta.env.VITE_SERVER_URL;

export class Service {
    // private PRODUCT_LIST_KEY = 'PRODUCT_LIST_KEY';
    // private PRODUCT_URL_LIST_KEY = 'PRODUCT_URL_LIST_KEY';
    // private CURRENCY_KEY = 'CURRENCY_KEY';

    /**
     * @description  Получение списка продуктов c WB.
     */
    async getProductFromWB(productId: number, currency: IProductCurrency): Promise<IProductResponse> {
        try {
            debugger
            const response =
                await fetch(`${apiUrl}?id=${productId}&currency=${currency?.value}`);

            if (!response.ok) {
                throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error);
            throw error; // Пробрасываем ошибку дальше
        }
    }

}
