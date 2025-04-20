// stores/RootStore.ts
import { Service } from "../service/Service.ts";  // Импортируем сервис
import { GlobalStore } from "./GlobalStore.ts";    // Импортируем GlobalStore

export class RootStore {
    service: Service;         // Экземпляр сервиса
    globalStore: GlobalStore; // Экземпляр глобального стора

    // Конструктор инициализирует сервис и глобальный стор
    constructor() {
        this.service = new Service();  // Создаём сервис
        this.globalStore = new GlobalStore(this.service);  // Создаём глобальный стор и передаём в него сервис
    }
}

// Экспортируем инстанс RootStore для использования в контексте
export const rootStore = new RootStore();
