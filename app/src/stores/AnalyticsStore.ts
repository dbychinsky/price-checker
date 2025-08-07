import { makeAutoObservable } from "mobx";
import { IProductPrice } from '../models/Product.ts';

enum CompareResults {
    MORE = "MORE",
    LESS = "LESS",
    EQUAL = "EQUAL",
}

/**
 * Класс стора аналитики.
 * Отвечает за логику сравнения данных и хранение результатов.
 */
export class AnalyticsStore {

    /**
     * Результат сравнения данных.
     * Может принимать значения: MORE, LESS, EQUAL.
     */
    // compareResult: CompareResults = CompareResults.EQUAL;

    /**
     * Конструктор стора аналитики.
     * @param service - Экземпляр сервиса для работы с данными.
     */
    constructor() {
        makeAutoObservable(this); // Автоматически делает свойства и методы наблюдаемыми для MobX
    }

    private parsePrice(price: string | null): number {
        if (!price) return 0; // или другое значение по умолчанию
        return Number(price.replace(',', '.'));
    }

    comparePriceItem(priceList: IProductPrice[]): CompareResults | undefined {
        if (priceList.length < 2) {
            return undefined;
        }

        const sortedList = [...priceList].sort(
            (a, b) => new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
        );

        const prevPrice = this.parsePrice(sortedList[sortedList.length - 2].priceTotal);
        const currentPrice = this.parsePrice(sortedList[sortedList.length - 1].priceTotal);

        if (currentPrice > prevPrice) return CompareResults.MORE;
        if (currentPrice < prevPrice) return CompareResults.LESS;
        return CompareResults.EQUAL;
    }

}
