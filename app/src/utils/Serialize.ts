import { IProductResponse } from "../models/ProductResponse.ts";
import { IProduct, ISize } from "../models/Product.ts";
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
        const size: ISize[] = [];
        const dateAdded: Date = new Date();

        productResponse.sizes.map((item) => {
            size.push({
                nameSize: item.name,
                origNameSize: item.origName,
                priceList: [{
                    priceTotal: item.price ? getProductPriceFraction(item.price.total.toString()) : null,
                    priceBasic: item.price ? getProductPriceFraction(item.price.basic.toString()) : null,
                    priceProduct: item.price ? getProductPriceFraction(item.price.product.toString()) : null
                }]
            });
        });

        return {
            id: productResponse.id,
            productInsideContent: {
                productName: productResponse.name,
                productSize: [{
                    size,
                    dateAdded,
                }]
            }
        }
    }
}
