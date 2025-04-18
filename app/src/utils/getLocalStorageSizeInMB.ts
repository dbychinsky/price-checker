export const GetLocalStorageSizeInMB = (): number => {
    let totalSize = 0;
    debugger
    // Перебираем все элементы в localStorage и суммируем их размеры (ключ + значение)
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key !== null) {
            const value = localStorage.getItem(key);
            if (value !== null) {
                // Суммируем длину ключа и длину значения
                totalSize += key.length + value.length;
            }
        }
    }

    // Переводим байты в мегабайты
    return totalSize / (1024 * 1024);
};

