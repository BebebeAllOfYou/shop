/**
 * catalog.js — конфигурация источников данных каталога
 *
 * SHEETS_PRICES_URL — URL вашего Google Apps Script Web App.
 * Как получить URL:
 *   1. Откройте Google Таблицу с ценами
 *   2. Расширения → Apps Script
 *   3. Вставьте код из инструкции, нажмите «Развернуть» → «Новое развёртывание»
 *   4. Тип: «Веб-приложение», доступ: «Все»
 *   5. Скопируйте URL и вставьте сюда
 *
 * Если строка пустая — сайт будет использовать цены из локального products.json
 */
export const SHEETS_PRICES_URL = 'https://script.google.com/macros/s/AKfycbyO74ViIh7_eltUA1BIbpifq7jlSIx1BgkccLgg-JI2dd9qo--d6lA9P9-ElorRT3im/exec'

/**
 * Время жизни кэша цен в миллисекундах.
 * По умолчанию — 5 минут.
 * Изменения в таблице станут видны посетителям через это время.
 */
export const PRICES_CACHE_TTL = 5 * 60 * 1000
