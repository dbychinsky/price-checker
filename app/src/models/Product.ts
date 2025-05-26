export interface IProduct {
    id: number,
    productInsideContent: IProductInsideContent,
}

export interface IProductInsideContent {
    productName: string,
    productSize: IProductSize[],
}

export interface IProductSize {
    size: ISize[],
}


export interface ISize {
    nameSize: string,
    origNameSize: string,
    priceList: IProductPrice[],
}

export interface IProductPrice {
    priceTotal: string | null,
    priceBasic: string | null,
    priceProduct: string | null,
    dateAdded: Date,
}


