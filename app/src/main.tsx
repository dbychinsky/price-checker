import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import { App } from "./App.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App/>
    </StrictMode>,
);

// Регистрация service worker для PWA с автообновлением
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                // Следим за обновлением service worker
                registration.onupdatefound = () => {
                    const newWorker = registration.installing;
                    if (!newWorker) return;

                    newWorker.onstatechange = () => {
                        if (newWorker.state === 'installed') {
                            // Если есть контроллер — значит это обновление
                            if (navigator.serviceWorker.controller) {
                                console.log('New content available, refreshing...');
                                window.location.reload();
                            } else {
                                console.log('Content cached for offline use.');
                            }
                        }
                    };
                };
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });
    });
}
