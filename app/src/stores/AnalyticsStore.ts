import {makeAutoObservable} from "mobx";

export enum CompareResults {
    MORE = "MORE",
    LESS = "LESS",
    EQUAL = "EQUAL",
}

export interface IPriceItem {
    priceTotal: string | null;
    dateAdded: string | Date;
}

export class AnalyticsStore {
    constructor() {
        makeAutoObservable(this);
    }

    parsePrice(price: string | null): number {
        if (!price) return 0;
        return Number(price.replace(',', '.'));
    }

    /**
     * Возвращает список CompareResults для priceList
     */
    getPriceComparisons(priceList: IPriceItem[]): (CompareResults | "")[] {
        const results: (CompareResults | "")[] = [];

        for (let i = 0; i < priceList.length; i++) {
            if (i === 0) {
                // Для первого элемента возвращаем пустую строку, чтобы не добавлять класс
                results.push("");
                continue;
            }

            const current = this.parsePrice(priceList[i]?.priceTotal);
            const prev = this.parsePrice(priceList[i - 1]?.priceTotal);

            if (current === prev) {
                results.push(CompareResults.EQUAL);
            } else if (current > prev) {
                results.push(CompareResults.MORE);
            } else {
                results.push(CompareResults.LESS);
            }
        }

        return results;
    }

}
