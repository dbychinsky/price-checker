/**
 * Получение ссылки для перехода на сайт маркетплейса.
 */
// export async function getUrlMarketplace(urlList: IProductLink[], id: number): Promise<string> {
//     const baseUrl = urlList.find((url) => url.id === id)?.url;
//     return baseUrl || ''; // Возвращаем пустую строку, если baseUrl не найдено
// }

export class GetUrlToMarketplace {

    static getShortUrlMarketplace(url: string): string {
        const result = url.split(" ").pop();

        return result ? result : '';
    }

    static getUrl(url: string): string {
        if (url.includes('global')) {
            return this.getUrlMarketplaceGlobal(url);
        } else {
            return this.getUrlMarketplaceBase(url);
        }
    }

    //Глобальный сайт
    private static getUrlMarketplaceGlobal(url: string): string {
        // https://global.wildberries.ru/product/noski-korotkie-nabor-216617294?option=345257859

        let result: string | undefined;

        if (url.includes('?')) {
            if (url.includes('card')) {
                //https://global.wildberries.ru/product?card=110592443'
                result = this.trimStringToLastEqual(url)
            } else {
                result = url.split('?')[0].split("-").pop();
            }
        } else {
            result = url.split("-").pop();
        }

        return result ? result : '';
    }

    //Региональный сайт (by)
    private static getUrlMarketplaceBase(url: string) {
        return url.slice(35).split('/')[0];
    }

    private static trimStringToLastEqual(url: string) {
        //https://global.wildberries.ru/product?card=110592443'
        const lastIndex = url.lastIndexOf('=');
        if (lastIndex === -1) {
            // Если символ равенства не найден, возвращаем пустую строку или можно вернуть оригинальную строку
            return '';
        }
        // Возвращаем подстроку от последнего знака равенства до конца строки
        return url.slice(lastIndex + 1);
    }
}