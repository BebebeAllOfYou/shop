/**
 * telegram.js — настройки Telegram-бота для приёма заявок
 *
 * Как получить данные:
 *
 * 1. BOT_TOKEN:
 *    - Напишите @BotFather в Telegram
 *    - Отправьте /newbot, задайте имя
 *    - Скопируйте токен вида: 7123456789:AAGxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 *
 * 2. CHAT_ID:
 *    - Напишите вашему боту любое сообщение
 *    - Откройте в браузере: https://api.telegram.org/bot{ВАШ_ТОКЕН}/getUpdates
 *    - Найдите "chat":{"id": ЧИСЛО} — это и есть ваш CHAT_ID
 *
 * После заполнения пересоберите проект: npm run build
 */

export const TELEGRAM_BOT_TOKEN = ''   // ← вставьте токен бота
export const TELEGRAM_CHAT_ID   = ''   // ← вставьте chat_id менеджера
