// stores/StoreContext.ts
import { createContext, useContext } from "react";  // Импортируем контекст и хук
import { RootStore, rootStore } from "./RootStore.ts";  // Импортируем RootStore и инстанс rootStore

// Создаём контекст, который будет хранить RootStore
export const StoreContext = createContext<RootStore>(rootStore);

// Хук для удобного доступа к хранилищу
export const useStore = () => useContext(StoreContext);
