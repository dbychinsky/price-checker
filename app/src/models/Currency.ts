export interface IProductCurrency {
    value: string,
    label: string,
}

export enum SelectCurrencyListId {
    rub = 'rub',
    byn = 'byn',
    kzt = 'kzt'
}

export enum SelectCurrencyListName {
    rub = 'RUB',
    byn = 'BYN',
    kzt = 'KZT'
}

export const currencyList: IProductCurrency[] = [
    {value: SelectCurrencyListId.byn, label: SelectCurrencyListName.byn},
    {value: SelectCurrencyListId.rub, label: SelectCurrencyListName.rub},
    {value: SelectCurrencyListId.kzt, label: SelectCurrencyListName.kzt},
];