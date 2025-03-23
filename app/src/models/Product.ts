export interface IProduct {
    id: number,
    productName: string,
    name: string,
    origName: string,
    dateAdded: Date,
    priceList: IProductPrice[],
}

export interface IProductPrice {
    priceTotal: string | null,
    priceBasic: string | null,
    priceProduct: string | null,
}

