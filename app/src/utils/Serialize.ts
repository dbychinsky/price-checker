import { IProductResponse } from "../models/ProductResponse.ts";
import { IProduct, IProductPrice } from "../models/Product.ts";
import { getProductPriceFraction } from './GetProductPriceFraction.ts';

/**
 * Конвертация данных
 */
export class Serialize {

    // Конвертация данных ответа в данные для хранения в LS
    // static responseToStorage(productResponse: IProductResponse): IProduct {
    //     const price: IProductPrice[] = [];
    //
    //     productResponse.sizes.map((item) => {
    //         price.push({
    //             priceBasic: item.price ? getProductPriceFraction(item.price.basic.toString()) : null,
    //             priceTotal: item.price ? getProductPriceFraction(item.price.total.toString()) : null,
    //             priceProduct: item.price ? getProductPriceFraction(item.price.product.toString()) : null
    //         });
    //     })
    //
    //     return {
    //         id: productResponse.id,
    //         productName: productResponse.name,
    //         name,
    //         origName,
    //         dateAdded,
    //         priceList,
    //     }
    // }

    static responseToView(productResponse: IProductResponse): IProduct {
        const target = productResponse.sizes[0];
        const name = target.name;
        const origName = target.origName;
        const priceList: IProductPrice[] = [];
        const dateAdded: Date = new Date();

        priceList.push({
            priceBasic: target.price ? getProductPriceFraction(target.price.basic.toString()) : null,
            priceTotal: target.price ? getProductPriceFraction(target.price.total.toString()) : null,
            priceProduct: target.price ? getProductPriceFraction(target.price.product.toString()) : null
        })

        return {
            id: productResponse.id,
            productName: productResponse.name,
            name,
            origName,
            dateAdded,
            priceList,
        }
    }
}