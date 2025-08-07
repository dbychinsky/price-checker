const express = require('express');
const app = express();
const axios = require('axios');
const cors = require('cors');

const PORT = process.env.PORT || 3000;

const API_URL_HTTPS = `https://card.wb.ru/cards`;
const API_URL_VERSION = `/v2`;
const API_URL_PARAM_ONE = `/detail`;
const API_URL_CURRENCY = `?curr=`;
const API_URL_PARAM_TWO = `&dest=-59202&nm=`;

// Подключаем CORS
app.use(cors());

// Альтернативный способ (если без cors пакета):
// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

app.get(`/`, async (req, res) => {
    const id = req.query.id;
    const currency = req.query.currency;

    // Проверка на обязательные параметры
    if (!id || !currency) {
        return res.status(400).json({ error: 'Missing "id" or "currency" query parameter.' });
    }

    const apiUrl =
        `${API_URL_HTTPS}${API_URL_VERSION}${API_URL_PARAM_ONE}${API_URL_CURRENCY}${currency}${API_URL_PARAM_TWO}${id}`;

    console.log(`[WB API REQUEST]: ${apiUrl}`);

    try {
        const response = await axios.get(apiUrl);
        const product = response.data?.data?.products?.[0];

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Отправляем полученные данные в формате JSON
        res.json(product);

        // Для искусственной задержки (отключено):
        // setTimeout(() => res.json(product), 1000);
    } catch (error) {
        console.error('Ошибка при получении данных:', error.message);
        res.status(500).json({ error: 'Ошибка при получении данных' });
    }
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
