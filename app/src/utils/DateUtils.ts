// DateUtils.js
class DateUtils {
    // Сравнение: равны ли даты (без учета времени)
    static isSameDate(date1: Date, date2: Date): boolean {
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
        );
    }

    // Является ли date1 раньше date2
    static isBefore(date1: Date, date2: Date): boolean {
        return date1.getTime() < date2.getTime();
    }

    // Является ли date1 позже date2
    static isAfter(date1: Date, date2: Date): boolean {
        return date1.getTime() > date2.getTime();
    }

    // Преобразование даты в строку (формат YYYY-MM-DD)
    static formatToISO(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // форматирует дату в строку с временем в формате YYYY-MM-DD HH:mm:ss:
    static formatToISOWithTime(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }


    // Преобразование в человекочитаемый формат (например, 22 апреля 2025)
    static formatReadable(date: Date): string {
        return date.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }

    // Преобразовать строку в Date
    static parse(dateStr: string): Date {
        return new Date(dateStr);
    }
}

export default DateUtils;
