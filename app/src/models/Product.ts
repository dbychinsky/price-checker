/**
 * Интерфейс продукта.
 * Разбивается на несколько интерфейсов попроще.
 */
export interface IProduct {
    /** Уникальный идентификатор продукта */
    id: number;
    /** Контент продукта, включая название и размеры */
    productInsideContent: IProductInsideContent;
    /** Дата добавления продукта в отселживаемый список*/
    dateAddingProduct: Date;
}

/**
 * Внутренний контент продукта.
 */
export interface IProductInsideContent {
    /** Название продукта */
    productName: string;
    /** История размеров продукта с ценами */
    productSize: IProductSize[];
}

/**
 * Размеры продукта.
 */
export interface IProductSize {
    /** Список размеров и цен */
    size: ISize[];
}

/**
 * Конкретный размер продукта.
 */
export interface ISize {
    /** Отображаемое имя размера */
    nameSize: string;
    /** Оригинальное имя размера (например, от поставщика) */
    origNameSize: string;
    /** История цен на этот размер */
    priceList: IProductPrice[];
}

/**
 * Информация о цене продукта.
 */
export interface IProductPrice {
    /** Общая цена (итоговая) */
    priceTotal: string | null;
    /** Базовая цена (без скидок и т.п.) */
    priceBasic: string | null;
    /** Цена только за продукт (без доставки, упаковки и т.п.) */
    priceProduct: string | null;
    /** Дата добавления этой цены */
    dateAdded: Date;
}
