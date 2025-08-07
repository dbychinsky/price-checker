import { useStore } from "../../stores/StoreContext.ts";

export const FakeButtons = () => {
    const {globalStore} = useStore();  // Используем useStore для получения доступа к globalStore

    return (
        <div>
            <button
                onClick={() => globalStore.setProductUrl(
                    'https://global.wildberries.ru/catalog/210881437/detail.aspx')}>
                Трусы
            </button>
            <button
                onClick={() => globalStore.setProductUrl(
                    'https://global.wildberries.ru/catalog/209584820/detail.aspx')}>
                Пор
            </button>
            <button
                onClick={() => globalStore.setProductUrl(
                    'https://www.wildberries.ru/catalog/81913315/detail.aspx?targetUrl=EX&size=135189423')}>
                Шорт
            </button>
            <button
                onClick={() => globalStore.setProductUrl(
                    'https://www.wildberries.by/catalog/147467138/detail.aspx?size=280287679')}>
              Носк
            </button>

            <button
                onClick={() => globalStore.setProductUrl(
                    '420186793')}>
                Артикул
            </button>
            <button
                onClick={() => globalStore.setProductUrl(
                    'https://global.wildberries.ru/catalog/251750676/detail.aspx')}>
                принетре
            </button>
        </div>
    );
};
