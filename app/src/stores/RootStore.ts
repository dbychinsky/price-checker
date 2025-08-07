import { Service } from "../service/Service.ts";
import { GlobalStore } from "./GlobalStore.ts";
import { AnalyticsStore } from './AnalyticsStore.ts';

/**
 * Корневой стор, объединяющий все стораны приложения.
 */
export class RootStore {
    /** Сервис для работы с API и локальными данными */
    service: Service;

    /** Стор для управления глобальным состоянием приложения */
    globalStore: GlobalStore;

    /** Стор для аналитики */
    analyticsStore: AnalyticsStore;

    /**
     * Конструктор создает и связывает все сторы с сервисом.
     */
    constructor() {
        /** Создание общего сервиса */
        this.service = new Service();

        /** Инициализация глобального стора с передачей сервиса */
        this.globalStore = new GlobalStore(this.service);

        /** Инициализация стора аналитики с передачей сервиса */
        this.analyticsStore = new AnalyticsStore();
    }
}

/**
 * Экземпляр корневого стора для использования в контексте приложения.
 */
export const rootStore = new RootStore();
