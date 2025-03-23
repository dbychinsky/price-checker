const express = require('express');
const app = express();
const axios = require('axios');
const PORT = 3000;
const API_URL_HTTPS = `https://card.wb.ru/cards`;
const API_URL_VERSION = `/v2`;
const API_URL_PARAM_ONE = `/detail`;
const API_URL_CURRENCY = `?curr=`;
const API_URL_PARAM_TWO = `&dest=-59202&nm=`;

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get(`/`, async (req, res) => {
    const id = req.query.id;
    const currency = req.query.currency;
    const apiUrl =
        `${API_URL_HTTPS}${API_URL_VERSION}${API_URL_PARAM_ONE}${API_URL_CURRENCY}${currency}${API_URL_PARAM_TWO}${id}`
    console.log(apiUrl)
    try {
        // Замените URL на адрес сервера, с которого вы хотите получить данные
        const response = await axios.get(apiUrl);

        // Отправляем полученные данные в формате JSON
        res.json(response.data.data.products[0]);

        // setTimeout(() => res.json(response.data.data.products[0]), 1000)

    } catch (error) {
        console.error('Ошибка при получении данных:', error);
        res.status(500).json({error: 'Ошибка при получении данных'});
    }
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});