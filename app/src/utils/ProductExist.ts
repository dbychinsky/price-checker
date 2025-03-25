import { IProduct } from '../models/Product.ts';

export function productExist(id: number, productList: IProduct[]): boolean {
    return !!productList.find((product) => Number(product.id) === id);
}
