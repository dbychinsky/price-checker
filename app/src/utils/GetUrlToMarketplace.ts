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
        try {
            const parsedUrl = new URL(url);
            const pathname = parsedUrl.pathname;
            const searchParams = parsedUrl.searchParams;

            // Вариант 1: https://global.wildberries.ru/product?card=110592443
            const cardId = searchParams.get('card');
            if (cardId) {
                return cardId;
            }

            // Вариант 2 и 5: https://global.wildberries.ru/product/noski-...-216617294
            if (pathname.startsWith('/product')) {
                const segments = pathname.split('-');
                const last = segments[segments.length - 1];
                if (/^\d+$/.test(last)) {
                    return last;
                }
            }

            // Вариант 3 и 4: https://global.wildberries.ru/catalog/172658116/detail.aspx
            if (pathname.includes('/catalog/')) {
                const match = pathname.match(/\/catalog\/(\d+)\/detail\.aspx/);
                if (match && match[1]) {
                    return match[1];
                }
            }

            return '';
        } catch (e) {
            console.log(e);
            return '';
        }
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
}
