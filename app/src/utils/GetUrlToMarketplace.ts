/**
 * Класс для получения идентификатора товара из ссылки на маркетплейс.
 */
export class GetUrlToMarketplace {

    /**
     * Получение ссылки
     */
    static getShortUrlMarketplace(url: string): string {
        const result = url.split(" ").pop();
        return result || '';
    }

    /**
     * Определяет тип маркетплейса (глобальный или региональный) и вызывает соответствующий метод.
     */
    static getUrl(url: string): string {
        if (url.includes('global')) {
            return this.getUrlMarketplaceGlobal(url); // Глобальный Wildberries
        } else {
            return this.getUrlMarketplaceBase(url);   // Региональный Wildberries (например, by)
        }
    }

    /**
     * Извлекает ID товара из ссылки на глобальный маркетплейс Wildberries.
     * Обрабатываются 3 случая:
     *  - ссылка содержит ?card=...
     *  - ссылка содержит ?option=..., ID берётся после последнего "-"
     *  - ссылка на каталог, ID берётся после /catalog/...
     *
     * @param url - ссылка на товар с global.wildberries.ru
     * @returns строка с ID товара
     */
    private static getUrlMarketplaceGlobal(url: string): string {
        let result: string | undefined;
        const hasQuery = url.includes('?');

        if (hasQuery) {
            if (url.includes('card=')) {
                // Пример: https://global.wildberries.ru/product?card=110592443
                result = this.trimStringToLastEqual(url);
            } else {
                // Пример: https://global.wildberries.ru/product/noski-...-216617294?option=...
                const baseUrl = url.split('?')[0];
                result = baseUrl.split('-').pop();
            }
        } else {
            if (url.includes('catalog')) {
                // Пример: https://global.wildberries.ru/catalog/172658116/detail.aspx
                const parts = url.split('/').filter(Boolean); // удаляем пустые строки
                const catalogIndex = parts.indexOf('catalog');
                if (catalogIndex !== -1 && parts.length > catalogIndex + 1) {
                    result = parts[catalogIndex + 1]; // ID товара сразу после "catalog"
                }
            } else {
                // Пример: https://global.wildberries.ru/product/noski-...-216617294
                result = url.split('-').pop();
            }
        }

        return result || '';
    }

    /**
     * Извлекает ID товара из региональной версии сайта (например, wildberries.by).
     * Предполагается фиксированная структура URL: ID находится после 35 символа и до следующего "/".
     *
     * @param url - ссылка на товар с регионального сайта
     * @returns строка с ID товара
     */
    private static getUrlMarketplaceBase(url: string): string {
        return url.slice(35).split('/')[0];
    }

    /**
     * Извлекает значение после последнего знака "=" в строке.
     * Используется для ссылок формата: ?card=123456
     *
     * @param url - исходная строка URL
     * @returns значение после последнего "=" или пустая строка
     */
    private static trimStringToLastEqual(url: string): string {
        const lastIndex = url.lastIndexOf('=');
        if (lastIndex === -1) {
            return '';
        }
        return url.slice(lastIndex + 1);
    }
}
