export interface IProduct {
    id: number,
    productInsideContent: IProductInsideContent[],
}

export interface IProductInsideContent {
    dateAdded: Date,
    productName: string,
    size: IProductSize[],
}

export interface IProductSize {
    nameSize: string,
    origNameSize: string,
    priceList: IProductPrice[],
}

export interface IProductPrice {
    priceTotal: string | null,
    priceBasic: string | null,
    priceProduct: string | null,
}


